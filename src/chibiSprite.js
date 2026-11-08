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

// Hakama as wide-leg trousers split down the middle, ending at the ankles, then tabi and zori
function drawLower(g) {
  for (let y = 40; y <= 57; y++) {
    const hw = 7 + Math.floor((y - 40) * 0.25), x0 = 24 - hw, x1 = 24 + hw;
    px(g, 'P', x0, y, x1 - x0, 1);
    px(g, 'Q', x0, y, 2, 1); px(g, 'p', x1 - 2, y, 2, 1);
    if (y >= 44) { // pleats run down each leg
      px(g, 'p', 24 - Math.round(hw * 0.55), y); px(g, 'p', 24 + Math.round(hw * 0.55), y);
    }
    if (y >= 46) { // split between the legs, widening toward the hem
      const gap = y >= 52 ? 3 : 2, gx = 24 - Math.floor(gap / 2);
      g.clearRect(gx, y, gap, 1);
      px(g, 'p', gx - 1, y); px(g, 'Q', gx + gap, y);
    } else if (y >= 43) px(g, 'p', 24, y);
  }
  px(g, 'p', 16, 40, 16, 1);                      // waist band
  px(g, 'p', 13, 57, 9, 1); px(g, 'p', 26, 57, 9, 1); // hem shadow
  px(g, 'w', 17, 58, 5, 1); px(g, 'w', 26, 58, 5, 1); // tabi socks
  px(g, 'Z', 16, 59, 7, 2); px(g, 'Z', 25, 59, 7, 2); // zori
  px(g, 'R', 18, 58, 1, 1); px(g, 'R', 28, 58, 1, 1); // red hanao straps
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
  } else if (arms === 'point') {
    // both arms are drawn in compose(): right one pointing up, left one spread out; only the shoulders here
    px(g, 'A', 12, 25, 4, 4); px(g, 'M', 12, 28, 4, 1);
    px(g, 'M', 32, 25, 4, 4); px(g, 'D', 32, 28, 4, 1);
  } else if (arms === 'wave') {
    // left arm hangs; the right arm is drawn raised in compose()
    px(g, 'A', 11, 26, 5, 12); px(g, 'M', 11, 32, 5, 6); px(g, 'w', 12, 27, 2, 1);
    px(g, 'Cf', 12, 38, 3, 1); px(g, 'O', 12, 39, 3, 3); px(g, 'o', 14, 39, 1, 3);
    px(g, 'M', 32, 25, 4, 4); px(g, 'D', 32, 28, 4, 1);
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
// up: 0 level → 2 face tilted up (features slide up into the hairline, eyes look up)
function drawHead(g, q, blink, glint, tuft, talk = false, browUp = false, up = 0) {
  g.clearRect(0, 0, 48, 30);
  const f = Math.round(q * 6) - up, down = Math.round(q * 7) - up;
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
  const bU = browUp ? -1 : 0;
  F('H', 17, 11 + f + bU, 5); F('H', 26, 11 + f + bU, 5);
  for (const gx of [16, 25]) {
    F('G', gx, 13 + f, 7); F('G', gx, 16 + f, 7); F('G', gx, 13 + f, 1, 4); F('G', gx + 6, 13 + f, 1, 4);
  }
  F('G', 23, 14 + f, 2); F('G', 15, 14 + f); F('G', 32, 14 + f);
  if (blink || q > 0.55) { F('E', 18, 15 + f, 3); F('E', 27, 15 + f, 3); }
  else if (up) { // pupils pushed up and right toward the raised hand, white showing under them
    F('E', 19, 14 + f, 3); F('E', 28, 14 + f, 3); F('W', 19, 15 + f, 2); F('W', 28, 15 + f, 2);
  }
  else { F('E', 18, 14 + f, 3, 2); F('E', 27, 14 + f, 3, 2); F('W', 19, 14 + f); F('W', 28, 14 + f); }
  if (glint >= 0 && q < 0.3) { F('W', 17 + glint, 14 + f); F('W', 26 + glint, 14 + f); }
  F('L', 17, 17 + f, 2); F('s', 24, 17 + f);
  // royale beard: moustache with the ends turned down, soul patch, and a pointed chin beard; cheeks and jaw shaved
  F('B', 19, 18 + f, 10); F('B', 19, 19 + f); F('B', 28, 19 + f); // moustache
  F('M2', 22, 19 + f, 4);                                         // lips
  F('B', 23, 20 + f, 2);                                          // soul patch
  F('B', 21, 21 + f, 6); F('B', 21, 22 + f, 6);                   // chin beard
  F('h', 22, 21 + f, 1, 2);                                       // a little shine on the beard
  if (q < 0.4) { px(g, 'B', 22, 23 + Math.min(0, f), 4, 1); px(g, 'B', 23, 24 + Math.min(0, f), 2, 1); } // pointed tip
  if (talk) { // open, grinning mouth
    F('M2', 21, 19 + f, 6); F('#3a1a14', 22, 20 + f, 4); F('#d0606a', 23, 21 + f, 2); F('W', 22, 19 + f, 4);
  }
}

// Thick pixel line, used for the raised arm
function stamp(g, col, x0, y0, x1, y1, w) {
  g.fillStyle = C[col] || col;
  const n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) * 2));
  for (let i = 0; i <= n; i++) {
    const x = x0 + (x1 - x0) * i / n, y = y0 + (y1 - y0) * i / n;
    g.fillRect(Math.round(x - w / 2), Math.round(y - w / 2), w, w);
  }
}

