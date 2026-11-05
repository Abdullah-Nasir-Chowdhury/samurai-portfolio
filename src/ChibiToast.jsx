import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { createChibi } from './chibiSprite';

// Glass toast at the bottom of the screen with the animated pixel chibi on the left.
// The parent decides when it opens; this handles the look, the chibi, and auto-closing.
//   action: 'bow' or 'wave' — what the chibi does when the toast opens

const LIFE_MS = 9_000;
const CROPS = { bow: [4, 2], wave: [6, 0] }; // 40 × 40 window into the 48 × 64 sprite

export default function ChibiToast({ colors, open, onClose, action = 'bow', jp, jpSub, en, sig = '— 蝶踊り', chibiLabel }) {
  const canvasRef = useRef(null);
  const chibiRef = useRef(null);
  const hoverRef = useRef(false);
  const closeRef = useRef(onClose);
  useEffect(() => { closeRef.current = onClose; }, [onClose]);

  // Auto-close after LIFE_MS, paused while hovered
  useEffect(() => {
    if (!open) return;
    let left = LIFE_MS;
    let last = Date.now();
    const id = setInterval(() => {
      const now = Date.now();
      if (!hoverRef.current) left -= now - last;
      last = now;
      if (left <= 0) closeRef.current();
    }, 100);
    return () => clearInterval(id);
  }, [open]);

  // Run the chibi while the toast is open
  useEffect(() => {
    if (!open || !canvasRef.current) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!chibiRef.current) chibiRef.current = createChibi({ reduceMotion: reduce });
    const chibi = chibiRef.current;
    const out = canvasRef.current.getContext('2d');
    out.imageSmoothingEnabled = false;
    const [cx, cy] = CROPS[action] || CROPS.bow;
    let t = 0;
    let waveAgainAt = Infinity;
    if (action === 'wave') { chibi.wave(3.6); waveAgainAt = 5.4; } else chibi.bow();
    let raf = 0;
    let last = performance.now();
    const frame = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      t += dt;
      if (t >= waveAgainAt) { chibi.wave(1.8); waveAgainAt = Infinity; }
      chibi.update(dt);
      out.clearRect(0, 0, 40, 40);
      out.drawImage(chibi.canvas, cx, cy, 40, 40, 0, 0, 40, 40);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [open, action]);

  const glow = (a) => `${colors.rgbaColor}${a})`;

  return createPortal(
    <div
      role="status"
      aria-live="polite"
      className={`chibi-toast${open ? ' show' : ''}`}
      onMouseEnter={() => { hoverRef.current = true; }}
      onMouseLeave={() => { hoverRef.current = false; }}
      style={{
        '--life': `${LIFE_MS / 1000}s`,
        background: `linear-gradient(150deg, rgba(255,255,255,.18) 0%, rgba(255,255,255,.05) 35%, rgba(255,255,255,0) 55%, rgba(255,255,255,.06) 100%), ${glow(0.08)}`,
        boxShadow: `0 0 20px ${glow(0.4)}, 0 16px 40px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.35), inset 0 -1px 0 rgba(0,0,0,.2), inset 0 0 0 1px ${glow(0.35)}`,
      }}
    >
      <canvas
        ref={canvasRef}
        width={40}
        height={40}
        role="img"
        aria-label={chibiLabel}
        className="chibi-toast-sprite"
        style={{
          background: `radial-gradient(circle at 50% 40%, ${colors.dark}, ${colors.darkest} 75%)`,
          borderColor: colors.ring,
          boxShadow: `0 0 14px ${glow(0.45)}, inset 0 0 12px rgba(0,0,0,.5)`,
        }}
      />
      <div className="chibi-toast-txt">
        <span lang="ja" className="chibi-toast-jp" style={{ color: colors.textColor }}>{jp}</span>
        {jpSub && <span lang="ja" className="chibi-toast-jpsub" style={{ color: colors.textLightColor }}>{jpSub}</span>}
        {en && <span className="chibi-toast-en" style={{ color: colors.textLightColor }}>{en}</span>}
        <span lang="ja" className="chibi-toast-sig">{sig}</span>
      </div>
      <button type="button" className="chibi-toast-x" aria-label="Close message" onClick={() => closeRef.current()}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
      </button>
      <div className="chibi-toast-timebar" style={{ background: glow(0.15) }}>
        <i style={{ background: `linear-gradient(90deg, ${colors.ring}, ${colors.medium})` }} />
      </div>
      <style>{`
        .chibi-toast {
          position: fixed; left: 50%; bottom: calc(20px + env(safe-area-inset-bottom, 0px)); z-index: 60;
          width: min(520px, calc(100vw - 32px));
          display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 16px;
          padding: 16px 48px 18px 16px; text-align: left; overflow: hidden;
          backdrop-filter: blur(14px) saturate(1.4); -webkit-backdrop-filter: blur(14px) saturate(1.4);
          border: 1px solid rgba(255,255,255,.22); border-radius: 12px;
          text-shadow: 0 1px 3px rgba(0,0,0,.8);
          opacity: 0; transform: translate(-50%, 24px) scale(.97); filter: blur(4px);
          pointer-events: none; visibility: hidden;
          transition: opacity .35s ease, transform .55s cubic-bezier(.2,1.3,.4,1), filter .35s ease, visibility 0s linear .55s;
        }
        .chibi-toast.show {
          opacity: 1; transform: translate(-50%, 0) scale(1); filter: none; pointer-events: auto; visibility: visible;
          transition: opacity .35s ease, transform .55s cubic-bezier(.2,1.3,.4,1), filter .35s ease, visibility 0s;
        }
        .chibi-toast-sprite {
          display: block; width: 80px; height: 80px; border-radius: 6px; border: 1px solid;
          image-rendering: pixelated; image-rendering: crisp-edges;
        }
        .chibi-toast.show .chibi-toast-sprite { animation: chibiPop .6s .1s cubic-bezier(.25,1.6,.45,1) both; }
        @keyframes chibiPop { from { transform: translateY(18px) scale(.5); opacity: 0; } to { transform: none; opacity: 1; } }
        .chibi-toast-txt { display: grid; gap: 3px; min-width: 0; }
        .chibi-toast-jp { font-family: "Yuji Syuku", "Noto Serif JP", serif; font-size: clamp(19px, 4.6vw, 23px); line-height: 1.25; }
        .chibi-toast-jpsub { font-family: "Noto Serif JP", serif; font-weight: 600; font-size: 15px; line-height: 1.5; }
        .chibi-toast-en { font-family: "Rajdhani", sans-serif; font-weight: 600; font-size: 15.5px; line-height: 1.4; }
        .chibi-toast-sig { font-family: "Yuji Syuku", "Noto Serif JP", serif; font-size: 13px; letter-spacing: .1em; color: #9ca3af; margin-top: 2px; }
        .chibi-toast-x {
          position: absolute; top: 8px; right: 8px; width: 32px; height: 32px; border-radius: 6px;
          display: grid; place-items: center; background: transparent; border: 1px solid transparent; color: #9ca3af; cursor: pointer;
        }
        .chibi-toast-x:hover { color: #fff; border-color: rgba(255,255,255,.25); }
        .chibi-toast-x svg { width: 16px; height: 16px; }
        .chibi-toast-timebar { position: absolute; left: 0; right: 0; bottom: 0; height: 2px; }
        .chibi-toast-timebar i { display: block; height: 100%; width: 100%; transform-origin: left; }
        .chibi-toast.show .chibi-toast-timebar i { animation: chibiDrain var(--life) linear forwards; }
        .chibi-toast:hover .chibi-toast-timebar i { animation-play-state: paused; }
        @keyframes chibiDrain { from { transform: scaleX(1); } to { transform: scaleX(0); } }
        @media (prefers-reduced-motion: reduce) {
          .chibi-toast, .chibi-toast.show { transform: translate(-50%, 0); filter: none; }
          .chibi-toast.show .chibi-toast-sprite { animation: none; }
        }
      `}</style>
    </div>,
    document.body,
  );
}
