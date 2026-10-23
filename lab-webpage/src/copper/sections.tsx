// 첫 화면과 하위 페이지가 같이 쓰는 큰 덩어리들
import { CSSProperties, ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { PublicationItem, journalImpactFactors, journalQuartiles, publicationsData as papers } from "../data/papersData";
import { NewsItem } from "../data/newsData";
import { career, honors, patents, piProfile, piSelectedPapers } from "../data/piData";
import { ChartData, computeChart, drawBOCard, drawChart, drawDomain, drawMag, Pointer, prefersReduced, useCanvas } from "./fx";
import { catLabel } from "./ui";

/* ---------- 작은 도구 ---------- */
export function useMedia(q: string) {
  const get = () => typeof window !== "undefined" && !!window.matchMedia && window.matchMedia(q).matches;
  const [m, setM] = useState(get);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const on = () => setM(mq.matches);
    on();
    mq.addEventListener ? mq.addEventListener("change", on) : mq.addListener(on);
    return () => (mq.removeEventListener ? mq.removeEventListener("change", on) : mq.removeListener(on));
  }, [q]);
  return m;
}

// 자석 무늬: 위 분홍(N), 아래 민트(S). 사진이 없는 자리의 표시와 목록 머리표로 쓴다
export function Mark({ size }: { size?: number }) {
  return <i className="mark" aria-hidden="true" style={size ? ({ "--mk": size + "px" } as CSSProperties) : undefined} />;
}

// 반복 재생 영상. 움직임 줄이기 설정이면 멈춘 첫 장면만 보인다
export function Loop({ src, poster, label }: { src: string; poster: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (prefersReduced()) {
      v.removeAttribute("autoplay");
      v.pause();
      return;
    }
    v.muted = true;
    v.play().catch(() => undefined);
  }, [src]);
  return <video ref={ref} key={src} src={src} poster={poster} autoPlay muted loop playsInline preload="metadata" aria-label={label} />;
}

/* ---------- 스크롤하면 단어가 차례로 진해지는 문장 (사진 조각을 사이에 끼울 수 있음) ---------- */
type Part = string | ReactNode;
export function Statement({ parts, className = "statement" }: { parts: Part[]; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return;
    const words = Array.from(el.querySelectorAll<HTMLElement>(".w"));
    words.forEach((w) => w.classList.remove("on"));
    const upd = () => {
      const r = el.getBoundingClientRect(),
        vh = window.innerHeight;
      const p = Math.max(0, Math.min(1, (vh * 0.9 - r.top) / (vh * 0.45)));
      const n = Math.round(p * words.length);
      words.forEach((w, i) => w.classList.toggle("on", i < n));
    };
    upd();
    window.addEventListener("scroll", upd, { passive: true });
    window.addEventListener("resize", upd);
    return () => {
      window.removeEventListener("scroll", upd);
      window.removeEventListener("resize", upd);
    };
  }, []);
  let k = 0;
  return (
    <p className={className} ref={ref}>
      {parts.map((part, pi) => {
        if (typeof part !== "string") return <span key={"n" + pi}>{part}</span>;
        return part
          .split(/(\s+)/)
          .filter(Boolean)
          .map((tk) =>
            /^\s+$/.test(tk) ? (
              tk
            ) : (
              <span key={k++} className="w on">
                {tk}
              </span>
            )
          );
      })}
    </p>
  );
}

// 문장 속 사진 조각
export function Thumb({ src, pos, zoom }: { src: string; pos?: string; zoom?: number }) {
  return (
    <span className="tn" aria-hidden="true">
      <img
        src={src}
        alt=""
        loading="lazy"
        style={{ objectPosition: pos, transform: zoom ? `scale(${zoom})` : undefined, transformOrigin: pos }}
      />
    </span>
  );
}

