// Pixel-art chibi drawn in code from the happi portrait (gallery/animated happi.png).
// The sprite is 48 × 64 px; callers draw a crop of it onto a small canvas with smoothing off.
// It idles (breathes, blinks, glasses glint) and can do a 45° front-facing bow.

const C = {
  H: '#17131d', h: '#3a3448', S: '#c98b5e', s: '#a66b44', L: '#e2a878',
  B: '#1f1a24', G: '#1a1420', E: '#2a2232', W: '#ffffff', M2: '#6b3a2a',
  T: '#211d29', t: '#2f2a39', A: '#bfe6f7', M: '#58b4e2', D: '#2f7fb6', w: '#eef6fb',
  F: '#f6f6f6', R: '#d8282f', O: '#5d79aa', o: '#435c8a', Cf: '#384c7a',
  P: '#7a3fc0', p: '#5a2c96', Q: '#9b62dc', X: '#15111b', x: '#cfcbd8',
};

const mk = (w, h) => {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const g = c.getContext('2d');
  g.imageSmoothingEnabled = false;
  return [c, g];
};
const px = (g, col, x, y, w = 1, h = 1) => { g.fillStyle = C[col] || col; g.fillRect(x, y, w, h); };
function ell(g, col, cx, cy, rx, ry, test) {
  g.fillStyle = C[col] || col;
  for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
    for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
      const dx = (x + 0.5 - cx) / rx, dy = (y + 0.5 - cy) / ry;
      if (dx * dx + dy * dy <= 1 && (!test || test(x, y))) g.fillRect(x, y, 1, 1);
    }
}

function drawLower(g) {
  for (let y = 40; y <= 52; y++) {
    const hw = 7 + Math.floor((y - 40) * 0.42), x0 = 24 - hw, x1 = 24 + hw;
    px(g, 'P', x0, y, x1 - x0, 1); px(g, 'Q', x0, y, 2, 1); px(g, 'p', x1 - 2, y, 2, 1);
    if (y >= 43) {
      px(g, 'p', 24, y); px(g, 'p', 24 - Math.round(hw * 0.5), y); px(g, 'p', 24 + Math.round(hw * 0.5), y);
    }
  }
  px(g, 'p', 16, 40, 16, 1);
}

function drawTorso(g, arms) {
  px(g, 'T', 19, 24, 10, 18); px(g, 't', 25, 26, 2, 14);
  for (let y = 24; y <= 42; y++) {
    const col = y < 29 ? 'A' : y < 38 ? 'M' : 'D';
    px(g, col, 15, y, 5, 1); px(g, col === 'A' ? 'M' : 'D', 28, y, 5, 1);
    px(g, 'w', 20, y); px(g, 'w', 27, y);
  }
  px(g, 'A', 15, 24, 18, 1); px(g, 'w', 16, 25, 3, 1); px(g, 'D', 32, 30, 1, 12);
  px(g, 'F', 29, 31, 4, 3); px(g, 'R', 30, 32, 2, 1); // flag patch
  if (arms === 'idle') {
    px(g, 'A', 11, 26, 5, 7); px(g, 'M', 11, 30, 5, 3); px(g, 'w', 12, 27, 2, 1);
    px(g, 'M', 32, 26, 5, 7); px(g, 'D', 32, 30, 5, 3);
    px(g, 'M', 14, 30, 12, 3); px(g, 'D', 14, 32, 12, 1); px(g, 'Cf', 25, 30, 2, 3);
    px(g, 'O', 27, 28, 3, 4); px(g, 'o', 27, 31, 3, 1); px(g, 'o', 29, 28, 1, 3);
    px(g, 'D', 21, 34, 12, 3); px(g, 'M', 21, 34, 12, 1); px(g, 'Cf', 19, 34, 2, 3);
    px(g, 'O', 16, 34, 3, 3); px(g, 'o', 16, 36, 3, 1);
  } else {
    px(g, 'A', 11, 26, 5, 12); px(g, 'M', 11, 32, 5, 6); px(g, 'w', 12, 27, 2, 1);
    px(g, 'M', 32, 26, 5, 12); px(g, 'D', 32, 32, 5, 6);
    px(g, 'Cf', 12, 38, 3, 1); px(g, 'Cf', 33, 38, 3, 1);
    px(g, 'O', 12, 39, 3, 3); px(g, 'o', 14, 39, 1, 3);
    px(g, 'O', 33, 39, 3, 3); px(g, 'o', 35, 39, 1, 3);
  }
  // black "IMAGINE THE FUTURE" sash
  px(g, 'X', 18, 27, 2, 21);
  for (let y = 29; y < 46; y += 2) px(g, 'x', 18, y);
}

