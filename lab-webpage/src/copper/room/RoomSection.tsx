// 홈 "실험실을 돌려 보세요" 구역. 무거운 3D 부분(three.js)은 화면 가까이 와야 내려받는다.
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useMedia } from "../sections";
import { ROOMS, roomById, RoomId } from "./data";

const Lab3D = lazy(() => import("./Lab3D"));

export default function RoomSection() {
  const [room, setRoom] = useState<RoomId>("materials");
  const [sel, setSel] = useState<string | null>(null);
  const [near, setNear] = useState(false);
  const [failed, setFailed] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const touch = useMedia("(pointer: coarse)");

  useEffect(() => {
    const el = stage.current;
    if (!el || !("IntersectionObserver" in window)) return setNear(true);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const R = roomById(room);
  const it = R.items.find((i) => i.id === sel);
  const poster = <img className="rm-poster" src={R.poster} alt={R.alt} />;

  return (
    <section className="band" id="room">
      <div className="wrap">
        <div className="rm-head">
          <h2 className="h">
            실험실을
            <br />
            돌려 보세요.
          </h2>
          <p className="body">
            사진을 보고 대략 만든 입체 모형입니다. {touch ? "옆으로 밀어" : "끌어서"} 돌려 보고, 장비 이름을 누르면 그 자리로 다가갑니다.
          </p>
        </div>
        <div className="rm">
          <div className="rm-stage" ref={stage}>
            {near && !failed ? (
              <Suspense fallback={poster}>
                <Lab3D room={room} sel={sel} onSel={setSel} onFail={() => setFailed(true)} label={R.alt} />
              </Suspense>
            ) : (
              poster
            )}
            {sel && !failed && (
              <button type="button" className="btn small rm-all" onClick={() => setSel(null)}>
                전체 보기
              </button>
            )}
          </div>
          <div className="rm-side">
            {ROOMS.length > 1 && (
              <div className="tabs" role="tablist" aria-label="방 고르기">
                {ROOMS.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    role="tab"
                    aria-selected={r.id === room}
                    onClick={() => {
                      setRoom(r.id);
                      setSel(null);
                    }}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            )}
            <ul className="rm-list" aria-label={R.label + " 장비"}>
              {R.items.map((i) => (
                <li key={i.id}>
                  <button type="button" aria-pressed={sel === i.id} onClick={() => setSel(sel === i.id ? null : i.id)}>
                    {i.name}
                  </button>
                </li>
              ))}
            </ul>
            <p className="cap" aria-live="polite">
              {it ? (
                <>
                  <b>{it.name}</b>
                  {it.desc}
                </>
              ) : failed ? (
                "이 브라우저에서는 3D를 그릴 수 없어 정지 그림으로 보여 드립니다."
              ) : (
                "가만히 두면 천천히 돌아갑니다. 배치와 크기는 사진을 보고 어림한 것입니다."
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
