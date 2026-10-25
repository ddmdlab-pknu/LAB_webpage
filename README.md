---
title: DDMD Lab Grain Size
emoji: 🔬
colorFrom: green
colorTo: gray
sdk: gradio
sdk_version: 5.50.0
python_version: "3.12"
app_file: app.py
pinned: false
short_description: ASTM E112 grain size from a micrograph with a scale bar
---

# DDMD Lab 결정립 크기 측정 API

국립부경대학교 DDMD Lab 홈페이지(ddmdlab.org)의 "사진 한 장으로 결정립 크기를" 기능이 쓰는 분석 서버입니다.
광학 현미경 사진을 받아 결정립을 나누고 ASTM E112 결정립도(G, Jeffries·Heyn)와 크기 분포를 JSON 으로 돌려줍니다.
올린 사진은 분석에만 쓰고 15분이 지나면 서버 임시 폴더에서 지웁니다.

크기는 사진 속 스케일바로만 맞춥니다. 서버가 스케일바(파란 선 우선)의 길이를 픽셀로 재고,
사용자가 그 스케일바 값(μm)을 입력해야 분석합니다. 스케일바 값을 가정하지 않습니다.

Gradio API (`/gradio_api/call/<이름>`)

| 이름 | 입력 → 출력 |
|---|---|
| `health` | 없음 → 서버·엔진 상태 |
| `inspect` | 사진 → 미리보기, 찾은 스케일바 위치·길이(px) |
| `analyze` | 사진, 스케일바 값 μm(필수), 스케일바 길이 px·영역(직접 표시했을 때) → 결과 JSON (`ddmd-grain/1`) |

사용자가 고칠 수 있는 문제(값 없음, 스케일바 못 찾음 등)는 `{"error": "설명"}` 으로 돌려줍니다.

결정립 나누기는 `models/cellpose_v3_final.pth`(연구실 학습 Cellpose-SAM 모델)가 있으면 그 모델을 ZeroGPU 에서, 없으면 고전 영상처리(능선 필터 + watershed)를 CPU 에서 씁니다. 모델을 공개하지 않으려면 비공개 모델 저장소에 두고 Space 설정에 `MODEL_REPO` 와 `HF_TOKEN`(Secret)을 넣으면 됩니다.
