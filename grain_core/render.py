"""결과 그림: 결정립 색칠, 경계선, Jeffries 분류, Heyn 시험선, 스케일바 표시."""
from __future__ import annotations

import cv2
import numpy as np
from skimage.segmentation import find_boundaries

# BGR
RED = (40, 40, 220)
CLS_COLOR = {"interior": (91, 158, 46), "edge": (46, 150, 232), "corner": (122, 69, 208)}


def _gray3(gray):
    return cv2.cvtColor(gray, cv2.COLOR_GRAY2BGR)


def palette(n: int, seed: int = 7) -> np.ndarray:
    if n <= 0:
        return np.array([[30, 30, 30]], np.uint8)
    rng = np.random.default_rng(seed)
    hsv = np.stack([rng.uniform(0, 180, n), rng.uniform(70, 150, n), rng.uniform(200, 255, n)], 1).astype(np.uint8)
    cols = cv2.cvtColor(hsv[None], cv2.COLOR_HSV2BGR)[0]
    return np.vstack([[30, 30, 30], cols])


def color_labels(masks: np.ndarray, gray=None, alpha: float = 0.75, ids: bool = False) -> np.ndarray:
    pal = palette(int(masks.max()))
    col = pal[masks].astype(np.float32)
    if gray is not None:
        base = _gray3(gray).astype(np.float32)
        col = np.where(masks[..., None] > 0, alpha * col + (1 - alpha) * base, base)
    out = col.astype(np.uint8)
    out[find_boundaries(masks, mode="inner")] = (25, 25, 25)
    if ids:
        _put_ids(out, masks)
    return out


def _put_ids(img, masks):
    from skimage.measure import regionprops
    H, W = masks.shape
    fs = max(0.3, min(0.55, W / 1400))
    for p in regionprops(masks):
        if p.area < 250:
            continue
        y, x = map(int, p.centroid)
        t = str(p.label)
        (tw, th), _ = cv2.getTextSize(t, cv2.FONT_HERSHEY_SIMPLEX, fs, 1)
        org = (max(0, x - tw // 2), min(H - 2, y + th // 2))
        cv2.putText(img, t, org, cv2.FONT_HERSHEY_SIMPLEX, fs, (255, 255, 255), 3, cv2.LINE_AA)
        cv2.putText(img, t, org, cv2.FONT_HERSHEY_SIMPLEX, fs, (20, 20, 20), 1, cv2.LINE_AA)


def boundary_overlay(gray, masks, color=RED, thick: int = 1) -> np.ndarray:
    out = _gray3(gray)
    b = find_boundaries(masks, mode="inner")
    if thick > 1:
        b = cv2.dilate(b.astype(np.uint8), np.ones((thick, thick), np.uint8)) > 0
    out[b] = color
    return out


def class_overlay(gray, masks, grains) -> np.ndarray:
    """Jeffries 분류: 내부(초록) · 가장자리(주황) · 모서리(보라)."""
    base = _gray3(gray).astype(np.float32)
    lut = np.zeros((int(masks.max()) + 1, 3), np.float32)
    has = np.zeros(int(masks.max()) + 1, bool)
    for g in grains:
        lut[g["id"]] = CLS_COLOR[g["class"]]
        has[g["id"]] = True
    tint = lut[masks]
    m = has[masks][..., None]
    out = np.where(m, 0.45 * tint + 0.55 * base, base).astype(np.uint8)
    out[find_boundaries(masks, mode="inner")] = (30, 30, 30)
    return out


def heyn_overlay(gray, masks, hey) -> np.ndarray:
    out = _gray3(gray)
    out = (0.8 * out + 0.2 * 255).astype(np.uint8)
    out[find_boundaries(masks, mode="inner")] = (90, 90, 90)
    H, W = masks.shape
    for ln in hey["lines"]:
        if ln["dir"] == "h":
            cv2.line(out, (0, ln["pos"]), (W - 1, ln["pos"]), (201, 163, 26), 1, cv2.LINE_AA)
        else:
            cv2.line(out, (ln["pos"], 0), (ln["pos"], H - 1), (201, 163, 26), 1, cv2.LINE_AA)
    r = max(2, W // 260)
    for ln in hey["lines"]:
        for (x, y) in ln["points"]:
            cv2.circle(out, (x, y), r + 1, (255, 255, 255), -1, cv2.LINE_AA)
            cv2.circle(out, (x, y), r, RED, -1, cv2.LINE_AA)
    return out


def scalebar_overlay(img_bgr, scale, inpaint_mask=None) -> np.ndarray:
    out = img_bgr.copy()
    if inpaint_mask is not None:
        ys, xs = np.nonzero(inpaint_mask)
        if ys.size:
            cv2.rectangle(out, (int(xs.min()), int(ys.min())), (int(xs.max()), int(ys.max())), (0, 200, 255), 1)
    if scale.bar_box:
        y1, y2, x1, x2 = scale.bar_box
        cv2.rectangle(out, (x1 - 2, y1 - 2), (x2 + 1, y2 + 1), (0, 220, 0), 2)
    return out


def side_by_side(a, b, gap: int = 6) -> np.ndarray:
    h = max(a.shape[0], b.shape[0])
    pad = np.full((h, gap, 3), 255, np.uint8)
    return np.hstack([a, pad, b])
