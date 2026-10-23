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
  "Materials Today Communications": "4.9",
  "Korean Journal of Metals and Materials": "1.4",
  "Journal of Magnetics": "0.6",
};

// 같은 연도 안에서는 배열 순서대로 표시됨 (최신 논문을 위에)
export const publicationsData: PublicationItem[] = [
  // 2026
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
];
