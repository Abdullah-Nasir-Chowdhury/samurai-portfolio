import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

// Omikuji draw: shake the box, a numbered stick slides out, the paper slip unfolds,
// and unlucky slips can be tied to the rope. The fortune itself comes from /api/omikuji.

const SOUNDS = {
  shake: '/audio/omikuji/omikuji-shake.mp3',
  stick: '/audio/omikuji/omikuji-stick.mp3',
  paper: '/audio/omikuji/omikuji-paper.mp3',
  bell: '/audio/omikuji/omikuji-bell.mp3',
};

const PANEL = 140; // the slip is three panels of this height, folded like a letter
const DRAWN_KEY = 'omikuji-drawn-date';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const japanDate = () => new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);

const drawnToday = () => {
  try {
    return localStorage.getItem(DRAWN_KEY) === japanDate();
  } catch {
    return false;
  }
};

const rememberDrawn = (date) => {
  try {
    localStorage.setItem(DRAWN_KEY, date);
  } catch {
    // private mode or blocked storage: the server still returns the same slip
  }
};

export default function OmikujiModal({ colors, playSound, onClose }) {
  const [stage, setStage] = useState('idle'); // idle -> shaking -> stick -> slip -> tied
  const [fortune, setFortune] = useState(null);
  const [error, setError] = useState(null);
  const [alreadyDrawn] = useState(drawnToday);
  const [reducedMotion] = useState(() => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);
  const soundRefs = useRef({});
  const closeRef = useRef(null);

  useEffect(() => {
    Object.entries(SOUNDS).forEach(([name, src]) => {
      const audio = new Audio(src);
      audio.preload = 'auto';
      soundRefs.current[name] = { current: audio };
    });
    closeRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Sounds are optional: skip any file that hasn't been added or hasn't loaded
  const play = (name) => {
    const ref = soundRefs.current[name];
    if (ref && ref.current.readyState >= 2) playSound(ref);
  };

  const draw = async () => {
    if (stage !== 'idle') return;
    setError(null);
    const request = fetch('/api/omikuji', { cache: 'no-store' }).then((r) => {
      if (!r.ok) throw new Error(`omikuji ${r.status}`);
      return r.json();
    });

    try {
      if (reducedMotion) {
        const result = await request;
        setFortune(result);
        setStage('slip');
        rememberDrawn(result.date);
        return;
      }
      setStage('shaking');
      play('shake');
      const [result] = await Promise.all([request, wait(1500)]);
      setFortune(result);
      setStage('stick');
      play('stick');
      await wait(1600);
      setStage('slip');
      play('paper');
      if (!result.rank.tie) setTimeout(() => play('bell'), 1300);
      rememberDrawn(result.date);
    } catch {
      setStage('idle');
      setError('The shrine office is closed right now. Please try again in a moment.');
    }
  };

  const tie = () => {
    play('paper');
    setStage('tied');
  };

  const showBox = stage === 'idle' || stage === 'shaking' || stage === 'stick';

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center px-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.78)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label="Omikuji fortune draw"
    >
      <button
        ref={closeRef}
        onClick={onClose}
        className="absolute top-6 right-6 p-3 rounded-lg border-2"
        style={{ backgroundColor: colors.bgGlassLight, borderColor: colors.borderLightColor, color: colors.textLightColor }}
        aria-label="Close"
      >
        <X size={24} />
      </button>

      <div className="relative w-full max-w-[340px] h-[600px] max-h-[92vh] flex flex-col items-center">
        <ShrineRope colors={colors} tied={stage === 'tied'} />

        {showBox && (
          <div className="flex-1 flex flex-col items-center justify-center pt-10">
            <p className="mb-2 text-4xl" style={{ fontFamily: '"Yuji Syuku", serif', color: colors.textLighterColor }}>
              おみくじ
            </p>
            <p className="mb-6 text-sm tracking-widest uppercase" style={{ fontFamily: '"Rajdhani", sans-serif', color: colors.textColor }}>
              Draw today's fortune
            </p>

            <button
              onClick={draw}
              disabled={stage !== 'idle'}
              className={`omikuji-box ${stage === 'idle' ? 'omikuji-idle' : ''} ${stage === 'shaking' ? 'omikuji-shaking' : ''} ${stage === 'stick' ? 'omikuji-flipped' : ''}`}
              aria-label="Shake the omikuji box"
            >
              <OmikujiBox colors={colors} stickOut={stage === 'stick'} />
            </button>

            <div className="h-24 mt-14 text-center" style={{ fontFamily: '"Rajdhani", sans-serif' }}>
              {stage === 'idle' && (
                <>
                  <p style={{ color: colors.textLightColor }}>Tap the box to shake it</p>
                  {alreadyDrawn && (
                    <p className="mt-2 text-sm" style={{ color: colors.textColor }}>
                      今日はもう引きました — today's slip is waiting for you
                    </p>
                  )}
                  {error && <p className="mt-2 text-sm text-gray-300">{error}</p>}
                </>
              )}
              {stage === 'shaking' && <p style={{ color: colors.textLightColor }}>…</p>}
              {stage === 'stick' && fortune && (
                <div className="omikuji-number">
                  <p className="text-4xl" style={{ fontFamily: '"Yuji Syuku", serif', color: colors.textLighterColor }}>
                    {fortune.stickKanji}番
                  </p>
                  <p className="text-sm tracking-widest" style={{ color: colors.textColor }}>STICK No. {fortune.stick}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {(stage === 'slip' || stage === 'tied') && fortune && (
          <div className="flex-1 flex flex-col items-center justify-start pt-16 w-full">
            <FortuneSlip fortune={fortune} colors={colors} tied={stage === 'tied'} instant={reducedMotion} />
            <div className="mt-5 flex gap-3 items-center" style={{ fontFamily: '"Rajdhani", sans-serif' }}>
              {stage === 'slip' && fortune.rank.tie && (
                <button onClick={tie} className="px-5 py-2 rounded-full font-semibold whitespace-nowrap" style={{ backgroundColor: colors.medium, color: '#fff', boxShadow: `0 0 18px ${colors.shadowColor}` }}>
                  結ぶ · Tie it
                </button>
              )}
              {stage === 'slip' && (
                <button onClick={onClose} className="px-5 py-2 rounded-full font-semibold border" style={{ borderColor: colors.borderLightColor, color: colors.textLightColor }}>
                  Keep it
                </button>
              )}
              {stage === 'tied' && (
                <div className="omikuji-number text-center">
                  <p style={{ color: colors.textLighterColor }}>厄除け — the bad luck stays on the rope.</p>
                  <button onClick={onClose} className="mt-3 px-5 py-2 rounded-full font-semibold border" style={{ borderColor: colors.borderLightColor, color: colors.textLightColor }}>
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .omikuji-box { background: none; border: none; padding: 0; transform-origin: 50% 55%; }
        .omikuji-idle { animation: omikujiFloat 3s ease-in-out infinite; cursor: pointer; }
        .omikuji-shaking { animation: omikujiShake 1.5s ease-in-out forwards; }
        .omikuji-flipped { transform: rotate(180deg); }
        .omikuji-stick { transition: transform 0.9s cubic-bezier(0.2, 0.8, 0.3, 1); }
        .omikuji-number { animation: omikujiFade 0.5s ease-out both; }
        .omikuji-slip-drop { animation: omikujiDrop 0.5s ease-out both; }
        .omikuji-knot { animation: omikujiFade 0.4s ease-out 0.7s both; }

        @keyframes omikujiFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes omikujiShake {
          0% { transform: rotate(0deg); }
          8% { transform: rotate(-16deg) translateX(-4px); }
          16% { transform: rotate(14deg) translateX(4px); }
          24% { transform: rotate(-16deg) translateX(-4px); }
          32% { transform: rotate(14deg) translateX(4px); }
          40% { transform: rotate(-12deg) translateX(-3px); }
          48% { transform: rotate(10deg) translateX(3px); }
          56% { transform: rotate(0deg); }
          100% { transform: rotate(180deg); }
        }
        @keyframes omikujiFade {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes omikujiDrop {
          from { opacity: 0; transform: translateY(-40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .omikuji-idle, .omikuji-shaking, .omikuji-number, .omikuji-slip-drop, .omikuji-knot { animation: none; }
        }
      `}</style>
    </div>
  );
}

// Hexagonal wooden box seen slightly from above, with the stick hidden inside.
// The bands and the stick's tip take the element's colour; the wood stays wood.
function OmikujiBox({ colors, stickOut }) {
  return (
    <svg width="120" height="210" viewBox="0 0 120 210" style={{ filter: `drop-shadow(0 0 18px ${colors.shadowColor})`, overflow: 'visible' }}>
      {/* stick: drawn first so the box covers it until it slides out of the hole */}
      <g className="omikuji-stick" style={{ transform: stickOut ? 'translateY(-62px)' : 'translateY(0)' }}>
        <rect x="56.5" y="24" width="7" height="80" rx="2" fill="#ead7a8" stroke="#b8975a" strokeWidth="0.75" />
        <rect x="56.5" y="24" width="7" height="12" rx="2" fill={colors.medium} />
      </g>

      {/* side faces and front face */}
      <polygon points="20,32 40,44 40,198 20,186" fill="#7a4a24" />
      <polygon points="40,44 80,44 80,198 40,198" fill="#a0672f" />
      <polygon points="80,44 100,32 100,186 80,198" fill="#6a3f1e" />
      {/* wood grain */}
      {[62, 96, 140, 172].map((y) => (
        <path key={y} d={`M42 ${y} q 18 3 36 0`} stroke="#8a5528" strokeWidth="0.8" fill="none" opacity="0.6" />
      ))}
      {/* coloured bands */}
      <polygon points="20,46 40,58 80,58 100,46 100,52 80,64 40,64 20,52" fill={colors.medium} opacity="0.9" />
      <polygon points="20,168 40,180 80,180 100,168 100,174 80,186 40,186 20,174" fill={colors.medium} opacity="0.9" />
      {/* label plaque with 御神籤 */}
      <rect x="47" y="76" width="26" height="86" fill="#f7f0e1" stroke="#3b2a1a" strokeWidth="0.75" />
      {['御', '神', '籤'].map((ch, i) => (
        <text key={ch} x="60" y={100 + i * 24} textAnchor="middle" fontSize="18" fill="#1f1611" style={{ fontFamily: '"Yuji Syuku", "Noto Serif JP", serif' }}>
          {ch}
        </text>
      ))}
      {/* top face with the hole */}
      <polygon points="20,32 40,20 80,20 100,32 80,44 40,44" fill="#b77b3f" />
      <ellipse cx="60" cy="32" rx="7" ry="3.5" fill="#2a1a0e" />
    </svg>
  );
}

// The slip: three panels folded like a letter, unfolding top then bottom.
// Each panel shows its third of the same content, so the text lines up when open.
function FortuneSlip({ fortune, colors, tied, instant }) {
  const [open, setOpen] = useState(instant);

  useEffect(() => {
    if (instant) return undefined;
    const timer = setTimeout(() => setOpen(true), 450);
    return () => clearTimeout(timer);
  }, [instant]);

  const content = <SlipContent fortune={fortune} colors={colors} />;
  const folds = [
    { origin: 'bottom', closed: 'translateZ(2px) rotateX(-180deg)', delay: '0s' },
    null,
    { origin: 'top', closed: 'translateZ(1px) rotateX(180deg)', delay: '0.55s' },
  ];

  // Outer layer drops in; inner layer flies to the rope. They're separate because the
  // drop-in animation keeps holding its transform and would override the tie.
  return (
    <div className="omikuji-slip-drop">
      <div
        style={{
          perspective: '1200px',
          transition: 'transform 0.8s cubic-bezier(0.5, 0, 0.3, 1), opacity 0.8s',
          transformOrigin: '50% 0%',
          transform: tied ? 'translateY(-95px) scale(0.14, 0.3) rotate(10deg)' : 'none',
          opacity: tied ? 0 : 1,
        }}
      >
        <div className="relative" style={{ width: 270, height: PANEL * 3, transformStyle: 'preserve-3d' }}>
          {folds.map((fold, i) => (
            <div
              key={i}
              className="absolute left-0 w-full"
              style={{
                top: i * PANEL,
                height: PANEL,
                transformStyle: 'preserve-3d',
                transformOrigin: fold ? fold.origin : 'center',
                transform: fold && !open ? fold.closed : 'translateZ(0) rotateX(0deg)',
                transition: instant ? 'none' : `transform 0.7s ease-in-out ${fold ? fold.delay : '0s'}`,
              }}
            >
              <div className="absolute inset-0 overflow-hidden" style={{ backfaceVisibility: 'hidden', ...paper }} aria-hidden={i !== 0}>
                <div className="absolute left-0 w-full" style={{ top: -i * PANEL, height: PANEL * 3 }}>
                  {content}
                </div>
              </div>
              <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden', transform: 'rotateX(180deg)', ...paper, filter: 'brightness(0.92)' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const paper = {
  backgroundColor: '#f7f0e1',
  backgroundImage: 'radial-gradient(rgba(120, 90, 50, 0.08) 1px, transparent 1px)',
  backgroundSize: '6px 6px',
  boxShadow: 'inset 0 0 0 1px rgba(90, 60, 30, 0.25)',
};

// Laid out in three blocks of exactly one panel each, so the fold creases
// fall between sections instead of through a line of text.
function SlipContent({ fortune, colors }) {
  const line = (l) => (
    <div key={l.jp} className="flex gap-3 items-center" style={{ height: 58 }}>
      <div className="w-12 shrink-0 text-center">
        <p className="text-sm font-bold" style={{ color: colors.dark }}>{l.jp}</p>
        <p className="text-[9px] uppercase tracking-wide leading-tight" style={{ fontFamily: '"Rajdhani", sans-serif' }}>{l.en}</p>
      </div>
      <p className="text-[12.5px] leading-snug" style={{ fontFamily: '"Rajdhani", sans-serif', fontWeight: 600 }}>{l.text}</p>
    </div>
  );

  return (
    <div style={{ color: '#1f1611', fontFamily: '"Noto Serif JP", serif' }}>
      <div className="px-5 pt-2 text-center flex flex-col justify-center" style={{ height: PANEL }}>
        <p className="text-[11px] tracking-widest">第{fortune.stickKanji}番 · No. {fortune.stick}</p>
        <p className="leading-none" style={{ fontFamily: '"Yuji Syuku", serif', fontSize: 50, color: colors.dark }}>
          {fortune.rank.jp}
        </p>
        <p className="text-[11px] mt-1 tracking-wide">{fortune.rank.reading} · {fortune.rank.en}</p>
        <p className="text-[12px] mt-1 italic leading-snug">{fortune.rank.headline}</p>
      </div>
      <div className="px-5 flex flex-col justify-center" style={{ height: PANEL }}>
        {fortune.lines.slice(0, 2).map(line)}
      </div>
      <div className="px-5 flex flex-col justify-start pt-1" style={{ height: PANEL }}>
        {fortune.lines.slice(2).map(line)}
        <p className="text-[10px] text-center" style={{ fontFamily: '"Rajdhani", sans-serif' }}>
          {fortune.date}
          {fortune.todayCount != null && ` · 今日 ${fortune.todayCount} 人が引きました`}
        </p>
      </div>
    </div>
  );
}

// Shimenawa-style rope across the top; a tied slip shows up as a paper knot on it.
function ShrineRope({ colors, tied }) {
  return (
    <svg className="absolute top-0 left-0 w-full" height="70" viewBox="0 0 340 70" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 18 Q 170 42 340 18" stroke="#c9a66b" strokeWidth="9" fill="none" strokeLinecap="round" />
      <path d="M0 18 Q 170 42 340 18" stroke="#8b6a3a" strokeWidth="9" fill="none" strokeDasharray="4 7" opacity="0.7" />
      {[70, 170, 270].map((x) => (
        <path key={x} d={`M${x - 6} ${x === 170 ? 31 : 26} l 6 12 l -6 0 l 6 12`} stroke={colors.lighter} strokeWidth="2" fill="none" opacity="0.8" />
      ))}
      {tied && (
        <g className="omikuji-knot">
          <rect x="196" y="22" width="8" height="26" fill="#f7f0e1" stroke="#b8975a" strokeWidth="0.75" transform="rotate(8 200 30)" />
          <rect x="193" y="25" width="14" height="5" fill="#f7f0e1" stroke="#b8975a" strokeWidth="0.75" />
        </g>
      )}
    </svg>
  );
}
