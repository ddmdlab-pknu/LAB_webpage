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

// 기기의 "움직임 줄이기" 설정(Windows 애니메이션 효과 끔 등)과 상관없이 늘 움직인다 (Lila Sciences 와 같게)
export const prefersReduced = () => false;

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

// 디자인 색 (copper.css 의 값과 같게 유지). 민트와 분홍은 자석의 두 극(S·N)으로만 쓴다.
export const C = {
  bg: "#f8f8f8",
  surface: "#eeeeee",
  ink: "10,10,10",
  muted: "95,95,95",
  accent: "31,107,58",
  mint: "195,237,206",
  pink: "248,199,201",
  sans: '"Pretendard Variable", Pretendard, -apple-system, "Apple SD Gothic Neo", "Malgun Gothic", system-ui, sans-serif',
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
  const Lp = 44,
    Rp = w - 10,
    T = 12,
    B = h - 28;
  const X = (i: number) => Lp + ((Rp - Lp) * i) / (NE - 1);
  const Yv = (v: number) => B - ((B - T) * (v - 40)) / 60;
  c.font = "13px " + C.sans;
  [40, 60, 80, 100].forEach((v) => {
    c.fillStyle = rgba(C.ink, 0.62);
    c.fillText(v + "%", 0, Yv(v) + 4);
  });
  [1, 5, 10, 15, 20].forEach((n) => {
    const x = X(n - 1),
      tw = c.measureText(String(n)).width;
    c.fillStyle = rgba(C.ink, 0.62);
    c.fillText(String(n), Math.min(x - tw / 2, Rp - tw), B + 20);
  });
  if (!data) return;
  if (start.t === null) start.t = t;
  let p = reduce ? 1 : Math.min(1, (t - start.t) / 2.4);
  p = 1 - Math.pow(1 - p, 2);
  // 95% 목표선
  c.setLineDash([3, 4]);
  c.lineWidth = 1;
  c.strokeStyle = rgba(C.ink, 0.45);
  c.beginPath();
  c.moveTo(Lp, Yv(95));
  c.lineTo(Rp, Yv(95));
  c.stroke();
  c.setLineDash([]);
  c.fillStyle = rgba(C.ink, 0.75);
  c.fillText("95%", Rp - c.measureText("95%").width, Yv(95) - 7);
  const series = (arr: number[], col: string, lw: number, dash?: number[]) => {
    const upto = p * (arr.length - 1),
      n = Math.floor(upto),
      fr = upto - n;
    c.save();
    c.strokeStyle = col;
    c.lineWidth = lw;
    c.lineJoin = "round";
    if (dash) c.setLineDash(dash);
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
  series(data.sw, rgba(C.ink, 0.38), 1.4, [4, 4]);
  series(data.rd, rgba(C.muted, 1), 1.8);
  const e = series(data.bo, rgba(C.ink, 1), 3);
  c.fillStyle = rgba(C.ink, 1);
  c.beginPath();
  c.arc(e.x, e.y, 4.5, 0, 7);
  c.fill();
  if (p >= 1) {
    ([
      [data.rBO, rgba(C.ink, 1)],
      [data.rRD, rgba(C.muted, 1)],
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
      c.arc(x, y, 3.5, 0, 7);
      c.fill();
    });
  }
}

/* ---------- 쌍극자 자기력선 r = L·sin²θ 를 3차원으로 돌린다 ----------
   첫 화면: 분홍(N)·민트(S) 두 면 위에 축을 세워 옆에서 본다.
   지원 안내: 같은 자석을 위에서 내려다본다 (view: "top"). */
export interface Pointer {
  x: number;
  y: number;
  tx: number;
  ty: number;
}
export interface MagView {
  view?: "side" | "top";
}
export function drawMag(
  f: Frame,
  ptr: Pointer,
  hud?: { tilt: HTMLElement | null; az: HTMLElement | null },
  opt: MagView = {}
) {
  const { c, w, h, t } = f;
  c.clearRect(0, 0, w, h);
  ptr.x += (ptr.tx - ptr.x) * 0.05;
  ptr.y += (ptr.ty - ptr.y) * 0.05;
  const top = opt.view === "top";
  const cx = top ? w * 0.52 : w * 0.5,
    cy = top ? h * 0.62 : h * 0.5,
    S = top ? Math.max(w, h) * 0.5 : Math.min(w * 0.62, h * 0.5);
  const spin = t * 0.07 + ptr.x * 1.1,
    tilt = top ? 1.18 + 0.05 * Math.sin(t * 0.11) + ptr.y * 0.3 : 0.36 + 0.07 * Math.sin(t * 0.13) + ptr.y * 0.6,
    ct = Math.cos(tilt),
    st = Math.sin(tilt);
  const Ls = [0.42, 0.62, 0.86, 1.14, 1.46],
    NP = w > 520 ? 56 : 40,
    NS = 80,
    rc = 0.06;
  c.lineWidth = top ? 0.9 : 0.85;
  for (let li = 0; li < Ls.length; li++) {
    const L = Ls[li],
      th0 = Math.asin(Math.sqrt(rc / L)),
      span = Math.PI - 2 * th0;
    for (let k = 0; k < NP; k++) {
      const ph = (k / NP) * Math.PI * 2 + spin,
        cp = Math.cos(ph),
        sp = Math.sin(ph);
      // 앞쪽 선은 진하게, 뒤쪽 선은 옅게 (깊이감)
      const al = (0.1 + 0.42 * (0.5 - 0.5 * sp * ct)) * (1 - li * 0.11);
      c.strokeStyle = rgba(C.ink, al);
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
  // 가운데 막대자석: 위가 N, 아래가 S
  const bl = S * 0.1 * Math.max(0.25, Math.abs(ct)),
    bw = Math.max(8, S * 0.035);
  c.fillStyle = rgba(C.ink, 1);
  c.fillRect(cx - bw / 2, cy - bl, bw, bl * 2);
  if (!top && bl > 14) {
    c.fillStyle = "#ffffff";
    c.font = "600 13px " + C.sans;
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText("N", cx, cy - bl / 2);
    c.fillText("S", cx, cy + bl / 2);
    c.textAlign = "left";
    c.textBaseline = "alphabetic";
  }
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
    up = C.pink.split(",").map(Number),
    dn = C.mint.split(",").map(Number);
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
      // 위로 향한 자구는 분홍, 아래로 향한 자구는 민트, 경계는 검게
      const edge = Math.max(0, 1 - Math.abs(2 * m - 1) * 3.2);
      for (let ch = 0; ch < 3; ch++) D[q + ch] = (dn[ch] + m * (up[ch] - dn[ch])) * (1 - edge * 0.85) + 10 * edge * 0.85;
      D[q + 3] = 255;
    }
  c.putImageData(img, 0, 0);
  if (hud && hud.h && hud.m) {
    const M = sum / (W * H);
    hud.h.textContent = (Hf >= 0 ? "+" : "") + Hf.toFixed(2);
    hud.m.textContent = (M >= 0 ? "+" : "") + M.toFixed(2);
  }
}

/* ---------- 베이지안 최적화가 관측점을 하나씩 더하는 그림 ---------- */
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
  const l = 20,
    r = w - 20,
    top = h * 0.12,
    bot = h * 0.9,
    mid = top + (bot - top) * 0.68;
  const X = (x: number) => l + (r - l) * x,
    Y = (y: number) => mid - ((y + 0.55) / 1.25) * (mid - top);
  c.fillStyle = C.surface;
  c.fillRect(0, 0, w, h);
  // 불확실성 띠 (민트)
  c.beginPath();
  bo.grid.forEach((x: number, g: number) => {
    const yy = Y(fit.mu[g] + fit.sd[g] * 2);
    if (g) c.lineTo(X(x), yy);
    else c.moveTo(X(x), yy);
  });
  for (let g = bo.grid.length - 1; g >= 0; g--) c.lineTo(X(bo.grid[g]), Y(fit.mu[g] - fit.sd[g] * 2));
  c.closePath();
  c.fillStyle = rgba(C.mint, 1);
  c.fill();
  // 실제 함수 (점선)
  c.setLineDash([3, 4]);
  c.lineWidth = 1;
  c.strokeStyle = rgba(C.ink, 0.4);
  c.beginPath();
  bo.grid.forEach((x: number, g: number) => {
    const yy = Y(fT(x));
    if (g) c.lineTo(X(x), yy);
    else c.moveTo(X(x), yy);
  });
  c.stroke();
  c.setLineDash([]);
  // 예측 평균
  c.strokeStyle = rgba(C.ink, 0.95);
  c.lineWidth = 2;
  c.beginPath();
  bo.grid.forEach((x: number, g: number) => {
    const yy = Y(fit.mu[g]);
    if (g) c.lineTo(X(x), yy);
    else c.moveTo(X(x), yy);
  });
  c.stroke();
  // 획득 함수 (분홍)
  const amin = Math.min.apply(null, fit.acq),
    amax = Math.max.apply(null, fit.acq);
  c.beginPath();
  c.moveTo(X(0), bot);
  bo.grid.forEach((x: number, g: number) => c.lineTo(X(x), bot - ((fit.acq[g] - amin) / (amax - amin + 1e-9)) * (bot - mid - 12)));
  c.lineTo(X(1), bot);
  c.closePath();
  c.fillStyle = rgba(C.pink, 1);
  c.fill();
  // 다음에 해 볼 조건
  const nx = X(fit.next);
  c.strokeStyle = rgba(C.ink, 0.7);
  c.lineWidth = 1;
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
    c.fillStyle = i === bi ? `rgb(${C.accent})` : rgba(C.ink, 0.95);
    c.beginPath();
    c.arc(X(x), Y(bo.Y[i]), i === bi ? 6 : 3.5, 0, 7);
    c.fill();
  });
  if (hud && hud.i && hud.b) {
    hud.i.textContent = String(bo.X.length);
    hud.b.textContent = bo.Y[bi].toFixed(3);
  }
}
