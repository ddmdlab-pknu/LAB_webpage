import { useLocation } from "react-router-dom";
import GrainField from "../GrainField";

// 하위 페이지 상단 제목 띠. 주소에 따라 메뉴 이름과 제목을 정한다.
const pages: Record<string, { section: string; title: string; ko: string }> = {
  "/about/Overview": { section: "About", title: "Overview", ko: "연구실 소개" },
  "/about/Pi": { section: "About", title: "Leader", ko: "지도교수" },
  "/about/Members": { section: "About", title: "Members", ko: "구성원" },
  "/about/Location": { section: "About", title: "Location", ko: "오시는 길" },
  "/project/ResearchAreas": { section: "Research", title: "Research Areas", ko: "연구 분야" },
  "/project/Project": { section: "Research", title: "Projects", ko: "연구 과제" },
  "/project/PublishedPapers": { section: "Research", title: "Published Papers", ko: "게재 논문" },
  "/project/MustReadPapers": { section: "Research", title: "Must Read Papers", ko: "필독 논문" },
  "/facilities/Facilities": { section: "Facilities", title: "Facilities", ko: "연구 장비" },
  "/activities/News": { section: "Activities", title: "News", ko: "소식" },
  "/activities/Gallery": { section: "Activities", title: "Gallery", ko: "갤러리" },
  "/activities/LabGame": { section: "Activities", title: "Lab Game", ko: "실험 체험" },
  "/join_us/Join_us": { section: "Join us", title: "Join Us", ko: "함께할 연구원 모집" },
};

function PageHero() {
  const { pathname } = useLocation();
  if (pathname === "/") return null;
  const key = pathname.startsWith("/project/PublishedPapers/")
    ? "/project/PublishedPapers"
    : pathname;
  const page = pages[key];
  if (!page) return null;

  return (
    <div className="relative overflow-hidden bg-white border-b border-border">
      <GrainField mode="pastel" className="absolute inset-0 opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/20" />
      <div className="relative max-w-[1180px] mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="flex items-center gap-3 font-mono text-xs tracking-[0.12em] uppercase text-steel">
          <span className="inline-flex h-1.5 w-12 rounded-sm overflow-hidden">
            <i className="flex-1 bg-ipfr" />
            <i className="flex-1 bg-ipfg" />
            <i className="flex-1 bg-ipfb" />
          </span>
          {page.section}
        </div>
        <h1 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-ink">
          {page.title}
        </h1>
        <p className="mt-2 text-base md:text-lg text-my_name">{page.ko}</p>
      </div>
    </div>
  );
}

export default PageHero;
