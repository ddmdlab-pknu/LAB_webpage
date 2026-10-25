"""스케일(1 픽셀이 몇 μm 인지) 정하기.

사진 속 스케일바(파란 선 우선)의 길이를 픽셀로 재고, 그 막대가 몇 μm 인지는 사람이 입력한다.

    1 px 의 길이(μm) = 입력한 막대 값(μm) ÷ 찾은 막대 길이(px)

막대 값(μm)은 기본값으로 가정하지 않는다. 값이 없으면 분석하지 않는다 (ScaleError).
  · 막대 값(μm) : 웹 입력칸 / 명령줄 --scalebar-um / scale.csv / 파일 이름(_sb100um)
  · 막대 길이(px): 자동 인식 (파랑 > 빨강 > 검정 > 흰색). 못 찾거나 틀리면 사람이 표시한 값(scalebar_px)
  · 사진에 스케일바가 아예 없을 때만 1 px 길이(um_per_px)를 직접 준다.
"""
from __future__ import annotations

import re
from dataclasses import asdict, dataclass, field
from typing import Optional

import cv2
import numpy as np


class ScaleError(ValueError):
    """스케일을 정할 수 없어 분석하지 않는다 (사람이 고칠 수 있는 문제)."""


@dataclass
class ScaleInfo:
    um_per_px: float
    source: str                      # 사람이 읽는 설명
    method: str                      # scalebar | input
    scalebar_um: Optional[float] = None
    scalebar_px: Optional[float] = None
    bar_box: Optional[tuple] = None  # (y1, y2, x1, x2) 지울 영역
    bar_color: Optional[str] = None
    bar_found: Optional[str] = None  # auto | manual
    warnings: list = field(default_factory=list)

    @property
    def px_per_um(self) -> float:
        return 1.0 / self.um_per_px

    def as_dict(self) -> dict:
        d = asdict(self)
        d["px_per_um"] = round(self.px_per_um, 5)
        return d


COLOR_KO = {"blue": "파란", "red": "빨간", "black": "검은", "white": "흰"}


def _best_bar(mask: np.ndarray, min_len: int, max_h: int):
    """마스크에서 가장 긴 '가로로 긴 막대' 연결성분. (y1, y2, x1, x2, 길이px) 또는 None.

    막대 양 끝에 세로 눈금(|———|)이 있어도 되도록, 채움률 대신 '가장 꽉 찬 가로줄'이
    막대 폭의 90% 이상인지도 본다. 휘어진 결정립계 조각은 둘 다 통과하지 못한다.
    """
    n, labels, stats, _ = cv2.connectedComponentsWithStats(mask.astype(np.uint8), connectivity=8)
    best = None
    for i in range(1, n):
        x, y, w, h, area = (int(v) for v in stats[i])
        if w < min_len or h > max_h or w < 4 * h:
            continue
        fill = area / float(w * h)
        if fill < 0.75:
            rows = (labels[y:y + h, x:x + w] == i).sum(1)
            if rows.max() < 0.9 * w:
                continue
        if best is None or w > best[4]:
            best = (y, y + h, x, x + w, w)
    return best


