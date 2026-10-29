// 갤러리 목록. 맨 위가 최신. 사진은 public/images/ 에 넣고 경로를 적는다.
// 사진이 여러 장이면 imgs에 배열로 넣는다 (넘겨 보기 슬라이드로 표시)
export interface GalleryItem {
  img?: string;
  imgs?: string[];
  comments: string;
}

export const galleryData: GalleryItem[] = [
  {
    imgs: ["/images/2026_KIM_presentation_HJS.jpg", "/images/2026_KIM_award.jpg"],
    comments:
      "(Oct 2026)_2026 KIM Autumn Conference_4th Student Session_KIM Student of the Year 2026 (JunSeo Ha)",
  },
  {
    imgs: ["/images/2026_xEV_workshop_group.jpg", "/images/2026_xEV_workshop_session.jpg"],
    comments:
      "(Oct 2026)_1st-Year Progress Workshop for the National Project on 6.5% Si Wide Electrical Steel and xEV_Ulsan, Oct 21–22",
  },
  {
    img: "/images/2026_KSHT_award.jpg",
    comments:
      "(Oct 2026)_2026 KSHT Autumn Conference_Winner of the Excellent Paper Award (Jeong In-sang Award)",
  },
  {
    imgs: [
      "/images/2026_KSHT_group.jpg",
      "/images/2026_KSHT_poster_UMS.jpg",
      "/images/2026_KSHT_poster_SMS.jpg",
      "/images/2026_KSHT_poster_GES.jpg",
    ],
    comments: "(Oct 2026)_2026 KSHT Autumn Conference_Poster Presentation",
  },
  {
    img: "/images/2026_kickoff_meeting.jpg",
    comments:
      "(Jun 2026)_Kick-Off Meeting for the National Project on 6.5% Si Wide Electrical Steel and xEV Motor Development",
  },
  {
    img: "/images/2026_RISE_1차년도_통합성과공유회.jpg",
    comments:
      "(Feb 2026)_2026 RISE Business Group 1st Integration Performance Sharing Meeting",
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
    comments: "(Feb 2025)_Technology Exchange Meeting with POMIA",
  },
  {
    img: "/images/CALPAD_PANDAT_seminar.jpg",
    comments: "(Jan 2025)_CALPHAD Pandat Seminar",
  },
  {
    img: "/images/2024_magnetic.jpg",
    comments:
      "(Nov 2024)_2024 KMS Winter Conference_Soft Magnetics Symposium",
  },
  {
    img: "/images/2024_openlab.jpg",
    comments: "(Nov 2024)_OPENLAB_Department of Materials System Engineering",
  },
  ];
