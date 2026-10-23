import { Link, useParams } from "react-router-dom";
import { Label } from "../ui";
import PaperAuthors from "../../components/PaperAuthors";
import { publicationsData } from "../../data/papersData";
import { JournalChips } from "../sections";

function PaperDetail() {
  const { paperId } = useParams();
  const paper = publicationsData.find((p) => p.id === paperId);
  return (
    <section className="wrap" style={{ paddingTop: "clamp(110px, 12vw, 150px)" }}>
      <Link className="back" to="/project/PublishedPapers">
        ← Published Papers
      </Link>
      {!paper ? (
        <p className="empty">논문을 찾을 수 없습니다.</p>
      ) : (
        <article className="doc">
          <div style={{ marginTop: 28 }}>
            <Label>
              {paper.journal} · {paper.year}
            </Label>
          </div>
          <h1>{paper.title}</h1>
          {paper.authors && (
            <p className="au">
              <PaperAuthors authors={paper.authors} />
            </p>
          )}
          <div className="tagrow" style={{ marginTop: 16 }}>
            <JournalChips journal={paper.journal} only />
            {paper.keywords?.map((k) => (
              <span key={k} className="chip">
                {k}
              </span>
            ))}
          </div>
          {paper.link && (
            <div className="btns">
              <a className="btn" href={paper.link} target="_blank" rel="noreferrer">
                원문 보기 <i>↗</i>
              </a>
            </div>
          )}
          {paper.figure && (
            <section>
              <h2 className="sub">Graphical abstract</h2>
              <figure>
                <img src={paper.figure} alt={paper.figureCaption ?? paper.title} />
                {paper.figureCaption && <figcaption>{paper.figureCaption}</figcaption>}
              </figure>
            </section>
          )}
          {paper.abstract && (
            <section className="abs">
              <h2 className="sub">Abstract</h2>
              {paper.abstract.split(/\n\s*\n/).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </section>
          )}
          {paper.firstPage && (
            <section>
              <h2 className="sub">First page</h2>
              <a className="firstpage" href={paper.firstPage} target="_blank" rel="noreferrer">
                <img src={paper.firstPage} alt={`${paper.title} 첫 페이지`} loading="lazy" />
              </a>
            </section>
          )}
        </article>
      )}
    </section>
  );
}

export default PaperDetail;