// Right arm raised beside the head; a = forearm angle from vertical (radians)
function drawWaveArm(g, a, yOff) {
  const sx = 34, sy = 27 + yOff, ex = 38, ey = 20 + yOff;
  stamp(g, 'M', sx, sy, ex, ey, 4);        // happi sleeve, slid down to the elbow
  stamp(g, 'A', sx - 1, sy - 1, ex - 1, ey - 1, 1);
  const dx = Math.sin(a), dy = -Math.cos(a);
  const hx = ex + dx * 7, hy = ey + dy * 7;
  stamp(g, 'T', ex, ey, ex + dx * 5, ey + dy * 5, 3); // black undershirt sleeve
  stamp(g, 'Cf', ex + dx * 5, ey + dy * 5, ex + dx * 5.5, ey + dy * 5.5, 3);
  // open glove, fingers spread along the forearm direction
  g.fillStyle = C.O;
  g.fillRect(Math.round(hx - 1.5), Math.round(hy - 1.5), 3, 3);
  const nx = -dy, ny = dx; // across the palm
  for (const k of [-1, 0, 1]) g.fillRect(Math.round(hx + dx * 2 + nx * k), Math.round(hy + dy * 2 + ny * k), 1, 1);
  g.fillRect(Math.round(hx + nx * 2.2), Math.round(hy + ny * 2.2), 1, 1); // thumb
  g.fillStyle = C.o;
  g.fillRect(Math.round(hx - nx), Math.round(hy - ny), 1, 1);
}

// Right arm straight up beside the head, fist closed, index finger pointing at the sky.
// ext: 0–3 px, how far the arm is pumped up (the elbow straightens and the hand rises)
function drawPointArm(g, yOff, ext = 0) {
  const sx = 34, sy = 27 + yOff, ex = 37, ey = 21 + yOff - ext;
  stamp(g, 'M', sx, sy, ex, ey, 4);                 // happi sleeve, slid down to the elbow
  stamp(g, 'A', sx - 1, sy - 1, ex - 1, ey - 1, 1);
  stamp(g, 'T', ex, ey, ex, ey - 5, 3);             // black undershirt sleeve, straight up
  px(g, 'Cf', ex - 1, ey - 6, 3, 1);                // cuff
  px(g, 'O', ex - 1, ey - 9, 3, 3);                 // fist
  px(g, 'o', ex + 1, ey - 9, 1, 3);
  px(g, 'O', ex, ey - 13, 1, 4);                    // index finger up
  px(g, 'w', ex, ey - 13);                          // fingertip catches the light
  px(g, 'O', ex - 2, ey - 8);                       // thumb
}

