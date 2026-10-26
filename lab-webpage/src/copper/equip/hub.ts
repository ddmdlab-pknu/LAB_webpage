// 장비 입체 모형 창들. WebGL 하나로 보이는 창만 차례로 그려서 각 창의 2D 캔버스에 옮겨 붙인다.
// (브라우저가 한 페이지에 허용하는 WebGL 개수를 넘지 않도록)
import * as THREE from "three";
import { Kit } from "../room/kit";
import { buildEquip, EquipId } from "./models";
import { afterScroll, frameProbe, scrolling, softwareGL } from "../idle";

export type Mounted = { dispose: () => void };

class Hub {
  renderer: THREE.WebGLRenderer;
  kit = new Kit();
  views = new Set<EView>();
  reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  coarse = window.matchMedia("(pointer: coarse)").matches;
  W = 0;
  H = 0;
  raf = 0;
  last = 0;
  clock = 0;
  // 그래픽 성능이 낮은 기기(초당 20장 밑)면 저절로 돌기를 끄고, 끌 때만 그린다
  probe = frameProbe();
  lite = false;
  drew = false;
  constructor() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
    this.renderer.setPixelRatio(1);
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.lite = softwareGL(this.renderer.getContext());
    this.renderer.domElement.addEventListener("webglcontextlost", (e) => {
      e.preventDefault();
      this.views.forEach((v) => v.fail());
    });
  }
  ensure(w: number, h: number) {
    if (w > this.W || h > this.H) {
      this.W = Math.max(this.W, w);
      this.H = Math.max(this.H, h);
      this.renderer.setSize(this.W, this.H, false);
    }
  }
  kick = () => {
    if (!this.raf && !document.hidden) {
      this.last = 0;
      this.raf = requestAnimationFrame(this.frame);
    }
  };
  frame = (ts: number) => {
    this.raf = 0;
    // 스크롤하는 동안은 돌리기를 멈추고, 멈추면 이어서 돈다
    if (scrolling()) {
      this.last = 0;
      afterScroll(this.kick);
      return;
    }
    const gap = this.last ? ts - this.last : 0;
    const dt = this.last ? Math.min(0.05, gap / 1000) : 0.016;
    this.last = ts;
    this.clock += dt;
    if (gap && this.drew && !this.lite) this.lite = this.probe(gap);
    this.drew = false;
    let busy = false;
    this.views.forEach((v) => {
      if (!v.visible || !v.ready) return;
      if (v.step(dt)) {
        v.draw();
        this.drew = true;
      }
      busy = busy || v.busy();
    });
    if (busy) this.kick();
  };
}

class EView {
  hub: Hub;
  el: HTMLElement;
  canvas = document.createElement("canvas");
  ctx: CanvasRenderingContext2D;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(26, 1, 0.05, 50);
  center = new THREE.Vector3();
  radius = 1;
  az = 0.62;
  el0 = 0.38;
  goalAz = 0.62;
  goalEl = 0.38;
  dist = 3;
  w = 0;
  h = 0;
  visible = false;
  ready = false;
  dirty = true;
  lastInput = -10;
  down: { x: number; y: number; lx: number; ly: number; moved: boolean; mouse: boolean } | null = null;
  io: IntersectionObserver;
  ro: ResizeObserver;
  dead = false;

  constructor(hub: Hub, el: HTMLElement, id: EquipId) {
    this.hub = hub;
    this.el = el;
    this.ctx = this.canvas.getContext("2d")!;
    this.canvas.style.touchAction = "pan-y";
    this.canvas.style.cursor = "grab";
    this.canvas.style.opacity = "0";
    this.canvas.style.transition = "opacity 500ms ease";
    el.appendChild(this.canvas);

    const model = buildEquip(hub.kit, id);
    this.scene.add(model);
    const box = new THREE.Box3().setFromObject(model);
    const sphere = box.getBoundingSphere(new THREE.Sphere());
    this.center.copy(sphere.center);
    this.center.y = box.min.y + (box.max.y - box.min.y) * 0.46;
    this.radius = sphere.radius;
    const R = this.radius;

    this.scene.add(new THREE.HemisphereLight("#ffffff", "#b4b8bc", 1.9));
    const sun = new THREE.DirectionalLight("#ffffff", 2.0);
    sun.position.set(this.center.x + R * 1.4, box.max.y + R * 2.6, this.center.z + R * 1.9);
    sun.target.position.copy(this.center);
    sun.castShadow = true;
    const ms = hub.coarse ? 512 : 1024;
    sun.shadow.mapSize.set(ms, ms);
    Object.assign(sun.shadow.camera, { left: -R * 1.3, right: R * 1.3, top: R * 1.3, bottom: -R * 1.3, near: 0.05, far: R * 8 });
    sun.shadow.camera.updateProjectionMatrix();
    sun.shadow.bias = -0.0005;
    sun.shadow.normalBias = 0.01;
    this.scene.add(sun, sun.target);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(R * 6, R * 6), new THREE.ShadowMaterial({ opacity: 0.16 }));
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(this.center.x, box.min.y, this.center.z);
    ground.receiveShadow = true;
    this.scene.add(ground);

    this.canvas.addEventListener("pointerdown", this.onDown);
    this.canvas.addEventListener("pointermove", this.onMove);
    this.canvas.addEventListener("pointerup", this.onUp);
    this.canvas.addEventListener("pointercancel", this.onUp);

