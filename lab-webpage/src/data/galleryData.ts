// 갤러리 목록. 맨 위가 최신. 사진은 public/images/ 에 넣고 경로를 적는다.
export interface GalleryItem {
  img: string;
  comments: string;
}

export const galleryData: GalleryItem[] = [
  {
    img: "/images/2026_RISE_1차년도_통합성과공유회.jpg",
    comments:
      "(Fev 2026)_2026 RISE Business Group 1st Integration Performance Sharing Meeting",
  },
  {
    img: "/images/2025_magnetic.jpg",
    comments: "(Nov 2025)_2025 KMS Winter Conference_Post Discussion",
  },
  {
    img: "/images/교양공모전.jpg",
    comments:
      "(Aug 2025)_Winner of the GES/UMS Excellence Award in the Liberal Arts Subject Contest",
  },
  {
    img: "/images/2025_Calphad 학회.jpg",
    comments:
      "(May 2025)_International Conference on Computer Coupling of Phase Diagrams and Thermochemistry",
  },
  {
    img: "/images/2025_pandat 미팅.jpg",
    comments: "(May 2025)_Pandat Software Workshop",
  },
  {
    img: "/images/pomia.jpg",
    comments: "(Fev 2025)_Technology Exchange Meeting with POMIA",
  },
  {
    img: "/images/CALPAD_PANDAT_seminar.jpg",
    comments: "(Jan 2025)_CALPAD Pandat Seminar",
  },
  {
    img: "/images/2024_magnetic.jpg",
    comments:
      "(Nov 2024)_2024 KMS Winter Conference_Soft Magentics Symposium",
  },
  {
    img: "/images/2024_openlab.jpg",
    comments: "(Nov 2024)_OPENLAB_Department of Materials System Engineering",
  },
  ];
