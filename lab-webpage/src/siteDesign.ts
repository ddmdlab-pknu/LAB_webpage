// 홈페이지 디자인 선택 스위치
//
// "copper"  : 2026년 10월 리뉴얼 디자인 (밝은 바탕, 구리색 선)
// "classic" : 리뉴얼 전 디자인
//
// 예전 화면으로 되돌리려면 아래 값을 "classic"으로 바꾸고 저장(커밋)하세요.
// Vercel이 1~2분 안에 다시 배포합니다. 뉴스·논문·갤러리 데이터(src/data)는
// 두 디자인이 같이 쓰므로 바꿔도 데이터는 그대로 유지됩니다.
// 자세한 방법: lab-webpage/ROLLBACK.md
export type SiteDesign = "copper" | "classic";

export const SITE_DESIGN: SiteDesign = "copper";
