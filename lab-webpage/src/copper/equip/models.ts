// 장비 사진을 보고 상자·원통으로 대략 만든 모형. 단위 m, x 오른쪽, y 위, z 앞(보는 사람 쪽). 바닥 가운데가 원점.
import * as THREE from "three";
import { Kit, Opt, V3 } from "../room/kit";

export type EquipId = "sem" | "electro" | "polish" | "press" | "om" | "gas" | "box" | "ct" | "utm" | "defect" | "prof";

const C = {
  black: "#1d1e20",
  dark: "#2b2d30",
  steel: "#b9bdc2",
  steel2: "#9da2a7",
  alu: "#c9ccd0",
  white: "#f2f2f0",
  glass: "#cfe3ee",
  navy: "#2e4a85",
  blue: "#2f62ae",
  red: "#d23b3b",
  yellow: "#f2c230",
  screen: "#2b3340",
};

// 화강암 작업대 무늬 (점 찍은 회색)
let graniteTex: THREE.CanvasTexture | null = null;
function granite(k: Kit) {
  const key = "granite";
  let m = k.mats.get(key);
  if (m) return m;
  if (!graniteTex) {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const g = c.getContext("2d")!;
    g.fillStyle = "#b9b9b7";
    g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 5200; i++) {
      const v = Math.random();
      g.fillStyle = v < 0.45 ? "#8a8a88" : v < 0.8 ? "#d8d8d6" : "#5f5f5e";
      const s = 1 + Math.random() * 2.4;
      g.fillRect(Math.random() * 256, Math.random() * 256, s, s);
    }
    graniteTex = new THREE.CanvasTexture(c);
    graniteTex.wrapS = graniteTex.wrapT = THREE.RepeatWrapping;
    graniteTex.repeat.set(2, 2);
    graniteTex.colorSpace = THREE.SRGBColorSpace;
  }
  m = new THREE.MeshStandardMaterial({ map: graniteTex, roughness: 0.6 });
  k.mats.set(key, m);
  return m;
}
function slab(k: Kit, g: THREE.Object3D, w: number, d: number, t = 0.04, color?: string) {
  const m = new THREE.Mesh(k.BOX, color ? k.mat(color) : granite(k));
  m.scale.set(w, t, d);
  m.position.set(0, t / 2, 0);
  m.receiveShadow = true;
  g.add(m);
  return t;
}

type Make = (k: Kit) => THREE.Group;

// 한 모형 안에서 짧게 쓰는 도구
function tools(k: Kit, g: THREE.Group) {
  return {
    b: (s: V3, c: string, at: V3, o?: Opt) => k.box(g, s, c, at, o),
    r: (s: V3, rad: number, c: string, at: V3, o?: Opt) => k.rbox(g, s, rad, c, at, o),
    c: (rad: number, h: number, col: string, at: V3, axis: "x" | "y" | "z" = "y", o?: Opt) => k.cyl(g, rad, h, col, at, axis, o),
    p: (pts: [number, number][], w: number, col: string, at: V3, o?: Opt) => k.prism(g, pts, w, col, at, o),
  };
}
function monitor(k: Kit, g: THREE.Group, x: number, y: number, z: number, w = 0.46, body = C.black, face = C.screen) {
  const { b, c, r } = tools(k, g);
  c(0.08, 0.012, body, [x, y, z]);
  b([0.04, 0.12, 0.03], body, [x, y, z - 0.02]);
  r([w, w * 0.64, 0.03], 0.008, body, [x, y + 0.08, z - 0.02]);
  b([w - 0.03, w * 0.64 - 0.03, 0.004], face, [x, y + 0.095, z - 0.003], { noShadow: true });
}
function keyboard(k: Kit, g: THREE.Group, x: number, y: number, z: number, col = C.dark, w = 0.42) {
  k.box(g, [w, 0.022, 0.14], col, [x, y, z]);
}

