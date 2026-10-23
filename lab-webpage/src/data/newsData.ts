export interface NewsItem {
  date: string;
  comments: string;
  category?: "Award" | "Conference" | "Publication" | "Event" | "News";
}

export const newsData: NewsItem[] = [
  // 2026

  {
    date: "2026.10.22",
    comments:
      "규소 6.5%급 광폭 전기강판 및 xEV 전비 향상 기술개발 과제 1차년도 진도 점검 워크숍(울산, 10.21~22)에 참석하여 소재팀 연구 진행 현황을 발표하였습니다.",
    category: "Conference",
  },
  {
    date: "2026.10.01",
    comments:
      "2026년도 한국열처리공학회 추계학술대회에서 유민상 학생의 '멀티모달 파운데이션 모델을 이용한 무방향성 전기강판 자속밀도의 예측, 생성, 교차 검증' 논문이 우수논문상(정인상 상)을 수상하였습니다. 축하합니다!",
    category: "Award",
  },
  {
    date: "2026.10.01",
    comments:
      "2026년도 한국열처리공학회 추계학술대회에 참가하여 고은수, 성민수, 유민상 학생이 포스터 발표를 하였습니다.",
    category: "Conference",
  },
  {
    date: "2026.08.24",
    comments:
      "유민상 학생의 'A role-separated multimodal foundation-model framework for cross-modal verification of process-microstructure-B50 relations in non-oriented electrical steel' 논문이 MTC에 게재되었습니다. 축하합니다!",
    category: "Publication",
  },
  {
    date: "2026.06.13",
    comments:
      "하준서 학생의 'Self-supervised learning for grain size prediction in Fe-Si alloy steel sheets: A TabNet-based approach with explainable AI validation' 논문이 MTC에 게재되었습니다. 축하합니다!",
    category: "Publication",
  },
  {
    date: "2026.06.11",
    comments:
      "'규소 6.5%급 광폭 전기강판 및 xEV 전비 향상 모터 개발' 국책사업 Kick-Off 미팅에 참석하였습니다.",
    category: "Event",
  },
  {
    date: "2026.06.08",
    comments:
      "박세민 교수님께서 한국열처리공학회(KSHT) 편집위원으로 위촉되었습니다.",
    category: "News",
  },
  {
    date: "2026.05.27",
    comments:
      "성민수 학생의 'DDPM 기반 데이터 증강과 AutoML을 활용한 극박 무방향성 전기강판의 자기 특성 예측 및 열처리 공정 최적화' 논문이 KJMM에 게재되었습니다. 축하합니다!",
    category: "Publication",
  },
  {
    date: "2026.04.01",
    comments:
      "(주)포스코 주관 광폭 전기강판 및 xEV 전비 향상형 코어·구동모터 개발 과제에 착수하였습니다.",
    category: "News",
  },
  {
    date: "2026.03.01",
    comments:
      "한국연구재단 주관 Multimodal & Bayesian 최적화 기반 고성능 자성 모터코어 제조공정 개발 국과과제에 착수하였습니다.",
    category: "News",
  },
  {
    date: "2026.02.12",
    comments:
      "RISE 1차년도 통합성과공유회에서 '재료 AI 최적화법을 활용한 고성능 모터코어용 초극박 확산형 전기강판 제조 기술 개발' 주제로 연구 우수사례로 선정되었습니다.",
    category: "Award",
  },
  // 2025
  {
    date: "2025.12.01",
    comments:
      "오지은 학생의 'GAN 기반 데이터 증강과 머신러닝을 활용한 극박 무방향성 전기강판 히스테리시스 곡선 및 철손 예측 연구' 논문이 한국자기학회지(JKMS)에 게재되었습니다. 축하합니다!",
    category: "Publication",
  },
  {
    date: "2025.11.26",
    comments:
      "2025 KMS Winter Conference_Post Discussion에 참가하여 김현아, 오지은, 하준서 학생이 포스터 발표를 하였습니다.",
    category: "Conference",
  },
  {
    date: "2025.11.25",
    comments:
      "고은수 학생의 '박판 Fe-Si 전기강판의 Al 코팅 확산 열처리 시 진공도가 확산 거동에 미치는 영향' 논문이 KSHT에 게재되었습니다. 축하합니다!",
    category: "Publication",
  },
  {
    date: "2025.09.19",
    comments:
      "유민상 학생이 포스코 청년 AI Big Data 아카데미 31기에 최종 선발되었습니다. 축하합니다!",
    category: "Award",
  },
  {
    date: "2025.09.08",
    comments:
      "독일 항공 우주센터 이수석 연구원님이 '독일항공우주센터 소개 및 AI를 통해 와류가 항공기에 미치는 영향' 주제로 강연을 해주셨습니다.",
    category: "Event",
  },
  {
    date: "2025.09.08",
    comments:
      "하준서 학생의 'Predicting Grain Size of Fe Si Alloy Steel Sheet through Magnetic Properties and Machine Learning with XAI' 논문이 Journal of Magnetics에 게재되었습니다. 축하합니다!",
    category: "Publication",
  },
  {
    date: "2025.08.27",
    comments:
      "고은수, 유민상 학생이 내가 원하는 융복합 교양과목 공모전에서 '생활속 AI와 데이터' 주제로 우수상을 수상하였습니다. 축하합니다!",
    category: "Award",
  },
  {
    date: "2025.08.14",
    comments: "PKNU RISE 산업단 산학공동기술개발과제에 착수하였습니다.",
    category: "News",
  },
  {
    date: "2025.07.01",
    comments:
      "오지은 학생의 'GAN과 AutoML의 조합을 통한 박판 Fe-Si 합금의 자기 특성 예측 및 프로세스 최적화' 논문이 KJMM에 게재되었습니다. 축하합니다!",
    category: "Publication",
  },
  {
    date: "2025.06.19",
    comments:
      "김현아 학생의 '머신러닝 및 XAI 기반 최적화를 통한 L-PBF 박판 3.3% Si 전기강판의 제조 공정 및 특성 분석' 논문이 KJMM에 게재되었습니다. 축하합니다!",
    category: "Publication",
  },
  {
    date: "2025.02.14",
    comments: "고은수 학생이 교육성과 우수자로 선정되었습니다. 축하합니다!",
    category: "Award",
  },
  {
    date: "2025.02.13",
    comments: "Technology Exchange Meeting with POMIA",
    category: "Event",
  },
  // 2024
  {
    date: "2024.11.27",
    comments:
      "2024 KMS Winter Conference_Soft Magnetics Symposium 에 참가하여 구두발표를 하였습니다.",
    category: "Conference",
  },
  {
    date: "2024.11.14",
    comments:
      "세계 부식의 날(Corrosion Awareness Day) 2024 제5회 부식 사례 포스터 공모전 에서 대학부 수상자로 선정되었습니다. 축하합니다!",
    category: "Award",
  },
  // 2023
  {
    date: "2023.09.02",
    comments: "박세민 교수님이 조교수로 부경대학교에 오셨습니다.",
    category: "News",
  },
];
