import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { newsData } from "../data/newsData";
import { publicationsData as papers } from "../data/papersData";
import { alumni, masters, undergraduates } from "../data/membersData";
import { piProfile } from "../data/piData";
import { drawMag, Pointer, useCanvas } from "./fx";
import { Label, catChip, krName } from "./ui";
import {
  ChartSection,
  LoopSection,
  NewsCard,
  OrbCTA,
  PaperCard,
  PIBlock,
  ResearchTrack,
  Statement,
  journalShort,
} from "./sections";

const SIMS = {
  dual: {
    label: "농도 + 방위 3D",
    src: "/images/copper/sim3d_dual.gif",
    alt: "표면 합금화 뒤 열처리하는 동안 농도장과 결정 방위가 함께 변하는 3차원 시뮬레이션",
    cap: "표면 합금화 뒤 1100 °C 열처리 동안 농도장(왼쪽)과 결정 방위(오른쪽)가 함께 변하는 과정을 계산합니다.",
  },
  ipf: {
    label: "결정 방위 3D",
    src: "/images/copper/sim3d_ipf.gif",
    alt: "결정 방위를 색으로 나타낸 3차원 결정립 성장 시뮬레이션",
    cap: "Fe-1Si 판재, 표면 Si 6.5 wt%, 1100 °C. α층이 자라며 결정립이 커지는 과정을 결정 방위 색(IPF)으로 봅니다.",
  },
  si: {
    label: "Si 농도 3D",
    src: "/images/copper/sim3d_si.gif",
    alt: "Si 농도장과 결정립계를 보여 주는 3차원 시뮬레이션",
    cap: "같은 계산의 Si 농도장입니다. 표면에서 안쪽으로 Si가 퍼지면서 α/γ 경계가 움직입니다.",
  },
  al: {
    label: "Al 확산 단면",
    src: "/images/copper/sim2d_al.gif",
    alt: "한 면을 Al로 코팅한 판재 단면에서 Al이 확산하는 2차원 시뮬레이션",
    cap: "Fe-0.5Si 200 μm 판재에 Al 20 μm를 한 면 코팅한 단면입니다. Al이 퍼지는 깊이와 결정립을 함께 추적합니다.",
  },
};
type SimKey = keyof typeof SIMS;

function Hero() {
  const ptr = useRef<Pointer>({ x: 0, y: 0, tx: 0, ty: 0 });
  const tiltRef = useRef<HTMLElement>(null),
    azRef = useRef<HTMLElement>(null);
  const ref = useCanvas((f) => drawMag(f, ptr.current, { tilt: tiltRef.current, az: azRef.current }), { fps: 30 });
  return (
    <header
      className="hero"
      id="top"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        ptr.current.tx = (e.clientX - r.left) / r.width - 0.5;
        ptr.current.ty = (e.clientY - r.top) / r.height - 0.5;
      }}
      onPointerLeave={() => {
        ptr.current.tx = 0;
        ptr.current.ty = 0;
      }}
    >
      <canvas
        ref={ref}
        role="img"
        aria-label="자석 주위의 자기력선을 구리색 선으로 그린 3차원 애니메이션. 마우스를 움직이면 기울기가 바뀝니다."
      />
      <div className="wrap hero-in">
        <Label>Data Driven Material Design Lab · PKNU</Label>
        <h1 className="display">
          Materials,
          <br />
          <span className="sage">by design.</span>
        </h1>
        <p className="lede">자성 재료와 집합조직을 계산하고 학습해, 실험 전에 소재를 설계합니다.</p>
        <ul className="axes" aria-label="연구 축">
          {["자성 재료", "집합조직", "AI 소재 설계", "시뮬레이션"].map((a) => (
            <li key={a}>
              <i />
              {a}
            </li>
          ))}
        </ul>
      </div>
      <div className="hud" aria-hidden="true">
        DIPOLE FIELD LINES · r = L·sin²θ
        <br />
        tilt <b ref={tiltRef}>22°</b> · azimuth <b ref={azRef}>0°</b>
      </div>
      <button
        type="button"
        className="explore"
        onClick={() => document.getElementById("what")?.scrollIntoView()}
      >
        Explore DDMD <i>↓</i>
      </button>
    </header>
  );
}

