"""결정립 나누기(segmentation) 엔진.

- CellposeEngine : 연구실에서 학습한 Cellpose-SAM 모델 (기본, 정확)
- ClassicEngine  : 모델 파일이 없을 때 쓰는 고전 영상처리(능선 필터 + watershed).
                   설치가 가볍고 빠르지만, 흐린 결정립계에서는 Cellpose 보다 부정확하다.
"""
from __future__ import annotations

import math
import time
from pathlib import Path

import numpy as np

_MODEL_CACHE: dict = {}


class CellposeEngine:
    name = "cellpose"

    def __init__(self, mcfg: dict, base_dir: Path):
        from cellpose import models  # 무거운 import 는 여기서만
        import torch

        path = Path(mcfg["path"])
        if not path.is_absolute():
            path = Path(base_dir) / path
        if not path.exists():
            raise FileNotFoundError(f"모델 파일 {mcfg['path']} 이 없습니다")
        gpu = mcfg.get("gpu", "auto")
        use_gpu = torch.cuda.is_available() if gpu == "auto" else bool(gpu)
        key = (str(path), use_gpu)
        if key not in _MODEL_CACHE:
            _MODEL_CACHE[key] = models.CellposeModel(gpu=use_gpu, pretrained_model=str(path))
        self.model = _MODEL_CACHE[key]
        self.device = "GPU" if use_gpu else "CPU"
        self.input = mcfg.get("input", "raw")
        self.base_diameter = int(mcfg.get("base_diameter", 25))
        self.learned = list(mcfg.get("learned_px_per_um", [0.94, 3.51]))
        self.eval_kwargs = dict(mcfg.get("eval", {}))
        self.label = mcfg.get("label") or path.name

    def suggest_diameter(self, um_per_px: float):
        px_per_um = 1.0 / um_per_px
        closest = min(self.learned, key=lambda x: abs(math.log(x) - math.log(px_per_um)))
        r = px_per_um / closest
        if 0.5 < r < 2.0:
            return self.base_diameter, "학습 사진과 배율이 비슷해 학습 때 값을 그대로 씀"
        d = int(round(self.base_diameter * r))
        return max(10, min(120, d)), f"학습 사진보다 픽셀이 {r:.2f}배 커서 비례해 조정"

    def segment(self, gray_raw, gray_clahe, um_per_px, diameter=None):
        img = gray_clahe if self.input == "clahe" else gray_raw
        if diameter:
            d, why = int(diameter), "직접 지정"
        else:
            d, why = self.suggest_diameter(um_per_px)
        t0 = time.time()
        out = self.model.eval(img, diameter=d, **self.eval_kwargs)
        masks = np.asarray(out[0]).astype(np.int32)
        return masks, {
            "engine": "cellpose",
            "engine_ko": "Cellpose-SAM 학습 모델",
            "model": self.label,
            "device": self.device,
            "diameter_px": d,
            "diameter_reason": why,
            "seconds": round(time.time() - t0, 1),
        }