// Left arm spread out to the side; a = angle above horizontal (radians, negative dips below)
function drawSpreadArm(g, a, yOff) {
  const sx = 14, sy = 27 + yOff, dx = -Math.cos(a), dy = -Math.sin(a);
  const ex = sx + dx * 4, ey = sy + dy * 4;
  stamp(g, 'M', sx, sy, ex, ey, 4);                  // happi sleeve
  stamp(g, 'A', sx, sy - 1, ex, ey - 1, 1);
  stamp(g, 'T', ex, ey, ex + dx * 2, ey + dy * 2, 3); // black undershirt sleeve
  const cx = ex + dx * 2.5, cy = ey + dy * 2.5;
  g.fillStyle = C.Cf; g.fillRect(Math.round(cx - 1), Math.round(cy - 1), 2, 2);
  // open glove, fingers spread outward
  const hx = ex + dx * 4, hy = ey + dy * 4;
  g.fillStyle = C.O;
  g.fillRect(Math.round(hx - 1.5), Math.round(hy - 1.5), 3, 3);
  const nx = -dy, ny = dx;
  for (const k of [-1, 0, 1]) g.fillRect(Math.round(hx + dx * 2 + nx * k), Math.round(hy + dy * 2 + ny * k), 1, 1);
  g.fillRect(Math.round(hx - nx * 2.2), Math.round(hy - ny * 2.2), 1, 1); // thumb on top
  g.fillStyle = C.o;
  g.fillRect(Math.round(hx + nx), Math.round(hy + ny), 1, 1);
}

// ---- Side view: the same chibi in profile, facing left, used for running ----
export const RUN_FRAMES = 8;
const EDGE = '#1a1420';

// End of a limb from (x, y): angle 0 hangs straight down, positive swings forward (to the left)
const limb = (x, y, a, len) => [x - Math.sin(a) * len, y + Math.cos(a) * len];

function drawSideLeg(g, hx, hy, thigh, shin, near) {
  const [kx, ky] = limb(hx, hy, thigh, 8);
  const [fx, fy] = limb(kx, ky, shin, 8);
  stamp(g, EDGE, hx, hy, kx, ky, 8); stamp(g, EDGE, kx, ky, fx, fy - 1, 7); // dark edge keeps the legs apart
  stamp(g, near ? 'P' : 'p', hx, hy, kx, ky, 6);      // hakama thigh
  stamp(g, near ? 'P' : 'p', kx, ky, fx, fy - 1, 5);  // hakama shin
  if (near) stamp(g, 'Q', kx - 2, ky - 1, fx - 2, fy - 2, 1); // front crease catching the light
  const X = Math.round(fx), Y = Math.round(fy);
  px(g, near ? 'w' : 'x', X - 3, Y, 5, 1);  // tabi
  px(g, 'R', X - 1, Y);                      // hanao strap
  px(g, near ? 'w' : 'x', X - 4, Y + 1, 6, 1); // zori
  px(g, 'X', X - 4, Y + 2, 6, 1);           // sole
  return fy + 2;
}

function drawSideArm(g, sx, sy, a, near, bend = 1.5) {
  const [ex, ey] = limb(sx, sy, a, 6);
  const [hx, hy] = limb(ex, ey, a + bend, 5); // elbow bent, fist forward
  stamp(g, EDGE, sx, sy, ex, ey, 7); stamp(g, EDGE, ex, ey, hx, hy, 5); // dark edge
  stamp(g, near ? 'A' : 'D', sx, sy, ex, ey, 5);  // happi sleeve
  if (near) stamp(g, 'M', sx + 1, sy + 1, ex + 1, ey + 1, 2);
  stamp(g, near ? 'T' : 'X', ex, ey, hx, hy, 3);  // undershirt forearm
  g.fillStyle = C[near ? 'O' : 'o'];
  g.fillRect(Math.round(hx - 1.5), Math.round(hy - 1.5), 3, 3); // glove
}

function drawSideTorso(g, ox, top, lean) {
  for (let i = 0; i < 18; i++) {
    const y = top + i, x0 = 20 + ox - Math.round((17 - i) * lean);
    const col = i < 5 ? 'A' : i < 13 ? 'M' : 'D';
    if (i < 11) px(g, 'T', x0 - 1, y, 2, 1);  // black undershirt at the chest
    px(g, col, x0 + 1, y, 12, 1);             // happi body
    px(g, 'w', x0 + 1, y);                    // white lapel edge
    px(g, 'D', x0 + 11, y, 2, 1);             // shaded back
    px(g, 'X', x0 + 4, y, 2, 1);              // sash over the shoulder
    if (i % 2 === 0 && i > 1) px(g, 'x', x0 + 4, y);
  }
}

