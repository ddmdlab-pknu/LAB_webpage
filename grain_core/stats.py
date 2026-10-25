"""결정립 통계와 ASTM E112 결정립도(G).

Jeffries (면적법, planimetric):  N_A = (N_내부 + 0.5·N_가장자리 + 0.25·N_모서리) / A[mm²]
                                 G   = 3.321928·log10(N_A) − 2.954
Heyn (선형 절편법, intercept):   ℓ   = 시험선 총 길이 / 결정립계 교차 수   [mm]
                                 G   = −6.643856·log10(ℓ) − 3.288
(ASTM E112-13 식)
"""
from __future__ import annotations

import math

import numpy as np
from skimage.measure import regionprops

G_JEFF = (3.321928, -2.954)
G_HEYN = (-6.643856, -3.288)


def g_from_na(na_per_mm2: float) -> float:
    return G_JEFF[0] * math.log10(na_per_mm2) + G_JEFF[1] if na_per_mm2 > 0 else float("nan")


def g_from_intercept(l_mm: float) -> float:
    return G_HEYN[0] * math.log10(l_mm) + G_HEYN[1] if l_mm > 0 else float("nan")


def grain_table(masks: np.ndarray, um_per_px: float) -> list[dict]:
    """결정립 하나하나의 크기·위치·가장자리 여부."""
    H, W = masks.shape
    rows = []
    for p in regionprops(masks):
        r0, c0, r1, c1 = p.bbox
        touches = int(r0 == 0) + int(c0 == 0) + int(r1 == H) + int(c1 == W)
        cls = "interior" if touches == 0 else ("edge" if touches == 1 else "corner")
        area_um2 = p.area * um_per_px ** 2
        maj, mnr = p.axis_major_length, max(p.axis_minor_length, 1e-6)
        rows.append({
            "id": int(p.label),
            "class": cls,
            "area_px": int(p.area),
            "area_um2": area_um2,
            "ecd_um": 2.0 * math.sqrt(area_um2 / math.pi),
            "perimeter_um": p.perimeter * um_per_px,
            "aspect_ratio": maj / mnr,
            "circularity": 4 * math.pi * p.area / max(p.perimeter, 1e-6) ** 2,
            "cy": float(p.centroid[0]),
            "cx": float(p.centroid[1]),
        })
    return rows


def jeffries(grains: list[dict], shape, um_per_px: float) -> dict:
    H, W = shape
    n_in = sum(g["class"] == "interior" for g in grains)
    n_ed = sum(g["class"] == "edge" for g in grains)
    n_co = sum(g["class"] == "corner" for g in grains)
    n_eff = n_in + 0.5 * n_ed + 0.25 * n_co
    area_mm2 = H * W * um_per_px ** 2 / 1e6
    na = n_eff / area_mm2 if area_mm2 else float("nan")
    na_all = len(grains) / area_mm2 if area_mm2 else float("nan")
    return {
        "n_total": len(grains), "n_interior": n_in, "n_edge": n_ed, "n_corner": n_co,
        "n_effective": n_eff, "area_mm2": area_mm2, "fov_um": (W * um_per_px, H * um_per_px),
        "NA_per_mm2": na, "G": g_from_na(na) if n_eff else float("nan"),
        "mean_area_um2": (area_mm2 * 1e6 / n_eff) if n_eff else float("nan"),
        # 보정 없이 모두 1개로 셀 때 (교육용 비교)
        "NA_all_per_mm2": na_all, "G_uncorrected": g_from_na(na_all) if grains else float("nan"),
    }


