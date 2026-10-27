import { useState } from "react";
import { Link } from "react-router-dom";
import { PageHead, groupOf } from "../ui";
import PaperAuthors from "../../components/PaperAuthors";
import { publicationsData } from "../../data/papersData";
import { JournalChips, PaperCover } from "../sections";

function Papers() {
  // 논문이 있는 연도만 탭으로 보여준다 (최신 연도가 왼쪽)
  const years = Array.from(new Set(publicationsData.map((p) => p.year))).sort((a, b) => Number(b) - Number(a));
  const [year, setYear] = useState(years[0]);
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
              <div className="thumb">{p.firstPage ? <img src={p.firstPage} alt="" loading="lazy" /> : <PaperCover paper={p} compact />}</div>
              <div>
                <b>{p.title}</b>
                {p.authors && (
                  <p className="au">
                    <PaperAuthors authors={p.authors} />
                  </p>
                )}
                <div className="jn">
                  <JournalChips journal={p.journal} />
                  <span className="chip">{p.year}</span>
                  {p.status === "accepted" && <span className="chip">Accepted</span>}
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