// Profile head facing left; (ox, oy) shifts it, k bounces the hair
// face: 'smile' | 'shock' (wide eye, O mouth) | 'daze' (swirly eye, wobbly mouth)
function drawSideHead(g, ox, oy, blink, glint, k, face = 'smile') {
  const P = (col, x, y, w = 1, h = 1) => px(g, col, x + ox, y + oy, w, h);
  ell(g, 'H', 26 + ox, 10 + oy, 10.4, 7.8);
  // curls on top and streaming back
  [[19, 2], [22, 1], [23, 0], [26, 1], [29, 1], [30, 2], [33, 3]].forEach(([x, y]) => P('H', x, y));
  const flow = k % 2;
  [[36, 5 + flow], [37, 7], [38, 8 + flow], [37, 11], [36, 13 - flow], [35, 3]].forEach(([x, y]) => P('H', x, y));
  P('h', 22, 4, 3, 1); P('h', 28, 3, 3, 1); P('h', 32, 6, 2, 1);
  // face in profile
  ell(g, 'S', 21 + ox, 15.5 + oy, 7.2, 7.4, (x, y) => y >= 10 + oy && x <= 27 + ox);
  ell(g, 's', 21 + ox, 15.5 + oy, 7.2, 7.4, (x, y) => y >= 10 + oy && x >= 25 + ox && x <= 27 + ox);
  P('H', 14, 9, 8, 2); P('H', 27, 9, 2, 9);  // fringe and sideburn
  P('S', 13, 16, 1, 2); P('L', 14, 15, 1, 1); // nose
  P('S', 25, 13, 2, 4); P('s', 26, 14, 1, 2); // ear
  P('H', 15, face === 'shock' ? 10 : 11, 5, 1); // eyebrow (shot up when startled)
  // glasses: one lens and the arm back to the ear
  P('G', 14, 13, 6, 1); P('G', 14, 16, 6, 1); P('G', 14, 13, 1, 4); P('G', 19, 13, 1, 4); P('G', 20, 14, 5, 1);
  if (face === 'shock') { P('W', 15, 14, 4, 2); P('E', 16, 14, 1, 2); }          // wide eye, tiny pupil
  else if (face === 'daze') { P('E', 15, 15); P('E', 16, 14); P('E', 17, 15); P('E', 18, 14); } // swirly eye
  else if (blink) P('E', 16, 15, 2, 1);
  else { P('E', 16, 14, 2, 2); P('W', 16, 14); }
  if (face === 'smile' && glint >= 0 && glint < 4) P('W', 15 + glint, 14);
  // royale beard: moustache and a pointed chin beard, not joined; cheek, jaw and sideburn shaved
  P('S', 15, 18, 3, 3); P('S', 16, 21, 5, 1);
  P('B', 14, 18, 5, 1); P('B', 18, 19);                     // moustache, end turned down
  P('B', 16, 21, 4, 1); P('B', 15, 22, 5, 1); P('B', 16, 23, 3, 1); P('B', 16, 24, 2, 1); // chin beard to a point
  P('h', 17, 22);                                           // shine
  if (face === 'shock') { P('#3a1a14', 15, 19, 2, 2); }             // "O" mouth
  else if (face === 'daze') { P('#3a1a14', 15, 20); P('#3a1a14', 16, 19); P('#3a1a14', 17, 20); } // wobbly mouth
  else {
    P('#3a1a14', 15, 20, 2, 1); P('#3a1a14', 17, 19);       // closed smile, corner curling up
    P('L', 15, 21); P('L', 19, 18);                          // lower lip and lifted cheek
  }
  if (face === 'shock') { P('A', 38, 3); P('A', 37, 4, 3, 2); P('w', 37, 4); } // sweat drop
}

// One frame of the run: legs cycle, arms swing opposite, body bobs with the stride
function drawSideRun(g, frame, blink, glint) {
  const ph = (frame / RUN_FRAMES) * Math.PI * 2;
  const legs = [ph, ph + Math.PI].map((p) => {
    const thigh = 0.85 * Math.sin(p);
    return [thigh, thigh - 0.25 - 1.3 * Math.max(0, Math.cos(p))];
  });
  const drop = Math.max(...legs.map(([a, b]) => Math.cos(a) * 8 + Math.cos(b) * 8));
  const hipY = Math.max(40, Math.min(44, Math.round(58 - drop)));
  const armA = 0.95 * Math.sin(ph);
  drawSidePose(g, 0, hipY - 42, {
    legs: legs, arms: [[-armA, 1.5], [armA, 1.5]], lean: 0.15, headDx: -2, face: 'smile', blink, glint, k: frame,
  });
}