def _crossings(seq: np.ndarray):
    """선 위 라벨 열에서 결정립이 바뀌는 자리(교차점) 위치들. 0(경계/미검출)은 건너뛴다."""
    idx = np.flatnonzero(seq > 0)
    if idx.size < 2:
        return []
    vals = seq[idx]
    ch = np.flatnonzero(vals[1:] != vals[:-1])
    return [int((idx[i] + idx[i + 1]) // 2) for i in ch]


def heyn(masks: np.ndarray, um_per_px: float, n_lines: int = 8) -> dict:
    H, W = masks.shape
    lines = []
    for y in np.linspace(H * 0.1, H * 0.9, n_lines).astype(int):
        pts = _crossings(masks[y, :])
        lines.append({"dir": "h", "pos": int(y), "length_um": W * um_per_px, "P": len(pts),
                      "points": [(int(x), int(y)) for x in pts]})
    for x in np.linspace(W * 0.1, W * 0.9, n_lines).astype(int):
        pts = _crossings(masks[:, x])
        lines.append({"dir": "v", "pos": int(x), "length_um": H * um_per_px, "P": len(pts),
                      "points": [(int(x), int(y)) for y in pts]})
    L = sum(l["length_um"] for l in lines)
    P = sum(l["P"] for l in lines)
    l_um = L / P if P else float("nan")
    return {"lines": lines, "n_lines": len(lines), "total_length_um": L, "total_P": P,
            "mean_intercept_um": l_um, "G": g_from_intercept(l_um / 1000) if P else float("nan")}


def distribution(values, bins: int = 20) -> dict:
    v = np.asarray(values, float)
    if v.size == 0:
        return {"n": 0}
    bins = int(max(6, min(bins, round(2 * v.size ** 0.5))))  # 결정립이 적으면 막대 수를 줄인다
    lo, hi = 0.0, float(v.max()) * 1.05
    counts, edges = np.histogram(v, bins=bins, range=(lo, hi))
    d10, d50, d90 = np.percentile(v, [10, 50, 90])
    return {
        "n": int(v.size), "mean": float(v.mean()), "median": float(np.median(v)),
        "std": float(v.std(ddof=1)) if v.size > 1 else 0.0,
        "min": float(v.min()), "max": float(v.max()),
        "d10": float(d10), "d50": float(d50), "d90": float(d90),
        "d90_d50": float(d90 / d50) if d50 else float("nan"),
        "hist_counts": counts.tolist(), "hist_edges": edges.tolist(),
        "sorted": np.sort(v).tolist(),
    }


# ASTM E112 표 (G 별 결정립 밀도·평균 면적·평균 지름·평균 절편)
GRADE_WORDS = [
    (1.0, "매우 조대립"), (3.0, "조대립"), (4.0, "다소 조대"), (7.0, "중간"),
    (8.0, "미세립"), (9.0, "매우 미세립"), (99, "극미세립"),
]


def grade_word(G: float) -> str:
    if G != G:
        return "-"
    for lim, w in GRADE_WORDS:
        if G <= lim:
            return w
    return GRADE_WORDS[-1][1]


def astm_table(gmin: int = 0, gmax: int = 12) -> list[dict]:
    rows = []
    for G in range(gmin, gmax + 1):
        na = 2 ** (G - 1) * 15.50                  # grains/mm² (1배)
        area = 1e6 / na                            # μm²
        rows.append({
            "G": G, "NA_per_mm2": na, "mean_area_um2": area,
            "ecd_um": 2 * math.sqrt(area / math.pi),
            "intercept_um": 1000 * 10 ** ((G - G_HEYN[1]) / G_HEYN[0]),
            "word": grade_word(G),
        })
    return rows


def interpret(jeff: dict, hey: dict, dist: dict, scale_method: str) -> list[dict]:
    """학생용 해석 문장. level: ok | info | warn"""
    out = []
    G1, G2 = jeff.get("G"), hey.get("G")
    if G1 == G1 and G2 == G2:
        d = abs(G1 - G2)
        if d <= 0.5:
            out.append({"level": "ok", "text": f"두 방법의 G 차이가 {d:.2f} 로 0.5 이내입니다. 결정립 크기가 비교적 고릅니다."})
        else:
            out.append({"level": "info", "text": f"두 방법의 G 차이가 {d:.2f} 입니다. Jeffries 는 개수, Heyn 은 길이(큰 결정립 쪽 가중)를 보므로 크기 분포가 넓으면 차이가 커집니다."})
    r = dist.get("d90_d50")
    if r == r and r is not None:
        if r >= 3:
            out.append({"level": "warn", "text": f"D90/D50 = {r:.2f}. 큰 결정립 몇 개가 유난히 큽니다. 이상(비정상) 입자 성장을 의심해 볼 만합니다."})
        elif r >= 2:
            out.append({"level": "info", "text": f"D90/D50 = {r:.2f}. 크기 분포가 다소 넓습니다."})
        else:
            out.append({"level": "ok", "text": f"D90/D50 = {r:.2f}. 크기 분포가 고른 편입니다 (1.5 안팎이면 균일)."})
    if jeff.get("n_effective", 0) < 50:
        out.append({"level": "info", "text": f"유효 결정립이 {jeff.get('n_effective', 0):.1f}개입니다. ASTM E112 는 한 시야에 50개 이상을 권합니다. 배율을 낮추거나 여러 장을 평균하면 더 믿을 만합니다."})
    return out
