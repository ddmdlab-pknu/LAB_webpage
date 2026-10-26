// 실험실 입체 모형을 그리는 캔버스. 이 파일은 따로 묶여서, 구역이 화면 가까이 올 때만 내려받는다.
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { build, Built, View } from "./scene";
import { Kit } from "./kit";
import { roomById, RoomId } from "./data";
import { afterScroll, frameProbe, idleTask, scrolling, softwareGL } from "../idle";

type Cb = { sel: (id: string | null) => void; fail: () => void };
type Engine = { setRoom: (id: RoomId) => void; select: (id: string | null) => void; dispose: () => void };

function createEngine(host: HTMLDivElement, tag: HTMLSpanElement, cb: React.MutableRefObject<Cb>): Engine | null {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "low-power" });
  } catch (e) {
    return null;
  }
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, coarse ? 1.75 : 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  // 그림자는 물건이 움직일 때만 다시 계산한다 (로봇 팔, 방 바꾸기)
  renderer.shadowMap.autoUpdate = false;
  renderer.shadowMap.needsUpdate = true;
  renderer.setClearColor("#eeeeee");
  const el = renderer.domElement;
  el.style.touchAction = "pan-y";
  // 첫 그림이 나올 때까지는 숨겨 두고 아래의 사진을 보여 준다
  el.style.opacity = "0";
  el.style.transition = "opacity 500ms ease";
  host.appendChild(el);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1.6, 0.1, 80);
  scene.add(new THREE.HemisphereLight("#ffffff", "#b4b8bc", 1.9));
  const sun = new THREE.DirectionalLight("#ffffff", 2.1);
  sun.position.set(3.5, 8, 6);
  sun.castShadow = true;
  sun.shadow.mapSize.set(coarse ? 1024 : 2048, coarse ? 1024 : 2048);
  Object.assign(sun.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6, near: 1, far: 24 });
  sun.shadow.camera.updateProjectionMatrix();
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.02;
  scene.add(sun, sun.target);

  // 고른 장비 밑에 까는 민트 판
  const plane = new THREE.PlaneGeometry(1, 1);
  const hiMat = new THREE.MeshBasicMaterial({ color: "#c3edce", depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
  const hi = new THREE.Mesh(plane, hiMat);
  hi.rotation.x = -Math.PI / 2;
  hi.visible = false;
  hi.renderOrder = 1;
  const edgeGeo = new THREE.EdgesGeometry(plane);
  const edgeMat = new THREE.LineBasicMaterial({ color: "#1f6b3a" });
  hi.add(new THREE.LineSegments(edgeGeo, edgeMat));
  scene.add(hi);

  const kit = new Kit();
  const built: Partial<Record<RoomId, Built>> = {};
  let roomId: RoomId = "materials";
  let cur: Built = (built.materials = build(kit, "materials"));
  scene.add(cur.group);

  let sel: string | null = null,
    hover: string | null = null;
  let W = 1,
    H = 1,
    sized = false;
  const now = { t: new THREE.Vector3(), az: 0, el: 0, dist: 10 };
  const goal = { t: new THREE.Vector3(), az: 0, el: 0, dist: 10 };
  const fit = (close: boolean) => {
    const a = W / H;
    return a < 1.6 ? Math.pow(1.6 / a, close ? 0.3 : 0.4) : 1;
  };
  const aim = (v: View, close: boolean) => {
    goal.t.set(v.t[0], v.t[1], v.t[2]);
    goal.az = v.az;
    goal.el = v.el;
    goal.dist = v.dist * fit(close);
  };
  const jump = () => {
    now.t.copy(goal.t);
    now.az = goal.az;
    now.el = goal.el;
    now.dist = goal.dist;
  };
  const reaim = () => (sel && cur.views[sel] ? aim(cur.views[sel], true) : aim(cur.overview, false));
  reaim();
  jump();

  const placeCamera = () => {
    const c = Math.cos(now.el);
    camera.position.set(now.t.x + now.dist * Math.sin(now.az) * c, now.t.y + now.dist * Math.sin(now.el), now.t.z + now.dist * Math.cos(now.az) * c);
    camera.lookAt(now.t);
  };

  const tmp = new THREE.Vector3();
  const nameOf = (id: string) => roomById(roomId).items.find((i) => i.id === id)?.name || "";
  const placeTag = () => {
    const id = hover || sel;
    const b = id && cur.boxes[id];
    if (!id || !b) {
      tag.hidden = true;
      return;
    }
    tmp.set((b.min.x + b.max.x) / 2, b.max.y + 0.05, (b.min.z + b.max.z) / 2).project(camera);
    if (tag.textContent !== nameOf(id)) tag.textContent = nameOf(id);
    tag.hidden = false;
    tag.style.transform = `translate(${Math.round(((tmp.x + 1) / 2) * W)}px, ${Math.round(((1 - tmp.y) / 2) * H)}px) translate(-50%, -100%)`;
  };
  const showHi = () => {
    const b = sel && cur.feet[sel];
    hi.visible = !!b;
    if (!b) return;
    hi.scale.set(b.max.x - b.min.x + 0.12, b.max.z - b.min.z + 0.12, 1);
    hi.position.set((b.min.x + b.max.x) / 2, b.min.y + 0.004, (b.min.z + b.max.z) / 2);
  };

  // ── 입력: 끌어서 돌리기, 눌러서 고르기 ──
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const pickAt = (x: number, y: number): string | null => {
    const r = el.getBoundingClientRect();
    ndc.set(((x - r.left) / r.width) * 2 - 1, -((y - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    for (const h of ray.intersectObject(cur.group, true)) {
      const id = h.object.userData.item as string | undefined;
      if (id) return id;
      const m = (h.object as THREE.Mesh).material as THREE.Material;
      if (!m.transparent) return null;
    }
    return null;
  };
  let tickN = 0;
  let clock = 0,
    lastInput = -10,
    dirty = true,
    dir = 1;
  let down: { x: number; y: number; lx: number; ly: number; moved: boolean; mouse: boolean } | null = null;
  const clampGoal = () => {
    goal.az = Math.max(cur.azRange[0], Math.min(cur.azRange[1], goal.az));
    goal.el = Math.max(0.16, Math.min(1.25, goal.el));
  };
  const setHover = (id: string | null) => {
    if (id === hover) return;
    hover = id;
    el.style.cursor = id ? "pointer" : "grab";
    dirty = true;
  };
  const onDown = (e: PointerEvent) => {
    down = { x: e.clientX, y: e.clientY, lx: e.clientX, ly: e.clientY, moved: false, mouse: e.pointerType === "mouse" };
    if (down.mouse) el.setPointerCapture(e.pointerId);
    lastInput = clock;
  };
  const onMove = (e: PointerEvent) => {
    if (!down) {
      if (e.pointerType === "mouse") setHover(pickAt(e.clientX, e.clientY));
      return;
    }
    if (!down.moved && Math.hypot(e.clientX - down.x, e.clientY - down.y) > 5) {
      down.moved = true;
      el.style.cursor = "grabbing";
    }
    if (down.moved) {
      goal.az -= (e.clientX - down.lx) * 0.006;
      if (down.mouse) goal.el += (e.clientY - down.ly) * 0.004;
      clampGoal();
      lastInput = clock;
    }
    down.lx = e.clientX;
    down.ly = e.clientY;
  };
  const onUp = (e: PointerEvent) => {
    if (down && !down.moved) {
      const id = pickAt(e.clientX, e.clientY);
      if (id) cb.current.sel(id === sel ? null : id);
      else if (sel) cb.current.sel(null);
    }
    if (down?.mouse) el.style.cursor = hover ? "pointer" : "grab";
    down = null;
    lastInput = clock;
  };
  const onCancel = () => (down = null);
  const onLeave = (e: PointerEvent) => e.pointerType === "mouse" && !down && setHover(null);
  const onLost = (e: Event) => {
    e.preventDefault();
    cb.current.fail();
  };
  el.style.cursor = "grab";
  el.addEventListener("pointerdown", onDown);
  el.addEventListener("pointermove", onMove);
  el.addEventListener("pointerup", onUp);
  el.addEventListener("pointercancel", onCancel);
  el.addEventListener("pointerleave", onLeave);
  el.addEventListener("webglcontextlost", onLost);

  // ── 그리기: 보일 때만 돌고, 바뀐 게 있을 때만 다시 그린다 ──
  let raf = 0,
    visible = false,
    last = 0;
  let shown = false,
    ready = false,
    gone = false;
  // 그래픽 성능이 낮은 기기(초당 20장 밑)면 저절로 도는 움직임을 끄고, 손댈 때만 그린다
  const probe = frameProbe();
  let lite = softwareGL(renderer.getContext()),
    drew = false;
  const frame = (ts: number) => {
    raf = 0;
    if (!ready) return;
    // 스크롤하는 동안은 그리기를 멈추고, 멈추면 이어서 그린다
    if (shown && scrolling()) {
      last = 0;
      afterScroll(start);
      return;
    }
    const gap = last ? ts - last : 0;
    const dt = last ? Math.min(0.05, gap / 1000) : 0.016;
    last = ts;
    clock += dt;
    if (gap && drew && !lite) lite = probe(gap);
    drew = false;
    const still = reduce.matches;
    const calm = still || lite;
    if (!calm && !sel && !down && clock - lastInput > 3.5) {
      goal.az += dir * dt * 0.06;
      if (goal.az > 1.2) dir = -1;
      if (goal.az < 0.15) dir = 1;
    }
    const k = still ? 1 : 1 - Math.exp(-dt * 3.2);
    const d = Math.abs(goal.az - now.az) + Math.abs(goal.el - now.el) + Math.abs(goal.dist - now.dist) + goal.t.distanceTo(now.t);
    if (d > 1e-4) {
      now.t.lerp(goal.t, k);
      now.az += (goal.az - now.az) * k;
      now.el += (goal.el - now.el) * k;
      now.dist += (goal.dist - now.dist) * k;
      dirty = true;
    }
    if (cur.tick && !calm) {
      cur.tick(clock);
      // 움직이는 그림자는 두 프레임에 한 번만 다시 계산 (휴대폰 부담 줄이기)
      if ((tickN++ & 1) === 0) renderer.shadowMap.needsUpdate = true;
      dirty = true;
    }
    if (dirty) {
      placeCamera();
      renderer.render(scene, camera);
      placeTag();
      dirty = false;
      drew = true;
      if (!shown) {
        shown = true;
        el.style.opacity = "1";
      }
    }
    if (visible && !document.hidden) raf = requestAnimationFrame(frame);
  };
  const start = () => {
    if (!raf && visible && !document.hidden) {
      last = 0;
      raf = requestAnimationFrame(frame);
    }
  };
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible) start();
    else if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  });
  io.observe(host);
  const onVis = () => start();
  document.addEventListener("visibilitychange", onVis);
  const ro = new ResizeObserver(() => {
    W = Math.max(1, host.clientWidth);
    H = Math.max(1, host.clientHeight);
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    reaim();
    if (!sized) jump();
    sized = true;
    dirty = true;
    start();
  });
  ro.observe(host);
  // 처음 크기를 바로 재 두고, 셰이더는 화면을 멈추지 않고 미리 준비한다(지원하는 브라우저).
  // 준비가 끝나고 스크롤이 멈춰 있을 때 첫 그림을 그리며 사진 위로 서서히 나타난다
  W = Math.max(1, host.clientWidth);
  H = Math.max(1, host.clientHeight);
  if (W > 1 && H > 1) {
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    reaim();
    jump();
    sized = true;
  }
  placeCamera();
  // 첫 그림은 모형이 아직 화면 밖이어도 스크롤이 멈춘 때 한 장 그려 둔다 (내려오면서 그리느라 멈추지 않게)
  const go = () =>
    afterScroll(() => {
      if (gone) return;
      ready = true;
      dirty = true;
      if (!raf) frame(performance.now());
    });
  renderer.compileAsync(scene, camera).then(go, go);

  return {
    setRoom(id) {
      if (built[id] === cur) return;
      scene.remove(cur.group);
      roomId = id;
      cur = built[id] || (built[id] = build(kit, id));
      scene.add(cur.group);
      renderer.shadowMap.needsUpdate = true;
      sel = hover = null;
      showHi();
      aim(cur.overview, false);
      jump();
      // 방을 바꾸면 살짝 비켜선 자리에서 들어온다
      if (!reduce.matches) {
        now.az += 0.35;
        now.dist *= 1.12;
      }
      lastInput = clock;
      dirty = true;
      start();
    },
    select(id) {
      sel = id && cur.boxes[id] ? id : null;
      reaim();
      showHi();
      lastInput = clock;
      dirty = true;
      start();
    },
    dispose() {
      gone = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      el.removeEventListener("webglcontextlost", onLost);
      kit.dispose();
      plane.dispose();
      edgeGeo.dispose();
      hiMat.dispose();
      edgeMat.dispose();
      renderer.dispose();
      el.remove();
    },
  };
}

type Props = { room: RoomId; sel: string | null; onSel: (id: string | null) => void; onFail: () => void; label: string };

export default function Lab3D({ room, sel, onSel, onFail, label }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const tag = useRef<HTMLSpanElement>(null);
  const eng = useRef<Engine | null>(null);
  const cb = useRef<Cb>({ sel: onSel, fail: onFail });
  cb.current = { sel: onSel, fail: onFail };
  const roomRef = useRef(room);
  roomRef.current = room;
  const selRef = useRef(sel);
  selRef.current = sel;

  useEffect(() => {
    if (!host.current || !tag.current) return;
    let e: Engine | null = null;
    let alive = true;
    // 장면 만들기는 무거우므로 스크롤이 멈춘 한가한 때 한다
    const cancel = idleTask(() => {
      if (!alive || !host.current || !tag.current) return;
      e = createEngine(host.current, tag.current, cb);
      if (!e) return cb.current.fail();
      eng.current = e;
      e.setRoom(roomRef.current);
      e.select(selRef.current);
    });
    return () => {
      alive = false;
      cancel();
      e?.dispose();
      eng.current = null;
    };
  }, []);
  useEffect(() => eng.current?.setRoom(room), [room]);
  useEffect(() => eng.current?.select(sel), [sel, room]);

  return (
    <div className="rm-gl" ref={host} role="img" aria-label={label}>
      <span className="rm-tag" ref={tag} hidden aria-hidden="true" />
    </div>
  );
}
