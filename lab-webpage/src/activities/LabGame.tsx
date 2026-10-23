import React, { useState } from "react";
import PolishingGame from "./games/PolishingGame";
import HeatTreatmentGame from "./games/HeatTreatmentGame";
import { Card } from "../components/Card";

function LabGame() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const games = [
    {
      id: "polishing",
      title: "시편 연마의 달인",
      englishTitle: "Polishing Master",
      description:
        "거친 시편 표면을 매끄럽게 연마하여 금속 조직을 관찰할 수 있는 상태로 만듭니다.",
      icon: "💿",
      color: "bg-blue-600",
    },
    {
      id: "heattreatment",
      title: "열처리 마스터",
      englishTitle: "Heat Treatment Master",
      description:
        "온도와 시간을 정밀하게 조절하여 목표로 하는 결정립 크기(Grain Size)를 구현합니다.",
      icon: "🔥",
      color: "bg-orange-600",
    },
  ];

  if (selectedGame === "polishing") {
    return (
      <div>
        <div className="mx-[10%] mt-6">
          <button
            onClick={() => setSelectedGame(null)}
            className="text-title font-bold flex items-center hover:translate-x-[-5px] transition-transform"
          >
            ← 게임 선택으로 돌아가기
          </button>
        </div>
        <PolishingGame />
      </div>
    );
  }

  if (selectedGame === "heattreatment") {
    return (
      <div>
        <div className="mx-[10%] mt-6">
          <button
            onClick={() => setSelectedGame(null)}
            className="text-title font-bold flex items-center hover:translate-x-[-5px] transition-transform"
          >
            ← 게임 선택으로 돌아가기
          </button>
        </div>
        <HeatTreatmentGame />
      </div>
    );
  }

  return (
    <div className="mx-[10%] my-20 font-sans">
      <div className="text-center mb-20">
        <h1 className="sr-only">
          LAB EXPERIENCE
        </h1>
        <p className="text-gray-500 text-xl max-w-2xl mx-auto leading-relaxed">
          우리 연구실의 핵심 실험 과정을 미니 게임으로 체험해보세요. <br />
          실제 연구 데이터와 물리 법칙을 바탕으로 구성되었습니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {games.map((game) => (
          <Card
            key={game.id}
            className="group cursor-pointer hover:shadow-2xl transition-all duration-500 border-2 border-slate-100 overflow-hidden transform hover:-translate-y-2"
            onClick={() => setSelectedGame(game.id)}
          >
            <div
              className={`h-4 bg-slate-200 group-hover:${game.color} transition-colors duration-500`}
            ></div>
            <div className="p-10 text-center">
              <div className="text-7xl mb-8 group-hover:scale-110 transition-transform duration-500 inline-block">
                {game.icon}
              </div>
              <h3 className="text-sm font-bold text-blue-600 uppercase tracking-[0.3em] mb-2">
                {game.englishTitle}
              </h3>
              <h2 className="text-3xl font-bold text-slate-800 mb-6">
                {game.title}
              </h2>
              <p className="text-gray-500 leading-relaxed mb-10">
                {game.description}
              </p>
              <div className="inline-flex items-center justify-center px-8 py-3 bg-slate-900 text-white rounded-full font-bold group-hover:bg-title transition-colors">
                실험 시작하기
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-24 text-center text-gray-400">
        <p>더 많은 가상 실험 콘텐츠가 곧 업데이트될 예정입니다.</p>
      </div>
    </div>
  );
}

export default LabGame;
