// 구성원 목록. 재학생은 members, 졸업생은 alumni에 넣는다.
// 사진이 없으면 profileImg를 "/images/default_profile.svg"로 둔다.
export interface Member {
  name: string;
  profileImg: string;
  edu: string;
  major: string;
  email?: string;
}

export interface Alumnus {
  name: string;
  edu: string;
  graduated: string;
}

export const members: Member[] = [
  {
    name: "Ha Jun Seo(하준서)",
    profileImg: "/images/HJS_profile.jpg",
    edu: "Combined B.S./M.S.",
    major: "Department of Materials System Engineering",
    email: "hjs081435@pukyong.ac.kr",
  },
  {
    name: "Go Eun Su(고은수)",
    profileImg: "/images/GES_profile.jpg",
    edu: "Combined B.S./M.S.",
    major: "Department of Materials System Engineering",
    email: "esko8119@naver.com",
  },
  {
    name: "Yu Min Sang(유민상)",
    profileImg: "/images/UMS_profile.png",
    edu: "Combined B.S./M.S.",
    major: "Department of Materials System Engineering",
    email: "poi4064@naver.com",
  },
  {
    name: "Sung Min Su(성민수)",
    profileImg: "/images/SMS_profile.jpg",
    edu: "Combined B.S./M.S.",
    major: "Department of Metallurgical Engineering",
    email: "a71108@naver.com",
  },
  {
    name: "Shin Ji Eun(신지은)",
    profileImg: "/images/default_profile.svg",
    edu: "Undergraduate Researcher (3rd year)",
    major: "Department of Materials System Engineering",
  },
];

export const alumni: Alumnus[] = [
  {
    name: "Kim Hyeon A(김현아)",
    edu: "Combined B.S./M.S.",
    graduated: "2026",
  },
  {
    name: "Oh Ji Eun(오지은)",
    edu: "Combined B.S./M.S.",
    graduated: "2026",
  },
];
