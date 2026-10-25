"""이미지 읽기·쓰기. 한글 경로, 16비트 TIFF, 흑백/컬러를 모두 BGR 8비트로 맞춘다."""
from __future__ import annotations

import base64
from pathlib import Path

import cv2
import numpy as np

IMAGE_EXTS = {".png", ".jpg", ".jpeg", ".tif", ".tiff", ".bmp"}


def to_bgr8(img: np.ndarray) -> np.ndarray:
    """어떤 형식이든 3채널 8비트 BGR 로 바꾼다."""
    if img is None:
        raise ValueError("빈 이미지")
    if img.dtype != np.uint8:
        a = img.astype(np.float64)
        lo, hi = np.percentile(a, 0.5), np.percentile(a, 99.5)
        a = np.clip((a - lo) / max(hi - lo, 1e-9), 0, 1)
        img = (a * 255).astype(np.uint8)
    if img.ndim == 2:
        img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
    elif img.shape[2] == 4:
        img = cv2.cvtColor(img, cv2.COLOR_BGRA2BGR)
    return img


def imread_any(path) -> np.ndarray:
    """한글 경로도 읽는 imread (BGR 8비트로 반환)."""
    data = np.fromfile(str(path), dtype=np.uint8)
    img = cv2.imdecode(data, cv2.IMREAD_UNCHANGED)
    if img is None:
        raise IOError(f"이미지를 읽을 수 없습니다: {path}")
    return to_bgr8(img)


def imdecode_bytes(buf: bytes) -> np.ndarray:
    img = cv2.imdecode(np.frombuffer(buf, np.uint8), cv2.IMREAD_UNCHANGED)
    if img is None:
        raise IOError("이미지 형식을 읽을 수 없습니다 (jpg, png, tif, bmp 지원)")
    return to_bgr8(img)


def imwrite_any(path, img, quality: int = 90) -> None:
    path = Path(path)
    ext = path.suffix.lower()
    params = []
    if ext in (".jpg", ".jpeg"):
        params = [cv2.IMWRITE_JPEG_QUALITY, quality]
    elif ext == ".webp":
        params = [cv2.IMWRITE_WEBP_QUALITY, quality]
    ok, buf = cv2.imencode(ext, img, params)
    if not ok:
        raise IOError(f"저장 실패: {path}")
    buf.tofile(str(path))


def data_url(img, fmt: str = "png", quality: int = 88) -> str:
    """HTML/JSON 에 바로 넣을 수 있는 data URL."""
    ext = "." + fmt
    params = []
    if fmt in ("jpg", "jpeg"):
        params = [cv2.IMWRITE_JPEG_QUALITY, quality]
        mime = "image/jpeg"
    elif fmt == "webp":
        params = [cv2.IMWRITE_WEBP_QUALITY, quality]
        mime = "image/webp"
    else:
        mime = "image/png"
    ok, buf = cv2.imencode(ext, img, params)
    if not ok:
        raise IOError("인코딩 실패")
    return f"data:{mime};base64," + base64.b64encode(buf.tobytes()).decode("ascii")


def list_images(folder) -> list[Path]:
    folder = Path(folder)
    skip = ("_clahe", "_seg", "_masks", "_flows", "_overlay")
    out = []
    for p in sorted(folder.iterdir()):
        if p.is_file() and p.suffix.lower() in IMAGE_EXTS and not any(s in p.stem.lower() for s in skip):
            out.append(p)
    return out
