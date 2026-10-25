// 결정립 크기 재기 창: 사진 올리기 → 스케일바 확인·값 입력 → 분석 서버 → 결과 리포트.
import { PointerEvent as RPointerEvent, useEffect, useRef, useState } from "react";
import { analyzeImage, GRAIN_API, GrainResult, health, Inspect, inspectImage, loadSample } from "./api";

type Phase = "pick" | "run" | "done" | "error";
type Box = [number, number, number, number]; // 원본 픽셀 [y1, y2, x1, x2]
type Line = { x1: number; y1: number; x2: number; y2: number };
type Server = "none" | "checking" | "up" | "down";

const f = (v: number | null | undefined, n = 2, unit = "") => (v === null || v === undefined || isNaN(v) ? "-" : v.toFixed(n) + unit);

// ── 그래프 ─────────────────────────────────────────────
function ticks(max: number, n = 5) {
  const raw = max / n;
  const mag = Math.pow(10, Math.floor(Math.log10(raw || 1)));
  const step = [1, 2, 2.5, 5, 10].map((s) => s * mag).find((s) => s >= raw) || mag * 10;
  const out: number[] = [];
  for (let v = 0; v <= max + 1e-9; v += step) out.push(+v.toFixed(6));
  return out;
}

function Hist({ r }: { r: GrainResult }) {
  const { edges, counts } = r.histogram;
  if (!counts.length) return null;
  const W = 520, H = 260, L = 44, R = 12, T = 14, B = 40;
  const pw = W - L - R, ph = H - T - B;
  const xmax = edges[edges.length - 1] || 1;
  const yt = ticks(Math.max(...counts) * 1.1, 4);
  const ytop = yt[yt.length - 1] || 1;
  const X = (v: number) => L + (pw * v) / xmax;
  const Y = (v: number) => T + ph * (1 - v / ytop);
  const marks: [number | null, string, string][] = [
    [r.ecd_um.mean, `평균 ${f(r.ecd_um.mean, 1)}`, "#d23b3b"],
    [r.ecd_um.median, `중앙값 ${f(r.ecd_um.median, 1)}`, "#1f6b3a"],
  ];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="gt-chart" role="img" aria-label="결정립 크기 히스토그램">
      {yt.map((t) => (
        <g key={t}>
          <line x1={L} x2={W - R} y1={Y(t)} y2={Y(t)} className="g" />
          <text x={L - 6} y={Y(t) + 4} textAnchor="end" className="t">{t}</text>
        </g>
      ))}
      {counts.map((c, i) =>
        c ? <rect key={i} x={X(edges[i]) + 0.5} y={Y(c)} width={Math.max(X(edges[i + 1]) - X(edges[i]) - 1, 1)} height={Y(0) - Y(c)} fill="#2f6db5" /> : null
      )}
      {ticks(xmax, 5).map((t) => (
        <text key={t} x={X(t)} y={T + ph + 16} textAnchor="middle" className="t">{t}</text>
      ))}
      {marks.map(([v, lab, col], k) =>
        v === null ? null : (
          <g key={lab}>
            <line x1={X(v)} x2={X(v)} y1={T} y2={T + ph} stroke={col} strokeWidth={2} strokeDasharray="5 3" />
            <text x={X(v) > L + pw * 0.7 ? X(v) - 4 : X(v) + 4} y={T + 12 + 15 * k} textAnchor={X(v) > L + pw * 0.7 ? "end" : "start"} className="m" fill={col}>{lab}</text>
          </g>
        )
      )}
      <line x1={L} x2={W - R} y1={Y(0)} y2={Y(0)} className="a" />
      <text x={L + pw / 2} y={H - 4} textAnchor="middle" className="l">결정립 지름 ECD (μm), 내부 결정립 {r.ecd_um.n}개</text>
    </svg>
  );
}

