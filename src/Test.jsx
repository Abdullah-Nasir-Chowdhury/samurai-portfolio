import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Droplet, Mountain, Sword, Wind, Circle, Menu, X, Github, Linkedin, Facebook, Twitter, Instagram, MessageCircle, BookOpen, User, Mail, FileText, Volume2, VolumeX, Download } from 'lucide-react';

const hexToRgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
};

// Expands a handful of base colours into every key the page reads from `colors`.
const makePalette = (p) => ({
  primary: p.medium,
  light: p.light,
  lighter: p.lighter,
  medium: p.medium,
  dark: p.dark,
  darker: p.darker,
  darkest: p.darkest,
  accent: p.accent,
  accentDark: p.accent,
  shadowColor: `rgba(${p.rgb}, 0.5)`,
  particleColor: p.particle,
  kanjiColor: p.medium,
  cursorColor: p.particle,
  borderColor: p.darker,
  borderMediumColor: p.dark,
  borderLightColor: p.medium,
  bgColor: p.darker,
  bgMediumColor: p.darkest,
  bgLightColor: p.dark,
  textColor: p.text,
  textLightColor: p.light,
  textLighterColor: p.lightest,
  bgGlassLight: `rgba(${hexToRgb(p.darker)}, 0.8)`,
  bgGlassDark: `rgba(${hexToRgb(p.darkest)}, 0.5)`,
  rgbaColor: `rgba(${p.rgb}, `,
  pageBg: p.bg,
  ring: p.ring || p.accent,
  ringRgb: hexToRgb(p.ring || p.accent),
});

// Design card picks the element. The site uses each element's first mood; the other
// two are kept for later (nothing cycles them now that Frontend changes the photo).
const palettes = {
  fire: [
    // crimson
    makePalette({ light: '#fecaca', lighter: '#fca5a5', medium: '#dc2626', dark: '#991b1b', darker: '#7f1d1d', darkest: '#450a0a', accent: '#f97316', particle: '#ef4444', text: '#f87171', lightest: '#fef2f2', rgb: '220, 38, 38', bg: '#000000', ring: '#ca8a04' }),
    // ember
    makePalette({ light: '#fed7aa', lighter: '#fdba74', medium: '#ea580c', dark: '#c2410c', darker: '#7c2d12', darkest: '#431407', accent: '#facc15', particle: '#fb923c', text: '#fb923c', lightest: '#fff7ed', rgb: '234, 88, 12', bg: '#0a0400', ring: '#ca8a04' }),
    // ash
    makePalette({ light: '#d6d3d1', lighter: '#a8a29e', medium: '#78716c', dark: '#57534e', darker: '#292524', darkest: '#1c1917', accent: '#f97316', particle: '#fdba74', text: '#a8a29e', lightest: '#f5f5f4', rgb: '120, 113, 108', bg: '#080706', ring: '#ca8a04' }),
  ],
  water: [
    // ocean
    makePalette({ light: '#bfdbfe', lighter: '#93c5fd', medium: '#2563eb', dark: '#1e3a8a', darker: '#1e40af', darkest: '#172554', accent: '#22d3ee', particle: '#3b82f6', text: '#60a5fa', lightest: '#eff6ff', rgb: '37, 99, 235', bg: '#01040d', ring: '#7dd3fc' }),
    // ice
    makePalette({ light: '#cffafe', lighter: '#a5f3fc', medium: '#06b6d4', dark: '#0e7490', darker: '#155e75', darkest: '#083344', accent: '#e0f2fe', particle: '#67e8f9', text: '#67e8f9', lightest: '#ecfeff', rgb: '6, 182, 212', bg: '#010a0d', ring: '#e0f2fe' }),
    // abyss
    makePalette({ light: '#c7d2fe', lighter: '#a5b4fc', medium: '#4f46e5', dark: '#3730a3', darker: '#312e81', darkest: '#1e1b4b', accent: '#2dd4bf', particle: '#5eead4', text: '#818cf8', lightest: '#eef2ff', rgb: '79, 70, 229', bg: '#02010a', ring: '#2dd4bf' }),
  ],
  wind: [
    // dawn mist
    makePalette({ light: '#e2e8f0', lighter: '#cbd5e1', medium: '#94a3b8', dark: '#475569', darker: '#334155', darkest: '#1e293b', accent: '#fda4af', particle: '#e2e8f0', text: '#cbd5e1', lightest: '#f8fafc', rgb: '148, 163, 184', bg: '#070a10', ring: '#fda4af' }),
    // storm
    makePalette({ light: '#ccfbf1', lighter: '#99f6e4', medium: '#14b8a6', dark: '#0f766e', darker: '#115e59', darkest: '#134e4a', accent: '#e2e8f0', particle: '#99f6e4', text: '#5eead4', lightest: '#f0fdfa', rgb: '20, 184, 166', bg: '#050b0c', ring: '#e2e8f0' }),
    // night
    makePalette({ light: '#d1d5db', lighter: '#9ca3af', medium: '#6b7280', dark: '#374151', darker: '#1f2937', darkest: '#111827', accent: '#a78bfa', particle: '#a78bfa', text: '#9ca3af', lightest: '#f3f4f6', rgb: '139, 92, 246', bg: '#05060a', ring: '#a78bfa' }),
  ],
  earth: [
    // forest
    makePalette({ light: '#d9f99d', lighter: '#bef264', medium: '#65a30d', dark: '#3f6212', darker: '#365314', darkest: '#1a2e05', accent: '#ca8a04', particle: '#a3e635', text: '#a3e635', lightest: '#f7fee7', rgb: '101, 163, 13', bg: '#030702', ring: '#ca8a04' }),
    // clay
    makePalette({ light: '#f5d0b0', lighter: '#e0a87a', medium: '#a0522d', dark: '#7c3f1d', darker: '#5c2e14', darkest: '#2e170a', accent: '#84cc16', particle: '#c2814f', text: '#d4956a', lightest: '#fdf3ea', rgb: '160, 82, 45', bg: '#070402', ring: '#ca8a04' }),
    // stone
    makePalette({ light: '#e7e5e4', lighter: '#d6d3d1', medium: '#a8a29e', dark: '#78716c', darker: '#44403c', darkest: '#292524', accent: '#84cc16', particle: '#a8a29e', text: '#d6d3d1', lightest: '#fafaf9', rgb: '168, 162, 158', bg: '#060505', ring: '#84cc16' }),
  ],
};

// Background track per element; wind and earth reuse the existing tracks until they get their own
const elementMusic = {
  fire: '/audio/moonlight.mp3',
  water: '/audio/idkmf.mp3',
  wind: '/audio/moonlight.mp3',
  earth: '/audio/idkmf.mp3',
};

export default function SamuraiPortfolio() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [theme, setTheme] = useState(0); // mood index (0-2) within the current element
  const [element, setElement] = useState('fire'); // 'fire', 'water', 'wind', or 'earth'
  const [profileImage, setProfileImage] = useState('/frontend/03-beach.jpg');
  
// Audio refs
const bgMusicRef = useRef(null);
const clickSoundRef = useRef(null);
const pageSwitchSoundRef = useRef(null);
const [audioInitialized, setAudioInitialized] = useState(false);

const colors = palettes[element][theme];

useEffect(() => {
  setIsLoaded(true);
  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };
  window.addEventListener('mousemove', handleMouseMove);
  return () => window.removeEventListener('mousemove', handleMouseMove);
}, []);

// Initialize audio
useEffect(() => {
  const initAudio = () => {
    try {
      bgMusicRef.current = new Audio(elementMusic.fire);
      bgMusicRef.current.loop = true;
      bgMusicRef.current.volume = 0.2;
      
      bgMusicRef.current.addEventListener('error', (e) => {
        console.error('Background music failed to load. Make sure moonlight.mp3 exists in public/audio/', e);
      });
      
      bgMusicRef.current.addEventListener('canplaythrough', () => {
        console.log('Background music loaded successfully');
        setAudioInitialized(true);
      });

      clickSoundRef.current = new Audio('/audio/a6.mp3');
      clickSoundRef.current.volume = 1.0;
      clickSoundRef.current.addEventListener('error', (e) => {
        console.error('Click sound failed to load. Make sure a6.mp3 exists in public/audio/', e);
      });

      pageSwitchSoundRef.current = new Audio('/audio/a6.mp3');
      pageSwitchSoundRef.current.volume = 1.0;
      pageSwitchSoundRef.current.addEventListener('error', (e) => {
        console.error('Page switch sound failed to load. Make sure a6.mp3 exists in public/audio/', e);
      });
      
      bgMusicRef.current.load();
      clickSoundRef.current.load();
      pageSwitchSoundRef.current.load();
      
    } catch (error) {
      console.error('Audio initialization failed:', error);
    }
  };

  initAudio();

  return () => {
    if (bgMusicRef.current) {
      bgMusicRef.current.pause();
      bgMusicRef.current.src = '';
      bgMusicRef.current = null;
    }
    if (clickSoundRef.current) {
      clickSoundRef.current.src = '';
      clickSoundRef.current = null;
    }
    if (pageSwitchSoundRef.current) {
      pageSwitchSoundRef.current.src = '';
      pageSwitchSoundRef.current = null;
    }
  };
}, []);

