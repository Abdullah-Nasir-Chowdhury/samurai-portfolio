import React, { useState, useEffect, useRef } from 'react';
import { Mail, Github, Linkedin, Twitter, Facebook, Instagram, MessageCircle, ExternalLink, ChevronDown, ArrowRight, Code, BookOpen, Briefcase, User, X, Menu } from 'lucide-react';

export default function ModernPortfolio() {
  const [currentSection, setCurrentSection] = useState('home');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeProject, setActiveProject] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const scrollToSection = (sectionId) => {
    setCurrentSection(sectionId);
    setIsMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white min-h-screen overflow-x-hidden">
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-slate-800 z-50">
        <div 
          className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating Orbs Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
          style={{
            left: `${mousePosition.x * 0.02}px`,
            top: `${mousePosition.y * 0.02}px`,
            transition: 'all 0.3s ease-out'
          }}
        />
        <div 
          className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          style={{
            right: `${mousePosition.x * 0.01}px`,
            bottom: `${mousePosition.y * 0.01}px`,
            transition: 'all 0.3s ease-out'
          }}
        />
      </div>

      {/* Navigation */}
      <Navigation 
        currentSection={currentSection}
        scrollToSection={scrollToSection}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />

      {/* Hero Section */}
      <HeroSection scrollToSection={scrollToSection} />

      {/* About Section */}
      <AboutSection />

      {/* Expertise Cards Section */}
      <ExpertiseSection />

      {/* Projects Section */}
      <ProjectsSection activeProject={activeProject} setActiveProject={setActiveProject} />

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <Footer />

      {/* Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        
        * {
          font-family: 'Inter', sans-serif;
        }

        .font-mono {
          font-family: 'JetBrains Mono', monospace;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }

        .animate-slideInRight {
          animation: slideInRight 0.8s ease-out forwards;
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .glass-morphism {
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .hover-glow:hover {
          box-shadow: 0 0 30px rgba(6, 182, 212, 0.3);
        }

        .text-gradient {
          background: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .section-padding {
          padding: 6rem 1.5rem;
        }

        @media (min-width: 768px) {
          .section-padding {
            padding: 8rem 3rem;
          }
        }
      `}</style>
    </div>
  );
}

function Navigation({ currentSection, scrollToSection, isMenuOpen, setIsMenuOpen }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: User },
    { id: 'about', label: 'About', icon: User },
    { id: 'research', label: 'Research', icon: BookOpen },
    { id: 'projects', label: 'Projects', icon: Code },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex fixed top-8 left-1/2 transform -translate-x-1/2 z-40 glass-morphism rounded-full px-8 py-4">
        <div className="flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`relative text-sm font-medium transition-all duration-300 hover:text-cyan-400 ${
                currentSection === item.id ? 'text-cyan-400' : 'text-gray-300'
              }`}
            >
              {item.label}
              {currentSection === item.id && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-500" />
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed top-6 right-6 z-50">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="glass-morphism p-3 rounded-lg hover-glow transition-all"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 bg-slate-950/95 backdrop-blur-lg z-40 transition-all duration-300 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="text-2xl font-semibold text-gray-300 hover:text-cyan-400 transition-colors animate-fadeInUp"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

function HeroSection({ scrollToSection }) {
  const [displayText, setDisplayText] = useState('');
  const fullText = 'Chowdhury Abdulla Nasir';
  
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center section-padding">
      <div className="max-w-6xl mx-auto text-center">
        {/* Profile Image */}
        <div className="mb-12 animate-fadeIn">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full blur-2xl opacity-30 animate-pulse" />
            <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-cyan-500/30 mx-auto">
              <img 
                src="/a.jpg" 
                alt="Chowdhury Abdulla Nasir"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Name with Typing Effect */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 animate-fadeInUp">
          <span className="text-gradient font-mono">{displayText}</span>
          <span className="animate-pulse">|</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-400 mb-4 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          Research Student @ CVLab
        </p>
        <p className="text-lg md:text-xl text-gray-500 mb-12 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
          University of Tsukuba, Japan
        </p>

        {/* Tags */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
          {['Computer Vision', 'Deep Learning', 'AI Research'].map((tag, index) => (
            <span 
              key={index}
              className="px-4 py-2 glass-morphism rounded-full text-sm text-cyan-400 hover-glow transition-all cursor-default"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
          <button
            onClick={() => scrollToSection('projects')}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all flex items-center justify-center gap-2 group"
          >
            View Projects
            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="px-8 py-4 glass-morphism rounded-lg font-semibold hover-glow transition-all"
          >
            Get in Touch
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-float">
          <ChevronDown className="text-gray-500" size={32} />
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="section-padding bg-slate-900/50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
          <span className="text-gradient">About Me</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Bio */}
          <div className="space-y-6">
            <p className="text-lg text-gray-300 leading-relaxed">
              I am a research student at the Computer Vision Lab (CVLab) at the University of Tsukuba, Japan. 
              My research focuses on cutting-edge computer vision and deep learning applications.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              Every project is a testament to discipline, and every paper is a testament to mastery. 
              I strive to push the boundaries of what's possible in AI and machine learning.
            </p>
          </div>

          {/* Right: Skills */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold mb-6 text-cyan-400">Technical Expertise</h3>
            
            <div className="space-y-4">
              {[
                { category: 'Frontend', skills: ['React', 'Vue', 'Next.js', 'Tailwind CSS'] },
                { category: 'Backend', skills: ['Node.js', 'Python', 'Firebase', 'REST API'] },
                { category: 'AI/ML', skills: ['PyTorch', 'TensorFlow', 'OpenCV', 'HuggingFace'] },
                { category: 'Tools', skills: ['Git', 'Docker', 'AWS', 'Arduino'] },
              ].map((item, index) => (
                <div key={index} className="glass-morphism rounded-lg p-4 hover-glow transition-all">
                  <h4 className="text-lg font-semibold text-purple-400 mb-2">{item.category}</h4>
                  <div className="flex flex-wrap gap-2">
                    {item.skills.map((skill, idx) => (
                      <span key={idx} className="text-sm text-gray-400 bg-slate-800 px-3 py-1 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ExpertiseSection() {
  const expertise = [
    {
      title: '剣術',
      subtitle: 'Frontend Mastery',
      desc: 'React, Vue, Next.js',
      gradient: 'from-cyan-500 to-blue-500',
      icon: '⚡'
    },
    {
      title: '忍術',
      subtitle: 'Backend Arts',
      desc: 'Node, Python, Databases',
      gradient: 'from-purple-500 to-pink-500',
      icon: '🔧'
    },
    {
      title: '武道',
      subtitle: 'Design Philosophy',
      desc: 'UI/UX, Responsive Design',
      gradient: 'from-blue-500 to-cyan-500',
      icon: '🎨'
    }
  ];

  return (
    <section className="section-padding">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
          <span className="text-gradient">Core Competencies</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {expertise.map((item, i) => (
            <div
              key={i}
              className="glass-morphism rounded-lg overflow-hidden hover-glow transition-all group"
              style={{
                opacity: 1,
                animation: `fadeInUp 0.8s ease-out forwards`,
                animationDelay: `${i * 0.2}s`
              }}
            >
              {/* Gradient Header */}
              <div className={`h-2 bg-gradient-to-r ${item.gradient}`} />
              
              <div className="p-8">
                {/* Icon */}
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>

                {/* Title */}
                <h3 
                  className="text-3xl font-bold mb-2 group-hover:text-cyan-400 transition-colors"
                  style={{
                    backgroundImage: `linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  {item.title}
                </h3>

                {/* Subtitle */}
                <p className="font-semibold text-lg text-gray-200 mb-3 tracking-wide">
                  {item.subtitle}
                </p>

                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ResearchSection() {
  const publications = [
    {
      title: 'Code Poisoning Through Misleading Comments',
      subtitle: 'Jailbreaking LLMs via Contextual Deception',
      authors: 'C.A. Nasir, et al.',
      venue: '2025 ICCIT',
      abstract: 'This study investigates the vulnerability of Large Language Models (LLMs) to code poisoning attacks through misleading comments.',
      link: 'https://www.researchgate.net/publication/400360433',
      tags: ['Machine Learning', 'Security', 'LLMs']
    },
    {
      title: 'Real-Time GPS and PTS Architecture',
      subtitle: 'Prototype and Simulation',
      authors: 'C.A. Nasir, et al.',
      venue: '2025 QPAIN',
      abstract: 'Explores the creation of a real-time Global Positioning System (GPS) and Passenger Tracking System (PTS).',
      link: 'https://ieeexplore.ieee.org/document/11172005',
      tags: ['IoT', 'Systems', 'GPS']
    },
    {
      title: 'Bangla-CrossHair Dataset',
      subtitle: 'Performance Analysis of OCR Engines',
      authors: 'C.A. Nasir, et al.',
      venue: '2025 ISACC',
      abstract: 'Comparative study of key metrics for OCR engines in Bangla language processing using PyTesseract and EasyOCR.',
      link: 'https://ieeexplore.ieee.org/document/10969286',
      tags: ['OCR', 'NLP', 'Dataset']
    },
    {
      title: 'ALPR: Bangla License Plate Detection',
      subtitle: 'ResNet50 powered OCR System',
      authors: 'C.A. Nasir, et al.',
      venue: '2024 I2CT',
      abstract: 'Implements MATLAB Image Processing Toolbox for license plate detection using ResNet50 and Linear SVM.',
      link: 'https://ieeexplore.ieee.org/document/10543675',
      tags: ['Computer Vision', 'Deep Learning', 'OCR']
    },
  ];

  const profiles = [
    { name: 'Google Scholar', link: 'https://scholar.google.com/citations?user=tHsPqpkAAAAJ&hl=en', icon: BookOpen },
    { name: 'ResearchGate', link: 'https://www.researchgate.net/profile/Abdulla-Chowdhury', icon: User },
    { name: 'IEEE Xplore', link: 'https://ieeexplore.ieee.org/author/580270477937590', icon: Code },
  ];

  return (
    <section id="research" className="section-padding">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">
          <span className="text-gradient">Research</span>
        </h2>
        <p className="text-center text-gray-400 mb-12 text-lg">
          Publications & Academic Contributions
        </p>

        {/* Academic Profiles */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {profiles.map((profile, index) => (
            <a
              key={index}
              href={profile.link}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-morphism rounded-lg p-6 hover-glow transition-all group text-center"
            >
              <profile.icon className="mx-auto mb-4 text-cyan-400 group-hover:scale-110 transition-transform" size={40} />
              <h3 className="text-lg font-semibold text-gray-200 group-hover:text-cyan-400 transition-colors">
                {profile.name}
              </h3>
            </a>
          ))}
        </div>

        {/* Publications */}
        <div className="space-y-6">
          {publications.map((pub, index) => (
            <div 
              key={index}
              className="glass-morphism rounded-lg p-6 hover-glow transition-all group"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-100 mb-1 group-hover:text-cyan-400 transition-colors">
                    {pub.title}
                  </h3>
                  <p className="text-sm text-purple-400 mb-2">{pub.subtitle}</p>
                  <p className="text-sm text-gray-400 mb-1">{pub.authors}</p>
                  <p className="text-sm text-gray-500 italic">{pub.venue}</p>
                </div>
                <a
                  href={pub.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all flex items-center gap-2 group whitespace-nowrap"
                >
                  View Paper
                  <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
              <p className="text-gray-300 mb-4">{pub.abstract}</p>
              <div className="flex flex-wrap gap-2">
                {pub.tags.map((tag, idx) => (
                  <span 
                    key={idx}
                    className="px-3 py-1 bg-slate-800 text-cyan-400 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectsSection({ activeProject, setActiveProject }) {
  const projects = [
    {
      title: 'Apnea Detector',
      description: 'A web application that utilizes deep learning to detect sleep apnea from audio recordings, providing real-time analysis and feedback.',
      tech: ['HuggingFace', 'Gradio', 'Python', 'Deep Learning'],
      github: 'https://github.com/Abdullah-Nasir-Chowdhury/Apnea-Detector',
      demo: 'https://youtu.be/G2h5vp80e2s?si=A4XVePqcFST4Tzj4',
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      title: 'E-commerce App for ASUS',
      description: 'A comprehensive e-commerce application built for ASUS, featuring product listings, user authentication, and payment integration.',
      tech: ['Python', 'Flutter', 'Firebase', 'Dart', 'REST API'],
      github: 'https://github.com/Abdullah-Nasir-Chowdhury/asus-ecommerce-app',
      demo: null,
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Full Stack IoT Application',
      description: 'An IoT application integrating ESP8266 with Flutter frontend and Firebase backend for real-time data monitoring and control.',
      tech: ['Flutter', 'Firebase', 'ArduinoIDE', 'ESP8266', 'C++'],
      github: 'https://github.com/Abdullah-Nasir-Chowdhury/IOT-Application_ESP8266-Flutter-Firebase',
      demo: 'https://youtu.be/JxMownOBc4A?si=eMhQRYxraM1b2t7P',
      gradient: 'from-blue-500 to-purple-500'
    }
  ];

  return (
    <section id="projects" className="section-padding bg-slate-900/50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">
          <span className="text-gradient">Projects</span>
        </h2>
        <p className="text-center text-gray-400 mb-12 text-lg">
          Crafted with precision and purpose
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="glass-morphism rounded-lg overflow-hidden hover-glow transition-all group cursor-pointer"
              onClick={() => setActiveProject(activeProject === index ? null : index)}
            >
              {/* Gradient Header */}
              <div className={`h-2 bg-gradient-to-r ${project.gradient}`} />
              
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-100 mb-3 group-hover:text-cyan-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-300 mb-4 leading-relaxed">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-1 bg-slate-800 text-xs text-gray-400 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex gap-3">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-center font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all flex items-center justify-center gap-2 group"
                  >
                    <Github size={18} />
                    Code
                  </a>
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 px-4 py-2 glass-morphism rounded-lg text-center font-semibold hover-glow transition-all flex items-center justify-center gap-2"
                    >
                      <ExternalLink size={18} />
                      Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const socialLinks = [
    { name: 'LinkedIn', icon: Linkedin, url: 'https://www.linkedin.com/in/anc19990/', color: 'hover:text-blue-400' },
    { name: 'GitHub', icon: Github, url: 'https://github.com/Abdullah-Nasir-Chowdhury', color: 'hover:text-gray-300' },
    { name: 'Twitter', icon: Twitter, url: 'https://x.com/AbdullahN23439', color: 'hover:text-sky-400' },
    { name: 'Facebook', icon: Facebook, url: 'https://www.facebook.com/dayi.abdullah.75/', color: 'hover:text-blue-500' },
    { name: 'Instagram', icon: Instagram, url: 'https://www.instagram.com/abdullah_nasir_chowdhury/', color: 'hover:text-pink-400' },
    { name: 'Line', icon: MessageCircle, url: 'https://line.me/ti/p/R2Hx8jRqM6', color: 'hover:text-green-400' },
  ];

  return (
    <section id="contact" className="section-padding">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          <span className="text-gradient">Get in Touch</span>
        </h2>
        <p className="text-gray-400 mb-12 text-lg">
          Let's connect and collaborate
        </p>

        {/* Email */}
        <div className="glass-morphism rounded-lg p-8 mb-12 hover-glow transition-all">
          <Mail className="mx-auto mb-4 text-cyan-400" size={48} />
          <h3 className="text-2xl font-semibold mb-2 text-gray-100">Email</h3>
          <a 
            href="mailto:abdullahnasirchowdhury1@gmail.com"
            className="text-lg text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            abdullahnasirchowdhury1@gmail.com
          </a>
        </div>

        {/* Social Links */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`glass-morphism rounded-lg p-6 hover-glow transition-all group ${social.color}`}
            >
              <social.icon className="mx-auto mb-3 group-hover:scale-110 transition-transform" size={32} />
              <p className="font-semibold text-gray-300">{social.name}</p>
            </a>
          ))}
        </div>

        {/* Location */}
        <div className="mt-12 text-gray-400">
          <p className="text-lg">CVLab, University of Tsukuba</p>
          <p>Tsukuba, Ibaraki, Japan</p>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-950 py-8 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <p className="text-gray-500">
          © 2025 Chowdhury Abdulla Nasir. All rights reserved.
        </p>
        <p className="text-gray-600 text-sm mt-2">
          Designed with precision and passion
        </p>
      </div>
    </footer>
  );
}