/* ---------- 실험 횟수 비교 그래프 (페이지를 열 때마다 새로 계산) ---------- */
export function ChartSection() {
  const [data, setData] = useState<ChartData | null>(null);
  const dataRef = useRef<ChartData | null>(null);
  const start = useRef<{ t: number | null }>({ t: null });
  dataRef.current = data;
  const run = () => {
    setData(null);
    setTimeout(() => {
      start.current.t = null;
      setData(computeChart());
    }, 30);
  };
  useEffect(() => {
    const id = setTimeout(() => setData(computeChart()), 80);
    return () => clearTimeout(id);
  }, []);
  const ref = useCanvas((f) => drawChart(f, dataRef.current, start.current), { fps: 40 });
  return (
    <section className="band" id="how">
      <div className="wrap how-grid">
        <div>
          <h2 className="h">
            적은 실험으로
            <br />
            최적 조건에.
          </h2>
          <p className="body">
            성분과 공정 조건을 고를 때 가우스 과정 기반 베이지안 최적화를 씁니다. 앞선 결과를 보고 다음 실험을 고르기 때문에,
            조건을 무작위로 시도할 때보다 적은 횟수로 최적점에 가까워집니다.
          </p>
          <div className="reach" aria-live="polite">
            <div>
              <b>{data ? (data.rBO ? data.rBO + "회" : "20회+") : "–"}</b>
              <span>AI가 최적값의 95%에 닿기까지</span>
            </div>
            <div>
              <b className="m">{data ? (data.rRD ? data.rRD + "회" : "20회+") : "–"}</b>
              <span>무작위로 고를 때 같은 지점까지</span>
            </div>
          </div>
        </div>
        <figure className="chart">
          <div className="chart-top">
            <span>실험 횟수별로 찾은 최적값 (%)</span>
            <button type="button" className="chip-btn" onClick={run}>
              다시 계산
            </button>
          </div>
          <canvas
            ref={ref}
            role="img"
            aria-label="실험 횟수에 따라 찾은 최적값 비율을 비교한 선 그래프. 베이지안 최적화 선이 무작위 탐색과 순차 탐색보다 빠르게 100%에 가까워집니다."
          />
          <ul className="legend">
            <li>
              <i className="l-bo" />
              AI · 베이지안 최적화
            </li>
            <li>
              <i className="l-rd" />
              무작위 탐색
            </li>
            <li>
              <i className="l-sw" />
              순차 탐색
            </li>
          </ul>
          <figcaption>가로는 실험 횟수, 세로는 시험 함수 최댓값 대비 %. 이 브라우저에서 방금 계산했고, AI 선은 24번 돌린 평균입니다.</figcaption>
        </figure>
      </div>
    </section>
  );
}

/* ---------- 분야 목록 속 움직이는 그림 ---------- */
export function DomainMedia() {
  const hRef = useRef<HTMLElement>(null),
    mRef = useRef<HTMLElement>(null);
  const ref = useCanvas((f) => drawDomain(f, { h: hRef.current, m: mRef.current }), { fps: 20, pixel: 4 });
  return (
    <>
      <canvas ref={ref} role="img" aria-label="외부 자기장에 따라 분홍(위 방향)과 민트(아래 방향) 자구가 넓어지고 좁아지는 애니메이션" />
      <span className="readout">
        자기장 H <b ref={hRef}>+0.00</b> · 자화 M/Mₛ <b ref={mRef}>+0.00</b>
      </span>
    </>
  );
}
export function BOMedia() {
  const iRef = useRef<HTMLElement>(null),
    bRef = useRef<HTMLElement>(null);
  const ref = useCanvas((f) => drawBOCard(f, { i: iRef.current, b: bRef.current }), { fps: 30 });
  return (
    <>
      <canvas ref={ref} role="img" aria-label="베이지안 최적화가 관측점을 하나씩 더하며 최댓값을 찾아가는 애니메이션" />
      <span className="readout">
        관측 <b ref={iRef}>2</b>회 · 지금까지 최고 <b ref={bRef}>—</b>
      </span>
    </>
  );
}