// Swap the background track when the element changes, carrying on if music was playing
useEffect(() => {
  const music = bgMusicRef.current;
  if (!music || music.src.endsWith(elementMusic[element])) return;
  music.src = elementMusic[element];
  if (isMusicPlaying && !isMuted) {
    music.play().catch((error) => console.error('Audio play failed:', error));
  }
}, [element, isMusicPlaying, isMuted]);

// Toggle all audio (music and sound effects)
const toggleAudio = async () => {
  if (isMusicPlaying || !isMuted) {
    if (bgMusicRef.current) {
      bgMusicRef.current.pause();
    }
    setIsMusicPlaying(false);
    setIsMuted(true);
  } else {
    if (bgMusicRef.current) {
      try {
        await bgMusicRef.current.play();
        setIsMusicPlaying(true);
        setIsMuted(false);
      } catch (error) {
        console.error('Audio play failed:', error);
        alert('Unable to play audio. Please make sure:\n1. Audio files exist in public/audio/ folder\n2. You have interacted with the page (browsers require user interaction for audio)');
      }
    }
  }
};

// Play sound effect
const playSound = async (soundRef) => {
  if (!isMuted && soundRef.current) {
    try {
      const sound = soundRef.current.cloneNode();
      sound.volume = soundRef.current.volume;
      await sound.play();
    } catch (error) {
      console.error('Sound play failed:', error);
    }
  }
};

  const socialLinks = [
    { name: 'LinkedIn', icon: Linkedin, url: 'https://www.linkedin.com/in/anc19990/', color: 'hover:text-blue-400' },
    { name: 'GitHub', icon: Github, url: 'https://github.com/Abdullah-Nasir-Chowdhury', color: 'hover:text-gray-400' },
    { name: 'Twitter', icon: Twitter, url: 'https://x.com/AbdullahN23439', color: 'hover:text-sky-400' },
    { name: 'Facebook', icon: Facebook, url: 'https://www.facebook.com/dayi.abdullah.75/', color: 'hover:text-blue-500' },
    { name: 'Instagram', icon: Instagram, url: 'https://www.instagram.com/abdullah_nasir_chowdhury/', color: 'hover:text-pink-400' },
    { name: 'Line', icon: MessageCircle, url: 'https://line.me/ti/p/R2Hx8jRqM6', color: 'hover:text-green-400' },
  ];

  const navItems = [
    { name: 'Home', id: 'home', icon: User },
    { name: 'Research', id: 'research', icon: BookOpen },
    { name: 'Projects', id: 'projects', icon: FileText },
    { name: 'Contact', id: 'contact', icon: Mail },
  ];

  const navigateTo = (page) => {
    playSound(pageSwitchSoundRef);
    setCurrentPage(page);
    setMenuOpen(false);
  };

  const handleMenuToggle = () => {
    playSound(clickSoundRef);
    setMenuOpen(!menuOpen);
  };

  const renderPage = () => {
    switch(currentPage) {
      case 'home':
        return <HomePage playSound={playSound} clickSoundRef={clickSoundRef} element={element} setElement={setElement} colors={colors} profileImage={profileImage} setProfileImage={setProfileImage} />;
      case 'research':
        return <ResearchPage playSound={playSound} clickSoundRef={clickSoundRef} colors={colors} />;
      case 'projects':
        return <ProjectsPage playSound={playSound} clickSoundRef={clickSoundRef} colors={colors} />;
      case 'contact':
        return <ContactPage socialLinks={socialLinks} playSound={playSound} clickSoundRef={clickSoundRef} colors={colors} />;
      default:
        return <HomePage playSound={playSound} clickSoundRef={clickSoundRef} element={element} setElement={setElement} colors={colors} profileImage={profileImage} setProfileImage={setProfileImage} />;
    }
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ background: `radial-gradient(ellipse at 50% 0%, ${colors.darkest}99 0%, ${colors.pageBg} 60%)` }}
    >
      <CustomCursor colors={colors} />
      {/* Japanese Pattern Background */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, ${colors.rgbaColor}0.1) 35px, ${colors.rgbaColor}0.1) 70px),
                           repeating-linear-gradient(-45deg, transparent, transparent 35px, ${colors.rgbaColor}0.1) 35px, ${colors.rgbaColor}0.1) 70px)`
        }}
      />

      {/* Animated Particles */}
      <ElementParticles element={element} colors={colors} />

      {/* Parallax Background Elements */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
        }}
      >
        <div 
          className="absolute top-20 right-20 opacity-[0.08] select-none" 
          style={{ fontSize: '12rem', fontWeight: 'bold', color: colors.kanjiColor }}
        >
          侍
        </div>
        <div 
          className="absolute bottom-20 left-20 opacity-[0.08] select-none" 
          style={{ fontSize: '12rem', fontWeight: 'bold', color: colors.kanjiColor }}
        >
          武
        </div>
      </div>

      {/* Single Audio Control */}
      <div className="fixed top-6 left-6 z-50">
        <button
          onClick={toggleAudio}
          className="p-3 backdrop-blur-sm border-2 rounded-lg transition-all duration-300"
          style={{ 
            backgroundColor: colors.bgGlassLight,
            borderColor: colors.borderLightColor,
            boxShadow: `0 0 20px ${colors.shadowColor}` 
          }}
          title={isMusicPlaying && !isMuted ? "Mute All Audio" : "Unmute All Audio"}
        >
          {isMusicPlaying && !isMuted ? (
            <Volume2 style={{ color: colors.textLightColor }} size={24} />
          ) : (
            <VolumeX style={{ color: colors.textLightColor }} size={24} />
          )}
        </button>
      </div>

      {/* Hamburger Menu Button */}
      <button
        onClick={handleMenuToggle}
        className="fixed top-6 right-6 z-50 p-3 backdrop-blur-sm border-2 rounded-lg transition-all duration-300"
        style={{
          backgroundColor: colors.bgGlassLight,
          borderColor: colors.borderLightColor,
          boxShadow: `0 0 20px ${colors.shadowColor}`
        }}
      >
        {menuOpen ? (
          <X style={{ color: colors.textLightColor }} size={28} />
        ) : (
          <Menu style={{ color: colors.textLightColor }} size={28} />
        )}
      </button>

      {/* Side Navigation Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-black/95 backdrop-blur-lg z-40 transition-transform duration-300 ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ 
          boxShadow: `-10px 0 50px ${colors.shadowColor}`,
          borderLeft: `1px solid ${colors.borderColor}`
        }}
      >
        <div className="flex flex-col h-full p-8 pt-24">
          {/* Navigation Links */}
          <nav className="flex-1">
            <ul className="space-y-4">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => navigateTo(item.id)}
                    className="w-full flex items-center gap-4 px-6 py-4 rounded-lg transition-all duration-300"
                    style={{
                      fontFamily: '"Rajdhani", sans-serif',
                      letterSpacing: '1px',
                      backgroundColor: currentPage === item.id ? colors.bgColor : 'transparent',
                      color: currentPage === item.id ? 'white' : colors.textLightColor
                    }}
                  >
                    <item.icon size={24} />
                    <span className="text-lg font-semibold">{item.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Download CV */}
          <a
            href="/Chowdhury_Abdulla_Nasir_CV.pdf"
            download="Chowdhury_Abdulla_Nasir_CV.pdf"
            onClick={() => playSound(clickSoundRef)}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 mb-6 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
            style={{
              fontFamily: '"Rajdhani", sans-serif',
              letterSpacing: '1px',
              backgroundColor: colors.medium,
              color: 'white',
              boxShadow: `0 0 20px ${colors.shadowColor}`
            }}
          >
            <Download size={22} />
            <span className="text-lg">Download CV</span>
          </a>

          {/* Social Links */}
          <div style={{ borderTop: `1px solid ${colors.borderColor}`, paddingTop: '1.5rem' }}>
            <p 
              className="text-sm mb-4 tracking-wide" 
              style={{ fontFamily: '"Rajdhani", sans-serif', color: colors.textColor }}
            >
              CONNECT WITH ME
            </p>
            <div className="grid grid-cols-3 gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playSound(clickSoundRef)}
                  className={`flex items-center justify-center p-3 rounded-lg transition-all duration-300 hover:scale-110 ${social.color}`}
                  style={{
                    backgroundColor: colors.bgMediumColor,
                    borderColor: colors.borderColor,
                    color: colors.textColor,
                    border: `1px solid ${colors.borderColor}`
                  }}
                  aria-label={social.name}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {renderPage()}
      </div>

      {/* Inline Styles for Animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Rajdhani:wght@400;600;700&family=Noto+Serif+JP:wght@400;700&family=Yuji+Syuku&display=swap');
        
        @media (hover: hover) and (pointer: fine) {
          * {
            cursor: none !important;
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes flicker {
          0% { opacity: 0.6; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1.05); }
        }

        @keyframes drip {
          0% { opacity: 0.5; transform: translateY(-4px) scale(0.9); }
          100% { opacity: 1; transform: translateY(6px) scale(1.05, 0.95); }
        }

        @keyframes gust {
          0% { opacity: 0.4; transform: translateX(-6px) rotate(-12deg); }
          100% { opacity: 1; transform: translateX(6px) rotate(12deg); }
        }

        @keyframes rumble {
          0% { opacity: 0.7; transform: translateY(0) scale(1); }
          100% { opacity: 1; transform: translateY(2px) scale(1.08); }
        }

        @keyframes emberRise {
          0% { opacity: 0; transform: translate(0, 0); }
          15% { opacity: 0.7; }
          100% { opacity: 0; transform: translate(var(--drift), -40vh); }
        }

        @keyframes bubbleRise {
          0% { opacity: 0; transform: translate(0, 0); }
          15% { opacity: 0.5; }
          35% { transform: translate(8px, -12vh); }
          65% { transform: translate(-8px, -24vh); }
          100% { opacity: 0; transform: translate(4px, -36vh); }
        }

        @keyframes windDraft {
          0% { opacity: 0; transform: translate(-8vw, 0); }
          40% { opacity: 0.16; }
          100% { opacity: 0; transform: translate(30vw, -2vh); }
        }

        @keyframes leafFall {
          0% { opacity: 0; transform: translate(0, 0) rotate(0deg); }
          12% { opacity: 0.7; }
          25% { transform: translate(14px, 9vh) rotate(70deg); }
          50% { transform: translate(-10px, 18vh) rotate(150deg); }
          75% { transform: translate(12px, 27vh) rotate(230deg); }
          100% { opacity: 0; transform: translate(var(--drift), 36vh) rotate(320deg); }
        }
        
        .flame-ring-outer {
          animation: spin-outer 20s linear infinite;
        }
        
        .flame-ring-inner {
          animation: spin-inner 15s linear infinite;
        }
        
        @keyframes spin-outer {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes spin-inner {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }

        @keyframes burstFly {
          0% { transform: translate(0, 0) scale(0.3) rotate(0deg); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translate(var(--dx), var(--dy)) scale(0.7) rotate(30deg); opacity: 0; }
        }

        .interest-burst-butterfly {
          animation-name: burstFly;
          animation-timing-function: ease-out;
          animation-fill-mode: forwards;
        }

        @keyframes cvGlowPulse {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.18); }
        }

        .cv-download-btn {
          animation: cvGlowPulse 3s ease-in-out infinite;
        }

        .cv-download-btn:hover {
          animation: none;
          filter: brightness(1.25);
        }

        @keyframes butterflyFly1 {
          0% {
            transform: translate(-100px, -100px) rotate(0deg);
            opacity: 0;
          }
          5% {
            opacity: 1;
          }
          20% {
            transform: translate(20vw, 25vh) rotate(15deg);
          }
          40% {
            transform: translate(45vw, 15vh) rotate(-10deg);
          }
          60% {
            transform: translate(65vw, 35vh) rotate(20deg);
          }
          80% {
            transform: translate(85vw, 20vh) rotate(-15deg);
          }
          95% {
            opacity: 1;
          }
          100% {
            transform: translate(calc(100vw + 100px), calc(100vh + 100px)) rotate(10deg);
            opacity: 0;
          }
        }

        @keyframes butterflyFly2 {
          0% {
            transform: translate(-100px, 50vh) rotate(0deg);
            opacity: 0;
          }
          5% {
            opacity: 1;
          }
          25% {
            transform: translate(30vw, 60vh) rotate(-20deg);
          }
          50% {
            transform: translate(55vw, 40vh) rotate(15deg);
          }
          75% {
            transform: translate(75vw, 70vh) rotate(-10deg);
          }
          95% {
            opacity: 1;
          }
          100% {
            transform: translate(calc(100vw + 100px), 30vh) rotate(25deg);
            opacity: 0;
          }
        }

        @keyframes butterflyFly3 {
          0% {
            transform: translate(50vw, -100px) rotate(0deg);
            opacity: 0;
          }
          5% {
            opacity: 1;
          }
          20% {
            transform: translate(35vw, 20vh) rotate(30deg);
          }
          45% {
            transform: translate(60vw, 50vh) rotate(-15deg);
          }
          70% {
            transform: translate(40vw, 75vh) rotate(20deg);
          }
          95% {
            opacity: 1;
          }
          100% {
            transform: translate(-100px, calc(100vh + 100px)) rotate(-25deg);
            opacity: 0;
          }
        }

        @keyframes butterflyFly4 {
          0% {
            transform: translate(calc(100vw + 100px), 30vh) rotate(0deg);
            opacity: 0;
          }
          5% {
            opacity: 1;
          }
          30% {
            transform: translate(70vw, 45vh) rotate(-25deg);
          }
          55% {
            transform: translate(40vw, 60vh) rotate(15deg);
          }
          80% {
            transform: translate(20vw, 35vh) rotate(-20deg);
          }
          95% {
            opacity: 1;
          }
          100% {
            transform: translate(-100px, -100px) rotate(10deg);
            opacity: 0;
          }
        }

        @keyframes butterflyFly5 {
          0% {
            transform: translate(30vw, calc(100vh + 100px)) rotate(0deg);
            opacity: 0;
          }
          5% {
            opacity: 1;
          }
          25% {
            transform: translate(50vw, 70vh) rotate(20deg);
          }
          50% {
            transform: translate(70vw, 45vh) rotate(-15deg);
          }
          75% {
            transform: translate(50vw, 25vh) rotate(25deg);
          }
          95% {
            opacity: 1;
          }
          100% {
            transform: translate(80vw, -100px) rotate(-10deg);
            opacity: 0;
          }
        }

        @keyframes butterflyWingLeft {
          0%, 100% { transform: rotateY(0deg); }
          50% { transform: rotateY(-45deg); }
        }

        @keyframes butterflyWingRight {
          0%, 100% { transform: rotateY(0deg); }
          50% { transform: rotateY(45deg); }
        }

        .butterfly-container-1 {
          animation: butterflyFly1 12s ease-in-out forwards;
        }

        .butterfly-container-2 {
          animation: butterflyFly2 12s ease-in-out forwards;
        }

        .butterfly-container-3 {
          animation: butterflyFly3 12s ease-in-out forwards;
        }

        .butterfly-container-4 {
          animation: butterflyFly4 12s ease-in-out forwards;
        }

        .butterfly-container-5 {
          animation: butterflyFly5 12s ease-in-out forwards;
        }

        .butterfly-wing-left {
          animation: butterflyWingLeft 0.3s ease-in-out infinite;
        }

        .butterfly-wing-right {
          animation: butterflyWingRight 0.3s ease-in-out infinite;
        }
        
        @keyframes shimmer {
        0% {
            background-position: -200% center;
        }
        100% {
            background-position: 200% center;
        }
        }

        .kanji-shimmer {
        background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.9) 0%,
            rgba(255, 255, 255, 0.9) 40%,
            rgba(255, 255, 255, 1) 50%,
            rgba(255, 255, 255, 0.9) 60%,
            rgba(255, 255, 255, 0.9) 100%
        );
        background-size: 200% 100%;
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: shimmer 2s ease-in-out infinite;
        animation-iteration-count: 1;
        animation-delay: 0s;
        }

        .kanji-shimmer-loop {
        animation: shimmer 2s ease-in-out;
        animation-delay: 0s;
        }
      `}</style>
    </div>
  );
}

