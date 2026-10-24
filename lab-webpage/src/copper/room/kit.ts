// 상자·원통·둥근 상자·단면 밀기로 모형을 쌓는 도구. 같은 색 재질과 같은 크기 도형은 나눠 쓴다.
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

export type V3 = [number, number, number];
export type Opt = { opacity?: number; rough?: number; noShadow?: boolean };

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
  cache = new Map<string, THREE.BufferGeometry>();
  once(key: string, make: () => THREE.BufferGeometry) {
    let g = this.cache.get(key);
    if (!g) {
      g = this.keep(make());
      this.cache.set(key, g);
    }
    return g;
  }
  // 모서리가 둥근 상자 (바닥 가운데 기준)
  rbox(p: THREE.Object3D, s: V3, r: number, hex: string, at: V3, o: Opt = {}) {
    const g = this.once(`rb${s.join(",")},${r}`, () => new RoundedBoxGeometry(s[0], s[1], s[2], 3, Math.min(r, ...s.map((v) => v / 2 - 0.0005))));
    const m = this.mesh(p, g, hex, o);
    m.position.set(at[0], at[1] + s[1] / 2, at[2]);
    return m;
  }
  // 옆에서 본 단면 [z, y] 점들을 x 방향으로 w 만큼 민 도형 (기울어진 조작판 등). at 은 단면 원점 위치
  prism(p: THREE.Object3D, pts: [number, number][], w: number, hex: string, at: V3, o: Opt = {}) {
    const g = this.once(`pr${pts.join(";")},${w}`, () => {
      const sh = new THREE.Shape(pts.map(([z, y]) => new THREE.Vector2(z, y)));
      const e = new THREE.ExtrudeGeometry(sh, { depth: w, bevelEnabled: false });
      e.rotateY(-Math.PI / 2);
      e.translate(w / 2, 0, 0);
      return e;
    });
    const m = this.mesh(p, g, hex, o);
    m.position.set(at[0], at[1], at[2]);
    return m;
  }
  dispose() {
    this.geos.forEach((g) => g.dispose());
    this.mats.forEach((m) => m.dispose());
  }
}

