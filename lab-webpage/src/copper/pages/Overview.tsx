import { Link } from "react-router-dom";
import { Label, PageHead, groupOf } from "../ui";
import { piProfile } from "../../data/piData";

const RESEARCH_ON = [
  "전기차·드론·로봇의 모터와 변압기에 쓰이는 철심 소재의 자기 특성과 집합조직 향상",
  "AI로 소재와 공정 시스템 최적화",
  "금속 소재 시뮬레이션(Pandat)으로 물성 예측과 신소재 개발",
  "새로운 자성 소재 개발",
  "압연 기술을 이용한 철강 소재 물성 향상",
];

function Overview() {
  return (
    <>
      <PageHead label="About" title="Overview" ko="데이터 융합 철강소재 설계 연구실을 소개합니다." group={groupOf("About")} />
      <section className="wrap band-s">
        <div className="split" style={{ alignItems: "start" }}>
          <div>
            <Label>Introduce</Label>
            <h2 className="h">
              첨단 모빌리티의 핵심,
              <br />
              <span className="sage">자성 소재</span>를 설계합니다.
            </h2>
            <p className="body">
              <b>Data Driven Material Design Lab</b>은 첨단 모빌리티에 꼭 필요한 철심 같은 자성 소재의 물성을 높이는 연구를
              합니다. 진공·가스 열처리, 자기 특성 분석, 집합조직과 압연 특성 평가를 수행하고, AI로 여러 공정을 최적화하며 금속 소재
              시뮬레이션으로 물성을 예측해 새로운 소재를 개발합니다.
            </p>
            <p className="body" style={{ marginTop: 14 }}>
              Data Driven Material Design Lab focuses on improving the properties of magnetic materials, such as steel
              cores, which are essential in advanced mobility applications.
            </p>
          </div>
          <div className="panel" style={{ padding: 0, aspectRatio: "1", maxWidth: 520 }}>
            <img src="/images/copper/logo.jpg" alt="DDMD Lab 로고" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </div>
      </section>
      <section className="wrap band-s">
        <div className="split" style={{ alignItems: "start" }}>
          <div>
            <Label>We research on</Label>
            <h3 className="h3" style={{ marginTop: 18 }}>
              연구 주제
            </h3>
          </div>
          <ul className="dots">
            {RESEARCH_ON.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </section>
      <section className="wrap band-s">
        <div className="panel rings" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 20 }}>
          <div>
            <Label>Data Driven Material Design Lab</Label>
            <p className="h3" style={{ marginTop: 14 }}>
              데이터 융합 철강소재 설계 연구실 · Prof. {piProfile.nameKo}
            </p>
          </div>
          <div className="btns" style={{ marginTop: 0 }}>
            <Link className="btn" to="/project/ResearchAreas">
              연구 분야 <i>→</i>
            </Link>
            <Link className="btn ghost" to="/about/Pi">
              지도교수 <i>→</i>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default Overview;