// Cursor Component
function CustomCursor({ colors }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkTouchDevice = () => {
      return (
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0
      );
    };
    
    setIsTouchDevice(checkTouchDevice());

    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      const isClickable = target.closest('a, button, input, textarea, [role="button"]');
      setIsPointer(!!isClickable);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  if (isTouchDevice) {
    return null;
  }

  return (
    <>
      <div
        className="fixed pointer-events-none z-50 mix-blend-difference"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div
          className="rounded-full transition-all duration-150"
          style={{
            backgroundColor: colors.cursorColor,
            width: isPointer ? '12px' : '8px',
            height: isPointer ? '12px' : '8px',
            boxShadow: `0 0 10px ${colors.cursorColor}`,
          }}
        />
      </div>

      <div
        className="fixed pointer-events-none z-50"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div
          className="rounded-full transition-all duration-300"
          style={{
            width: isPointer ? '48px' : '40px',
            height: isPointer ? '48px' : '40px',
            border: `2px solid ${colors.cursorColor}`,
            backgroundColor: isPointer ? `${colors.rgbaColor}0.1)` : `${colors.rgbaColor}0.05)`,
            boxShadow: isPointer
              ? `0 0 30px ${colors.shadowColor}, inset 0 0 20px ${colors.rgbaColor}0.2)`
              : `0 0 20px ${colors.shadowColor}, inset 0 0 15px ${colors.rgbaColor}0.1)`,
          }}
        />
      </div>
    </>
  );
}

