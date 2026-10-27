export interface PublicationItem {
  id: string; // 상세 페이지 주소에 쓰임 (/project/PublishedPapers/<id>). 영문 소문자, 숫자, 하이픈만
  year: string;
  title: string;
  journal: string;
  authors?: string[]; // 1저자부터 논문에 적힌 순서대로
  link?: string; // 논문 원문 링크 (DOI 등). 상세 페이지에 버튼으로 표시
  abstract?: string; // 상세 페이지에 표시할 초록. 문단은 빈 줄로 구분
  figure?: string; // Graphical abstract 또는 대표 figure 이미지 경로 (예: "/images/papers/xxx.png")
  figureCaption?: string; // figure 아래 설명. 없으면 생략
  firstPage?: string; // 논문 첫 페이지 이미지 경로. 상세 페이지 맨 아래에 표시
  keywords?: string[]; // 논문에 적힌 키워드. 필독 논문 카드와 상세 페이지에 표시
  status?: "accepted"; // 게재 승인 후 아직 온라인에 실리지 않은 논문. 목록·상세에 "Accepted" 표시. 온라인에 실리면 지우고 link·abstract·firstPage를 넣는다
}

// 연구실 구성원 이름 (논문에 적힌 표기 그대로). authors에 있는 이름이 여기 있으면 밑줄로 표시됨
// 공백, 하이픈, 마침표, 대소문자, 이름 뒤 *(교신저자 표시)는 구분하지 않음 ("Hyeon-A Kim" = "hyeon a kim")
export const labMemberNames: string[] = [
  "SeMin Park",
  "박세민",
  "JunSeo Ha",
  "하준서",
  "Jieun Oh",
  "오지은",
  "HyeonAh Kim",
  "김현아",
  "Minsu Sung",
  "성민수",
  "EunSu Ko",
  "고은수",
  "Minsang Yu",
  "유민상",
];

// 학술지별 Impact Factor. 값을 넣으면 논문 목록의 학술지 이름 옆에 "IF x.x"로 표시됨
// 키는 아래 논문 항목의 journal 값과 정확히 같아야 함
export const journalImpactFactors: Record<string, string> = {
  "Journal of Materials Research and Technology": "7.3",
  "Materials Characterization": "6.2",
  "Scripta Materialia": "5.9",
  "Materials Today Communications": "4.9",
  "Metals and Materials International": "4.5",
  "Korean Journal of Metals and Materials": "1.4",
  "Journal of Magnetics": "0.6",
};

// 학술지별 JCR 분위(Q1~Q4). 여러 분야에 걸친 학술지는 가장 높은 분위를 적는다.
// SCIE가 아닌 국내 학술지는 "KCI"로 적는다. 값을 넣으면 논문 목록에 표시됨
// (JCR 2025 기준, 2026년 10월 Clarivate JCR 에서 확인. 매년 6월 JCR이 새로 나오면 IF·분야 순위와 함께 고친다)
export const journalQuartiles: Record<string, string> = {
  "Journal of Materials Research and Technology": "Q1",
  "Materials Characterization": "Q1",
  "Scripta Materialia": "Q1",
  "Metals and Materials International": "Q1",
  "Materials Today Communications": "Q2",
  "Korean Journal of Metals and Materials": "Q3",
  "Journal of Magnetics": "Q4",
  "Journal of the Korean Magnetics Society": "KCI",
  "Journal of the Korean Society for Heat Treatment": "KCI",
};

