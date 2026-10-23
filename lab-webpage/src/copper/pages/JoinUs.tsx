import { useRef } from "react";
import { PageHead, useCopy } from "../ui";
import { Mark } from "../sections";

const EMAIL = "newtain@pknu.ac.kr";

const AREAS = [
  { title: "친환경 모빌리티 핵심 소재 개발", desc: "모터코어용 고효율 무방향성 전기강판(Non-oriented Electrical Steel)의 특성 최적화 연구", img: "/images/our_work(2).jpg", cover: true },
  { title: "공정 조건 최적화 및 설계", desc: "능동 학습(Active Learning) 기법으로 실험 횟수를 줄이고, 최소한의 데이터로 최대의 물성을 확보하는 지능형 공정 설계", img: "/images/join_us_optimg.png" },
  { title: "AI 기반 소재 지능화", desc: "데이터 증강(Data Augmentation) 및 생성형 모델을 활용한 재료 물성 예측 AI 모델 고도화", img: "/images/join_us_증강.png" },
  { title: "시뮬레이션을 활용한 재료 설계", desc: "Pandat 및 CALPHAD 기반의 열역학 시뮬레이션과 재료 AI 모델을 결합한 최적 설계", img: "/images/pandat_고화질.png", cover: true },
];

const BENEFITS = [
  {
    title: "체계적이고 수평적인 연구 지도",
    items: [
      "Weekly Meeting을 통해 개별 연구의 방향성을 점검하고 심도 있는 피드백을 제공합니다.",
      "교수님과의 상시 메신저 소통을 통해 연구 중 발생하는 문제에 대해 즉각적인 논의가 가능합니다.",
    ],
  },
  {
    title: "Materials AI 연구",
    items: [
      "학과 내 유일한 '재료 AI(Materials AI)' 연구실로서, 도메인 지식과 데이터 사이언스 역량을 동시에 갖춘 융합 인재로 성장할 수 있습니다.",
      "SEM-EDS, XRD, CT, DMA, Vacuum/Gas Furnace 등 풍부한 재료 분석 장비를 직접 운용하며 실전 데이터 획득 역량을 키울 수 있습니다.",
    ],
  },
  {
    title: "쾌적한 환경",
    items: [
      "개별 모니터 제공 및 집중도 높은 넓고 쾌적한 연구 공간을 보장합니다.",
      "대규모 프로젝트 및 산학 프로젝트 참여를 통해 연구비 지원은 물론 실무 네트워크 형성 기회를 제공합니다.",
    ],
  },
];

const IDEAL = [
  "신소재공학 지식에 AI 기술을 접목해 보고 싶은 분",
  "최신 연구 트렌드에 민감하고, 분석 장비 활용 능력을 키우고 싶은 분",
  "자유로운 분위기 속에서 다양한 연구 성과를 만들어가고 싶은 분",
];

function JoinUs() {
  const { copied, copy } = useCopy(EMAIL);
  const mailRef = useRef<HTMLElement>(null);
  return (
    <>
      <PageHead label="Join us" title="Join Us" ko="다음 소재를 함께 설계할 학부연구생과 대학원생을 찾습니다." />
      <section className="wrap band-s">
        <h2 className="h">주요 연구 분야</h2>
        <div className="grid4" style={{ marginTop: 32 }}>
          {AREAS.map((a) => (
            <article key={a.title} className="tile">
              <div className={a.cover ? "pic cover" : "pic"} style={{ background: "#fff" }}>
                <img src={a.img} alt={a.title} loading="lazy" />
              </div>
              <div className="txt">
                <h3>{a.title}</h3>
                <p>{a.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="wrap band-s">
        <h2 className="h">연구실 혜택</h2>
        <div className="grid3" style={{ marginTop: 32 }}>
          {BENEFITS.map((b) => (
            <article key={b.title} className="tile">
              <div className="txt">
                <h3>{b.title}</h3>
                <ul className="dots mute">
                  {b.items.map((i) => (
                    <li key={i} style={{ fontSize: 14 }}>
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="wrap band-s">
        <h2 className="h">이런 분들과 함께하고 싶습니다</h2>
        <ul className="ideal">
          {IDEAL.map((t) => (
            <li key={t}>
              <Mark size={22} />
              {t}
            </li>
          ))}
        </ul>
      </section>
      <section className="wrap band-s">
        <div className="joinbox">
          <h2 className="h">관심 있으신가요?</h2>
          <p className="body" style={{ margin: 0 }}>CV와 간단한 자기소개를 아래 주소로 보내 주세요.</p>
          <button type="button" className="btn" onClick={() => copy(mailRef.current)}>
            <span ref={mailRef}>{EMAIL}</span>
            <i>{copied ? "복사됨" : "복사"}</i>
          </button>
        </div>
      </section>
    </>
  );
}

export default JoinUs;
