// 장비 사진 옆에 붙는 입체 모형 창. three.js 묶음은 창이 화면 가까이 올 때 한 번만 내려받는다.
import { useEffect, useRef, useState } from "react";
import type { EquipId } from "./models";

export default function Equip3D({ id, name, className = "" }: { id: EquipId; name: string; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"wait" | "ready" | "fail">("wait");

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let alive = true;
    let view: { dispose: () => void } | null = null;
    const load = () =>
      import("./hub")
        .then((m) => {
          if (!alive) return;
          view = m.mount(el, id);
          setState(view ? "ready" : "fail");
        })
        .catch(() => alive && setState("fail"));
    if (!("IntersectionObserver" in window)) load();
    const io =
      "IntersectionObserver" in window
        ? new IntersectionObserver(
            ([e]) => {
              if (e.isIntersecting) {
                io?.disconnect();
                load();
              }
            },
            { rootMargin: "400px 0px" }
          )
        : null;
    io?.observe(el);
    return () => {
      alive = false;
      io?.disconnect();
      view?.dispose();
    };
  }, [id]);

  return (
    <div ref={box} className={"eq3d " + className} data-state={state} role="img" aria-label={`${name} 입체 모형. 끌어서 돌려 볼 수 있습니다.`}>
      {state === "fail" ? <span className="eq3d-note">이 브라우저에서는 입체 모형을 그릴 수 없습니다</span> : <span className="eq3d-chip">3D</span>}
    </div>
  );
}