function LabStage() {
  const [sim, setSim] = useState<SimKey>("dual");
  const s = SIMS[sim];
  return (
    <section className="wrap band" id="lab">
      <div className="split">
        <div>
          <Label>One model · One lab</Label>
          <h2 className="h">
            계산하는 모델,
            <br />
            측정하는 실험실.
          </h2>
        </div>
        <div>
          <p className="body">
            시뮬레이션과 AI 모델이 조직 변화를 먼저 계산하고, 실험실의 SEM과 3D CT가 그 결과를 확인합니다. 측정값은 다시 모델의
            학습 데이터가 됩니다.
          </p>
          <div className="btns">
            <Link className="btn ghost" to="/facilities/Facilities">
              연구 장비 보기 <i>→</i>
            </Link>
          </div>
        </div>
      </div>
      <div className="stage">
        <img src={s.src} alt={s.alt} />
        <div className="tabs" role="tablist" aria-label="시뮬레이션 선택">
          {(Object.keys(SIMS) as SimKey[]).map((k) => (
            <button key={k} type="button" role="tab" aria-selected={k === sim} onClick={() => setSim(k)}>
              {SIMS[k].label}
            </button>
          ))}
        </div>
      </div>
      <p className="cap">{s.cap}</p>
      <div className="kit" aria-label="실험실 장비">
        {[
          ["/images/mini SEM.jpg", "Mini SEM", "미세조직 관찰"],
          ["/images/OM.jpg", "Optical Microscope", "조직 관찰"],
          ["/images/3D_CT.jpg", "3D CT", "내부 3차원 구조"],
          ["/images/열처리.jpg", "Gas Furnace", "탈탄·확산 열처리"],
        ].map(([img, name, role]) => (
          <figure key={name}>
            <img src={img} alt={name} loading="lazy" />
            <figcaption>
              <b>{name}</b>
              <span>{role}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function Team() {
  const team = [
    { name: piProfile.nameKo, role: "PI · 조교수", img: piProfile.photo, to: "/about/Pi" },
    ...masters.map((m) => ({ name: krName(m.name), role: "석사과정", img: m.profileImg, to: "/about/Members" })),
    ...undergraduates.map((m) => ({ name: krName(m.name), role: "학부연구생", img: m.profileImg, to: "/about/Members" })),
  ];
  const alumniNames = alumni.map((a) => krName(a.name)).join("·");
  return (
    <section className="wrap band" id="people">
      <Label>Our team</Label>
      <div className="panel team-panel">
        <div className="photos">
          <img src="/images/2026_KSHT_group.jpg" alt="2026 한국열처리공학회 추계학술대회 단체 사진" loading="lazy" />
          <img src="/images/2026_kickoff_meeting.jpg" alt="국책과제 Kick-Off 미팅 단체 사진" loading="lazy" />
        </div>
        <div className="team-copy">
          <h2 className="h">
            재료를 알고,
            <br />
            코드를 씁니다.
          </h2>
          <div>
            <p className="body" style={{ marginTop: 0 }}>
              석사과정 {masters.length}명과 학부연구생 {undergraduates.length}명이 자성 소재 데이터, 시뮬레이션, AI 모델을 함께
              다룹니다.{alumniNames && ` 졸업생: ${alumniNames}.`}
            </p>
            <div className="btns">
              <Link className="btn" to="/about/Members">
                Meet the Team <i>→</i>
              </Link>
              <Link className="ulink" to="/join_us/Join_us">
                지원 안내 보기
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="roster">
        {team.map((p) => (
          <Link key={p.name} to={p.to}>
            <div className="ph">
              <img src={p.img} alt={p.name} loading="lazy" />
            </div>
            <b>{p.name}</b>
            <span>{p.role}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Home() {
  const latest = newsData.slice(0, 3);
  const rest = newsData.slice(3, 7);
  return (
    <>
      <Hero />

      <section className="wrap band what" id="what">
        <Label>What is DDMD?</Label>
        <div className="inner">
          <Statement parts={[["DDMD Lab은 "], ["데이터로 소재를 설계합니다.", true]]} />
          <Statement parts={[["결정 방위와 미세조직에서 자기 특성까지, 계산하고 학습해 실험 전에 답을 좁힙니다."]]} />
          <Statement parts={[["그 결과,", true], [" 더 적은 실험으로 원하는 자성 소재에 닿습니다."]]} />
        </div>
      </section>

      <ChartSection />
      <LabStage />
      <ResearchTrack />
      <LoopSection />

      <section className="wrap band" id="leader">
        <Label>Principal investigator</Label>
        <PIBlock />
      </section>

      <section className="wrap band" id="papers">
        <div className="head-row">
          <div>
            <Label>Publications</Label>
            <h2 className="h">연구실 최근 논문</h2>
          </div>
          <Link className="btn ghost" to="/project/PublishedPapers">
            전체 {papers.length}편 보기 <i>→</i>
          </Link>
        </div>
        <div className="papers">
          {papers.slice(0, 4).map((p) => (
            <PaperCard key={p.id} paper={p} short={journalShort(p.journal)} />
          ))}
        </div>
      </section>

      <Team />

      <section className="wrap band" id="news">
        <div className="head-row">
          <div>
            <Label>News</Label>
            <h2 className="h">The latest from DDMD Lab</h2>
          </div>
          <Link className="btn ghost" to="/activities/News">
            View All <i>→</i>
          </Link>
        </div>
        <div className="ncards">
          {latest.map((n) => (
            <NewsCard key={n.date + n.comments.slice(0, 12)} item={n} />
          ))}
        </div>
        <ul className="nlist">
          {rest.map((n) => (
            <li key={n.date + n.comments.slice(0, 12)}>
              <time>{n.date}</time>
              <p>{n.comments}</p>
              {catChip(n.category)}
            </li>
          ))}
        </ul>
      </section>

      <OrbCTA />
    </>
  );
}

export default Home;
