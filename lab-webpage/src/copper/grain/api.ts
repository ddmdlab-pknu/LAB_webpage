// 결정립 크기 분석 서버와 주고받기. 서버는 Hugging Face Space(Gradio + ZeroGPU)의 ddmd_grain/app.py,
// 응답 형식은 ddmd-grain/1. Gradio API 순서: 사진 올리기(/gradio_api/upload) → 호출(/gradio_api/call/이름)
// → 결과 받기(server-sent events).

// 분석 서버 주소. 빌드 환경 변수 REACT_APP_GRAIN_API 로 바꿀 수 있다.
const DEFAULT_API = "https://semin84-ddmd-grain.hf.space";
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
// 서버에 올려 둔 사진 (서버는 15분 뒤 지운다)
export type Uploaded = { path: string; name: string; at: number };

function withTimeout(ms: number, outer?: AbortSignal) {
  const c = new AbortController();
  const t = window.setTimeout(() => c.abort(), ms);
  if (outer) outer.addEventListener("abort", () => c.abort());
  return { signal: c.signal, done: () => window.clearTimeout(t) };
}

const SERVER_ERR = "분석 서버에서 오류가 났습니다. 잠시 뒤 다시 시도해 주세요.";

// Gradio 함수 하나를 부르고 결과를 기다린다. 서버가 {"error": "..."} 를 주면 그 문장으로 오류를 낸다.
async function call<T>(name: string, data: unknown[], ms: number, outer?: AbortSignal): Promise<T> {
  const t = withTimeout(ms, outer);
  try {
    const r = await fetch(`${GRAIN_API}/gradio_api/call/${name}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data }),
      signal: t.signal,
    });
    if (!r.ok) throw new Error(r.status === 429 ? "지금 기다리는 사람이 많습니다. 잠시 뒤 다시 시도해 주세요." : `${SERVER_ERR} (${r.status})`);
    const { event_id } = await r.json();
    const text = await (await fetch(`${GRAIN_API}/gradio_api/call/${name}/${event_id}`, { signal: t.signal })).text();
    let out: unknown;
    for (const block of text.split(/\r?\n\r?\n/)) {
      let ev = "", dat = "";
      for (const line of block.split(/\r?\n/)) {
        if (line.startsWith("event:")) ev = line.slice(6).trim();
        else if (line.startsWith("data:")) dat += line.slice(5).trim();
      }
      if (ev === "complete" && dat) out = JSON.parse(dat);
    }
    const v = (Array.isArray(out) ? out[0] : out) as (T & { error?: string }) | undefined;
    if (!v) throw new Error(SERVER_ERR);
    if (v.error) throw new Error(v.error);
    return v;
  } finally {
    t.done();
  }
}

export type Health = { ok: boolean; engine?: string; device?: string };

export async function health(outer?: AbortSignal): Promise<Health> {
  if (!GRAIN_API) return { ok: false };
  // 무료 서버는 잠들어 있다가 깨는 데 1~2분 걸릴 수 있다
  try {
    return await call<Health>("health", [], 150000, outer);
  } catch (e) {
    return { ok: false };
  }
}

export async function uploadImage(file: File, outer?: AbortSignal): Promise<Uploaded> {
  const t = withTimeout(120000, outer);
  try {
    const fd = new FormData();
    fd.append("files", file);
    const r = await fetch(`${GRAIN_API}/gradio_api/upload`, { method: "POST", body: fd, signal: t.signal });
    if (!r.ok) throw new Error(r.status === 413 ? "사진이 너무 큽니다. 15 MB 이하로 줄여 주세요." : `사진을 올리지 못했습니다 (${r.status}).`);
    const paths = (await r.json()) as string[];
    return { path: paths[0], name: file.name, at: Date.now() };
  } finally {
    t.done();
  }
}

const fileRef = (u: Uploaded) => ({ path: u.path, orig_name: u.name, meta: { _type: "gradio.FileData" } });

// 사진의 미리보기와 스케일바 위치를 받는다 (모델을 쓰지 않아 몇 초)
export function inspectImage(u: Uploaded, outer?: AbortSignal): Promise<Inspect> {
  return call<Inspect>("inspect", [fileRef(u)], 120000, outer);
}

export function analyzeImage(u: Uploaded, o: Options, outer?: AbortSignal): Promise<GrainResult> {
  return call<GrainResult>("analyze", [fileRef(u), o.scalebarUm, o.scalebarPx ? String(o.scalebarPx) : "", o.barBox ? o.barBox.join(",") : ""], 300000, outer);
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
