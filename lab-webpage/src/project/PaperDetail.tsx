import { Link, useParams } from "react-router-dom";
import PaperAuthors from "../components/PaperAuthors";
import {
  journalImpactFactors,
  publicationsData,
} from "../data/papersData";

function PaperDetail() {
  const { paperId } = useParams();
  const paper = publicationsData.find((p) => p.id === paperId);

  const backLink = (
    <Link
      to="/project/PublishedPapers"
      className="inline-flex items-center text-my_name hover:text-title transition-colors mb-10"
    >
      ← Published Papers
    </Link>
  );

  if (!paper) {
    return (
      <div className="mx-[10%] mt-12 mb-32">
        {backLink}
        <div className="py-20 text-center text-my_name">
          논문을 찾을 수 없습니다.
        </div>
      </div>
    );
  }

  const hasContent = paper.figure || paper.abstract || paper.firstPage;

  return (
    <div className="mx-[10%] lg:mx-[15%] mt-12 mb-32 animate-fade-in">
      {backLink}

      {/* 논문 정보 */}
      <div className="pb-8 mb-12 border-b-2 border-b-title">
        <h1 className="text-title font-bold text-2xl lg:text-3xl leading-snug mb-4">
          {paper.title}
        </h1>
        {paper.authors && paper.authors.length > 0 && (
          <div className="mb-2">
            <PaperAuthors authors={paper.authors} />
          </div>
        )}
        <div className="italic text-my_name">
          {paper.journal}, {paper.year}
          {journalImpactFactors[paper.journal] &&
            ` · IF ${journalImpactFactors[paper.journal]}`}
        </div>
        {paper.link && (
          <a
            href={paper.link}
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-6 px-5 py-2 rounded-md bg-title text-white hover:opacity-90 transition-opacity"
          >
            View Paper ↗
          </a>
        )}
      </div>

      {/* Graphical abstract / 대표 figure */}
      {paper.figure && (
        <section className="mb-14">
          <h2 className="text-title font-bold text-xl mb-6">
            Graphical Abstract
          </h2>
          <figure>
            <img
              src={paper.figure}
              alt={paper.figureCaption ?? paper.title}
              className="w-full max-h-[600px] object-contain rounded-md border border-border"
            />
            {paper.figureCaption && (
              <figcaption className="mt-3 text-sm text-my_name text-center">
                {paper.figureCaption}
              </figcaption>
            )}
          </figure>
        </section>
      )}

      {/* 초록 */}
      {paper.abstract && (
        <section className="mb-14">
          <h2 className="text-title font-bold text-xl mb-6">Abstract</h2>
          <div className="space-y-4 leading-relaxed text-justify">
            {paper.abstract.split(/\n\s*\n/).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </section>
      )}

      {/* 논문 첫 페이지. 클릭하면 원본 크기로 열림 */}
      {paper.firstPage && (
        <section>
          <h2 className="text-title font-bold text-xl mb-6">First Page</h2>
          <a href={paper.firstPage} target="_blank" rel="noreferrer">
            <img
              src={paper.firstPage}
              alt={`${paper.title} first page`}
              loading="lazy"
              className="w-full max-w-[800px] mx-auto rounded-md border border-border shadow-sm hover:shadow-md transition-shadow"
            />
          </a>
        </section>
      )}

      {!hasContent && (
        <div className="py-20 text-center text-my_name">Coming soon.</div>
      )}
    </div>
  );
}

export default PaperDetail;