// ── Mini SEM (탁상형 전자현미경 + PC + 모니터) ──
const sem: Make = (k) => {
  const g = new THREE.Group();
  const { b, r, c } = tools(k, g);
  const T = slab(k, g, 1.3, 0.66);
  const x = -0.42;
  r([0.34, 0.56, 0.58], 0.03, C.navy, [x, T, 0]);
  b([0.26, 0.24, 0.006], "#3c5ea3", [x - 0.03, T + 0.26, 0.291]);
  b([0.05, 0.52, 0.012], C.steel, [x + 0.135, T + 0.02, 0.29]);
  b([0.012, 0.52, 0.5], C.steel, [x + 0.171, T + 0.02, 0.02]);
  b([0.26, 0.17, 0.04], "#284277", [x - 0.03, T + 0.03, 0.3]);
  b([0.17, 0.014, 0.02], C.steel, [x - 0.03, T + 0.18, 0.325]);
  b([0.012, 0.012, 0.56], C.steel, [x + 0.165, T + 0.555, 0]);
  c(0.016, 0.05, C.black, [x - 0.02, T + 0.58, -0.04]);
  c(0.022, 0.14, C.black, [x - 0.02, T + 0.645, -0.04], "x");
  c(0.012, 0.012, C.steel, [x + 0.135, T + 0.08, 0.3], "z");
  // PC 본체
  b([0.18, 0.4, 0.42], C.black, [-0.08, T, -0.04]);
  b([0.13, 0.11, 0.005], "#3a3c3f", [-0.08, T + 0.24, 0.173]);
  b([0.03, 0.07, 0.04], C.black, [-0.08, T + 0.4, -0.04]);
  monitor(k, g, 0.33, T, -0.12, 0.44);
  keyboard(k, g, 0.33, T, 0.13);
  return g;
};

// ── 전해 연마기 (연마 셀 + 전원 장치) ──
const electro: Make = (k) => {
  const g = new THREE.Group();
  const { b, r, c } = tools(k, g);
  const T = slab(k, g, 1.0, 0.56, 0.03, "#e9e8e5");
  const x = -0.27;
  r([0.28, 0.13, 0.3], 0.012, "#dcdad3", [x, T, 0.02]);
  b([0.2, 0.08, 0.004], "#f4f4f2", [x, T + 0.025, 0.172]);
  b([0.13, 0.016, 0.003], "#2a56b0", [x, T + 0.075, 0.175]);
  b([0.25, 0.15, 0.24], "#6e665b", [x, T + 0.13, 0.02], { opacity: 0.45 });
  c(0.085, 0.11, "#4b4640", [x, T + 0.135, 0.02]);
  c(0.095, 0.012, "#8e877b", [x, T + 0.25, 0.02]);
  c(0.011, 0.32, C.steel2, [x - 0.04, T + 0.13, -0.07]);
  b([0.05, 0.03, 0.14], "#2c55c9", [x - 0.04, T + 0.34, -0.01]);
  c(0.012, 0.16, C.black, [x + 0.06, T + 0.2, 0.05]);
  // 전원 장치
  const px = 0.17;
  r([0.46, 0.17, 0.4], 0.012, "#dbdad4", [px, T, 0]);
  b([0.42, 0.1, 0.006], "#1e3b78", [px, T + 0.035, 0.2]);
  for (const [dx, dy] of [
    [-0.15, 0.07],
    [-0.09, 0.07],
    [-0.15, 0.045],
    [-0.09, 0.045],
  ])
    b([0.04, 0.014, 0.003], "#ff6a3d", [px + dx, T + dy, 0.204], { noShadow: true });
  for (let i = 0; i < 6; i++) c(0.011, 0.006, "#e9eef7", [px - 0.02 + i * 0.038, T + 0.09, 0.204], "z", { noShadow: true });
  for (let i = 0; i < 5; i++) c(0.011, 0.006, "#5d8ae0", [px - 0.02 + i * 0.038, T + 0.055, 0.204], "z", { noShadow: true });
  c(0.016, 0.008, C.red, [px + 0.17, T + 0.06, 0.205], "z");
  b([0.32, 0.016, 0.22], "#ffffff", [px, T + 0.17, -0.03]);
  return g;
};

