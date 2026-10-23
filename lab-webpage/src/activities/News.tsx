import NewsBox from "../components/NewsBox";
import { newsData } from "../data/newsData";

function News() {
  // 데이터를 연도별로 그룹화
  const years = Array.from(new Set(newsData.map((news) => news.date.split(".")[0]))).sort(
    (a, b) => Number(b) - Number(a)
  );

  return (
    <div>
      <div className="mx-[10%] mt-12">
        <div className="flex justify-center items-center flex-col">
          <div>
            <div className="sr-only">
              <span className="font-bold">NEWS</span>
            </div>
          </div>
          <div className="w-full">
            {years.map((year) => {
              const yearNews = newsData.filter((news) => news.date.startsWith(year));
              return (
                <div key={year} className="w-full mb-32">
                  <div className="text-center text-[60px] mb-10 text-title border-b-2 border-b-title">
                    <div className="mb-4 font-bold">{year}</div>
                  </div>
                  <div className="space-y-4">
                    {yearNews.map((info, index) => (
                      <NewsBox key={`${year}-${index}`} info={info} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default News;
