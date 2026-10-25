"""이미지 한 장 → 측정 결과(Analysis). 학생용·홈페이지용이 모두 이 함수를 쓴다."""
from __future__ import annotations

import json
import time
from dataclasses import dataclass, field
from pathlib import Path

import numpy as np

from . import preprocess as pp
from . import stats as st
from .imgio import imread_any
from .scale import ScaleError, ScaleInfo, resolve_scale  # noqa: F401

ROOT = Path(__file__).resolve().parent.parent  # ddmd_grain 폴더


def load_config(path=None) -> dict:
    path = Path(path) if path else ROOT / "config.json"
    with open(path, encoding="utf-8") as f:
        return json.load(f)


@dataclass
class Analysis:
    name: str
    image: np.ndarray            # 원본 (BGR)
    cleaned: np.ndarray          # 스케일바 지운 이미지 (BGR)
    gray: np.ndarray             # 흑백
    clahe: np.ndarray            # CLAHE
    inpaint_mask: object
    scale: ScaleInfo
    resized: float
    masks: np.ndarray
    seg: dict
    grains: list
    jeff: dict
    heyn: dict
    dist_interior: dict
    dist_all: dict
    notes: list = field(default_factory=list)
    seconds: float = 0.0

    @property
    def interior(self):
        return [g for g in self.grains if g["class"] == "interior"]


def analyze(src, engine, cfg: dict, name: str | None = None, scalebar_um=None, scalebar_px=None,
            bar_box=None, um_per_px=None, diameter=None, max_side: int | None = None,
            engine_note=None) -> Analysis:
    """src: 파일 경로 또는 BGR 배열.

    스케일바 값(scalebar_um)이 없으면 ScaleError 를 낸다 (scale.resolve_scale 참고).
    """
    t0 = time.time()
    if isinstance(src, (str, Path)):
        img = imread_any(src)
        name = name or Path(src).name
    else:
        img = src
        name = name or "image"

    # 스케일은 원본 크기에서 정하고, 줄이면 그만큼 고친다
    scale = resolve_scale(img, name, scalebar_um=scalebar_um, scalebar_px=scalebar_px, bar_box=bar_box,
                          um_per_px=um_per_px)
    cleaned, inpaint_mask = pp.remove_scalebar(img, scale.bar_box, cfg["preprocess"]["scalebar_pad"])
    cleaned, f = pp.limit_size(cleaned, max_side or cfg["preprocess"].get("max_side"))
    if f != 1.0:
        img = pp.limit_size(img, max_side or cfg["preprocess"].get("max_side"))[0]
        if inpaint_mask is not None:
            inpaint_mask = pp.limit_size(np.dstack([inpaint_mask] * 3), max_side or cfg["preprocess"].get("max_side"))[0][..., 0]
        scale.um_per_px /= f
        if scale.bar_box:
            scale.bar_box = tuple(int(round(v * f)) for v in scale.bar_box)
        scale.warnings.append(f"이미지가 커서 {f:.2f}배로 줄여 측정했습니다 (스케일도 함께 고침).")

    gray = pp.to_gray(cleaned)
    clahe = pp.apply_clahe(gray, cfg["preprocess"]["clahe_clip"], cfg["preprocess"]["clahe_grid"])

    masks, seg = engine.segment(gray, clahe, scale.um_per_px, diameter=diameter)

    # 너무 작은 조각(잡음)은 결정립으로 세지 않는다
    min_px = int(cfg["stats"].get("min_grain_px", 30))
    if masks.max():
        areas = np.bincount(masks.ravel())
        drop = np.flatnonzero(areas < min_px)
        drop = drop[drop > 0]
        if drop.size:
            masks = masks.copy()
            masks[np.isin(masks, drop)] = 0
        from skimage.segmentation import relabel_sequential
        masks = relabel_sequential(masks)[0].astype(np.int32)

    grains = st.grain_table(masks, scale.um_per_px)
    jeff = st.jeffries(grains, masks.shape, scale.um_per_px)
    hey = st.heyn(masks, scale.um_per_px, cfg["stats"].get("heyn_lines", 8))
    interior = [g["ecd_um"] for g in grains if g["class"] == "interior"]
    dist_i = st.distribution(interior, bins=cfg["stats"].get("hist_bins", 20))
    dist_a = st.distribution([g["ecd_um"] for g in grains], bins=cfg["stats"].get("hist_bins", 20))

    notes = st.interpret(jeff, hey, dist_i, scale.method)
    notes.insert(0, {"level": "info", "text": f"스케일: {scale.source} → 1 px = {scale.um_per_px:.4f} μm"})
    for w in scale.warnings:
        notes.insert(0, {"level": "warn", "text": w})
    if engine_note:
        notes.insert(0, {"level": "warn", "text": engine_note})
    if not grains:
        notes.insert(0, {"level": "warn", "text": "결정립을 찾지 못했습니다. 사진의 초점·대비나 diameter 값을 확인해 주세요."})

    return Analysis(name, img, cleaned, gray, clahe, inpaint_mask, scale, f, masks, seg, grains, jeff, hey,
                    dist_i, dist_a, notes, round(time.time() - t0, 1))


def _r(v, n=2):
    return None if v is None or v != v else round(float(v), n)


def summary_row(a: Analysis) -> dict:
    """표 한 줄 요약 (CSV·JSON 공통)."""
    d = a.dist_interior
    return {
        "file": a.name,
        "engine": a.seg["engine"],
        "um_per_px": _r(a.scale.um_per_px, 5),
        "scale_source": a.scale.method,
        "width_px": int(a.masks.shape[1]), "height_px": int(a.masks.shape[0]),
        "area_mm2": _r(a.jeff["area_mm2"], 5),
        "n_total": a.jeff["n_total"], "n_interior": a.jeff["n_interior"],
        "n_edge": a.jeff["n_edge"], "n_corner": a.jeff["n_corner"],
        "n_effective": _r(a.jeff["n_effective"], 2),
        "NA_per_mm2": _r(a.jeff["NA_per_mm2"], 1),
        "G_jeffries": _r(a.jeff["G"]), "G_heyn": _r(a.heyn["G"]),
        "mean_intercept_um": _r(a.heyn["mean_intercept_um"]),
        "mean_ecd_um": _r(d.get("mean")), "median_ecd_um": _r(d.get("median")), "std_ecd_um": _r(d.get("std")),
        "d10_um": _r(d.get("d10")), "d50_um": _r(d.get("d50")), "d90_um": _r(d.get("d90")),
        "d90_d50": _r(d.get("d90_d50")),
        "grade": st.grade_word(a.jeff["G"]),
        "seconds": a.seconds,
    }
