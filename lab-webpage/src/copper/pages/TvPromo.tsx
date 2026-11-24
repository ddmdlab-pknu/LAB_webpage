// 연구실 앞 TV용 홍보 화면 (주소: /tv).
// 홈페이지의 논문·소식·장비·구성원 데이터를 그대로 읽어 장면을 만들고, 끝나면 처음부터 다시 돈다.
// 손대지 않아도 저절로 넘어가고, 화면을 한 번 누르면 전체 화면이 된다. 6시간마다 새로 불러 최신 내용을 띄운다.
import { useCallback, useEffect, useRef, useState } from "react";
import { AREAS } from "./ResearchAreas";
import { JOURNAL_SHORT } from "../sections";
import { newsData } from "../../data/newsData";
import { journalImpactFactors, publicationsData } from "../../data/papersData";
import { patentSummary, piProfile } from "../../data/piData";
import { masters, undergraduates } from "../../data/membersData";
import { popup } from "../../data/bannerData";

const SCENE_MS = 9000; // 장면 하나 길이
const RELOAD_MS = 6 * 60 * 60 * 1000; // 이만큼 돌고 나면 새 배포를 받으려고 다시 불러온다

const korName = (n: string) => n.match(/\(([^)]+)\)/)?.[1] || n;
const recentNews = newsData.filter((n) => n.img).slice(0, 4);
const recentPapers = publicationsData.filter((p) => p.firstPage).slice(0, 4);
const thisYear = String(new Date().getFullYear());
const papersThisYear = publicationsData.filter((p) => p.year === thisYear).length;
const people = [...masters, ...undergraduates];

// 한 장면의 글자·그림은 --i 순서대로 아래에서 떠오른다
const In = ({ i, children, className = "" }: { i: number; children: React.ReactNode; className?: string }) => (
  <div className={`tv-in ${className}`} style={{ ["--i" as string]: i }}>
    {children}
  </div>
);

type Scene = { key: string; tone?: "dark" | "split" | "light"; render: () => JSX.Element };

