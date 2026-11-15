// 홈 첫 화면 위쪽에 띄우는 알림 배너. 맨 위가 먼저 보이고, 여러 개면 6초마다 넘어간다.
// until(YYYY-MM-DD)이 지나면 자동으로 사라진다. 비우면 배너 자체가 안 보인다.
export type Banner = {
  label: string; // 짧은 꼬리표: 수상, 논문, 학회 …
  date: string; // YYYY.MM.DD
  title: string;
  to: string; // 누르면 갈 곳 (사이트 안 주소 또는 https://…)
  img?: string;
  until: string; // YYYY-MM-DD, 이 날까지 보임
};

export const banners: Banner[] = [
  {
    label: "학회 발표",
    date: "2026.11.06",
    title: "박세민 교수, ICIMC 2026에서 다중모달 AI 기반 전기강판 Al 표면 확산 연구 구두 발표",
    to: "/activities/News",
    img: "/images/2026_ICIMC.jpg",
    until: "2026-12-31",
  },
  {
    label: "논문",
    date: "2026.10.29",
    title: "하준서 · 강화학습 기반 무방향성 전기강판 공정 역설계, JMR&T 온라인 게재",
    to: "/project/PublishedPapers/2026-ha-jmrt",
    img: "/images/papers/2026-ha-jmrt-first-page.png",
    until: "2026-12-31",
  },
  {
    label: "수상",
    date: "2026.10.28",
    title: "하준서 학생, 대한금속·재료학회 KIM Student of the Year 2026 수상",
    to: "/activities/News",
    img: "/images/2026_KIM_presentation_HJS.jpg",
    until: "2026-12-31",
  },
];

// 첫 방문 팝업 (하나만). until이 지나면 안 뜬다. 방문자가 "오늘 하루 보지 않기"를 누르면 그날은 안 뜬다
export type Popup = { id: string; label: string; title: string; desc: string; to: string; cta: string; img?: string; until: string };

export const popup: Popup | null = {
  id: "recruit-2026-11",
  label: "모집 중",
  title: "3·4학년 학부연구생을 모집합니다",
  desc: "전기강판·자성 소재를 데이터와 AI로 설계하는 연구에 함께할 3·4학년 학부연구생을 찾고 있습니다. 관심 있는 학생은 언제든 연락 주세요.",
  to: "/join_us/Join_us",
  cta: "지원 안내 보기",
  img: "/images/2026_KIM_80th_photowall.jpg",
  until: "2027-02-28",
};