// 학술지별 JCR 분야 순위: 그 학술지가 가장 높게 매겨진 분야 하나의 IF 순위/전체 학술지 수.
// 순위/전체가 10% 이내면 논문 목록·상세·타일에 "상위 10%" 표시 (예: 3/37 = 8.1% → 표시, 10/97 = 10.3% → 표시 안 함)
// (JCR 2025, 2026년 10월 Clarivate JCR 에서 확인. 매년 6월 IF·분위와 함께 고친다)
export const JCR_YEAR = "2025";
export const journalRanks: Record<string, { rank: number; total: number; category: string }> = {
  "Journal of Materials Research and Technology": { rank: 10, total: 97, category: "Metallurgy & Metallurgical Engineering" },
  "Materials Characterization": { rank: 3, total: 37, category: "Materials Science, Characterization & Testing" },
  "Scripta Materialia": { rank: 14, total: 97, category: "Metallurgy & Metallurgical Engineering" },
  "Metals and Materials International": { rank: 21, total: 97, category: "Metallurgy & Metallurgical Engineering" },
  "Materials Today Communications": { rank: 179, total: 473, category: "Materials Science, Multidisciplinary" },
  "Korean Journal of Metals and Materials": { rank: 64, total: 97, category: "Metallurgy & Metallurgical Engineering" },
  "Journal of Magnetics": { rank: 451, total: 473, category: "Materials Science, Multidisciplinary" },
};

/** 분야 순위가 상위 10% 이내면 그 정보를, 아니면 null */
export function top10(journal: string) {
  const r = journalRanks[journal];
  if (!r) return null;
  const pct = (r.rank / r.total) * 100;
  return pct <= 10 ? { ...r, pct } : null;
}

