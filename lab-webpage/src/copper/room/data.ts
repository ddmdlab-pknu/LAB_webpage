// 실험실 입체 모형에 나오는 방과 장비 이름. three.js 없이 목록을 바로 그릴 수 있게 따로 둔다.
export type RoomId = "materials" | "robot";
export type RoomItem = { id: string; name: string; desc: string };
export type Room = { id: RoomId; label: string; alt: string; poster: string; items: RoomItem[] };

export const ROOMS: Room[] = [
  {
    id: "materials",
    label: "재료 실험실",
    alt: "재료 실험실 입체 모형. 왼쪽 벽 작업대에 열처리로, 연마기, 마운팅 프레스, Mini SEM이 있고, 안쪽 벽에 흄후드와 파란 시약장, 오른쪽에 관상 가스 열처리로와 질소 용기가 있습니다.",
    poster: "/images/copper/lab3d-materials.jpg",
    items: [
      { id: "box", name: "박스 열처리로", desc: "시편을 공기 중에서 가열합니다." },
      { id: "polish", name: "자동 연마기", desc: "시편 표면을 갈아 관찰할 면을 만듭니다." },
      { id: "press", name: "마운팅 프레스", desc: "작은 시편을 수지에 묻어 손에 잡히게 고정합니다." },
      { id: "sem", name: "Mini SEM", desc: "전자현미경으로 미세조직을 봅니다." },
      { id: "hood", name: "흄후드 · 전해 연마기", desc: "산 용액을 다루는 배기 작업대. 안에서 시편을 전해 연마합니다." },
      { id: "chem", name: "시약장", desc: "산과 용매를 따로 보관하는 파란 장입니다." },
      { id: "tube", name: "관상 가스 열처리로", desc: "석영관 안에 가스를 흘리며 탈탄·확산 열처리를 합니다." },
      { id: "n2", name: "질소 가스", desc: "열처리로에 넣는 분위기 가스 용기입니다." },
      { id: "prof", name: "3D 형상 측정기 · 저울", desc: "표면 높낮이를 재고, 시편 무게를 답니다." },
    ],
  },
  {
    id: "robot",
    label: "로봇 작업대",
    alt: "로봇 작업대 입체 모형. 카펫 바닥 위 알루미늄 프레임 작업대에 흰 로봇 팔이 있고, 작업대 위에 블록과 바구니, 오른쪽 책상에 노트북과 태블릿이 있습니다.",
    poster: "/images/copper/lab3d-robot.jpg",
    items: [
      { id: "arm", name: "협동 로봇 팔", desc: "흰 로봇 팔 끝에 검은 그리퍼를 달았습니다." },
      { id: "bench", name: "알루미늄 작업대", desc: "검은 판을 끼운 프레임 작업대. 앞쪽에 노란 비상 정지 스위치가 있습니다." },
      { id: "obj", name: "작업대 위 물체", desc: "파랑·초록 블록, 바구니, 고기와 생선 모양 인형." },
      { id: "pc", name: "노트북 · 태블릿", desc: "옆 책상에 둔 노트북과 태블릿입니다." },
    ],
  },
];

export const roomById = (id: RoomId) => ROOMS.find((r) => r.id === id) || ROOMS[0];
