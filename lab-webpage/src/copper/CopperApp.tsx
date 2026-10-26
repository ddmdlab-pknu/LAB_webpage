// 새 디자인(copper) 전체 틀. src/siteDesign.ts 에서 "copper"를 고르면 이 화면이 나온다.
import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "./copper.css";
import "./lila.css";
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

// 구역이 화면에 들어오면 제목은 단어마다 아래에서 떠오르고(0.6초, 단어 사이 0.05초), 글·그림·카드는 천천히 나타난다.
// 숨김 상태는 CSS 의 prefers-reduced-motion: no-preference 안에만 있어서, 움직임 줄이기 설정이면 처음부터 다 보인다.
const HEADS = "h2.h, h2.h3, h3.h3, .phead h1";
const PARTS =
  ".body, .statement, .chart, .plate, .tabs, .kit, .rm-stage, .rm-list, .gs-fig, .cells, .ix-list, .ix-frame, .rc-track, .rc-nav, .acc, .pi-left, .pi-right, .career > *, .ptile, .st-head > a, .photos, .team-copy .btns, .roster, .ncard, .nl-item, .tile, .eq-card, .prow, .mcard, .gitem, .proj, .nrow, .joinbox, .map, .info, .phead p, .crumbs, .gs-copy .btns, .cap";

// 제목의 글자 마디를 단어마다 가리개(wm)와 단어(wd)로 감싼다. 줄바꿈(br)과 안쪽 요소는 그대로 둔다
function splitWords(h: HTMLElement) {
  if (h.hasAttribute("data-words") || h.querySelector(".wd")) return;
  h.setAttribute("data-words", "");
  let n = 0;
  const walk = (node: Node) => {
    Array.from(node.childNodes).forEach((ch) => {
      if (ch.nodeType === Node.TEXT_NODE) {
        const parts = (ch.textContent || "").split(/(\s+)/);
        if (!parts.some((p) => p.trim())) return;
        const frag = document.createDocumentFragment();
        parts.forEach((p) => {
          if (!p) return;
          if (!p.trim()) {
            frag.appendChild(document.createTextNode(p));
            return;
          }
          const m = document.createElement("span");
          m.className = "wm";
          const w = document.createElement("span");
          w.className = "wd";
          w.style.setProperty("--w", String(Math.min(n++, 14)));
          w.textContent = p;
          m.appendChild(w);
          frag.appendChild(m);
        });
        node.replaceChild(frag, ch);
      } else if (ch.nodeType === Node.ELEMENT_NODE && !(ch as Element).matches("br, img, svg, canvas, .sr")) {
        walk(ch);
      }
    });
  };
  walk(h);
}

function useReveal() {
  const { pathname } = useLocation();
  useEffect(() => {
    const root = document.querySelector(".cu main");
    // 휴대폰·태블릿도 같은 등장 움직임 (좁은 화면은 lila.css 에서 조금 짧게)
    if (!root || !("IntersectionObserver" in window)) return;
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
            window.setTimeout(() => sec.querySelectorAll("[data-part]").forEach((el) => el.removeAttribute("data-part")), 3000)
          );
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.01 }
    );
    const prep = () =>
      root.querySelectorAll<HTMLElement>("section:not([data-rv]), header.phead:not([data-rv])").forEach((sec) => {
        sec.setAttribute("data-rv", "");
        sec.querySelectorAll<HTMLElement>(HEADS).forEach((h) => {
          if (!h.closest(".doc, .gt")) splitWords(h);
        });
        let i = 0;
        sec.querySelectorAll<HTMLElement>(PARTS).forEach((el) => {
          if (el.parentElement?.closest("[data-part]") || el.closest("[data-words]")) return;
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