// The whole profile figure with the hip at (26 + ox, 42 + oy).
// legs/arms: [near, far] as [thigh, shin] and [shoulder angle, elbow bend]
function drawSidePose(g, ox, oy, { legs, arms, lean = 0, headDx = 0, face = 'smile', blink = false, glint = -1, k = 0 }) {
  drawSideArm(g, 27 + ox, 28 + oy, arms[1][0], false, arms[1][1]);
  drawSideLeg(g, 27 + ox, 42 + oy, legs[1][0], legs[1][1], false);
  drawSideLeg(g, 26 + ox, 42 + oy, legs[0][0], legs[0][1], true);
  drawSideTorso(g, ox, 25 + oy, lean);
  px(g, 'p', 20 + ox, 40 + oy, 13, 2); // hakama waist band
  drawSideHead(g, headDx + ox, oy, blink, glint, k, face);
  drawSideArm(g, 26 + ox, 29 + oy, arms[0][0], true, arms[0][1]);
}

// ---- Trip and fall: his foot catches, he pitches forward, lands on his front and belly-slides ----
// Each frame is a pose drawn upright, then rotated about the hip (tilt in degrees, − pitches him forward)
const IMPACT = [[6, 60, 3], [11, 57, 2], [2, 56, 2], [40, 61, 2]];
const TRAIL = [[70, 60, 3], [75, 57, 2], [65, 58, 2], [72, 54, 2]];
const FALL_POSES = [
  { name: 'trip', tilt: -14, lift: 0, face: 'shock', legs: [[-0.7, -1.5], [0.35, 0.15]], arms: [[1.9, 0.3], [2.2, 0.3]] },
  { name: 'stumble', tilt: -38, lift: 3, face: 'shock', legs: [[-0.9, -1.7], [-0.3, -0.9]], arms: [[2.1, 0.2], [2.4, 0.2]] },
  { name: 'dive', tilt: -68, lift: 6, face: 'shock', legs: [[-0.4, -0.9], [-0.2, -0.5]], arms: [[2.6, 0.1], [2.8, 0.1]] },
  { name: 'faceplant', tilt: -90, lift: 0, face: 'shock', legs: [[0.1, -1.5], [0.2, -1.1]], arms: [[2.9, 0.1], [3.0, 0.1]], dust: IMPACT },
  { name: 'slide', tilt: -90, lift: 0, face: 'daze', legs: [[0.05, -0.9], [0.15, -0.6]], arms: [[3.0, 0.1], [3.05, 0.1]], dust: TRAIL },
  { name: 'stop', tilt: -91, lift: 0, face: 'daze', legs: [[0, -0.2], [0.05, -0.05]], arms: [[3.0, 0.1], [3.05, 0.1]], stars: 0 },
  { name: 'seeing stars', tilt: -91, lift: 0, face: 'daze', legs: [[0, -0.2], [0.05, -0.05]], arms: [[3.0, 0.1], [3.05, 0.1]], stars: 1 },
];
export const FALL_FRAMES = FALL_POSES.length;
export const FALL_W = 80;
export const FALL_NAMES = FALL_POSES.map((p) => p.name);

const STAR = '#facc15';
function star(g, x, y, big) {
  g.fillStyle = STAR;
  g.fillRect(x, y - 1, 1, 3); g.fillRect(x - 1, y, 3, 1);
  if (big) { g.fillRect(x, y - 2, 1, 5); g.fillRect(x - 2, y, 5, 1); g.fillStyle = '#fff7c2'; g.fillRect(x, y, 1, 1); }
}

