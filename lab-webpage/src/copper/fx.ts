// 새 디자인의 움직이는 그림(캔버스)들. 화면에 보일 때만 그리고, 움직임 줄이기 설정이면 멈춘 그림 한 장만 그린다.
import { useEffect, useRef } from "react";

export interface Frame {
  c: CanvasRenderingContext2D;
  w: number;
  h: number;
  t: number;
  st: any;
  reduce: boolean;
}

interface Opts {
  fps?: number;
  pixel?: number; // 값이 있으면 저해상도 픽셀 캔버스 (CSS로 늘려 부드럽게 보임)
}

export const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function useCanvas(draw: (f: Frame) => void, opts: Opts = {}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const drawRef = useRef(draw);
  drawRef.current = draw;
  const { fps = 60, pixel } = opts;

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const c = cv.getContext("2d");
    if (!c) return;
    const reduce = prefersReduced();
    const DPR = Math.min(2, window.devicePixelRatio || 1);
    const st: any = {};
    let w = 0,
      h = 0,
      vis = true,
      raf = 0,
      last = 0;
    const t0 = performance.now();
    const resize = () => {
      const r = cv.getBoundingClientRect();
      w = r.width;
      h = r.height;
      if (pixel) {
        st.W = Math.max(24, Math.round(w / pixel));
        st.H = Math.max(24, Math.round(h / pixel));
        cv.width = st.W;
        cv.height = st.H;
        st.img = c.createImageData(st.W, st.H);
      } else {
        cv.width = Math.max(1, Math.round(w * DPR));
        cv.height = Math.max(1, Math.round(h * DPR));
        c.setTransform(DPR, 0, 0, DPR, 0, 0);
      }
      st.dirty = true;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(cv);
    const io = new IntersectionObserver((e) => {
      vis = e[e.length - 1].isIntersecting;
    });
    io.observe(cv);
    // 움직임 줄이기: 초당 2번, 같은 시각(t=6)의 멈춘 그림만 다시 그린다 (데이터가 늦게 준비돼도 보이도록)
    const rate = reduce ? 2 : fps;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!vis || document.hidden) return;
      if (now - last < 1000 / rate - 2) return;
      last = now;
      if (w < 2 || h < 2) return;
      drawRef.current({ c, w, h, t: reduce ? 6 : (now - t0) / 1000, st, reduce });
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [fps, pixel]);
  return ref;
}

// 디자인 색 (copper.css 의 값과 같게 유지)
export const C = {
  bg: "#030303",
  panel: "#111110",
  fg: "244,241,236",
  copper: "201,132,79",
  sage: "143,186,163",
  gold: "228,186,126",
  mono: '"Geist Mono", "IBM Plex Mono", ui-monospace, Menlo, monospace',
  sans: '"Geist", "IBM Plex Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", system-ui, sans-serif',
};
const rgba = (rgb: string, a: number) => `rgba(${rgb},${a.toFixed(3)})`;

