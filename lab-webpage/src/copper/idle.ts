// 스크롤하는 동안에는 무거운 일(3D 모형 준비·그리기)을 미루고, 손을 멈춘 뒤 한가할 때 하나씩 처리한다.
// 화면에 글과 그림이 나타나는 순간 버벅이지 않게 하려는 장치.
const QUIET = 200; // 마지막 스크롤 뒤 이만큼(ms) 지나면 멈춘 것으로 본다
const SETTLE = 700; // 무거운 준비 작업은 조금 더 기다린다 (방금 나타난 제목 단어가 거의 다 떠오른 뒤)

let lastScroll = -1e9;
let lastY = 0;
let bound = false;
let timer = 0;
const waiting = new Set<() => void>();

const now = () => performance.now();
// 부드러운 스크롤(메뉴·버튼으로 이동, 키보드)은 scroll 이벤트가 드물게 올 수 있어, 위치가 바뀌었는지도 직접 본다
function moved() {
  const y = window.scrollY;
  if (y !== lastY) {
    lastY = y;
    lastScroll = now();
  }
}
function check() {
  timer = 0;
  moved();
  const left = QUIET - (now() - lastScroll);
  if (left > 0) {
    timer = window.setTimeout(check, left);
    return;
  }
  const fns = Array.from(waiting);
  waiting.clear();
  fns.forEach((f) => f());
}
function onScroll() {
  lastScroll = now();
  if (!timer && waiting.size) timer = window.setTimeout(check, QUIET);
}
function bind() {
  if (bound || typeof window === "undefined") return;
  bound = true;
  lastY = window.scrollY;
  window.addEventListener("scroll", onScroll, { passive: true });
  // 휠은 스크롤보다 먼저 오므로, 첫 스크롤 프레임부터 무거운 그리기를 멈출 수 있다
  window.addEventListener("wheel", onScroll, { passive: true });
}

/** 지금 페이지를 스크롤하는 중인가 */
export function scrolling() {
  bind();
  moved();
  return now() - lastScroll < QUIET;
}

/** 스크롤이 멈추면 한 번 부른다 (이미 멈춰 있으면 바로). 같은 함수는 한 번만 기다린다 */
export function afterScroll(fn: () => void) {
  bind();
  if (!scrolling()) {
    fn();
    return;
  }
  waiting.add(fn);
  if (!timer) timer = window.setTimeout(check, QUIET);
}

type Deadline = { timeRemaining: () => number };
type IdleWin = Window & { requestIdleCallback?: (cb: (d: Deadline) => void, o?: { timeout: number }) => number };
const onIdle = (fn: (d?: Deadline) => void) => {
  const w = window as IdleWin;
  if (w.requestIdleCallback) w.requestIdleCallback(fn, { timeout: 400 });
  else window.setTimeout(() => fn(), 60);
};

// ms 동안 스크롤이 없었으면 부른다
function whenSettled(ms: number, fn: () => void) {
  moved();
  const left = ms - (now() - lastScroll);
  if (left <= 0) fn();
  else window.setTimeout(() => whenSettled(ms, fn), left);
}

// 무거운 일 줄: 스크롤이 멈춘 지 조금 지나고 브라우저가 한가할 때 한 번에 하나씩
const queue: (() => void)[] = [];
let pumping = false;
function pump() {
  if (pumping || !queue.length) return;
  pumping = true;
  whenSettled(SETTLE, () =>
    onIdle((dl) => {
      pumping = false;
      moved();
      if (now() - lastScroll < SETTLE) return pump();
      // 한가한 시간이 남아 있으면 줄에 선 일을 이어서 한다
      do {
        const fn = queue.shift();
        try {
          fn?.();
        } catch (e) {
          // 한 일이 실패해도 나머지는 계속한다
        }
      } while (queue.length && dl && dl.timeRemaining() > 12);
      pump();
    })
  );
}

/** 무거운 일을 줄에 넣는다. 돌려받은 함수를 부르면 아직 안 한 일은 취소된다 */
export function idleTask(fn: () => void): () => void {
  bind();
  queue.push(fn);
  pump();
  return () => {
    const i = queue.indexOf(fn);
    if (i >= 0) queue.splice(i, 1);
  };
}

/** 그림을 그린 프레임들의 간격으로, 이 기기가 3D를 쉬지 않고 돌리기 버거운지 판단한다.
 *  간격 n개의 중앙값이 limit(ms)를 넘으면 true. 한 번 판단하면 바뀌지 않는다 */
export function frameProbe(n = 6, limit = 45) {
  const xs: number[] = [];
  let verdict: boolean | null = null;
  return (gap: number) => {
    if (verdict !== null) return verdict;
    xs.push(gap);
    if (xs.length < n) return false;
    xs.sort((a, b) => a - b);
    verdict = xs[n >> 1] > limit;
    return verdict;
  };
}

/** 그래픽카드 없이 소프트웨어로 그리는 WebGL인가 (원격 데스크톱·가상 머신·오래된 PC 등) */
export function softwareGL(gl: WebGLRenderingContext | WebGL2RenderingContext | null | undefined) {
  try {
    if (!gl) return false;
    const soft = /swiftshader|llvmpipe|softpipe|software|basic render/i;
    let name = String(gl.getParameter(gl.RENDERER));
    // 크롬·사파리는 이름을 가려 두므로 그때만 확장으로 진짜 이름을 본다 (파이어폭스는 바로 알려 준다)
    if (/^webkit/i.test(name)) {
      const ext = gl.getExtension("WEBGL_debug_renderer_info");
      if (ext) name = String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL));
    }
    return soft.test(name);
  } catch (e) {
    return false;
  }
}
