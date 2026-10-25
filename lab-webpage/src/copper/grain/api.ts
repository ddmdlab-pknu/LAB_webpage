// 결정립 크기 분석 서버와 주고받기. 서버는 연구실 GPU PC 에서 도는 ddmd_grain/web/server.py (FastAPI),
// 외부에서는 Tailscale Funnel 주소로 들어온다. 응답 형식은 ddmd-grain/1.
//   GET  /health   POST /inspect (사진 → 스케일바)   POST /analyze (사진 + 스케일바 값 → 결과)

// 분석 서버 주소. 빌드 환경 변수 REACT_APP_GRAIN_API 로 바꿀 수 있다.
const DEFAULT_API = "";
export const GRAIN_API = (process.env.REACT_APP_GRAIN_API || DEFAULT_API).replace(/\/+$/, "");

export type Note = { level: "ok" | "info" | "warn"; text: string };
export type GrainResult = {
  schema: string;
  file: string;
  measured_at: string;
  engine: { name: string; label: string; model: string; device: string; diameter_px: number | null; seconds: number };
  scale: { um_per_px: number; method: string; source: string; scalebar_um: number | null; scalebar_px: number | null; bar_found?: string | null };
  image: { width: number; height: number; fov_um: [number, number]; area_mm2: number; resized: number };
  astm: {
    G_jeffries: number | null;
    G_heyn: number | null;
    G_uncorrected: number | null;
    NA_per_mm2: number | null;
    mean_area_um2: number | null;
    mean_intercept_um: number | null;
    intercepts: number;
    test_line_um: number;
    grade: string;
  };
  counts: { total: number; interior: number; edge: number; corner: number; effective: number };
  ecd_um: { n: number; mean: number | null; median: number | null; std: number | null; min: number | null; max: number | null; d10: number | null; d50: number | null; d90: number | null; d90_d50: number | null };
  histogram: { edges: number[]; counts: number[] };
  cumulative: number[];
  notes: Note[];
  images?: { boundaries?: string; labels?: string };
};

// 사진에서 찾은 스케일바. box 는 원본 픽셀 기준 [y1, y2, x1, x2]
export type Bar = { box: [number, number, number, number]; length_px: number; color: string };
export type Inspect = { width: number; height: number; preview: string; preview_scale: number; engine?: string; bar: Bar | null };
export type Options = { scalebarUm: string; scalebarPx?: number; barBox?: [number, number, number, number] };

function withTimeout(ms: number, outer?: AbortSignal) {
  const c = new AbortController();
  const t = window.setTimeout(() => c.abort(), ms);
  if (outer) outer.addEventListener("abort", () => c.abort());
  return { signal: c.signal, done: () => window.clearTimeout(t) };
}

async function post<T>(path: string, fd: FormData, ms: number, outer?: AbortSignal): Promise<T> {
  const t = withTimeout(ms, outer);
  try {
    const r = await fetch(GRAIN_API + path, { method: "POST", body: fd, signal: t.signal });
    if (!r.ok) {
      let msg = r.status === 503 ? "지금 다른 사진을 분석하고 있습니다. 잠시 뒤 다시 시도해 주세요." : `분석 서버 오류 (${r.status})`;
      try {
        const j = await r.json();
        if (j && j.detail) msg = String(j.detail);
      } catch (e) {
        /* 본문이 JSON 이 아님 */
      }
      throw new Error(msg);
    }
    return (await r.json()) as T;
  } finally {
    t.done();
  }
}

export type Health = { ok: boolean; engine?: string; device?: string };

export async function health(outer?: AbortSignal): Promise<Health> {
  if (!GRAIN_API) return { ok: false };
  const t = withTimeout(15000, outer);
  try {
    const r = await fetch(GRAIN_API + "/health", { signal: t.signal });
    return r.ok ? await r.json() : { ok: false };
  } catch (e) {
    return { ok: false };
  } finally {
    t.done();
  }
}

// 사진을 읽어 미리보기와 스케일바 위치를 받는다 (모델을 쓰지 않아 금방 끝난다)
export function inspectImage(file: File, outer?: AbortSignal): Promise<Inspect> {
  const fd = new FormData();
  fd.append("file", file);
  return post<Inspect>("/inspect", fd, 120000, outer);
}

export function analyzeImage(file: File, o: Options, outer?: AbortSignal): Promise<GrainResult> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("scalebar_um", o.scalebarUm);
  if (o.scalebarPx) fd.append("scalebar_px", String(o.scalebarPx));
  if (o.barBox) fd.append("bar_box", o.barBox.join(","));
  return post<GrainResult>("/analyze", fd, 300000, outer);
}

// 미리 계산해 둔 예시 결과 (public/grain/sample.json)
export async function loadSample(): Promise<GrainResult> {
  const r = await fetch("/grain/sample.json");
  const j = (await r.json()) as GrainResult;
  const im = j.images || {};
  j.images = {
    boundaries: im.boundaries && "/grain/" + im.boundaries,
    labels: im.labels && "/grain/" + im.labels,
  };
  return j;
}
