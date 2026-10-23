import { PageHead, groupOf } from "../ui";

const PAPERS = [
  {
    src: "/images/must_read_paper_1.png",
    title: "Effect of annealing on the microstructure and magnetic properties of soft magnetic Fe-Si produced via laser additive manufacturing",
    keywords: "Additive manufacturing, Annealing, Powder processing, Soft magnetic materials, Magnetic properties",
  },
  {
    src: "/images/must_read_paper_2.png",
    title: "Diffusion driven columnar grain growth induced in an Al–Si-coated steel substrate",
    keywords: "Diffusion, Metallic coating, Grain growth, Phase transformation, Electrical steel",
  },
  {
    src: "/images/must_read_paper_3.png",
    title: "Development of (100) Texture in Silicon Steel Sheets by Removal of Manganese and Decarburization",
    keywords: "(100) texture, Removal of manganese, Decarburization, Silicon steel sheets, Magnetic properties",
  },
  {
    src: "/images/must_read_paper_4.png",
    title: "COMBO: An efficient Bayesian optimization library for materials science",
    keywords: "Bayesian optimization, Python library, Global optimization, Materials design",
  },
];

function MustRead() {
  return (
    <>
      <PageHead label="Research" title="Must Read Papers" ko="연구실에 들어오면 먼저 읽는 논문" group={groupOf("Research")} />
      <section className="wrap band-s">
        <div className="grid2">
          {PAPERS.map((p) => (
            <article key={p.title} className="tile">
              <div className="pic" style={{ background: "#fff", aspectRatio: "4 / 3" }}>
                <img src={p.src} alt={p.title} loading="lazy" style={{ objectFit: "cover", objectPosition: "top" }} />
              </div>
              <div className="txt">
                <h3>{p.title}</h3>
                <div className="tagrow">
                  {p.keywords.split(",").map((k) => (
                    <span key={k} className="chip">
                      {k.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

export default MustRead;