/* ---------- 시험 함수와 가우스 과정 (베이지안 최적화) ---------- */
export function fT(x: number) {
  return (
    0.55 * Math.sin(10 * x) * Math.exp(-0.6 * x) +
    0.35 * Math.exp(-Math.pow((x - 0.72) / 0.07, 2)) +
    0.1 * Math.cos(23 * x)
  );
}
function kern(a: number, b: number) {
  const d = (a - b) / 0.09;
  return Math.exp(-0.5 * d * d);
}
export interface GPOut {
  mu: number[];
  sd: number[];
  acq: number[];
  next: number;
}
export function gp(X: number[], Y: number[], grid: number[], kappa: number): GPOut {
  const n = X.length;
  let m = 0;
  for (let i = 0; i < n; i++) m += Y[i];
  m /= n;
  const Yc = Y.map((y) => y - m);
  const L: number[][] = [];
  for (let i = 0; i < n; i++) {
    L[i] = [];
    for (let j = 0; j <= i; j++) {
      let s = kern(X[i], X[j]) + (i === j ? 1e-4 : 0);
      for (let k = 0; k < j; k++) s -= L[i][k] * L[j][k];
      L[i][j] = i === j ? Math.sqrt(Math.max(s, 1e-9)) : s / L[j][j];
    }
  }
  const sL = (b: number[]) => {
    const x: number[] = [];
    for (let i = 0; i < n; i++) {
      let s = b[i];
      for (let k = 0; k < i; k++) s -= L[i][k] * x[k];
      x[i] = s / L[i][i];
    }
    return x;
  };
  const sLT = (b: number[]) => {
    const x: number[] = [];
    for (let i = n - 1; i >= 0; i--) {
      let s = b[i];
      for (let k = i + 1; k < n; k++) s -= L[k][i] * x[k];
      x[i] = s / L[i][i];
    }
    return x;
  };
  const al = sLT(sL(Yc));
  const out: GPOut = { mu: [], sd: [], acq: [], next: grid[0] };
  let best = -1e9;
  grid.forEach((x, g) => {
    const ks = X.map((xi) => kern(x, xi));
    let mu = m;
    for (let i = 0; i < n; i++) mu += ks[i] * al[i];
    const v = sL(ks);
    let vv = 0;
    for (let i = 0; i < n; i++) vv += v[i] * v[i];
    const sd = Math.sqrt(Math.max(1e-9, 1 - vv)) * 0.35;
    const u = mu + kappa * sd;
    out.mu[g] = mu;
    out.sd[g] = sd;
    out.acq[g] = u;
    if (u > best && !X.some((xi) => Math.abs(xi - x) < 0.006)) {
      best = u;
      out.next = x;
    }
  });
  return out;
}

/* ---------- 실험 횟수 비교 데이터 ---------- */
export const NE = 20;
export interface ChartData {
  bo: number[];
  rd: number[];
  sw: number[];
  rBO: number;
  rRD: number;
}
export function computeChart(): ChartData {
  const G: number[] = [];
  for (let i = 0; i <= 100; i++) G.push(i / 100);
  let fmax = -1e9,
    fmin = 1e9;
  for (let i = 0; i <= 400; i++) {
    const v = fT(i / 400);
    if (v > fmax) fmax = v;
    if (v < fmin) fmin = v;
  }
  const nm = (v: number) => ((v - fmin) / (fmax - fmin)) * 100;
  const bo: number[] = [],
    rd: number[] = [],
    sw: number[] = [];
  const R = 24,
    RR = 1500;
  for (let i = 0; i < NE; i++) {
    bo[i] = 0;
    rd[i] = 0;
  }
  for (let r = 0; r < R; r++) {
    const X = [Math.random(), Math.random()];
    const Y = X.map(fT);
    while (X.length < NE) {
      const nx = gp(X, Y, G, 2).next;
      X.push(nx);
      Y.push(fT(nx));
    }
    let b = -1e9;
    for (let i = 0; i < NE; i++) {
      b = Math.max(b, Y[i]);
      bo[i] += nm(b) / R;
    }
  }
  for (let r = 0; r < RR; r++) {
    let b = -1e9;
    for (let i = 0; i < NE; i++) {
      b = Math.max(b, fT(Math.random()));
      rd[i] += nm(b) / RR;
    }
  }
  let b = -1e9;
  for (let i = 0; i < NE; i++) {
    b = Math.max(b, fT(i / (NE - 1)));
    sw.push(nm(b));
  }
  const reach = (a: number[]) => {
    for (let i = 0; i < a.length; i++) if (a[i] >= 95) return i + 1;
    return 0;
  };
  return { bo, rd, sw, rBO: reach(bo), rRD: reach(rd) };
}

