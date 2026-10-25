// 결정립 크기 분석 서버(ddmd_grain/web/server.py)와 주고받기. 응답 형식은 ddmd-grain/1.

// 분석 서버 주소. 서버를 띄운 뒤 여기에 넣거나, 빌드 환경 변수 REACT_APP_GRAIN_API 로 준다.
const DEFAULT_API = "";
export const GRAIN_API = (process.env.REACT_APP_GRAIN_API || DEFAULT_API).replace(/\/+$/, "");

export type Note = { level: "ok" | "info" | "warn"; text: string };
export type GrainResult = {
  schema: string;
  file: string;
  measured_at: string;
  engine: { name: string; label: string; model: string; device: string; diameter_px: number | null; seconds: number };
  scale: { um_per_px: number; method: string; source: string; scalebar_um: number | null; scalebar_px: number | null; magnification: string | null };
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

export type Options = { scalebarUm?: string; umPerPx?: string; magnification?: string };

function withTimeout(ms: number, outer?: AbortSignal) {
  const c = new AbortController();
  const t = window.setTimeout(() => c.abort(), ms);
  if (outer) outer.addEventListener("abort", () => c.abort());
  return { signal: c.signal, done: () => window.clearTimeout(t) };
}

export async function health(outer?: AbortSignal): Promise<{ ok: boolean; engine?: string; device?: string }> {
  if (!GRAIN_API) return { ok: false };
  // 무료 서버는 잠들어 있다가 깨는 데 1~2분 걸릴 수 있다
  const t = withTimeout(150000, outer);
  try {
    const r = await fetch(GRAIN_API + "/health", { signal: t.signal });
    return r.ok ? await r.json() : { ok: false };
  } catch (e) {
    return { ok: false };
  } finally {
    t.done();
  }
}

export async function analyzeImage(file: File, o: Options, outer?: AbortSignal): Promise<GrainResult> {
  const fd = new FormData();
  fd.append("file", file);
  if (o.scalebarUm) fd.append("scalebar_um", o.scalebarUm);
  if (o.umPerPx) fd.append("um_per_px", o.umPerPx);
  if (o.magnification) fd.append("magnification", o.magnification);
  const t = withTimeout(300000, outer);
  try {
    const r = await fetch(GRAIN_API + "/analyze", { method: "POST", body: fd, signal: t.signal });
    if (!r.ok) {
      let msg = `분석 서버 오류 (${r.status})`;
      try {
        const j = await r.json();
        if (j && j.detail) msg = String(j.detail);
      } catch (e) {
        /* 본문이 JSON 이 아님 */
      }
      throw new Error(msg);
    }
    return (await r.json()) as GrainResult;
  } finally {
    t.done();
  }
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
