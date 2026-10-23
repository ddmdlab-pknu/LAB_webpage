import { useState } from "react";
import { useLocation } from "react-router-dom";

// 메뉴 구성. 주소와 이름은 기존 홈페이지와 같다.
const menu = [
  {
    label: "ABOUT",
    href: "/about/Overview",
    items: [
      { label: "Overview", href: "/about/Overview" },
      { label: "Leader", href: "/about/Pi" },
      { label: "Members", href: "/about/Members" },
      { label: "Location", href: "/about/Location" },
    ],
  },
  {
    label: "PROJECT",
    href: "/project/Project",
    items: [
      { label: "Must Read Papers", href: "/project/MustReadPapers" },
      { label: "Published Papers", href: "/project/PublishedPapers" },
      { label: "Research Areas", href: "/project/ResearchAreas" },
      { label: "Project", href: "/project/Project" },
    ],
  },
  { label: "FACILITIES", href: "/facilities/Facilities", items: [] },
  {
    label: "ACTIVITIES",
    href: "/activities/Gallery",
    items: [
      { label: "News", href: "/activities/News" },
      { label: "Gallery", href: "/activities/Gallery" },
      { label: "Lab Game", href: "/activities/LabGame" },
    ],
  },
  { label: "JOIN US", href: "/join_us/Join_us", items: [] },
];

function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const section = (href: string) => "/" + href.split("/")[1];
  const isActive = (m: (typeof menu)[number]) =>
    pathname.startsWith(section(m.href)) ||
    m.items.some((i) => pathname.startsWith(i.href));

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-border">
      <div className="max-w-[1180px] mx-auto px-4 md:px-8 h-16 lg:h-[72px] flex items-center gap-6">
        <a href="/" className="flex items-center gap-3 min-w-0">
          <img
            className="w-12 h-10 lg:w-14 lg:h-12 object-contain"
            alt="연구실 로고"
            src="/images/lab-logo.png"
          />
          <span className="flex flex-col leading-tight min-w-0">
            <b className="text-[13px] lg:text-[15px] font-bold tracking-wide text-steel truncate">
              DATA DRIVEN MATERIAL DESIGN LAB
            </b>
            <span className="text-[11px] lg:text-xs text-my_name truncate">
              국립부경대학교 신소재시스템공학전공
            </span>
          </span>
        </a>

        {/* PC 메뉴: 항목에 마우스를 올리면 하위 메뉴가 열림 */}
        <nav className="hidden lg:block ml-auto" aria-label="주 메뉴">
          <ul className="flex items-center gap-1">
            {menu.map((m) => (
              <li key={m.label} className="relative group">
                <a
                  href={m.href}
                  className={`block px-4 py-6 text-sm font-medium tracking-wide transition-colors hover:text-ipfb ${
                    isActive(m) ? "text-ipfb" : "text-ink"
                  }`}
                >
                  {m.label}
                </a>
                {isActive(m) && (
                  <span className="absolute left-4 right-4 bottom-4 h-0.5 bg-gradient-to-r from-ipfr via-ipfg to-ipfb" />
                )}
                {m.items.length > 0 && (
                  <ul className="invisible opacity-0 translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:visible group-focus-within:opacity-100 transition-all absolute left-0 top-full min-w-[210px] bg-white border border-border rounded-lg shadow-xl py-2">
                    {m.items.map((i) => (
                      <li key={i.href}>
                        <a
                          href={i.href}
                          className={`block px-4 py-2.5 text-sm hover:bg-paper hover:text-ipfb ${
                            pathname === i.href ? "text-ipfb font-semibold" : "text-ink"
                          }`}
                        >
                          {i.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* 모바일 메뉴 버튼 */}
        <button
          className="lg:hidden ml-auto p-2 -mr-2"
          onClick={() => setOpen(true)}
          aria-label="메뉴 열기"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </div>

      {/* 모바일 사이드바 (닫혀 있을 때 화면 밖으로 넘치지 않도록 감싸는 틀 안에 둠) */}
      <div
        className={`lg:hidden fixed inset-0 z-50 overflow-hidden ${
          open ? "" : "invisible pointer-events-none"
        }`}
      >
      <div
        className={`absolute inset-0 bg-ink/40 transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => setOpen(false)}
      />
      <aside
        className={`absolute top-0 right-0 h-full w-full max-w-[340px] bg-white shadow-2xl transition-transform overflow-y-auto ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="모바일 메뉴"
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-border">
          <span className="font-mono text-xs tracking-widest text-steel">MENU</span>
          <button onClick={() => setOpen(false)} aria-label="메뉴 닫기" className="p-2 -mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav>
          <ul>
            {menu.map((m) => (
              <li key={m.label} className="border-b border-border px-5 py-4">
                <a href={m.href} className="text-lg font-semibold text-ink">
                  {m.label}
                </a>
                {m.items.length > 0 && (
                  <ul className="mt-2 ml-1 flex flex-col">
                    {m.items.map((i) => (
                      <li key={i.href}>
                        <a
                          href={i.href}
                          className={`block py-1.5 text-[15px] ${
                            pathname === i.href ? "text-ipfb font-semibold" : "text-my_name"
                          }`}
                        >
                          {i.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      </div>
    </header>
  );
}

export default Header;
