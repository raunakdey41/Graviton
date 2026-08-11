import React, { useState, useEffect } from 'react';
import { Atom } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Animate progress 0 to 100 over ~1.8 seconds
    const duration = 1800;
    const interval = 20;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const nextProgress = Math.min(100, Math.floor((currentStep / steps) * 100));
      setProgress(nextProgress);

      if (currentStep >= steps) {
        clearInterval(timer);
        // Start fade out after a short pause
        setTimeout(() => {
          setIsFading(true);
          // Remove from DOM after fade completes
          setTimeout(() => setIsVisible(false), 500);
        }, 400);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white transition-opacity duration-500 ease-in-out ${isFading ? 'opacity-0' : 'opacity-100'}`}
    >
      <div className="flex flex-col items-center max-w-sm w-full px-6">
        {/* Glowing Logo */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full scale-150 animate-pulse" />
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-stone-600 via-stone-600 to-amber-500 flex items-center justify-center shadow-2xl shadow-stone-500/30 relative z-10">
            <Atom className="w-14 h-14 text-white animate-[spin_10s_linear_infinite]" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="font-heading text-4xl font-extrabold tracking-tight text-slate-900 flex items-center justify-center gap-2 mb-2">
            GRAV<span className="text-amber-600">ITON</span>
            <span className="text-lg font-mono px-2 py-1 rounded-md bg-stone-100 text-stone-600 border border-stone-300 font-normal">LAB</span>
          </h1>
          <p className="text-sm text-slate-500 tracking-widest uppercase font-medium">
            Interactive Physics Workspace
          </p>
        </div>

        {/* Loading Bar & Text */}
        <div className="w-full flex flex-col gap-3">
          <div className="flex justify-between items-end text-xs font-mono font-bold">
            <span className="text-amber-600 animate-pulse">INITIALIZING VIRTUAL LABS...</span>
            <span className="text-slate-600">{progress}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden border border-slate-300">
            <div 
              className="h-full bg-gradient-to-r from-amber-600 to-amber-500 transition-all duration-75 ease-linear rounded-full shadow-[0_0_10px_rgba(251,191,36,0.5)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
