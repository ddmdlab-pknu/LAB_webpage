"""Hugging Face Space (Gradio + ZeroGPU) 용 결정립 크기 측정 서버.

홈페이지(ddmdlab.org)는 Gradio API 로 부른다.
  POST /gradio_api/upload                       사진 올리기 → 서버 쪽 임시 경로
  POST /gradio_api/call/inspect   {"data": [사진]}                                → event_id
  POST /gradio_api/call/analyze   {"data": [사진, 스케일바 μm, 스케일바 px, 영역]}  → event_id
  POST /gradio_api/call/health    {"data": []}                                    → event_id
  GET  /gradio_api/call/<이름>/<event_id>       결과 (server-sent events)

크기는 사진 속 스케일바로만 맞춘다. 스케일바 값(μm)이 없으면 분석하지 않는다.
사용자가 고칠 수 있는 문제(값 없음, 스케일바 못 찾음 등)는 {"error": "설명"} 으로 돌려준다
(Gradio 의 call API 는 오류 메시지를 전하지 않으므로).
올린 사진은 분석에만 쓰고, 15분이 지나면 서버 임시 폴더에서 지운다.

환경 변수 (Space 의 Settings → Variables and secrets)
  GRAIN_ENGINE   auto | cellpose | classic   (기본 auto: 모델 파일이 있으면 cellpose)
  GRAIN_MAX_SIDE 긴 변 최대 픽셀 (기본 1600, 넘으면 줄여서 측정)
  MODEL_REPO     모델 파일이 없을 때 내려받을 모델 저장소 (예: Semin84/ddmd-grain-model)
  MODEL_FILE     그 저장소 안의 파일 이름 (기본 cellpose_v3_final.pth)
  HF_TOKEN       비공개 모델 저장소를 읽을 토큰 (Secrets 에 넣는다)
"""
from __future__ import annotations

import os
from pathlib import Path

import cv2
import gradio as gr

try:  # ZeroGPU 에서만 GPU 를 빌려 쓴다. 다른 곳에서는 아무 일도 하지 않는다
    import spaces
except ImportError:  # pragma: no cover
    spaces = None

from grain_core import ROOT, ScaleError, __version__, analyze, detect_scalebar, load_config, load_engine
from grain_core.imgio import data_url, imread_any
from grain_core.report_web import to_web_json

MAX_BYTES = 15 * 1024 * 1024
PREVIEW_SIDE = 1400
MAX_SIDE = int(os.environ.get("GRAIN_MAX_SIDE", "1600"))

cfg = load_config()


def _fetch_model():
    """모델 파일이 없고 MODEL_REPO 가 있으면 Hugging Face 에서 내려받는다."""
    p = Path(cfg["model"]["path"])
    p = p if p.is_absolute() else ROOT / p
    repo = os.environ.get("MODEL_REPO", "").strip()
    if p.exists() or not repo:
        return
    try:
        from huggingface_hub import hf_hub_download
        cfg["model"]["path"] = hf_hub_download(repo_id=repo, filename=os.environ.get("MODEL_FILE", p.name),
                                               token=os.environ.get("HF_TOKEN") or None)
        print(f"model downloaded from {repo}")
    except Exception as e:  # 못 받으면 고전 영상처리로 돈다
        print(f"model download failed ({repo}): {e}")


_fetch_model()
engine, engine_note = load_engine(cfg, ROOT, os.environ.get("GRAIN_ENGINE", "auto"))
print(f"engine: {engine.name}" + (f" ({engine_note})" if engine_note else ""))

if spaces is not None:
    # ZeroGPU 는 시작할 때 @spaces.GPU 함수가 하나는 있어야 한다. 학습 모델(cellpose)일 때만 GPU 로 보낸다
    _segment = engine.segment

    @spaces.GPU(duration=20)
    def _gpu_segment(gray, clahe, um_per_px, diameter=None):
        return _segment(gray, clahe, um_per_px, diameter=diameter)

    if engine.name == "cellpose":
        engine.segment = _gpu_segment


def _load(file):
    if not file:
        raise UserError("사진을 올려 주세요.")
    path = file if isinstance(file, str) else getattr(file, "name", None) or file.get("path")
    if not path or not os.path.exists(path):
        raise UserError("올린 사진을 찾을 수 없습니다. 다시 올려 주세요.")
    if os.path.getsize(path) > MAX_BYTES:
        raise UserError("사진이 너무 큽니다 (15 MB 이하).")
    try:
        img = imread_any(path)
    except Exception:
        raise UserError("이미지 형식을 읽을 수 없습니다 (jpg, png, tif, bmp).")
    if min(img.shape[:2]) < 64:
        raise UserError("사진이 너무 작습니다 (가로·세로 64 px 이상).")
    return img, Path(path).name


def _num(v):
    if v is None or str(v).strip() == "":
        return None
    try:
        x = float(v)
    except ValueError:
        raise UserError(f"숫자가 아닙니다: {v}")
    if not 0 < x < 1e5:
        raise UserError(f"범위를 벗어난 값입니다: {v}")
    return x


