// 실험실 사진을 보고 상자와 원통으로 대략 쌓은 모형. 단위는 m, x 오른쪽, y 위, z 보는 사람 쪽.
// 앞벽과 오른쪽 벽은 잘라 내서 안이 보이게 했다.
import * as THREE from "three";
import type { RoomId } from "./data";

export type View = { t: [number, number, number]; az: number; el: number; dist: number };
export type Built = {
  group: THREE.Group;
  boxes: Record<string, THREE.Box3>;
  feet: Record<string, THREE.Box3>;
  views: Record<string, View>;
  overview: View;
  azRange: [number, number];
  tick?: (t: number) => void;
};
type V3 = [number, number, number];
type Opt = { opacity?: number; rough?: number; noShadow?: boolean };

// 같은 색 재질과 단위 도형을 나눠 써서 메모리를 아낀다
export class Kit {
  mats = new Map<string, THREE.MeshStandardMaterial>();
  geos: THREE.BufferGeometry[] = [];
  BOX = this.keep(new THREE.BoxGeometry(1, 1, 1));
  CYL = this.keep(new THREE.CylinderGeometry(1, 1, 1, 28));
  keep<T extends THREE.BufferGeometry>(g: T) {
    this.geos.push(g);
    return g;
  }
  mat(hex: string, o: Opt = {}) {
    const key = hex + "|" + (o.opacity ?? 1) + "|" + (o.rough ?? 0.85);
    let m = this.mats.get(key);
    if (!m) {
      m = new THREE.MeshStandardMaterial({ color: hex, roughness: o.rough ?? 0.85, metalness: 0 });
      if (o.opacity != null) {
        m.transparent = true;
        m.opacity = o.opacity;
        m.depthWrite = false;
      }
      this.mats.set(key, m);
    }
    return m;
  }
  mesh(p: THREE.Object3D, geo: THREE.BufferGeometry, hex: string, o: Opt = {}) {
    const m = new THREE.Mesh(geo, this.mat(hex, o));
    const shadow = !o.noShadow && o.opacity == null;  // taste-skill-ignore: 3D 조명 그림자(three.js), CSS 그림자 아님
    m.castShadow = shadow;
    m.receiveShadow = o.opacity == null;
    p.add(m);
    return m;
  }
  // 바닥 가운데 기준 상자: [x, 바닥 y, z]
  box(p: THREE.Object3D, s: V3, hex: string, at: V3, o: Opt = {}) {
    const m = this.mesh(p, this.BOX, hex, o);
    m.scale.set(s[0], s[1], s[2]);
    m.position.set(at[0], at[1] + s[1] / 2, at[2]);
    return m;
  }
  // 세운 원통은 바닥 기준, 눕힌 원통(x·z)은 가운데 기준
  cyl(p: THREE.Object3D, r: number, h: number, hex: string, at: V3, axis: "x" | "y" | "z" = "y", o: Opt = {}) {
    const m = this.mesh(p, this.CYL, hex, o);
    m.scale.set(r, h, r);
    if (axis === "y") m.position.set(at[0], at[1] + h / 2, at[2]);
    else {
      m.position.set(at[0], at[1], at[2]);
      if (axis === "x") m.rotation.z = Math.PI / 2;
      else m.rotation.x = Math.PI / 2;
    }
    return m;
  }
  dispose() {
    this.geos.forEach((g) => g.dispose());
    this.mats.forEach((m) => m.dispose());
  }
}

const C = {
  wall: "#f1f1ef",
  wallCut: "#d6d6d3",
  base: "#8d9093",
  epoxy: "#b3b6b8",
  steel: "#9a9ea2",
  alu: "#c9ccd0",
  white: "#f3f3f1",
  dark: "#2c2e30",
  black: "#1f2022",
  glass: "#cfe3ee",
  blue: "#2f62ae",
  green: "#2f7b4d",
  beige: "#ddd3bd",
};