// Butterfly Component
function FlyingButterfly({ animationClass, delay = 0, colors }) {
  const gradient = {
    wingGradient: 'url(#leftWingGradient)',
    wingColor1: colors.medium,
    wingColor2: colors.dark,
    wingColor3: colors.darker,
    bodyGradient: `${colors.rgbaColor}0.6)`,
    dotColor: colors.darkest
  };

  return (
    <div 
      className={`${animationClass} fixed pointer-events-none z-30`} 
      style={{ 
        left: 0, 
        top: 0,
        animationDelay: `${delay}s`
      }}
    >
      <div className="relative" style={{ width: '30px', height: '30px' }}>
        <div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full z-10"
          style={{
            background: `linear-gradient(to bottom, ${colors.dark}, ${colors.darkest})`,
            boxShadow: `0 0 4px ${gradient.bodyGradient}`
          }}
        />
        
        <div className="butterfly-wing-left absolute left-0 top-1/2 -translate-y-1/2 origin-right">
          <svg width="15" height="20" viewBox="0 0 30 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M28 20C28 28 22 38 15 38C8 38 5 30 5 20C5 10 8 2 15 2C22 2 28 12 28 20Z" 
                  fill={gradient.wingGradient} 
                  stroke={gradient.wingColor3} 
                  strokeWidth="1"
                  filter="url(#glow)" />
            <circle cx="18" cy="15" r="3" fill={gradient.dotColor} opacity="0.6" />
            <circle cx="20" cy="25" r="2" fill={gradient.dotColor} opacity="0.4" />
            <defs>
              <linearGradient id="leftWingGradient" x1="5" y1="2" x2="28" y2="38">
                <stop offset="0%" stopColor={gradient.wingColor1} />
                <stop offset="50%" stopColor={gradient.wingColor2} />
                <stop offset="100%" stopColor={gradient.wingColor3} />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
          </svg>
        </div>
        
        <div className="butterfly-wing-right absolute right-0 top-1/2 -translate-y-1/2 origin-left">
          <svg width="15" height="20" viewBox="0 0 30 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 20C2 28 8 38 15 38C22 38 25 30 25 20C25 10 22 2 15 2C8 2 2 12 2 20Z" 
                  fill={gradient.wingGradient} 
                  stroke={gradient.wingColor3} 
                  strokeWidth="1"
                  filter="url(#glow2)" />
            <circle cx="12" cy="15" r="3" fill={gradient.dotColor} opacity="0.6" />
            <circle cx="10" cy="25" r="2" fill={gradient.dotColor} opacity="0.4" />
            <defs>
              <linearGradient id="rightWingGradient" x1="25" y1="2" x2="2" y2="38">
                <stop offset="0%" stopColor={gradient.wingColor1} />
                <stop offset="50%" stopColor={gradient.wingColor2} />
                <stop offset="100%" stopColor={gradient.wingColor3} />
              </linearGradient>
              <filter id="glow2">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
          </svg>
        </div>

        <div 
          className="absolute left-1/2 top-0 -translate-x-1 w-0.5 h-1.5 rounded-full origin-bottom"
          style={{ 
            backgroundColor: colors.darker,
            transform: 'translateX(-1px) rotate(-20deg)' 
          }} 
        />
        <div 
          className="absolute left-1/2 top-0 translate-x-0.5 w-0.5 h-1.5 rounded-full origin-bottom"
          style={{ 
            backgroundColor: colors.darker,
            transform: 'translateX(1px) rotate(20deg)' 
          }} 
        />
      </div>
    </div>
  );
}

// Background particles: amber embers rise (fire), bubbles rise (water),
// faint drafts drift sideways (wind), leaves sway down (earth)
const emberAmbers = ['#f59e0b', '#fbbf24', '#d97706'];

function ElementParticles({ element, colors }) {
  // Seeded pseudo-random so the layout stays put across mouse-move re-renders
  const seed = [...element].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const rand = (n) => {
    const x = Math.sin(n * 12.9898 + seed) * 43758.5453;
    return x - Math.floor(x);
  };
  const specs = [...Array(30)].map((_, i) => ({
    left: rand(i * 6 + 1) * 100,
    top: rand(i * 6 + 2) * 100,
    size: rand(i * 6 + 3),
    duration: rand(i * 6 + 4),
    delay: rand(i * 6 + 5) * 8,
    drift: (rand(i * 6 + 6) - 0.5) * 80,
    variant: i % 3,
  }));

  const renderParticle = (p, i) => {
    const key = `${element}-${i}`;
    const base = { left: `${p.left}%`, top: `${p.top}%`, '--drift': `${p.drift}px`, animationDelay: `-${p.delay}s` };
    if (element === 'water') {
      const s = 5 + p.size * 9;
      return (
        <div key={key} className="absolute" style={{
          ...base, width: s, height: s, borderRadius: '50%',
          border: `1px solid ${colors.rgbaColor}0.7)`,
          background: `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.55), ${colors.rgbaColor}0.08) 45%, transparent 70%)`,
          animation: `bubbleRise ${8 + p.duration * 8}s ease-in-out infinite`
        }} />
      );
    }
    if (element === 'wind') {
      // Only a third of the slots, faint and slow, so the drafts stay in the background
      if (i % 3 !== 0) return null;
      const w = 90 + p.size * 110;
      return (
        <svg key={key} className="absolute" width={w} height={24} viewBox="0 0 120 24" fill="none" style={{
          ...base, left: `${p.left * 0.7}%`,
          animation: `windDraft ${10 + p.duration * 6}s ease-in-out infinite`
        }}>
          <path d="M0 16 C 25 6, 50 20, 78 10 S 112 6, 120 12" stroke={colors.lighter} strokeWidth="1" strokeLinecap="round" />
          <path d="M20 21 C 45 14, 70 23, 100 17" stroke={colors.lighter} strokeWidth="0.75" strokeLinecap="round" opacity="0.6" />
        </svg>
      );
    }
    if (element === 'earth') {
      const s = 7 + p.size * 6;
      const leaf = p.variant === 1 ? colors.lighter : colors.particleColor;
      return (
        <div key={key} className="absolute" style={{
          ...base, width: s, height: s, borderRadius: '0 70% 0 70%',
          // the darker diagonal is the leaf's midrib, running tip to tip
          background: `linear-gradient(45deg, ${leaf} 47%, rgba(0, 0, 0, 0.3) 50%, ${leaf} 53%)`,
          animation: `leafFall ${10 + p.duration * 8}s linear infinite`
        }} />
      );
    }
    const s = 2 + p.size * 2.5;
    const amber = emberAmbers[p.variant];
    return (
      <div key={key} className="absolute" style={{
        ...base, width: s, height: s, borderRadius: '50%',
        backgroundColor: amber, boxShadow: `0 0 6px ${amber}, 0 0 12px rgba(251, 191, 36, 0.4)`,
        animation: `emberRise ${6 + p.duration * 8}s ease-out infinite`
      }} />
    );
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {specs.map(renderParticle)}
    </div>
  );
}

function MultipleButterflies({ colors }) {
  return (
    <>
      <FlyingButterfly animationClass="butterfly-container-1" delay={0} colors={colors} />
      <FlyingButterfly animationClass="butterfly-container-2" delay={1.5} colors={colors} />
      <FlyingButterfly animationClass="butterfly-container-3" delay={3} colors={colors} />
      <FlyingButterfly animationClass="butterfly-container-4" delay={4.5} colors={colors} />
      <FlyingButterfly animationClass="butterfly-container-5" delay={6} colors={colors} />
    </>
  );
}

