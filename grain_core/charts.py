"""리포트용 SVG 그래프 (글꼴은 브라우저가 그리므로 한글이 깨지지 않는다)."""
from __future__ import annotations

import math


def _nice_ticks(lo, hi, n=5):
    if hi <= lo:
        hi = lo + 1
    raw = (hi - lo) / n
    mag = 10 ** math.floor(math.log10(raw))
    step = min((s * mag for s in (1, 2, 2.5, 5, 10) if s * mag >= raw), default=mag * 10)
    start = math.ceil(lo / step) * step
    out, v = [], start
    while v <= hi + 1e-9:
        out.append(round(v, 10))
        v += step
    return out


def _fmt(v):
    return f"{v:g}" if abs(v) < 1e4 else f"{v:.0f}"


def histogram(dist: dict, xlabel="ECD (μm)", ylabel="결정립 수", w=560, h=300, color="#2f6db5", marks=None) -> str:
    counts, edges = dist["hist_counts"], dist["hist_edges"]
    L, R, T, B = 52, 16, 16, 44
    pw, ph = w - L - R, h - T - B
    xmax = edges[-1]
    ymax = max(counts) if counts else 1
    yt = _nice_ticks(0, ymax * 1.1, 4)
    ytop = yt[-1] if yt[-1] >= ymax else ymax
    X = lambda v: L + pw * v / xmax
    Y = lambda v: T + ph * (1 - v / ytop)
    s = [f'<svg viewBox="0 0 {w} {h}" class="chart" role="img" aria-label="{ylabel} 히스토그램">']
    for t in yt:
        s.append(f'<line x1="{L}" x2="{w - R}" y1="{Y(t):.1f}" y2="{Y(t):.1f}" class="grid"/>'
                 f'<text x="{L - 6}" y="{Y(t) + 4:.1f}" text-anchor="end" class="tick">{_fmt(t)}</text>')
    for i, c in enumerate(counts):
        if c:
            x0, x1 = X(edges[i]), X(edges[i + 1])
            s.append(f'<rect x="{x0 + 0.5:.1f}" y="{Y(c):.1f}" width="{max(x1 - x0 - 1, 1):.1f}" height="{Y(0) - Y(c):.1f}" fill="{color}"/>')
    for t in _nice_ticks(0, xmax, 6):
        s.append(f'<text x="{X(t):.1f}" y="{T + ph + 18}" text-anchor="middle" class="tick">{_fmt(t)}</text>')
    s.append(f'<line x1="{L}" x2="{w - R}" y1="{Y(0):.1f}" y2="{Y(0):.1f}" class="axis"/>')
    for k, (val, label, col) in enumerate(marks or []):
        if val == val:
            x = X(val)
            right = x > L + pw * 0.7
            s.append(f'<line x1="{x:.1f}" x2="{x:.1f}" y1="{T}" y2="{T + ph}" stroke="{col}" stroke-width="2" stroke-dasharray="5 3"/>'
                     f'<text x="{x - 4 if right else x + 4:.1f}" y="{T + 12 + 16 * k}" text-anchor="{"end" if right else "start"}" class="mark" fill="{col}">{label}</text>')
    s.append(f'<text x="{L + pw / 2}" y="{h - 6}" text-anchor="middle" class="lab">{xlabel}</text>'
             f'<text x="14" y="{T + ph / 2}" text-anchor="middle" class="lab" transform="rotate(-90 14 {T + ph / 2})">{ylabel}</text></svg>')
    return "".join(s)