def _box(v):
    if v is None or not str(v).strip():
        return None
    try:
        b = [int(round(float(x))) for x in str(v).split(",")]
    except ValueError:
        raise UserError(f"스케일바 영역 형식이 틀립니다: {v}")
    if len(b) != 4 or b[1] <= b[0] or b[3] <= b[2]:
        raise UserError(f"스케일바 영역은 y1,y2,x1,x2 입니다: {v}")
    return tuple(max(0, x) for x in b)


class UserError(Exception):
    pass


def _safe(fn):
    """오류를 {"error": 문장} 으로 바꿔 돌려준다."""
    def run(*args):
        try:
            return fn(*args)
        except (UserError, ScaleError) as e:
            return {"error": str(e)}
        except Exception as e:  # 예상 못 한 오류 (ZeroGPU 사용량 초과 포함)
            print(f"{fn.__name__} failed: {e!r}")
            if "quota" in str(e).lower():
                return {"error": "오늘 쓸 수 있는 GPU 시간을 다 썼습니다. 내일 다시 시도하거나, Hugging Face 에 로그인한 브라우저에서 Space 화면으로 재 보세요."}
            return {"error": f"분석 중 오류가 났습니다: {e}"}
    run.__name__ = fn.__name__
    run.__doc__ = fn.__doc__
    return run


def health():
    return {"ok": True, "version": __version__, "engine": engine.name,
            "device": getattr(engine, "device", "CPU"), "note": engine_note}


def inspect(file):
    """사진 미리보기와 스케일바 위치·길이(px). 모델을 쓰지 않아 빠르다."""
    img, _ = _load(file)
    H, W = img.shape[:2]
    bar = detect_scalebar(img)
    f = min(1.0, PREVIEW_SIDE / max(H, W))
    prev = cv2.resize(img, (round(W * f), round(H * f)), interpolation=cv2.INTER_AREA) if f < 1 else img
    return {"width": W, "height": H, "preview": data_url(prev, "jpg", 85), "preview_scale": round(f, 6),
            "engine": engine.name,
            "bar": None if bar is None else {"box": list(bar["box"]), "length_px": bar["length_px"], "color": bar["color"]}}


def measure(file, scalebar_um, scalebar_px=None, bar_box=None):
    """결정립 크기 측정. scalebar_um(필수), scalebar_px·bar_box 는 사람이 직접 표시했을 때."""
    img, name = _load(file)
    sb_um = _num(scalebar_um)
    if not sb_um:
        raise UserError("스케일바 값(μm)을 입력해야 분석할 수 있습니다.")
    a = analyze(img, engine, cfg, name=name, scalebar_um=sb_um, scalebar_px=_num(scalebar_px),
                bar_box=_box(bar_box), max_side=MAX_SIDE, engine_note=engine_note)
    return to_web_json(a, images="inline")


with gr.Blocks(title="DDMD Lab 결정립 크기", delete_cache=(900, 900)) as demo:
    gr.Markdown(
        "## DDMD Lab 결정립 크기 측정 (ASTM E112)\n"
        "광학 현미경 사진을 올리고 사진 속 **스케일바 값(μm)** 을 넣으면 결정립도 G 와 크기 분포를 계산합니다. "
        "스케일바(파란 선 우선)의 길이는 자동으로 잽니다. 홈페이지 [ddmdlab.org](https://ddmdlab.org) 에서 더 보기 좋게 쓸 수 있습니다."
    )
    with gr.Row():
        f_in = gr.File(label="현미경 사진 (jpg, png, tif, bmp · 15 MB 이하)", type="filepath",
                       file_types=["image", ".tif", ".tiff"])
        with gr.Column():
            um_in = gr.Textbox(label="스케일바 값 (μm, 필수)", placeholder="예: 100")
            px_in = gr.Textbox(label="스케일바 길이 (px) · 비우면 자동 인식", placeholder="자동")
            box_in = gr.Textbox(label="스케일바 영역 y1,y2,x1,x2 (선택)", visible=False)
            with gr.Row():
                b_inspect = gr.Button("스케일바 찾기")
                b_measure = gr.Button("측정하기", variant="primary")
    out_inspect = gr.JSON(label="스케일바 인식")
    out_measure = gr.JSON(label="측정 결과")
    out_health = gr.JSON(visible=False)
    b_health = gr.Button(visible=False)
    b_inspect.click(_safe(inspect), [f_in], out_inspect, api_name="inspect", concurrency_limit=4)
    b_measure.click(_safe(measure), [f_in, um_in, px_in, box_in], out_measure, api_name="analyze", concurrency_limit=1)
    b_health.click(health, [], out_health, api_name="health", concurrency_limit=8)

demo.queue(max_size=16)

if __name__ == "__main__":
    demo.launch(max_file_size="15mb", ssr_mode=False, show_error=True)