/* ---------- 연구 분야: 이름 목록 + 미리보기 창 (가리키는 줄 옆에 그림이 열린다) ---------- */
interface RItem {
  group: "axis" | "app";
  ko: string;
  en: string;
  desc: string;
  to: string;
  media: () => ReactNode;
  white?: boolean;
}
const R_ITEMS: RItem[] = [
  {
    group: "axis",
    ko: "자성 재료",
    en: "Magnetic materials",
    desc: "연자성·자왜 소재의 자화 거동을 측정하고 모델링합니다. B–H 곡선, 자속밀도, 철손을 공정과 조직에 연결합니다.",
    to: "/project/ResearchAreas",
    media: () => <DomainMedia />,
  },
  {
    group: "axis",
    ko: "집합조직",
    en: "Texture",
    desc: "결정 방위 분포가 자기 특성을 정합니다. EBSD 방위 지도와 ODF로 집합조직이 생기는 원리를 찾고, 원하는 방위를 만드는 공정을 설계합니다.",
    to: "/project/ResearchAreas",
    media: () => <img src="/images/copper/grain.jpg" alt="광학 현미경으로 본 결정립 조직" loading="lazy" />,
  },
  {
    group: "axis",
    ko: "AI 소재 설계",
    en: "AI materials design",
    desc: "적은 실험 데이터로도 학습하도록 생성 모델로 데이터를 늘리고, 베이지안 최적화와 설명 가능한 AI로 다음 실험 조건을 고릅니다.",
    to: "/project/PublishedPapers",
    media: () => <BOMedia />,
  },
  {
    group: "axis",
    ko: "시뮬레이션",
    en: "Simulation",
    desc: "CALPHAD 열역학, 확산, 상변태, 결정립 성장을 계산해 실험 전에 조직 변화를 봅니다. 계산 결과는 AI 학습 데이터로도 씁니다.",
    to: "/project/ResearchAreas",
    white: true,
    media: () => (
      <Loop
        src="/images/copper/sim3d_ipf.mp4"
        poster="/images/copper/sim3d_ipf-poster.jpg"
        label="Fe-Si 판재에서 결정립이 자라는 3차원 시뮬레이션. 결정 방위를 색으로 표시"
      />
    ),
  },
  {
    group: "app",
    ko: "모빌리티용 철강 소재",
    en: "Mobility steel",
    desc: "전기차·드론 모터용 자성 소재의 성능을 높입니다.",
    to: "/project/ResearchAreas",
    white: true,
    media: () => <img src="/images/copper/ra1.jpg" alt="전기차와 드론 모터용 자성 소재 개념도" loading="lazy" />,
  },
  {
    group: "app",
    ko: "센서용 자왜 소재",
    en: "Magnetostrictive sensors",
    desc: "항공기·선박 센서용 고성능 합금을 연구합니다.",
    to: "/project/ResearchAreas",
    white: true,
    media: () => <img src="/images/copper/ra2.jpg" alt="항공기와 선박 센서용 자왜 소재 개념도" loading="lazy" />,
  },
  {
    group: "app",
    ko: "재료 AI 최적 설계",
    en: "AI optimal design",
    desc: "AI로 공정 조건과 성분 조건을 최적화합니다.",
    to: "/project/ResearchAreas",
    white: true,
    media: () => <img src="/images/copper/ra3.jpg" alt="재료 인공지능 공정 및 성분 최적 설계 개념도" loading="lazy" />,
  },
  {
    group: "app",
    ko: "집합조직 및 자성 분석",
    en: "Texture & magnetism",
    desc: "금속 확산과 자기적 특성의 상관관계를 밝힙니다.",
    to: "/project/ResearchAreas",
    white: true,
    media: () => <img src="/images/copper/ra4.jpg" alt="3D CT와 XRD·EBSD 집합조직 분석 개념도" loading="lazy" />,
  },
];

