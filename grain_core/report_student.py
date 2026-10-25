"""학생 수업용 결과 페이지(HTML 한 파일, 그림 내장)."""
from __future__ import annotations

import datetime as _dt
import html
import math

from . import charts
from . import render as R
from . import stats as st
import cv2
from .imgio import data_url

CSS = """
:root{--ink:#111;--muted:#5f6368;--line:#e3e3e0;--soft:#f6f6f4;--accent:#1f6b3a;--warn:#b5651d;--blue:#2f6db5}
*{box-sizing:border-box}
body{margin:0;background:#fff;color:var(--ink);font-family:"Pretendard","Malgun Gothic","Apple SD Gothic Neo","Noto Sans KR",system-ui,sans-serif;font-size:16px;line-height:1.6}
main{max-width:1080px;margin:0 auto;padding:40px 24px 80px}
h1{font-size:30px;line-height:1.2;margin:0 0 6px;letter-spacing:-0.02em}
h2{font-size:22px;margin:56px 0 14px;padding-top:18px;border-top:2px solid var(--ink);letter-spacing:-0.01em}
h3{font-size:17px;margin:26px 0 8px}
p{margin:8px 0}
.sub{color:var(--muted);margin:0}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin:22px 0 8px}
.card{background:var(--soft);padding:14px 16px}
.card b{display:block;font-size:28px;line-height:1.15;letter-spacing:-0.02em}
.card span{color:var(--muted);font-size:14px}
.card.main{background:var(--ink);color:#fff}.card.main span{color:#cfd3d6}
.notes{list-style:none;padding:0;margin:14px 0}
.notes li{padding:8px 12px;margin:6px 0;background:var(--soft);border-left:4px solid var(--accent)}
.notes li.warn{border-color:var(--warn);background:#fbf3ea}.notes li.info{border-color:var(--blue)}
table{border-collapse:collapse;width:100%;font-size:14.5px;margin:8px 0}
th,td{padding:6px 8px;border-bottom:1px solid var(--line);text-align:right;font-variant-numeric:tabular-nums}
th{background:var(--soft);font-weight:600}
td:first-child,th:first-child{text-align:left}
tr.hit td{background:#e8f4ec;font-weight:600}
.figs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}
figure{margin:0}figure img{display:block;width:100%;height:auto;background:var(--soft)}
figcaption{font-size:14px;color:var(--muted);margin-top:6px}
.eq{background:var(--soft);padding:14px 18px;margin:10px 0;font-family:"Cambria Math","Times New Roman",serif;font-size:17px;line-height:1.9;overflow-x:auto}
.eq em{font-style:normal;color:var(--accent);font-weight:700}
.legend span{display:inline-block;margin-right:14px;font-size:14px}.legend i{display:inline-block;width:12px;height:12px;margin-right:5px;vertical-align:-1px}
.chart{width:100%;height:auto;font-family:inherit}.chart.gscale{max-width:900px;display:block}.chart .grid{stroke:#ececec}.chart .axis{stroke:#888}.chart .tick{font-size:12px;fill:#666}.chart .lab{font-size:13px;fill:#333}.chart .mark{font-size:12px;font-weight:600}
.two{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:22px}
details{margin:10px 0}summary{cursor:pointer;font-weight:600}
dl{margin:0}dt{font-weight:700;margin-top:14px}dd{margin:4px 0 0;color:#333}
.q li{margin:6px 0}
.foot{margin-top:60px;color:var(--muted);font-size:13px}
.scroll{max-height:520px;overflow:auto;border:1px solid var(--line)}
@media (max-width:760px){.figs,.two{grid-template-columns:1fr}h1{font-size:24px}}
@media print{main{padding:0}h2{break-before:auto}.scroll{max-height:none;overflow:visible;border:0}figure,table,.eq{break-inside:avoid}}
"""


def _f(v, n=2, unit=""):
    if v is None or (isinstance(v, float) and v != v):
        return "-"
    return f"{v:,.{n}f}{unit}"


