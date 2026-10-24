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
  k.box(tube, [0.2, 0.07, 0.09], "#8f9498", [tx, ty - 0.035, 1.12]);
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
  table(k, g, -0.4, 0.15, 1.8, 0.85, 0.75, "#e3e3e0");
  for (const [x, z, w, h, d] of [
    [-0.95, 0.12, 0.34, 0.22, 0.26],
    [-0.5, 0.25, 0.28, 0.18, 0.22],
    [0.05, 0.05, 0.3, 0.26, 0.3],
  ]) {
    k.box(g, [w, h, d], "#dfeef2", [x, 0.75, z], { opacity: 0.35 });
    k.box(g, [w * 0.4, 0.04, d * 0.4], "#6b7075", [x, 0.75, z]);
  }

  chair(k, g, -2.35, -0.4, -Math.PI / 2);
  chair(k, g, -0.55, 0.95, Math.PI);
  chair(k, g, 1.7, 1.25, 0);

  return finish(g, items, {
    overview: { t: [0, 0.5, 0], az: 0.62, el: 0.62, dist: 14 },
    views: {
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
  });
}

// ── 로봇 작업대 ─────────────────────────────────────────────
function robot(k: Kit): Built {
  const g = new THREE.Group();
  const items: Record<string, THREE.Group> = {};
  const W = 4.4,
    D = 3.6,
    H = 2.5,
    x0 = -2.2,
    z0 = -1.8;
  room(k, g, W, D, H, "#6f7684");
  // 줄무늬 벽지
  for (let x = x0 + 0.25; x < W / 2; x += 0.5) k.box(g, [0.16, H - 0.1, 0.004], "#e3e3e1", [x, 0.08, z0 + 0.002], { noShadow: true });
  for (let z = z0 + 0.25; z < D / 2; z += 0.5) k.box(g, [0.004, H - 0.1, 0.16], "#e3e3e1", [x0 + 0.002, 0.08, z], { noShadow: true });
  // 카펫 타일 이음
  for (let x = x0 + 0.6; x < W / 2; x += 0.6) k.box(g, [0.006, 0.002, D], "#656c79", [x, 0, 0], { noShadow: true });
  for (let z = z0 + 0.6; z < D / 2; z += 0.6) k.box(g, [W, 0.002, 0.006], "#656c79", [0, 0, z], { noShadow: true });

  // 알루미늄 프레임 작업대
  const bench = item(g, items, "bench");
  const cx = -0.2,
    cz = -0.45,
    TW = 1.3,
    TD = 0.85,
    TT = 0.8,
    P = 0.045;
  for (const sx of [-1, 1])
    for (const sz of [-1, 1]) {
      k.box(bench, [P, TT - 0.02, P], C.alu, [cx + sx * (TW / 2 - P / 2), 0, cz + sz * (TD / 2 - P / 2)], { rough: 0.5 });
      k.cyl(bench, 0.025, 0.03, C.dark, [cx + sx * (TW / 2 - P / 2), -0.0, cz + sz * (TD / 2 - P / 2)]);
    }
  for (const y of [0.12, TT - 0.065]) {
    for (const sz of [-1, 1]) k.box(bench, [TW, P, P], C.alu, [cx, y, cz + sz * (TD / 2 - P / 2)], { rough: 0.5 });
    for (const sx of [-1, 1]) k.box(bench, [P, P, TD], C.alu, [cx + sx * (TW / 2 - P / 2), y, cz], { rough: 0.5 });
  }
  k.box(bench, [TW - 0.04, 0.02, TD - 0.04], C.black, [cx, TT - 0.02, cz]);
  k.box(bench, [TW - 0.08, 0.015, TD - 0.08], C.black, [cx, 0.165, cz]);
  for (const sx of [-1, 1]) k.box(bench, [0.01, 0.5, TD - 0.1], "#2a2b2d", [cx + sx * (TW / 2 - 0.03), 0.18, cz]);
  k.box(bench, [0.09, 0.07, 0.09], "#f2c230", [cx + 0.52, TT, cz + 0.32]);
  k.cyl(bench, 0.03, 0.03, "#d23b3b", [cx + 0.52, TT + 0.07, cz + 0.32]);

  // 협동 로봇 팔: 받침 → 어깨 → 위팔 → 팔꿈치 → 아래팔 → 손목 → 그리퍼
  const arm = item(g, items, "arm");
  const W1 = "#f4f4f2",
    RING = "#3a3c3f";
  const base = new THREE.Group();
  base.position.set(cx - 0.25, TT, cz - 0.2);
  arm.add(base);
  k.cyl(base, 0.08, 0.06, W1, [0, 0, 0]).name = "foot";
  k.cyl(base, 0.081, 0.012, RING, [0, 0.06, 0]);
  const j0 = new THREE.Group();
  j0.position.y = 0.072;
  base.add(j0);
  k.cyl(j0, 0.062, 0.13, W1, [0, 0, 0]);
  const j1 = new THREE.Group();
  j1.position.y = 0.19;
  j0.add(j1);
  k.cyl(j1, 0.065, 0.16, W1, [0, 0, 0], "x");
  for (const s of [-1, 1]) k.cyl(j1, 0.05, 0.012, RING, [s * 0.082, 0, 0], "x");
  k.cyl(j1, 0.043, 0.42, W1, [0, 0, 0]);
  const j2 = new THREE.Group();
  j2.position.y = 0.42;
  j1.add(j2);
  k.cyl(j2, 0.052, 0.13, W1, [0, 0, 0], "x");
  for (const s of [-1, 1]) k.cyl(j2, 0.04, 0.012, RING, [s * 0.068, 0, 0], "x");
  k.cyl(j2, 0.036, 0.38, W1, [0, 0, 0]);
  const j3 = new THREE.Group();
  j3.position.y = 0.38;
  j2.add(j3);
  k.cyl(j3, 0.042, 0.11, W1, [0, 0, 0], "x");
  k.cyl(j3, 0.035, 0.1, W1, [0, 0, 0]);
  k.cyl(j3, 0.036, 0.012, RING, [0, 0.1, 0]);
  const grip = new THREE.Group();
  grip.position.y = 0.11;
  j3.add(grip);
  k.box(grip, [0.09, 0.06, 0.07], C.black, [0, 0, 0]);
  const fingers = [-1, 1].map((s) => k.box(grip, [0.016, 0.075, 0.035], C.black, [s * 0.032, 0.06, 0]));

  // 작업대 위 물체: 블록, 바구니, 고기·생선 인형
  const obj = item(g, items, "obj");
  const bk = [cx + 0.35, TT, cz - 0.15];
  k.box(obj, [0.34, 0.012, 0.25], "#efe5cc", [bk[0], bk[1], bk[2]]);
  for (const s of [-1, 1]) {
    k.box(obj, [0.34, 0.13, 0.012], "#efe5cc", [bk[0], bk[1], bk[2] + s * 0.119]);
    k.box(obj, [0.012, 0.13, 0.25], "#efe5cc", [bk[0] + s * 0.164, bk[1], bk[2]]);
  }
  const blocks: [number, number, string][] = [
    [-0.55, 0.05, "#3c6fd1"],
    [-0.45, 0.12, "#3da66b"],
    [-0.36, 0.02, "#3c6fd1"],
    [-0.5, -0.06, "#3da66b"],
    [-0.28, 0.16, "#3c6fd1"],
  ];
  for (const [bx2, bz2, col] of blocks) {
    const b = k.box(obj, [0.05, 0.05, 0.05], col, [cx + bx2 + 0.3, TT, cz + bz2 + 0.1]);
    b.rotation.y = bx2 * 7;
  }
  const meat = k.mesh(obj, k.keep(new THREE.CapsuleGeometry(0.04, 0.08, 6, 14)), "#c95b5f");
  meat.rotation.z = Math.PI / 2;
  meat.scale.set(1, 1, 0.55);
  meat.position.set(cx + 0.05, TT + 0.025, cz + 0.22);
  const fish = k.mesh(obj, k.keep(new THREE.CapsuleGeometry(0.035, 0.12, 6, 14)), "#6f9fcc");
  fish.rotation.z = Math.PI / 2;
  fish.rotation.y = 0.5;
  fish.scale.set(1, 1, 0.6);
  fish.position.set(cx + 0.3, TT + 0.022, cz + 0.27);
  const tail = k.mesh(obj, k.keep(new THREE.ConeGeometry(0.04, 0.06, 4)), "#6f9fcc");
  tail.rotation.z = Math.PI / 2;
  tail.position.set(cx + 0.21, TT + 0.022, cz + 0.32);

  // 옆 책상의 노트북 · 태블릿
  const pc = item(g, items, "pc");
  const dx = 1.35,
    dz = 0.35,
    DT = 0.74;
  table(k, pc, dx, dz, 1.0, 0.6, DT, "#e8e8e6");
  k.box(pc, [0.34, 0.02, 0.24], "#3b3e42", [dx - 0.15, DT, dz + 0.04]);
  const lid = new THREE.Group();
  lid.position.set(dx - 0.15, DT + 0.02, dz - 0.08);
  lid.rotation.x = -0.28;
  pc.add(lid);
  k.box(lid, [0.34, 0.23, 0.012], "#3b3e42", [0, 0, 0]);
  k.box(lid, [0.31, 0.2, 0.004], "#4a6f95", [0, 0.015, 0.008], { noShadow: true });
  k.box(pc, [0.25, 0.012, 0.17], "#1c1d1f", [dx + 0.27, DT, dz + 0.05]);
  chair(k, g, dx - 0.1, dz + 0.65, Math.PI);

  // 팔이 블록과 바구니 사이를 천천히 오간다
  const tick = (t: number) => {
    const s = Math.sin(t * 0.55);
    j0.rotation.y = 0.35 + 0.75 * s;
    j1.rotation.x = 0.55 + 0.12 * Math.sin(t * 1.1);
    j2.rotation.x = 1.5 + 0.22 * Math.sin(t * 1.1 + 0.6);
    j3.rotation.x = Math.PI - j1.rotation.x - j2.rotation.x;
    const open = 0.012 * (1 + Math.sin(t * 1.1 + 1.2));
    fingers[0].position.x = -0.026 - open;
    fingers[1].position.x = 0.026 + open;
  };
  tick(0);

  return finish(g, items, {
    overview: { t: [0, 0.5, -0.1], az: 0.6, el: 0.6, dist: 9.4 },
    views: {
      arm: { t: [cx - 0.1, 1.15, cz - 0.1], az: 0.55, el: 0.35, dist: 2.7 },
      bench: { t: [cx, 0.6, cz], az: 0.5, el: 0.42, dist: 3.6 },
      obj: { t: [cx + 0.05, TT + 0.05, cz + 0.05], az: 0.35, el: 0.75, dist: 2.1 },
      pc: { t: [dx, 0.85, dz], az: 0.75, el: 0.6, dist: 2.6 },
    },
    azRange: [-0.1, 1.55],
    tick,
  });
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
    // 바닥 표시는 "foot" 이름이 붙은 부분만 감싼다 (로봇 팔처럼 팔이 넓게 뻗은 장비)
    const f = items[id].getObjectByName("foot");
    feet[id] = f ? new THREE.Box3().setFromObject(f) : boxes[id];
    items[id].traverse((o) => (o.userData.item = id));
  }
  return { group: g, boxes, feet, ...v };
}

export function build(k: Kit, id: RoomId): Built {
  return id === "robot" ? robot(k) : materials(k);
}
