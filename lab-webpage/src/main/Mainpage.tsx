import React from "react";
import { Card, CardContent } from "../components/Card";
import { newsData } from "../data/newsData";

function MainPage() {
  // 최신 데이터 3개 추출
  const latestNews = [...newsData]
    .sort(
      (a, b) =>
        new Date(b.date.replace(/\./g, "-")).getTime() -
        new Date(a.date.replace(/\./g, "-")).getTime(),
    )
    .slice(0, 3);

  const researchHighlights = [
    {
      title: "모빌리티용 철강 소재",
      desc: "전기차·드론 모터용 자성 소재 성능 향상",
      img: "/images/research_area_1.jpg",
      link: "/project/ResearchAreas",
    },
    {
      title: "센서용 자왜 소재",
      desc: "항공기·선박 센서용 고성능 합금 연구",
      img: "/images/research_area_2.webp",
      link: "/project/ResearchAreas",
    },
    {
      title: "재료 AI 최적 설계",
      desc: "AI 기반 공정 및 성분 조건 최적화",
      img: "/images/research_area_3.webp",
      link: "/project/ResearchAreas",
    },
    {
      title: "집합조직 및 자성 분석",
      desc: "금속 확산과 자기적 특성 상관관계 규명",
      img: "/images/research_area_4.webp",
      link: "/project/ResearchAreas",
    },
  ];

  return (
    <div className="font-sans text-slate-900 overflow-x-hidden">
      {/* 1. Hero Section */}
      <section className="relative w-full h-[80vh] md:h-screen overflow-hidden">
        <div className="absolute inset-0 w-full h-full bg-first-bg bg-cover bg-fixed bg-center scale-105 animate-[appear_1.5s_ease-out]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#00305b]/95 via-[#00305b]/60 lg:via-[#00305b]/40 to-transparent flex items-center">
          <div className="w-full px-6 md:px-[10%] space-y-4 md:space-y-6">
            <div className="animate-[gotoRight_0.8s_ease-out_both]">
              <h2 className="text-white/80 text-sm md:text-xl lg:text-2xl font-medium tracking-[0.2em] md:tracking-widest uppercase mb-2 md:mb-4">
                Innovating Materials with Data
              </h2>
              <h1 className="text-white text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
                Data Driven <br className="hidden sm:block" />
                <span className="text-blue-400">Material Design</span> Lab
              </h1>
              <p className="text-white/70 max-w-xl text-sm md:text-base lg:text-lg mt-4 md:mt-8 leading-relaxed">
                We combine advanced material science with AI and simulations to
                design the next generation of magnetic materials and
                high-performance steels.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-8 md:mt-10">
                <a
                  href="/about/Overview"
                  className="bg-white text-[#00305b] px-6 md:px-8 py-3 rounded-full font-bold hover:bg-blue-50 transition-colors shadow-lg text-center text-sm md:text-base"
                >
                  Explore Lab
                </a>
                <a
                  href="/project/ResearchAreas"
                  className="border-2 border-white text-white px-6 md:px-8 py-3 rounded-full font-bold hover:bg-white/10 transition-all text-center text-sm md:text-base"
                >
                  Our Research
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      {/* 2. Who We Are Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6 md:px-[10%]">
          <div className="flex flex-col lg:flex-row items-center gap-10 md:gap-16">
            <div className="w-full lg:w-1/2 relative">
              <div className="absolute -top-4 -left-4 w-16 h-16 md:w-24 md:h-24 bg-blue-100 rounded-full -z-10"></div>
              <img
                src="/images/logo(2).webp"
                alt="Lab Logo"
                className="w-full max-w-[280px] md:max-w-md mx-auto drop-shadow-2xl"
              />
              <div className="absolute -bottom-4 -right-4 w-20 h-20 md:w-32 md:h-32 bg-slate-100 rounded-full -z-10"></div>
            </div>
            <div className="w-full lg:w-1/2 space-y-4 md:space-y-6">
              <h3 className="text-title text-xs md:text-sm font-bold tracking-[0.3em] uppercase">
                About Our Lab
              </h3>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
                Designing the Future of <br className="hidden md:block" />
                <span className="text-blue-600">
                  Advanced Mobility Materials
                </span>
              </h2>
              <p className="text-gray-600 text-sm md:text-base lg:text-lg leading-relaxed">
                Our Lab focuses on improving the properties of magnetic
                materials, such as steel cores, which are essential in advanced
                mobility applications. We leverage vacuum/gas heat treatments,
                magnetic analysis, and rolling simulations to innovate material
                performance.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 pt-4 md:pt-6">
                <div className="border-l-4 border-blue-600 pl-4">
                  <h4 className="text-xl md:text-2xl lg:text-3xl font-bold text-title">
                    Ai & Material
                  </h4>
                  <p className="text-xs md:text-sm text-gray-500 mt-1 md:mt-2">
                    Data-driven optimization for complex process systems.
                  </p>
                </div>
                <div className="border-l-4 border-blue-400 pl-4">
                  <h4 className="text-xl md:text-2xl lg:text-3xl font-bold text-title">
                    Simulation
                  </h4>
                  <p className="text-xs md:text-sm text-gray-500 mt-1 md:mt-2">
                    Precision thermodynamic behavior prediction using Pandat.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Research Highlights Section */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="container mx-auto px-6 md:px-[10%]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 md:mb-16 gap-4">
            <div>
              <h3 className="text-title text-xs md:text-sm font-bold tracking-[0.3em] uppercase mb-2 md:mb-4">
                Core Competencies
              </h3>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">
                Research Pillars
              </h2>
            </div>
            <a
              href="/project/ResearchAreas"
              className="text-title text-sm md:text-base font-bold flex items-center hover:translate-x-2 transition-transform"
            >
              View All Areas <span className="ml-2">→</span>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {researchHighlights.map((item, idx) => (
              <a key={idx} href={item.link} className="group">
                <Card className="h-full border-none shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
                  <div className="h-40 p-4 overflow-hidden bg-slate-50 flex items-center justify-center">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <CardContent className="p-5 md:p-6">
                    <h4 className="text-lg md:text-xl font-bold mb-1 md:mb-2 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-gray-500 text-xs md:text-sm">
                      {item.desc}
                    </p>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Latest News Section */}
      <section className="py-16 md:py-24 bg-white border-t border-slate-100">
        <div className="container mx-auto px-6 md:px-[10%]">
          <div className="flex flex-col lg:flex-row gap-12 md:gap-16">
            <div className="w-full lg:w-1/3">
              <h3 className="text-title text-xs md:text-sm font-bold tracking-[0.3em] uppercase mb-2 md:mb-4">
                Updates
              </h3>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-8">
                Latest News
              </h2>
              <p className="text-gray-500 text-sm md:text-base mb-6 md:mb-8">
                Stay updated with our latest research achievements, awards, and
                laboratory activities.
              </p>
              <a
                href="/activities/News"
                className="inline-block px-6 md:px-8 py-3 bg-title text-white rounded-full font-bold hover:bg-opacity-90 transition-all shadow-md text-sm md:text-base"
              >
                All News
              </a>
            </div>
            <div className="w-full lg:w-2/3 space-y-4 md:space-y-6">
              {latestNews.map((news, idx) => (
                <div
                  key={idx}
                  className="group p-4 md:p-6 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 flex items-start gap-4 md:gap-6"
                >
                  <div className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 bg-blue-50 rounded-xl flex flex-col items-center justify-center text-title group-hover:bg-title group-hover:text-white transition-colors">
                    <span className="text-[10px] md:text-xs font-bold">
                      {news.date.split(".")[1]}월
                    </span>
                    <span className="text-lg md:text-xl font-bold">
                      {news.date.split(".")[2]}
                    </span>
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] md:text-xs font-bold text-blue-600 uppercase tracking-wider">
                      {news.category}
                    </span>
                    <h4 className="text-sm md:text-base lg:text-lg font-bold mt-1 group-hover:text-title transition-colors line-clamp-2 leading-snug">
                      {news.comments}
                    </h4>
                    <span className="text-gray-400 text-[10px] md:text-sm mt-1 md:mt-2 block">
                      {news.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Join Us Section */}
      <section className="relative py-16 md:py-24 bg-second-bg bg-cover bg-fixed bg-center">
        <div className="absolute inset-0 bg-[#00305b]/85 md:bg-[#00305b]/80"></div>
        <div className="relative container mx-auto px-6 md:px-[10%] text-center">
          <h3 className="text-white text-xs md:text-sm font-bold tracking-[0.3em] uppercase mb-3 md:mb-4">
            Join Us
          </h3>
          <h2 className="text-white text-xl md:text-3xl lg:text-5xl font-bold mb-6 md:mb-8 leading-tight">
            데이터와 AI로 차세대 철강 소재의 연구를
            <br className="hidden md:block" /> 함께 만들어갈 분을 찾습니다
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-8 md:mb-12 text-sm md:text-lg px-4 md:px-0">
            신소재공학 지식에 AI 기술을 접목하고, 자유로운 분위기 속에서
            주도적으로 연구 성과를 만들어가고 싶은 분을 기다립니다.
          </p>
          <div className="flex justify-center">
            <a
              href="/join_us/Join_us"
              className="bg-white text-title px-8 md:px-10 py-3 md:py-4 rounded-full font-bold hover:bg-blue-50 transition-all shadow-xl text-sm md:text-base"
            >
              지원 안내 보기
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default MainPage;