def _img(a, fmt="jpg", q=88):
    return data_url(a, fmt, q)


def render_report(a, cfg, files: dict | None = None) -> str:
    """a: Analysis. files: {'csv': 'grains.csv', ...} 같은 상대 링크."""
    e = html.escape
    J, Hy, D, sc = a.jeff, a.heyn, a.dist_interior, a.scale
    H, W = a.masks.shape
    files = files or {}
    has = J["n_total"] > 0

    # ── 그림 ──
    fig_orig = _img(R.scalebar_overlay(a.image, sc, a.inpaint_mask))
    fig_clahe = _img(R.side_by_side(cv2.cvtColor(a.gray, cv2.COLOR_GRAY2BGR), cv2.cvtColor(a.clahe, cv2.COLOR_GRAY2BGR)))
    fig_lab = _img(R.color_labels(a.masks, a.gray, ids=True)) if has else None
    fig_bnd = _img(R.boundary_overlay(a.gray, a.masks, thick=2)) if has else None
    fig_cls = _img(R.class_overlay(a.gray, a.masks, a.grains)) if has else None
    fig_hey = _img(R.heyn_overlay(a.gray, a.masks, Hy)) if has else None

    def card(val, label, main=False):
        return f'<div class="card{" main" if main else ""}"><b>{val}</b><span>{label}</span></div>'

    notes = "".join(f'<li class="{n["level"]}">{e(n["text"])}</li>' for n in a.notes)
    word = st.grade_word(J["G"])
    out = [f"""<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>결정립 크기 측정 · {e(a.name)}</title><style>{CSS}</style></head><body><main>
<p class="sub">DDMD Lab · 결정립 크기 자동 측정 (ASTM E112)</p>
<h1>{e(a.name)}</h1>
<p class="sub">{_dt.datetime.now():%Y-%m-%d %H:%M} 측정 · {e(a.seg['engine_ko'])} · {e(a.seg['device'])} · {a.seconds:.1f}초</p>
<div class="cards">
{card(_f(J['G']), 'ASTM G (Jeffries 면적법)', True)}
{card(_f(Hy['G']), 'ASTM G (Heyn 절편법)')}
{card(_f(D.get('mean'), 1, ' μm'), '평균 결정립 지름 (ECD)')}
{card(_f(D.get('d50'), 1, ' μm'), '중앙값 D50')}
{card(_f(J['n_effective'], 1, '개'), f"유효 결정립 수 (총 {J['n_total']}개)")}
{card(e(word), '조직 평가')}
</div>
{charts.g_scale(J['G'], Hy['G'])}
<ul class="notes">{notes}</ul>
"""]

    # ── 1. 측정 조건 ──
    fov_w, fov_h = J["fov_um"]
    scale_eq = ""
    if sc.method == "scalebar":
        shrink = f" ÷ {a.resized:.3f} (줄인 비율)" if a.resized != 1 else ""
        scale_eq = (f"<tr><td>스케일 계산</td><td>1 px = 스케일바 {sc.scalebar_um:g} μm ÷ {sc.scalebar_px:g} px{shrink}"
                    f" = <b>{sc.um_per_px:.4f} μm</b></td></tr>")
    out.append(f"""<h2>1. 측정 조건</h2>
<table><tbody>
<tr><td>이미지 크기</td><td>{W} × {H} px{' (원본에서 줄임)' if a.resized != 1 else ''}</td></tr>
<tr><td>스케일 (1 px 의 길이)</td><td>{sc.um_per_px:.4f} μm/px &nbsp;·&nbsp; {sc.px_per_um:.3f} px/μm</td></tr>
<tr><td>스케일을 정한 방법</td><td>{e(sc.source)}</td></tr>
{scale_eq}
<tr><td>실제 시야</td><td>{fov_w:,.1f} × {fov_h:,.1f} μm = {J['area_mm2']:.4f} mm²</td></tr>
<tr><td>결정립 분할 방법</td><td>{e(a.seg['engine_ko'])} · {e(str(a.seg['model']))}</td></tr>
<tr><td>Cellpose diameter</td><td>{e(str(a.seg['diameter_px'] or '-'))} px ({e(a.seg['diameter_reason'])})</td></tr>
<tr><td>전처리</td><td>스케일바·숫자 지우기(inpaint) → 흑백 → CLAHE (clip {cfg['preprocess']['clahe_clip']}, {cfg['preprocess']['clahe_grid']}×{cfg['preprocess']['clahe_grid']})</td></tr>
<tr><td>잡음으로 버린 조각</td><td>{cfg['stats']['min_grain_px']} px 보다 작은 영역</td></tr>
</tbody></table>""")

    # ── 2. 처리 과정 ──
    out.append(f"""<h2>2. 이미지가 처리되는 과정</h2>
<div class="figs">
<figure><img src="{fig_orig}" alt="원본"><figcaption>① 원본. 초록 상자 = 길이를 잰 스케일바, 주황 상자 = 측정 전에 지운 영역(스케일바와 숫자).</figcaption></figure>
<figure><img src="{fig_clahe}" alt="전처리"><figcaption>② 왼쪽: 스케일바를 지운 흑백, 오른쪽: CLAHE 로 부분마다 대비를 고르게 한 결과. 어두운 곳의 결정립계도 잘 보이게 합니다.</figcaption></figure>
""" + (f"""<figure><img src="{fig_lab}" alt="분할"><figcaption>③ 결정립 분할. 색 하나가 결정립 하나이고, 숫자는 아래 결정립 목록의 번호입니다.</figcaption></figure>
<figure><img src="{fig_bnd}" alt="경계"><figcaption>④ 찾은 결정립계(빨강)를 원본 위에 겹친 그림. 사진의 실제 경계와 맞는지 눈으로 확인하세요.</figcaption></figure>""" if has else "<p>결정립을 찾지 못해 분할 그림이 없습니다.</p>") + "</div>")

    if has:
        # ── 3. Jeffries ──
        n_in, n_ed, n_co, n_eff = J["n_interior"], J["n_edge"], J["n_corner"], J["n_effective"]
        out.append(f"""<h2>3. Jeffries 면적법 (결정립 개수로 G 구하기)</h2>
<p>시야 안의 결정립 수를 세어 1 mm² 당 개수(N<sub>A</sub>)를 구합니다. 사진 가장자리에 잘린 결정립은 일부만 보이므로 <b>반 개(0.5)</b>, 모서리에 걸린 것은 <b>1/4 개(0.25)</b>로 셉니다.</p>
<div class="two"><figure><img src="{fig_cls}" alt="Jeffries 분류"><figcaption class="legend"><span><i style="background:#2e9e5b"></i>내부 {n_in}개 × 1</span><span><i style="background:#e8962e"></i>가장자리 {n_ed}개 × 0.5</span><span><i style="background:#d0457a"></i>모서리 {n_co}개 × 0.25</span></figcaption></figure>
<div>
<div class="eq">N<sub>eff</sub> = {n_in} + 0.5 × {n_ed} + 0.25 × {n_co} = <em>{n_eff:.2f}</em> 개<br>
A = {W} × {H} px × ({sc.um_per_px:.4f} μm)² = <em>{J['area_mm2']:.4f}</em> mm²<br>
N<sub>A</sub> = {n_eff:.2f} ÷ {J['area_mm2']:.4f} = <em>{J['NA_per_mm2']:.1f}</em> 개/mm²<br>
G = 3.321928 × log<sub>10</sub>({J['NA_per_mm2']:.1f}) − 2.954 = <em>{J['G']:.2f}</em></div>
<p>결정립 하나의 평균 면적은 1 ÷ N<sub>A</sub> = {_f(J['mean_area_um2'], 0)} μm² 입니다.</p>
<p>가장자리 보정 없이 {J['n_total']}개를 모두 1개로 세면 N<sub>A</sub> = {J['NA_all_per_mm2']:.1f}, G = {J['G_uncorrected']:.2f} 가 됩니다. 보정을 하지 않으면 잘린 조각까지 온전한 결정립으로 세어 결정립이 실제보다 작게(G 가 크게) 나옵니다.</p>
</div></div>""")

        # ── 4. Heyn ──
        rows = "".join(
            f"<tr><td>{'가로' if l['dir'] == 'h' else '세로'} {'y' if l['dir'] == 'h' else 'x'} = {l['pos']} px</td><td>{l['length_um']:,.1f}</td><td>{l['P']}</td><td>{(l['length_um'] / l['P']) if l['P'] else float('nan'):,.1f}</td></tr>"
            for l in Hy["lines"])
        l_um = Hy["mean_intercept_um"]
        out.append(f"""<h2>4. Heyn 선형 절편법 (선을 그어 G 구하기)</h2>
<p>사진 위에 가로 {len(Hy['lines']) // 2}개, 세로 {len(Hy['lines']) // 2}개의 시험선을 긋고 결정립계와 만나는 점(빨간 점)을 셉니다. 선 길이를 교차 수로 나누면 평균 절편 길이 ℓ 이 됩니다. 큰 결정립일수록 선을 길게 차지하므로 면적법보다 큰 결정립 쪽에 무게가 실립니다.</p>
<div class="two"><figure><img src="{fig_hey}" alt="Heyn 시험선"><figcaption>파란 선 = 시험선, 빨간 점 = 결정립계와 만난 점 (총 {Hy['total_P']}개)</figcaption></figure>
<div><div class="eq">ℓ = {Hy['total_length_um']:,.1f} μm ÷ {Hy['total_P']} = <em>{l_um:.2f}</em> μm = {l_um / 1000:.5f} mm<br>
G = −6.643856 × log<sub>10</sub>({l_um / 1000:.5f}) − 3.288 = <em>{Hy['G']:.2f}</em></div>
<details><summary>시험선별 교차 수 보기</summary><table><thead><tr><th>시험선</th><th>길이 (μm)</th><th>교차 수 P</th><th>ℓ (μm)</th></tr></thead><tbody>{rows}</tbody></table></details>
<p>Jeffries G = {J['G']:.2f}, Heyn G = {Hy['G']:.2f}, 차이 {abs(J['G'] - Hy['G']):.2f}. ASTM E112 는 두 방법이 보통 ±0.5 안에서 맞는다고 봅니다.</p>
</div></div>""")

        # ── 5. 분포 ──
        marks = [(D["mean"], f"평균 {D['mean']:.1f}", "#d23b3b"), (D["median"], f"중앙값 {D['median']:.1f}", "#1f6b3a")] if D.get("n") else []
        out.append(f"""<h2>5. 결정립 크기 분포</h2>
<p>크기 통계는 사진 안에 온전히 들어온 <b>내부 결정립 {D.get('n', 0)}개</b>로 냅니다. 가장자리에 잘린 결정립은 실제보다 작게 재지기 때문입니다. 크기는 같은 면적의 원 지름(ECD = 2√(면적/π))으로 나타냅니다.</p>
""" + (f"""<div class="two"><div>{charts.histogram(D, marks=marks)}<p class="sub">결정립 크기 히스토그램 (내부 결정립)</p></div>
<div>{charts.cumulative(D)}<p class="sub">누적 분포: 작은 것부터 쌓았을 때 몇 %가 그 크기보다 작은지</p></div></div>
<table><thead><tr><th>항목</th><th>값</th><th style="text-align:left">뜻</th></tr></thead><tbody>
<tr><td>평균 ECD</td><td>{D['mean']:.2f} μm</td><td style="text-align:left">결정립 지름의 산술 평균</td></tr>
<tr><td>표준편차</td><td>{D['std']:.2f} μm</td><td style="text-align:left">크기가 흩어진 정도</td></tr>
<tr><td>최소 / 최대</td><td>{D['min']:.1f} / {D['max']:.1f} μm</td><td style="text-align:left"></td></tr>
<tr><td>D10</td><td>{D['d10']:.2f} μm</td><td style="text-align:left">10%의 결정립이 이보다 작음</td></tr>
<tr><td>D50 (중앙값)</td><td>{D['d50']:.2f} μm</td><td style="text-align:left">절반이 이보다 작음. 큰 결정립 몇 개에 덜 흔들리는 대표값</td></tr>
<tr><td>D90</td><td>{D['d90']:.2f} μm</td><td style="text-align:left">90%가 이보다 작음. 큰 결정립 무리의 크기</td></tr>
<tr><td>D90 / D50</td><td>{D['d90_d50']:.2f}</td><td style="text-align:left">1.5 안팎 = 고름, 3 이상 = 이상 입자 성장 의심</td></tr>
</tbody></table>""" if D.get("n") else "<p>내부 결정립이 없어 분포를 그릴 수 없습니다.</p>"))

    # ── 6. ASTM 표 ──
    G = J["G"]
    trs = []
    for r in st.astm_table(0, 12):
        hit = ' class="hit"' if (G == G and abs(r["G"] - G) <= 0.5) else ""
        trs.append(f"<tr{hit}><td>{r['G']}</td><td>{r['NA_per_mm2']:,.1f}</td><td>{r['mean_area_um2']:,.0f}</td><td>{math.sqrt(r['mean_area_um2']):,.1f}</td><td>{r['ecd_um']:,.1f}</td><td>{r['intercept_um']:,.1f}</td><td style='text-align:left'>{r['word']}</td></tr>")
    out.append(f"""<h2>6. ASTM E112 결정립도 표</h2>
<p>G 가 1 커지면 1 mm² 안의 결정립 수는 2배, 결정립 하나의 면적은 절반이 됩니다. 이 사진에 가까운 줄을 초록으로 표시했습니다.</p>
<table><thead><tr><th>G</th><th>N<sub>A</sub> (개/mm²)</th><th>평균 면적 (μm²)</th><th>√면적 (μm)</th><th>ECD (μm)</th><th>평균 절편 ℓ (μm)</th><th style="text-align:left">평가</th></tr></thead><tbody>{''.join(trs)}</tbody></table>
<p class="sub">√면적은 ASTM 표의 평균 지름(d̄), ECD 는 같은 면적의 원 지름(√면적 × 1.128)입니다.</p>""")

    # ── 7. 결정립 목록 ──
    if has:
        cls_ko = {"interior": "내부", "edge": "가장자리", "corner": "모서리"}
        grows = "".join(
            f"<tr><td>{g['id']}</td><td style='text-align:left'>{cls_ko[g['class']]}</td><td>{g['area_um2']:,.0f}</td><td>{g['ecd_um']:,.1f}</td><td>{g['perimeter_um']:,.1f}</td><td>{g['aspect_ratio']:.2f}</td><td>{g['circularity']:.2f}</td></tr>"
            for g in a.grains)
        link = f' 엑셀로 열 수 있는 <a href="{e(files["csv"])}">{e(files["csv"])}</a> 파일에도 같은 내용이 있습니다.' if files.get("csv") else ""
        out.append(f"""<h2>7. 결정립 목록 ({len(a.grains)}개)</h2>
<p>번호는 ③ 분할 그림의 숫자와 같습니다.{link}</p>
<div class="scroll"><table><thead><tr><th>번호</th><th style="text-align:left">위치</th><th>면적 (μm²)</th><th>ECD (μm)</th><th>둘레 (μm)</th><th>종횡비</th><th>원형도</th></tr></thead><tbody>{grows}</tbody></table></div>
<p class="sub">종횡비 = 긴 축 ÷ 짧은 축 (1 = 둥글거나 정다각형), 원형도 = 4π·면적 ÷ 둘레² (1 = 원).</p>""")

    # ── 8. 용어와 원리 ──
    model_perf = ""
    if a.seg["engine"] == "cellpose":
        model_perf = """<dt>이 모델의 정확도</dt><dd>무방향성 전기강판 사진 67장(학습 59, 검증 8)으로 Cellpose-SAM 을 추가 학습했습니다. 학습에 쓰지 않은 8장에서 AP@0.5 = 0.752, 사람이 그린 정답과의 G 차이 |ΔG| 평균 0.20 (ASTM E112 허용 ±0.5 이내). 다만 모델이 결정립을 조금 덜 나누는 경향(평균 ΔG −0.20)이 있습니다.</dd>"""
    else:
        model_perf = """<dt>고전 영상처리 방식의 한계</dt><dd>학습 모델이 없을 때 쓰는 규칙 기반 방법입니다. 어두운 선을 강조한 뒤 나누므로, 흐린 결정립계는 놓치고 부식 구멍이 모인 곳을 결정립으로 잘못 셀 수 있습니다. ④ 경계 그림으로 꼭 확인하세요.</dd>"""
    out.append(f"""<h2>8. 용어와 원리</h2><dl>
<dt>ASTM E112</dt><dd>금속의 평균 결정립 크기를 재는 표준 시험법. 결과를 결정립도 번호 G 로 나타내며, G 가 클수록 결정립이 작습니다.</dd>
<dt>ECD (등가원 지름)</dt><dd>결정립과 면적이 같은 원의 지름. 모양이 제각각인 결정립을 하나의 길이로 비교하게 해 줍니다.</dd>
<dt>N<sub>A</sub></dt><dd>1 mm² 안의 결정립 수. Jeffries 식 G = 3.321928·log<sub>10</sub>(N<sub>A</sub>) − 2.954 에 들어갑니다.</dd>
<dt>평균 절편 길이 ℓ</dt><dd>시험선이 결정립 하나를 지나는 평균 길이. Heyn 식 G = −6.643856·log<sub>10</sub>(ℓ[mm]) − 3.288 에 들어갑니다.</dd>
<dt>가장자리 보정</dt><dd>사진 테두리에 잘린 결정립은 바깥에 나머지가 있으므로 0.5개(모서리는 0.25개)로 셉니다.</dd>
<dt>CLAHE</dt><dd>사진을 작은 칸으로 나눠 칸마다 대비를 고르게 하는 처리. 조명이 고르지 않아도 결정립계가 잘 보이게 합니다.</dd>
<dt>Cellpose 와 diameter</dt><dd>세포·입자를 나누는 딥러닝 모델. diameter 는 "대략 이 정도 픽셀 크기의 물체를 찾아라"라는 힌트로, 배율이 학습 사진과 다르면 비례해서 바꿉니다.</dd>
{model_perf}
</dl>
<h2>9. 생각해 볼 질문</h2><ol class="q">
<li>이 사진에서 Jeffries G({_f(J['G'])})와 Heyn G({_f(Hy['G'])})가 {('거의 같은' if (J['G'] == J['G'] and Hy['G'] == Hy['G'] and abs(J['G'] - Hy['G']) <= 0.25) else '다른')} 이유는 무엇일까요? 크기 분포(5장)와 연결해 설명해 보세요.</li>
<li>가장자리 보정을 하지 않으면 G 가 {_f(J['G_uncorrected'])} 로 바뀝니다. 같은 시료를 더 높은 배율로 찍으면 이 차이는 커질까요, 작아질까요?</li>
<li>열처리 온도나 시간을 늘리면 G 는 어느 방향으로 바뀔까요? ASTM 표(6장)에서 G 가 1 줄면 평균 면적은 몇 배가 되나요?</li>
<li>④ 경계 그림에서 프로그램이 놓치거나 잘못 그은 경계를 찾아보세요. 그 오류는 G 를 크게 할까요, 작게 할까요?</li>
</ol>
<p class="foot">DDMD Lab (Data Driven Material Design Lab), 국립부경대학교 · grain_core {e(cfg.get('_version', '1.0'))} · 이 결과는 자동 측정값이므로 중요한 판단에는 사진과 경계 그림을 함께 확인하세요.</p>
</main></body></html>""")
    return "".join(out)


