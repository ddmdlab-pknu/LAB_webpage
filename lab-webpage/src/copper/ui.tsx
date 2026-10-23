// 새 디자인 공용 조각들
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export interface MenuItem {
  label: string;
  href: string;
}
export interface MenuGroup {
  label: string;
  href: string;
  items: MenuItem[];
}

// 메뉴. 주소는 기존 홈페이지와 같다.
export const MENU: MenuGroup[] = [
  {
    label: "About",
    href: "/about/Overview",
    items: [
      { label: "Overview", href: "/about/Overview" },
      { label: "Leader", href: "/about/Pi" },
      { label: "Members", href: "/about/Members" },
      { label: "Location", href: "/about/Location" },
    ],
  },
  {
    label: "Research",
    href: "/project/ResearchAreas",
    items: [
      { label: "Research Areas", href: "/project/ResearchAreas" },
      { label: "Projects", href: "/project/Project" },
      { label: "Published Papers", href: "/project/PublishedPapers" },
      { label: "Must Read Papers", href: "/project/MustReadPapers" },
    ],
  },
  { label: "Facilities", href: "/facilities/Facilities", items: [] },
  {
    label: "Activities",
    href: "/activities/News",
    items: [
      { label: "News", href: "/activities/News" },
      { label: "Gallery", href: "/activities/Gallery" },
      { label: "Lab Game", href: "/activities/LabGame" },
    ],
  },
  { label: "Join us", href: "/join_us/Join_us", items: [] },
];

// "Ha Jun Seo(하준서)" → "하준서"
export function krName(name: string) {
  const m = name.match(/\(([^)]+)\)/);
  return m ? m[1] : name;
}
export function enName(name: string) {
  return name.replace(/\s*\([^)]*\)\s*/, "").trim();
}

const CAT: Record<string, string> = {
  Award: "수상",
  Conference: "학회",
  Publication: "논문",
  Event: "행사",
  News: "소식",
};
export const catLabel = (cat?: string) => (cat && CAT[cat]) || CAT.News;
export function catChip(cat?: string) {
  return <span className="chip">{catLabel(cat)}</span>;
}

// 하위 페이지 머리말
export function PageHead({
  title,
  ko,
  group,
}: {
  label?: string; // 예전 머리말 위 작은 라벨. 이제는 쓰지 않는다

  title: string;
  ko?: string;
  group?: MenuGroup;
}) {
  const { pathname } = useLocation();
  return (
    <header className="phead">
      <div className="wrap">
        <h1>{title}</h1>
        {ko && <p>{ko}</p>}
        {group && group.items.length > 1 && (
          <nav className="crumbs" aria-label={`${group.label} 하위 메뉴`}>
            {group.items.map((i) => (
              <Link key={i.href} to={i.href} className={pathname === i.href ? "on" : ""}>
                {i.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}

export function groupOf(label: string) {
  return MENU.find((g) => g.label === label);
}

// 클릭하면 글자를 복사. 복사가 막힌 환경이면 글자를 선택해 둔다
export function useCopy(text: string) {
  const [copied, setCopied] = useState(false);
  const copy = async (target?: HTMLElement | null) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      if (target) {
        const r = document.createRange();
        r.selectNodeContents(target);
        const s = window.getSelection();
        s?.removeAllRanges();
        s?.addRange(r);
      }
    }
  };
  return { copied, copy };
}
