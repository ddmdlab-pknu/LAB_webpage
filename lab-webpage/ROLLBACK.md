# 홈페이지 디자인 되돌리기

2026년 10월 리뉴얼(copper 디자인) 뒤 예전 화면으로 돌아가는 방법입니다.
위에서부터 쉬운 순서입니다.

## 1. 디자인 스위치 (권장, 1~2분)

`lab-webpage/src/siteDesign.ts` 파일의 마지막 줄을 바꿉니다.

```ts
export const SITE_DESIGN: SiteDesign = "classic"; // 예전 화면
export const SITE_DESIGN: SiteDesign = "copper";  // 새 화면
```

GitHub 웹에서 파일을 열고 연필(Edit) 버튼 → 값 수정 → Commit changes 를 누르면,
Vercel이 1~2분 안에 다시 배포합니다.

- 뉴스·논문·갤러리·구성원 데이터(`src/data/`)는 두 디자인이 같이 씁니다.
  되돌려도 그사이 올린 소식은 그대로 남습니다.
- 예전 화면 코드(`src/main`, `src/about`, `src/project` 등)는 지우지 않고 그대로 두었습니다.
- 새 화면 코드는 `src/copper/` 폴더에만 있습니다.

## 2. Vercel 즉시 롤백 (긴급할 때)

Vercel 대시보드 → lab-webpage → Deployments 에서 직전 운영 배포의 메뉴(…) → Instant Rollback.
무료(Hobby) 요금제는 **바로 직전 운영 배포 하나**로만 돌아갈 수 있습니다.
매주 자동 업데이트가 배포되면 리뉴얼 전 배포는 더 이상 고를 수 없으므로 1번 방법을 쓰세요.

## 3. 보관 브랜치 `classic`

리뉴얼 직전 운영 코드(main 9be5da0)를 `classic` 브랜치에 그대로 보관했습니다.
이 브랜치에는 새 작업을 올리지 않습니다.

- 미리보기: https://lab-webpage-git-classic-labnotebook1001.vercel.app (Vercel 로그인 필요)
- 코드 전체를 예전으로 되돌려야 할 때만 참고합니다. 이때 그 뒤에 올린 소식은 다시 넣어야 합니다.