// Home Page Component - FIXED NAVIGATION
function HomePage({ playSound, clickSoundRef, element, setElement, colors, profileImage, setProfileImage }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showButterflies, setShowButterflies] = useState(true);
  const [cardBursts, setCardBursts] = useState([]);
  const navigate = useNavigate();

  const spawnCardBurst = (event) => {
    const burstId = Date.now() + Math.random();
    setCardBursts((prev) => [...prev, { id: burstId, x: event.clientX, y: event.clientY }]);
    setTimeout(() => {
      setCardBursts((prev) => prev.filter((b) => b.id !== burstId));
    }, 900);
  };

  const handleNavigateToBlog = () => {
    playSound(clickSoundRef);
    navigate('/blog');
  };

  useEffect(() => {
    setIsLoaded(true);
    setShowButterflies(true);
    
    const timer = setTimeout(() => {
      setShowButterflies(false);
    }, 12000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
  const shimmerInterval = setInterval(() => {
    const kanjiElement = document.querySelector('.kanji-title');
    if (kanjiElement) {
      kanjiElement.classList.add('kanji-shimmer-loop');
      setTimeout(() => {
        kanjiElement.classList.remove('kanji-shimmer-loop');
      }, 2000);
    }
  }, 10000);

  return () => clearInterval(shimmerInterval);
 }, []);

 const elementOrder = ['fire', 'water', 'wind', 'earth'];

 const handleElementChange = () => {
   playSound(clickSoundRef);
   setElement(prev => elementOrder[(elementOrder.indexOf(prev) + 1) % elementOrder.length]);
 };

 // Colours come from the element's palette; this sets the ring's icon and motion.
 // pace = [base, random spread] in seconds for each icon's motion.
 const elementConfig = {
   fire: { Icon: Flame, motion: 'flicker', pace: [0.5, 0.5], outerSpin: '20s', innerSpin: '15s' },
   water: { Icon: Droplet, motion: 'drip', pace: [1.2, 0.8], outerSpin: '32s', innerSpin: '26s' },
   wind: { Icon: Wind, motion: 'gust', pace: [0.8, 0.6], outerSpin: '8s', innerSpin: '6s' },
   earth: { Icon: Mountain, motion: 'rumble', pace: [1.8, 1.0], outerSpin: '60s', innerSpin: '45s' },
 };
 const ring = elementConfig[element];

 const imageArray = ['/doflamingo.png', '/a.jpg', '/b.jpg', '/c.jpg', '/d.jpg', '/e.jpg', '/f.jpg', '/g.jpg', '/h.jpg', '/i.jpg', '/j.jpg', '/k.jpg', '/l.jpg', '/m.jpg', '/n.jpg', '/o.jpg', '/p.jpg', '/q.jpg',];
 
 const handleImageChange = () => {
   playSound(clickSoundRef);
   setProfileImage(prevImage => {
     const currentIndex = imageArray.indexOf(prevImage);
     const nextIndex = (currentIndex + 1) % imageArray.length;
     return imageArray[nextIndex];
   });
 };

 // Photos the Frontend card steps through (web-sized copies in public/frontend)
 const frontendImages = [
   '/frontend/01-office-selfie.jpg',
   '/frontend/02-lab-desk.jpg',
   '/frontend/03-beach.jpg',
   '/frontend/04-harbor-dome.jpg',
   '/frontend/05-harbor-ship.jpg',
   '/frontend/06-harbor-night.jpg',
   '/frontend/07-bbq-group.jpg',
   '/frontend/08-bbq-fire.jpg',
   '/frontend/09-dinner.jpg',
   '/frontend/10-dinner-friends.jpg',
 ];

 const handleFrontendImageChange = () => {
   playSound(clickSoundRef);
   setProfileImage(prevImage => {
     // indexOf is -1 for the starting photo, so the first press shows frontendImages[0]
     const nextIndex = (frontendImages.indexOf(prevImage) + 1) % frontendImages.length;
     return frontendImages[nextIndex];
   });
 };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12">
      {showButterflies && <MultipleButterflies colors={colors} />}
      {cardBursts.map((b) => <InterestBurst key={b.id} x={b.x} y={b.y} colors={colors} />)}

      <div
        className="w-full max-w-4xl mb-12 transition-all duration-1000"
        style={{
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'translateY(0)' : 'translateY(-40px)'
        }}
      >
        <div 
          className="h-px"
          style={{
            background: `linear-gradient(to right, transparent, ${colors.medium}, transparent)`
          }}
        />
        <div className="flex justify-center -mt-3">
          <Sword style={{ color: colors.medium }} size={24} />
        </div>
      </div>

      <div 
        className="relative mb-12 transition-all duration-1000"
        style={{
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'scale(1)' : 'scale(0.9)',
          transitionDelay: '300ms'
        }}
      >
        <div 
          className="absolute inset-0 blur-3xl rounded-full opacity-30" 
          style={{ 
            backgroundColor: colors.medium,
            transform: 'scale(1.1)'
          }}
        />

        <div className="relative w-80 h-80 flex items-center justify-center">
          <div className="absolute inset-0 flame-ring-outer" style={{ animationDuration: ring.outerSpin }}>
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute top-1/2 left-1/2"
                style={{
                  transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-160px)`,
                }}
              >
                <ring.Icon
                  style={{
                    color: colors.medium,
                    opacity: 0.7,
                    filter: `drop-shadow(0 0 10px ${colors.shadowColor})`,
                    animation: `${ring.motion} ${ring.pace[0] + Math.random() * ring.pace[1]}s infinite alternate`
                  }}
                  size={32}
                />
              </div>
            ))}
          </div>

          <div className="absolute inset-0 flame-ring-inner" style={{ animationDuration: ring.innerSpin }}>
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute top-1/2 left-1/2"
                style={{
                  transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-172px)`,
                }}
              >
                <ring.Icon
                  style={{
                    color: colors.accent,
                    opacity: 0.6,
                    filter: `drop-shadow(0 0 8px ${colors.accent})`,
                    animation: `${ring.motion} ${ring.pace[0] + 0.1 + Math.random() * ring.pace[1] * 0.8}s infinite alternate`
                  }}
                  size={24}
                />
              </div>
            ))}
          </div>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div 
              className="w-80 h-80 rounded-full border-4 opacity-40"
              style={{
                borderColor: colors.ring,
                boxShadow: `0 0 30px rgba(${colors.ringRgb}, 0.5), inset 0 0 30px rgba(${colors.ringRgb}, 0.3)`
              }}
            />
          </div>

          <div 
            className="relative w-72 h-72 rounded-full overflow-hidden border-8 bg-gradient-to-br from-gray-800 to-gray-900 z-10"
            style={{
              borderColor: colors.darker,
              boxShadow: '0 0 50px rgba(0, 0, 0, 0.8), inset 0 0 30px rgba(0, 0, 0, 0.5)'
            }}
          >
            <img 
              src={profileImage}
              alt="Chowdhury Abdulla Nasir" 
              className="w-full h-full object-cover transition-all duration-500"
            />
          </div>

          <div 
            className="absolute inset-0 rounded-full pointer-events-none z-20"
            style={{
              background: `radial-gradient(circle, transparent 40%, ${colors.rgbaColor}0.1))`
            }}
          />
        </div>
      </div>

      <div 
        className="text-center mb-8 transition-all duration-1000"
        style={{
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'translateY(0)' : 'translateY(40px)',
          transitionDelay: '700ms'
        }}
      >
        <h1 
          className="kanji-title text-6xl md:text-7xl font-bold mb-4"
          style={{ 
            fontFamily: '"Cinzel", serif',
            textShadow: `0 0 20px ${colors.shadowColor}, 0 0 40px rgba(0, 0, 0, 0.8)`,
            color: colors.textLighterColor
          }}
        >
          蝶踊り
        </h1>
        <div className="flex items-center justify-center gap-4">
          <div 
            className="h-px w-12" 
            style={{ backgroundColor: colors.medium }} 
          />
          <p 
            className="text-xl tracking-widest uppercase" 
            style={{ 
              fontFamily: '"Rajdhani", sans-serif',
              color: colors.textColor
            }}
          >
            Chowdhury Abdulla Nasir
          </p>
          <div 
            className="h-px w-12" 
            style={{ backgroundColor: colors.medium }} 
          />
        </div>
        <p 
          className="mt-4 text-sm tracking-wide" 
          style={{ 
            fontFamily: '"Noto Serif JP", serif',
            color: colors.textLightColor
          }}
        >
          道 • M1 Student @ CVLab, University of Tsukuba
        </p>
      </div>

      <div 
        className="max-w-2xl text-center mb-12 transition-all duration-1000"
        style={{
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'translateY(0)' : 'translateY(40px)',
          transitionDelay: '1000ms'
        }}
      >
        <p className="text-gray-300 text-lg leading-relaxed mb-6" style={{ fontFamily: '"Rajdhani", sans-serif' }}>
          Every project a testament to discipline and Every paper a testament to mastery.
        </p>
      </div>

      <div
        className="mb-12 transition-all duration-1000"
        style={{
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'translateY(0)' : 'translateY(40px)',
          transitionDelay: '1100ms'
        }}
      >
        <a
          href="/Chowdhury_Abdulla_Nasir_CV.pdf"
          download="Chowdhury_Abdulla_Nasir_CV.pdf"
          onClick={() => playSound(clickSoundRef)}
          className="cv-download-btn group relative inline-flex items-center gap-4 px-9 py-4 rounded-full transition-transform duration-300 hover:scale-105"
          style={{
            border: `1px solid ${colors.borderLightColor}`,
            boxShadow: `0 0 25px ${colors.shadowColor}`,
          }}
        >
          <span
            className="text-3xl leading-none"
            style={{ fontFamily: '"Yuji Syuku", serif', color: colors.lighter }}
          >
            書
          </span>
          <span
            className="text-base font-semibold tracking-[0.2em] uppercase"
            style={{ fontFamily: '"Rajdhani", sans-serif', color: colors.textLighterColor }}
          >
            Download CV
          </span>
          <Download
            size={20}
            style={{ color: colors.textColor }}
            className="transition-transform duration-300 group-hover:translate-y-1"
          />
        </a>
      </div>

      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mb-12 transition-all duration-1000"
        style={{
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'translateY(0)' : 'translateY(40px)',
          transitionDelay: '1200ms'
        }}
      >
        {[
          { title: 'フロントエンド', subtitle: 'Frontend Mastery', desc: 'React, Vue, Next.js', action: handleFrontendImageChange },
          { title: 'デザイン', subtitle: 'Design Philosophy', desc: 'UI/UX, Responsive Design', action: handleElementChange },
          { title: 'バックエンド', subtitle: 'Backend Arts', desc: 'Node, Python, Databases', action: handleNavigateToBlog },
        ].map((skill, i) => (
          <div
            key={i}
            className="relative group"
            onClick={(e) => {
              spawnCardBurst(e);
              if (skill.action) skill.action();
            }}
            style={{ cursor: skill.action ? 'pointer' : 'default' }}
          >
            <div 
              className="absolute inset-0 rounded-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300"
              style={{
                background: `linear-gradient(to bottom right, ${colors.dark}, ${colors.darkest})`
              }}
            />
            <div 
              className="relative rounded-lg p-6 backdrop-blur-sm bg-black/40 transition-all duration-300 hover:scale-105"
              style={{ 
                boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
                border: `1px solid ${colors.borderColor}`
              }}
            >
              <h3
                className="text-4xl mb-2"
                style={{
                  fontFamily: '"Yuji Syuku", "Noto Serif JP", serif',
                  color: colors.textColor
                }}
              >
                {skill.title}
              </h3>
              <p 
                className="font-semibold mb-2 tracking-wide" 
                style={{ 
                  fontFamily: '"Rajdhani", sans-serif',
                  color: colors.textLightColor
                }}
              >
                {skill.subtitle}
              </p>
              <p className="text-gray-400 text-sm">
                {skill.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div 
        className="w-full max-w-4xl mt-12 transition-all duration-1000"
        style={{
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'translateY(0)' : 'translateY(40px)',
          transitionDelay: '1600ms'
        }}
      >
        <div className="flex justify-center mb-3">
          <Wind style={{ color: colors.medium }} size={24} />
        </div>
        <div 
          className="h-px"
          style={{
            background: `linear-gradient(to right, transparent, ${colors.medium}, transparent)`
          }}
        />
      </div>
    </div>
  );
}

// Research Page Component
const RESEARCH_INTERESTS = ['Computer Vision', '3D Point Cloud Processing', 'Subspace Methods', 'Statistical Modeling'];

const INTEREST_TAG_MAP = {
  'Computer Vision': ['Computer Vision'],
  '3D Point Cloud Processing': ['3D Point Clouds'],
  'Subspace Methods': ['Subspace Methods'],
  'Statistical Modeling': ['Statistics'],
};

function InterestBurst({ x, y, colors }) {
  const butterflies = [0, 1, 2, 3, 4, 5].map((i) => {
    const angle = (i * 60 + (Math.random() * 30 - 15)) * (Math.PI / 180);
    const distance = 40 + Math.random() * 35;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance - 20;
    const duration = 0.5 + Math.random() * 0.25;
    return { id: i, dx, dy, duration, delay: Math.random() * 0.08 };
  });

  return (
    <div className="fixed pointer-events-none z-[70]" style={{ left: x, top: y }}>
      {butterflies.map((b) => (
        <div
          key={b.id}
          className="interest-burst-butterfly absolute"
          style={{
            '--dx': `${b.dx}px`,
            '--dy': `${b.dy}px`,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
          }}
        >
          <svg width="14" height="18" viewBox="0 0 30 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 20C15 20 2 10 2 20C2 30 8 38 15 38C22 38 28 30 28 20C28 10 15 20 15 20Z"
                  fill="url(#burstWingGradient)" stroke={colors.darker} strokeWidth="0.75" />
            <line x1="15" y1="6" x2="15" y2="24" stroke={colors.darkest} strokeWidth="1.5" strokeLinecap="round" />
            <defs>
              <linearGradient id="burstWingGradient" x1="2" y1="10" x2="28" y2="38">
                <stop offset="0%" stopColor={colors.lighter} />
                <stop offset="50%" stopColor={colors.particleColor} />
                <stop offset="100%" stopColor={colors.dark} />
              </linearGradient>
            </defs>
          </svg>
        </div>
      ))}
    </div>
  );
}

function ResearchPage({ playSound, clickSoundRef, colors }) {
  const [showButterflies, setShowButterflies] = useState(true);
  const [activeInterest, setActiveInterest] = useState(null);
  const [bursts, setBursts] = useState([]);

  const handleInterestClick = (interest, event) => {
    playSound(clickSoundRef);
    const x = event.clientX;
    const y = event.clientY;
    const burstId = Date.now() + Math.random();
    setBursts((prev) => [...prev, { id: burstId, x, y }]);
    setTimeout(() => {
      setBursts((prev) => prev.filter((b) => b.id !== burstId));
    }, 900);
    setActiveInterest((prev) => (prev === interest ? null : interest));
  };

  useEffect(() => {
    setShowButterflies(true);
    const timer = setTimeout(() => setShowButterflies(false), 12000);
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    const shimmerInterval = setInterval(() => {
      const kanjiElement = document.querySelector('.kanji-title');
      if (kanjiElement) {
        kanjiElement.classList.add('kanji-shimmer-loop');
        setTimeout(() => {
          kanjiElement.classList.remove('kanji-shimmer-loop');
        }, 2000);
      }
    }, 10000);

    return () => clearInterval(shimmerInterval);
  }, []);
  
  const publications = [
    {
      title: 'Subspace Representation for Point Cloud Surface Inspection under Synthetic-to-Real Domain Shift',
      authors: 'A.N. Chowdhury, et al.',
      venue: 'ACCV 2026',
      status: 'Accepted',
      abstract: 'We test subspace classifiers for robustness to synthetic-to-real domain shift on point cloud surface inspection: an end-to-end U-Net, PointNet++, a nearest-subspace rule on frozen features, and training-free shape subspaces, evaluated on four fuselage scans and 597 annotated Real3D-AD objects. The nearest-subspace margin is the only decision rule whose operating point survives the real feature shift.',
      link: null,
      tags: ['Computer Vision', '3D Point Clouds', 'Subspace Methods']
    },
    {
      title: 'Do We Still Need Rotation-Invariant Architectures? A Statistical Robustness Benchmark for Point Cloud Classification',
      authors: 'A.N. Chowdhury, et al.',
      venue: 'WACV 2027, Datasets Track',
      status: 'Accepted',
      abstract: 'A statistically powered benchmark of 10 point cloud architectures across 5 domains under pose, noise, and occlusion. Rotation-invariant architectures achieve the best pose robustness but rank among the lowest on noise robustness, a statistically significant trade-off; a simple invariance loss narrows this gap on unseen corruptions without transferring across corruption families.',
      link: 'https://abdullah-nasir-chowdhury.github.io/pcr-mock-playground/',
      linkLabel: 'VIEW INTERACTIVE DEMO',
      tags: ['Computer Vision', 'Statistics', 'Robustness']
    },
    {
      title: 'Prototype and Simulation of a Real-Time GPS and PTS Architecture',
      authors: 'A.N. Chowdhury, et al.',
      venue: '2025 International Conference on Quantum Photonics, Artificial Intelligence, and Networking (QPAIN)',
      status: 'Published',
      abstract: 'Our research paper explores the creation of a realtime Global Positioning System (GPS) and Passenger Tracking System (PTS), covering simulation, hardware setup, and prototype evaluation. ',
      link: 'https://ieeexplore.ieee.org/document/11172005',
      tags: ['Embedded Systems', 'IoT']
    },
    {
      title: 'Performance Analysis of Tesseract and EasyOCR on the Novel Bangla-CrossHair Dataset',
      authors: 'A.N. Chowdhury, et al.',
      venue: '2025 3rd International Conference on Intelligent Systems, Advanced Computing and Communication (ISACC)',
      status: 'Published',
      abstract: 'This paper presents a comparative study of key metrics for OCR engines in Bangla language processing. PyTesseract (a Python wrapper for Tesseract OCR) and EasyOCR were benchmarked on a novel dataset, "Bangla-CrossHair," created for testing OCR engines. ',
      link: 'https://ieeexplore.ieee.org/document/10969286',
      tags: ['Machine Learning', 'OCR']
    },
    {
      title: 'ALPR: ResNet50 powered Bangla License Plate Detection and OCR using Root Mean Square Prop Optimizer and Linear SVM Classifier',
      authors: 'A.N. Chowdhury, et al.',
      venue: '2024 IEEE 9th International Conference for Convergence in Technology (I2CT)',
      status: 'Published',
      abstract: 'This paper implements the MATLAB Image Processing Toolbox in detecting the license plate region using several user-defined functions in order to pre-process and process the image up until the point of extraction of characters.',
      link: 'https://ieeexplore.ieee.org/document/10543675',
      tags: ['Computer Vision', 'Deep Learning']
    },
    {
      title: 'Code Poisoning Through Misleading Comments: Jailbreaking Large Language Models via Contextual Deception',
      authors: 'A.A. Sami, G. Debnath, R. Dey, A.N. Chowdhury',
      venue: '2025 28th International Conference on Computer and Information Technology (ICCIT)',
      status: 'Published',
      abstract: 'This study investigates the vulnerability of Large Language Models (LLMs) to code poisoning attacks through misleading comments. By embedding deceptive comments within code snippets, we demonstrate how LLMs can be manipulated into generating harmful or unintended outputs.',
      link: 'https://www.researchgate.net/publication/400360433_Code_Poisoning_Through_Misleading_Comments_Jailbreaking_Large_Language_Models_via_Contextual_Deception',
      tags: ['Machine Learning', 'Security', 'LLMs']
    },
  ];

  const visiblePublications = activeInterest
    ? publications.filter((pub) => pub.tags.some((t) => INTEREST_TAG_MAP[activeInterest]?.includes(t)))
    : publications;

  const profiles = [
    {
      name: 'Google Scholar',
      icon: '学',
      link: 'https://scholar.google.com/citations?user=tHsPqpkAAAAJ&hl=en',
      description: 'Citation metrics & publications'
    },
    {
      name: 'ResearchGate',
      icon: '究',
      link: 'https://www.researchgate.net/profile/Abdulla-Chowdhury?ev=hdr_xprf&_tp=eyJjb250ZXh0Ijp7ImZpcnN0UGFnZSI6InB1YmxpY2F0aW9uIiwicGFnZSI6ImhvbWUiLCJwcmV2aW91c1BhZ2UiOiJsb2dpbiIsInBvc2l0aW9uIjoiZ2xvYmFsSGVhZGVyIn19',
      description: 'Research network & collaborations'
    },
    {
      name: 'IEEE Xplore',
      icon: '電',
      link: 'https://ieeexplore.ieee.org/author/580270477937590',
      description: 'IEEE publications & proceedings'
    }
  ];

  return (
    <div className="min-h-screen px-6 py-24">
      {showButterflies && <MultipleButterflies colors={colors} />}
      {bursts.map((b) => <InterestBurst key={b.id} x={b.x} y={b.y} colors={colors} />)}

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16 fade-in">
          <h1
            className="kanji-title text-5xl md:text-6xl font-bold mb-4"
            style={{
              fontFamily: '"Cinzel", serif',
              textShadow: `0 0 20px ${colors.shadowColor}`,
              color: colors.textLighterColor
            }}
          >
            研究 • Research
          </h1>
          <p 
            className="text-lg" 
            style={{ 
              fontFamily: '"Rajdhani", sans-serif',
              color: colors.textColor
            }}
          >
            CVLab, University of Tsukuba, Japan
          </p>
        </div>

        <div className="mb-12 fade-in" style={{ animationDelay: '0.1s' }}>
          <h2 
            className="text-2xl font-bold mb-6" 
            style={{ 
              fontFamily: '"Rajdhani", sans-serif',
              color: colors.textColor
            }}
          >
            ACADEMIC PROFILES
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            {profiles.map((profile, i) => (
            <a
                key={i}
                href={profile.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playSound(clickSoundRef)}
                className="p-6 rounded-lg bg-black/40 backdrop-blur-sm transition-all duration-300 group"
                style={{ 
                  boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
                  border: `1px solid ${colors.borderColor}`
                }}
              >
                <div 
                  className="text-5xl mb-3 font-bold group-hover:scale-110 transition-transform duration-300 text-center"
                  style={{ 
                    fontFamily: '"Noto Serif JP", "Hiragino Mincho ProN", "Yu Mincho", serif',
                    textShadow: `0 0 15px ${colors.shadowColor}`,
                    color: colors.lighter
                  }}
                >
                  {profile.icon}
                </div>
                <h3 
                  className="text-xl font-bold mb-2" 
                  style={{ 
                    fontFamily: '"Rajdhani", sans-serif',
                    color: colors.textLightColor
                  }}
                >
                  {profile.name}
                </h3>
                <p className="text-gray-400 text-sm">{profile.description}</p>
              </a>
            ))}
          </div>
        </div>

        <div className="mb-12 fade-in" style={{ animationDelay: '0.2s' }}>
          <h2 
            className="text-2xl font-bold mb-6" 
            style={{ 
              fontFamily: '"Rajdhani", sans-serif',
              color: colors.textColor
            }}
          >
            RESEARCH INTERESTS
          </h2>
          <p className="text-gray-500 text-sm mb-4" style={{ fontFamily: '"Rajdhani", sans-serif' }}>
            Tap an interest to filter the publications below. Tap it again to show all.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {RESEARCH_INTERESTS.map((interest, i) => {
              const isActive = activeInterest === interest;
              return (
                <button
                  key={i}
                  onClick={(e) => handleInterestClick(interest, e)}
                  className="p-4 rounded-lg bg-black/40 backdrop-blur-sm text-left transition-all duration-300"
                  style={{
                    border: `1px solid ${isActive ? colors.particleColor : colors.borderColor}`,
                    backgroundColor: isActive ? `${colors.rgbaColor}0.18)` : undefined,
                    boxShadow: isActive ? `0 0 22px ${colors.rgbaColor}0.55)` : 'none',
                    transform: isActive ? 'scale(1.03)' : 'scale(1)',
                  }}
                >
                  <p
                    style={{
                      fontFamily: '"Rajdhani", sans-serif',
                      color: isActive ? colors.lighter : colors.textLightColor,
                      fontWeight: isActive ? 700 : 400,
                    }}
                  >
                    {interest}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="fade-in" style={{ animationDelay: '0.4s' }}>
          <h2
            className="text-2xl font-bold mb-6"
            style={{
              fontFamily: '"Rajdhani", sans-serif',
              color: colors.textColor
            }}
          >
            PUBLICATIONS {activeInterest && <span className="text-base font-normal" style={{ color: colors.textColor }}>— filtered by {activeInterest}</span>}
          </h2>
          <div className="space-y-6">
            {visiblePublications.map((pub, i) => (
              <div 
                key={i}
                className="p-6 rounded-lg bg-black/40 backdrop-blur-sm transition-all duration-300"
                style={{ 
                  boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
                  border: `1px solid ${colors.borderMediumColor}`
                }}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3
                    className="text-xl font-bold"
                    style={{
                      fontFamily: '"Rajdhani", sans-serif',
                      color: colors.textLightColor
                    }}
                  >
                    {pub.title}
                  </h3>
                  {pub.status && (
                    <span
                      className="shrink-0 px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap"
                      style={{
                        backgroundColor: pub.status !== 'Under Review' ? `${colors.rgbaColor}0.25)` : 'rgba(107,114,128,0.25)',
                        color: pub.status !== 'Under Review' ? colors.textLightColor : '#d1d5db',
                        border: `1px solid ${pub.status !== 'Under Review' ? colors.borderMediumColor : '#6b7280'}`
                      }}
                    >
                      {pub.status.toUpperCase()}
                    </span>
                  )}
                </div>
                <p style={{ color: colors.textColor }}>{pub.authors}</p>
                <p className="text-gray-400 italic mb-3">{pub.venue}</p>
                <p className="text-gray-300 mb-4">{pub.abstract}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {pub.tags.map((tag, j) => (
                    <span
                      key={j}
                      className="px-3 py-1 text-sm rounded-full"
                      style={{
                        backgroundColor: `${colors.rgbaColor}0.2)`,
                        color: colors.textLightColor,
                        border: `1px solid ${colors.borderMediumColor}`
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {pub.link && (
                  <a
                    href={pub.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => playSound(clickSoundRef)}
                    className="inline-block px-6 py-2 text-white rounded transition-colors"
                    style={{
                      fontFamily: '"Rajdhani", sans-serif',
                      backgroundColor: colors.medium
                    }}
                  >
                    {pub.linkLabel || 'READ PAPER'}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Projects Page Component
function ProjectsPage({ playSound, clickSoundRef, colors }) {
  const [showButterflies, setShowButterflies] = useState(true);

  useEffect(() => {
    setShowButterflies(true);
    const timer = setTimeout(() => setShowButterflies(false), 12000);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
  const shimmerInterval = setInterval(() => {
    const kanjiElement = document.querySelector('.kanji-title');
    if (kanjiElement) {
      kanjiElement.classList.add('kanji-shimmer-loop');
      setTimeout(() => {
        kanjiElement.classList.remove('kanji-shimmer-loop');
      }, 2000);
    }
  }, 10000);

  return () => clearInterval(shimmerInterval);
 }, []);
  const projects = [
    {
      title: 'Point Cloud Inspection API',
      description: 'Unsupervised 3D defect detection for manufacturing QA: FPFH descriptors matched against a memory bank of defect-free scans via FAISS, no labelled defects needed. 0.90 mean pixel AUROC across 10 MVTec 3D-AD categories, served with FastAPI in Docker.',
      tech: ['Python', 'Open3D', 'FAISS', 'FastAPI', 'Docker'],
      link: 'https://github.com/Abdullah-Nasir-Chowdhury/pointcloud-inspection-api',
      demo: 'https://pcinspect-727953311125.asia-northeast1.run.app/demo'
    },
    {
      title: 'Real-Time Detection & Tracking',
      description: 'YOLO11 + ByteTrack pipeline for multi-object tracking, exported to PyTorch / ONNX / TensorRT with a measured CPU vs. GPU latency benchmark, plus a per-worker PPE (hardhat/vest) compliance demo.',
      tech: ['YOLO11', 'ByteTrack', 'ONNX', 'TensorRT', 'FastAPI', 'Docker'],
      link: 'https://github.com/Abdullah-Nasir-Chowdhury/realtime-detection-tracking',
      demo: 'https://dtrack-727953311125.asia-northeast1.run.app/demo'
    },
    {
      title: 'Bicol Cacao Field Tools',
      description: 'Drip-irrigation pressure planner, P&ID water-system schematic, and Raspberry Pi controller design for smallholder cacao farms in Bicol, Philippines, built from field research with Team BEE, University of Tsukuba.',
      tech: ['Raspberry Pi', 'P&ID Design', 'Field Research', 'JavaScript'],
      link: 'https://github.com/Abdullah-Nasir-Chowdhury/cacao-bicol-field-tools',
      demo: 'https://cacao-bicol-field-tools.netlify.app'
    },
    {
      title: 'Apnea Detector',
      description: 'A web application that utilizes deep learning to detect sleep apnea from audio recordings, providing real-time analysis and feedback.',
      tech: ['HuggingFace', 'Gradio', 'Python', 'Deep Learning'],
      link: 'https://github.com/Abdullah-Nasir-Chowdhury/Apnea-Detector',
      demo: 'https://youtu.be/G2h5vp80e2s?si=A4XVePqcFST4Tzj4'
    },
    {
      title: 'E-commerce App for ASUS',
      description: 'A comprehensive e-commerce application built for ASUS, featuring product listings, user authentication, and payment integration.',
      tech: ['Python', 'Flutter', 'Firebase', 'Dart', 'REST API'],
      link: 'https://github.com/Abdullah-Nasir-Chowdhury/asus-ecommerce-app',
      demo: null
    },
    {
      title: 'Full Stack IoT Application',
      description: 'An IoT application integrating ESP8266 with Flutter frontend and Firebase backend for real-time data monitoring and control.',
      tech: ['Flutter', 'Firebase', 'ArduinoIDE', 'ESP8266', 'C++'],
      link: 'https://github.com/Abdullah-Nasir-Chowdhury/IOT-Application_ESP8266-Flutter-Firebase',
      demo: 'https://youtu.be/JxMownOBc4A?si=eMhQRYxraM1b2t7P'
    }
  ];

  return (
    <div className="min-h-screen px-6 py-24">
      {showButterflies && <MultipleButterflies colors={colors} />}
      
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 fade-in">
          <h1 
            className="kanji-title text-5xl md:text-6xl font-bold mb-4"
            style={{ 
              fontFamily: '"Cinzel", serif',
              textShadow: `0 0 20px ${colors.shadowColor}`,
              color: colors.textLighterColor
            }}
          >
            作品 • Projects
          </h1>
          <p 
            className="text-lg" 
            style={{ 
              fontFamily: '"Rajdhani", sans-serif',
              color: colors.textColor
            }}
          >
            Crafted with precision and purpose
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <div 
              key={i}
              className="fade-in rounded-lg p-6 bg-black/40 backdrop-blur-sm transition-all duration-300 hover:scale-105"
              style={{ 
                boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
                animationDelay: `${i * 0.1}s`,
                border: `1px solid ${colors.borderColor}`
              }}
            >
              <h3 
                className="text-2xl font-bold mb-3" 
                style={{ 
                  fontFamily: '"Rajdhani", sans-serif',
                  color: colors.textColor
                }}
              >
                {project.title}
              </h3>
              <p className="text-gray-300 mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tech.map((tech, j) => (
                  <span 
                    key={j}
                    className="px-2 py-1 text-xs rounded"
                    style={{
                      backgroundColor: `${colors.rgbaColor}0.2)`,
                      color: colors.textLightColor,
                      border: `1px solid ${colors.borderMediumColor}`
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex gap-3">
                <a 
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playSound(clickSoundRef)}
                  className="flex-1 px-4 py-2 text-white text-center rounded transition-colors text-sm"
                  style={{ 
                    fontFamily: '"Rajdhani", sans-serif',
                    backgroundColor: colors.medium
                  }}
                >
                  CODE
                </a>
                {project.demo && (
                  <a 
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => playSound(clickSoundRef)}
                    className="flex-1 px-4 py-2 text-center rounded transition-all text-sm"
                    style={{ 
                      fontFamily: '"Rajdhani", sans-serif',
                      border: `1px solid ${colors.medium}`,
                      color: colors.textColor
                    }}
                  >
                    DEMO
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Contact Page Component
function ContactPage({ socialLinks, playSound, clickSoundRef, colors }) {
  const [showButterflies, setShowButterflies] = useState(true);

  useEffect(() => {
    setShowButterflies(true);
    const timer = setTimeout(() => setShowButterflies(false), 12000);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
  const shimmerInterval = setInterval(() => {
    const kanjiElement = document.querySelector('.kanji-title');
    if (kanjiElement) {
      kanjiElement.classList.add('kanji-shimmer-loop');
      setTimeout(() => {
        kanjiElement.classList.remove('kanji-shimmer-loop');
      }, 2000);
    }
  }, 10000);

  return () => clearInterval(shimmerInterval);
 }, []);
  return (
    <div className="min-h-screen px-6 py-24 flex items-center justify-center">
      {showButterflies && <MultipleButterflies colors={colors} />}
      
      <div className="max-w-3xl w-full">
        <div className="text-center mb-16 fade-in">
          <h1 
            className="kanji-title text-5xl md:text-6xl font-bold mb-4"
            style={{ 
              fontFamily: '"Cinzel", serif',
              textShadow: `0 0 20px ${colors.shadowColor}`,
              color: colors.textLighterColor
            }}
          >
            連絡 • Contact
          </h1>
          <p 
            className="text-lg" 
            style={{ 
              fontFamily: '"Rajdhani", sans-serif',
              color: colors.textColor
            }}
          >
            Let's connect and collaborate
          </p>
        </div>

        <div className="mb-12 fade-in" style={{ animationDelay: '0.2s' }}>
          <div 
            className="p-8 rounded-lg bg-black/40 backdrop-blur-sm text-center"
            style={{ 
              boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
              border: `1px solid ${colors.borderColor}`
            }}
          >
            <Mail 
              style={{
                color: colors.textColor,
                marginLeft: 'auto',
                marginRight: 'auto',
                marginBottom: '1rem'
              }} 
              size={48} 
            />
            <h2 
              className="text-2xl font-bold mb-2" 
              style={{ 
                fontFamily: '"Rajdhani", sans-serif',
                color: colors.textLightColor
              }}
            >
              EMAIL
            </h2>
            <a 
              href="mailto:abdullahnasirchowdhury1@gmail.com"
              onClick={() => playSound(clickSoundRef)}
              className="text-lg transition-colors"
              style={{ color: colors.textColor }}
            >
              Click to Email Me
            </a>
          </div>
        </div>

        <div className="fade-in" style={{ animationDelay: '0.4s' }}>
          <h2 
            className="text-2xl font-bold mb-6 text-center" 
            style={{ 
              fontFamily: '"Rajdhani", sans-serif',
              color: colors.textColor
            }}
          >
            CONNECT ON SOCIAL MEDIA
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {socialLinks.map((social, i) => (
              <a
                key={i}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playSound(clickSoundRef)}
                className={`p-6 rounded-lg bg-black/40 backdrop-blur-sm transition-all duration-300 hover:scale-105 flex flex-col items-center gap-3 ${social.color}`}
                style={{ 
                  boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
                  border: `1px solid ${colors.borderColor}`
                }}
              >
                <social.icon style={{ color: colors.textColor }} size={32} />
                <span 
                  className="font-semibold" 
                  style={{ 
                    fontFamily: '"Rajdhani", sans-serif',
                    color: colors.textLightColor
                  }}
                >
                  {social.name}
                </span>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-12 fade-in text-center" style={{ animationDelay: '0.6s' }}>
          <p className="text-gray-400" style={{ fontFamily: '"Rajdhani", sans-serif' }}>
            CVLab, University of Tsukuba<br />
            Tsukuba, Ibaraki, Japan
          </p>
        </div>
      </div>
    </div>
  );
}