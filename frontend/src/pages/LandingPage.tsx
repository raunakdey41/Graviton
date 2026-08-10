import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Atom, Activity, Rocket, Zap, Microscope, Compass, Eclipse, Orbit } from 'lucide-react';

const features = [
  { name: 'Mechanics', icon: <Rocket />, description: 'Kinematics & Dynamics.', gradient: 'from-amber-600 to-amber-700' },
  { name: 'Electromagnetism', icon: <Zap />, description: 'Circuits & Magnetic Fields.', gradient: 'from-amber-700 to-amber-600' },
  { name: 'Thermodynamics', icon: <Activity />, description: 'Gas laws & Heat transfer.', gradient: 'from-amber-600 to-amber-600' },
  { name: 'Optics', icon: <Microscope />, description: 'Lenses, Mirrors & Waves.', gradient: 'from-amber-600 to-orange-600' },
  { name: 'Modern Physics', icon: <Atom />, description: 'Quantum & Relativity.', gradient: 'from-orange-600 to-amber-700' },
  { name: 'Astrophysics', icon: <Orbit />, description: 'Orbits & Gravity.', gradient: 'from-amber-700 to-amber-800' },
];

const LensCard = ({ feature, containerRef }: { feature: any, containerRef: React.RefObject<HTMLDivElement | null> }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const { scrollXProgress } = useScroll({
    container: containerRef,
    target: cardRef,
    axis: "x",
    offset: ["end start", "start end"]
  });

  const rotateY = useTransform(scrollXProgress, [0, 0.5, 1], [-45, 0, 45]);
  const rotateZ = useTransform(scrollXProgress, [0, 0.5, 1], [-15, 0, 15]);
  const scale = useTransform(scrollXProgress, [0, 0.5, 1], [0.75, 1, 0.75]);
  const y = useTransform(scrollXProgress, [0, 0.5, 1], [80, 0, 80]);
  const opacity = useTransform(scrollXProgress, [0, 0.2, 0.5, 0.8, 1], [0, 1, 1, 1, 0]);
  const zIndex = useTransform(scrollXProgress, [0, 0.5, 1], [0, 10, 0]);

  return (
    <motion.div 
      ref={cardRef}
      style={{ rotateY, rotateZ, scale, y, opacity, zIndex }}
      className="flex flex-col items-center justify-center shrink-0 snap-center mx-4"
    >
      <div className={`w-[260px] h-[360px] md:w-[320px] md:h-[420px] rounded-[36px] overflow-hidden shadow-2xl bg-gradient-to-br ${feature.gradient} relative flex items-center justify-center border-4 border-white/20`}>
        <div className="absolute inset-0 bg-white/10 shadow-[inset_0_0_50px_rgba(255,255,255,0.3)] pointer-events-none" />
        <div className="text-white/20 scale-[4] md:scale-[5] drop-shadow-2xl">
          {feature.icon}
        </div>
      </div>
      
      <h4 
        className="mt-8 text-slate-800 font-bold text-xl md:text-2xl font-mono tracking-widest uppercase drop-shadow-sm" 
        style={{ transform: 'rotate(-3deg)' }}
      >
        {feature.name}
      </h4>
    </motion.div>
  );
};