// ── 자동 연마기 ──
const polish: Make = (k) => {
  const g = new THREE.Group();
  const { b, r, c, p } = tools(k, g);
  const T = slab(k, g, 0.78, 0.8);
  b([0.52, 0.22, 0.5], "#e5e5e3", [0, T, -0.08]);
  p(
    [
      [0.17, 0],
      [0.33, 0],
      [0.33, 0.1],
      [0.17, 0.22],
    ],
    0.52,
    "#55585d",
    [0, T, 0]
  );
  b([0.08, 0.035, 0.004], "#4f6b4f", [-0.14, T + 0.13, 0.26], { noShadow: true });
  for (let i = 0; i < 5; i++) c(0.008, 0.006, ["#e0507a", "#4aa3e0", "#f08a2c", "#4cc070", "#e0507a"][i], [-0.02 + i * 0.05, T + 0.12, 0.27], "z", { noShadow: true });
  b([0.52, 0.006, 0.5], "#ececea", [0, T + 0.22, -0.08]);
  c(0.205, 0.035, "#d8c9a3", [0, T + 0.22, 0.02]);
  c(0.185, 0.037, "#b9bbbd", [0, T + 0.22, 0.02]);
  r([0.22, 0.42, 0.2], 0.04, "#d9dbdd", [0, T + 0.22, -0.24]);
  r([0.25, 0.2, 0.46], 0.07, "#dcdedf", [0, T + 0.56, -0.1]);
  b([0.22, 0.06, 0.004], "#4c4f54", [0, T + 0.6, 0.131]);
  c(0.05, 0.1, "#c4c6c8", [0, T + 0.46, 0.03]);
  c(0.09, 0.03, "#9fa3a7", [0, T + 0.43, 0.03]);
  r([0.13, 0.1, 0.1], 0.035, "#fafafa", [0.07, T + 0.76, -0.24]);
  c(0.01, 0.1, C.black, [0.2, T + 0.22, 0.12]);
  c(0.018, 0.03, C.black, [0.2, T + 0.32, 0.12]);
  return g;
};

// ── 마운팅 프레스 ──
const press: Make = (k) => {
  const g = new THREE.Group();
  const { b, r, c } = tools(k, g);
  const T = slab(k, g, 0.78, 0.68);
  r([0.42, 0.22, 0.5], 0.02, "#e9e8e4", [0, T, 0]);
  b([0.36, 0.13, 0.006], "#213f86", [0, T + 0.045, 0.252]);
  b([0.15, 0.055, 0.003], "#2a2f38", [-0.07, T + 0.08, 0.256], { noShadow: true });
  for (let i = 0; i < 5; i++) b([0.022, 0.016, 0.004], "#3f7de0", [-0.13 + i * 0.03, T + 0.058, 0.257], { noShadow: true });
  c(0.02, 0.008, "#f4f4f2", [0.12, T + 0.105, 0.256], "z", { noShadow: true });
  c(0.013, 0.01, C.red, [0.12, T + 0.105, 0.26], "z");
  r([0.27, 0.17, 0.27], 0.01, "#c9cacb", [0, T + 0.22, -0.06]);
  c(0.065, 0.02, "#5a7fb0", [0, T + 0.39, -0.06]);
  c(0.036, 0.11, C.steel, [0, T + 0.41, -0.06]);
  b([0.09, 0.05, 0.07], C.steel, [0, T + 0.5, -0.06]);
  for (const s of [-1, 1]) {
    const arm = c(0.013, 0.2, C.black, [s * 0.14, T + 0.54, -0.06], "x");
    arm.rotation.z = Math.PI / 2 + s * 0.18;
  }
  c(0.018, 0.04, C.steel, [0, T + 0.55, -0.06]);
  c(0.028, 0.03, C.black, [0, T + 0.59, -0.06]);
  for (const [x, z] of [
    [-0.31, 0.16],
    [-0.27, 0.24],
  ])
    c(0.035, 0.09, "#efe6cf", [x, T, z]);
  return g;
};