// 같은 연도 안에서는 배열 순서대로 표시됨 (최신 논문을 위에)
export const publicationsData: PublicationItem[] = [
  // 2026
  {
    id: "2026-ha-jmrt",
    year: "2026",
    title:
      "Reinforcement learning-based inverse design of frequency-dependent processing conditions for core loss minimization in non-oriented electrical steel",
    journal: "Journal of Materials Research and Technology",
    authors: ["JunSeo Ha", "Min Su Sung", "Ho Sung Jang", "Sunmi Shin", "Sung-Jin Kim", "SeMin Park*"],
    keywords: ["Non-oriented electrical steel", "Core loss", "Reinforcement learning", "Inverse design", "Surrogate model"],
    status: "accepted", // 2026.10.27 게재 승인
  },
  {
    id: "2026-yu-mtc",
    year: "2026",
    title:
      "A role-separated multimodal foundation-model framework for cross-modal verification of process-microstructure-B50 relations in non-oriented electrical steel",
    journal: "Materials Today Communications",
    authors: ["MinSang Yu", "Ho Sung Jang", "Sunmi Shin", "Sung-Jin Kim", "SeMin Park*"],
    link: "https://doi.org/10.1016/j.mtcomm.2026.115973",
    abstract:
      "Non-oriented electrical steel (NOES) is a core soft magnetic material for electric motors, its flux density B50 indicating efficiency. Because B50 is governed mainly by texture and grain morphology, relating it to microstructure and verifying that relation is more informative than prediction alone. A multimodal foundation-model framework combining three role-separated tools to interpret, generate, and cross-modally verify process–microstructure–B50 relations is presented. Si 3.27 wt% NOES (0.35 mm) was annealed under 40 conditions (750–1000 °C, 5–60 min), yielding 205 micrographs with B50 spanning 1.529–1.608 T (σ = 0.023 T). With a 25-D input (process variables, Mask R-CNN grain descriptors, 16-D Swin latent), B50 was already well explained by process variables alone (TabPFN R² = 0.758, MAE = 0.0086 T); the microstructure modalities did not improve accuracy, as annealing governs microstructure and renders morphological descriptors largely redundant; instead they serve interpretation, generation, and verification. A segmentation-trained Mask2Former, never given magnetic labels, yielded a latent z₁ aligning with independent grain descriptors at R² = 0.87–0.98, exceeding the inter-segmenter floor. Its cross-attention shifted from grain boundaries to interiors with rising temperature, tracking grain coarsening; boundary focus co-varied with B50 (ρ = +0.73), an association carried by annealing temperature. A process-conditioned generator reproduced grain size at R² = 0.926 in-distribution and 0.874 under interpolation. At the recommended condition (T* = 800 °C, t* = 45 min), predictor, generator, and measurement agreed within 10%. This framework shows promise as a route to interpreting, generating, and verifying process–microstructure–property relations, beyond predictive accuracy alone.",
    firstPage: "/images/papers/2026-yu-mtc-first-page.jpg",
  },
  {
    id: "2026-ha-mtc",
    year: "2026",
    title:
      "Self-supervised learning for grain size prediction in Fe-Si alloy steel sheets: A TabNet-based approach with explainable AI validation",
    journal: "Materials Today Communications",
    authors: ["JunSeo Ha", "Ho Sung Jang", "Sunmi Shin", "Sung-Jin Kim", "SeMin Park*"],
    link: "https://doi.org/10.1016/j.mtcomm.2026.115549",
    abstract:
      "Conventional grain size measurement methods for Non-Oriented Electrical Steel (NOES), such as chemical etching and optical microscopy, are destructive and unsuitable for full-scale inspection. In addition, the high cost of acquiring labeled grain size data constrains the generalization of conventional supervised machine learning models in this application. To address these limitations, three Self-Supervised Learning (SSL) models—VIME, SCARF, and TabNet—were employed with Accumulated Local Effects (ALE) and Counterfactual Explanations (CE) to non-destructively predict grain size from magnetic properties measured using a single-sheet tester. The study used 0.1 mm-thick Fe-Si NOES sheets (Si 0.61 wt%, Al 0.34 wt%) with grain sizes spanning 42.1–116.8 μm. TabNet-SSL achieved the highest predictive accuracy of R² = 0.81 and RMSE = 12.20 μm, outperforming conventional supervised baselines (Random Forest, Gradient Boosting, MLP, XGBoost) by +0.29 in R². A lightweight model utilizing only 30 input variables—a 70% reduction in input dimensionality—maintained R² = 0.73. ALE and CE analyses confirmed that the predictive mechanisms are consistent with magnetics theory, including domain wall pinning effects and permeability behavior. These findings demonstrate that non-destructive grain size prediction is achievable from magnetic measurements. The XAI-driven analysis establishes an interpretable basis for measurement condition selection, enabling reduction of required input variables. Within the validated range of alloy composition, sheet thickness, and grain size, the proposed framework shows potential for XAI-driven measurement protocol design and supports quality monitoring of NOES sheets. This offers a viable route toward data-driven process management with reduced measurement cost.",
    firstPage: "/images/papers/2026-ha-mtc-first-page.jpg",
  },
  {
    id: "2026-sung-kjmm",
    year: "2026",
    title:
      "DDPM 기반 데이터 증강과 AutoML을 활용한 극박 무방향성 전기강판의 자기 특성 예측 및 열처리 공정 최적화",
    journal: "Korean Journal of Metals and Materials",
    authors: ["Minsu Sung", "Jieun Oh", "Sung-Jin Kim", "Sooseok Lee", "SeMin Park*"],
    link: "https://doi.org/10.3365/KJMM.2026.64.7.670",
    abstract:
      "Optimizing the magnetic properties of 0.1 mm ultra-thin non-oriented electrical steel is essential for improving electric vehicle (EV) traction motor efficiency. However, traditional experimental trial-and-error methods incur massive time and costs and suffer from limited data availability. To overcome these limitations, this study aims to confirm the effectiveness of data augmentation without additional experiments, enhancing modeling accuracy for magnetic property optimization using limited data. An integrated artificial intelligence (AI) pipeline combining Denoising Diffusion Probabilistic Model (DDPM)-based data augmentation with the FLAML framework was investigated for predicting the steel's magnetic flux density (B) and hysteresis loss (Wₕ). A systematic three-step validation strategy was conducted, which included initial performance evaluation, augmentation scale optimization, and final interpolation performance evaluation on specific evaluation conditions within the explored domain. Consequently, the boosting-based LightGBM was chosen as the final model for magnetic flux density prediction using large-scale augmented data and a 300-second computation time. For hysteresis loss prediction, the ascending and descending branches of the loop were trained separately, selecting Extra Trees and CatBoost as optimal algorithms to minimize prediction errors. Based on the selected models, a grid search within the process parameter space identified 1,050 °C for 16 minutes as the optimal process among candidates satisfying the target magnetic flux density (B₂₅ ≥ 1.5T). This condition achieved a magnetic flux density of 1.6143 T while minimizing energy loss to 409.18 J/m³. These predictions showed an error of less than 2% against actual experimental measurements. In this study, the data-driven optimization framework significantly reduces the number of experiments required to develop high-performance electrical steel compared to conventional trial-and-error approaches, demonstrating its potential for broad application in alloy design and microstructure control.",
    firstPage: "/images/papers/2026-sung-kjmm-first-page.jpg",
  },
  // 2025
  {
    id: "2025-oh-jkms",
    year: "2025",
    title:
      "Machine Learning and GAN-Enhanced Prediction of Magnetic Properties and Energy Loss in Non-Oriented Electrical Steel",
    journal: "Journal of the Korean Magnetics Society",
    authors: ["Jieun Oh", "SeMin Park*"],
    link: "https://doi.org/10.4283/JKMS.2025.35.6.341",
    abstract:
      "In recent years, ultrathin high-efficiency electrical steel sheets, which serve as the core material for electric vehicle motors, have been studied to improve energy efficiency. Non-oriented electrical steel was cold-rolled twice to produce 0.1 mm ultrathin sheets, and hysteresis characteristics were investigated under heat treatment conditions in the range of 800~1,100°C and varying time durations in minutes. Furthermore, EBGAN-based data augmentation and AutoML machine learning were employed to secure untested conditions, enhance prediction accuracy, and minimize core loss. A predictive model capable of reproducing hysteresis curves with high accuracy (R² > 0.97, MSE < 0.01) was successfully established, and the use of EBGAN-based augmentation further improved prediction performance. Through machine learning and heatmap analysis, the maximum hysteresis area was predicted to be 386.119 J/m³ at 830.6°C for 1 minute, while the minimum area was predicted to be 183.772 J/m³ at 1,051.0°C for 13.6 minutes, indicating more than a twofold difference in core loss depending on the heat treatment condition. This result suggests that heat treatment directly influences domain wall motion and grain growth. The study highlights a potential pathway for reducing core loss through the optimization of heat treatment processes for ultrathin electrical steel, thereby presenting new directions in magnetic material research.",
    firstPage: "/images/papers/2025-oh-jkms-first-page.jpg",
  },
  {
    id: "2025-ko-ksht",
    year: "2025",
    title:
      "박판 Fe-Si 전기강판의 Al 코팅 확산 열처리 시 진공도가 확산 거동에 미치는 영향",
    journal: "Journal of the Korean Society for Heat Treatment",
    authors: ["EunSu Ko", "SeMin Park*"],
    link: "https://doi.org/10.12656/jksht.2025.38.6.297",
    abstract:
      "With the growing emphasis on energy efficiency in recent years, research on improving the electrical resistivity of electrical steel sheets for motor cores used in advanced mobility applications has attracted significant attention. An eco-friendly Al-PVD process followed by diffusion heat treatment has been actively investigated as a promising approach to enhance resistivity. This study examines the effects of vacuum pressure (1 × 10⁻¹~1 × 10⁻⁵ Torr) on aluminum diffusion, internal oxidation, and surface morphology evolution during post-PVD annealing at 1,000°C. Even with identical aluminum deposition amounts, the internal diffusion depth was strongly dependent on the vacuum level. A 100-fold improvement in vacuum pressure resulted in approximately twice the diffusion depth and a proportional increase in the time required to achieve uniform diffusion. At 1.0 × 10⁻³ Torr, only about 50% of the deposited aluminum diffused into the substrate, while the remainder was oxidized to Al₂O₃ within ~5 μm of the surface. Comparison between 1.0 × 10⁻³ Torr and 1.0 × 10⁻⁵ Torr conditions revealed a > 30% difference in surface oxygen content. Lower vacuum pressures promoted surface roughening through Al₂O₃ cluster formation, whereas high-vacuum conditions (≤ 1.0 × 10⁻⁶ Torr) effectively suppressed surface oxidation. In addition, both surface and internal oxidation produced non-uniform oxide and diffusion distributions, which induced coating delamination due to internal stresses arising from diffusion rate differences and mismatched thermal expansion coefficients. Overall, these results clarify the relationship between external oxidation states and internal diffusion efficiency during Al-PVD heat treatment of electrical steel sheets and provide valuable insights into optimizing process conditions for resistivity enhancement and manufacturing efficiency.",
    firstPage: "/images/papers/2025-ko-ksht-first-page.jpg",
  },
  {
    id: "2025-ha-jmag",
    year: "2025",
    title:
      "Predicting Grain Size of Fe Si Alloy Steel Sheet through Magnetic Properties and Machine Learning with XAI",
    journal: "Journal of Magnetics",
    authors: ["JunSeo Ha", "Ho Sung Jang", "Sunmi Shin", "Chang-Soo Park", "SeMin Park*"],
    link: "https://doi.org/10.4283/JMAG.2025.30.3.360",
    abstract:
      "Measuring the grain size of electrical steel is important for understanding its properties, but until now studies have attempted this using experimental equations or machine learning (ML), resulting in limited models. This study applied three ML and Explainable-AI (XAI) to analyze magnetic properties and identify key the factors most relevant to grain size prediction. Among the three tree-based models, B4_Br/Bm, B10_Pcm were identified as key variables. It was also found that variables under B1, B4, B10 conditions accounted for 60% of the model explanation ratio. Final model was constructed using these variables. These findings demonstrate the potential of ML with XAI to predict grain size with fewer magnetic measurement.",
    firstPage: "/images/papers/2025-ha-jmag-first-page.jpg",
  },
  {
    id: "2025-oh-kjmm",
    year: "2025",
    title:
      "GAN과 AutoML의 조합을 통한 박판 Fe-Si 합금의 자기 특성 예측 및 프로세스 최적화",
    journal: "Korean Journal of Metals and Materials",
    authors: ["Jieun Oh", "SeMin Park*"],
    link: "https://doi.org/10.3365/KJMM.2025.63.9.743",
    abstract:
      "In order to greatly increase the energy efficiency of the motor core of electric vehicles, commercial 0.5 mm non-oriented Si steel was re-rolled to a thin-gauge of 0.1 mm, which cannot be accomplished with commercial rolling. To maximize the flux density, a key factor affecting energy efficiency, the hysteresis AI model was optimized based on the heat treatment conditions. GAN, a data augmentation technology, and deepfake technology were used. The effectiveness of GAN and AutoML were explored as a way of increasing the consistency of the hysteresis AI model with fewer experiments. The AutoML model with FLAML based on the tree model was effectively improved, and the model performance was effectively improved on 4000 data per condition, similar to one condition of the existing data without data augmentation. The R² score was 0.9827 and the MSE was 0.0213 for various temperature and time conditions, which is less than half of the MSE of 49% compared to the MSE before applying GAN. The heatmap analysis of the flux density model showed that the maximum flux density of B8 was 1.50T under these conditions, which was about 25% better than the lowest flux density (1.14T). The value was then confirmed by actual experiment. A maximum (1.50T) of B8 in 0.1 mm re-rolled Si steel was obtained, demonstrating that the combination of GAN and FLAML can improve the consistency of continuous data material models such as hysteresis curves when experiments are insufficient. This has sufficient potential for developing magnetic data GAN technology.",
    firstPage: "/images/papers/2025-oh-kjmm-first-page.jpg",
  },
  {
    id: "2025-kim-kjmm",
    year: "2025",
    title:
      "머신러닝 및 XAI 기반 최적화를 통한 L-PBF 박판 3.3% Si 전기강판의 제조 공정 및 특성 분석",
    journal: "Korean Journal of Metals and Materials",
    authors: ["HyeonAh Kim", "Semin Park*"],
    link: "https://doi.org/10.3365/KJMM.2025.63.8.568",
    abstract:
      "In this study, electrical steel was additively manufactured using the Laser Powder Bed Fusion (L-PBF) process with 3.3% Si powder. The effects of varying laser power, scanning speed, and Y-axis scanning angle on the microstructure, density, surface roughness, and hardness were investigated. Machine learning and explainable artificial intelligence (XAI) techniques were employed to model and optimize processing conditions to achieve desirable density, surface roughness, and hardness, and the results were compared with those of commercial electrical steel. Microstructural observations revealed melt pools with cellular structures, dendrites, and porosity along the solidification heat flow direction. As the number of layers increased, primary pores formed and extended continuously along the build direction (BD). Stable values of porosity, surface roughness, and hardness were achieved when the laser power exceeded 250W and the scan speed ranged from 300 to 1000 mm/s. Increasing the Y-axis scanning angle led to a stepped layer structure due to variations in deposition thickness, which negatively affected surface roughness and porosity, although the impact on hardness was minimal—indicating the feasibility of thin-layer fabrication. Optimization using machine learning and XAI reduced porosity to 5.49%, surface roughness to 4.6 μm, and increased hardness to 305.9 HV. The predicted and experimental values showed deviations within 5%, validating the effectiveness of the machine learning approach. By prioritizing high density and low roughness, the optimal processing conditions were suggested to be 260 W, 30°, and 700 mm/s. Compared with commercial electrical steel, the additively manufactured samples showed a 2% lower density, fourfold higher roughness, and 10% higher hardness, suggesting that with improved roughness control, L-PBF-based additive manufacturing could become a viable production route for electrical steel.",
    firstPage: "/images/papers/2025-kim-kjmm-first-page.jpg",
  },

  // 2023
  {
    id: "2023-na-matchar",
    year: "2023",
    title:
      "Formation mechanism of texture in ultra-thin Fe–Si alloy sheet with excellent medium frequency magnetic properties fabricated by multi-stage decarburizing and cold rolling",
    journal: "Materials Characterization",
    authors: ["Jung Kyun Na", "Yang Mo Koo", "Se Min Park*"],
    link: "https://doi.org/10.1016/j.matchar.2023.112821",
    keywords: ["Ultra-thin Fe–Si alloy sheet", "Partial decarburization", "Multistage cold rolling method", "Magnetic property"],
    abstract:
      "In the eco-friendly energy industry, transformers with operating frequencies of over 400 Hz are highly advantageous owing to their energy efficiency and compact sizes. In this study, ultra-thin Fe–Si alloy sheets with excellent magnetic properties at 400 Hz were manufactured using a novel partial decarburization and multistage cold rolling method. The sheets of 0.05 mm have a high volume fraction of {110}〈001〉 texture (42%) and small grain (approximately 50 μm). The key factors affecting the excellent 400 Hz magnetic properties include the effect on core loss by the high volume fraction of {110}〈001〉 grains, small grain size, and optimal reduction ratio. The formation of {110}〈001〉 appears to be inhibited by evolution of texture from {111}〈112〉 to {111}〈110〉 during cold rolling and ring-shaped 〈111〉 // ND grains at the boundary of {111}〈112〉 deformed grains during early stage of annealing. This phenomenon increased with increasing rolling reduction ratio. However, in particular at rolling reduction ratio of 73% or less, the ring-shaped 〈111〉 // ND grains disappeared during annealing. Furthermore, stored energy, which is indirectly measured by kernel average misorientation value, of the grain boundaries at the ring-shaped 〈111〉 // ND grains was higher than that of other regions. It can be inferred that a high rolling reduction ratio results in a higher amount of stored energy, which induces the remaining 〈111〉 // ND grains. Our 0.05 mm thick specimen achieved a core loss (P10/400) (6.01 W/kg) improvement of approximately 18% and one of the highest magnetic flux densities (1.8 T) compared to that of commercial Fe–Si alloy sheets with same thickness.",
    firstPage: "/images/papers/2023-na-matchar-first-page.jpg",
  },
  {
    id: "2023-na-mtc",
    year: "2023",
    title:
      "Thin Fe–Si–Al alloy sheet fabricated by Al gradient diffusion through PVD for excellent high-frequency magnetic properties",
    journal: "Materials Today Communications",
    authors: ["Jung Kyun Na", "Se Min Park*", "Yang Mo Koo"],
    link: "https://doi.org/10.1016/j.mtcomm.2023.105708",
    keywords: ["Magnetic property", "Diffusion", "Aluminum", "Soft magnetic material", "Texture"],
    abstract:
      "In recent years, research on environmentally friendly methods to reduce energy loss of high-frequency transformers has gained momentum. In this study, an Fe–Si–Al alloy sheet with excellent magnetic properties at high frequencies was fabricated by an environment-friendly method involving Al diffusion through physical vapor deposition for high-frequency transformer applications. To improve the magnetic properties of the alloy, the effects of Al diffusion patterns and frequency on the magnetic properties of the Fe–Si alloy sheet were theoretically and experimentally investigated. Up to 12-µm-thick Al was deposited via physical sputtering on a 0.2-mm Fe–Si alloy sheet, which was subsequently annealed for 10–90 min under 10⁻⁴ Torr without changing the grain size and texture or forming an intermetallic phase. At 50 Hz, the eddy current loss reached a minimum, when the Al diffusion into the surface and interior was uniform with a deviation of approximately 10 %. In contrast, the high-frequency (above 400 Hz) eddy current loss was minimized, when more than 70 % of the total Al was concentrated on the surface to a depth of 1/4 area. Tension effect occurred owing to the difference between the thermal expansion coefficients of the surface Al-diffused part and the that in the interior. This tension effect minimized the eddy current loss by reducing the domain width. The core loss of our specimen at 20 kHz (8.36 W/kg) was approximately 15 % superior to that of a commercial Si steel sheet of the same thickness. These results indicate the potential of the proposed method in high-frequency transformer eco-technology.",
    firstPage: "/images/papers/2023-na-mtc-first-page.jpg",
  },
  {
    id: "2023-na-scripta",
    year: "2023",
    title:
      "Ultra-thin Fe–Si alloy sheet with excellent high frequency magnetic properties fabricated by partial decarburization combined with multi-stage cold rolling",
    journal: "Scripta Materialia",
    authors: ["Jungkyun Na", "Hyun-seok Ko", "Yangmo Koo", "Semin Park*"],
    link: "https://doi.org/10.1016/j.scriptamat.2022.115145",
    keywords: ["Annealing", "Soft magnetic materials", "Electron backscattering diffraction", "Magnetic properties", "Texture"],
    abstract:
      "Transformers with high operating frequencies are highly advantageous owing to their compact sizes. To improve their performance, we successfully fabricated ultra-thin Fe–Si alloy sheets using a novel partial decarburization and multistage cold rolling method. The sheets comprised a high volume fraction of uniform grains under 50 μm with 〈001〉 // rolling direction (RD) texture (78%) and displayed excellent magnetic properties at 20 kHz. Importantly, it was verified that core loss could be controlled by the growth of 〈001〉 // RD grains, and grain size was affected by the sheet thickness and annealing time. The 〈001〉 // RD grains were well developed for sheet thicknesses of 0.05 mm–0.07 mm; however, under 0.05 mm, Goss grain growth was hindered by the thickness of the thin sheet. Our specimen achieved a core loss (P0.5/20,000) improvement of about 20% (4.54 W/kg) and one of the highest magnetic flux densities (1.80 T) compared with commercial Fe-Si alloy sheets.",
    firstPage: "/images/papers/2023-na-scripta-first-page.jpg",
  },
  {
    id: "2023-park-jmrt",
    year: "2023",
    title:
      "Gaussian process regression-based Bayesian optimization of the insulation-coating process for Fe–Si alloy sheets",
    journal: "Journal of Materials Research and Technology",
    authors: ["Se Min Park", "Taekyung Lee", "Jeong Hun Lee*", "Ju Seok Kang", "Min Serk Kwon"],
    link: "https://doi.org/10.1016/j.jmrt.2022.12.171",
    keywords: ["Non-oriented electrical steel", "Insulation coating", "Zirconia coating", "Artificial intelligence", "Machine learning", "Probabilistic regression model"],
    abstract:
      "High-efficiency Fe–Si alloy sheets have recently gained increasing attention in the automobile industry, and these sheets must be coated with insulation to reduce energy loss. However, it is difficult to maintain the coating without peeling and to realize high electrical insulation in the high-temperature heat treatment process during coating. In this study, using an artificial intelligence algorithm—Gaussian process regression (GPR)-assisted Bayesian optimization (BO)—we successfully developed a zirconia-based coating material for Fe–Si alloy sheets, yielding high heat resistance and high-quality surface properties. The coating material developed through the optimized process exhibits a high-quality silvery-white surface, the absence of coating damage even after heat treatment at temperatures exceeding 1100 K, and a surface current value of 600 mA or less, which is a measure of insulation. Notably, compared to the existing trial-and-error method, the number of experiments required to simultaneously achieve the target characteristics was reduced to less than 0.1% using the GPR-assisted BO, demonstrating the feasibility of the approach. This result also validates the efficiency and effectiveness of the proposed method in achieving multidimensional nonlinear optimization in the actual mass production of steel.",
    firstPage: "/images/papers/2023-park-jmrt-first-page.jpg",
  },
  {
    id: "2023-na-mmi",
    year: "2023",
    title:
      "Novel Process for the Formation of Goss Grains by Concentrated Shear Strain on Surface in Inhibitor-Free Silicon Steel",
    journal: "Metals and Materials International",
    authors: ["Jungkyun Na", "Semin Park", "Hyun-seok Ko", "Hyung-don Joo", "Yangmo Koo*"],
    link: "https://doi.org/10.1007/s12540-022-01266-w",
    keywords: ["Goss", "Grain-oriented electrical steel", "Shear strain", "Columnar grain growth", "Inhibitor-free"],
    abstract:
      "Recent interest in sustainable development increased demand for efficient transformer to reduce energy consumption. In order to meet the high demand for efficient transformer, inefficient batch annealing manufacture for grain-oriented silicon steel, which is core material of transformer, should be improved. Therefore, novel process for achieving about 90% columnar Goss grains without an inhibitor in continuous line, which differs from the conventional batch process, is herein described. Fe-2.0%Si–C alloys were cold rolled and subsequently partially decarburized in a wet hydrogen gas and these steps are repeated several times. In this process, the sheet is divided into surface layer (α ferrite) and interior (pearlite-like structure + α ferrite). When two-layer sheet is cold rolled, {111}<112> is formed by concentrated shear strain and it is developed into Goss seed. During decarburization, Goss grains within surface layer grow inward as columnar grain, retaining the Goss texture of about 90%. Concentrated shear strain on surface layer was formed by large difference of strength between the surface and interior. By this difference, large stored energy difference between Goss and {111}<112>, {411}<148> is acquired, and this lead to the growth of Goss grains. Driving force for forming the Goss grains is concentrated shear strain on the surface layer. It has been verified that this novel process has a vast potential for making grain-oriented silicon steel by continuous process.",
    firstPage: "/images/papers/2023-na-mmi-first-page.jpg",
  },
];