export function drawChart(f: Frame, data: ChartData | null, start: { t: number | null }) {
  const { c, w, h, t, reduce } = f;
  c.clearRect(0, 0, w, h);
  const Lp = 40,
    Rp = w - 10,
    T = 12,
    B = h - 26;
  const X = (i: number) => Lp + ((Rp - Lp) * i) / (NE - 1);
  const Yv = (v: number) => B - ((B - T) * (v - 40)) / 60;
  c.font = "11px " + C.mono;
  c.lineWidth = 1;
  [40, 60, 80, 100].forEach((v) => {
    c.strokeStyle = rgba(C.fg, 0.07);
    c.beginPath();
    c.moveTo(Lp, Yv(v));
    c.lineTo(Rp, Yv(v));
    c.stroke();
    c.fillStyle = rgba(C.fg, 0.42);
    c.fillText(v + "%", 0, Yv(v) + 4);
  });
  [1, 5, 10, 15, 20].forEach((n) => {
    const x = X(n - 1),
      tw = c.measureText(String(n)).width;
    c.fillStyle = rgba(C.fg, 0.42);
    c.fillText(String(n), Math.min(x - tw / 2, Rp - tw), B + 18);
  });
  if (!data) return;
  if (start.t === null) start.t = t;
  let p = reduce ? 1 : Math.min(1, (t - start.t) / 2.4);
  p = 1 - Math.pow(1 - p, 2);
  c.setLineDash([3, 4]);
  c.strokeStyle = rgba(C.sage, 0.4);
  c.beginPath();
  c.moveTo(Lp, Yv(95));
  c.lineTo(Rp, Yv(95));
  c.stroke();
  c.setLineDash([]);
  c.fillStyle = rgba(C.sage, 0.85);
  c.fillText("95%", Rp - c.measureText("95%").width, Yv(95) - 6);
  const series = (arr: number[], col: string, lw: number, dash?: number[], glow?: boolean) => {
    const upto = p * (arr.length - 1),
      n = Math.floor(upto),
      fr = upto - n;
    c.save();
    c.strokeStyle = col;
    c.lineWidth = lw;
    c.lineJoin = "round";
    if (dash) c.setLineDash(dash);
    if (glow) {
      c.shadowColor = col;
      c.shadowBlur = 12;
    }
    c.beginPath();
    for (let i = 0; i <= n; i++) {
      const x = X(i),
        y = Yv(arr[i]);
      if (i) c.lineTo(x, y);
      else c.moveTo(x, y);
    }
    let ex = X(n),
      ey = Yv(arr[n]);
    if (n < arr.length - 1) {
      ex = X(n) + (X(n + 1) - X(n)) * fr;
      ey = Yv(arr[n] + (arr[n + 1] - arr[n]) * fr);
      c.lineTo(ex, ey);
    }
    c.stroke();
    c.restore();
    return { x: ex, y: ey };
  };
  series(data.sw, rgba(C.fg, 0.32), 1.3, [4, 4]);
  series(data.rd, rgba(C.fg, 0.62), 1.7);
  const e = series(data.bo, `rgb(${C.sage})`, 2.6, undefined, true);
  c.fillStyle = `rgb(${C.sage})`;
  c.beginPath();
  c.arc(e.x, e.y, 4, 0, 7);
  c.fill();
  if (p >= 1) {
    ([
      [data.rBO, `rgb(${C.sage})`],
      [data.rRD, rgba(C.fg, 0.7)],
    ] as [number, string][]).forEach(([n, col]) => {
      if (!n) return;
      const x = X(n - 1),
        y = Yv(95);
      c.strokeStyle = col;
      c.lineWidth = 1;
      c.beginPath();
      c.moveTo(x, y);
      c.lineTo(x, B);
      c.stroke();
      c.fillStyle = col;
      c.beginPath();
      c.arc(x, y, 3, 0, 7);
      c.fill();
    });
  }
}

