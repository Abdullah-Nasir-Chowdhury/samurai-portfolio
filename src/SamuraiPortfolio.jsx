import React, { useState, useEffect, useRef } from 'react';
import { Flame, Sword, Wind, Circle, Menu, X, Github, Linkedin, Facebook, Twitter, Instagram, MessageCircle, BookOpen, User, Mail, FileText, Volume2, VolumeX } from 'lucide-react';

export default function SamuraiPortfolio() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
// Audio refs
const bgMusicRef = useRef(null);
const clickSoundRef = useRef(null);
const pageSwitchSoundRef = useRef(null);
const [audioInitialized, setAudioInitialized] = useState(false);

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
      // Use absolute paths from public folder - this works on Vercel
      // Files should be placed in: public/audio/moonlight.mp3 and public/audio/a6.mp3
      
      // Background Music
      bgMusicRef.current = new Audio('/audio/moonlight.mp3');
      bgMusicRef.current.loop = true;
      bgMusicRef.current.volume = 0.2;
      
      // Add error handlers
      bgMusicRef.current.addEventListener('error', (e) => {
        console.error('Background music failed to load. Make sure moonlight.mp3 exists in public/audio/', e);
      });
      
      bgMusicRef.current.addEventListener('canplaythrough', () => {
        console.log('Background music loaded successfully');
        setAudioInitialized(true);
      });

      // Click Sound
      clickSoundRef.current = new Audio('/audio/a6.mp3');
      clickSoundRef.current.volume = 1.0;
      clickSoundRef.current.addEventListener('error', (e) => {
        console.error('Click sound failed to load. Make sure a6.mp3 exists in public/audio/', e);
      });

      // Page Switch Sound
      pageSwitchSoundRef.current = new Audio('/audio/a6.mp3');
      pageSwitchSoundRef.current.volume = 1.0;
      pageSwitchSoundRef.current.addEventListener('error', (e) => {
        console.error('Page switch sound failed to load. Make sure a6.mp3 exists in public/audio/', e);
      });
      
      // Preload audio
      bgMusicRef.current.load();
      clickSoundRef.current.load();
      pageSwitchSoundRef.current.load();
      
    } catch (error) {
      console.error('Audio initialization failed:', error);
    }
  };

  initAudio();

  return () => {
    // Cleanup
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

// Toggle all audio (music and sound effects)
const toggleAudio = async () => {
  if (isMusicPlaying || !isMuted) {
    // Turn everything off
    if (bgMusicRef.current) {
      bgMusicRef.current.pause();
    }
    setIsMusicPlaying(false);
    setIsMuted(true);
  } else {
    // Turn everything on
    if (bgMusicRef.current) {
      try {
        await bgMusicRef.current.play();
        setIsMusicPlaying(true);
        setIsMuted(false);
      } catch (error) {
        console.error('Audio play failed:', error);
        // Show user-friendly error
        alert('Unable to play audio. Please make sure:\n1. Audio files exist in public/audio/ folder\n2. You have interacted with the page (browsers require user interaction for audio)');
      }
    }
  }
};

// Play sound effect
const playSound = async (soundRef) => {
  if (!isMuted && soundRef.current) {
    try {
      // Clone the audio for overlapping sounds
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
        return <HomePage playSound={playSound} clickSoundRef={clickSoundRef} />;
      case 'research':
        return <ResearchPage playSound={playSound} clickSoundRef={clickSoundRef} />;
      case 'projects':
        return <ProjectsPage playSound={playSound} clickSoundRef={clickSoundRef} />;
      case 'contact':
        return <ContactPage socialLinks={socialLinks} playSound={playSound} clickSoundRef={clickSoundRef} />;
      default:
        return <HomePage playSound={playSound} clickSoundRef={clickSoundRef} />;
    }
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <CustomCursor />
      {/* Japanese Pattern Background */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(220, 38, 38, 0.1) 35px, rgba(220, 38, 38, 0.1) 70px),
                           repeating-linear-gradient(-45deg, transparent, transparent 35px, rgba(220, 38, 38, 0.1) 35px, rgba(220, 38, 38, 0.1) 70px)`
        }}
      />

      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-red-500 rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${10 + Math.random() * 20}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Parallax Background Elements */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
        }}
      >
        <div className="absolute top-20 right-20 text-red-900 opacity-5 select-none" style={{ fontSize: '12rem', fontWeight: 'bold' }}>
          侍
        </div>
        <div className="absolute bottom-20 left-20 text-red-900 opacity-5 select-none" style={{ fontSize: '12rem', fontWeight: 'bold' }}>
          武
        </div>
      </div>

      {/* Single Audio Control - NO SOUND ON CLICK */}
      <div className="fixed top-6 left-6 z-50">
        <button
          onClick={toggleAudio}
          className="p-3 bg-red-900/80 backdrop-blur-sm border-2 border-red-600 rounded-lg hover:bg-red-800 transition-all duration-300"
          style={{ boxShadow: '0 0 20px rgba(220, 38, 38, 0.3)' }}
          title={isMusicPlaying && !isMuted ? "Mute All Audio" : "Unmute All Audio"}
        >
          {isMusicPlaying && !isMuted ? (
            <Volume2 className="text-red-200" size={24} />
          ) : (
            <VolumeX className="text-red-200" size={24} />
          )}
        </button>
      </div>

      {/* Hamburger Menu Button */}
      <button
        onClick={handleMenuToggle}
        className="fixed top-6 right-6 z-50 p-3 bg-red-900/80 backdrop-blur-sm border-2 border-red-600 rounded-lg hover:bg-red-800 transition-all duration-300"
        style={{ boxShadow: '0 0 20px rgba(220, 38, 38, 0.3)' }}
      >
        {menuOpen ? <X className="text-red-200" size={28} /> : <Menu className="text-red-200" size={28} />}
      </button>

      {/* Side Navigation Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-black/95 backdrop-blur-lg border-l-2 border-red-900 z-40 transition-transform duration-300 ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ boxShadow: '-10px 0 50px rgba(220, 38, 38, 0.2)' }}
      >
        <div className="flex flex-col h-full p-8 pt-24">
          {/* Navigation Links */}
          <nav className="flex-1">
            <ul className="space-y-4">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => navigateTo(item.id)}
                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-lg transition-all duration-300 ${
                      currentPage === item.id
                        ? 'bg-red-600 text-white'
                        : 'text-red-200 hover:bg-red-900/50 hover:text-white'
                    }`}
                    style={{ fontFamily: '"Rajdhani", sans-serif', letterSpacing: '1px' }}
                  >
                    <item.icon size={24} />
                    <span className="text-lg font-semibold">{item.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Social Links */}
          <div className="border-t border-red-900 pt-6">
            <p className="text-red-400 text-sm mb-4 tracking-wide" style={{ fontFamily: '"Rajdhani", sans-serif' }}>
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
                  className={`flex items-center justify-center p-3 rounded-lg bg-red-950/50 border border-red-900 text-red-300 ${social.color} transition-all duration-300 hover:scale-110`}
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
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Rajdhani:wght@400;600;700&family=Noto+Serif+JP:wght@400;700&display=swap');
        
        /* Hide default cursor only on non-touch devices */
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
function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect if device supports touch
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

  // Don't render cursor on touch devices
  if (isTouchDevice) {
    return null;
  }

  return (
    <>
      {/* Main cursor dot */}
      <div
        className="fixed pointer-events-none z-50 mix-blend-difference"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div
          className={`bg-red-500 rounded-full transition-all duration-150 ${
            isPointer ? 'w-3 h-3' : 'w-2 h-2'
          }`}
          style={{
            boxShadow: '0 0 10px rgba(220, 38, 38, 1)',
          }}
        />
      </div>

      {/* Outer halo */}
      <div
        className="fixed pointer-events-none z-50"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div
          className={`rounded-full border-2 transition-all duration-300 ${
            isPointer
              ? 'w-12 h-12 border-red-400 bg-red-500/10'
              : 'w-10 h-10 border-red-500 bg-red-500/5'
          }`}
          style={{
            boxShadow: isPointer
              ? '0 0 30px rgba(220, 38, 38, 0.6), inset 0 0 20px rgba(220, 38, 38, 0.2)'
              : '0 0 20px rgba(220, 38, 38, 0.4), inset 0 0 15px rgba(220, 38, 38, 0.1)',
          }}
        />
      </div>
    </>
  );
}

// Butterfly Component
function FlyingButterfly({ animationClass, delay = 0 }) {
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
        {/* Butterfly Body */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-4 bg-gradient-to-b from-red-800 to-red-950 rounded-full z-10" 
             style={{ boxShadow: '0 0 4px rgba(220, 38, 38, 0.6)' }} />
        
        {/* Left Wing */}
        <div className="butterfly-wing-left absolute left-0 top-1/2 -translate-y-1/2 origin-right">
          <svg width="15" height="20" viewBox="0 0 30 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M28 20C28 28 22 38 15 38C8 38 5 30 5 20C5 10 8 2 15 2C22 2 28 12 28 20Z" 
                  fill="url(#leftWingGradient)" 
                  stroke="#7f1d1d" 
                  strokeWidth="1"
                  filter="url(#glow)" />
            <circle cx="18" cy="15" r="3" fill="#450a0a" opacity="0.6" />
            <circle cx="20" cy="25" r="2" fill="#450a0a" opacity="0.4" />
            <defs>
              <linearGradient id="leftWingGradient" x1="5" y1="2" x2="28" y2="38">
                <stop offset="0%" stopColor="#dc2626" />
                <stop offset="50%" stopColor="#991b1b" />
                <stop offset="100%" stopColor="#7f1d1d" />
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
        
        {/* Right Wing */}
        <div className="butterfly-wing-right absolute right-0 top-1/2 -translate-y-1/2 origin-left">
          <svg width="15" height="20" viewBox="0 0 30 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 20C2 28 8 38 15 38C22 38 25 30 25 20C25 10 22 2 15 2C8 2 2 12 2 20Z" 
                  fill="url(#rightWingGradient)" 
                  stroke="#7f1d1d" 
                  strokeWidth="1"
                  filter="url(#glow2)" />
            <circle cx="12" cy="15" r="3" fill="#450a0a" opacity="0.6" />
            <circle cx="10" cy="25" r="2" fill="#450a0a" opacity="0.4" />
            <defs>
              <linearGradient id="rightWingGradient" x1="25" y1="2" x2="2" y2="38">
                <stop offset="0%" stopColor="#dc2626" />
                <stop offset="50%" stopColor="#991b1b" />
                <stop offset="100%" stopColor="#7f1d1d" />
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

        {/* Antennae */}
        <div className="absolute left-1/2 top-0 -translate-x-1 w-0.5 h-1.5 bg-red-900 rounded-full origin-bottom" style={{ transform: 'translateX(-1px) rotate(-20deg)' }} />
        <div className="absolute left-1/2 top-0 translate-x-0.5 w-0.5 h-1.5 bg-red-900 rounded-full origin-bottom" style={{ transform: 'translateX(1px) rotate(20deg)' }} />
      </div>
    </div>
  );
}

// Multiple Butterflies Component
function MultipleButterflies() {
  return (
    <>
      <FlyingButterfly animationClass="butterfly-container-1" delay={0} />
      <FlyingButterfly animationClass="butterfly-container-2" delay={1.5} />
      <FlyingButterfly animationClass="butterfly-container-3" delay={3} />
      <FlyingButterfly animationClass="butterfly-container-4" delay={4.5} />
      <FlyingButterfly animationClass="butterfly-container-5" delay={6} />
    </>
  );
}

// Home Page Component
function HomePage({ playSound, clickSoundRef }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showButterflies, setShowButterflies] = useState(true);

  useEffect(() => {
    setIsLoaded(true);
    setShowButterflies(true);
    
    const timer = setTimeout(() => {
      setShowButterflies(false);
    }, 12000);

    return () => clearTimeout(timer);
  }, []);

  // Kanji Shimmer Effect Loop
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
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12">
      {showButterflies && <MultipleButterflies />}
      
      {/* Decorative Top Line */}
      <div 
        className="w-full max-w-4xl mb-12 transition-all duration-1000"
        style={{
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'translateY(0)' : 'translateY(-40px)'
        }}
      >
        <div className="h-px bg-gradient-to-r from-transparent via-red-600 to-transparent" />
        <div className="flex justify-center -mt-3">
          <Sword className="text-red-600" size={24} />
        </div>
      </div>

      {/* Flaming Circle Portrait */}
      <div 
        className="relative mb-12 transition-all duration-1000"
        style={{
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'scale(1)' : 'scale(0.9)',
          transitionDelay: '300ms'
        }}
      >
        <div className="absolute inset-0 blur-3xl bg-red-600 opacity-30 rounded-full" style={{ transform: 'scale(1.1)' }} />
        
        <div className="relative w-80 h-80 flex items-center justify-center">
          {/* Outer Flame Ring */}
          <div className="absolute inset-0 flame-ring-outer">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute top-1/2 left-1/2"
                style={{
                  transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-160px)`,
                }}
              >
                <Flame 
                  className="text-red-600 opacity-70"
                  size={32}
                  style={{
                    filter: 'drop-shadow(0 0 10px rgba(220, 38, 38, 0.8))',
                    animation: `flicker ${0.5 + Math.random() * 0.5}s infinite alternate`
                  }}
                />
              </div>
            ))}
          </div>

          {/* Inner Flame Layer */}
          <div className="absolute inset-0 flame-ring-inner">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute top-1/2 left-1/2"
                style={{
                  transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-172px)`,
                }}
              >
                <Flame 
                  className="text-orange-500 opacity-60"
                  size={24}
                  style={{
                    filter: 'drop-shadow(0 0 8px rgba(249, 115, 22, 0.8))',
                    animation: `flicker ${0.6 + Math.random() * 0.4}s infinite alternate`
                  }}
                />
              </div>
            ))}
          </div>

          {/* Inner Gold Ring */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div 
              className="w-80 h-80 rounded-full border-4 border-yellow-600 opacity-40"
              style={{
                boxShadow: '0 0 30px rgba(202, 138, 4, 0.5), inset 0 0 30px rgba(202, 138, 4, 0.3)'
              }}
            />
          </div>

          {/* Portrait Circle */}
          <div className="relative w-72 h-72 rounded-full overflow-hidden border-8 border-red-950 bg-gradient-to-br from-gray-800 to-gray-900 z-10"
               style={{
                 boxShadow: '0 0 50px rgba(0, 0, 0, 0.8), inset 0 0 30px rgba(0, 0, 0, 0.5)'
               }}>
            <img 
              src="/16041.jpg" 
              alt="Chowdhury Abdulla Nasir" 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Red Accent Glow */}
          <div 
            className="absolute inset-0 rounded-full pointer-events-none z-20"
            style={{
              background: 'radial-gradient(circle, transparent 40%, rgba(220, 38, 38, 0.1) 100%)'
            }}
          />
        </div>
      </div>

      {/* Name & Title */}
      <div 
        className="text-center mb-8 transition-all duration-1000"
        style={{
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'translateY(0)' : 'translateY(40px)',
          transitionDelay: '700ms'
        }}
      >
        <h1 className="kanji-title text-6xl md:text-7xl font-bold mb-4 text-red-50"
        style={{ 
            fontFamily: '"Cinzel", serif',
            textShadow: '0 0 20px rgba(220, 38, 38, 0.5), 0 0 40px rgba(0, 0, 0, 0.8)'
        }}>
            蝶踊り
        </h1>
        <div className="flex items-center justify-center gap-4 text-red-400">
          <div className="h-px w-12 bg-red-600" />
          <p className="text-xl tracking-widest uppercase" style={{ fontFamily: '"Rajdhani", sans-serif' }}>
            Chowdhury Abdulla Nasir
          </p>
          <div className="h-px w-12 bg-red-600" />
        </div>
        <p className="mt-4 text-red-200 text-sm tracking-wide" style={{ fontFamily: '"Noto Serif JP", serif' }}>
          道 • Research Student @ CVLab, Tsukuba University
        </p>
      </div>

      {/* About Section */}
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

      {/* Skills/Expertise Cards */}
      <div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mb-12 transition-all duration-1000"
        style={{
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'translateY(0)' : 'translateY(40px)',
          transitionDelay: '1200ms'
        }}
      >
        {[
          { title: '剣術', subtitle: 'Frontend Mastery', desc: 'React, Vue, Next.js' },
          { title: '忍術', subtitle: 'Backend Arts', desc: 'Node, Python, Databases' },
          { title: '武道', subtitle: 'Design Philosophy', desc: 'UI/UX, Responsive Design' }
        ].map((skill, i) => (
          <div 
            key={i}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-900 to-red-950 rounded-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
            <div className="relative border border-red-800 rounded-lg p-6 backdrop-blur-sm bg-black/40 hover:border-red-600 transition-all duration-300 hover:scale-105"
                 style={{ boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)' }}>
              <h3 className="text-3xl text-red-400 mb-2" style={{ fontFamily: '"Noto Serif JP", serif' }}>
                {skill.title}
              </h3>
              <p className="text-red-200 font-semibold mb-2 tracking-wide" style={{ fontFamily: '"Rajdhani", sans-serif' }}>
                {skill.subtitle}
              </p>
              <p className="text-gray-400 text-sm">
                {skill.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Decorative Bottom Line */}
      <div 
        className="w-full max-w-4xl mt-12 transition-all duration-1000"
        style={{
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'translateY(0)' : 'translateY(40px)',
          transitionDelay: '1600ms'
        }}
      >
        <div className="flex justify-center mb-3">
          <Wind className="text-red-600" size={24} />
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-red-600 to-transparent" />
      </div>
    </div>
  );
}

// Research Page Component
function ResearchPage({ playSound, clickSoundRef }) {
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
  
  const publications = [
    {
      title: 'Code Poisoning Through Misleading Comments: Jailbreaking Large Language Models via Contextual Deception',
      authors: 'C.A. Nasir, et al.',
      venue: '2025 28th International Conference on Computer and Information Technology (ICCIT)',
      abstract: 'This study investigates the vulnerability of Large Language Models (LLMs) to code poisoning attacks through misleading comments. By embedding deceptive comments within code snippets, we demonstrate how LLMs can be manipulated into generating harmful or unintended outputs.',
      link: 'https://www.researchgate.net/publication/400360433_Code_Poisoning_Through_Misleading_Comments_Jailbreaking_Large_Language_Models_via_Contextual_Deception',
      tags: ['Machine Learning', 'AI']
    },
    {
      title: 'Prototype and Simulation of a Real-Time GPS and PTS Architecture',
      authors: 'C.A. Nasir, et al.',
      venue: '2025 International Conference on Quantum Photonics, Artificial Intelligence, and Networking (QPAIN)',
      abstract: 'Our research paper explores the creation of a realtime Global Positioning System (GPS) and Passenger Tracking System (PTS), covering simulation, hardware setup, and prototype evaluation. ',
      link: 'https://ieeexplore.ieee.org/document/11172005',
      tags: ['Computer Vision', 'Deep Learning']
    },
    {
      title: 'Performance Analysis of Tesseract and EasyOCR on the Novel Bangla-CrossHair Dataset',
      authors: 'C.A. Nasir, et al.',
      venue: '2025 3rd International Conference on Intelligent Systems, Advanced Computing and Communication (ISACC)',
      abstract: 'This paper presents a comparative study of key metrics for OCR engines in Bangla language processing. PyTesseract (a Python wrapper for Tesseract OCR) and EasyOCR were benchmarked on a novel dataset, "Bangla-CrossHair," created for testing OCR engines. ',
      link: 'https://ieeexplore.ieee.org/document/10969286',
      tags: ['Machine Learning', 'AI']
    },
    {
      title: 'ALPR: ResNet50 powered Bangla License Plate Detection and OCR using Root Mean Square Prop Optimizer and Linear SVM Classifier',
      authors: 'C.A. Nasir, et al.',
      venue: '2024 IEEE 9th International Conference for Convergence in Technology (I2CT)',
      abstract: 'This paper implements the MATLAB Image Processing Toolbox in detecting the license plate region using several user-defined functions in order to pre-process and process the image up until the point of extraction of characters.',
      link: 'https://ieeexplore.ieee.org/document/10543675',
      tags: ['Computer Vision', 'Deep Learning']
    },
  ];

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
      {showButterflies && <MultipleButterflies />}
      
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 fade-in">
          <h1 className="kanji-title text-5xl md:text-6xl font-bold mb-4 text-red-50"
              style={{ 
                fontFamily: '"Cinzel", serif',
                textShadow: '0 0 20px rgba(220, 38, 38, 0.5)'
              }}>
            研究 • Research
          </h1>
          <p className="text-red-300 text-lg" style={{ fontFamily: '"Rajdhani", sans-serif' }}>
            CVLab, University of Tsukuba, Japan
          </p>
        </div>

        {/* Academic Profiles */}
        <div className="mb-12 fade-in" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-2xl font-bold text-red-400 mb-6" style={{ fontFamily: '"Rajdhani", sans-serif' }}>
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
                className="p-6 border border-red-900 rounded-lg bg-black/40 backdrop-blur-sm hover:border-red-600 hover:bg-black/60 transition-all duration-300 group"
                style={{ boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)' }}
              >
                <div className="text-5xl mb-3 font-bold group-hover:scale-110 transition-transform duration-300 text-center"
                     style={{ 
                       fontFamily: '"Noto Serif JP", "Hiragino Mincho ProN", "Yu Mincho", serif',
                       textShadow: '0 0 15px rgba(220, 38, 38, 0.4)',
                       color: '#fca5a5'
                     }}>
                  {profile.icon}
                </div>
                <h3 className="text-xl font-bold text-red-100 mb-2" style={{ fontFamily: '"Rajdhani", sans-serif' }}>
                  {profile.name}
                </h3>
                <p className="text-gray-400 text-sm">{profile.description}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Research Interests */}
        <div className="mb-12 fade-in" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-2xl font-bold text-red-400 mb-6" style={{ fontFamily: '"Rajdhani", sans-serif' }}>
            RESEARCH INTERESTS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['Computer Vision', 'Deep Learning', 'Image Processing', 'Pattern Recognition'].map((interest, i) => (
              <div 
                key={i} 
                className="p-4 border border-red-900 rounded-lg bg-black/40 backdrop-blur-sm"
              >
                <p className="text-red-200" style={{ fontFamily: '"Rajdhani", sans-serif' }}>{interest}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Publications */}
        <div className="fade-in" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-2xl font-bold text-red-400 mb-6" style={{ fontFamily: '"Rajdhani", sans-serif' }}>
            PUBLICATIONS
          </h2>
          <div className="space-y-6">
            {publications.map((pub, i) => (
              <div 
                key={i}
                className="p-6 border border-red-800 rounded-lg bg-black/40 backdrop-blur-sm hover:border-red-600 transition-all duration-300"
                style={{ boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)' }}
              >
                <h3 className="text-xl font-bold text-red-100 mb-2" style={{ fontFamily: '"Rajdhani", sans-serif' }}>
                  {pub.title}
                </h3>
                <p className="text-red-300 mb-2">{pub.authors}</p>
                <p className="text-gray-400 italic mb-3">{pub.venue}</p>
                <p className="text-gray-300 mb-4">{pub.abstract}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {pub.tags.map((tag, j) => (
                    <span 
                      key={j}
                      className="px-3 py-1 bg-red-900/50 text-red-200 text-sm rounded-full border border-red-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <a 
                  href={pub.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playSound(clickSoundRef)}
                  className="inline-block px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  style={{ fontFamily: '"Rajdhani", sans-serif' }}
                >
                  READ PAPER
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
// Projects Page Component
function ProjectsPage({ playSound, clickSoundRef }) {
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
      {showButterflies && <MultipleButterflies />}
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 fade-in">
          <h1 className="kanji-title text-5xl md:text-6xl font-bold mb-4 text-red-50"
              style={{ 
                fontFamily: '"Cinzel", serif',
                textShadow: '0 0 20px rgba(220, 38, 38, 0.5)'
              }}>
            作品 • Projects
          </h1>
          <p className="text-red-300 text-lg" style={{ fontFamily: '"Rajdhani", sans-serif' }}>
            Crafted with precision and purpose
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <div 
              key={i}
              className="fade-in border border-red-800 rounded-lg p-6 bg-black/40 backdrop-blur-sm hover:border-red-600 transition-all duration-300 hover:scale-105"
              style={{ 
                boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
                animationDelay: `${i * 0.1}s`
              }}
            >
              <h3 className="text-2xl font-bold text-red-400 mb-3" style={{ fontFamily: '"Rajdhani", sans-serif' }}>
                {project.title}
              </h3>
              <p className="text-gray-300 mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tech.map((tech, j) => (
                  <span 
                    key={j}
                    className="px-2 py-1 bg-red-950/50 text-red-200 text-xs rounded border border-red-900"
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
                  className="flex-1 px-4 py-2 bg-red-600 text-white text-center rounded hover:bg-red-700 transition-colors text-sm"
                  style={{ fontFamily: '"Rajdhani", sans-serif' }}
                >
                  CODE
                </a>
                {project.demo && (
                  <a 
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => playSound(clickSoundRef)}
                    className="flex-1 px-4 py-2 border border-red-600 text-red-400 text-center rounded hover:bg-red-600 hover:text-white transition-all text-sm"
                    style={{ fontFamily: '"Rajdhani", sans-serif' }}
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
function ContactPage({ socialLinks, playSound, clickSoundRef }) {
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
      {showButterflies && <MultipleButterflies />}
      
      <div className="max-w-3xl w-full">
        {/* Header */}
        <div className="text-center mb-16 fade-in">
          <h1 className="kanji-title text-5xl md:text-6xl font-bold mb-4 text-red-50"
              style={{ 
                fontFamily: '"Cinzel", serif',
                textShadow: '0 0 20px rgba(220, 38, 38, 0.5)'
              }}>
            連絡 • Contact
          </h1>
          <p className="text-red-300 text-lg" style={{ fontFamily: '"Rajdhani", sans-serif' }}>
            Let's connect and collaborate
          </p>
        </div>

        {/* Contact Info */}
        <div className="mb-12 fade-in" style={{ animationDelay: '0.2s' }}>
          <div 
            className="p-8 border border-red-800 rounded-lg bg-black/40 backdrop-blur-sm text-center"
            style={{ boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)' }}
          >
            <Mail className="text-red-400 mx-auto mb-4" size={48} />
            <h2 className="text-2xl font-bold text-red-200 mb-2" style={{ fontFamily: '"Rajdhani", sans-serif' }}>
              EMAIL
            </h2>
            <a 
              href="mailto:abdullahnasirchowdhury1@gmail.com"
              onClick={() => playSound(clickSoundRef)}
              className="text-red-400 hover:text-red-300 text-lg transition-colors"
            >
              Click to Email Me
            </a>
          </div>
        </div>

        {/* Social Links Grid */}
        <div className="fade-in" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-2xl font-bold text-red-400 mb-6 text-center" style={{ fontFamily: '"Rajdhani", sans-serif' }}>
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
                className="p-6 border border-red-800 rounded-lg bg-black/40 backdrop-blur-sm hover:border-red-600 transition-all duration-300 hover:scale-105 flex flex-col items-center gap-3"
                style={{ boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)' }}
              >
                <social.icon className={`text-red-400 ${social.color} transition-colors`} size={32} />
                <span className="text-red-200 font-semibold" style={{ fontFamily: '"Rajdhani", sans-serif' }}>
                  {social.name}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* University Info */}
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