const SCENES: Scene[] = [
  {
    key: "intro",
    tone: "split",
    render: () => (
      <div className="tv-intro">
        <In i={0}>
          <img className="tv-logo-big" src="/images/copper/logo.jpg" alt="" />
        </In>
        <In i={1}>
          <h1 className="tv-hero">
            데이터로 소재를
            <br />
            설계하는 연구실
          </h1>
        </In>
        <In i={2}>
          <p className="tv-sub">Data Driven Material Design Lab · 국립부경대학교 신소재시스템공학전공</p>
        </In>
      </div>
    ),
  },
  {
    key: "mission",
    render: () => (
      <div className="tv-mission">
        <In i={0}>
          <span className="tv-kicker">WHAT WE DO</span>
        </In>
        <In i={1}>
          <p className="tv-lead">
            전기강판의 결정 방위와 미세조직에서 자기 특성까지 계산하고 학습해, <b>더 적은 실험으로</b> 원하는 자성 소재에 닿습니다.
          </p>
        </In>
        <In i={2} className="tv-chips">
          {["자성 재료", "집합조직", "AI 소재 설계", "시뮬레이션", "숏피닝 표면 개질"].map((t) => (
            <span key={t}>{t}</span>
          ))}
        </In>
      </div>
    ),
  },
  ...AREAS.map(
    (a, n): Scene => ({
      key: `area-${n}`,
      render: () => (
        <div className="tv-area">
          <div className="tv-area-text">
            <In i={0}>
              <span className="tv-kicker">
                RESEARCH {String(n + 1).padStart(2, "0")} / {String(AREAS.length).padStart(2, "0")}
              </span>
            </In>
            <In i={1}>
              <h2 className="tv-h2">{a.title}</h2>
            </In>
            <In i={2}>
              <ul className="tv-points">
                {a.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </In>
            <In i={3} className="tv-tags">
              {a.tags.map((t) => (
                <span key={t}>#{t}</span>
              ))}
            </In>
          </div>
          <In i={1} className="tv-area-pic">
            <img className="tv-kb" src={a.img} alt="" />
          </In>
        </div>
      ),
    })
  ),
  {
    key: "numbers",
    tone: "dark",
    render: () => (
      <div className="tv-numbers">
        <In i={0}>
          <span className="tv-kicker">BY THE NUMBERS</span>
        </In>
        <div className="tv-num-grid">
          {[
            [String(publicationsData.length), "논문", `${thisYear}년 ${papersThisYear}편`],
            [String(patentSummary.krRegistered), "국내 등록 특허", `대표 발명 ${patentSummary.krRegisteredLead}건`],
            [String(patentSummary.pct), "PCT 국제 출원", `대표 ${patentSummary.pctLead}건`],
            [String(patentSummary.overseasGranted), "해외 등록 특허", "미국 · 일본 · 중국 · 유럽"],
          ].map(([n, t, s], k) => (
            <In i={k + 1} key={t} className="tv-num">
              <b>{n}</b>
              <span>{t}</span>
              <small>{s}</small>
            </In>
          ))}
        </div>
      </div>
    ),
  },
  {
    key: "news",
    render: () => (
      <div className="tv-cards-wrap">
        <In i={0}>
          <span className="tv-kicker">RECENT NEWS</span>
          <h2 className="tv-h2">최근 소식</h2>
        </In>
        <div className="tv-cards">
          {recentNews.map((n, k) => (
            <In i={k + 1} key={n.date + n.comments.slice(0, 8)} className="tv-card">
              <img src={n.img} alt="" />
              <div>
                <small>
                  {n.category} · {n.date}
                </small>
                <p>{n.comments}</p>
              </div>
            </In>
          ))}
        </div>
      </div>
    ),
  },
  {
    key: "papers",
    render: () => (
      <div className="tv-cards-wrap">
        <In i={0}>
          <span className="tv-kicker">PUBLICATIONS</span>
          <h2 className="tv-h2">최근 논문</h2>
        </In>
        <div className="tv-papers">
          {recentPapers.map((p, k) => (
            <In i={k + 1} key={p.id} className="tv-paper">
              <img src={p.firstPage} alt="" />
              <small>
                {JOURNAL_SHORT[p.journal] || p.journal} · {p.year}
                {journalImpactFactors[p.journal] ? ` · IF ${journalImpactFactors[p.journal]}` : ""}
              </small>
              <p>{p.title}</p>
            </In>
          ))}
        </div>
      </div>
    ),
  },
  {
    key: "lab",
    render: () => (
      <div className="tv-lab">
        <In i={0}>
          <span className="tv-kicker">FACILITIES</span>
          <h2 className="tv-h2">시편 준비부터 분석까지, 한 연구실에서</h2>
        </In>
        <div className="tv-lab-grid">
          {[
            ["/images/copper/lab3d-materials.jpg", "재료 실험실"],
            ["/images/copper/lab3d-surface.jpg", "표면 처리 · 분석실"],
            ["/images/mini SEM.jpg", "Mini SEM"],
            ["/images/3D_CT.jpg", "3D CT"],
            ["/images/EBSD.jpg", "EBSD"],
            ["/images/heat furnace.jpg", "열처리로"],
          ].map(([src, t], k) => (
            <In i={k + 1} key={t} className="tv-lab-item">
              <img src={src} alt="" />
              <span>{t}</span>
            </In>
          ))}
        </div>
      </div>
    ),
  },
  {
    key: "people",
    render: () => (
      <div className="tv-people">
        <In i={0}>
          <span className="tv-kicker">PEOPLE</span>
          <h2 className="tv-h2">함께 연구하는 사람들</h2>
        </In>
        <div className="tv-people-row">
          <In i={1} className="tv-person pi">
            <img src={piProfile.photo} alt="" />
            <b>{piProfile.nameKo} 교수</b>
            <span>연구실 책임자</span>
          </In>
          {people.map((m, k) => (
            <In i={k + 2} key={m.name} className="tv-person">
              <img src={m.profileImg} alt="" />
              <b>{korName(m.name)}</b>
              <span>{m.edu === "Undergraduate" ? "학부연구생" : "석사과정"}</span>
            </In>
          ))}
        </div>
      </div>
    ),
  },
  {
    key: "join",
    tone: "split",
    render: () => (
      <div className="tv-join">
        <div>
          <In i={0}>
            <span className="tv-pill">{popup?.label || "모집 중"}</span>
          </In>
          <In i={1}>
            <h2 className="tv-hero sm">{popup?.title || "함께할 학생을 찾습니다"}</h2>
          </In>
          <In i={2}>
            <p className="tv-sub">{popup?.desc}</p>
          </In>
          <In i={3}>
            <p className="tv-contact">
              {piProfile.office} · {piProfile.email}
            </p>
          </In>
        </div>
        <In i={2} className="tv-qr">
          <img src="/images/copper/qr-joinus.png" alt="지원 안내 페이지 QR 코드" />
          <span>휴대폰으로 찍어 지원 안내 보기</span>
        </In>
      </div>
    ),
  },
];

export default function TvPromo() {
  const [i, setI] = useState(0);
  const [idle, setIdle] = useState(false);
  const started = useRef(Date.now());
  const root = useRef<HTMLDivElement>(null);
  const next = useCallback((d = 1) => setI((n) => (n + d + SCENES.length) % SCENES.length), []);

  // 장면 넘기기. 한 바퀴를 마치고 6시간이 지났으면 새로 불러온다
  useEffect(() => {
    const t = window.setTimeout(() => {
      if (i === SCENES.length - 1 && Date.now() - started.current > RELOAD_MS) window.location.reload();
      else next();
    }, SCENE_MS);
    return () => window.clearTimeout(t);
  }, [i, next]);

  // 그림 미리 받아 두기 (넘어갈 때 비어 보이지 않게)
  useEffect(() => {
    const srcs = [
      ...AREAS.map((a) => a.img),
      ...recentNews.map((n) => n.img!),
      ...recentPapers.map((p) => p.firstPage!),
      ...people.map((m) => m.profileImg),
    ];
    srcs.forEach((s) => {
      const im = new Image();
      im.src = s;
    });
  }, []);

  // 화면 꺼짐 막기 (지원하는 브라우저만)
  useEffect(() => {
    type WL = { request: (t: "screen") => Promise<{ release: () => Promise<void> }> };
    const wl = (navigator as Navigator & { wakeLock?: WL }).wakeLock;
    if (!wl) return;
    let lock: { release: () => Promise<void> } | null = null;
    const get = () => wl.request("screen").then((l) => (lock = l)).catch(() => undefined);
    get();
    const vis = () => document.visibilityState === "visible" && get();
    document.addEventListener("visibilitychange", vis);
    return () => {
      document.removeEventListener("visibilitychange", vis);
      lock?.release().catch(() => undefined);
    };
  }, []);

  // 키보드 ← → 로 넘기기, 마우스를 3초 안 움직이면 커서 숨기기
  useEffect(() => {
    let t = 0;
    const wake = () => {
      setIdle(false);
      window.clearTimeout(t);
      t = window.setTimeout(() => setIdle(true), 3000);
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next(1);
      if (e.key === "ArrowLeft") next(-1);
      if (e.key === "f") root.current?.requestFullscreen?.().catch(() => undefined);
    };
    wake();
    window.addEventListener("pointermove", wake);
    window.addEventListener("keydown", key);
    document.title = "DDMD Lab · 홍보 화면";
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("pointermove", wake);
      window.removeEventListener("keydown", key);
    };
  }, [next]);

  const s = SCENES[i];
  return (
    <div
      ref={root}
      className={`tv tone-${s.tone || "light"}${idle ? " idle" : ""}`}
      onClick={() => {
        if (!document.fullscreenElement) root.current?.requestFullscreen?.().catch(() => undefined);
      }}
    >
      <div className="tv-stage" key={s.key}>
        {s.render()}
      </div>
      <div className="tv-brand">
        <img src="/images/copper/logo.jpg" alt="" />
        DDMD Lab
      </div>
      <div className="tv-url">ddmdlab.org</div>
      <div className="tv-bar" aria-hidden="true">
        {SCENES.map((x, k) => (
          <span key={x.key} className={k < i ? "done" : k === i ? "on" : ""}>
            {k === i && <i style={{ animationDuration: `${SCENE_MS}ms` }} />}
          </span>
        ))}
      </div>
    </div>
  );
}