/* ---------- 히어로: 쌍극자 자기력선 r = L·sin²θ 를 3차원으로 돌린다 ---------- */
export interface Pointer {
  x: number;
  y: number;
  tx: number;
  ty: number;
}
export function drawMag(f: Frame, ptr: Pointer, hud?: { tilt: HTMLElement | null; az: HTMLElement | null }) {
  const { c, w, h, t } = f;
  c.clearRect(0, 0, w, h);
  ptr.x += (ptr.tx - ptr.x) * 0.05;
  ptr.y += (ptr.ty - ptr.y) * 0.05;
  const wide = w > 820;
  const cx = wide ? w * 0.7 : w * 0.66,
    cy = wide ? h * 0.48 : h * 0.3,
    S = wide ? Math.min(w * 0.36, h * 0.92) : Math.min(w * 0.7, h * 0.5);
  const spin = t * 0.07 + ptr.x * 1.1,
    tilt = 0.38 + 0.07 * Math.sin(t * 0.13) + ptr.y * 0.6,
    ct = Math.cos(tilt),
    st = Math.sin(tilt);
  const g = c.createRadialGradient(cx, cy, 0, cx, cy, S * 0.55);
  g.addColorStop(0, rgba(C.copper, 0.3));
  g.addColorStop(1, rgba(C.copper, 0));
  c.fillStyle = g;
  c.fillRect(cx - S * 0.6, cy - S * 0.6, S * 1.2, S * 1.2);
  const Ls = [0.42, 0.62, 0.86, 1.14, 1.46],
    NP = wide ? 60 : 44,
    NS = 80,
    rc = 0.06;
  c.lineWidth = 0.8;
  for (let li = 0; li < Ls.length; li++) {
    const L = Ls[li],
      th0 = Math.asin(Math.sqrt(rc / L)),
      span = Math.PI - 2 * th0;
    for (let k = 0; k < NP; k++) {
      const ph = (k / NP) * Math.PI * 2 + spin,
        cp = Math.cos(ph),
        sp = Math.sin(ph);
      const al = (0.06 + 0.32 * (0.5 - 0.5 * sp * ct)) * (1 - li * 0.11);
      c.strokeStyle = rgba(C.copper, al);
      c.beginPath();
      for (let j = 0; j <= NS; j++) {
        const th = th0 + (span * j) / NS,
          s = Math.sin(th),
          r = L * s * s,
          x = r * s * cp,
          y = r * s * sp,
          z = r * Math.cos(th),
          zp = y * st + z * ct,
          X = cx + x * S,
          Y = cy - zp * S;
        if (j) c.lineTo(X, Y);
        else c.moveTo(X, Y);
      }
      c.stroke();
    }
  }
  c.fillStyle = rgba(C.fg, 0.9);
  c.beginPath();
  c.arc(cx, cy, 2.2, 0, 7);
  c.fill();
  if (hud && hud.tilt && hud.az) {
    hud.tilt.textContent = Math.round(tilt * 57.3) + "°";
    hud.az.textContent = (((Math.round(spin * 57.3) % 360) + 360) % 360) + "°";
  }
}

/* ---------- 자구(자기 영역) 무늬: 외부 자기장에 따라 넓어지고 좁아진다 ---------- */
const waves = Array.from({ length: 7 }, (_, i) => {
  const ang = (i / 7) * Math.PI + Math.random() * 0.35;
  return { kx: Math.cos(ang), ky: Math.sin(ang), ph: Math.random() * 6.28, sp: (Math.random() - 0.5) * 0.5 };
});
export function drawDomain(f: Frame, hud?: { h: HTMLElement | null; m: HTMLElement | null }) {
  const { c, t, st } = f;
  const W = st.W,
    H = st.H,
    img: ImageData = st.img;
  if (!img) return;
  const D = img.data,
    k = (2 * Math.PI) / 9,
    Hf = 0.8 * Math.sin(t * 0.45),
    cop = C.copper.split(",").map(Number);
  let sum = 0;
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      let v = 0;
      for (let i = 0; i < 7; i++) {
        const wv = waves[i];
        v += Math.cos(k * (wv.kx * x + wv.ky * y) + wv.ph + wv.sp * t);
      }
      const m = 0.5 + 0.5 * Math.tanh((v / 2.6 + Hf) * 3),
        q = (y * W + x) * 4;
      sum += 2 * m - 1;
      D[q] = 13 + m * (cop[0] - 13);
      D[q + 1] = 12 + m * (cop[1] - 12);
      D[q + 2] = 11 + m * (cop[2] - 11);
      D[q + 3] = 255;
    }
  c.putImageData(img, 0, 0);
  if (hud && hud.h && hud.m) {
    const M = sum / (W * H);
    hud.h.textContent = (Hf >= 0 ? "+" : "") + Hf.toFixed(2);
    hud.m.textContent = (M >= 0 ? "+" : "") + M.toFixed(2);
  }
}

