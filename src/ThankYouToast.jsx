import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { createChibi } from './chibiSprite';

// After a visitor has had the page visible for a minute, a glass toast rises from the
// bottom and the pixel chibi bows. Shows once per browser session.
// Add ?thanks to the URL to see it after 3 seconds (ignores the once-per-session rule).

const WAIT_MS = 60_000;
const LIFE_MS = 9_000;
const SESSION_KEY = 'thanks-toast-shown';

const readFlag = () => { try { return sessionStorage.getItem(SESSION_KEY) === '1'; } catch { return false; } };
const writeFlag = () => { try { sessionStorage.setItem(SESSION_KEY, '1'); } catch { /* storage blocked */ } };

export default function ThankYouToast({ colors }) {
  const [open, setOpen] = useState(false);
  const canvasRef = useRef(null);
  const chibiRef = useRef(null);
  const hoverRef = useRef(false);

  // Count only visible time, then open once
  useEffect(() => {
    const preview = new URLSearchParams(window.location.search).has('thanks');
    if (!preview && readFlag()) return;
    const wait = preview ? 3_000 : WAIT_MS;
    let visibleMs = 0;
    let last = Date.now();
    const id = setInterval(() => {
      const now = Date.now();
      if (document.visibilityState === 'visible') visibleMs += now - last;
      last = now;
      if (visibleMs >= wait) {
        clearInterval(id);
        if (!preview) writeFlag();
        setOpen(true);
      }
    }, 250);
    return () => clearInterval(id);
  }, []);

  // Auto-close after LIFE_MS, paused while hovered
  useEffect(() => {
    if (!open) return;
    let left = LIFE_MS;
    let last = Date.now();
    const id = setInterval(() => {
      const now = Date.now();
      if (!hoverRef.current) left -= now - last;
      last = now;
      if (left <= 0) setOpen(false);
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
    chibi.bow();
    let raf = 0;
    let last = performance.now();
    const frame = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      chibi.update(dt);
      out.clearRect(0, 0, 40, 40);
      out.drawImage(chibi.canvas, 4, 2, 40, 40, 0, 0, 40, 40);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [open]);

  const glow = (a) => `${colors.rgbaColor}${a})`;

  return createPortal(
    <div
      role="status"
      aria-live="polite"
      className={`thanks-toast${open ? ' show' : ''}`}
      onMouseEnter={() => { hoverRef.current = true; }}
      onMouseLeave={() => { hoverRef.current = false; }}
      style={{
        '--life': `${LIFE_MS / 1000}s`,
        background: `linear-gradient(150deg, rgba(255,255,255,.18) 0%, rgba(255,255,255,.05) 35%, rgba(255,255,255,0) 55%, rgba(255,255,255,.06) 100%), ${glow(0.08)}`,
        boxShadow: `0 0 20px ${glow(0.4)}, 0 16px 40px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.35), inset 0 -1px 0 rgba(0,0,0,.2), inset 0 0 0 1px ${glow(0.35)}`,
      }}
    >
      <>
          <canvas
            ref={canvasRef}
            width={40}
            height={40}
            role="img"
            aria-label="Pixel chibi of Abdulla bowing"
            className="thanks-chibi"
            style={{
              background: `radial-gradient(circle at 50% 40%, ${colors.dark}, ${colors.darkest} 75%)`,
              borderColor: colors.ring,
              boxShadow: `0 0 14px ${glow(0.45)}, inset 0 0 12px rgba(0,0,0,.5)`,
            }}
          />
          <div className="thanks-txt">
            <span lang="ja" className="thanks-jp" style={{ color: colors.textColor }}>ありがとうございます</span>
            <span className="thanks-en" style={{ color: colors.textLightColor }}>
              Thank you for spending a minute here. It means a lot.
            </span>
            <span className="thanks-sig">— ABDULLA</span>
          </div>
          <button type="button" className="thanks-x" aria-label="Close message" onClick={() => setOpen(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
          <div className="thanks-timebar" style={{ background: glow(0.15) }}>
            <i style={{ background: `linear-gradient(90deg, ${colors.ring}, ${colors.medium})` }} />
          </div>
      </>
      <style>{`
        .thanks-toast {
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
        .thanks-toast.show {
          opacity: 1; transform: translate(-50%, 0) scale(1); filter: none; pointer-events: auto; visibility: visible;
          transition: opacity .35s ease, transform .55s cubic-bezier(.2,1.3,.4,1), filter .35s ease, visibility 0s;
        }
        .thanks-chibi {
          display: block; width: 80px; height: 80px; border-radius: 6px; border: 1px solid;
          image-rendering: pixelated; image-rendering: crisp-edges;
        }
        .thanks-txt { display: grid; gap: 3px; min-width: 0; }
        .thanks-jp { font-family: "Yuji Syuku", "Noto Serif JP", serif; font-size: clamp(19px, 4.6vw, 23px); line-height: 1.25; }
        .thanks-en { font-family: "Rajdhani", sans-serif; font-weight: 600; font-size: 15.5px; line-height: 1.4; }
        .thanks-sig { font-family: "Cinzel", serif; font-weight: 700; font-size: 12px; letter-spacing: .14em; color: #9ca3af; margin-top: 2px; }
        .thanks-x {
          position: absolute; top: 8px; right: 8px; width: 32px; height: 32px; border-radius: 6px;
          display: grid; place-items: center; background: transparent; border: 1px solid transparent; color: #9ca3af; cursor: pointer;
        }
        .thanks-x:hover { color: #fff; border-color: rgba(255,255,255,.25); }
        .thanks-x svg { width: 16px; height: 16px; }
        .thanks-timebar { position: absolute; left: 0; right: 0; bottom: 0; height: 2px; }
        .thanks-timebar i { display: block; height: 100%; width: 100%; transform-origin: left; }
        .thanks-toast.show .thanks-timebar i { animation: thanksDrain var(--life) linear forwards; }
        .thanks-toast:hover .thanks-timebar i { animation-play-state: paused; }
        @keyframes thanksDrain { from { transform: scaleX(1); } to { transform: scaleX(0); } }
        @media (prefers-reduced-motion: reduce) {
          .thanks-toast, .thanks-toast.show { transform: translate(-50%, 0); filter: none; }
        }
      `}</style>
    </div>,
    document.body,
  );
}
