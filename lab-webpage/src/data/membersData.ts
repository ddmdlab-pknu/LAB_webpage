// 구성원 목록. 탭(Master Course / Undergraduate / Alumni)별로 배열에 넣는다.
// 졸업생은 alumni로 옮기고 이메일은 넣지 않는다(공개 사이트).
export interface Member {
  name: string;
  profileImg: string;
  edu: string;
  major: string;
  email?: string;
}

export const masters: Member[] = [
  {
    name: "Ha Jun Seo(하준서)",
    profileImg: "/images/HJS_profile_2026.jpg",
    edu: "Combined B.S./M.S.",
    major: "Department of Materials System Engineering",
    email: "hjs081435@pukyong.ac.kr",
  },
  {
    name: "Go Eun Su(고은수)",
    profileImg: "/images/GES_profile_2026.jpg",
    edu: "Combined B.S./M.S.",
    major: "Department of Materials System Engineering",
    email: "esko8119@naver.com",
  },
  {
    name: "Yu Min Sang(유민상)",
    profileImg: "/images/UMS_profile_2026.jpg",
    edu: "Combined B.S./M.S.",
    major: "Department of Materials System Engineering",
    email: "poi4064@naver.com",
  },
  {
    name: "Sung Min Su(성민수)",
    profileImg: "/images/SMS_profile_2026.jpg",
    edu: "Combined B.S./M.S.",
    major: "Department of Metallurgical Engineering",
    email: "a71108@naver.com",
  },
];

// 학부 연구생
export const undergraduates: Member[] = [
  {
    name: "Shin Ji Won(신지원)",
    profileImg: "/images/SJW_profile.jpg",
    edu: "Undergraduate",
    major: "Department of Metallurgical Engineering",
    email: "jiwon574@pukyong.ac.kr",
  },
];

export const alumni: Member[] = [
  {
    name: "Kim Hyeon A(김현아)",
    profileImg: "/images/KHA_profile.jpg",
    edu: "",
    major: "Department of Materials System Engineering",
  },
  {
    name: "Oh Ji Eun(오지은)",
    profileImg: "/images/OJE_profile.jpg",
    edu: "",
    major: "Department of Materials System Engineering",
  },
];
