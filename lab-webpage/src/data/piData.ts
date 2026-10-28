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
  summary:
    "2023년 국립부경대학교에 부임해, 현장에서 다룬 공정 데이터에 AI와 시뮬레이션을 결합하는 연구실을 운영하고 있습니다.",
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
    role: "수석연구원",
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
];

// Leader 페이지 "대표 논문"에 보일 논문 (src/data/papersData.ts 의 id, 보일 순서대로)
export const piSelectedPapers = [
  "2023-park-jmrt",
  "2023-na-matchar",
  "2023-na-scripta",
  "2023-na-mtc",
  "2023-na-mmi",
];

// 특허: 포스코 기술연구원 재직(2014–2023) 중 출원·등록분. 출처는 CV (2026-01 수정본)
// 건수와 목록은 Leader 페이지와 첫 화면 "지도교수" 구역에 함께 쓰인다. 목록이 건수보다 적으면 "외 N건"으로 표시
export const patentSummary = {
  total: 63,
  domestic: 48, // 대표 11 + 공동 37
  pct: 15, // 대표 5 + 공동 10
  note: "포스코 기술연구원 재직(2014–2023) 중 출원·등록",
};

export interface PatentGroup {
  label: string;
  count: number;
  items: string[]; // "발명의 명칭 · 번호"
}

export const patents: Record<"domesticRep" | "domesticCo" | "pctRep" | "pctCo", PatentGroup> = {
  domesticRep: {
    label: "국내 대표 발명",
    count: 11,
    items: [
      "소음 특성이 우수한 방향성 전기강판 · 등록 10-2438476 (출원 10-2020-0179368)",
      "소음이 우수한 방향성 전기강판 · 등록 10-2462682 (출원 10-2020-0177989)",
      "자성이 우수한 자구 미세화 방향성 전기강판 공정 · 등록 10-2276850 (출원 10-2019-0171286)",
      "자성이 우수한 일시자구 미세화 방향성 전기강판 공정 · 등록 10-2395230 (출원 10-2019-0172496)",
      "전기강판 영구자구미세화 고도화 공정 · 등록 10-2162984 (출원 10-2018-0165650)",
      "자성이 향상된 방향성 전기강판 · 등록 10-2126220 (출원 10-2018-0114111)",
      "자성이 우수한 방향성 전기강판 공정 · 등록 10-2104554 (출원 10-2018-0114110)",
      "방향성 전기강판 영구자구미세화 공정 · 등록 10-2080172 (출원 10-2017-0179539)",
      "철손이 우수한 일시자구미세화 전기강판 · 등록 10-2044320 (출원 10-2017-0179924)",
      "방향성 전기강판의 적층 시 판 간의 결합성 향상 방향 · 등록 10-1919519 (출원 10-2016-0177831)",
      "방향성 전기강판의 영구자구미세화 방법 · 등록 10-1892226 (출원 10-2016-0177890)",
    ],
  },
  domesticCo: {
    label: "국내 공동 발명",
    count: 37,
    items: [
      "방향성 전기강판 및 이의 제조방법 · 등록 10-2326327",
      "영구자구미세화 공정에 있어서의 광학계 하부 용융철 융착 차단 및 제거시스템 · 등록 10-2148384",
      "방향성 전기강판 영구자구미세화 공정에서의 Spatter 고착방지 장치 및 방법 · 등록 10-2075274",
      "방향성 전기강판 영구자구미세화 공정에 있어서의 광학계 레이저 조사시스템 · 등록 10-2177531",
      "방향성 전기강판 영구자구미세화 공정에 있어서의 광학계 레이저 융착물 및 Hill-Up 제거 시스템 · 등록 10-2175847",
      "방향성 전기강판 영구 자구미세화 레이저 빔 얼라인 장치 · 등록 10-2153193",
      "방향성 전기강판 레이저 홈가공 설비의 안정화 기술 · 등록 10-2140182",
      "방향성 전기강판 영구자구미세화 공정에 있어서의 Spatter와 Fume 포집 장치 및 방법 · 등록 10-2178733",
    ],
  },
  pctRep: {
    label: "PCT 대표 발명",
    count: 5,
    items: [
      "방향성 전기강판 및 그 자구미세화 방법 · PCT/KR2020/017973 (CN, EP, JP, US)",
      "방향성 전기강판 및 그의 제조 방법 · PCT/KR2019/018033 (JP, EP, CN, US)",
      "방향성 전기강판 및 그 자구미세화 방법 · PCT/KR2019/06220 (JP, EP, CN, US)",
      "방향성 전기강판 및 그 자구미세화 방법 · PCT/KR2018/16037 (CN, DE, EP, FR, GB, JP)",
      "방향성 전기강판 및 그 자구미세화 방법 · PCT/KR2017/015204 (JP, CN, US)",
    ],
  },
  pctCo: {
    label: "PCT 공동 발명",
    count: 10,
    items: [
      "방향성 전기강판 및 그 자구미세화 방법 · PCT/KR2017/015127",
      "방향성 전기강판의 자구미세화 방법 · PCT/KR2017/015128",
      "방향성 전기강판용 소둔 분리제 조성물, 방향성 전기강판 및 방향성 전기강판의 제조방법 · PCT/KR2017/015205",
      "이물질 포집장치 및 이를 포함하는 전기강판 제조설비 · PCT/KR2019/12027",
      "이물질 제거장치 및 이를 포함하는 전기강판 제조설비 · PCT/KR2019/17445",
      "밀착성 및 자성특성이 우수한 저철손 자구미세화 제조방법 · PCT/KR2015/14034",
      "방향성 전기강판의 자구미세화 방법과 그 장치 · PCT/KR2016/15161",
      "방향성 전기강판 및 그의 제조 방법 · PCT/KR2016/15235",
      "방향성 전기강판의 자구미세화 방법과 그 장치 · PCT/KR2017/00617",
      "방향성 전기강판 및 그의 제조 방법 · PCT/KR2020/018618",
    ],
  },
};