// ── 광학 현미경 (경도계형 몸체) + 모니터 ──
const om: Make = (k) => {
  const g = new THREE.Group();
  const { b, r, c } = tools(k, g);
  const T = slab(k, g, 1.25, 0.66, 0.03, "#efeeeb");
  const x = -0.38;
  r([0.24, 0.13, 0.42], 0.02, "#e8e6e1", [x, T, 0.03]);
  b([0.13, 0.07, 0.004], "#4a6fc2", [x, T + 0.045, 0.242], { noShadow: true });
  b([0.13, 0.02, 0.004], "#3b9a6a", [x, T + 0.02, 0.242], { noShadow: true });
  r([0.13, 0.42, 0.16], 0.02, "#e4e2dd", [x, T + 0.12, -0.11]);
  r([0.15, 0.13, 0.32], 0.02, "#e8e6e1", [x, T + 0.47, -0.02]);
  c(0.05, 0.04, C.dark, [x, T + 0.43, 0.08]);
  for (const dx of [-0.025, 0.025]) c(0.012, 0.05, C.black, [x + dx, T + 0.38, 0.08]);
  c(0.026, 0.17, C.black, [x - 0.14, T + 0.52, 0.08], "x");
  c(0.03, 0.04, C.dark, [x - 0.23, T + 0.52, 0.08], "x");
  b([0.17, 0.03, 0.13], C.black, [x, T + 0.27, 0.08]);
  c(0.035, 0.14, C.black, [x, T + 0.13, 0.08]);
  for (const s of [-1, 1]) c(0.016, 0.04, C.dark, [x + s * 0.1, T + 0.285, 0.1], "x");
  b([0.18, 0.38, 0.3], C.black, [0.32, T, -0.16]);
  monitor(k, g, 0.08, T, 0.06, 0.46);
  k.box(g, [0.45, 0.012, 0.16], C.steel, [0.12, T, 0.21]);
  keyboard(k, g, 0.12, T + 0.012, 0.21, "#2a2c2f", 0.42);
  r([0.05, 0.025, 0.09], 0.012, C.black, [0.42, T, 0.21]);
  return g;
};

