import { useState } from "react";
import { Link } from "react-router-dom";
import { PageHead, groupOf } from "../ui";
import PaperAuthors from "../../components/PaperAuthors";
import { journalImpactFactors, publicationsData } from "../../data/papersData";

// 탭을 보여줄 첫 연도. 논문이 없는 연도도 탭으로 보여준다
const START_YEAR = 2025;

function Papers() {
  const currentYear = new Date().getFullYear();
  const dataYears = publicationsData.map((p) => Number(p.year));
  const lastYear = Math.max(currentYear, ...dataYears);
  const firstYear = Math.min(START_YEAR, ...dataYears);
  const years: string[] = [];
  for (let y = lastYear; y >= firstYear; y--) years.push(String(y));
  const [year, setYear] = useState(years.find((y) => publicationsData.some((p) => p.year === y)) ?? years[0]);
  const list = publicationsData.filter((p) => p.year === year);

  return (
    <>
      <PageHead label="Research" title="Published Papers" ko="연구실 구성원이 쓴 논문 · 밑줄은 연구실 구성원" group={groupOf("Research")} />
      <section className="wrap band-s">
        <div className="seg" role="tablist" aria-label="연도">
          {years.map((y) => (
            <button key={y} type="button" role="tab" aria-selected={y === year} onClick={() => setYear(y)}>
              {y} · {publicationsData.filter((p) => p.year === y).length}
            </button>
          ))}
        </div>
        <div key={year} className="plist fade">
          {list.length === 0 && <p className="empty">Coming soon.</p>}
          {list.map((p) => (
            <Link key={p.id} className="prow" to={`/project/PublishedPapers/${p.id}`}>
              <div className="thumb">{p.firstPage && <img src={p.firstPage} alt="" loading="lazy" />}</div>
              <div>
                <b>{p.title}</b>
                {p.authors && (
                  <p className="au">
                    <PaperAuthors authors={p.authors} />
                  </p>
                )}
                <div className="jn">
                  <span className="chip">{p.journal}</span>
                  <span className="chip">{p.year}</span>
                  {journalImpactFactors[p.journal] && <span className="chip s">IF {journalImpactFactors[p.journal]}</span>}
                </div>
              </div>
              <i aria-hidden="true">→</i>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

export default Papers;
