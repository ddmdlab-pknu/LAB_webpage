import { newsData } from "../data/newsData";
import { publicationsData as papers } from "../data/papersData";
import { masters, undergraduates } from "../data/membersData";
import { projects } from "../project/projectData";
import GrainField from "../components/GrainField";
import PaperAuthors from "../components/PaperAuthors";

// 뉴스 분류별 색 (결정 방위 3원색 + 강판 남색)
const categoryStyle: Record<string, { label: string; cls: string }> = {
  Award: { label: "수상", cls: "bg-ipfr" },
  Publication: { label: "논문", cls: "bg-ipfb" },
  Conference: { label: "학회", cls: "bg-ipfg" },
  Event: { label: "행사", cls: "bg-steel" },
  News: { label: "소식", cls: "bg-slate-500" },
};

const journals = [
  "Materials Today Communications",
  "Journal of Magnetics",
  "Korean Journal of Metals and Materials",
  "Journal of the Korean Magnetics Society",
  "Journal of the Korean Society for Heat Treatment",
  "Scripta Materialia",
  "Materials Characterization",
  "Journal of Materials Research and Technology",
];

function MainPage() {
  // 최신 소식 4개
  const latestNews = [...newsData]
    .sort(
      (a, b) =>
        new Date(b.date.replace(/\./g, "-")).getTime() -
        new Date(a.date.replace(/\./g, "-")).getTime(),
    )
    .slice(0, 4);

  const recentPapers = papers.slice(0, 4);
  const team = [...masters, ...undergraduates];
  const paperYears = Array.from(new Set(papers.map((p) => p.year))).sort();

  const researchHighlights = [
    {
      title: "모빌리티용 철강 소재",
      desc: "전기차·드론 모터용 자성 소재 성능 향상",
      img: "/images/research_area_1.jpg",
      tag: "MOBILITY",
      link: "/project/ResearchAreas",
    },
    {
      title: "센서용 자왜 소재",
      desc: "항공기·선박 센서용 고성능 합금 연구",
      img: "/images/research_area_2.png",
      tag: "SENSOR",
      link: "/project/ResearchAreas",
    },
    {
      title: "재료 AI 최적 설계",
      desc: "AI 기반 공정 및 성분 조건 최적화",
      img: "/images/research_area_3.png",
      tag: "MATERIALS AI",
      link: "/project/ResearchAreas",
    },
    {
      title: "집합조직 및 자성 분석",
      desc: "금속 확산과 자기적 특성 상관관계 규명",
      img: "/images/research_area_4.png",
      tag: "TEXTURE",
      link: "/project/ResearchAreas",
    },
  ];

  return (
    <div className="text-ink overflow-x-hidden">
      {/* 1. 첫 화면: 결정립 성장 배경 + 시뮬레이션 카드 */}
      <section className="relative overflow-hidden bg-white">
        <GrainField mode="pastel" className="absolute inset-0 opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/15" />
        <div className="relative max-w-[1180px] mx-auto px-4 md:px-8 py-14 md:py-20 grid gap-12 lg:grid-cols-[1.05fr_1fr] items-center">
          <div className="min-w-0">
            <div className="flex items-center gap-3 font-mono text-xs tracking-[0.12em] uppercase text-steel">
              <span className="inline-flex h-1.5 w-14 rounded-sm overflow-hidden">
                <i className="flex-1 bg-ipfr" />
                <i className="flex-1 bg-ipfg" />
                <i className="flex-1 bg-ipfb" />
              </span>
              Innovating Materials with Data
            </div>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
              Data Driven <br className="hidden sm:block" />
              <span className="ipf-text">Material Design</span> Lab
            </h1>
            <p className="mt-5 text-xl md:text-2xl font-semibold text-steel leading-snug">
              결정립 하나까지 계산하고, AI로 설계하는 전기강판
            </p>
            <p className="mt-4 text-base md:text-lg leading-relaxed text-slate-600 max-w-xl">
              We combine advanced material science with AI and simulations to
              design the next generation of magnetic materials and
              high-performance steels.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/about/Overview"
                className="px-6 py-3 rounded-md bg-steel text-white font-semibold hover:opacity-90 transition"
              >
                Explore Lab
              </a>
              <a
                href="/project/ResearchAreas"
                className="px-6 py-3 rounded-md border border-steel text-steel font-semibold hover:bg-steel hover:text-white transition"
              >
                Our Research
              </a>
            </div>
            <dl className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
              <div className="border-l-2 border-border pl-3">
                <dt className="sr-only">게재 논문</dt>
                <dd className="font-mono text-2xl font-semibold tabular-nums">{papers.length}</dd>
                <dd className="text-xs text-my_name">
                  게재 논문 ({paperYears[0]}–{paperYears[paperYears.length - 1].slice(2)})
                </dd>
              </div>
              <div className="border-l-2 border-border pl-3">
                <dt className="sr-only">연구 과제</dt>
                <dd className="font-mono text-2xl font-semibold tabular-nums">{projects.length}</dd>
                <dd className="text-xs text-my_name">연구 과제</dd>
              </div>
              <div className="border-l-2 border-border pl-3">
                <dt className="sr-only">구성원</dt>
                <dd className="font-mono text-2xl font-semibold tabular-nums">{team.length + 1}</dd>
                <dd className="text-xs text-my_name">구성원</dd>
              </div>
            </dl>
          </div>
          <figure className="sim-card m-0 bg-white border border-border rounded-xl p-3 shadow-[0_24px_48px_-24px_rgba(20,32,43,0.4)]">
            <img
              src="/images/sim/3d_ipf.gif"
              alt="Fe-1Si 3차원 결정립 성장 시뮬레이션 (결정 방위 색)"
              className="w-full rounded-md"
            />
            <figcaption className="mt-2 flex flex-wrap justify-between gap-2 text-xs text-my_name">
              <span>Fe-1Si(γ) 1100 °C, 표면 Si 6.5 wt% → α 층 성장 + γ 결정립 성장</span>
              <code className="font-mono text-steel">t = 0 → 60 min</code>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* 2. 게재 학술지 흐르는 띠 */}
      <div className="bg-steel text-[#cfe0f2] py-3.5 marquee" aria-label="논문 게재 학술지">
        <div className="marquee-track font-mono text-[13px] tracking-wide">
          {[...journals, ...journals].map((j, i) => (
            <span key={i} className={i % 2 ? "" : "text-white"}>
              {j}
            </span>
          ))}
        </div>
      </div>

      {/* 3. 연구실 소개 */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-[1180px] mx-auto px-4 md:px-8 grid gap-12 lg:grid-cols-2 items-center">
          <div className="relative flex justify-center">
            <div className="absolute inset-6 rounded-2xl overflow-hidden opacity-30">
              <GrainField mode="pastel" />
            </div>
            <img
              src="/images/logo(2).png"
              alt="연구실 로고"
              className="relative w-full max-w-[300px] md:max-w-[380px] drop-shadow-2xl"
            />
          </div>
          <div className="min-w-0">
            <div className="font-mono text-xs tracking-[0.2em] uppercase text-steel">
              About Our Lab
            </div>
            <h2 className="mt-3 text-3xl lg:text-4xl font-bold leading-tight">
              Designing the Future of <br className="hidden md:block" />
              <span className="ipf-text">Advanced Mobility Materials</span>
            </h2>
            <p className="mt-5 text-slate-600 text-base lg:text-lg leading-relaxed">
              Our Lab focuses on improving the properties of magnetic materials,
              such as steel cores, which are essential in advanced mobility
              applications. We leverage vacuum/gas heat treatments, magnetic
              analysis, and rolling simulations to innovate material
              performance.
            </p>
            <div className="mt-8 grid sm:grid-cols-2 gap-6">
              <div className="border-l-4 border-ipfb pl-4">
                <h3 className="text-2xl font-bold text-steel">AI & Material</h3>
                <p className="text-sm text-my_name mt-1">
                  Data-driven optimization for complex process systems.
                </p>
              </div>
              <div className="border-l-4 border-ipfg pl-4">
                <h3 className="text-2xl font-bold text-steel">Simulation</h3>
                <p className="text-sm text-my_name mt-1">
                  Precision thermodynamic behavior prediction using Pandat.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. 연구 분야 */}
      <section className="py-16 md:py-24 bg-paper">
        <div className="max-w-[1180px] mx-auto px-4 md:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <div className="font-mono text-xs tracking-[0.2em] uppercase text-steel">
                Core Competencies
              </div>
              <h2 className="mt-2 text-3xl lg:text-4xl font-bold ipf-underline">
                Research Pillars
              </h2>
            </div>
            <a href="/project/ResearchAreas" className="text-ipfb font-semibold hover:translate-x-1 transition-transform">
              View All Areas →
            </a>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {researchHighlights.map((item) => (
              <a
                key={item.title}
                href={item.link}
                className="group bg-white border border-border rounded-lg overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_22px_40px_-22px_rgba(31,58,86,0.45)]"
              >
                <div className="h-44 p-4 bg-slate-50 flex items-center justify-center overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-5 flex flex-col gap-1.5">
                  <span className="font-mono text-[11px] tracking-wider text-steel">{item.tag}</span>
                  <h3 className="text-lg font-bold group-hover:text-ipfb transition-colors">{item.title}</h3>
                  <p className="text-sm text-my_name">{item.desc}</p>
                </div>
              </a>
            ))}
          </div>

          {/* 시뮬레이션 쇼케이스 */}
          <div className="mt-10 grid gap-5 lg:grid-cols-[1.35fr_1fr]">
            <figure className="m-0 bg-white border border-border rounded-lg overflow-hidden">
              <img src="/images/sim/3d_dual.gif" alt="Si 농도와 결정 방위를 나란히 보여주는 3차원 시뮬레이션" loading="lazy" className="w-full" />
              <figcaption className="px-4 py-3 text-sm text-my_name border-t border-border">
                3D 확산·결정립 성장 시뮬레이션 — 왼쪽 Si 농도(0 → 6 wt%), 오른쪽 결정 방위(IPF-ND)
              </figcaption>
            </figure>
            <figure className="m-0 bg-white border border-border rounded-lg overflow-hidden">
              <img src="/images/sim/2d_al.gif" alt="Fe-0.5Si 기판 Al 코팅 확산 단면 시뮬레이션" loading="lazy" className="w-full" />
              <figcaption className="px-4 py-3 text-sm text-my_name border-t border-border">
                Fe-0.5Si 200 μm + Al 20 μm 단면 코팅, 1100 °C — Al 확산과 α/γ 경계
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* 5. 최근 논문 + 최신 소식 */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-[1180px] mx-auto px-4 md:px-8 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
              <div>
                <div className="font-mono text-xs tracking-[0.2em] uppercase text-steel">Publications</div>
                <h2 className="mt-2 text-3xl font-bold ipf-underline">Recent Papers</h2>
              </div>
              <a href="/project/PublishedPapers" className="text-ipfb font-semibold">
                Published Papers →
              </a>
            </div>
            <ul className="divide-y divide-border border-t border-border">
              {recentPapers.map((p) => (
                <li key={p.id}>
                  <a
                    href={`/project/PublishedPapers/${p.id}`}
                    className="group grid grid-cols-[52px_1fr] gap-4 py-4"
                  >
                    <span className="font-mono text-sm text-my_name pt-0.5">{p.year}</span>
                    <span className="min-w-0">
                      <b className="block font-semibold leading-snug group-hover:text-ipfb transition-colors">
                        {p.title}
                      </b>
                      {p.authors && (
                        <span className="block text-sm text-slate-600 mt-1">
                          <PaperAuthors authors={p.authors} />
                        </span>
                      )}
                      <span className="block text-sm italic text-my_name">{p.journal}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
              <div>
                <div className="font-mono text-xs tracking-[0.2em] uppercase text-steel">Updates</div>
                <h2 className="mt-2 text-3xl font-bold ipf-underline">Latest News</h2>
              </div>
              <a href="/activities/News" className="text-ipfb font-semibold">
                All News →
              </a>
            </div>
            <div className="flex flex-col gap-3">
              {latestNews.map((news) => {
                const c = categoryStyle[news.category ?? "News"] ?? categoryStyle.News;
                return (
                  <article
                    key={news.date + news.comments.slice(0, 12)}
                    className="bg-paper/60 border border-border rounded-lg px-4 py-3.5 flex flex-col gap-1.5"
                  >
                    <div className="flex items-center gap-2 font-mono text-xs text-my_name">
                      <span className={`${c.cls} text-white font-sans font-semibold text-[10.5px] px-1.5 py-0.5 rounded`}>
                        {c.label}
                      </span>
                      {news.date}
                    </div>
                    <p className="text-sm leading-relaxed line-clamp-3">{news.comments}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 6. 구성원 */}
      <section className="py-16 md:py-20 bg-paper">
        <div className="max-w-[1180px] mx-auto px-4 md:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <div className="font-mono text-xs tracking-[0.2em] uppercase text-steel">People</div>
              <h2 className="mt-2 text-3xl font-bold ipf-underline">Members</h2>
            </div>
            <a href="/about/Members" className="text-ipfb font-semibold">
              Members →
            </a>
          </div>
          <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
            <a href="/about/Pi" className="group">
              <img src="/images/prof-profile.png" alt="박세민 교수" className="w-full aspect-[3/4] object-cover rounded-md bg-white transition-transform group-hover:-translate-y-1" />
              <b className="block mt-2 text-sm">Semin Park (박세민)</b>
              <span className="text-xs text-my_name">Professor</span>
            </a>
            {team.map((m) => (
              <a key={m.name} href="/about/Members" className="group">
                <img src={m.profileImg} alt={m.name} loading="lazy" className="w-full aspect-[3/4] object-cover rounded-md bg-white transition-transform group-hover:-translate-y-1" />
                <b className="block mt-2 text-sm">{m.name}</b>
                <span className="text-xs text-my_name">{m.edu}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 7. 모집 */}
      <section className="relative overflow-hidden bg-steel">
        <GrainField mode="vivid" className="absolute inset-0 opacity-20" />
        <div className="relative max-w-[1180px] mx-auto px-4 md:px-8 py-16 md:py-24 text-center">
          <div className="font-mono text-xs tracking-[0.3em] uppercase text-white/80">Join Us</div>
          <h2 className="mt-4 text-white text-2xl md:text-4xl lg:text-5xl font-bold leading-tight">
            데이터와 AI로 차세대 철강 소재의 연구를
            <br className="hidden md:block" /> 함께 만들어갈 분을 찾습니다
          </h2>
          <p className="mt-6 text-white/75 max-w-2xl mx-auto text-base md:text-lg">
            신소재공학 지식에 AI 기술을 접목하고, 자유로운 분위기 속에서
            주도적으로 연구 성과를 만들어가고 싶은 분을 기다립니다.
          </p>
          <a
            href="/join_us/Join_us"
            className="inline-block mt-10 bg-white text-steel px-9 py-3.5 rounded-full font-bold hover:bg-blue-50 transition shadow-xl"
          >
            지원 안내 보기
          </a>
        </div>
      </section>
    </div>
  );
}

export default MainPage;
