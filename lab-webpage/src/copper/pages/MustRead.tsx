import { Link } from "react-router-dom";
import { PageHead, groupOf } from "../ui";
import PaperAuthors from "../../components/PaperAuthors";
import { JournalChips, papersByIF } from "../sections";

// 연구실 논문 가운데 IF가 높은 4편을 자동으로 고른다 (src/data/papersData.ts 의 IF 표 기준)
function MustRead() {
  const top = papersByIF().slice(0, 4);
  return (
    <>
      <PageHead
        label="Research"
        title="Must Read Papers"
        ko="연구실 논문 중 Impact Factor가 높은 4편 · 들어오면 먼저 읽습니다"
        group={groupOf("Research")}
      />
      <section className="wrap band-s">
        <div className="grid2">
          {top.map((p) => (
            <Link key={p.id} to={`/project/PublishedPapers/${p.id}`} className="tile paper-tile">
              <div className="pic" style={{ background: "#fff", aspectRatio: "16 / 10" }}>
                {p.firstPage && (
                  <img src={p.firstPage} alt={`${p.title} 첫 페이지`} loading="lazy" style={{ objectFit: "cover", objectPosition: "top" }} />
                )}
              </div>
              <div className="txt">
                <div className="tagrow" style={{ marginTop: 0, paddingTop: 0 }}>
                  <JournalChips journal={p.journal} />
                  <span className="chip">{p.year}</span>
                </div>
                <h3>{p.title}</h3>
                {p.authors && (
                  <p className="au">
                    <PaperAuthors authors={p.authors} />
                  </p>
                )}
                {p.keywords && (
                  <div className="tagrow">
                    {p.keywords.map((k) => (
                      <span key={k} className="chip">
                        {k}
                      </span>
                    ))}
                  </div>
                )}
                <span className="go">
                  논문 보기 <i>→</i>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

export default MustRead;