// ── 가스 열처리로 (관상로 + 플랜지 + 로드락) ──
const gas: Make = (k) => {
  const g = new THREE.Group();
  const { b, r, c } = tools(k, g);
  const H = 0.8;
  const cx = -0.2;
  // 알루미늄 프레임 함
  b([1.25, H - 0.03, 0.66], "#d3d6d9", [cx, 0.03, 0]);
  for (const dx of [-0.6, -0.2, 0.2, 0.6]) b([0.035, H - 0.03, 0.02], C.alu, [cx + dx, 0.03, 0.33], { rough: 0.5 });
  b([1.25, 0.035, 0.02], C.alu, [cx, 0.03, 0.33], { rough: 0.5 });
  b([1.27, 0.03, 0.68], "#f3f3f3", [cx, H, 0]);
  for (const [x, z] of [
    [-0.8, -0.3],
    [0.4, -0.3],
    [-0.8, 0.3],
    [0.4, 0.3],
  ])
    c(0.025, 0.03, C.dark, [x, 0, z]);
  b([0.3, 0.32, 0.01], "#e6e8ea", [cx + 0.02, 0.36, 0.336]);
  b([0.06, 0.06, 0.03], C.yellow, [cx + 0.12, 0.56, 0.35]);
  c(0.022, 0.025, C.red, [cx + 0.12, 0.59, 0.37], "z");
  b([0.07, 0.03, 0.004], C.black, [cx - 0.03, 0.55, 0.342], { noShadow: true });
  b([0.05, 0.06, 0.02], C.dark, [cx - 0.06, 0.42, 0.345]);
  for (let i = 0; i < 4; i++) {
    b([0.03, 0.16, 0.014], "#3a3d40", [cx + 0.28 + i * 0.045, 0.5, 0.338]);
    b([0.012, 0.11, 0.004], "#dbe7ee", [cx + 0.28 + i * 0.045, 0.525, 0.347], { noShadow: true });
  }
  // 노 본체: 아래 남색 띠 + 위 흰 덮개
  const fx = -0.18;
  r([0.64, 0.16, 0.42], 0.01, "#24508f", [fx, H + 0.03, 0]);
  r([0.64, 0.25, 0.42], 0.025, "#f4f4f4", [fx, H + 0.19, 0]);
  b([0.09, 0.035, 0.004], "#1d3b2a", [fx + 0.12, H + 0.1, 0.212], { noShadow: true });
  for (let i = 0; i < 3; i++)
    for (const dx of [-0.25, 0.25]) b([0.07, 0.006, 0.004], "#55595e", [fx + dx, H + 0.27 + i * 0.03, 0.212], { noShadow: true });
  b([0.2, 0.016, 0.025], C.steel, [fx, H + 0.4, 0.2]);
  for (const dx of [-0.2, 0.2]) b([0.04, 0.05, 0.02], C.steel2, [fx + dx, H + 0.2, 0.215]);
  // 석영관
  c(0.045, 1.5, "#e6f0f3", [fx + 0.05, H + 0.19, 0], "x", { opacity: 0.5 });
  // 왼쪽 플랜지와 진공 배관
  const lx = -0.62;
  c(0.085, 0.045, C.steel, [lx, H + 0.19, 0], "x");
  c(0.032, 0.16, C.steel, [lx - 0.1, H + 0.19, 0], "x");
  c(0.032, 0.48, C.steel, [lx - 0.18, H - 0.15, 0]);
  c(0.05, 0.03, C.steel2, [lx - 0.18, H + 0.33, 0]);
  c(0.035, 0.03, C.black, [lx - 0.18, H + 0.36, 0]);
  c(0.035, 0.04, "#e9eaeb", [lx - 0.18, H + 0.24, 0.05], "z");
  c(0.012, 0.32, C.steel, [lx - 0.06, H, 0.12]);
  // 오른쪽 플랜지, 로드락, 레일
  const rx = 0.25;
  c(0.085, 0.045, C.steel, [rx, H + 0.19, 0], "x");
  b([0.16, 0.16, 0.16], C.steel, [rx + 0.12, H + 0.11, 0]);
  c(0.03, 0.1, C.black, [rx + 0.12, H + 0.27, 0]);
  for (const s of [-1, 1]) c(0.012, 0.75, C.steel, [rx + 0.55, H + 0.2, s * 0.06], "x");
  b([0.05, 0.12, 0.18], C.steel2, [rx + 0.9, H + 0.14, 0]);
  b([0.08, 0.05, 0.16], C.steel2, [rx + 0.5, H + 0.15, 0]);
  // 오른쪽 작은 함
  b([0.38, 0.93, 0.66], "#d3d6d9", [0.62, 0.03, 0]);
  b([0.4, 0.03, 0.68], "#f3f3f3", [0.62, 0.93, 0]);
  b([0.26, 0.17, 0.006], "#3b3f45", [0.62, 0.7, 0.333], { noShadow: true });
  for (const dx of [-0.18, 0.18]) b([0.035, 0.9, 0.02], C.alu, [0.62 + dx, 0.03, 0.33], { rough: 0.5 });
  return g;
};