/* ---------- 카드 속 베이지안 최적화 ---------- */
export function drawBOCard(f: Frame, hud?: { i: HTMLElement | null; b: HTMLElement | null }) {
  const { c, w, h, t, st, reduce } = f;
  if (!st.bo) {
    const grid: number[] = [];
    for (let gi = 0; gi <= 120; gi++) grid.push(gi / 120);
    st.bo = { X: [], Y: [], grid, last: 0, fit: null as GPOut | null };
    st.reset = () => {
      st.bo.X = [0.1 + Math.random() * 0.2, 0.4 + Math.random() * 0.2];
      st.bo.Y = st.bo.X.map(fT);
      st.bo.fit = gp(st.bo.X, st.bo.Y, st.bo.grid, 2);
    };
    st.reset();
  }
  const bo = st.bo;
  if (!reduce && t - bo.last > 1.3) {
    bo.last = t;
    if (bo.X.length >= 11) st.reset();
    else {
      bo.X.push(bo.fit.next);
      bo.Y.push(fT(bo.fit.next));
      bo.fit = gp(bo.X, bo.Y, bo.grid, 2);
    }
  }
  const fit: GPOut = bo.fit;
  const l = 16,
    r = w - 16,
    top = 58,
    bot = h - 226,
    mid = top + (bot - top) * 0.68;
  const X = (x: number) => l + (r - l) * x,
    Y = (y: number) => mid - ((y + 0.55) / 1.25) * (mid - top);
  c.fillStyle = C.panel;
  c.fillRect(0, 0, w, h);
  c.strokeStyle = rgba(C.fg, 0.06);
  c.lineWidth = 1;
  for (let gx = 0; gx <= 4; gx++) {
    c.beginPath();
    c.moveTo(X(gx / 4), top - 10);
    c.lineTo(X(gx / 4), bot);
    c.stroke();
  }
  c.beginPath();
  bo.grid.forEach((x: number, g: number) => {
    const yy = Y(fit.mu[g] + fit.sd[g] * 2);
    if (g) c.lineTo(X(x), yy);
    else c.moveTo(X(x), yy);
  });
  for (let g = bo.grid.length - 1; g >= 0; g--) c.lineTo(X(bo.grid[g]), Y(fit.mu[g] - fit.sd[g] * 2));
  c.closePath();
  c.fillStyle = rgba(C.sage, 0.2);
  c.fill();
  c.setLineDash([3, 4]);
  c.strokeStyle = rgba(C.fg, 0.28);
  c.beginPath();
  bo.grid.forEach((x: number, g: number) => {
    const yy = Y(fT(x));
    if (g) c.lineTo(X(x), yy);
    else c.moveTo(X(x), yy);
  });
  c.stroke();
  c.setLineDash([]);
  c.strokeStyle = rgba(C.fg, 0.9);
  c.lineWidth = 1.8;
  c.beginPath();
  bo.grid.forEach((x: number, g: number) => {
    const yy = Y(fit.mu[g]);
    if (g) c.lineTo(X(x), yy);
    else c.moveTo(X(x), yy);
  });
  c.stroke();
  const amin = Math.min.apply(null, fit.acq),
    amax = Math.max.apply(null, fit.acq);
  c.beginPath();
  c.moveTo(X(0), bot);
  bo.grid.forEach((x: number, g: number) => c.lineTo(X(x), bot - ((fit.acq[g] - amin) / (amax - amin + 1e-9)) * (bot - mid - 12)));
  c.lineTo(X(1), bot);
  c.closePath();
  const ag = c.createLinearGradient(0, mid, 0, bot);
  ag.addColorStop(0, rgba(C.copper, 0.6));
  ag.addColorStop(1, rgba(C.copper, 0.05));
  c.fillStyle = ag;
  c.fill();
  const nx = X(fit.next),
    pulse = 0.5 + 0.5 * Math.sin(t * 6);
  c.strokeStyle = rgba(C.copper, 0.4 + 0.5 * pulse);
  c.setLineDash([2, 3]);
  c.beginPath();
  c.moveTo(nx, top - 10);
  c.lineTo(nx, bot);
  c.stroke();
  c.setLineDash([]);
  let bi = 0;
  bo.Y.forEach((y: number, i: number) => {
    if (y > bo.Y[bi]) bi = i;
  });
  bo.X.forEach((x: number, i: number) => {
    c.fillStyle = i === bi ? `rgb(${C.sage})` : rgba(C.fg, 0.95);
    c.beginPath();
    c.arc(X(x), Y(bo.Y[i]), i === bi ? 5 : 3.2, 0, 7);
    c.fill();
  });
  if (hud && hud.i && hud.b) {
    hud.i.textContent = String(bo.X.length);
    hud.b.textContent = bo.Y[bi].toFixed(3);
  }
}