    this.io = new IntersectionObserver(([e]) => {
      this.visible = e.isIntersecting;
      if (this.visible) {
        this.dirty = true;
        hub.kick();
      }
    });
    this.io.observe(el);
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(el);
    this.resize();
    // 셰이더는 화면을 멈추지 않고 미리 준비해 두고(지원하는 브라우저), 준비되면 첫 그림을 그린다
    // 첫 그림은 창이 아직 화면 밖이어도 스크롤이 멈춘 때 바로 그려 둔다 (내려오면서 빈 칸이 보이지 않게)
    const go = () =>
      afterScroll(() => {
        if (this.dead) return;
        this.ready = true;
        this.dirty = true;
        if (this.w > 1 && this.h > 1 && this.step(0)) this.draw();
        hub.kick();
      });
    hub.renderer.compileAsync(this.scene, this.camera).then(go, go);
  }
  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.round(this.el.clientWidth * dpr)),
      h = Math.max(1, Math.round(this.el.clientHeight * dpr));
    if (w === this.w && h === this.h) return;
    this.w = this.canvas.width = w;
    this.h = this.canvas.height = h;
    const a = w / h;
    this.camera.aspect = a;
    this.camera.updateProjectionMatrix();
    // 모형 전체가 창에 들어오는 거리 (좁은 쪽 화각 기준)
    const v = (this.camera.fov * Math.PI) / 360;
    const half = a < 1 ? Math.atan(Math.tan(v) * a) : v;
    this.dist = (this.radius / Math.sin(half)) * 0.96;
    this.dirty = true;
    this.hub.kick();
  }
  onDown = (e: PointerEvent) => {
    this.down = { x: e.clientX, y: e.clientY, lx: e.clientX, ly: e.clientY, moved: false, mouse: e.pointerType === "mouse" };
    if (this.down.mouse) this.canvas.setPointerCapture(e.pointerId);
    this.lastInput = this.hub.clock;
  };
  onMove = (e: PointerEvent) => {
    const d = this.down;
    if (!d) return;
    if (!d.moved && Math.hypot(e.clientX - d.x, e.clientY - d.y) > 4) {
      d.moved = true;
      this.canvas.style.cursor = "grabbing";
    }
    if (d.moved) {
      this.goalAz -= (e.clientX - d.lx) * 0.01;
      if (d.mouse) this.goalEl = Math.max(0.02, Math.min(1.3, this.goalEl + (e.clientY - d.ly) * 0.006));
      this.lastInput = this.hub.clock;
      this.hub.kick();
    }
    d.lx = e.clientX;
    d.ly = e.clientY;
  };
  onUp = () => {
    this.down = null;
    this.canvas.style.cursor = "grab";
    this.lastInput = this.hub.clock;
  };
  auto() {
    return !this.hub.reduce.matches && !this.hub.lite && !this.down && this.hub.clock - this.lastInput > 2.5;
  }
  busy() {
    return this.auto() || Math.abs(this.goalAz - this.az) + Math.abs(this.goalEl - this.el0) > 1e-4 || !!this.down;
  }
  // 한 프레임 진행. 다시 그려야 하면 true
  step(dt: number) {
    if (this.auto()) this.goalAz += dt * 0.35;
    const k = this.hub.reduce.matches ? 1 : 1 - Math.exp(-dt * 6);
    const d = Math.abs(this.goalAz - this.az) + Math.abs(this.goalEl - this.el0);
    if (d > 1e-4) {
      this.az += (this.goalAz - this.az) * k;
      this.el0 += (this.goalEl - this.el0) * k;
      this.dirty = true;
    }
    const was = this.dirty;
    this.dirty = false;
    return was;
  }
  draw() {
    const { hub, w, h, camera, center, dist } = this;
    if (this.dead) return;
    const c = Math.cos(this.el0);
    camera.position.set(center.x + dist * Math.sin(this.az) * c, center.y + dist * Math.sin(this.el0), center.z + dist * Math.cos(this.az) * c);
    camera.lookAt(center);
    hub.ensure(w, h);
    const r = hub.renderer;
    r.setViewport(0, 0, w, h);
    r.setScissor(0, 0, w, h);
    r.setScissorTest(true);
    r.clear();
    r.render(this.scene, camera);
    this.ctx.clearRect(0, 0, w, h);
    this.ctx.drawImage(r.domElement, 0, hub.H - h, w, h, 0, 0, w, h);
    if (this.canvas.style.opacity === "0") this.canvas.style.opacity = "1";
  }
  fail() {
    this.dead = true;
    this.ready = false;
    this.el.setAttribute("data-state", "fail");
  }
  dispose() {
    this.dead = true;
    this.io.disconnect();
    this.ro.disconnect();
    this.canvas.remove();
    this.scene.traverse((o) => {
      if (o instanceof THREE.Mesh && o.material instanceof THREE.ShadowMaterial) {
        o.geometry.dispose();
        o.material.dispose();
      }
      if (o instanceof THREE.DirectionalLight) o.shadow.map?.dispose();
    });
    this.hub.views.delete(this);
  }
}

let hub: Hub | null | undefined;
export function mount(el: HTMLElement, id: EquipId): Mounted | null {
  if (hub === undefined) {
    try {
      hub = new Hub();
      document.addEventListener("visibilitychange", () => hub && hub.kick());
    } catch (e) {
      hub = null;
    }
  }
  if (!hub) return null;
  const v = new EView(hub, el, id);
  hub.views.add(v);
  hub.kick();
  return v;
}
