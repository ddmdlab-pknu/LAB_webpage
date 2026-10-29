import { useState } from "react";
import { Link } from "react-router-dom";
import { PageHead, groupOf } from "../ui";
import PaperAuthors from "../../components/PaperAuthors";
import { publicationsData } from "../../data/papersData";
import { JournalChips, PaperCover } from "../sections";

function Papers() {
  // 논문이 있는 연도만 탭으로 보여준다 (최신 연도가 왼쪽). 2022년 이전 논문은 "이전" 탭 하나로 모은다 (최근 연도 순)
  const tabOf = (y: string) => (Number(y) <= 2022 ? "이전" : y);
  const years = Array.from(new Set(publicationsData.map((p) => tabOf(p.year)))).sort((a, b) =>
    a === "이전" ? 1 : b === "이전" ? -1 : Number(b) - Number(a)
  );
  const [year, setYear] = useState(years[0]);
  const list = publicationsData
    .map((p, i) => ({ p, i }))
    .filter(({ p }) => tabOf(p.year) === year)
    .sort((a, b) => Number(b.p.year) - Number(a.p.year) || a.i - b.i)
    .map(({ p }) => p);

  return (
    <>
      <PageHead label="Research" title="Published Papers" ko="연구실 구성원이 쓴 논문 · 밑줄은 연구실 구성원" group={groupOf("Research")} />
      <section className="wrap band-s">
        <div className="seg" role="tablist" aria-label="연도">
          {years.map((y) => (
            <button key={y} type="button" role="tab" aria-selected={y === year} onClick={() => setYear(y)}>
              {y} · {publicationsData.filter((p) => tabOf(p.year) === y).length}
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