// Draws fall frame i into a new 80 × 64 canvas: ground at the bottom, hip at x = 46 (he falls toward the left)
export function drawFallFrame(i) {
  const pose = FALL_POSES[i];
  const [, sg] = mk(96, 96);
  const PX = 48, PY = 62; // hip in the work canvas
  drawSidePose(sg, PX - 26, PY - 42, { ...pose, k: i });
  // rotate about the hip with nearest-neighbour sampling so the pixels stay crisp
  const [rot, rg] = mk(96, 96);
  const a = (pose.tilt * Math.PI) / 180, ca = Math.cos(a), sa = Math.sin(a);
  const sd = sg.getImageData(0, 0, 96, 96).data, out = rg.createImageData(96, 96), od = out.data;
  let bottom = 0;
  for (let y = 0; y < 96; y++) for (let x = 0; x < 96; x++) {
    const dx = x + 0.5 - PX, dy = y + 0.5 - PY;
    const sx = Math.floor(PX + dx * ca + dy * sa), sy = Math.floor(PY - dx * sa + dy * ca);
    if (sx < 0 || sy < 0 || sx >= 96 || sy >= 96) continue;
    const si = (sy * 96 + sx) * 4, di = (y * 96 + x) * 4;
    if (sd[si + 3] === 0) continue;
    od[di] = sd[si]; od[di + 1] = sd[si + 1]; od[di + 2] = sd[si + 2]; od[di + 3] = 255;
    bottom = Math.max(bottom, y);
  }
  rg.putImageData(out, 0, 0);
  // place him in the frame: lowest pixel on the ground (y 62), raised by `lift`
  const [frame, fg] = mk(FALL_W, 64);
  const offX = 46 - PX, offY = 62 - pose.lift - bottom;
  fg.drawImage(rot, offX, offY);
  outlineCanvas(fg, FALL_W, 64);
  // head position after the rotation, for the stars
  const hx = PX + offX + (-2 * ca + 30 * sa), hy = PY + offY + (-2 * sa - 30 * ca);
  if (pose.dust) {
    fg.fillStyle = 'rgba(230, 200, 190, .85)';
    pose.dust.forEach(([x, y, s]) => fg.fillRect(x, y, s, s));
  }
  if (pose.stars !== undefined) {
    const sx = Math.round(hx), sy = Math.round(hy) - 9;
    const pts = pose.stars === 0 ? [[-7, 1, true], [0, -3, false], [7, 1, true]] : [[-5, -2, false], [3, -3, true], [8, 2, false], [-8, 2, true]];
    pts.forEach(([x, y, big]) => star(fg, sx + x, sy + y, big));
  }
  return frame;
}

function outlineCanvas(g, w, h) {
  const img = g.getImageData(0, 0, w, h), d = img.data, a = new Uint8Array(w * h);
  for (let i = 0; i < a.length; i++) a[i] = d[i * 4 + 3] > 0 ? 1 : 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = y * w + x;
    if (a[i]) continue;
    if ((x > 0 && a[i - 1]) || (x < w - 1 && a[i + 1]) || (y > 0 && a[i - w]) || (y < h - 1 && a[i + w])) {
      d[i * 4] = 26; d[i * 4 + 1] = 20; d[i * 4 + 2] = 32; d[i * 4 + 3] = 255;
    }
  }
  g.putImageData(img, 0, 0);
}

const ease = (x) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
const steps = (x) => Math.round(x * 7) / 7; // stepped frames for a pixel-art feel
// Seen from the front, a 45° bow shortens the torso to cos 45° ≈ 0.71 of its height
const DEPTH = 0.66;