def render_index(rows: list[dict], title: str = "결정립 크기 측정 결과 모음") -> str:
    """rows: summary_row + 'report' 상대경로 + 'thumb' data URL."""
    e = html.escape
    ok = [r for r in rows if r.get("G_jeffries") is not None]
    agg = ""
    if len(ok) >= 2:
        import statistics as S
        gj = [r["G_jeffries"] for r in ok]
        gh = [r["G_heyn"] for r in ok if r.get("G_heyn") is not None]
        me = [r["mean_ecd_um"] for r in ok if r.get("mean_ecd_um") is not None]
        agg = f"""<h2>여러 장 평균 (같은 시료라면)</h2><table><tbody>
<tr><td>사진 수</td><td>{len(ok)}장</td></tr>
<tr><td>G (Jeffries) 평균 ± 표준편차</td><td>{S.mean(gj):.2f} ± {S.stdev(gj):.2f}</td></tr>
<tr><td>G (Heyn) 평균 ± 표준편차</td><td>{(S.mean(gh) if gh else float('nan')):.2f} ± {(S.stdev(gh) if len(gh) > 1 else 0):.2f}</td></tr>
<tr><td>평균 ECD 의 평균</td><td>{(S.mean(me) if me else float('nan')):.1f} μm</td></tr>
</tbody></table><p class="sub">ASTM E112 는 시야 여러 곳을 재어 평균하기를 권합니다. 서로 다른 시료가 섞여 있다면 이 평균은 의미가 없습니다.</p>"""
    trs = "".join(
        f"""<tr><td><a href="{e(r['report'])}"><img src="{r['thumb']}" alt="" style="width:96px;height:auto;display:block"></a></td>
<td style="text-align:left"><a href="{e(r['report'])}">{e(r['file'])}</a><br><span class="sub">{e(r.get('engine', ''))} · {e(r.get('scale_source', ''))}</span></td>
<td>{_f(r.get('G_jeffries'))}</td><td>{_f(r.get('G_heyn'))}</td><td>{_f(r.get('mean_ecd_um'), 1)}</td><td>{_f(r.get('d50_um'), 1)}</td><td>{_f(r.get('n_effective'), 1)}</td><td style="text-align:left">{e(r.get('grade', '-'))}</td></tr>"""
        if r.get("report") else
        f"<tr><td></td><td style='text-align:left'>{e(r['file'])}</td><td colspan='6' style='text-align:left;color:#b5651d'>{e(r.get('error', '실패'))}</td></tr>"
        for r in rows)
    return f"""<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{e(title)}</title><style>{CSS}</style></head><body><main>
<p class="sub">DDMD Lab · 결정립 크기 자동 측정 (ASTM E112)</p><h1>{e(title)}</h1>
<p class="sub">{_dt.datetime.now():%Y-%m-%d %H:%M} · 사진 {len(rows)}장 · 파일 이름을 누르면 자세한 결과가 열립니다. 표 전체는 summary.csv 에도 있습니다.</p>
<table><thead><tr><th></th><th style="text-align:left">사진</th><th>G<br>Jeffries</th><th>G<br>Heyn</th><th>평균 ECD<br>(μm)</th><th>D50<br>(μm)</th><th>유효<br>결정립</th><th style="text-align:left">평가</th></tr></thead>
<tbody>{trs}</tbody></table>{agg}
<p class="foot">DDMD Lab, 국립부경대학교</p></main></body></html>"""
