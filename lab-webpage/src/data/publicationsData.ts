// 교수 페이지 "Recent Publications" 목록. 화면에 이 순서대로 표시된다.
export interface Publication {
  title: string;
  journal: string;
  year: string;
  metrics: string;
}

export const publicationsData: Publication[] = [
  {
    title:
      "Ultra-thin Fe-Si alloy sheet with excellent high frequency magnetic properties fabricated by partial decarburization combined with multi-stage cold rolling",
    journal: "SCRIPTA MATERIALIA",
    year: "2022",
    metrics: "JCR: 8.2%, IF: 6.3",
  },
  {
    title:
      "Gaussian process regression-based Bayesian optimization of the Insulation-coating process for silicon steel sheets",
    journal: "Journal of Materials and Research and Technology",
    year: "2022",
    metrics: "JCR: 9.4%, IF: 6.3",
  },
  {
    title:
      "Formation mechanism of texture in ultra-thin Fe-Si alloy sheet with excellent medium frequency magnetic properties fabricated by multi-stage decarburizing and cold rolling",
    journal: "Material Characterization",
    year: "2023",
    metrics: "JCR: 13.3%, IF: 4.5",
  },
  {
    title:
      "Novel process for the formation of Goss Grains by Concentrated Shear Strain on Surface in Inhibitor-Free Silicon Steel",
    journal: "METALS AND MATERIALS INTERNATIONAL",
    year: "2023",
    metrics: "JCR:24.7%, IF: 3.7",
  },
  {
    title:
      "Thin Fe-Si-Al alloy sheet fabricated using Al gradient diffusion through physical vapor deposition for excellent high-frequency magnetic properties",
    journal: "Materials Today Communication",
    year: "2023",
    metrics: "JCR:52%, IF: 3.4",
  },
];