function Cum({ r }: { r: GrainResult }) {
  const v = r.cumulative;
  if (!v.length) return null;
  const W = 520, H = 260, L = 44, R = 12, T = 14, B = 40;
  const pw = W - L - R, ph = H - T - B;
  const xmax = (r.ecd_um.max || 1) * 1.05;
  const X = (x: number) => L + (pw * x) / xmax;
  const Y = (p: number) => T + ph * (1 - p / 100);
  let d = `M${X(0)},${Y(0)}`;
  v.forEach((x, i) => {
    d += ` L${X(x)},${Y((i / v.length) * 100)} L${X(x)},${Y(((i + 1) / v.length) * 100)}`;
  });
  const keys: ["d10" | "d50" | "d90", number, string][] = [["d10", 10, "#8a8f96"], ["d50", 50, "#d23b3b"], ["d90", 90, "#e08a1e"]];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="gt-chart" role="img" aria-label="누적 분포">
      {[0, 25, 50, 75, 100].map((t) => (
        <g key={t}>
          <line x1={L} x2={W - R} y1={Y(t)} y2={Y(t)} className="g" />
          <text x={L - 6} y={Y(t) + 4} textAnchor="end" className="t">{t}</text>
        </g>
      ))}
      <path d={d} fill="none" stroke="#1f2d55" strokeWidth={2} />
      {keys.map(([k, p, col]) => {
        const val = r.ecd_um[k];
        if (val === null) return null;
        const x = X(val), right = x > L + pw * 0.7;
        return (
          <g key={k}>
            <line x1={L} x2={x} y1={Y(p)} y2={Y(p)} stroke={col} strokeDasharray="4 3" />
            <line x1={x} x2={x} y1={Y(p)} y2={Y(0)} stroke={col} strokeDasharray="4 3" />
            <circle cx={x} cy={Y(p)} r={4} fill={col} />
            <text x={right ? x - 6 : x + 6} y={Y(p) - 6} textAnchor={right ? "end" : "start"} className="m" fill={col}>{k.toUpperCase()} {f(val, 1)}</text>
          </g>
        );
      })}
      {ticks(xmax, 5).map((t) => (
        <text key={t} x={X(t)} y={T + ph + 16} textAnchor="middle" className="t">{t}</text>
      ))}
      <line x1={L} x2={W - R} y1={Y(0)} y2={Y(0)} className="a" />
      <text x={L + pw / 2} y={H - 4} textAnchor="middle" className="l">누적 % (작은 것부터)</text>
    </svg>
  );
}

function GScale({ gj, gh }: { gj: number | null; gh: number | null }) {
  const W = 420, L = 14, R = 14, pw = W - L - R;
  const X = (g: number) => L + (pw * Math.min(Math.max(g, 0), 12)) / 12;
  return (
    <svg viewBox={`0 0 ${W} 86`} className="gt-chart gt-g" role="img" aria-label="ASTM 결정립도 눈금">
      <rect x={L} y={36} width={pw} height={10} fill="#e9e9e6" />
      {Array.from({ length: 13 }, (_, g) => (
        <g key={g}>
          <line x1={X(g)} x2={X(g)} y1={46} y2={51} className="a" />
          <text x={X(g)} y={64} textAnchor="middle" className="t">{g}</text>
        </g>
      ))}
      <text x={L} y={82} className="t">← 큰 결정립</text>
      <text x={W - R} y={82} textAnchor="end" className="t">작은 결정립 →</text>
      {[[gj, "Jeffries", "#d23b3b", 12], [gh, "Heyn", "#1f2d55", 27]].map(([v, lab, col, y]) =>
        v === null ? null : (
          <g key={lab as string}>
            <line x1={X(v as number)} x2={X(v as number)} y1={(y as number) + 3} y2={48} stroke={col as string} strokeWidth={2} />
            <text x={X(v as number)} y={y as number} textAnchor="middle" className="m" fill={col as string}>{lab} {f(v as number)}</text>
          </g>
        )
      )}
    </svg>
  );
}