class ClassicEngine:
    """능선(어두운 선) 필터로 결정립계를 강조하고, 경계에서 먼 점을 씨앗으로 watershed 한 뒤
    실제 경계가 약한 이웃끼리는 다시 합친다."""

    name = "classic"

    def __init__(self, ccfg: dict | None = None):
        c = ccfg or {}
        self.sigmas = c.get("sigmas", [1.0, 2.0, 3.0])
        self.merge_ratio = float(c.get("merge_ratio", 0.55))
        self.min_area_um2 = float(c.get("min_area_um2", 120.0))
        self.min_area_px = int(c.get("min_area_px", 60))

    def segment(self, gray_raw, gray_clahe, um_per_px, diameter=None):
        from scipy import ndimage as ndi
        from skimage import filters, morphology, segmentation, measure, graph

        t0 = time.time()
        g = gray_clahe.astype(np.float64)
        lo, hi = np.percentile(g, 1), np.percentile(g, 99)
        g = np.clip((g - lo) / max(hi - lo, 1e-6), 0, 1)
        g = filters.gaussian(g, 1.0)

        ridge = filters.sato(g, sigmas=self.sigmas, black_ridges=True)
        ridge = ridge / max(np.percentile(ridge, 99.5), 1e-9)

        # 경계 후보: 능선이 강한 곳. 점(피트) 같은 둥근 덩어리는 버린다
        t = max(filters.threshold_otsu(ridge), 0.12)
        bnd = ridge > t
        lab = measure.label(bnd)
        keep = np.zeros(lab.max() + 1, bool)
        for p in measure.regionprops(lab):
            elong = p.axis_major_length / max(p.axis_minor_length, 1)
            if p.area >= 40 and (elong > 3 or p.area > 400):
                keep[p.label] = True
        bnd = keep[lab]
        bnd = morphology.dilation(bnd, morphology.disk(1))

        info = {
            "engine": "classic",
            "engine_ko": "고전 영상처리 (능선 필터 + watershed)",
            "model": "없음 (규칙 기반)",
            "device": "CPU",
            "diameter_px": None,
            "diameter_reason": "해당 없음",
        }
        if not bnd.any():  # 결정립계가 하나도 안 보이는 사진
            info["seconds"] = round(time.time() - t0, 1)
            return np.zeros(g.shape, np.int32), info

        # 씨앗: 경계에서 충분히 먼 지점 (h-maxima 로 작은 요철은 무시)
        dist = ndi.distance_transform_edt(~bnd)
        min_r_um = 0.5 * math.sqrt(self.min_area_um2 / math.pi) * 2
        h = max(2.0, 0.6 * min_r_um / um_per_px)
        peaks = morphology.h_maxima(dist, h)
        markers = measure.label(peaks)

        labels = segmentation.watershed(ridge, markers)

        if labels.max() < 2:
            info["seconds"] = round(time.time() - t0, 1)
            return labels.astype(np.int32), info

        # 경계가 약한 이웃 합치기: 공유 경계의 평균 능선 세기가 낮으면 같은 결정립
        rag = graph.rag_boundary(labels, ridge)
        thr = self.merge_ratio * float(np.median(ridge[bnd]))

        def weight(g_, src, dst, n):
            default = {"weight": 1.0, "count": 0}
            c1 = g_[src].get(n, default)["count"]
            c2 = g_[dst].get(n, default)["count"]
            w1 = g_[src].get(n, default)["weight"]
            w2 = g_[dst].get(n, default)["weight"]
            c = c1 + c2
            return {"count": c, "weight": (c1 * w1 + c2 * w2) / max(c, 1)}

        def merge(g_, src, dst):
            pass

        labels = graph.merge_hierarchical(labels, rag, thresh=thr, rag_copy=False, in_place_merge=True,
                                          merge_func=merge, weight_func=weight)
        labels = measure.label(labels + 1, connectivity=1)

        # 너무 작은 조각은 이웃에 흡수
        min_px = max(self.min_area_px, int(self.min_area_um2 / um_per_px ** 2))
        areas = np.bincount(labels.ravel())
        small = areas[labels] < min_px
        labels[small] = 0
        labels = segmentation.expand_labels(labels, distance=max(labels.shape))
        labels, _, _ = segmentation.relabel_sequential(labels)

        info["seconds"] = round(time.time() - t0, 1)
        return labels.astype(np.int32), info


def load_engine(cfg: dict, base_dir: Path, prefer: str = "auto"):
    """prefer: auto | cellpose | classic. auto 는 모델 파일과 cellpose 가 있으면 Cellpose, 없으면 고전 방식.
    (엔진, 안내 문구) 를 돌려준다."""
    prefer = (prefer or cfg.get("engine", "auto")).lower()
    if prefer in ("auto", "cellpose"):
        try:
            return CellposeEngine(cfg["model"], base_dir), None
        except Exception as e:  # 모델 없음, cellpose 미설치 등
            if prefer == "cellpose":
                raise
            why = str(e) if isinstance(e, FileNotFoundError) else f"{type(e).__name__}: {e}"
            if isinstance(e, ImportError):
                why = "cellpose 가 설치되지 않았습니다 (pip install cellpose==4.1.1)"
            note = f"Cellpose 학습 모델을 쓸 수 없어 고전 영상처리 방식으로 측정했습니다. 이유: {why}."
            return ClassicEngine(cfg.get("classic")), note
    return ClassicEngine(cfg.get("classic")), None