// ── 박스 열처리로 ──
const box: Make = (k) => {
  const g = new THREE.Group();
  const { b, r, c } = tools(k, g);
  const T = slab(k, g, 0.75, 0.66);
  r([0.42, 0.12, 0.5], 0.015, "#e9e6dc", [0, T, 0]);
  b([0.15, 0.065, 0.004], "#2d3033", [0, T + 0.03, 0.252], { noShadow: true });
  b([0.06, 0.018, 0.003], "#9ec9a1", [0, T + 0.07, 0.255], { noShadow: true });
  r([0.4, 0.52, 0.47], 0.02, "#e6e3d8", [0, T + 0.12, -0.01]);
  b([0.15, 0.52, 0.006], "#3d4146", [0, T + 0.12, 0.226]);
  b([0.06, 0.04, 0.003], C.yellow, [-0.03, T + 0.56, 0.23], { noShadow: true });
  b([0.06, 0.04, 0.003], "#ffffff", [0.035, T + 0.56, 0.23], { noShadow: true });
  for (const [dx, dy] of [
    [-0.045, 0.38],
    [0.045, 0.38],
    [-0.045, 0.2],
    [0.045, 0.2],
  ])
    b([0.012, 0.008, 0.003], "#8b9096", [dx, T + dy, 0.23], { noShadow: true });
  r([0.045, 0.17, 0.03], 0.012, "#232527", [0.15, T + 0.35, 0.235]);
  const cable = new THREE.CatmullRomCurve3([new THREE.Vector3(-0.15, T + 0.5, -0.24), new THREE.Vector3(-0.28, T + 0.35, -0.28), new THREE.Vector3(-0.3, T + 0.01, -0.2)]);
  k.mesh(g, k.once("box-cable", () => new THREE.TubeGeometry(cable, 20, 0.01, 6)), C.black);
  for (const [x, z] of [
    [0.3, 0.2],
    [0.33, 0.12],
  ])
    c(0.03, 0.07, "#efe6cf", [x, T, z]);
  return g;
};

// ── 3D CT (X선 CT, 곡면 덮개) ──
const ct: Make = (k) => {
  const g = new THREE.Group();
  const { b, c, p } = tools(k, g);
  const BL = "#6f92c8",
    GR = "#dfe2e5";
  b([1.1, 1.15, 1.0], BL, [0, 0.04, -0.05]);
  b([1.1, 1.15, 0.03], GR, [0, 0.04, 0.46]);
  b([1.1, 0.45, 0.42], "#e1e4e7", [0, 1.19, 0.26]);
  // 뒤로 둥글게 내려가는 파란 덮개 (사분원 단면을 폭 방향으로 민 것)
  const R = 0.45,
    cz = 0.05,
    cy = 1.19;
  const arc: [number, number][] = [[cz, cy]];
  for (let i = 0; i <= 16; i++) {
    const a = (i / 16) * (Math.PI / 2);
    arc.push([cz - R * Math.sin(a), cy + R * Math.cos(a)]);
  }
  p(arc, 1.1, BL, [0, 0, 0]);
  b([0.44, 0.58, 0.03], "#2f5fb3", [-0.08, 0.5, 0.48]);
  b([0.2, 0.18, 0.006], "#4a4f55", [-0.1, 0.78, 0.497], { noShadow: true });
  b([0.022, 0.22, 0.03], C.steel, [0.1, 0.62, 0.5]);
  b([0.26, 0.04, 0.004], "#2f6db5", [-0.28, 1.5, 0.472], { noShadow: true });
  b([0.06, 0.08, 0.004], C.yellow, [-0.46, 1.36, 0.472], { noShadow: true });
  b([0.12, 0.035, 0.004], "#2b2d30", [-0.1, 1.42, 0.472], { noShadow: true });
  for (const x of [-0.25, 0.25]) b([0.3, 0.03, 0.2], C.black, [x, 1.64, 0.25]);
  for (const [x, z] of [
    [-0.5, -0.5],
    [0.5, -0.5],
    [-0.5, 0.42],
    [0.5, 0.42],
  ])
    c(0.03, 0.04, C.dark, [x, 0, z]);
  // 오른쪽 조작 팔: 기둥, 조작판, 자판 받침, 모니터
  c(0.035, 0.85, BL, [0.62, 0.15, 0.35]);
  b([0.26, 0.1, 0.3], "#7fa0d3", [0.72, 0.72, 0.38]);
  c(0.015, 0.06, C.black, [0.68, 0.82, 0.42]);
  c(0.015, 0.06, C.black, [0.76, 0.82, 0.42]);
  b([0.32, 0.025, 0.2], BL, [0.74, 0.6, 0.5]);
  b([0.28, 0.015, 0.16], C.black, [0.74, 0.625, 0.5]);
  b([0.04, 0.32, 0.03], C.dark, [0.68, 0.82, 0.25]);
  k.rbox(g, [0.46, 0.3, 0.03], 0.008, C.black, [0.68, 1.0, 0.24]);
  return g;
};

