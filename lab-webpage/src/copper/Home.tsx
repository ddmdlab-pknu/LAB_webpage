import { CSSProperties, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { newsData } from "../data/newsData";
import { publicationsData as papers } from "../data/papersData";
import { alumni, masters, undergraduates } from "../data/membersData";
import { piProfile } from "../data/piData";
import { drawMag, Pointer, useCanvas } from "./fx";
import { krName } from "./ui";
import {
  ChartSection,
  JoinField,
  LoopSection,
  Loop,
  NewsLine,
  PaperTile,
  PIBlock,
  ResearchIndex,
  Statement,
  Thumb,
} from "./sections";
import RoomSection from "./room/RoomSection";
import Equip3D from "./equip/Equip3D";
import type { EquipId } from "./equip/models";

const SIMS = {
  dual: {
    label: "농도 + 방위",
    src: "/images/copper/sim3d_dual",
    alt: "표면 합금화 뒤 열처리하는 동안 농도장과 결정 방위가 함께 변하는 3차원 시뮬레이션",
    cap: "표면 합금화 뒤 1100 °C 열처리 동안 농도장(왼쪽)과 결정 방위(오른쪽)가 함께 변하는 과정을 계산합니다.",
  },
  ipf: {
    label: "결정 방위",
    src: "/images/copper/sim3d_ipf",
    alt: "결정 방위를 색으로 나타낸 3차원 결정립 성장 시뮬레이션",
    cap: "Fe-1Si 판재, 표면 Si 6.5 wt%, 1100 °C. α층이 자라며 결정립이 커지는 과정을 결정 방위 색(IPF)으로 봅니다.",
  },
  si: {
    label: "Si 농도",
    src: "/images/copper/sim3d_si",
    alt: "Si 농도장과 결정립계를 보여 주는 3차원 시뮬레이션",
    cap: "같은 계산의 Si 농도장입니다. 표면에서 안쪽으로 Si가 퍼지면서 α/γ 경계가 움직입니다.",
  },
  al: {
    label: "Al 확산 단면",
    src: "/images/copper/sim2d_al",
    alt: "한 면을 Al로 코팅한 판재 단면에서 Al이 확산하는 2차원 시뮬레이션",
    cap: "Fe-0.5Si 200 μm 판재에 Al 20 μm를 한 면 코팅한 단면입니다. Al이 퍼지는 깊이와 결정립을 함께 추적합니다.",
  },
};
type SimKey = keyof typeof SIMS;
const v = (i: number | string, k = "--i") => ({ [k]: i } as CSSProperties);

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
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <h1 className="display lines">
            <span className="line">
              <span data-line style={v(0)}>
                데이터로 소재를
              </span>
            </span>
            <span className="line">
              <span data-line style={v(1)}>
                설계하는 연구실
              </span>
            </span>
          </h1>
          <p className="lede" data-load style={v("420ms", "--d")}>
            국립부경대학교 DDMD Lab(Data Driven Material Design Lab)은 자성 재료와 집합조직을 계산하고 학습해, 실험 전에
            소재를 설계합니다.
          </p>
          <div className="btns" data-load style={v("480ms", "--d")}>
            <button type="button" className="btn" onClick={() => document.getElementById("what")?.scrollIntoView()}>
              연구 둘러보기 <i>↓</i>
            </button>
          </div>
        </div>
        <figure className="magnet" data-open>
          <canvas
            ref={ref}
            role="img"
            aria-label="막대자석 주위의 자기력선을 3차원으로 그린 애니메이션. 위쪽 분홍 면은 N극, 아래 민트 면은 S극. 마우스를 움직이면 기울기가 바뀝니다."
          />
          <figcaption>
            쌍극자 자기력선 r = L·sin²θ, 기울기 <b ref={tiltRef}>22°</b> · 방위각 <b ref={azRef}>0°</b>
          </figcaption>
        </figure>
      </div>
    </header>
  );
}

