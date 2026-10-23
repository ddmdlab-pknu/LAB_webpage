import { Label, PageHead } from "../ui";

const GROUPS: { title: string; ko: string; items: { img: string; name: string; imgs?: string[]; contain?: boolean }[] }[] = [
  {
    title: "Microstructure and Texture",
    ko: "미세조직과 집합조직",
    items: [
      { img: "/images/mini SEM.jpg", name: "Mini SEM" },
      { img: "/images/electro polish.jpg", name: "Electrolytic Polisher" },
      { img: "/images/auto polisher.jpg", name: "Auto Polishing Machine" },
      { img: "/images/mounting.jpg", name: "Mounting Machine" },
      { img: "/images/OM.jpg", name: "Optical Microscope" },
    ],
  },
  {
    title: "Furnace",
    ko: "열처리",
    items: [
      { img: "/images/열처리.jpg", name: "Gas Furnace (H decarburization & diffusion)" },
      { img: "/images/heat furnace.jpg", name: "Heat Furnace" },
    ],
  },
  {
    title: "3D Printing & Material Defect Analysis",
    ko: "3D 프린팅과 재질 결함 분석",
    items: [
      { img: "/images/3D_CT.jpg", name: "3D CT" },
      { img: "/images/인장시험기.png", name: "인장시험기기" },
      { img: "/images/재질결함분석1.jpg", name: "재질결함분석", imgs: ["/images/재질결함분석1.jpg", "/images/재질결함분석2.jpg"] },
      { img: "/images/3D profiler.jpg", name: "3D Profiler" },
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

function Facilities() {
  return (
    <>
      <PageHead label="Facilities" title="Facilities" ko="직접 운용하는 분석·열처리 장비와 시뮬레이션 도구" />
      {GROUPS.map((g) => (
        <section key={g.title} className="wrap band-s">
          <div className="head-row">
            <div>
              <Label>{g.ko}</Label>
              <h2 className="h3" style={{ marginTop: 16 }}>
                {g.title}
              </h2>
            </div>
            <span className="chip">{g.items.length}</span>
          </div>
          <div className="grid4" style={{ marginTop: 24 }}>
            {g.items.map((it) => (
              <figure key={it.name} className="tile" style={{ margin: 0 }}>
                <div className={it.contain ? "pic" : "pic cover dark"} style={{ aspectRatio: "4 / 3", display: "flex", gap: 2 }}>
                  {(it.imgs || [it.img]).map((src) => (
                    <img key={src} src={src} alt={it.name} loading="lazy" style={{ minWidth: 0, flex: 1, padding: it.contain ? 18 : 0 }} />
                  ))}
                </div>
                <figcaption className="txt" style={{ padding: "12px 14px 14px" }}>
                  <b style={{ fontWeight: 500, fontSize: 15 }}>{it.name}</b>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}

export default Facilities;