function room(k: Kit, g: THREE.Group, W: number, D: number, H: number, floor: string) {
  const x0 = -W / 2,
    z0 = -D / 2;
  k.box(g, [W + 0.1, 0.14, D + 0.1], floor, [-0.05, -0.14, -0.05]);
  k.box(g, [W + 0.1, H, 0.1], C.wall, [-0.05, 0, z0 - 0.05]);
  k.box(g, [0.1, H, D], C.wall, [x0 - 0.05, 0, 0]);
  // 잘린 벽 윗면을 한 톤 어둡게 해 단면처럼 보이게 한다
  k.box(g, [W + 0.1, 0.012, 0.1], C.wallCut, [-0.05, H, z0 - 0.05], { noShadow: true });
  k.box(g, [0.1, 0.012, D], C.wallCut, [x0 - 0.05, H, 0], { noShadow: true });
  k.box(g, [W, 0.08, 0.012], C.base, [0, 0, z0 + 0.006]);
  k.box(g, [0.012, 0.08, D], C.base, [x0 + 0.006, 0, 0]);
}

function table(k: Kit, g: THREE.Object3D, cx: number, cz: number, w: number, d: number, h: number, top: string, leg = C.steel, topT = 0.04) {
  const lx = w / 2 - 0.05,
    lz = d / 2 - 0.05;
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) k.box(g, [0.05, h - topT, 0.05], leg, [cx + sx * lx, 0, cz + sz * lz]);
  k.box(g, [w, topT, d], top, [cx, h - topT, cz]);
}

function chair(k: Kit, g: THREE.Object3D, x: number, z: number, face: number) {
  const c = new THREE.Group();
  c.position.set(x, 0, z);
  c.rotation.y = face;
  for (let i = 0; i < 5; i++) {
    const s = k.box(c, [0.28, 0.03, 0.05], "#3a3c3f", [0, 0.04, 0]);
    s.rotation.y = (i * Math.PI * 2) / 5;
    s.position.x = Math.cos(-s.rotation.y) * 0.14;
    s.position.z = Math.sin(-s.rotation.y) * 0.14;
  }
  k.cyl(c, 0.025, 0.42, "#7d8185", [0, 0.07, 0]);
  k.cyl(c, 0.21, 0.07, "#2a2b2d", [0, 0.48, 0]);
  k.box(c, [0.38, 0.38, 0.05], "#2a2b2d", [0, 0.6, -0.2]);
  g.add(c);
}

function item(g: THREE.Group, items: Record<string, THREE.Group>, id: string) {
  const it = new THREE.Group();
  it.name = id;
  g.add(it);
  items[id] = it;
  return it;
}

