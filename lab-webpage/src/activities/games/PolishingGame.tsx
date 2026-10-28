import React, { useRef, useEffect, useState, useCallback } from "react";
import { Card } from "../../components/Card";

const STAGES = [
  {
    label: "거친 연마 (#400)",
    description: "큰 스크래치를 제거합니다.",
    threshold: 40,
  },
  {
    label: "중간 연마 (#1200)",
    description: "표면을 평탄하게 만듭니다.",
    threshold: 40,
  },
  {
    label: "정밀 연마 (Diamond)",
    description: "거울처럼 매끄럽게 만듭니다.",
    threshold: 40,
  },
];

function PolishingGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stage, setStage] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);

  const [polishedPoints, setPolishedPoints] = useState<Set<string>>(new Set());

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    ctx.fillStyle =
      stage === 0 ? "#94a3b8" : stage === 1 ? "#cbd5e1" : "#e2e8f0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "rgba(0,0,0,0.2)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 50 / (stage + 1); i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    setPolishedPoints(new Set());
    setProgress(0);
  }, [stage]);

  useEffect(() => {
    if (isGameStarted && !isFinished) {
      initCanvas();
    }
  }, [isGameStarted, stage, isFinished, initCanvas]);

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || isFinished) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ("touches" in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = ("touches" in e ? e.touches[0].clientY : e.clientY) - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 35, 0, Math.PI * 2);
    ctx.fill();

    const gridX = Math.floor(x / 25);
    const gridY = Math.floor(y / 25);
    const pointKey = `${gridX},${gridY}`;

    if (!polishedPoints.has(pointKey)) {
      const newPoints = new Set(polishedPoints);
      newPoints.add(pointKey);
      setPolishedPoints(newPoints);

      const totalGrids = (canvas.width / 25) * (canvas.height / 25);
      const currentProgress = (newPoints.size / totalGrids) * 100 * 1.5;
      const safeProgress = Math.min(currentProgress, 100);
      setProgress(safeProgress);

      if (safeProgress >= STAGES[stage].threshold) {
        if (stage < STAGES.length - 1) {
          setStage((prev) => prev + 1);
        } else {
          setIsFinished(true);
        }
      }
    }
  };

  return (
    <div className="mx-[10%] my-12 font-sans select-none">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-title mb-2">실험실 가상 체험</h1>
        <p className="text-gray-500">
          금속 시편을 문질러서 현미경 조직을 관찰해보세요!
        </p>
      </div>

      {!isGameStarted ? (
        <Card className="max-w-xl mx-auto p-10 text-center shadow-xl">
          <div className="text-6xl mb-6">💿</div>
          <h2 className="text-2xl font-bold mb-4">시편 연마 체험</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            금속 표면의 스크래치를 제거하는 과정입니다.
            <br />
            마우스로 시편을 문질러 다음 단계로 넘어가세요.
          </p>
          <button
            onClick={() => setIsGameStarted(true)}
            className="w-full bg-title text-white py-4 rounded-xl font-bold text-lg hover:bg-opacity-90 transition-all shadow-lg"
          >
            체험 시작
          </button>
        </Card>
      ) : (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100 gap-4">
            <div className="flex-1">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                현재 공정
              </span>
              <h3 className="text-xl font-bold text-slate-800">
                {STAGES[stage].label}
              </h3>
            </div>
            <div className="flex-1 w-full max-w-xs">
              <div className="flex justify-between text-xs mb-1 font-bold">
                <span>공정 진행률</span>
                <span>
                  {Math.round((progress / STAGES[stage].threshold) * 100)}%
                </span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full transition-all duration-300"
                  style={{
                    width: `${Math.min((progress / STAGES[stage].threshold) * 100, 100)}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          <Card className="relative w-full aspect-video overflow-hidden cursor-crosshair shadow-2xl border-4 border-slate-200 rounded-2xl">
            <div className="absolute inset-0">
              <img
                src="/images/grain.webp"
                alt="Specimen Grain Structure"
                className="w-full h-full object-cover"
              />
            </div>

            {!isFinished && (
              <canvas
                ref={canvasRef}
                onMouseDown={() => setIsDrawing(true)}
                onMouseUp={() => setIsDrawing(false)}
                onMouseLeave={() => setIsDrawing(false)}
                onMouseMove={handleMove}
                onTouchStart={() => setIsDrawing(true)}
                onTouchEnd={() => setIsDrawing(false)}
                onTouchMove={handleMove}
                className="absolute inset-0 w-full h-full z-10 touch-none"
              />
            )}

            {isFinished && (
              <div className="absolute inset-0 z-20 bg-black/70 backdrop-blur-sm flex items-center justify-center animate-[appear_0.5s_ease-out]">
                <div className="text-center p-8 bg-white rounded-2xl shadow-2xl max-w-sm mx-4">
                  <div className="text-5xl mb-4">✨</div>
                  <h3 className="text-2xl font-bold text-title mb-2">
                    연마 성공!
                  </h3>
                  <p className="text-gray-600 mb-6 text-sm">
                    표면이 완벽하게 다듬어졌습니다. 이제 현미경으로 조직을
                    선명하게 관찰할 수 있습니다.
                  </p>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        setStage(0);
                        setIsFinished(false);
                        setProgress(0);
                      }}
                      className="bg-title text-white px-6 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all"
                    >
                      다시 체험하기
                    </button>
                    <a
                      href="/facilities/Facilities"
                      className="text-title font-bold text-sm py-2"
                    >
                      관련 실험 장비 보기 →
                    </a>
                  </div>
                </div>
              </div>
            )}

            {!isFinished && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-black/50 text-white px-4 py-2 rounded-full text-xs font-medium animate-pulse">
                마우스로 쓱쓱 문질러주세요!
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}

export default PolishingGame;