// ── 인장시험기 (만능 재료 시험기) ──
const utm: Make = (k) => {
  const g = new THREE.Group();
  const { b, r, c } = tools(k, g);
  b([0.96, 0.35, 0.6], "#4a3a32", [0, 0, 0]);
  b([0.24, 0.05, 0.004], "#f2f2f0", [0, 0.12, 0.302], { noShadow: true });
  for (const s of [-1, 1]) r([0.16, 1.85, 0.32], 0.02, "#ece8dc", [s * 0.4, 0, 0]);
  b([0.96, 0.13, 0.34], "#e9e5d9", [0, 1.85, 0]);
  b([0.64, 0.07, 0.28], "#5a5d61", [0, 1.12, 0]);
  b([0.42, 0.045, 0.004], "#f4f4f2", [0, 1.13, 0.142], { noShadow: true });
  c(0.04, 0.12, C.steel, [0, 1.0, 0]);
  b([0.09, 0.09, 0.07], C.steel, [0, 0.91, 0]);
  b([0.026, 0.27, 0.006], "#8f959b", [0, 0.66, 0]);
  b([0.09, 0.09, 0.07], C.steel, [0, 0.57, 0]);
  c(0.04, 0.17, C.steel, [0, 0.4, 0]);
  c(0.09, 0.025, C.steel2, [0, 0.35, 0]);
  b([0.03, 1.3, 0.006], C.black, [-0.36, 0.45, 0.163], { noShadow: true });
  for (let i = 0; i < 14; i++) b([0.02, 0.004, 0.004], "#e8e8e8", [-0.36, 0.5 + i * 0.09, 0.167], { noShadow: true });
  b([0.1, 0.17, 0.09], "#e6e2d6", [0.4, 0.9, 0.2]);
  c(0.022, 0.02, C.red, [0.4, 1.0, 0.25], "z");
  b([0.08, 0.06, 0.003], C.yellow, [0.4, 1.55, 0.162], { noShadow: true });
  // 옆 서랍장과 제어기
  b([0.34, 1.05, 0.42], "#d8c4a2", [0.8, 0, 0.03]);
  for (let i = 0; i < 3; i++) b([0.3, 0.003, 0.004], "#b9a17c", [0.8, 0.3 + i * 0.25, 0.242], { noShadow: true });
  b([0.28, 0.32, 0.24], "#e9e6dc", [0.8, 1.05, 0.05]);
  b([0.23, 0.26, 0.004], "#273242", [0.8, 1.08, 0.172], { noShadow: true });
  for (let i = 0; i < 3; i++) b([0.12, 0.022, 0.003], "#ff4a3a", [0.79, 1.15 + i * 0.05, 0.175], { noShadow: true });
  return g;
};