def cumulative(dist: dict, xlabel="ECD (μm)", w=560, h=300) -> str:
    v = dist["sorted"]
    n = len(v)
    L, R, T, B = 52, 16, 16, 44
    pw, ph = w - L - R, h - T - B
    xmax = dist["max"] * 1.05
    X = lambda x: L + pw * x / xmax
    Y = lambda p: T + ph * (1 - p / 100)
    s = [f'<svg viewBox="0 0 {w} {h}" class="chart" role="img" aria-label="누적 분포">']
    for t in (0, 25, 50, 75, 100):
        s.append(f'<line x1="{L}" x2="{w - R}" y1="{Y(t):.1f}" y2="{Y(t):.1f}" class="grid"/>'
                 f'<text x="{L - 6}" y="{Y(t) + 4:.1f}" text-anchor="end" class="tick">{t}</text>')
    pts = [f"{X(0):.1f},{Y(0):.1f}"]
    for i, x in enumerate(v):
        pts.append(f"{X(x):.1f},{Y(i / n * 100):.1f}")
        pts.append(f"{X(x):.1f},{Y((i + 1) / n * 100):.1f}")
    s.append(f'<polyline points="{" ".join(pts)}" fill="none" stroke="#1f2d55" stroke-width="2"/>')
    for key, pct, col in (("d10", 10, "#8a8f96"), ("d50", 50, "#d23b3b"), ("d90", 90, "#e08a1e")):
        x = X(dist[key])
        s.append(f'<line x1="{L}" x2="{x:.1f}" y1="{Y(pct):.1f}" y2="{Y(pct):.1f}" stroke="{col}" stroke-dasharray="4 3"/>'
                 f'<line x1="{x:.1f}" x2="{x:.1f}" y1="{Y(pct):.1f}" y2="{Y(0):.1f}" stroke="{col}" stroke-dasharray="4 3"/>'
                 f'<circle cx="{x:.1f}" cy="{Y(pct):.1f}" r="4" fill="{col}"/>'
                 f'<text x="{x - 6 if x > L + pw * 0.7 else x + 6:.1f}" y="{Y(pct) - 6:.1f}" text-anchor="{"end" if x > L + pw * 0.7 else "start"}" class="mark" fill="{col}">{key.upper()} {dist[key]:.1f}</text>')
    for t in _nice_ticks(0, xmax, 6):
        s.append(f'<text x="{X(t):.1f}" y="{T + ph + 18}" text-anchor="middle" class="tick">{_fmt(t)}</text>')
    s.append(f'<line x1="{L}" x2="{w - R}" y1="{Y(0):.1f}" y2="{Y(0):.1f}" class="axis"/>'
             f'<text x="{L + pw / 2}" y="{h - 6}" text-anchor="middle" class="lab">{xlabel}</text>'
             f'<text x="14" y="{T + ph / 2}" text-anchor="middle" class="lab" transform="rotate(-90 14 {T + ph / 2})">누적 %</text></svg>')
    return "".join(s)


def g_scale(G_j: float, G_h: float, w=900, h=96, gmin=0, gmax=12) -> str:
    L, R = 20, 20
    pw = w - L - R
    X = lambda g: L + pw * (min(max(g, gmin), gmax) - gmin) / (gmax - gmin)
    s = [f'<svg viewBox="0 0 {w} {h}" class="chart gscale" role="img" aria-label="ASTM G 눈금">']
    s.append(f'<defs><linearGradient id="gg" x1="0" x2="1"><stop offset="0" stop-color="#e8e1d2"/><stop offset="1" stop-color="#cfe0f2"/></linearGradient></defs>')
    s.append(f'<rect x="{L}" y="40" width="{pw}" height="14" fill="url(#gg)"/>')
    for g in range(gmin, gmax + 1):
        s.append(f'<line x1="{X(g):.1f}" x2="{X(g):.1f}" y1="54" y2="60" class="axis"/><text x="{X(g):.1f}" y="74" text-anchor="middle" class="tick">{g}</text>')
    s.append(f'<text x="{L}" y="90" class="tick">← 조대립 (큰 결정립)</text><text x="{w - R}" y="90" text-anchor="end" class="tick">미세립 (작은 결정립) →</text>')
    for val, lab, col, up in ((G_j, "Jeffries", "#d23b3b", True), (G_h, "Heyn", "#1f2d55", False)):
        if val == val:
            x = X(val)
            y = 14 if up else 30
            s.append(f'<line x1="{x:.1f}" x2="{x:.1f}" y1="{y + 4}" y2="56" stroke="{col}" stroke-width="2"/>'
                     f'<text x="{x:.1f}" y="{y}" text-anchor="middle" class="mark" fill="{col}">{lab} {val:.2f}</text>')
    s.append("</svg>")
    return "".join(s)