def detect_scalebar(img_bgr: np.ndarray) -> Optional[dict]:
    """스케일바를 찾는다. {'box': (y1, y2, x1, x2), 'length_px': int, 'color': str} 또는 None.

    파란 선은 사진 어디에 있어도 찾는다 (현미경 조직 사진에 파란색은 거의 없다).
    빨강·검정·흰색은 결정립계·글자와 헷갈리기 쉬워 사진 아래 25% 에서만 찾는다.
    """
    H, W = img_bgr.shape[:2]
    if img_bgr.ndim == 2:
        img_bgr = cv2.cvtColor(img_bgr, cv2.COLOR_GRAY2BGR)
    min_len = max(12, int(0.02 * W))
    max_h = max(40, int(0.04 * H))
    hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)
    y0 = int(H * 0.75)

    def bottom(m):
        out = np.zeros(m.shape, bool)
        out[y0:] = m[y0:]
        return out

    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    # 결정립계를 손으로 그린 선이 스케일바를 가로질러 끊어 놓아도 한 막대로 잇는다 (가로로만 메움)
    k = max(9, int(0.02 * W)) | 1
    blue = cv2.morphologyEx(cv2.inRange(hsv, (95, 90, 70), (135, 255, 255)), cv2.MORPH_CLOSE,
                            np.ones((1, k), np.uint8))
    cands = (
        ("blue", blue > 0),
        ("red", bottom((cv2.inRange(hsv, (0, 120, 80), (10, 255, 255)) | cv2.inRange(hsv, (170, 120, 80), (180, 255, 255))) > 0)),
        ("black", bottom(gray < 40)),
        ("white", bottom(gray > 240)),
    )
    for color, mask in cands:
        res = _best_bar(mask, min_len, max_h)
        if res:
            y1, y2, x1, x2, length = res
            return {"box": (y1, y2, x1, x2), "length_px": int(length), "color": color}
    return None


SB_RE = re.compile(r"(?:sb|bar)[_\-]?(\d+(?:\.\d+)?)\s*(?:um|µm|μm)", re.I)


def _pos(v) -> Optional[float]:
    if v is None or v == "":
        return None
    v = float(v)
    return v if v > 0 else None


def resolve_scale(img_bgr: np.ndarray, filename: str = "", scalebar_um=None, scalebar_px=None,
                  bar_box=None, um_per_px=None) -> ScaleInfo:
    """스케일을 정한다. 정할 수 없으면 ScaleError.

    scalebar_um : 스케일바가 나타내는 길이(μm). 사람이 입력한다 (없으면 파일 이름 _sb100um).
    scalebar_px : 스케일바 길이(px)를 사람이 잰 값. 없으면 자동 인식한다.
    bar_box     : 지울 스케일바 영역 (y1, y2, x1, x2). 없으면 자동 인식한 영역.
    um_per_px   : 스케일바가 없는 사진에서만, 1 px 길이(μm)를 직접 준다.
    """
    scalebar_um, scalebar_px, um_per_px = _pos(scalebar_um), _pos(scalebar_px), _pos(um_per_px)
    found = detect_scalebar(img_bgr)
    box = tuple(int(v) for v in bar_box) if bar_box else (found["box"] if found else None)

    if um_per_px and not scalebar_um:
        return ScaleInfo(um_per_px, f"1 px 길이를 직접 입력 ({um_per_px:g} μm/px)", "input", bar_box=box)

    if scalebar_px:
        px, how_px, color, kind = scalebar_px, "직접 표시한 스케일바", None, "manual"
    elif found:
        px, color, kind = float(found["length_px"]), found["color"], "auto"
        how_px = f"{COLOR_KO.get(color, '')} 스케일바 자동 인식".strip()
    else:
        raise ScaleError("사진에서 스케일바(파란 선)를 찾지 못했습니다. 스케일바 양 끝을 표시하거나 길이(px)를 알려 주세요.")
    if px < 5:
        raise ScaleError(f"스케일바 길이가 {px:g} px 로 너무 짧습니다. 다시 표시해 주세요.")

    how_um = "입력값"
    if not scalebar_um:
        m = SB_RE.search(filename or "")
        if m:
            scalebar_um, how_um = float(m.group(1)), "파일 이름"
    if not scalebar_um:
        raise ScaleError("스케일바 값(μm)을 입력해야 분석할 수 있습니다. 사진 속 스케일바 옆 숫자(예: 100 μm)를 넣어 주세요.")

    return ScaleInfo(scalebar_um / px, f"{how_px}: {px:g} px = {scalebar_um:g} μm ({how_um})", "scalebar",
                     scalebar_um, round(px, 1), box, color, kind)
