import { useState } from "react";
import { Link } from "react-router-dom";
import PaperAuthors from "../components/PaperAuthors";
import {
  journalImpactFactors,
  publicationsData,
} from "../data/papersData";

// 탭을 보여줄 첫 연도. 논문이 없는 연도도 탭으로 보여줌
const START_YEAR = 2025;

function PublishedPapers() {
  const currentYear = new Date().getFullYear();
  const dataYears = publicationsData.map((paper) => Number(paper.year));
  const lastYear = Math.max(currentYear, ...dataYears);
  const firstYear = Math.min(START_YEAR, ...dataYears);

  // 최신 연도가 왼쪽
  const years: string[] = [];
  for (let y = lastYear; y >= firstYear; y--) {
    years.push(String(y));
  }

  // 기본 선택은 논문이 있는 가장 최신 연도
  const [activeYear, setActiveYear] = useState(
    years.find((y) => publicationsData.some((p) => p.year === y)) ?? years[0]
  );
  const activePapers = publicationsData.filter(
    (paper) => paper.year === activeYear
  );

  return (
    <div>
      <div className="mx-[10%] mt-12">
        <div className="flex justify-center items-center flex-col">
          <div className="mb-20">
            <div className="text-center text-[60px] lg:mb-28 mb-16 text-title animate-[gotoDown_0.7s_ease-in-out_both]">
              <span className="font-bold">PUBLISHED PAPERS</span>
            </div>
          </div>
          <div
            role="tablist"
            className="flex flex-wrap justify-center gap-6 min-[500px]:gap-12 mb-12"
          >
            {years.map((year) => {
              const isActive = year === activeYear;
              return (
                <button
                  key={year}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveYear(year)}
                  className={`pb-2 text-base min-[500px]:text-xl border-b-2 transition-colors duration-200 ${
                    isActive
                      ? "text-title font-bold border-title"
                      : "text-my_name border-transparent hover:text-title"
                  }`}
                >
                  {year}
                </button>
              );
            })}
          </div>
          <div key={activeYear} className="w-full animate-fade-in">
            {activePapers.length > 0 ? (
              <div className="space-y-4">
                {activePapers.map((paper) => (
                  <Link
                    key={paper.id}
                    to={`/project/PublishedPapers/${paper.id}`}
                    className="group flex flex-row items-start mb-6"
                  >
                    <div className="w-1.5 h-1.5 bg-title mt-2 mr-4 shrink-0"></div>
                    <div className="text-base leading-relaxed">
                      <div className="font-bold group-hover:text-title group-hover:underline">
                        {paper.title}
                      </div>
                      {paper.authors && paper.authors.length > 0 && (
                        <div>
                          <PaperAuthors authors={paper.authors} />
                        </div>
                      )}
                      <div className="italic text-my_name">
                        {paper.journal}, {paper.year}
                        {journalImpactFactors[paper.journal] &&
                          ` · IF ${journalImpactFactors[paper.journal]}`}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center text-my_name">Coming soon.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PublishedPapers;
