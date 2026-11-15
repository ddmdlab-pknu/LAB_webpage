import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { banners, popup } from "../data/bannerData";

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

// 첫 화면 그림 위쪽에 얹는 소식 카드: 사진 · 꼬리표 · 날짜 · 제목. 여러 개면 6초마다 넘어간다
export default function NoticeBanner({ mobile = false }: { mobile?: boolean }) {
  const list = banners.filter((b) => b.until >= today());
  const [i, setI] = useState(0);
  const [hold, setHold] = useState(false);
  useEffect(() => {
    if (list.length < 2 || hold) return;
    const t = window.setTimeout(() => setI((n) => (n + 1) % list.length), 6000);
    return () => window.clearTimeout(t);
  }, [i, hold, list.length]);
  if (!list.length) return null;
  const b = list[i % list.length];
  const inner = (
    <>
      {b.img && <img className="nb-img" src={b.img} alt="" />}
      <span className="nb-text">
        <span className="nb-meta">
          <span className="nb-label">{b.label}</span>
          {b.date}
        </span>
        <span className="nb-title">{b.title}</span>
      </span>
      <i className="nb-go" aria-hidden="true">
        →
      </i>
    </>
  );
  return (
    <div
      className={mobile ? "nb nb-m" : "nb nb-d"}
      role="region"
      aria-label="최근 소식"
      aria-live="polite"
      onPointerEnter={() => setHold(true)}
      onPointerLeave={() => setHold(false)}
    >
      {/^https?:/.test(b.to) ? (
        <a key={i} className="nb-card" href={b.to} target="_blank" rel="noreferrer">
          {inner}
        </a>
      ) : (
        <Link key={i} className="nb-card" to={b.to}>
          {inner}
        </Link>
      )}
      {list.length > 1 && (
        <div className="nb-dots">
          {list.map((x, k) => (
            <button
              key={x.title}
              type="button"
              className={k === i % list.length ? "on" : ""}
              aria-label={`${k + 1}번째 소식: ${x.title}`}
              onClick={() => setI(k)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const KEY = "ddmd-popup-hide";
const hiddenToday = (id: string) => {
  try {
    return window.localStorage.getItem(KEY) === `${id}@${today()}`;
  } catch (e) {
    return false;
  }
};

// 첫 방문 팝업: 닫기, 오늘 하루 보지 않기, 자세히 보기
export function NoticePopup() {
  const [open, setOpen] = useState(false);
  const go = useNavigate();
  useEffect(() => {
    if (!popup || popup.until < today() || hiddenToday(popup.id)) return;
    const t = window.setTimeout(() => setOpen(true), 900);
    return () => window.clearTimeout(t);
  }, []);
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open]);
  if (!open || !popup) return null;
  const p = popup;
  const hideToday = () => {
    try {
      window.localStorage.setItem(KEY, `${p.id}@${today()}`);
    } catch (e) {
      // 저장이 막힌 브라우저에서는 이번에만 닫는다
    }
    setOpen(false);
  };
  return (
    <div className="np" onClick={() => setOpen(false)}>
      <div className="np-box" role="dialog" aria-modal="true" aria-labelledby="np-title" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="np-x" aria-label="닫기" onClick={() => setOpen(false)}>
          ×
        </button>
        {p.img && <img className="np-img" src={p.img} alt="" />}
        <div className="np-in">
          <span className="np-label">{p.label}</span>
          <h2 id="np-title" className="np-title">
            {p.title}
          </h2>
          <p className="np-desc">{p.desc}</p>
        </div>
        <div className="np-foot">
          <button type="button" className="np-skip" onClick={hideToday}>
            오늘 하루 보지 않기
          </button>
          <button
            type="button"
            className="np-go"
            onClick={() => {
              setOpen(false);
              go(p.to);
            }}
          >
            {p.cta} →
          </button>
        </div>
      </div>
    </div>
  );
}
