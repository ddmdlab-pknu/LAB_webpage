// 홈 "사진 한 장으로 결정립 크기를" 구역. 업로드 창은 누를 때만 내려받는다.
import { lazy, Suspense, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { GRAIN_API } from "./api";

const GrainDialog = lazy(() => import("./GrainDialog"));

// 원본 ↔ 결정립계 비교 (가운데 막대를 끌거나, 마우스를 올려 움직인다)
function Compare() {
  const [x, setX] = useState(50);
  const box = useRef<HTMLDivElement>(null);
  const move = (clientX: number) => {
    const r = box.current?.getBoundingClientRect();
    if (r) setX(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)));
  };
  return (
    <div
      className="gs-cmp"
      ref={box}
      onPointerMove={(e) => (e.pointerType === "mouse" || e.buttons) && move(e.clientX)}
      onPointerDown={(e) => move(e.clientX)}
      role="img"
      aria-label="페라이트 조직 사진. 오른쪽은 자동으로 찾은 결정립계를 초록 선으로 겹친 모습"
    >
      <img src="/images/copper/grain.jpg" alt="" loading="lazy" />
      <img src="/grain/ferrite_boundaries.jpg" alt="" loading="lazy" style={{ clipPath: `inset(0 0 0 ${x}%)` }} />
      <span className="gs-knob" style={{ left: `${x}%` }} />
    </div>
  );
}

export default function GrainSection() {
  const [open, setOpen] = useState<null | "upload" | "sample">(null);
  const ready = !!GRAIN_API; // 분석 서버 주소가 정해지기 전에는 "수정 중"으로 두고 예시 결과만 보여 준다
  return (
    <section className="band" id="grain">
      <div className="wrap gs">
        <div className="gs-copy">
          <h2 className="h">
            사진 한 장으로
            <br />
            결정립 크기를.
          </h2>
          <p className="body">
            연구실이 전기강판 사진 67장으로 학습시킨 Cellpose 모델이 결정립을 나누고, ASTM E112 방식으로 결정립도 G 와 크기 분포를 계산합니다.
            {ready ? " 갖고 있는 광학 현미경 사진을 올려 보세요." : " 사진을 올려 재는 기능은 지금 수정 중이고, 예시 결과는 바로 볼 수 있습니다."}
          </p>
          {ready ? (
            <div className="btns">
              <button type="button" className="btn" onClick={() => setOpen("upload")}>
                사진 올려 재기 <i>↗</i>
              </button>
              <button type="button" className="ulink" onClick={() => setOpen("sample")}>
                예시 결과 보기
              </button>
            </div>
          ) : (
            <div className="btns">
              <button type="button" className="btn" onClick={() => setOpen("sample")}>
                예시 결과 보기 <i>↗</i>
              </button>
              <span className="gs-wip">사진 올려 재기 · 수정 중</span>
            </div>
          )}
          <p className="cap">사진 속 스케일바(파란 선)의 길이를 찾고, 입력한 스케일바 값(μm)으로 크기를 맞춥니다. 사진은 분석에만 쓰고 저장하지 않습니다.</p>
        </div>
        <figure className="gs-fig">
          <Compare />
          <figcaption className="cap">왼쪽은 원본, 오른쪽은 자동으로 찾은 결정립계. 가운데를 끌어 비교해 보세요.</figcaption>
        </figure>
      </div>
      {open &&
        createPortal(
          <Suspense fallback={null}>
            <GrainDialog onClose={() => setOpen(null)} startWithSample={open === "sample"} />
          </Suspense>,
          document.querySelector(".cu") || document.body
        )}
    </section>
  );
}