export function createChibi({ reduceMotion = false } = {}) {
  const [lowC, low] = mk(48, 64); drawLower(low);
  const [torIdle, ti] = mk(48, 64); drawTorso(ti, 'idle');
  const [torSide, ts] = mk(48, 64); drawTorso(ts, 'side');
  const [torWave, tw] = mk(48, 64); drawTorso(tw, 'wave');
  const [torPoint, tp] = mk(48, 64); drawTorso(tp, 'point');
  const [headC, hg] = mk(48, 30);
  const [charC, cg] = mk(48, 64);

  const DUR = reduceMotion
    ? { wait: 0.2, prep: 0.1, down: 0.25, hold: 2.8, up: 0.25, after: 0.2 }
    : { wait: 0.45, prep: 0.28, down: 0.62, hold: 2.8, up: 0.55, after: 0.45 };
  const st = { p: 0, arms: 'idle', blink: false, glint: -1, breath: 0, hop: 0, tuft: false, armA: 0, pump: 0, talk: false };
  let t = 0, bow = null, wave = null, point = null, running = false, nextBlink = 1.5, blinkUntil = 0, glintT = 3;
  const RUN_FPS = reduceMotion ? 8 : 16;
  const runFrame = () => Math.floor(t * RUN_FPS) % RUN_FRAMES;

  // Enthusiastic one-arm wave with little hops while he talks
  function updateWave() {
    if (!wave) return;
    const e = t - wave.t0;
    if (e > wave.dur) { wave = null; st.arms = 'idle'; st.hop = 0; st.talk = false; return; }
    st.arms = 'wave';
    const speed = reduceMotion ? 5 : 13;
    st.armA = (Math.round(Math.sin(e * speed) * 1.5) / 1.5) * 0.5; // three stepped frames
    st.hop = reduceMotion ? 0 : (Math.sin(e * speed / 2) > 0.55 ? 2 : Math.sin(e * speed / 2) > 0.1 ? 1 : 0);
    st.talk = e > 0.3 && Math.sin(e * 9) > -0.2;
  }

  // Jumps up and down on the spot with one hand pointing up, calling out
  function updatePoint() {
    if (!point) return;
    const e = t - point.t0;
    if (e > point.dur) { point = null; st.arms = 'idle'; st.hop = 0; st.talk = false; return; }
    st.arms = 'point';
    const jump = Math.abs(Math.sin(e * Math.PI / 0.6)); // one jump every 0.6 s
    st.hop = reduceMotion ? 0 : Math.round(jump * 4);  // 0–4 px, stepped
    st.talk = Math.sin(e * 7) > -0.3;
    // the spread arm flaps up and down, three stepped frames, a bit faster than the jumps
    st.armA = reduceMotion ? 0.2 : (Math.round(Math.sin(e * 10) * 1.5) / 1.5) * 0.55;
    // the pointing arm pumps at the sky, out of step with the flapping arm
    st.pump = reduceMotion ? 1 : Math.round((Math.sin(e * 12 + 1.6) + 1) * 1.5); // 0–3 px
  }

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

  function composeRun() {
    cg.clearRect(0, 0, 48, 64);
    drawSideRun(cg, runFrame(), st.blink, st.glint);
    outline();
  }

  function outline() {
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

  function compose() {
    if (running) { composeRun(); return; }
    cg.clearRect(0, 0, 48, 64);
    // While pointing he stands 4 px lower so the raised hand, the hair and the jumps stay inside the crop
    cg.save();
    if (st.arms === 'point') cg.translate(0, 4);
    cg.drawImage(lowC, 0, -st.hop);
    const s = 1 - 0.44 * st.p, pivot = 41, srcTop = 24, srcH = 24;
    const dTop = Math.round(pivot - (pivot - srcTop) * s) + st.breath - st.hop;
    const dH = Math.max(1, Math.round(srcH * s));
    const waving = st.arms === 'wave', pointing = st.arms === 'point';
    const tor = st.arms === 'idle' ? torIdle : waving ? torWave : pointing ? torPoint : torSide;
    cg.drawImage(tor, 0, srcTop, 48, srcH, 0, dTop, 48, dH);
    const excited = waving || pointing;
    drawHead(hg, st.p, st.blink, st.glint, st.tuft, excited && st.talk, excited, pointing ? 2 : 0);
    cg.drawImage(headC, 0, dTop - 24 + Math.round(st.p * 4));
    if (waving) drawWaveArm(cg, st.armA, dTop - 24);
    if (pointing) { drawPointArm(cg, dTop - 24, st.pump); drawSpreadArm(cg, st.armA, dTop - 24); }
    cg.restore();
    outline(); // 1px dark outline around everything
  }

  return {
    canvas: charC,
    bow() { wave = null; point = null; bow = { t0: t }; },
    wave(dur = 3) { bow = null; point = null; st.p = 0; wave = { t0: t, dur }; },
    point(dur = 5) { bow = null; wave = null; st.p = 0; point = { t0: t, dur }; },
    // Run in place facing left (flip the canvas to run right); the caller moves him across the screen
    run(on = true) { running = on; if (on) { bow = null; wave = null; point = null; st.p = 0; st.hop = 0; } },
    get runFrame() { return runFrame(); },
    update(dt) {
      t += dt;
      st.breath = !bow && !wave && !point && Math.sin(t * 2.2) > 0.35 ? 1 : 0;
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
      updateWave();
      updatePoint();
      compose();
    },
  };
}