// ── 결과 ───────────────────────────────────────────────
function Report({ r, sample }: { r: GrainResult; sample: boolean }) {
  const [view, setView] = useState<"boundaries" | "labels">("boundaries");
  const img = r.images && r.images[view];
  const a = r.astm, c = r.counts, e = r.ecd_um, s = r.scale;
  const download = () => {
    const blob = new Blob([JSON.stringify({ ...r, images: undefined }, null, 1)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const el = document.createElement("a");
    el.href = url;
    el.download = (r.file || "grain").replace(/\.[^.]+$/, "") + "_grain.json";
    el.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <div className="gt-report">
      <p className="gt-file">
        <b>{r.file}</b>
        <span>{sample ? "미리 계산한 예시 · " : ""}{r.engine.label} · {r.engine.device} · {f(r.engine.seconds, 1)}초</span>
      </p>
      <div className="gt-cards">
        <div className="main"><b>{f(a.G_jeffries)}</b><span>ASTM G (Jeffries)</span></div>
        <div><b>{f(a.G_heyn)}</b><span>ASTM G (Heyn)</span></div>
        <div><b>{f(e.mean, 1)}<small> μm</small></b><span>평균 지름 ECD</span></div>
        <div><b>{f(e.d50, 1)}<small> μm</small></b><span>중앙값 D50</span></div>
        <div><b>{f(c.effective, 1)}</b><span>유효 결정립 (총 {c.total})</span></div>
        <div><b>{a.grade}</b><span>조직 평가</span></div>
      </div>
      <GScale gj={a.G_jeffries} gh={a.G_heyn} />
      {r.notes.length > 0 && (
        <ul className="gt-notes">
          {r.notes.map((n, i) => (
            <li key={i} className={n.level}>{n.text}</li>
          ))}
        </ul>
      )}
      {img && (
        <figure className="gt-fig">
          <div className="tabs" role="tablist" aria-label="결과 그림">
            <button type="button" role="tab" aria-selected={view === "boundaries"} onClick={() => setView("boundaries")}>찾은 결정립계</button>
            <button type="button" role="tab" aria-selected={view === "labels"} onClick={() => setView("labels")}>결정립 색 구분</button>
          </div>
          <img src={img} alt={view === "boundaries" ? "자동으로 찾은 결정립계를 빨간 선으로 겹친 사진" : "결정립마다 다른 색을 칠한 사진"} />
          <figcaption>사진의 실제 경계와 맞는지 눈으로 확인해 주세요. 놓친 경계가 많으면 G 가 작게(결정립이 크게) 나옵니다.</figcaption>
        </figure>
      )}
      {e.n > 0 && (
        <div className="gt-charts">
          <Hist r={r} />
          <Cum r={r} />
        </div>
      )}
      <table className="gt-table">
        <tbody>
          <tr><td>스케일</td><td>{f(s.um_per_px, 4)} μm/px · {s.source}</td></tr>
          <tr><td>시야</td><td>{f(r.image.fov_um[0], 0)} × {f(r.image.fov_um[1], 0)} μm ({r.image.width} × {r.image.height} px) = {f(r.image.area_mm2, 4)} mm²</td></tr>
          <tr><td>결정립 수</td><td>내부 {c.interior} · 가장자리 {c.edge} (×0.5) · 모서리 {c.corner} (×0.25) → 유효 {f(c.effective, 2)}</td></tr>
          <tr><td>Jeffries</td><td>N<sub>A</sub> = {f(a.NA_per_mm2, 1)} 개/mm² → G = 3.3219·log₁₀N<sub>A</sub> − 2.954 = {f(a.G_jeffries)}</td></tr>
          <tr><td>Heyn</td><td>시험선 {f(a.test_line_um, 0)} μm, 교차 {a.intercepts}번 → ℓ = {f(a.mean_intercept_um, 1)} μm → G = {f(a.G_heyn)}</td></tr>
          <tr><td>크기 분포</td><td>D10 {f(e.d10, 1)} · D50 {f(e.d50, 1)} · D90 {f(e.d90, 1)} μm, D90/D50 = {f(e.d90_d50)}</td></tr>
          <tr><td>가장자리 보정 없이</td><td>G = {f(a.G_uncorrected)} (잘린 결정립도 1개로 셀 때)</td></tr>
        </tbody>
      </table>
      <div className="btns">
        <button type="button" className="btn tone" onClick={download}>결과 JSON 내려받기 <i>↓</i></button>
      </div>
    </div>
  );
}

// ── 스케일바 확인 ─────────────────────────────────────
const COLOR_KO: Record<string, string> = { blue: "파란", red: "빨간", black: "검은", white: "흰" };
const CHIPS = [10, 20, 50, 100, 200, 500];

// 사진 위에 찾은(또는 그린) 스케일바를 표시하고, 그리기 모드에서는 끌어서 막대를 표시한다
function ScaleFig({ insp, box, line, draw, onDraw }: { insp: Inspect; box: Box | null; line: Line | null; draw: boolean; onDraw: (l: Line) => void }) {
  const { width: W, height: H } = insp;
  const svg = useRef<SVGSVGElement>(null);
  const [cur, setCur] = useState<Line | null>(null);
  const pt = (e: RPointerEvent) => {
    const r = svg.current!.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H };
  };
  const snap = (l: Line): Line => (Math.abs(l.y2 - l.y1) < 0.12 * Math.abs(l.x2 - l.x1) ? { ...l, y2: l.y1 } : l);
  const shown = cur || line;
  const sw = Math.max(W, H) / 400; // 화면에서 2px 안팎
  return (
    <svg
      ref={svg}
      className={"gt-pv" + (draw ? " draw" : "")}
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={draw ? "사진 위에서 스케일바 양 끝을 끌어 표시하세요" : "올린 사진과 찾은 스케일바"}
      onPointerDown={(e) => {
        if (!draw) return;
        (e.target as Element).setPointerCapture?.(e.pointerId);
        const p = pt(e);
        setCur({ x1: p.x, y1: p.y, x2: p.x, y2: p.y });
      }}
      onPointerMove={(e) => {
        if (!draw || !cur) return;
        const p = pt(e);
        setCur(snap({ ...cur, x2: p.x, y2: p.y }));
      }}
      onPointerUp={() => {
        if (cur && Math.hypot(cur.x2 - cur.x1, cur.y2 - cur.y1) >= 5) onDraw(cur);
        setCur(null);
      }}
    >
      <image href={insp.preview} x={0} y={0} width={W} height={H} preserveAspectRatio="none" />
      {box && !shown && (
        <rect x={box[2] - 2 * sw} y={box[0] - 2 * sw} width={box[3] - box[2] + 4 * sw} height={box[1] - box[0] + 4 * sw} fill="none" stroke="#1fc46b" strokeWidth={sw * 1.5} />
      )}
      {shown && (
        <g stroke="#1fc46b" strokeWidth={sw * 1.5} strokeLinecap="round">
          <line x1={shown.x1} y1={shown.y1} x2={shown.x2} y2={shown.y2} />
          {[0, 1].map((k) => {
            const x = k ? shown.x2 : shown.x1, y = k ? shown.y2 : shown.y1;
            return <line key={k} x1={x} x2={x} y1={y - 5 * sw} y2={y + 5 * sw} />;
          })}
        </g>
      )}
    </svg>
  );
}

// 스케일바 부분만 크게 (숫자를 읽고 길이를 확인하는 용도)
function ScaleZoom({ insp, box }: { insp: Inspect; box: Box }) {
  const { width: W, height: H } = insp;
  const bw = box[3] - box[2];
  // 막대와 그 위 숫자가 들어오게 자르되, 너무 높지 않게 가로:세로를 3:1 이상으로
  const y0 = Math.max(0, box[0] - Math.max(4 * (box[1] - box[0]), 0.09 * H)), y1 = Math.min(H, box[1] + 0.03 * H);
  const span = Math.min(W, Math.max(1.4 * bw, 3 * (y1 - y0)));
  const x0 = Math.max(0, Math.min(W - span, (box[2] + box[3]) / 2 - span / 2)), x1 = x0 + span;
  const sw = (x1 - x0) / 300;
  return (
    <svg className="gt-zoom" viewBox={`${x0} ${y0} ${x1 - x0} ${y1 - y0}`} role="img" aria-label="스케일바 부분 확대">
      <image href={insp.preview} x={0} y={0} width={W} height={H} preserveAspectRatio="none" />
      <rect x={box[2]} y={box[0] - sw} width={bw} height={box[1] - box[0] + 2 * sw} fill="none" stroke="#1fc46b" strokeWidth={sw * 1.5} />
    </svg>
  );
}

const lineToBox = (l: Line, H: number): Box => {
  const t = Math.max(3, Math.round(0.004 * H));
  return [Math.round(Math.min(l.y1, l.y2) - t), Math.round(Math.max(l.y1, l.y2) + t), Math.round(Math.min(l.x1, l.x2)), Math.round(Math.max(l.x1, l.x2))];
};

// ── 창 ─────────────────────────────────────────────────
export default function GrainDialog({ onClose, startWithSample }: { onClose: () => void; startWithSample?: boolean }) {
  const [phase, setPhase] = useState<Phase>("pick");
  const [server, setServer] = useState<Server>(GRAIN_API ? "checking" : "none");
  const [engine, setEngine] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [insp, setInsp] = useState<Inspect | null>(null);
  const [reading, setReading] = useState(false);
  const [px, setPx] = useState("");
  const [box, setBox] = useState<Box | null>(null);
  const [line, setLine] = useState<Line | null>(null);
  const [draw, setDraw] = useState(false);
  const [um, setUm] = useState("");
  const [result, setResult] = useState<GrainResult | null>(null);
  const [isSample, setIsSample] = useState(false);
  const [error, setError] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [drag, setDrag] = useState(false);
  const box0 = useRef<HTMLDivElement>(null);
  const umIn = useRef<HTMLInputElement>(null);
  const abort = useRef<AbortController | null>(null);

  // 열릴 때: 스크롤 잠금, Esc 로 닫기, 서버 깨우기
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const back = document.activeElement as HTMLElement | null;
    box0.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const ac = new AbortController();
    if (GRAIN_API)
      health(ac.signal).then((h) => {
        setServer(h.ok ? "up" : "down");
        setEngine(h.engine || "");
      });
    if (startWithSample) showSample();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      ac.abort();
      abort.current?.abort();
      back?.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 사진을 고르고 서버가 깨어 있으면 스케일바를 찾는다
  useEffect(() => {
    if (!file || server !== "up") return;
    const ac = new AbortController();
    setReading(true);
    setError("");
    inspectImage(file, ac.signal)
      .then((r) => {
        setInsp(r);
        if (r.engine) setEngine(r.engine);
        setLine(null);
        if (r.bar) {
          setPx(String(r.bar.length_px));
          setBox(r.bar.box);
          setDraw(false);
          window.setTimeout(() => umIn.current?.focus(), 50);
        } else {
          setPx("");
          setBox(null);
          setDraw(true);
        }
      })
      .catch((e) => {
        if (!ac.signal.aborted) setError(e instanceof Error && e.message !== "Failed to fetch" ? e.message : "사진을 분석 서버로 보내지 못했습니다. 잠시 뒤 다시 골라 주세요.");
      })
      .finally(() => !ac.signal.aborted && setReading(false));
    return () => ac.abort();
  }, [file, server]);

  const pick = (fl: FileList | null) => {
    const f0 = fl && fl[0];
    if (!f0) return;
    if (f0.size > 15 * 1024 * 1024) {
      setError("사진이 너무 큽니다. 15 MB 이하로 줄여 주세요.");
      return;
    }
    setError("");
    setInsp(null);
    setFile(f0);
  };

  const onDraw = (l: Line) => {
    if (!insp) return;
    setLine(l);
    setBox(lineToBox(l, insp.height));
    setPx(String(Math.round(Math.hypot(l.x2 - l.x1, l.y2 - l.y1))));
    setDraw(false);
    window.setTimeout(() => umIn.current?.focus(), 50);
  };

  const backToAuto = () => {
    if (!insp || !insp.bar) return;
    setLine(null);
    setBox(insp.bar.box);
    setPx(String(insp.bar.length_px));
    setDraw(false);
  };

  const pxN = parseFloat(px), umN = parseFloat(um);
  const pxOk = pxN >= 5 && pxN < 1e5, umOk = umN > 0 && umN < 1e5;
  const manual = !!insp && (!insp.bar || line !== null || pxN !== insp.bar.length_px);

  const run = async () => {
    if (!file || !pxOk || !umOk) return;
    setPhase("run");
    setElapsed(0);
    const t0 = Date.now();
    const timer = window.setInterval(() => setElapsed(Math.round((Date.now() - t0) / 1000)), 1000);
    abort.current = new AbortController();
    try {
      const r = await analyzeImage(file, { scalebarUm: String(umN), scalebarPx: manual ? pxN : undefined, barBox: box || undefined }, abort.current.signal);
      setResult(r);
      setIsSample(false);
      setPhase("done");
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(/abort/i.test(msg) ? "분석을 멈췄습니다." : msg === "Failed to fetch" ? "분석 서버에 연결하지 못했습니다. 잠시 뒤 다시 시도해 주세요." : msg);
      setPhase("error");
    } finally {
      window.clearInterval(timer);
    }
  };

  async function showSample() {
    try {
      setResult(await loadSample());
      setIsSample(true);
      setPhase("done");
    } catch (e) {
      setError("예시 결과를 불러오지 못했습니다.");
      setPhase("error");
    }
  }

  const canRun = !!file && !!insp && server === "up" && pxOk && umOk && !draw;
  const barWord = insp && insp.bar ? `${COLOR_KO[insp.bar.color] || ""} 스케일바`.trim() : "스케일바";

  return (
    <div className="gt-back" onMouseDown={(e) => e.target === e.currentTarget && phase !== "run" && onClose()}>
      <div className="gt" role="dialog" aria-modal="true" aria-labelledby="gt-h" ref={box0} tabIndex={-1}>
        <div className="gt-top">
          <h2 id="gt-h">결정립 크기 재기</h2>
          <button type="button" className="gt-x" onClick={onClose} aria-label="닫기">×</button>
        </div>

        {phase === "pick" && (
          <div className="gt-body">
            <p className="gt-lead">
              광학 현미경 사진을 올리면 결정립을 나누고 ASTM E112 방식으로 결정립도 G 와 크기 분포를 계산합니다. 크기는 사진 속 스케일바로 맞추므로 <b>스케일바가 있는 사진</b>만 잴 수 있습니다. 사진은 분석에만 쓰고 저장하지 않습니다.
            </p>
            {server === "none" && <p className="gt-status warn">사진 올려 재기는 지금 수정 중입니다. 예시 결과는 볼 수 있습니다.</p>}
            {server === "checking" && <p className="gt-status">연구실 분석 서버에 연결하는 중입니다.</p>}
            {server === "down" && <p className="gt-status warn">연구실 분석 서버가 꺼져 있거나 연결이 끊겨 지금은 잴 수 없습니다. 예시 결과는 볼 수 있습니다.</p>}
            <label
              className={"gt-drop" + (drag ? " on" : "") + (file ? " has" : "")}
              onDragOver={(e) => {
                e.preventDefault();
                setDrag(true);
              }}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDrag(false);
                pick(e.dataTransfer.files);
              }}
            >
              <input type="file" accept="image/*,.tif,.tiff" onChange={(e) => pick(e.target.files)} />
              <span>
                {file ? <b>{file.name}</b> : <b>사진을 끌어다 놓거나 눌러서 고르기</b>}
                {file ? ` · ${(file.size / 1024 / 1024).toFixed(1)} MB · 다른 사진을 고르려면 누르세요` : " jpg, png, tif, bmp · 15 MB 이하"}
              </span>
            </label>

            {file && reading && (
              <div className="gt-reading" aria-live="polite">
                <div className="gt-bar" />
                <p className="gt-hint">사진에서 스케일바를 찾는 중입니다.</p>
              </div>
            )}

            {insp && !reading && (
              <div className="gt-sc">
                <figure className="gt-sc-fig">
                  {draw && <p className="gt-draw-tip">사진 위에서 스케일바의 한쪽 끝부터 다른 쪽 끝까지 끌어 주세요.</p>}
                  <ScaleFig insp={insp} box={box} line={line} draw={draw} onDraw={onDraw} />
                  {box && !draw && <ScaleZoom insp={insp} box={box} />}
                  {box && !draw && <figcaption>초록 선이 길이를 잰 스케일바입니다. 막대 끝과 맞는지 확인해 주세요.</figcaption>}
                </figure>
                <div className="gt-sc-side">
                  <p className={"gt-status" + (insp.bar || line ? " ok" : " warn")}>
                    {line
                      ? "직접 표시한 스케일바로 잽니다."
                      : insp.bar
                      ? `${barWord}를 찾았습니다: ${insp.bar.length_px} px`
                      : "사진에서 스케일바를 찾지 못했습니다. 사진 위에서 스케일바를 끌어 표시해 주세요."}
                  </p>
                  <label className="gt-field">
                    <span>스케일바 길이 (사진 픽셀)</span>
                    <span className="gt-in">
                      <input type="number" inputMode="decimal" min="5" step="any" value={px} onChange={(e) => setPx(e.target.value)} />
                      px
                    </span>
                  </label>
                  <label className="gt-field need">
                    <span>스케일바 값 (사진 속 숫자) · 필수</span>
                    <span className="gt-in">
                      <input ref={umIn} type="number" inputMode="decimal" min="0" step="any" placeholder="예: 100" value={um} onChange={(e) => setUm(e.target.value)} aria-required="true" />
                      μm
                    </span>
                  </label>
                  <div className="gt-chips" role="group" aria-label="자주 쓰는 스케일바 값">
                    {CHIPS.map((v) => (
                      <button key={v} type="button" aria-pressed={umN === v} onClick={() => setUm(String(v))}>{v}</button>
                    ))}
                  </div>
                  <p className="gt-eq">
                    {pxOk && umOk ? (
                      <>1 px = {umN} μm ÷ {pxN} px = <b>{(umN / pxN).toFixed(4)} μm</b></>
                    ) : (
                      "스케일바 값(μm)을 넣어야 측정할 수 있습니다."
                    )}
                  </p>
                  <div className="gt-sc-acts">
                    <button type="button" className="ulink" onClick={() => setDraw(!draw)}>{draw ? "표시 그만두기" : "스케일바 다시 표시"}</button>
                    {insp.bar && line && <button type="button" className="ulink" onClick={backToAuto}>자동 인식으로 되돌리기</button>}
                  </div>
                </div>
              </div>
            )}

            {error && <p className="gt-status warn">{error}</p>}
            <div className="btns">
              <button type="button" className="btn" onClick={run} disabled={!canRun}>
                측정하기 <i>→</i>
              </button>
              <button type="button" className="ulink" onClick={showSample}>예시 결과 보기</button>
            </div>
          </div>
        )}

        {phase === "run" && (
          <div className="gt-body gt-run" aria-live="polite">
            <div className="gt-bar" />
            <p className="gt-lead">결정립을 나누는 중입니다 · {elapsed}초</p>
            <p className="gt-hint">{engine === "cellpose" ? "연구실 GPU 에서 학습한 AI 모델이 사진을 보고 있습니다. 보통 몇 초면 끝납니다." : "보통 몇 초면 끝납니다."}</p>
            <div className="btns">
              <button type="button" className="btn tone" onClick={() => abort.current?.abort()}>멈추기</button>
            </div>
          </div>
        )}

        {phase === "done" && result && (
          <div className="gt-body">
            <Report r={result} sample={isSample} />
            {GRAIN_API ? (
              <div className="btns">
                <button type="button" className="btn ink" onClick={() => { setPhase("pick"); setResult(null); }}>
                  {isSample ? "내 사진 올리기" : "다른 사진 재기"} <i>↺</i>
                </button>
              </div>
            ) : (
              <p className="gt-hint">사진을 올려 재는 기능은 지금 수정 중입니다.</p>
            )}
          </div>
        )}

        {phase === "error" && (
          <div className="gt-body">
            <p className="gt-status warn">{error}</p>
            <div className="btns">
              <button type="button" className="btn ink" onClick={() => { setError(""); setPhase("pick"); }}>돌아가기</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
