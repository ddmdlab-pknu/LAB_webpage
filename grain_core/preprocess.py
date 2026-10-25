"""전처리: 스케일바·글자 지우기(inpaint) → 흑백 → CLAHE(대비 고르게)."""
from __future__ import annotations

import cv2
import numpy as np


def scalebar_mask(shape, bar_box, pad: int = 8) -> np.ndarray:
    """스케일바와 그 위 숫자(예: 100 μm) 영역을 덮는 마스크."""
    H, W = shape[:2]
    y1, y2, x1, x2 = bar_box
    text_h = max(4 * (y2 - y1), int(0.07 * H))
    m = np.zeros((H, W), np.uint8)
    m[max(0, y1 - text_h - pad):min(H, y2 + pad), max(0, x1 - pad):min(W, x2 + pad)] = 255
    return m


def remove_scalebar(img_bgr: np.ndarray, bar_box, pad: int = 8):
    if bar_box is None:
        return img_bgr.copy(), None
    m = scalebar_mask(img_bgr.shape, bar_box, pad)
    return cv2.inpaint(img_bgr, m, 3, cv2.INPAINT_TELEA), m


def to_gray(img_bgr: np.ndarray) -> np.ndarray:
    return cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)


def apply_clahe(gray: np.ndarray, clip: float = 2.0, grid: int = 8) -> np.ndarray:
    return cv2.createCLAHE(clipLimit=clip, tileGridSize=(grid, grid)).apply(gray)


def limit_size(img_bgr: np.ndarray, max_side: int):
    """너무 큰 이미지는 줄인다. (줄인 이미지, 배율) — 스케일은 호출한 쪽에서 배율만큼 고친다."""
    H, W = img_bgr.shape[:2]
    s = max(H, W)
    if not max_side or s <= max_side:
        return img_bgr, 1.0
    f = max_side / s
    return cv2.resize(img_bgr, (round(W * f), round(H * f)), interpolation=cv2.INTER_AREA), f