export function ResearchIndex({ heading = true }: { heading?: boolean }) {
  // 넓은 화면에서는 늘 미리보기 창을 둔다. 마우스는 가리키면 바뀌고, 터치는 첫 번째 탭이 미리보기, 두 번째 탭이 이동이다
  const wide = useMedia("(min-width: 701px)");
  const [act, setAct] = useState(0);
  const [hov, setHov] = useState(false);
  const [y, setY] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const rows = useRef<(HTMLAnchorElement | null)[]>([]);

  // 미리보기 창을 가리킨 줄 높이에 맞춘다
  useLayoutEffect(() => {
    if (!wide) return;
    const place = () => {
      const row = rows.current[act],
        fr = frame.current,
        rt = root.current;
      if (!row || !fr || !rt) return;
      const top = row.getBoundingClientRect().top - rt.getBoundingClientRect().top;
      const want = top + row.offsetHeight / 2 - fr.offsetHeight / 2;
      setY(Math.max(0, Math.min(rt.offsetHeight - fr.offsetHeight, want)));
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [act, wide]);

  // 스크롤로 읽어 내려가면 읽는 줄(화면 가운데)에 걸린 분야를 미리보기 창에 띄운다. 마우스를 올리고 있을 때는 마우스가 우선
  const hovRef = useRef(false);
  hovRef.current = hov;
  useEffect(() => {
    if (!wide || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (hovRef.current) return;
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const i = rows.current.indexOf(e.target as HTMLAnchorElement);
          if (i >= 0) setAct(i);
        }
      },
      { rootMargin: "-46% 0px -50% 0px" }
    );
    rows.current.forEach((r) => r && io.observe(r));
    return () => io.disconnect();
  }, [wide]);

  const groups: [RItem["group"], string][] = [
    ["axis", "네 연구 축"],
    ["app", "쓰이는 곳"],
  ];
  const cur = R_ITEMS[act];
  return (
    <section className="band" id="research">
      <div className="wrap">
        {heading && (
          <div className="ix-head">
            <h2 className="h">
              네 축이 하나의
              <br />
              설계로 이어집니다.
            </h2>
            <p className="body">
              자성 재료, 집합조직, AI 소재 설계, 시뮬레이션. 그 결과는 전기차 모터와 항공기·선박 센서용 소재로 쓰입니다.
            </p>
          </div>
        )}
        <div className={"ix" + (hov ? " hov" : "")} ref={root} onPointerLeave={() => setHov(false)}>
          <div className="ix-list">
            {groups.map(([g, title]) => (
              <div key={g} className="ix-group">
                <h3 className="ix-g">{title}</h3>
                <ul>
                  {R_ITEMS.map((it, i) =>
                    it.group !== g ? null : (
                      <li key={it.ko}>
                        <Link
                          to={it.to}
                          ref={(el) => {
                            rows.current[i] = el;
                          }}
                          className={"ix-row" + (i === act ? " on" : "")}
                          onPointerEnter={(e) => {
                            if (e.pointerType !== "mouse") return;
                            setAct(i);
                            setHov(true);
                          }}
                          onFocus={() => setAct(i)}
                          onClick={(e) => {
                            if (wide && i !== act) {
                              e.preventDefault();
                              setAct(i);
                            }
                          }}
                        >
                          {!wide && (
                            <span className={"ix-thumb" + (it.white ? " white" : "")}>{it.media()}</span>
                          )}
                          <span className="ix-name">{it.ko}</span>
                          <span className="ix-en">{it.en}</span>
                          <span className="ix-desc">{it.desc}</span>
                        </Link>
                      </li>
                    )
                  )}
                </ul>
              </div>
            ))}
          </div>
          {wide && (
            <div className="ix-frame" ref={frame} style={{ transform: `translateY(${y}px)` }} aria-hidden="true">
              <div className={"ix-pic" + (cur.white ? " white" : "")} key={act}>
                {cur.media()}
              </div>
              <p>
                <b>{cur.ko}</b> {cur.en}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------- 연구 순환: 단계가 진한 색에서 옅은 색으로 이어지는 펼침 띠 ---------- */
const STAGES = [
  {
    ko: "계산",
    en: "Simulate",
    desc: "열역학·확산·결정립 성장을 계산해 실험 전에 조직 변화를 미리 봅니다.",
    img: "/images/copper/sim3d_si-poster.jpg",
    alt: "Si 농도장 3차원 계산 결과",
  },
  {
    ko: "학습",
    en: "Learn",
    desc: "측정값과 현미경 이미지, 계산 결과로 물성을 예측하는 모델을 만듭니다.",
    img: "/images/copper/grain.jpg",
    alt: "학습 데이터가 되는 결정립 조직 사진",
  },
  {
    ko: "설계",
    en: "Design",
    desc: "베이지안 최적화로 다음에 해 볼 성분과 공정 조건을 고릅니다.",
    img: "/images/copper/ra3.jpg",
    alt: "성분과 공정 최적 설계 개념도",
  },
  {
    ko: "검증",
    en: "Verify",
    desc: "SEM과 자기 측정으로 확인하고, 결과를 다시 모델에 넣습니다.",
    img: "/images/mini SEM.jpg",
    alt: "연구실의 미니 SEM",
  },
];
export function LoopSection() {
  const [open, setOpen] = useState(0);
  return (
    <section className="band" id="approach">
      <div className="wrap">
        <div className="acc-head">
          <h2 className="h">
            실험 한 번의 시간과
            <br />
            비용을 줄이기 위해.
          </h2>
          <p className="body">
            계산으로 범위를 좁히고, 학습한 모델로 다음 조건을 고르고, 꼭 필요한 실험만 합니다. 측정 결과는 다시 모델로 돌아가 다음
            설계를 더 정확하게 만듭니다.
          </p>
        </div>
        <ol className="acc">
          {STAGES.map((s, i) => (
            <li key={s.ko} className={"st" + i + (i === open ? " open" : "")}>
              <button type="button" className="acc-tab" aria-expanded={i === open} onClick={() => setOpen(i)}>
                <span>{s.ko}</span>
              </button>
              <div className="acc-body" hidden={i !== open}>
                <div className="acc-txt">
                  <h3>{s.ko}</h3>
                  <p>
                    <span className="en">{s.en}.</span> {s.desc}
                  </p>
                </div>
                <img src={s.img} alt={s.alt} loading="lazy" />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- 지도교수 소개와 경력 ---------- */
export function PIBlock({ full = false }: { full?: boolean }) {
  return (
    <>
      <div className="pi-panel">
        <div className="pi-left">
          <h2 className="h">
            이제는 데이터로
            <br />
            소재를 설계합니다.
          </h2>
          <figure className="portrait">
            <img src={piProfile.photo} alt={`${piProfile.nameKo} 교수`} />
          </figure>
        </div>
        <div className="pi-right">
          <div className="who">
            <b>
              {piProfile.nameKo}
              <small>{piProfile.nameEn}</small>
            </b>
            <p>{piProfile.position}</p>
          </div>
          <p className="body">{piProfile.summary}</p>
          <dl className="facts">
            <dt>이메일</dt>
            <dd>{piProfile.email}</dd>
            <dt>전화</dt>
            <dd>{piProfile.phone}</dd>
            <dt>연구실</dt>
            <dd>{piProfile.office}</dd>
            <dt>관심 분야</dt>
            <dd className="tags">
              {piProfile.interests.map((t) => (
                <span key={t} className="chip">
                  {t}
                </span>
              ))}
            </dd>
            <dt>도구</dt>
            <dd className="tags">
              {piProfile.tools.map((t) => (
                <span key={t} className="chip">
                  {t}
                </span>
              ))}
            </dd>
          </dl>
          {!full && (
            <div className="btns">
              <Link className="btn" to="/about/Pi">
                경력·특허·대표 논문 전체 보기 <i>→</i>
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="career">
        <div>
          <h3 className="h3">경력과 학력</h3>
          <ol className="tl">
            {career.map((c) => (
              <li key={c.period + c.org} className={c.current ? "now" : ""}>
                <time>
                  {c.current && <Mark />}
                  {c.period}
                </time>
                <div>
                  <b>{c.org}</b>
                  <span>{c.role}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="side">
          <div>
            <h3 className="h3">특허</h3>
            <div className="nums">
              {[patents.pctRep, patents.domesticRep, patents.pctCo].map((p) => (
                <div key={p.label}>
                  <b>{p.count}</b>
                  <span>{p.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="h3">위촉과 자격</h3>
            <ul className="honors">
              {honors.map((h) => (
                <li key={h.title}>
                  <time>{h.date}</time>
                  <div>
                    <b>{h.title}</b>
                    <span>{h.detail}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {full && (
        <div className="pi-more">
          <h3 className="h3">대표 논문</h3>
          <ol className="pubs">
            {piSelectedPapers
              .map((id) => papers.find((p) => p.id === id))
              .filter((p): p is PublicationItem => !!p)
              .map((p) => (
                <li key={p.id}>
                  <time>{p.year}</time>
                  <div>
                    <Link to={`/project/PublishedPapers/${p.id}`}>
                      <b>{p.title}</b>
                    </Link>
                    <span className="j">{p.journal}</span>
                  </div>
                  <span className="m">
                    <JournalChips journal={p.journal} only />
                  </span>
                </li>
              ))}
          </ol>
        </div>
      )}
    </>
  );
}

/* ---------- 논문 타일 (첫 페이지 그림 + 한 줄 설명) ---------- */
export function PaperTile({ paper, className = "" }: { paper: PublicationItem; className?: string }) {
  const q = journalQuartiles[paper.journal];
  const f = journalImpactFactors[paper.journal];
  return (
    <Link className={"ptile " + className} to={`/project/PublishedPapers/${paper.id}`}>
      <span className="pimg">
        {paper.firstPage ? <img src={paper.firstPage} alt={`${paper.title} 첫 페이지`} loading="lazy" /> : <Mark />}
      </span>
      <span className="pcap">
        <b>{paper.title}</b>
        <span>
          {journalShort(paper.journal)} · {paper.year}
          {q ? ` · ${q}` : ""}
          {f ? ` · IF ${f}` : ""}
        </span>
      </span>
    </Link>
  );
}

/* ---------- 학술지 분위(Q1~Q4)와 IF 표시 ---------- */
export function JournalChips({ journal, only }: { journal: string; only?: boolean }) {
  const q = journalQuartiles[journal];
  const f = journalImpactFactors[journal];
  return (
    <>
      {!only && <span className="chip">{journal}</span>}
      {q && <span className={"chip q " + q.toLowerCase()}>{q}</span>}
      {f && <span className="chip">IF {f}</span>}
    </>
  );
}

// IF가 높은 순 (같으면 최근 논문 먼저)
export function papersByIF() {
  return papers
    .map((p, i) => ({ p, i, f: parseFloat(journalImpactFactors[p.journal] || "0") }))
    .sort((a, b) => b.f - a.f || Number(b.p.year) - Number(a.p.year) || a.i - b.i)
    .map((x) => x.p);
}

const JOURNAL_SHORT: Record<string, string> = {
  "Journal of Materials Research and Technology": "JMR&T",
  "Materials Characterization": "Mater. Charact.",
  "Scripta Materialia": "Scripta Mater.",
  "Metals and Materials International": "MMI",
  "Materials Today Communications": "MTC",
  "Korean Journal of Metals and Materials": "KJMM",
  "Journal of the Korean Magnetics Society": "JKMS",
  "Journal of the Korean Society for Heat Treatment": "KSHT",
  "Journal of Magnetics": "J. Magn.",
};
export const journalShort = (j: string) => JOURNAL_SHORT[j] || j;

/* ---------- 소식 한 줄 (사진이 머리표 자리에) ---------- */
export function NewsLine({ item }: { item: NewsItem }) {
  const isPaper = !!item.img && item.img.includes("/papers/");
  return (
    <li className="nl-item">
      <span className={"nl-pic" + (isPaper ? " paper" : "")}>
        {item.img ? <img src={item.img} alt="" loading="lazy" /> : <Mark size={64} />}
      </span>
      <div>
        <b>
          {item.date} · {catLabel(item.category)}
        </b>
        <p>{item.comments}</p>
      </div>
    </li>
  );
}

/* ---------- 지원 안내: 첫 화면의 자석이 위에서 본 모습으로 돌아온다 ---------- */
export function JoinField() {
  const ptr = useRef<Pointer>({ x: 0, y: 0, tx: 0, ty: 0 });
  const ref = useCanvas((f) => drawMag(f, ptr.current, undefined, { view: "top" }), { fps: 30 });
  return (
    <section
      className="join-field"
      id="join"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        ptr.current.tx = (e.clientX - r.left) / r.width - 0.5;
        ptr.current.ty = (e.clientY - r.top) / r.height - 0.5;
      }}
    >
      <div className="join-obj">
        <canvas ref={ref} role="img" aria-label="첫 화면의 자석을 위에서 내려다본 자기력선" />
      </div>
      <div className="wrap join-grid">
        <div className="join-copy">
          <h2 className="h3">
            다음 소재는
            <br />
            여기서 시작됩니다.
          </h2>
          <p>신소재공학 지식에 AI 기술을 접목하고, 주도적으로 연구하고 싶은 학부연구생과 대학원생을 기다립니다.</p>
          <p className="fact">{piProfile.email}</p>
          <div className="btns">
            <Link className="btn" to="/join_us/Join_us">
              지원 안내 보기 <i>→</i>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