function LabStage() {
  const [sim, setSim] = useState<SimKey>("ipf");
  const s = SIMS[sim];
  return (
    <section className="band" id="lab">
      <div className="wrap showcase">
        <figure className="plate">
          <Loop gif={s.src + ".gif"} label={s.alt} />
        </figure>
        <div className="sc-copy">
          <h2 className="h">
            계산하는 모델,
            <br />
            측정하는 실험실.
          </h2>
          <p className="body">
            시뮬레이션과 AI 모델이 조직 변화를 먼저 계산하고, 실험실의 SEM과 3D CT가 그 결과를 확인합니다. 측정값은 다시 모델의
            학습 데이터가 됩니다.
          </p>
          <div className="tabs" role="tablist" aria-label="시뮬레이션 선택">
            {(Object.keys(SIMS) as SimKey[]).map((k) => (
              <button key={k} type="button" role="tab" aria-selected={k === sim} onClick={() => setSim(k)}>
                {SIMS[k].label}
              </button>
            ))}
          </div>
          <p className="cap">{s.cap}</p>
          <ul className="kit" aria-label="실험실 장비">
            {(
              [
                ["/images/mini SEM.jpg", "Mini SEM", "미세조직 관찰", "sem"],
                ["/images/OM.jpg", "광학 현미경", "조직 관찰", "om"],
                ["/images/3D_CT.jpg", "3D CT", "내부 3차원 구조", "ct"],
                ["/images/열처리.jpg", "가스 열처리로", "탈탄·확산 열처리", "gas"],
              ] as [string, string, string, EquipId][]
            ).map(([img, name, role, eq]) => (
              <li key={name}>
                <img src={img} alt={name} loading="lazy" />
                <Equip3D id={eq} name={name} />
                <span>
                  <b>{name}</b>
                  {role}
                </span>
              </li>
            ))}
          </ul>
          <div className="cells">
            <Link className="cell ink" to="/facilities/Facilities">
              연구 장비 보기 <i>→</i>
            </Link>
            <Link className="cell tone" to="/project/ResearchAreas">
              연구 분야 <i>→</i>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Papers() {
  const [a, b, c, d] = papers;
  return (
    <section className="band" id="papers">
      <div className="wrap stagger">
        {a && <PaperTile paper={a} className="t1" />}
        <div className="st-head">
          <h2 className="h">
            연구실
            <br />
            최근 논문
          </h2>
          <Link className="ulink" to="/project/PublishedPapers">
            전체 {papers.length}편 보기 →
          </Link>
        </div>
        {b && <PaperTile paper={b} className="t2" />}
        {c && <PaperTile paper={c} className="t3" />}
        {d && <PaperTile paper={d} className="t4" />}
      </div>
    </section>
  );
}

function Team() {
  const team = [
    { name: piProfile.nameKo, role: "지도교수", img: piProfile.photo, to: "/about/Pi" },
    ...masters.map((m) => ({ name: krName(m.name), role: "석사과정", img: m.profileImg, to: "/about/Members" })),
    ...undergraduates.map((m) => ({ name: krName(m.name), role: "학부연구생", img: m.profileImg, to: "/about/Members" })),
  ];
  const alumniNames = alumni.map((x) => krName(x.name)).join("·");
  return (
    <section className="band" id="people">
      <div className="wrap">
        <div className="team">
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
            <p className="body">
              석사과정 {masters.length}명과 학부연구생 {undergraduates.length}명이 자성 소재 데이터, 시뮬레이션, AI 모델을 함께
              다룹니다.{alumniNames && ` 졸업생: ${alumniNames}.`}
            </p>
            <div className="btns">
              <Link className="btn" to="/about/Members">
                구성원 보기 <i>→</i>
              </Link>
              <Link className="ulink" to="/join_us/Join_us">
                지원 안내
              </Link>
            </div>
          </div>
        </div>
        <ul className="roster">
          {team.map((p) => (
            <li key={p.name}>
              <Link to={p.to}>
                <span className="ph">
                  <img src={p.img} alt={p.name} loading="lazy" />
                </span>
                <b>{p.name}</b>
                <span>{p.role}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function News() {
  const items = newsData.slice(0, 6);
  return (
    <section className="band" id="news">
      <div className="wrap">
        <div className="nl-head">
          <h2 className="h">The latest from DDMD Lab</h2>
          <Link className="ulink" to="/activities/News">
            소식 {newsData.length}건 모두 보기 →
          </Link>
        </div>
        <ul className="nl">
          {items.map((n) => (
            <NewsLine key={n.date + n.comments.slice(0, 12)} item={n} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function Home() {
  return (
    <>
      <Hero />

      <section className="band intro" id="what" aria-labelledby="what-h">
        <div className="wrap">
          <h2 className="sr" id="what-h">
            DDMD Lab이 하는 일
          </h2>
          <Statement
            parts={[
              "전기강판",
              <Thumb src="/images/our_work(2).jpg" pos="40% 50%" />,
              "의 결정 방위",
              <Thumb src="/images/copper/sim3d_ipf-poster.jpg" pos="45% 52%" zoom={2.4} />,
              "와 미세조직",
              <Thumb src="/images/copper/grain.jpg" />,
              "에서 자기 특성까지 계산하고 학습해, 더 적은 실험으로 원하는 자성 소재에 닿습니다.",
            ]}
          />
        </div>
      </section>

      <ChartSection />
      <LabStage />
      <RoomSection />
      <ResearchIndex />
      <LoopSection />

      <svg className="split-band" viewBox="0 0 2 1" preserveAspectRatio="none" aria-hidden="true">
        <rect x="0" y="0" width="1" height="1" className="n" />
        <rect x="1" y="0" width="1" height="1" className="s" />
      </svg>

      <section className="band" id="leader">
        <div className="wrap">
          <PIBlock />
        </div>
      </section>

      <Papers />
      <Team />
      <News />
      <JoinField />
    </>
  );
}

export default Home;
