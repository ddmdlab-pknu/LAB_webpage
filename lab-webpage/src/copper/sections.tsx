// 첫 화면과 하위 페이지가 같이 쓰는 큰 덩어리들
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import PaperAuthors from "../components/PaperAuthors";
import { PublicationItem, journalImpactFactors, journalQuartiles, publicationsData as papers } from "../data/papersData";
import { NewsItem } from "../data/newsData";
import { career, honors, patents, piProfile, piSelectedPapers } from "../data/piData";
import {
  ChartData,
  computeChart,
  drawBOCard,
  drawChart,
  drawDomain,
  drawLoop,
  drawOrb,
  useCanvas,
} from "./fx";
import { Label, catChip } from "./ui";

/* ---------- 스크롤하면 단어가 밝아지는 문장 ---------- */
type Part = [string, boolean?];
export function Statement({ parts }: { parts: Part[] }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const words = Array.from(el.querySelectorAll<HTMLElement>(".w"));
    words.forEach((w) => w.classList.remove("on"));
    const upd = () => {
      const r = el.getBoundingClientRect(),
        vh = window.innerHeight;
      const p = Math.max(0, Math.min(1, (vh * 0.92 - r.top) / (vh * 0.5)));
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
    <p className="statement" ref={ref}>
      {parts.map(([text, em], pi) => {
        const tokens = text.split(/(\s+)/).filter(Boolean);
        const spans = tokens.map((tk) =>
          /^\s+$/.test(tk) ? (
            tk
          ) : (
            <span key={k++} className="w on">
              {tk}
            </span>
          )
        );
        return em ? <em key={pi}>{spans}</em> : <span key={pi}>{spans}</span>;
      })}
    </p>
  );
}

/* ---------- 실험 횟수 비교 그래프 ---------- */
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
    <section className="wrap band" id="how">
      <div className="how-grid">
        <div>
          <Label>How we do it</Label>
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
              <span>
                AI가 최적값의 95%에
                <br />
                닿기까지 실험 횟수
              </span>
            </div>
            <div>
              <b>{data ? (data.rRD ? data.rRD + "회" : "20회+") : "–"}</b>
              <span>
                무작위 탐색이
                <br />
                같은 지점까지
              </span>
            </div>
          </div>
          <ul className="legend">
            <li>
              <i style={{ borderColor: "var(--sage)" }} />
              AI · 베이지안 최적화
            </li>
            <li>
              <i style={{ borderColor: "rgba(23,21,19,.6)" }} />
              무작위 탐색
            </li>
            <li>
              <i style={{ borderColor: "rgba(23,21,19,.32)", borderTopStyle: "dashed" }} />
              순차 탐색
            </li>
          </ul>
        </div>
        <figure className="chart">
          <div className="chart-top">
            <span>찾은 최적값 (%) · 실험 횟수별</span>
            <button type="button" onClick={run}>
              다시 계산 ↻
            </button>
          </div>
          <canvas
            ref={ref}
            role="img"
            aria-label="실험 횟수에 따라 찾은 최적값 비율을 비교한 선 그래프. 베이지안 최적화 선이 무작위 탐색과 순차 탐색보다 빠르게 100%에 가까워집니다."
          />
          <figcaption>
            <span>x: 실험 횟수 · y: 시험 함수 최댓값 대비 %</span>
            <span>페이지를 열 때마다 브라우저에서 새로 계산 · AI 24회 평균</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

/* ---------- 분야 카드 속 움직이는 그림 ---------- */
export function DomainMedia() {
  const hRef = useRef<HTMLElement>(null),
    mRef = useRef<HTMLElement>(null);
  const ref = useCanvas((f) => drawDomain(f, { h: hRef.current, m: mRef.current }), { fps: 20, pixel: 4 });
  return (
    <div className="media">
      <canvas ref={ref} role="img" aria-label="외부 자기장에 따라 자구가 넓어지고 좁아지는 애니메이션" />
      <span className="hudc">
        자구 · H <b ref={hRef}>+0.00</b> · M/Mₛ <b ref={mRef}>+0.00</b>
      </span>
    </div>
  );
}
export function BOMedia() {
  const iRef = useRef<HTMLElement>(null),
    bRef = useRef<HTMLElement>(null);
  const ref = useCanvas((f) => drawBOCard(f, { i: iRef.current, b: bRef.current }), { fps: 30 });
  return (
    <div className="media">
      <canvas ref={ref} role="img" aria-label="베이지안 최적화가 관측점을 하나씩 더하며 최댓값을 찾아가는 애니메이션" />
      <span className="hudc">
        GP · UCB · iter <b ref={iRef}>2</b> · best <b ref={bRef}>—</b>
      </span>
    </div>
  );
}