// ── 재료 실험실 ─────────────────────────────────────────────
function materials(k: Kit): Built {
  const g = new THREE.Group();
  const items: Record<string, THREE.Group> = {};
  const W = 7,
    D = 5,
    H = 2.5,
    x0 = -3.5,
    z0 = -2.5;
  room(k, g, W, D, H, C.epoxy);

  // 왼쪽 벽 초록 문
  k.box(g, [0.03, 2.16, 1.07], "#dcdcda", [x0 + 0.015, 0, 1.75]);
  k.box(g, [0.04, 2.1, 0.95], C.green, [x0 + 0.03, 0, 1.75]);
  k.box(g, [0.045, 0.42, 0.26], C.glass, [x0 + 0.03, 1.3, 1.92]);
  k.box(g, [0.07, 0.03, 0.15], "#c4c7ca", [x0 + 0.07, 1.0, 1.42]);

  // 왼쪽 화강암 작업대 (철 프레임)
  const bx = x0 + 0.43,
    bz = -0.45,
    BL = 3.0,
    TOP = 0.85;
  for (const sz of [-1, 0, 1]) for (const sx of [-1, 1]) k.box(g, [0.05, 0.8, 0.05], C.steel, [bx + sx * 0.33, 0, bz + sz * (BL / 2 - 0.05)]);
  k.box(g, [0.7, 0.03, BL - 0.1], "#8a8e92", [bx, 0.15, bz]);
  k.box(g, [0.04, 0.05, BL], C.steel, [bx + 0.33, 0.74, bz]);
  k.box(g, [0.78, 0.05, BL + 0.02], "#55585b", [bx, 0.8, bz], { rough: 0.6 });

  // 박스 열처리로 두 대
  const box = item(g, items, "box");
  for (const zc of [-1.62, -1.1]) {
    k.box(box, [0.5, 0.52, 0.46], C.beige, [-3.1, TOP, zc]);
    k.box(box, [0.02, 0.32, 0.36], "#cbbfa5", [-2.84, TOP + 0.15, zc]);
    k.box(box, [0.02, 0.09, 0.4], C.dark, [-2.84, TOP + 0.02, zc]);
    k.box(box, [0.035, 0.03, 0.2], "#b9bcbf", [-2.82, TOP + 0.4, zc]);
    k.cyl(box, 0.025, 0.07, "#8e9296", [-3.2, TOP + 0.52, zc]);
  }

  // 자동 연마기
  const pol = item(g, items, "polish");
  k.box(pol, [0.55, 0.28, 0.55], "#d9dbdd", [-3.12, TOP, -0.38]);
  k.box(pol, [0.02, 0.12, 0.4], C.dark, [-2.84, TOP + 0.06, -0.38]);
  k.cyl(pol, 0.2, 0.07, "#34373a", [-3.06, TOP + 0.28, -0.38]);
  k.cyl(pol, 0.165, 0.075, "#8a8f93", [-3.06, TOP + 0.28, -0.38]);
  k.box(pol, [0.11, 0.48, 0.12], "#d9dbdd", [-3.33, TOP + 0.28, -0.38]);
  k.box(pol, [0.36, 0.09, 0.12], "#d9dbdd", [-3.18, TOP + 0.7, -0.38]);
  k.cyl(pol, 0.065, 0.16, "#b9bdc1", [-3.04, TOP + 0.54, -0.38]);

  // 마운팅 프레스
  const prs = item(g, items, "press");
  k.box(prs, [0.4, 0.5, 0.36], "#5e6266", [-3.12, TOP, 0.18]);
  k.cyl(prs, 0.085, 0.09, "#c4c7ca", [-3.12, TOP + 0.5, 0.18]);
  k.box(prs, [0.02, 0.18, 0.26], C.dark, [-2.91, TOP + 0.22, 0.18]);
  k.box(prs, [0.025, 0.03, 0.03], "#4fbf73", [-2.9, TOP + 0.33, 0.25]);

  // Mini SEM
  const sem = item(g, items, "sem");
  k.box(sem, [0.55, 0.42, 0.36], C.white, [-3.1, TOP, 0.72]);
  k.box(sem, [0.56, 0.04, 0.37], C.dark, [-3.1, TOP + 0.3, 0.72]);
  k.box(sem, [0.04, 0.16, 0.24], "#9aa0a6", [-2.81, TOP + 0.06, 0.72]);
  k.cyl(sem, 0.075, 0.17, "#b9bdc1", [-3.14, TOP + 0.42, 0.72]);

  // 흄후드 + 전해 연마기
  const hood = item(g, items, "hood");
  const hx = -1.7,
    hz = z0 + 0.425;
  k.box(hood, [1.5, 0.82, 0.8], "#e9e9e7", [hx, 0, hz + 0.02]);
  k.box(hood, [0.006, 0.6, 0.004], "#b5b7b9", [hx, 0.12, hz + 0.423]);
  k.box(hood, [1.5, 0.05, 0.85], "#3c3f42", [hx, 0.82, hz]);
  for (const s of [-1, 1]) k.box(hood, [0.1, 1.0, 0.85], "#ececea", [hx + s * 0.7, 0.87, hz]);
  k.box(hood, [1.3, 1.0, 0.03], "#cfd1d3", [hx, 0.87, z0 + 0.02]);
  k.box(hood, [1.5, 0.45, 0.85], "#ececea", [hx, 1.87, hz]);
  k.box(hood, [0.26, 0.08, 0.01], "#263238", [hx + 0.45, 2.05, hz + 0.43]);
  k.box(hood, [1.3, 0.04, 0.03], "#9da2a6", [hx, 1.34, hz + 0.4]);
  k.box(hood, [1.3, 0.5, 0.015], C.glass, [hx, 1.37, hz + 0.4], { opacity: 0.32 });
  k.cyl(hood, 0.13, H - 2.32, "#d4d6d8", [hx, 2.32, hz - 0.1]);
  k.box(hood, [0.32, 0.22, 0.28], "#8f9599", [hx - 0.25, 0.87, hz - 0.08]);
  k.box(hood, [0.2, 0.06, 0.01], "#33373b", [hx - 0.25, 0.95, hz + 0.065]);
  k.cyl(hood, 0.075, 0.13, "#e6f0f3", [hx + 0.17, 0.87, hz - 0.05], "y", { opacity: 0.5 });
  k.box(hood, [0.03, 0.3, 0.03], "#8f9599", [hx + 0.02, 1.09, hz - 0.12]);
  k.box(hood, [0.2, 0.03, 0.03], "#8f9599", [hx + 0.1, 1.36, hz - 0.12]);

  // 파란 시약장
  const chem = item(g, items, "chem");
  k.box(chem, [0.9, 1.85, 0.5], C.blue, [-0.3, 0, z0 + 0.25]);
  k.box(chem, [0.008, 1.72, 0.004], "#1d3f74", [-0.3, 0.06, z0 + 0.502]);
  for (const s of [-1, 1]) k.box(chem, [0.022, 0.14, 0.02], "#c4c7ca", [-0.3 + s * 0.04, 0.95, z0 + 0.51]);
  k.box(chem, [0.13, 0.13, 0.004], "#f2c230", [-0.58, 1.5, z0 + 0.502]);
  k.cyl(chem, 0.04, 0.08, "#9aa0a6", [-0.05, 1.85, z0 + 0.25]);

  // 창문
  k.box(g, [1.86, 1.26, 0.04], "#d8dadc", [1.45, 0.92, z0 + 0.02]);
  k.box(g, [1.72, 1.12, 0.046], "#b9d3e6", [1.45, 0.99, z0 + 0.023], { rough: 0.3 });
  k.box(g, [0.04, 1.12, 0.05], "#d8dadc", [1.45, 0.99, z0 + 0.025]);
  k.box(g, [1.94, 0.04, 0.12], "#d8dadc", [1.45, 0.88, z0 + 0.06]);

  // 검은 장
  k.box(g, [0.8, 1.2, 0.5], "#2b2c2e", [2.95, 0, z0 + 0.25]);
  k.box(g, [0.006, 1.1, 0.004], "#454749", [2.95, 0.05, z0 + 0.502]);

  // 관상 가스 열처리로 (알루미늄 함 위 파랑·흰 노, 석영관, 플랜지, 로드락 레일)
  const tube = item(g, items, "tube");
  const tx = 2.85,
    tc = -0.35,
    ty = 1.1;
  k.box(tube, [0.7, 0.85, 2.2], C.alu, [tx, 0, tc]);
  for (const zz of [-0.9, 0.2]) k.box(tube, [0.01, 0.6, 0.95], "#b3b7bb", [tx + 0.355, 0.12, tc + zz + 0.35]);
  k.box(tube, [0.02, 0.24, 0.4], C.dark, [tx + 0.36, 0.5, tc]);
  k.box(tube, [0.72, 0.03, 2.22], "#a9adb1", [tx, 0.85, tc]);
  k.box(tube, [0.5, 0.22, 0.6], "#f1f1f1", [tx, 0.88, tc]);
  k.box(tube, [0.5, 0.2, 0.6], C.blue, [tx, 1.1, tc]);
  k.box(tube, [0.52, 0.02, 0.62], "#c4c7ca", [tx, 1.095, tc]);
  k.cyl(tube, 0.045, 2.1, "#e6f0f3", [tx, ty, tc], "z", { opacity: 0.55 });
  for (const zz of [-1.05, 1.05]) {
    k.cyl(tube, 0.085, 0.05, "#b9bdc1", [tx, ty, tc + zz], "z");
    k.cyl(tube, 0.02, 0.09, "#b9bdc1", [tx, ty + 0.06, tc + zz]);
  }
  for (const zz of [-0.8, 0.8]) k.box(tube, [0.06, 0.2, 0.06], "#8f9498", [tx, 0.88, tc + zz]);
  for (const s of [-1, 1]) k.cyl(tube, 0.012, 0.7, "#c4c7ca", [tx + s * 0.07, ty, 1.05], "z");
  k.box(tube, [0.2, 0.07, 0.09], "#8f9498", [tx, ty - 0.035, 1.0]);
  k.box(tube, [0.22, 0.05, 0.05], "#8f9498", [tx, ty - 0.03, 1.4]);
  k.box(tube, [0.05, ty - 0.03, 0.05], C.steel, [tx, 0, 1.4]);

  // 질소 용기 + 호스
  const n2 = item(g, items, "n2");
  k.cyl(n2, 0.115, 1.38, "#8e9396", [3.26, 0, -1.78]);
  const dome = k.mesh(n2, k.keep(new THREE.CylinderGeometry(0.05, 0.115, 0.1, 28)), "#8e9396");
  dome.position.set(3.26, 1.43, -1.78);
  k.cyl(n2, 0.03, 0.08, "#c4c7ca", [3.26, 1.48, -1.78]);
  k.cyl(n2, 0.035, 0.03, "#e9eaeb", [3.21, 1.53, -1.78], "x");
  k.cyl(n2, 0.13, 0.03, "#5f6366", [3.26, 0.75, -1.78]);
  const hose = new THREE.CatmullRomCurve3(
    [
      [3.24, 1.56, -1.78],
      [3.1, 1.75, -1.7],
      [2.95, 1.4, -1.55],
      [tx, ty + 0.15, tc - 1.05],
    ].map((p) => new THREE.Vector3(p[0], p[1], p[2]))
  );
  k.mesh(n2, k.keep(new THREE.TubeGeometry(hose, 40, 0.008, 6)), "#2b2d30");

  // 압축기
  k.cyl(g, 0.15, 0.5, "#6b7075", [3.12, 0.2, 1.95], "z");
  k.box(g, [0.18, 0.16, 0.2], "#3a3d40", [3.12, 0.35, 1.95]);
  for (const zz of [-0.18, 0.18]) k.box(g, [0.22, 0.06, 0.04], "#3a3d40", [3.12, 0, 1.95 + zz]);

  // 3D 형상 측정기 · 모니터 · 저울 작업대
  const prof = item(g, items, "prof");
  const pz = 1.95,
    PT = 0.8;
  table(k, prof, 1.65, pz, 1.8, 0.7, PT, "#e8e8e6");
  k.box(prof, [0.45, 0.08, 0.4], "#3a3d40", [1.12, PT, pz]);
  k.box(prof, [0.25, 0.04, 0.25], "#9aa0a6", [1.12, PT + 0.08, pz - 0.03]);
  k.box(prof, [0.1, 0.6, 0.1], "#d8dadc", [1.12, PT + 0.08, pz + 0.15]);
  k.box(prof, [0.15, 0.22, 0.2], "#e9eaeb", [1.12, PT + 0.36, pz + 0.02]);
  k.cyl(prof, 0.03, 0.08, C.dark, [1.12, PT + 0.28, pz - 0.02]);
  k.box(prof, [0.18, 0.02, 0.14], C.dark, [1.78, PT, pz + 0.12]);
  k.box(prof, [0.04, 0.22, 0.03], C.dark, [1.78, PT + 0.02, pz + 0.14]);
  k.box(prof, [0.6, 0.36, 0.03], "#1e2023", [1.78, PT + 0.17, pz + 0.12]);
  k.box(prof, [0.56, 0.32, 0.005], "#3a5f86", [1.78, PT + 0.19, pz + 0.103], { noShadow: true });
  k.box(prof, [0.4, 0.015, 0.13], C.dark, [1.78, PT, pz - 0.15]);
  k.box(prof, [0.22, 0.08, 0.3], "#f0f0ee", [2.3, PT, pz]);
  k.box(prof, [0.2, 0.22, 0.2], C.glass, [2.3, PT + 0.08, pz - 0.03], { opacity: 0.3 });
  k.box(prof, [0.12, 0.03, 0.005], "#33373b", [2.3, PT + 0.03, pz - 0.152]);

  // 가운데 탁자와 아크릴 상자
  table(k, g, 0, 0.15, 1.8, 0.85, 0.75, "#e3e3e0");
  for (const [x, z, w, h, d] of [
    [-0.55, 0.12, 0.34, 0.22, 0.26],
    [-0.1, 0.25, 0.28, 0.18, 0.22],
    [0.4, 0.05, 0.3, 0.26, 0.3],
  ]) {
    k.box(g, [w, h, d], "#dfeef2", [x, 0.75, z], { opacity: 0.35 });
    k.box(g, [w * 0.4, 0.04, d * 0.4], "#6b7075", [x, 0.75, z]);
  }

  // 한가운데 협동 로봇: 가운데 탁자와 가스 열처리로 사이를 오간다
  const arm = item(g, items, "arm");
  const RX = 1.85,
    RZ = 0.45;
  const bot = cobot(k, arm, RX, RZ);
  const sample = k.box(arm, [0.05, 0.03, 0.05], "#7d8287", [0, 0, 0]);

  chair(k, g, -2.35, -0.4, -Math.PI / 2);
  chair(k, g, -0.15, 0.95, Math.PI);
  chair(k, g, 1.12, 1.2, 0);

  // 탁자 오른쪽 끝에서 시편을 집어 열처리로 로드락 받침에 놓는다. 12초에 한 번 돈다
  const T = bot.reach([0.8, 0.765, 0.2]),
    F = bot.reach([tx, ty + 0.05, 1.0]);
  const home: Pose = [(T[0] + F[0]) / 2, 0.55, 0.5, 0];
  const keys: [number, Pose][] = [
    [0, home],
    [1.6, [T[0], T[1], T[2] + 0.3, 0]],
    [2.6, [T[0], T[1], T[2], 0]],
    [3.2, [T[0], T[1], T[2], 1]],
    [4.2, [T[0], T[1], T[2] + 0.3, 1]],
    [6.4, [F[0], F[1], F[2] + 0.22, 1]],
    [7.4, [F[0], F[1], F[2], 1]],
    [8.0, [F[0], F[1], F[2], 0]],
    [9.0, [F[0], F[1], F[2] + 0.22, 0]],
    [12, home],
  ];
  const tmpV = new THREE.Vector3();
  const tick = (t: number) => {
    const c = t % 12;
    let j = 0;
    while (j < keys.length - 2 && c > keys[j + 1][0]) j++;
    const [t0, a] = keys[j],
      [t1, b] = keys[j + 1];
    const u = Math.min(1, Math.max(0, (c - t0) / (t1 - t0)));
    const e = u * u * (3 - 2 * u);
    const q = a.map((v, n) => v + (b[n] - v) * e) as Pose;
    bot.pose(q);
    // 쥔 동안에는 시편이 그리퍼 끝을 따라간다
    const held = q[3] > 0.5;
    if (held) {
      arm.updateMatrixWorld(true);
      bot.tip.getWorldPosition(tmpV);
      arm.worldToLocal(tmpV);
      sample.position.copy(tmpV);
    } else if (c >= 8) sample.position.set(tx, ty + 0.05, 1.0);
    else sample.position.set(0.8, 0.765, 0.2);
  };
  tick(0);

  return finish(g, items, {
    overview: { t: [0, 0.5, 0], az: 0.62, el: 0.62, dist: 14 },
    views: {
      arm: { t: [RX - 0.45, 1.0, RZ - 0.05], az: 0.78, el: 0.55, dist: 4.4 },
      box: { t: [-3.1, 1.1, -1.35], az: 1.15, el: 0.42, dist: 3.4 },
      polish: { t: [-3.1, 1.15, -0.38], az: 1.2, el: 0.45, dist: 2.9 },
      press: { t: [-3.1, 1.1, 0.18], az: 1.15, el: 0.42, dist: 2.7 },
      sem: { t: [-3.1, 1.05, 0.72], az: 1.0, el: 0.45, dist: 2.7 },
      hood: { t: [-1.7, 1.2, -2.0], az: 0.3, el: 0.3, dist: 4.7 },
      chem: { t: [-0.3, 1.0, -2.2], az: 0.35, el: 0.3, dist: 4.2 },
      tube: { t: [2.85, 0.9, -0.2], az: 1.3, el: 0.42, dist: 4.9 },
      n2: { t: [3.1, 1.0, -1.7], az: 0.75, el: 0.3, dist: 3.6 },
      prof: { t: [1.65, 1.0, 1.95], az: 0.35, el: 0.5, dist: 3.6 },
    },
    azRange: [-0.1, 1.55],
    tick,
  });
}