// q: 0 upright → 1 face fully tucked
function drawHead(g, q, blink, glint, tuft) {
  g.clearRect(0, 0, 48, 30);
  const f = Math.round(q * 6), down = Math.round(q * 7);
  ell(g, 'H', 24, 10, 10.6, 7.6);
  [[18, 2], [19, 1], [19, 2], [22, 1], [23, 0], [23, 1], [27, 1], [27, 2], [30, 3], [31, 2], [14, 6], [13, 7], [34, 6], [35, 7]]
    .forEach(([x, y]) => px(g, 'H', x, y));
  px(g, 'H', tuft ? 24 : 22, 0);
  const top = 10 + down;
  const inFace = (x, y) => y >= top + (x % 3 === 0 ? 1 : 0) && y <= 22;
  ell(g, 'S', 24, 15, 8.4, 8, inFace);
  ell(g, 's', 24, 15, 8.4, 8, (x, y) => inFace(x, y) && x >= 30);
  px(g, 'H', 15, 10, 1, 10); px(g, 'H', 32, 10, 1, 10);
  px(g, 's', 14, 14, 1, 3); px(g, 's', 33, 14, 1, 3);
  px(g, 'h', 19, 4, 3, 1); px(g, 'h', 25, 3, 2, 1); px(g, 'h', 28, 5, 2, 1);
  const vis = (y) => y >= top && y <= 23 - Math.round(q * 3);
  const F = (col, x, y, w = 1, h = 1) => { for (let yy = y; yy < y + h; yy++) if (vis(yy)) px(g, col, x, yy, w, 1); };
  F('H', 17, 11 + f, 5); F('H', 26, 11 + f, 5);
  for (const gx of [16, 25]) {
    F('G', gx, 13 + f, 7); F('G', gx, 16 + f, 7); F('G', gx, 13 + f, 1, 4); F('G', gx + 6, 13 + f, 1, 4);
  }
  F('G', 23, 14 + f, 2); F('G', 15, 14 + f); F('G', 32, 14 + f);
  if (blink || q > 0.55) { F('E', 18, 15 + f, 3); F('E', 27, 15 + f, 3); }
  else { F('E', 18, 14 + f, 3, 2); F('E', 27, 14 + f, 3, 2); F('W', 19, 14 + f); F('W', 28, 14 + f); }
  if (glint >= 0 && q < 0.3) { F('W', 17 + glint, 14 + f); F('W', 26 + glint, 14 + f); }
  F('L', 17, 17 + f, 2); F('s', 24, 17 + f);
  F('B', 20, 18 + f, 8); F('M2', 22, 19 + f, 4);
  F('B', 16, 19 + f, 6); F('B', 26, 19 + f, 7);
  F('B', 16, 20 + f, 17); F('B', 17, 21 + f, 15); F('B', 18, 22 + f, 13);
  if (q < 0.4) { px(g, 'B', 20, 23, 9, 1); px(g, 'B', 22, 24, 5, 1); }
}

const ease = (x) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
const steps = (x) => Math.round(x * 7) / 7; // stepped frames for a pixel-art feel
// Seen from the front, a 45° bow shortens the torso to cos 45° ≈ 0.71 of its height
const DEPTH = 0.66;

