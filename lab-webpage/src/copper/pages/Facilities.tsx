import { PageHead } from "../ui";
import Equip3D from "../equip/Equip3D";
import type { EquipId } from "../equip/models";

type Item = { img: string; name: string; ko?: string; eq?: EquipId; imgs?: string[]; contain?: boolean };
const GROUPS: { title: string; ko: string; items: Item[] }[] = [
  {
    title: "Microstructure and Texture",
    ko: "미세조직과 집합조직",
    items: [
      { img: "/images/mini SEM.jpg", name: "Mini SEM", ko: "탁상형 전자현미경", eq: "sem" },
      { img: "/images/electro polish.jpg", name: "Electrolytic Polisher", ko: "전해 연마기", eq: "electro" },
      { img: "/images/auto polisher.jpg", name: "Auto Polishing Machine", ko: "자동 연마기", eq: "polish" },
      { img: "/images/mounting.jpg", name: "Mounting Machine", ko: "마운팅 프레스", eq: "press" },
      { img: "/images/OM.jpg", name: "Optical Microscope", ko: "광학 현미경", eq: "om" },
    ],
  },
  {
    title: "Furnace",
    ko: "열처리",
    items: [
      { img: "/images/열처리.jpg", name: "Gas Furnace (H decarburization & diffusion)", ko: "가스 열처리로", eq: "gas" },
      { img: "/images/heat furnace.jpg", name: "Heat Furnace", ko: "박스 열처리로", eq: "box" },
    ],
  },
  {
    title: "3D Printing & Material Defect Analysis",
    ko: "3D 프린팅과 재질 결함 분석",
    items: [
      { img: "/images/3D_CT.jpg", name: "3D CT", ko: "X선 3차원 CT", eq: "ct" },
      { img: "/images/인장시험기.png", name: "인장시험기기", ko: "Universal Testing Machine", eq: "utm" },
      { img: "/images/재질결함분석1.jpg", name: "재질결함분석", ko: "거칠기 측정기 · 밀도계", eq: "defect", imgs: ["/images/재질결함분석1.jpg", "/images/재질결함분석2.jpg"] },
      { img: "/images/3D profiler.jpg", name: "3D Profiler", ko: "3D 형상 측정기", eq: "prof" },
    ],
  },
  {
    title: "Simulation",
    ko: "시뮬레이션",
    items: [
      { img: "/images/pandat_1.png", name: "Pandat", contain: true },
      { img: "/images/oim_logo.webp", name: "OIM", contain: true },
      { img: "/images/python_ai.jpg", name: "Python · AI", contain: true },
    ],
  },
];

// 실제 장비: 사진과 입체 모형을 나란히
function EquipCard({ it }: { it: Item }) {
  return (
    <figure className="eq-card">
      <div className="eq-pair">
        <div className="eq-pic">
          {(it.imgs || [it.img]).map((src) => (
            <img key={src} src={src} alt={it.name} loading="lazy" />
          ))}
        </div>
        <Equip3D id={it.eq!} name={it.ko || it.name} />
      </div>
      <figcaption>
        <b>{it.name}</b>
        {it.ko && <span>{it.ko}</span>}
      </figcaption>
    </figure>
  );
}

function Facilities() {
  return (
    <>
      <PageHead
        label="Facilities"
        title="Facilities"
        ko="직접 운용하는 분석·열처리 장비와 시뮬레이션 도구. 사진 옆 입체 모형은 끌어서 돌려 볼 수 있습니다."
      />
      {GROUPS.map((g) => (
        <section key={g.title} className="wrap band-s">
          <div className="head-row">
            <h2 className="h">{g.ko}</h2>
            <p className="tag" style={{ margin: 0 }}>
              {g.title} · {g.items.length}종
            </p>
          </div>
          {g.items[0].eq ? (
            <div className="eq-grid">
              {g.items.map((it) => (
                <EquipCard key={it.name} it={it} />
              ))}
            </div>
          ) : (
            <div className="grid4" style={{ marginTop: 24 }}>
              {g.items.map((it) => (
                <figure key={it.name} className="tile" style={{ margin: 0 }}>
                  <div className={it.contain ? "pic" : "pic cover dark"} style={{ aspectRatio: "4 / 3", display: "flex", gap: 2 }}>
                    {(it.imgs || [it.img]).map((src) => (
                      <img key={src} src={src} alt={it.name} loading="lazy" style={{ minWidth: 0, flex: 1, padding: it.contain ? 18 : 0 }} />
                    ))}
                  </div>
                  <figcaption className="txt" style={{ padding: "14px 16px 16px" }}>
                    <b style={{ fontWeight: 600 }}>{it.name}</b>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </section>
      ))}
    </>
  );
}

export default Facilities;
