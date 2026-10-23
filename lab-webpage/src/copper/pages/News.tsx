import { PageHead, groupOf, catChip } from "../ui";
import { newsData } from "../../data/newsData";

function News() {
  const years = Array.from(new Set(newsData.map((n) => n.date.split(".")[0]))).sort((a, b) => Number(b) - Number(a));
  return (
    <>
      <PageHead label="Activities" title="News" ko="수상, 학회 발표, 논문 게재, 행사 소식" group={groupOf("Activities")} />
      <section className="wrap" style={{ paddingTop: 8 }}>
        {years.map((y) => {
          const items = newsData.filter((n) => n.date.startsWith(y));
          return (
            <div key={y} className="year">
              <h2>
                {y}
                <small>{items.length}건</small>
              </h2>
              {items.map((n, i) => (
                <div key={`${y}-${i}`} className="nrow">
                  <time>{n.date.slice(5)}</time>
                  <p>
                    {n.comments}
                    {n.category && catChip(n.category)}
                  </p>
                  {n.img ? (
                    <div className="ni">
                      <img src={n.img} alt="" loading="lazy" />
                    </div>
                  ) : (
                    <span />
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </section>
    </>
  );
}

export default News;
