import { Label, PageHead, groupOf } from "../ui";
import { ResearchTrack } from "../sections";

const AREAS = [
  {
    img: "/images/copper/ra1.jpg",
    title: "모빌리티 모터용 철강 소재",
    points: ["전기차·드론 모터용 자성 철강 소재의 성능 향상", "저손실·고자속밀도 확보를 위한 공정 조건 최적화"],
    tags: ["고효율 철심 소재", "에너지 효율 향상", "도심형 드론", "전기자동차"],
  },
  {
    img: "/images/copper/ra2.jpg",
    title: "항공기 및 선박 센서용 자왜 소재",
    points: ["고강도·고성능 자왜 합금 소재 연구", "자왜 안정화를 위한 미세조직 제어 및 성분 설계"],
    tags: ["고감도 소재", "결빙 인식", "센서용 소재"],
  },
  {
    img: "/images/copper/ra3.jpg",
    title: "재료 인공지능 공정 및 성분 최적 설계",
    points: ["AI 기반 분석을 통한 공정·성분 조건의 최적 설계", "물성 예측 모델과 시뮬레이션을 활용한 신소재 개발"],
    tags: ["베이지안 최적화", "신소재 개발", "공정 최적화", "AI for Materials"],
  },
  {
    img: "/images/copper/ra4.jpg",
    title: "금속 확산과 집합조직 및 자성 분석",
    points: ["철강 확산 열처리에 따른 집합조직 형성과 변화 분석", "XRD, EBSD 기반 조직과 자기적 특성 상관관계 규명"],
    tags: ["XRD/EBSD 분석", "자성 특성", "3D 프린팅", "철강 압연 시뮬레이션"],
  },
];

const INTRO = [
  ["첨단 모빌리티 핵심 소재인 ", "전기강판 등 자성재료", "의 물성 향상을 목표로 연구를 수행합니다."],
  ["", "진공·가스 열처리 공정", "과 자성, 집합조직 및 압연 거동을 분석하여 소재 성능을 체계적으로 규명합니다."],
  ["", "AI 기반 공정 최적화", "와 금속 소재 시뮬레이션을 통해 차세대 자성 소재 개발 및 개발 방식을 혁신합니다."],
];

function ResearchAreas() {
  return (
    <>
      <PageHead label="Research" title="Research Areas" ko="자성 재료 · 집합조직 · AI 소재 설계 · 시뮬레이션" group={groupOf("Research")} />
      <section className="wrap band-s">
        <Label>Introduction</Label>
        <ul className="dots" style={{ marginTop: 24, maxWidth: 820, gap: 14 }}>
          {INTRO.map(([a, b, c]) => (
            <li key={b} style={{ fontSize: 19 }}>
              {a}
              <b className="sage" style={{ fontWeight: 400 }}>
                {b}
              </b>
              {c}
            </li>
          ))}
        </ul>
      </section>
      <ResearchTrack />
      <section className="wrap band-s">
        <Label>Major research areas</Label>
        <h2 className="h">주요 연구 분야</h2>
        <div className="grid2" style={{ marginTop: 36 }}>
          {AREAS.map((a) => (
            <article key={a.title} className="tile">
              <div className="pic">
                <img src={a.img} alt={a.title} loading="lazy" />
              </div>
              <div className="txt">
                <h3>{a.title}</h3>
                <ul className="dots mute">
                  {a.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                <div className="tagrow">
                  {a.tags.map((t) => (
                    <span key={t} className="chip">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

export default ResearchAreas;