/* ---------- 연구 순환도 ---------- */
const STEPS = [
  { en: "SIMULATE", ko: "계산" },
  { en: "LEARN", ko: "학습" },
  { en: "DESIGN", ko: "설계" },
  { en: "VERIFY", ko: "검증" },
];
export function drawLoop(f: Frame, onStep: (i: number) => void) {
  const { c, w, h, t, st, reduce } = f;
  const cx = w / 2,
    cy = h / 2,
    R = Math.min(w, h) * 0.42;
  c.clearRect(0, 0, w, h);
  const N = 54,
    d = R * 0.34,
    r = R * 0.5,
    rot = t * 0.05;
  c.lineWidth = 0.8;
  for (let k = 0; k < N; k++) {
    const al = (k / N) * Math.PI * 2 + rot,
      ox = cx + d * Math.cos(al),
      oy = cy + d * Math.sin(al);
    c.strokeStyle = rgba(C.copper, 0.1 + 0.16 * (0.5 + 0.5 * Math.sin(al * 2 + t * 0.6)));
    c.beginPath();
    c.arc(ox, oy, r, 0, 6.2832);
    c.stroke();
  }
  c.strokeStyle = rgba(C.fg, 0.7);
  c.lineWidth = 1.2;
  c.beginPath();
  c.arc(cx, cy, R, 0, 6.2832);
  c.stroke();
  const per = 3,
    ph = reduce ? 0 : (t / per) % 4,
    cur = Math.floor(ph),
    fr = ph - cur;
  let ease = fr < 0.6 ? 0 : (fr - 0.6) / 0.4;
  ease = ease * ease * (3 - 2 * ease);
  const na = (i: number) => -Math.PI / 2 + (i * Math.PI) / 2;
  c.fillStyle = rgba(C.fg, 0.75);
  for (let i = 0; i < 4; i++) {
    const ma = na(i) + Math.PI / 4,
      mx = cx + R * Math.cos(ma),
      my = cy + R * Math.sin(ma);
    c.save();
    c.translate(mx, my);
    c.rotate(ma + Math.PI / 2);
    c.beginPath();
    c.moveTo(4, 0);
    c.lineTo(-3, -4);
    c.lineTo(-3, 4);
    c.closePath();
    c.fill();
    c.restore();
  }
  const ta = na(cur) + (ease * Math.PI) / 2,
    tx = cx + R * Math.cos(ta),
    ty = cy + R * Math.sin(ta);
  const gg = c.createRadialGradient(tx, ty, 0, tx, ty, 26);
  gg.addColorStop(0, rgba(C.sage, 0.55));
  gg.addColorStop(1, rgba(C.sage, 0));
  c.fillStyle = gg;
  c.beginPath();
  c.arc(tx, ty, 26, 0, 7);
  c.fill();
  const fs = Math.max(13, Math.min(16, w / 32));
  for (let i = 0; i < 4; i++) {
    const a2 = na(i),
      x = cx + R * Math.cos(a2),
      y = cy + R * Math.sin(a2),
      on = i === cur;
    c.fillStyle = C.bg;
    c.beginPath();
    c.arc(x, y, 15, 0, 7);
    c.fill();
    c.strokeStyle = on ? `rgb(${C.sage})` : rgba(C.fg, 0.8);
    c.lineWidth = 1.3;
    c.beginPath();
    c.arc(x, y, 15, 0, 7);
    c.stroke();
    c.fillStyle = on ? `rgb(${C.sage})` : rgba(C.fg, 0.9);
    c.font = "500 12px " + C.mono;
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText(String(i + 1), x, y + 0.5);
    let lx = cx + (R - 50) * Math.cos(a2);
    const ly = cy + (R - 50) * Math.sin(a2);
    const align: CanvasTextAlign = i === 1 ? "right" : i === 3 ? "left" : "center";
    if (i === 1) lx = cx + R - 30;
    if (i === 3) lx = cx - R + 30;
    c.textAlign = align;
    c.font = "400 " + fs + "px " + C.sans;
    const tw = Math.max(c.measureText(STEPS[i].ko).width, 58),
      bx = align === "center" ? lx - tw / 2 : align === "right" ? lx - tw : lx;
    c.fillStyle = "rgba(3,3,3,.72)";
    c.fillRect(bx - 6, ly - fs - 4, tw + 12, fs * 2 + 8);
    c.fillStyle = on ? `rgb(${C.sage})` : rgba(C.fg, 0.55);
    c.font = "500 10px " + C.mono;
    c.fillText(STEPS[i].en, lx, ly - fs * 0.55);
    c.fillStyle = on ? rgba(C.fg, 1) : rgba(C.fg, 0.82);
    c.font = "400 " + fs + "px " + C.sans;
    c.fillText(STEPS[i].ko, lx, ly + fs * 0.5);
  }
  c.textAlign = "left";
  c.textBaseline = "alphabetic";
  if (st.cur !== cur) {
    st.cur = cur;
    onStep(cur);
  }
}