// ── 협동 로봇: 받침대 → 어깨 → 위팔 → 팔꿈치 → 아래팔 → 손목 → 그리퍼 ──
// 자세는 [방위각, 어깨에서 손목까지 수평 거리, 높이, 쥐기 0~1] 로 주고, 두 관절 각도는 역기구학으로 푼다
type Pose = [number, number, number, number];
function cobot(k: Kit, p: THREE.Object3D, x: number, z: number) {
  const L1 = 0.68,
    L2 = 0.62,
    DROP = 0.245; // 손목에서 두 손가락 사이(쥐는 점)까지
  const W1 = "#f4f4f2",
    RING = "#3a3c3f";
  // 알루미늄 받침대 (검은 판, 노란 비상 정지)
  const stand = new THREE.Group();
  stand.name = "foot";
  p.add(stand);
  const S = 0.6,
    SH = 0.72,
    P = 0.045;
  for (const sx of [-1, 1])
    for (const sz of [-1, 1]) k.box(stand, [P, SH, P], C.alu, [x + sx * (S / 2 - P / 2), 0, z + sz * (S / 2 - P / 2)], { rough: 0.5 });
  for (const y of [0.1, SH - P]) {
    for (const sz of [-1, 1]) k.box(stand, [S, P, P], C.alu, [x, y, z + sz * (S / 2 - P / 2)], { rough: 0.5 });
    for (const sx of [-1, 1]) k.box(stand, [P, P, S], C.alu, [x + sx * (S / 2 - P / 2), y, z], { rough: 0.5 });
  }
  k.box(stand, [S - 0.02, 0.02, S - 0.02], C.black, [x, SH, z]);
  for (const sx of [-1, 1]) k.box(stand, [0.01, SH - 0.2, S - 0.08], "#2a2b2d", [x + sx * (S / 2 - 0.025), 0.14, z]);
  k.box(stand, [S - 0.08, SH - 0.2, 0.01], "#2a2b2d", [x, 0.14, z - S / 2 + 0.025]);
  k.box(stand, [0.09, 0.07, 0.09], "#f2c230", [x + 0.22, SH + 0.02, z + 0.22]);
  k.cyl(stand, 0.03, 0.03, "#d23b3b", [x + 0.22, SH + 0.09, z + 0.22]);

  const base = new THREE.Group();
  base.position.set(x, SH + 0.02, z);
  p.add(base);
  k.cyl(base, 0.095, 0.07, W1, [0, 0, 0]);
  k.cyl(base, 0.097, 0.014, RING, [0, 0.07, 0]);
  const j0 = new THREE.Group();
  j0.position.y = 0.084;
  base.add(j0);
  k.cyl(j0, 0.075, 0.15, W1, [0, 0, 0]);
  const j1 = new THREE.Group();
  j1.position.y = 0.22;
  j0.add(j1);
  k.cyl(j1, 0.078, 0.19, W1, [0, 0, 0], "x");
  for (const s of [-1, 1]) k.cyl(j1, 0.06, 0.014, RING, [s * 0.098, 0, 0], "x");
  k.cyl(j1, 0.052, L1, W1, [0, 0, 0]);
  const j2 = new THREE.Group();
  j2.position.y = L1;
  j1.add(j2);
  k.cyl(j2, 0.062, 0.15, W1, [0, 0, 0], "x");
  for (const s of [-1, 1]) k.cyl(j2, 0.048, 0.014, RING, [s * 0.078, 0, 0], "x");
  k.cyl(j2, 0.043, L2, W1, [0, 0, 0]);
  const j3 = new THREE.Group();
  j3.position.y = L2;
  j2.add(j3);
  k.cyl(j3, 0.05, 0.12, W1, [0, 0, 0], "x");
  k.cyl(j3, 0.042, 0.13, W1, [0, 0, 0]);
  k.cyl(j3, 0.043, 0.014, RING, [0, 0.13, 0]);
  const grip = new THREE.Group();
  grip.position.y = 0.145;
  j3.add(grip);
  k.box(grip, [0.11, 0.07, 0.08], C.black, [0, 0, 0]);
  const fingers = [-1, 1].map((s) => k.box(grip, [0.018, 0.085, 0.04], C.black, [s * 0.04, 0.07, 0]));
  const tip = new THREE.Object3D();
  tip.position.y = DROP - 0.145;
  grip.add(tip);

  const shoulder = SH + 0.02 + 0.084 + 0.22;
  const clamp1 = (v: number) => Math.max(-1, Math.min(1, v));
  return {
    tip,
    // 그리퍼 끝을 놓을 점(월드 좌표) → [방위각, 수평 거리, 손목 높이]
    reach(at: [number, number, number]): [number, number, number] {
      const dx = at[0] - x,
        dz = at[2] - z;
      return [Math.atan2(dx, dz), Math.hypot(dx, dz), at[1] + DROP - shoulder];
    },
    pose([yaw, r, h, g]: Pose) {
      const d = Math.min(Math.hypot(r, h), L1 + L2 - 0.005);
      const phi = Math.atan2(r, h);
      const a = Math.acos(clamp1((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d)));
      const b = Math.acos(clamp1((d * d - L1 * L1 - L2 * L2) / (2 * L1 * L2)));
      j0.rotation.y = yaw;
      j1.rotation.x = phi - a;
      j2.rotation.x = b;
      j3.rotation.x = Math.PI - j1.rotation.x - b;
      const open = 0.018 * (1 - g);
      fingers[0].position.x = -0.03 - open;
      fingers[1].position.x = 0.03 + open;
    },
  };
}

function finish(
  g: THREE.Group,
  items: Record<string, THREE.Group>,
  v: { overview: View; views: Record<string, View>; azRange: [number, number]; tick?: (t: number) => void }
): Built {
  g.updateMatrixWorld(true);
  const boxes: Record<string, THREE.Box3> = {},
    feet: Record<string, THREE.Box3> = {};
  for (const id in items) {
    boxes[id] = new THREE.Box3().setFromObject(items[id]);
    // 바닥 표시는 "foot" 이름이 붙은 부분만 감싼다 (로봇처럼 팔이 넓게 뻗은 장비)
    const f = items[id].getObjectByName("foot");
    feet[id] = f ? new THREE.Box3().setFromObject(f) : boxes[id];
    items[id].traverse((o) => (o.userData.item = id));
  }
  return { group: g, boxes, feet, ...v };
}

const BUILDERS: Record<RoomId, (k: Kit) => Built> = { materials };
export function build(k: Kit, id: RoomId): Built {
  return BUILDERS[id](k);
}