/* ---------- 분야 카드 (가로로 넘기기) ---------- */
export function ResearchTrack() {
  const track = useRef<HTMLDivElement>(null);
  const slide = (dir: number) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector(".card");
    const dx = card ? card.getBoundingClientRect().width + 20 : 320;
    el.scrollBy({ left: dir * dx, behavior: "smooth" });
  };
  const more = (to: string) => (
    <Link className="more" to={to}>
      Read More <i>→</i>
    </Link>
  );
  return (
    <section className="band research" id="research">
      <div className="wrap">
        <Label>Research</Label>
        <p className="intro">
          <b>자성 재료, 집합조직, AI 소재 설계, 시뮬레이션.</b> 네 축이 하나의 설계 흐름으로 이어지고, 그 결과는 전기차 모터와
          센서용 소재로 쓰입니다.
        </p>
        <div className="track-head">
          <b>Axes &amp; applications</b>
          <div className="arrows">
            <button type="button" aria-label="이전 카드" onClick={() => slide(-1)}>
              ←
            </button>
            <button type="button" aria-label="다음 카드" onClick={() => slide(1)}>
              →
            </button>
          </div>
        </div>
      </div>
      <div className="track" ref={track}>
        <article className="card">
          <DomainMedia />
          <div className="glass">
            <span className="tag">연구 축</span>
            <h3>
              <small>Magnetic materials</small>자성 재료
            </h3>
            <p>연자성·자왜 소재의 자화 거동을 측정하고 모델링합니다. B–H 곡선, 자속밀도, 철손을 공정과 조직에 연결합니다.</p>
            {more("/project/ResearchAreas")}
          </div>
        </article>
        <article className="card">
          <div className="media duo">
            <img src="/images/copper/grain.jpg" alt="결정립 조직 사진" loading="lazy" />
            <span className="hudc">결정립 조직 · 광학 현미경</span>
          </div>
          <div className="glass">
            <span className="tag">연구 축</span>
            <h3>
              <small>Texture</small>집합조직
            </h3>
            <p>
              결정 방위 분포가 자기 특성을 정합니다. EBSD 방위 지도와 ODF로 집합조직이 생기는 원리를 찾고, 원하는 방위를 만드는
              공정을 설계합니다.
            </p>
            {more("/project/ResearchAreas")}
          </div>
        </article>
        <article className="card">
          <BOMedia />
          <div className="glass">
            <span className="tag">연구 축</span>
            <h3>
              <small>AI materials design</small>AI 소재 설계
            </h3>
            <p>
              적은 실험 데이터로도 학습하도록 생성 모델로 데이터를 늘리고, 베이지안 최적화와 설명 가능한 AI로 다음 실험 조건을
              고릅니다.
            </p>
            {more("/project/PublishedPapers")}
          </div>
        </article>
        <article className="card">
          <div className="media white">
            <img src="/images/copper/sim3d_ipf.gif" alt="Fe-Si 판재에서 결정립이 자라는 3차원 시뮬레이션. 결정 방위를 색으로 표시" loading="lazy" />
            <span className="hudc">Fe-1Si · 1100 °C · 결정립 성장</span>
          </div>
          <div className="glass">
            <span className="tag">연구 축</span>
            <h3>
              <small>Simulation</small>시뮬레이션
            </h3>
            <p>CALPHAD 열역학, 확산, 상변태, 결정립 성장을 계산해 실험 전에 조직 변화를 봅니다. 계산 결과는 AI 학습 데이터로도 씁니다.</p>
            {more("/project/ResearchAreas")}
          </div>
        </article>
        {[
          ["ra1.jpg", "전기차와 드론 모터용 자성 소재 개념도", "Mobility steel", "모빌리티용 철강 소재", "전기차·드론 모터용 자성 소재의 성능을 높입니다."],
          ["ra2.jpg", "항공기와 선박 센서용 자왜 소재 개념도", "Magnetostrictive sensors", "센서용 자왜 소재", "항공기·선박 센서용 고성능 합금을 연구합니다."],
          ["ra3.jpg", "재료 인공지능 공정 및 성분 최적 설계 개념도", "AI optimal design", "재료 AI 최적 설계", "AI로 공정 조건과 성분 조건을 최적화합니다."],
          ["ra4.jpg", "3D CT와 XRD·EBSD 집합조직 분석 개념도", "Texture & magnetism", "집합조직 및 자성 분석", "금속 확산과 자기적 특성의 상관관계를 밝힙니다."],
        ].map(([img, alt, en, ko, desc]) => (
          <article className="card" key={img}>
            <div className="media light">
              <img src={`/images/copper/${img}`} alt={alt} loading="lazy" />
            </div>
            <div className="glass">
              <span className="tag app">응용 분야</span>
              <h3>
                <small>{en}</small>
                {ko}
              </h3>
              <p>{desc}</p>
              {more("/project/ResearchAreas")}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ---------- 연구 순환도 ---------- */
const STEP_TEXT = [
  ["1 · SIMULATE", "계산", "열역학·확산·결정립 성장으로 조직 변화를 미리 봅니다."],
  ["2 · LEARN", "학습", "측정값·이미지·계산 결과로 물성 예측 모델을 만듭니다."],
  ["3 · DESIGN", "설계", "베이지안 최적화로 성분과 공정 조건을 고릅니다."],
  ["4 · VERIFY", "검증", "EBSD·자기 측정으로 확인하고 다시 모델에 넣습니다."],
];
export function LoopSection() {
  const [step, setStep] = useState(0);
  const ref = useCanvas((f) => drawLoop(f, setStep), { fps: 40 });
  return (
    <section className="wrap band" id="approach">
      <div className="loop-grid">
        <div>
          <Label>Why we do it</Label>
          <h2 className="h">실험 한 번의 시간과 비용을 줄이기 위해.</h2>
          <p className="body">
            계산으로 범위를 좁히고, 학습한 모델로 다음 조건을 고르고, 꼭 필요한 실험만 합니다. 측정 결과는 다시 모델로 돌아가 다음
            설계를 더 정확하게 만듭니다.
          </p>
          <ol className="steps">
            {STEP_TEXT.map(([en, ko, desc], i) => (
              <li key={en} className={i === step ? "on" : ""}>
                <small>{en}</small>
                <b>{ko}</b>
                <span>{desc}</span>
              </li>
            ))}
          </ol>
        </div>
        <figure className="loopfig">
          <canvas ref={ref} role="img" aria-label="계산, 학습, 설계, 검증 네 단계가 원을 따라 반복되는 순환도" />
        </figure>
      </div>
    </section>
  );
}

/* ---------- 지도교수 소개와 경력 ---------- */
export function PIBlock({ full = false }: { full?: boolean }) {
  return (
    <>
      <div className="panel rings pi-panel">
        <div>
          <figure className="portrait">
            <img src={piProfile.photo} alt={`${piProfile.nameKo} 교수`} />
          </figure>
          <div className="who">
            <b>
              {piProfile.nameKo}
              <small>{piProfile.nameEn}</small>
            </b>
            <p>{piProfile.position}</p>
          </div>
        </div>
        <div className="pi-copy">
          <h2 className="h">
            이제는 <span className="sage">데이터로</span> 소재를 설계합니다.
          </h2>
          <p className="body">{piProfile.summary}</p>
          <dl className="facts">
            <dt>Email</dt>
            <dd>{piProfile.email}</dd>
            <dt>Tel</dt>
            <dd>{piProfile.phone}</dd>
            <dt>Office</dt>
            <dd>{piProfile.office}</dd>
            <dt>Interests</dt>
            <dd className="tags">
              {piProfile.interests.map((t) => (
                <span key={t} className="chip">
                  {t}
                </span>
              ))}
            </dd>
            <dt>Tools</dt>
            <dd className="tags">
              {piProfile.tools.map((t) => (
                <span key={t} className="chip s">
                  {t}
                </span>
              ))}
            </dd>
          </dl>
        </div>
      </div>

      <div className="career">
        <div>
          <h3 className="sub">경력과 학력</h3>
          <ol className="tl">
            {career.map((c) => (
              <li key={c.period + c.org} className={c.current ? "now" : ""}>
                <time>{c.period}</time>
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
            <h3 className="sub">특허</h3>
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
            <h3 className="sub">위촉과 자격</h3>
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

      {full ? (
        <div className="pi-more">
          <h3 className="sub">대표 논문</h3>
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
      ) : (
        <div className="btns">
          <Link className="btn ghost" to="/about/Pi">
            경력·특허·대표 논문 전체 보기 <i>→</i>
          </Link>
        </div>
      )}
    </>
  );
}

/* ---------- 논문 카드 ---------- */
export function PaperCard({ paper, short }: { paper: PublicationItem; short?: string }) {
  return (
    <Link className="paper" to={`/project/PublishedPapers/${paper.id}`}>
      <div className="thumb">
        {paper.firstPage ? (
          <img src={paper.firstPage} alt="논문 첫 페이지" loading="lazy" />
        ) : (
          <div className="gen" style={{ height: "100%" }}>
            <b>{paper.year}</b>
          </div>
        )}
      </div>
      <div className="meta">
        <span className="chip">{short || paper.journal}</span>
        <span className="chip">{paper.year}</span>
        <JournalChips journal={paper.journal} only />
      </div>
      <b>{paper.title}</b>
      {paper.authors && (
        <p className="au">
          <PaperAuthors authors={paper.authors} />
        </p>
      )}
      <span className="go">
        Read More <i>→</i>
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

/* ---------- 뉴스 카드 ---------- */
export function NewsCard({ item }: { item: NewsItem }) {
  const isPaper = item.img && item.img.includes("/papers/");
  const [y, m, d] = item.date.split(".");
  return (
    <article className="ncard">
      {item.img ? (
        <div className={"img" + (isPaper ? " paperimg" : "")}>
          <img src={item.img} alt="" loading="lazy" />
        </div>
      ) : (
        <div className="img gen" aria-hidden="true">
          <b>
            {m}.{d}
            <br />
            {y}
          </b>
          <span>DDMD LAB NEWS</span>
        </div>
      )}
      <div className="meta">
        <span className="chip">{item.date}</span>
        {catChip(item.category)}
      </div>
      <h3>{item.comments}</h3>
      <Link className="rm" to="/activities/News">
        Read More <i>→</i>
      </Link>
    </article>
  );
}

/* ---------- 지원 안내 카드 ---------- */
export function OrbCTA() {
  const ref = useCanvas(drawOrb, { fps: 50 });
  return (
    <section className="wrap band" id="join">
      <div className="cta">
        <div className="cta-copy">
          <h2 className="h">
            다음 소재는
            <br />
            여기서 시작됩니다.
          </h2>
          <div>
            <p>
              신소재공학 지식에 AI 기술을 접목하고, 자유로운 분위기에서 주도적으로 연구하고 싶은 학부연구생과 대학원생을 기다립니다.
            </p>
            <div className="btns" style={{ marginTop: 24 }}>
              <Link className="btn dark" to="/join_us/Join_us">
                Get in Touch <i>→</i>
              </Link>
            </div>
            <p className="mail">
              이메일 <b>{piProfile.email}</b>
            </p>
          </div>
        </div>
        <div className="orb">
          <canvas ref={ref} role="img" aria-label="자기 히스테리시스 곡선을 따라 빛나는 점이 도는 애니메이션" />
        </div>
      </div>
    </section>
  );
}