// ── 재질결함분석 (휴대형 거칠기 측정기 + 전자 밀도계) ──
const defect: Make = (k) => {
  const g = new THREE.Group();
  const { b, r, c } = tools(k, g);
  const T = slab(k, g, 0.95, 0.56);
  const x = -0.24;
  b([0.26, 0.035, 0.36], "#202124", [x, T, 0]);
  b([0.24, 0.012, 0.34], "#2c2d30", [x, T + 0.035, 0]);
  r([0.085, 0.035, 0.22], 0.012, "#eeeeec", [x - 0.05, T + 0.047, 0.03]);
  b([0.055, 0.004, 0.075], "#3d4651", [x - 0.05, T + 0.082, 0.05], { noShadow: true });
  b([0.07, 0.004, 0.02], "#e0662f", [x - 0.05, T + 0.082, -0.02], { noShadow: true });
  c(0.005, 0.05, C.steel, [x - 0.05, T + 0.065, -0.11], "z");
  b([0.07, 0.03, 0.12], "#25262a", [x + 0.06, T + 0.047, 0.05]);
  b([0.14, 0.012, 0.36], "#202124", [x + 0.21, T, 0]);
  // 전자 밀도계: 저울 + 검은 측정 상자
  const dx = 0.24;
  r([0.27, 0.07, 0.32], 0.015, "#efece3", [dx, T, 0.04]);
  b([0.23, 0.045, 0.004], "#5bb5c4", [dx, T + 0.012, 0.201], { noShadow: true });
  b([0.1, 0.028, 0.003], "#a9bdb2", [dx - 0.04, T + 0.02, 0.204], { noShadow: true });
  for (const [ox, col] of [
    [0.05, C.red],
    [0.08, C.yellow],
    [0.11, C.red],
  ] as [number, string][])
    c(0.011, 0.006, col, [dx + ox - 0.02, T + 0.035, 0.205], "z", { noShadow: true });
  r([0.23, 0.2, 0.21], 0.02, "#1e1f21", [dx, T + 0.07, -0.01]);
  b([0.19, 0.12, 0.005], "#c9d6dc", [dx, T + 0.1, 0.098], { opacity: 0.45 });
  r([0.24, 0.02, 0.22], 0.008, "#2a2b2e", [dx, T + 0.27, -0.01]);
  return g;
};

// ── 3D 형상 측정기 (공초점 측정 헤드 + 조이스틱 + 모니터) ──
const prof: Make = (k) => {
  const g = new THREE.Group();
  const { b, r, c } = tools(k, g);
  const TOP = 0.72;
  for (const [x, z] of [
    [-0.6, -0.3],
    [0.6, -0.3],
    [-0.6, 0.3],
    [0.6, 0.3],
  ])
    b([0.05, TOP, 0.05], "#1f2d55", [x, 0, z]);
  b([1.3, 0.03, 0.7], "#efefed", [0, TOP, 0]);
  b([0.5, 0.6, 0.55], "#3b4252", [-0.32, 0.06, -0.02]);
  b([0.44, 0.5, 0.005], "#8b96a3", [-0.32, 0.1, 0.257], { opacity: 0.5 });
  const T = TOP + 0.03;
  b([0.36, 0.1, 0.42], "#1b1c1e", [-0.36, T, 0]);
  b([0.12, 0.012, 0.004], "#9aa0a6", [-0.36, T + 0.04, 0.212], { noShadow: true });
  b([0.24, 0.05, 0.28], "#2a2b2d", [-0.36, T + 0.1, 0.04]);
  b([0.1, 0.62, 0.1], "#2a2b2d", [-0.43, T + 0.1, -0.15]);
  r([0.13, 0.22, 0.19], 0.012, "#2a5bb0", [-0.4, T + 0.42, -0.03]);
  b([0.13, 0.2, 0.004], "#1b1c1e", [-0.4, T + 0.43, 0.067], { noShadow: true });
  c(0.026, 0.07, C.black, [-0.4, T + 0.35, 0.0]);
  b([0.24, 0.1, 0.22], "#e9e9e6", [0.02, T, 0.06]);
  b([0.12, 0.012, 0.12], C.black, [0.02, T + 0.1, 0.06]);
  c(0.012, 0.06, C.black, [0.02, T + 0.112, 0.06]);
  c(0.012, 0.006, "#3cc06b", [-0.07, T + 0.03, 0.172], "z");
  monitor(k, g, 0.38, T, -0.14, 0.4, "#d8d8d4", "#1d2a44");
  keyboard(k, g, 0.36, T, 0.13, "#ddd6c4");
  r([0.05, 0.025, 0.09], 0.012, "#ddd6c4", [0.6, T, 0.13]);
  return g;
};

const MAKERS: Record<EquipId, Make> = { sem, electro, polish, press, om, gas, box, ct, utm, defect, prof };
export function buildEquip(k: Kit, id: EquipId) {
  const g = MAKERS[id](k);
  g.updateMatrixWorld(true);
  return g;
}