export function createChibi({ reduceMotion = false } = {}) {
  const [lowC, low] = mk(48, 64); drawLower(low);
  const [torIdle, ti] = mk(48, 64); drawTorso(ti, 'idle');
  const [torSide, ts] = mk(48, 64); drawTorso(ts, 'side');
  const [headC, hg] = mk(48, 30);
  const [charC, cg] = mk(48, 64);

  const DUR = reduceMotion
    ? { wait: 0.2, prep: 0.1, down: 0.25, hold: 2.8, up: 0.25, after: 0.2 }
    : { wait: 0.45, prep: 0.28, down: 0.62, hold: 2.8, up: 0.55, after: 0.45 };
  const st = { p: 0, arms: 'idle', blink: false, glint: -1, breath: 0, hop: 0, tuft: false };
  let t = 0, bow = null, nextBlink = 1.5, blinkUntil = 0, glintT = 3;

  function updateBow() {
    if (!bow) return;
    let e = t - bow.t0 - DUR.wait;
    if (e < 0) return;
    if (e < DUR.prep) { st.arms = e > DUR.prep * 0.45 ? 'side' : 'idle'; st.p = 0; return; }
    e -= DUR.prep;
    if (e < DUR.down) { st.arms = 'side'; st.p = DEPTH * steps(ease(e / DUR.down)); return; }
    e -= DUR.down;
    if (e < DUR.hold) { st.p = DEPTH; return; }
    e -= DUR.hold;
    if (e < DUR.up) { st.p = DEPTH * (1 - steps(ease(e / DUR.up))); return; }
    e -= DUR.up;
    if (e < DUR.after) {
      st.p = 0;
      const k = e / DUR.after;
      st.arms = k > 0.3 ? 'idle' : 'side';
      st.hop = !reduceMotion && k > 0.35 && k < 0.75 ? 2 : 0;
      return;
    }
    st.p = 0; st.arms = 'idle'; st.hop = 0; bow = null;
  }

  function compose() {
    cg.clearRect(0, 0, 48, 64);
    cg.drawImage(lowC, 0, -st.hop);
    const s = 1 - 0.44 * st.p, pivot = 41, srcTop = 24, srcH = 24;
    const dTop = Math.round(pivot - (pivot - srcTop) * s) + st.breath - st.hop;
    const dH = Math.max(1, Math.round(srcH * s));
    cg.drawImage(st.arms === 'idle' ? torIdle : torSide, 0, srcTop, 48, srcH, 0, dTop, 48, dH);
    drawHead(hg, st.p, st.blink, st.glint, st.tuft);
    cg.drawImage(headC, 0, dTop - 24 + Math.round(st.p * 4));
    // 1px dark outline around everything
    const img = cg.getImageData(0, 0, 48, 64), d = img.data, a = new Uint8Array(48 * 64);
    for (let i = 0; i < a.length; i++) a[i] = d[i * 4 + 3] > 0 ? 1 : 0;
    for (let y = 0; y < 64; y++) for (let x = 0; x < 48; x++) {
      const i = y * 48 + x;
      if (a[i]) continue;
      if ((x > 0 && a[i - 1]) || (x < 47 && a[i + 1]) || (y > 0 && a[i - 48]) || (y < 63 && a[i + 48])) {
        d[i * 4] = 26; d[i * 4 + 1] = 20; d[i * 4 + 2] = 32; d[i * 4 + 3] = 255;
      }
    }
    cg.putImageData(img, 0, 0);
  }

  return {
    canvas: charC,
    bow() { bow = { t0: t }; },
    update(dt) {
      t += dt;
      st.breath = !bow && Math.sin(t * 2.2) > 0.35 ? 1 : 0;
      st.tuft = Math.sin(t * 2.2 + 0.6) > 0.35;
      if (t > nextBlink) { blinkUntil = t + 0.12; nextBlink = t + 2.2 + Math.random() * 3; }
      st.blink = t < blinkUntil;
      glintT -= dt;
      if (glintT < 0) {
        const k = Math.floor(-glintT / 0.06);
        st.glint = k < 6 ? k : -1;
        if (k >= 6) glintT = 4 + Math.random() * 4;
      } else st.glint = -1;
      updateBow();
      compose();
    },
  };
}
