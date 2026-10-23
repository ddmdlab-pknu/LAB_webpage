import { useState } from "react";
import { PageHead, groupOf } from "../ui";
import PolishingGame from "../../activities/games/PolishingGame";
import HeatTreatmentGame from "../../activities/games/HeatTreatmentGame";

const GAMES = [
  {
    id: "polishing",
    title: "시편 연마의 달인",
    en: "Polishing Master",
    desc: "거친 시편 표면을 매끄럽게 연마하여 금속 조직을 관찰할 수 있는 상태로 만듭니다.",
  },
  {
    id: "heattreatment",
    title: "열처리 마스터",
    en: "Heat Treatment Master",
    desc: "온도와 시간을 정밀하게 조절하여 목표로 하는 결정립 크기(Grain Size)를 구현합니다.",
  },
];

function LabGame() {
  const [game, setGame] = useState<string | null>(null);
  return (
    <>
      <PageHead label="Activities" title="Lab Game" ko="연구실의 핵심 실험 과정을 미니 게임으로 체험해 보세요." group={groupOf("Activities")} />
      <section className="wrap band-s">
        {game ? (
          <>
            <button type="button" className="btn tone" onClick={() => setGame(null)}>
              ← 게임 선택으로 <i />
            </button>
            <div className="cream" style={{ marginTop: 20 }}>
              {game === "polishing" ? <PolishingGame /> : <HeatTreatmentGame />}
            </div>
          </>
        ) : (
          <div className="grid2">
            {GAMES.map((g) => (
              <button
                key={g.id}
                type="button"
                className="panel"
                onClick={() => setGame(g.id)}
                style={{ textAlign: "left", cursor: "pointer", minHeight: 260, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 24 }}
              >
                <span>
                  <span className="h3" style={{ display: "block" }}>
                    {g.title}
                  </span>
                  <span className="tag" style={{ display: "block", marginTop: 6 }}>
                    {g.en}
                  </span>
                  <span className="body" style={{ display: "block", marginTop: 16 }}>
                    {g.desc}
                  </span>
                </span>
                <span className="more" style={{ width: "100%" }}>
                  게임 시작 <i>→</i>
                </span>
              </button>
            ))}
          </div>
        )}
        <p className="cap">실제 연구 데이터와 물리 법칙을 바탕으로 구성했습니다.</p>
      </section>
    </>
  );
}

export default LabGame;
