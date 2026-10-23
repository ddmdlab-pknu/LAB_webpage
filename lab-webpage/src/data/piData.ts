// 지도교수 경력 정보. 새 디자인의 첫 화면과 Leader 페이지가 이 파일을 같이 쓴다.
// 항목을 고치면 두 곳에 함께 반영된다.

export interface CareerItem {
  period: string; // 화면 왼쪽에 보이는 기간
  org: string;
  role: string;
  current?: boolean; // 현재 직책이면 true (점이 초록색으로 표시)
}

export interface HonorItem {
  date: string;
  title: string;
  detail: string;
}

export const piProfile = {
  nameKo: "박세민",
  nameEn: "Semin Park, Ph.D.",
  position: "국립부경대학교 신소재시스템공학전공 조교수 · 학과장",
  photo: "/images/prof-profile.png",
  email: "newtain@pknu.ac.kr",
  phone: "+82-51-629-6378",
  office: "공학1관 1001호",
  headline: "POSCO에서 9년,",
  headline2: "이제는 데이터로 소재를 설계합니다.",
  summary:
    "POSCO 기술연구원에서 방향성 전기강판의 자구미세화 기술을 개발해 양산까지 이었습니다. 2023년 국립부경대학교에 부임해, 현장에서 다룬 공정 데이터에 AI와 시뮬레이션을 결합하는 연구실을 운영하고 있습니다.",
  interests: [
    "Data-driven metallurgy",
    "Meta-optimization",
    "Electrical steel",
    "Machine learning",
    "Magnetic properties",
  ],
  tools: ["Pandat · 상변태·확산·phase field", "OIM · 집합조직 분석", "ML · 최적화"],
};

export const career: CareerItem[] = [
  {
    period: "2023.09 — 현재",
    org: "국립부경대학교 신소재시스템공학전공",
    role: "조교수 · 학과장. Data Driven Material Design Lab 운영",
    current: true,
  },
  {
    period: "9년 · ~2023.08",
    org: "POSCO 기술연구원",
    role: "수석연구원. 방향성 전기강판 자구미세화 기술 개발과 양산 적용, 특허 출원",
  },
  {
    period: "2010.09 — 2015.02",
    org: "POSTECH 철강·에너지소재대학원",
    role: "공학박사 · 지도교수 구양모",
  },
  {
    period: "2008.09 — 2010.08",
    org: "POSTECH 철강·에너지소재대학원",
    role: "공학석사",
  },
  {
    period: "2003.03 — 2008.08",
    org: "POSTECH 신소재공학과",
    role: "공학사",
  },
];

export const honors: HonorItem[] = [
  { date: "2026.06", title: "한국열처리공학회 편집위원", detail: "KSHT Editorial Board" },
  { date: "2024.07", title: "Pandat 공인 트레이너", detail: "CompuTherm 인증 · 국내 교육 트레이너" },
  { date: "2018.12", title: "포스코 기술연구원장 표창", detail: "영구 자구미세화 23PHE080 양산 개발" },
  { date: "2018.08", title: "POSCO 기술상", detail: "방향성 전기강판 자구미세화 양산 개발" },
];

// 특허 건수와 대표 목록 (Leader 페이지에 목록으로 표시)
export const patents = {
  pctRep: {
    label: "PCT 대표 발명",
    count: 5,
    items: [
      "PCT/KR2020/017973 CN, EP, JP, US · Grain-oriented electrical steel and its magnetic domain refinement method",
      "PCT/KR19/018033 JP, EP, CN, US · Grain-oriented electrical steel and its manufacturing method",
      "PCT/KR2019/06220 JP, EP, CN, US · Grain-oriented electrical steel and its magnetic domain refinement method",
      "PCT/KR2018/16037 CN, DE, EP, FR, GB, JP · Grain-oriented electrical steel and its magnetic domain refinement method",
      "PCT/KR17/015204 JP, CN, US · Grain-oriented electrical steel and its magnetic domain refinement method",
    ],
  },
  domesticRep: {
    label: "국내 대표 발명",
    count: 11,
    items: [
      "2020-0179368, 2438476 · Grain-oriented electrical steel with superior noise characteristics",
      "2020-0177989, 2462682 · Grain-oriented electrical steel with superior noise characteristics",
      "2019-0171286, 2276850 · Process for magnetic domain refined grain-oriented electrical steel with superior magnetic properties",
      "2019-0172496, 2395230 · Process for temporary magnetic domain refined grain-oriented electrical steel with superior magnetic properties",
      "2018-0165650, 10-2162984 · Advanced process for permanent magnetic domain refinement of electrical steel",
    ],
  },
  pctCo: {
    label: "PCT 공동 발명",
    count: 10,
    items: [
      "PCT/KR17/015127 권오열 · Grain-oriented electrical steel and its magnetic domain refinement method",
      "PCT/KR17/015128 권오열 · Magnetic domain refinement method for grain-oriented electrical steel",
      "PCT/KR17/015205 권민석 · Annealing separator composition for grain-oriented electrical steel, grain-oriented electrical steel and manufacturing method thereof",
      "PCT/KR19/12027 홍성철 · Foreign material trapping device and electrical steel manufacturing equipment including the same",
      "PCT/KR19/17445 홍성철 · Foreign material removal device and electrical steel manufacturing equipment including the same",
    ],
  },
};
