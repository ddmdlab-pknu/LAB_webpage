import { useEffect, useRef } from "react";

// 결정립 성장(조대화) 애니메이션 배경.
// 가중 보로노이 셀이 서로를 먹으며 커지고, 일정 수 이하로 줄면 처음부터 다시 시작한다.
// mode: "pastel"(밝은 배경용) | "vivid"(어두운 배경용)

type Seed = { x: number; y: number; w: number; c: number[]; a: number };

const hsl2rgb = (h: number, s: number, l: number) => {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [(f(0) * 255) | 0, (f(8) * 255) | 0, (f(4) * 255) | 0];
};

function GrainField({
  mode = "pastel",
  className = "",
}: {
  mode?: "pastel" | "vivid";
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0;
    let H = 0;
    let seeds: Seed[] = [];
    let lab = new Int16Array(0);
    let img = ctx.createImageData(1, 1);
    let raf = 0;
    let last = 0;
    let visible = true;

    const size = () => {
      const r = cv.getBoundingClientRect();
      const sc = r.width > 900 ? 6 : 5;
      W = Math.max(40, Math.round(r.width / sc));
      H = Math.max(24, Math.round(r.height / sc));
      cv.width = W;
      cv.height = H;
      img = ctx.createImageData(W, H);
      lab = new Int16Array(W * H);
    };

    const reset = () => {
      seeds = [];
      const n = Math.round((W * H) / 55);
      for (let i = 0; i < n; i++) {
        const hue = Math.random() * 360;
        seeds.push({
          x: Math.random() * W,
          y: Math.random() * H,
          w: 0,
          a: 0,
          c: mode === "pastel" ? hsl2rgb(hue, 70, 78) : hsl2rgb(hue, 88, 58),
        });
      }
    };

    const step = () => {
      const n = seeds.length;
      for (let i = 0; i < n; i++) seeds[i].a = 0;
      for (let y = 0; y < H; y++)
        for (let x = 0; x < W; x++) {
          let best = 0;
          let bd = 1e12;
          for (let i = 0; i < n; i++) {
            const s = seeds[i];
            const dx = x - s.x;
            const dy = y - s.y;
            const d = dx * dx + dy * dy - s.w;
            if (d < bd) {
              bd = d;
              best = i;
            }
          }
          lab[y * W + x] = best;
          seeds[best].a++;
        }
      const mean = (W * H) / n;
      for (let i = 0; i < n; i++) seeds[i].w += (seeds[i].a - mean) * 0.45;
      const alive = seeds.map((s) => s.a > 0);
      const data = img.data;
      const edgeV = mode === "pastel" ? 40 : 8;
      for (let y = 0; y < H; y++)
        for (let x = 0; x < W; x++) {
          const p = y * W + x;
          const l = lab[p];
          const edge =
            (x < W - 1 && lab[p + 1] !== l) || (y < H - 1 && lab[p + W] !== l);
          const q = p * 4;
          if (edge) {
            data[q] = data[q + 1] = data[q + 2] = edgeV;
          } else {
            const c = seeds[l].c;
            data[q] = c[0];
            data[q + 1] = c[1];
            data[q + 2] = c[2];
          }
          data[q + 3] = 255;
        }
      ctx.putImageData(img, 0, 0);
      seeds = seeds.filter((_, i) => alive[i]);
      if (seeds.length < Math.max(8, (W * H) / 700)) reset();
    };

    size();
    reset();
    step();

    const io =
      "IntersectionObserver" in window
        ? new IntersectionObserver((e) => {
            visible = e[0].isIntersecting;
          })
        : null;
    io?.observe(cv);

    const loop = (ts: number) => {
      if (!reduce && visible && !document.hidden && ts - last > 110) {
        last = ts;
        step();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    let rt: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(rt);
      rt = setTimeout(() => {
        size();
        reset();
        step();
      }, 200);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      io?.disconnect();
      window.removeEventListener("resize", onResize);
      clearTimeout(rt);
    };
  }, [mode]);

  return <canvas ref={ref} className={`grains ${className}`} aria-hidden="true" />;
}

export default GrainField;