const FloatingPhysics = () => {
  const elements = [
    { text: 'F=ma', x: '10%', y: '20%', delay: 0, size: 'text-3xl' },
    { text: 'E=mc²', x: '80%', y: '15%', delay: 2, size: 'text-4xl' },
    { icon: <Compass size={48} />, x: '85%', y: '60%', delay: 1 },
    { text: 'v=u+at', x: '15%', y: '70%', delay: 3, size: 'text-2xl' },
    { text: 'λ=h/p', x: '50%', y: '85%', delay: 4, size: 'text-4xl' },
    { icon: <Eclipse size={64} />, x: '45%', y: '10%', delay: 2.5 },
    { text: 'W=ΔK', x: '75%', y: '12%', delay: 1.5, size: 'text-3xl' },
    { icon: <Zap size={40} />, x: '20%', y: '15%', delay: 0.5 },
    { text: 'V=IR', x: '5%', y: '50%', delay: 1.8, size: 'text-2xl' },
    { text: 'P=IV', x: '90%', y: '80%', delay: 2.2, size: 'text-3xl' },
    { text: 'Q=mcΔT', x: '35%', y: '25%', delay: 3.5, size: 'text-3xl' },
    { text: 'pV=nRT', x: '65%', y: '75%', delay: 0.8, size: 'text-3xl' },
    { icon: <Activity size={32} />, x: '60%', y: '20%', delay: 1.2 },
    { text: 'g=9.8', x: '20%', y: '85%', delay: 2.7, size: 'text-2xl' },
    { text: 'τ=r×F', x: '75%', y: '90%', delay: 1.1, size: 'text-2xl' },
    { icon: <Orbit size={36} />, x: '40%', y: '65%', delay: 3.2 },
    { text: 'c=λν', x: '15%', y: '8%', delay: 4.5, size: 'text-3xl' },
    { text: 'Φ=BA', x: '85%', y: '10%', delay: 2.9, size: 'text-3xl' },
    { icon: <Rocket size={40} />, x: '30%', y: '80%', delay: 0.3 },
    { text: 'p=mv', x: '60%', y: '8%', delay: 3.8, size: 'text-3xl' },
  ];

  return (
    <div 
      className="absolute inset-0 overflow-hidden pointer-events-none z-0"
      style={{
        maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,0.15) 25%, rgba(0,0,0,1) 60%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,0.15) 25%, rgba(0,0,0,1) 60%)'
      }}
    >
      {elements.map((m, i) => (
        <motion.div
          key={i}
          className={`absolute text-amber-700/60 font-medium ${m.size || ''} ${i % 3 === 0 ? 'hidden md:block' : ''}`}
          style={{ left: m.x, top: m.y }}
          animate={{
            y: [0, -40, 0],
            x: [0, 20, 0],
            rotate: [0, 15, -15, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 6 + (i % 7) * 1.5,
            repeat: Infinity,
            delay: m.delay * 0.5,
            ease: "easeInOut"
          }}
        >
          {m.text || m.icon}
        </motion.div>
      ))}
    </div>
  );
};

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const carouselRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;

    let animationId: number;
    
    setTimeout(() => {
      container.scrollLeft = container.scrollWidth / 3;
    }, 100);

    const scrollStep = () => {
      container.scrollLeft += 1.5; 
      if (container.scrollLeft >= (container.scrollWidth * 2) / 3) {
        container.scrollLeft -= container.scrollWidth / 3;
      }
      animationId = requestAnimationFrame(scrollStep);
    };
    
    animationId = requestAnimationFrame(scrollStep);
    return () => cancelAnimationFrame(animationId);
  }, []);

  const extendedFeatures = [...features, ...features, ...features];

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-[#fdfbf7]">
      {/* Hero Section */}
      <header className="relative z-10 w-full overflow-hidden">
        <FloatingPhysics />
        <div className="relative z-10 container mx-auto px-6 py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center items-center gap-2 md:gap-3 mb-6">
              <Atom className="w-10 h-10 md:w-12 md:h-12 text-amber-600 animate-[spin_10s_linear_infinite]" />
              <h1 className="text-5xl md:text-[80px] font-heading font-extrabold tracking-tight leading-none text-slate-900">Graviton</h1>
            </div>
            <h2 className="text-3xl md:text-6xl font-bold mb-6 text-slate-800">
              Interactive <span className="text-amber-700">Physics Workspace</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10">
              Simulate gravity, observe kinematics, experiment with optics, and explore physics like never before. 
              The ultimate 60 FPS physics engine for the web.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => navigate('/workspace')}
                className="px-12 py-5 text-xl bg-[#4E342E] hover:bg-[#3E2723] text-white rounded-lg font-bold shadow-xl shadow-amber-900/20 transition-all transform hover:scale-105"
              >
                Launch Workspace
              </button>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Features Section */}
      <section className="relative z-10 w-full py-24 overflow-hidden pointer-events-none">
        <div className="text-center mb-10 px-6">
          <h3 className="text-4xl font-bold mb-4 text-slate-800">Explore The <span className="text-amber-700">Simulations</span></h3>
          <p className="text-slate-600">A comprehensive suite of tools, rotating automatically.</p>
        </div>

        <div 
          ref={carouselRef}
          className="flex overflow-x-auto overflow-y-visible px-[5vw] md:px-[35vw] py-16 gap-4 md:gap-8 hide-scrollbar"
          style={{ perspective: '1200px' }}
        >
          {extendedFeatures.map((feature, idx) => (
            <LensCard key={idx} feature={feature} containerRef={carouselRef} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-amber-900/10 mt-12 py-12 text-center bg-white/50">
        <div className="container mx-auto px-6">
          <h4 className="text-2xl font-bold mb-4 text-slate-800">Proudly Open Source</h4>
          <p className="text-slate-600 mb-6 max-w-lg mx-auto">
            <span className="font-heading font-bold text-3xl align-middle">Graviton</span> is designed for interactive learning. Explore physics concepts with real-time feedback.
          </p>
          <p className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} Graviton Labs. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