/* ---------- 지원 안내 카드: 히스테리시스 곡선을 도는 빛 ---------- */
function hystM(H: number, up: boolean) {
  const Hc = 0.32,
    ar = 0.17;
  return Math.tanh((H + (up ? -Hc : Hc)) / ar);
}
export function drawOrb(f: Frame) {
  const { c, w, h, t } = f;
  const cx = w / 2,
    cy = h / 2,
    sx = w * 0.34,
    sy = h * 0.3;
  c.fillStyle = C.bg;
  c.fillRect(0, 0, w, h);
  c.strokeStyle = rgba(C.fg, 0.08);
  c.lineWidth = 1;
  c.beginPath();
  c.moveTo(cx - sx * 1.25, cy);
  c.lineTo(cx + sx * 1.25, cy);
  c.moveTo(cx, cy - sy * 1.3);
  c.lineTo(cx, cy + sy * 1.3);
  c.stroke();
  c.font = "11px " + C.mono;
  c.fillStyle = rgba(C.fg, 0.35);
  c.fillText("H", cx + sx * 1.25 - 8, cy - 8);
  c.fillText("M", cx + 8, cy - sy * 1.3 + 12);
  c.strokeStyle = rgba(C.gold, 0.18);
  c.lineWidth = 1.4;
  c.beginPath();
  for (let k = 0; k <= 120; k++) {
    const H = -1 + (2 * k) / 120,
      M = hystM(H, true);
    if (k) c.lineTo(cx + H * sx, cy - M * sy);
    else c.moveTo(cx + H * sx, cy - M * sy);
  }
  for (let k = 0; k <= 120; k++) {
    const H = 1 - (2 * k) / 120,
      M = hystM(H, false);
    c.lineTo(cx + H * sx, cy - M * sy);
  }
  c.stroke();
  const w0 = 0.9,
    Np = 60;
  let px = 0,
    py = 0;
  for (let i = Np; i >= 0; i--) {
    const tt = t - i * 0.028,
      Hh = Math.sin(tt * w0),
      Mm = hystM(Hh, Math.cos(tt * w0) > 0),
      X = cx + Hh * sx,
      Y = cy - Mm * sy;
    if (i < Np) {
      c.strokeStyle = rgba(C.gold, 1 - i / Np);
      c.lineWidth = 3.4 * (1 - i / Np) + 0.5;
      c.beginPath();
      c.moveTo(px, py);
      c.lineTo(X, Y);
      c.stroke();
    }
    px = X;
    py = Y;
  }
  const Hn = Math.sin(t * w0),
    Mn = hystM(Hn, Math.cos(t * w0) > 0),
    gx = cx + Hn * sx,
    gy = cy - Mn * sy,
    flick = 1 + 0.08 * Math.sin(t * 13);
  const gr = c.createRadialGradient(gx, gy, 0, gx, gy, 46 * flick);
  gr.addColorStop(0, "rgba(255,236,200,.95)");
  gr.addColorStop(0.25, rgba(C.gold, 0.75));
  gr.addColorStop(1, rgba(C.copper, 0));
  c.fillStyle = gr;
  c.beginPath();
  c.arc(gx, gy, 46 * flick, 0, 7);
  c.fill();
  c.fillStyle = "rgba(255,250,240,1)";
  c.beginPath();
  c.arc(gx, gy, 3.5, 0, 7);
  c.fill();
  c.fillStyle = rgba(C.fg, 0.4);
  c.fillText("B–H loop · soft magnet", 14, h - 14);
}
