"""홈페이지용 결과(JSON). 웹 화면이 그대로 읽어 그릴 수 있게 숫자·그래프 자료·그림을 담는다.

형식: schema = "ddmd-grain/1" (README_web.md 에 항목 설명)
"""
from __future__ import annotations

import datetime as _dt

import cv2

from . import render as R
from . import stats as st
from .imgio import data_url


def _r(v, n=2):
    return None if v is None or v != v else round(float(v), n)


def overlay_images(a, max_w: int = 960) -> dict:
    """웹에 보낼 그림 2장 (경계선, 결정립 색칠)."""
    bnd = R.boundary_overlay(a.gray, a.masks, thick=2)
    lab = R.color_labels(a.masks, a.gray)
    H, W = a.gray.shape
    if W > max_w:
        size = (max_w, round(H * max_w / W))
        bnd = cv2.resize(bnd, size, interpolation=cv2.INTER_AREA)
        lab = cv2.resize(lab, size, interpolation=cv2.INTER_AREA)
    return {"boundaries": bnd, "labels": lab}


def to_web_json(a, images: str = "inline", image_names: dict | None = None) -> dict:
    """images: inline(data URL 로 넣음) | files(image_names 의 파일 이름을 넣음) | none"""
    J, Hy, D, sc = a.jeff, a.heyn, a.dist_interior, a.scale
    H, W = a.masks.shape
    out = {
        "schema": "ddmd-grain/1",
        "file": a.name,
        "measured_at": _dt.datetime.now().astimezone().isoformat(timespec="seconds"),
        "engine": {
            "name": a.seg["engine"], "label": a.seg["engine_ko"], "model": str(a.seg["model"]),
            "device": a.seg["device"], "diameter_px": a.seg["diameter_px"], "seconds": a.seconds,
        },
        "scale": {
            "um_per_px": _r(sc.um_per_px, 5), "method": sc.method, "source": sc.source,
            "scalebar_um": sc.scalebar_um, "scalebar_px": sc.scalebar_px, "bar_found": sc.bar_found,
        },
        "image": {"width": W, "height": H, "fov_um": [_r(J["fov_um"][0], 1), _r(J["fov_um"][1], 1)],
                  "area_mm2": _r(J["area_mm2"], 5), "resized": _r(a.resized, 3)},
        "astm": {
            "G_jeffries": _r(J["G"]), "G_heyn": _r(Hy["G"]), "G_uncorrected": _r(J["G_uncorrected"]),
            "NA_per_mm2": _r(J["NA_per_mm2"], 1), "mean_area_um2": _r(J["mean_area_um2"], 1),
            "mean_intercept_um": _r(Hy["mean_intercept_um"]), "intercepts": Hy["total_P"],
            "test_line_um": _r(Hy["total_length_um"], 1), "grade": st.grade_word(J["G"]),
        },
        "counts": {"total": J["n_total"], "interior": J["n_interior"], "edge": J["n_edge"],
                   "corner": J["n_corner"], "effective": _r(J["n_effective"], 2)},
        "ecd_um": {k: _r(D.get(k)) for k in ("mean", "median", "std", "min", "max", "d10", "d50", "d90", "d90_d50")},
        "histogram": {"edges": [_r(x) for x in D.get("hist_edges", [])], "counts": D.get("hist_counts", [])},
        "cumulative": [_r(x) for x in D.get("sorted", [])],
        "notes": a.notes,
    }
    out["ecd_um"]["n"] = D.get("n", 0)
    if images == "inline" and J["n_total"]:
        ims = overlay_images(a)
        out["images"] = {k: data_url(v, "jpg", 84) for k, v in ims.items()}
    elif images == "files" and image_names:
        out["images"] = image_names
    return out
