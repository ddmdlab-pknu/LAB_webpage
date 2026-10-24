// 새 디자인(copper) 전체 틀. src/siteDesign.ts 에서 "copper"를 고르면 이 화면이 나온다.
import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "./copper.css";
import Nav from "./Nav";
import Footer from "./Footer";
import Home from "./Home";
import Overview from "./pages/Overview";
import Leader from "./pages/Leader";
import Members from "./pages/Members";
import Location from "./pages/Location";
import ResearchAreas from "./pages/ResearchAreas";
import Projects from "./pages/Projects";
import Papers from "./pages/Papers";
import PaperDetail from "./pages/PaperDetail";
import MustRead from "./pages/MustRead";
import Facilities from "./pages/Facilities";
import News from "./pages/News";
import Gallery from "./pages/Gallery";
import LabGame from "./pages/LabGame";
import JoinUs from "./pages/JoinUs";

// 글꼴: Pretendard 한 가지 (한글·라틴 모두, SIL OFL). public/fonts/pretendard 에 두고 쓰는 글자 묶음만 내려받는다
const FONT_URL = "/fonts/pretendard/pretendardvariable-dynamic-subset.css";

function useCopperDocument() {
  useEffect(() => {
    if (!document.querySelector(`link[href="${FONT_URL}"]`)) {
      const l = document.createElement("link");
      l.rel = "stylesheet";
      l.href = FONT_URL;
      document.head.appendChild(l);
    }
    const body = document.body.style;
    const html = document.documentElement.style;
    const prev = [body.background, html.colorScheme, html.scrollBehavior];
    body.background = "#f8f8f8";
    html.colorScheme = "light";
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) html.scrollBehavior = "smooth";
    const meta = document.querySelector('meta[name="theme-color"]');
    meta?.setAttribute("content", "#f8f8f8");
    return () => {
      body.background = prev[0];
      html.colorScheme = prev[1];
      html.scrollBehavior = prev[2];
    };
  }, []);
}

// 구역이 화면에 들어오면 제목 → 글 → 그림 순서로 한 번씩 떠오른다.
// 숨김 상태는 CSS 의 prefers-reduced-motion: no-preference 안에만 있어서, 움직임 줄이기 설정이면 처음부터 다 보인다.
const PARTS =
  "h2:not(.sr), h3.h3, .body, .statement, .chart, .plate, .tabs, .kit, .rm-stage, .rm-list, .cells, .ix-list, .ix-frame, .acc, .pi-left, .pi-right, .career > *, .ptile, .st-head, .photos, .team-copy, .roster, .nl-item, .tile, .prow, .mcard, .gitem, .proj, .nrow, .joinbox, .map, .info";
function useReveal() {
  const { pathname } = useLocation();
  useEffect(() => {
    const root = document.querySelector(".cu main");
    // 휴대폰과 태블릿에서는 등장 움직임 없이 바로 보여 준다 (좁은 화면에서 읽기가 먼저)
    if (!root || !("IntersectionObserver" in window) || window.matchMedia("(max-width: 900px)").matches) return;
    const timers: number[] = [];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const sec = e.target as HTMLElement;
          sec.classList.add("in");
          io.unobserve(sec);
          // 등장이 끝나면 표시를 지워 이후의 마우스 반응이 원래 속도로 돌아오게 한다
          timers.push(
            window.setTimeout(() => sec.querySelectorAll("[data-part]").forEach((el) => el.removeAttribute("data-part")), 1800)
          );
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.01 }
    );
    const prep = () =>
      root.querySelectorAll<HTMLElement>("section:not([data-rv])").forEach((sec) => {
        sec.setAttribute("data-rv", "");
        let i = 0;
        sec.querySelectorAll<HTMLElement>(PARTS).forEach((el) => {
          if (el.parentElement?.closest("[data-part]")) return;
          el.setAttribute("data-part", "");
          el.style.setProperty("--i", String(Math.min(i++, 5)));
        });
        io.observe(sec);
      });
    prep();
    const mo = new MutationObserver(prep);
    mo.observe(root, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
      timers.forEach((t) => clearTimeout(t));
    };
  }, [pathname]);
}

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView();
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname, hash]);
  return null;
}

function CopperApp() {
  useCopperDocument();
  useReveal();
  return (
    <div className="cu">
      <div className="safe-top" />
      <ScrollToTop />
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about/Overview" element={<Overview />} />
          <Route path="/about/Pi" element={<Leader />} />
          <Route path="/about/Members" element={<Members />} />
          <Route path="/about/Location" element={<Location />} />
          <Route path="/project/ResearchAreas" element={<ResearchAreas />} />
          <Route path="/project/Project" element={<Projects />} />
          <Route path="/project/PublishedPapers" element={<Papers />} />
          <Route path="/project/PublishedPapers/:paperId" element={<PaperDetail />} />
          <Route path="/project/MustReadPapers" element={<MustRead />} />
          <Route path="/facilities/Facilities" element={<Facilities />} />
          <Route path="/activities/News" element={<News />} />
          <Route path="/activities/Gallery" element={<Gallery />} />
          <Route path="/activities/LabGame" element={<LabGame />} />
          <Route path="/join_us/Join_us" element={<JoinUs />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default CopperApp;
