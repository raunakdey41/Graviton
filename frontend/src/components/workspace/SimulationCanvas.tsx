import React, { useRef } from 'react';
import { useSimulationStore } from '../../store/useSimulationStore';
import { CORE_SIMULATIONS } from '../../data/simulationsData';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';

// Import individual simulations
import { FreeFallSim } from '../../simulations/mechanics/FreeFallSim';
import { UniversalMotionSim } from '../../simulations/mechanics/UniversalMotionSim';
import { FrictionSim } from '../../simulations/mechanics/FrictionSim';
import { PendulumSim } from '../../simulations/mechanics/PendulumSim';
import { CircularMotionSim } from '../../simulations/mechanics/CircularMotionSim';
import { SpringMassSim } from '../../simulations/mechanics/SpringMassSim';
import { ProjectileSim } from '../../simulations/mechanics/ProjectileSim';
import { CollisionSim } from '../../simulations/mechanics/CollisionSim';
import { RayOpticsSim } from '../../simulations/waves_optics/RayOpticsSim';
import { ACCircuitSim } from '../../simulations/electromagnetism/ACCircuitSim';
import { MagneticFieldSim } from '../../simulations/electromagnetism/MagneticFieldSim';
import { GasLawsSim } from '../../simulations/thermodynamics/GasLawsSim';
import { PhotoelectricSim } from '../../simulations/modern_physics/PhotoelectricSim';

// New Imports
import { LateralInversionSim } from '../../simulations/waves_optics/LateralInversionSim';
import { CriticalAngleSim } from '../../simulations/waves_optics/CriticalAngleSim';
import { WaveInterferenceSim } from '../../simulations/waves_optics/WaveInterferenceSim';
import { AlphaRadiationSim } from '../../simulations/nuclear/AlphaRadiationSim';
import { BetaRadiationSim } from '../../simulations/nuclear/BetaRadiationSim';
import { GammaRadiationSim } from '../../simulations/nuclear/GammaRadiationSim';

export const SimulationCanvas: React.FC = () => {
  const { 
    currentSimId, isRunning, toggleRunning, resetSimulation, 
    playbackSpeed, setPlaybackSpeed,
    showVelocityVector, showAccelerationVector, showForceVector, showGrid, toggleVector
  } = useSimulationStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const sim = CORE_SIMULATIONS.find(s => s.id === currentSimId);

  const handleReset = () => {
    if (!sim) return;
    const defaults: Record<string, number> = {};
    sim.parameters.forEach(p => { defaults[p.id] = p.defaultValue; });
    resetSimulation(defaults);
  };


  const renderActiveSimulation = () => {
    switch (currentSimId) {
      case 'universal-motion-lab': return <UniversalMotionSim />;
      case 'friction-inclined-plane': return <FrictionSim />;
      case 'pendulum-motion': return <PendulumSim />;
      case 'circular-motion': return <CircularMotionSim />;
      case 'spring-mass-oscillator': return <SpringMassSim />;
      case 'projectile-motion': return <ProjectileSim />;
      case 'collisions-momentum': return <CollisionSim />;
      case 'ray-optics-lenses': return <RayOpticsSim />;
      case 'ac-circuit-resonance': return <ACCircuitSim />;
      case 'magnetic-field-lorentz': return <MagneticFieldSim />;
      case 'gas-laws-thermo': return <GasLawsSim />;
      case 'photoelectric-effect': return <PhotoelectricSim />;
      case 'lateral-inversion': return <LateralInversionSim />;
      case 'critical-angle': return <CriticalAngleSim />;
      case 'wave-interference': return <WaveInterferenceSim />;
      case 'alpha-radiation': return <AlphaRadiationSim />;
      case 'beta-radiation': return <BetaRadiationSim />;
      case 'gamma-radiation': return <GammaRadiationSim />;
      case 'free-fall': return <FreeFallSim />;
      default: return <FreeFallSim />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white shadow-xl/40 rounded-2xl border border-slate-200 overflow-hidden shadow-2xl relative group">
      {/* Top Simulation Bar */}
      <div className="h-12 bg-white shadow-2xl border-b border-slate-200 px-4 flex items-center justify-between overflow-x-auto hide-scrollbar z-20 flex-shrink-0 backdrop-blur-md">
        <div className="flex items-center gap-2 min-w-0 pr-2">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-400 animate-pulse flex-shrink-0" />
          <h2 className="font-heading text-xs sm:text-sm font-extrabold text-slate-900 tracking-wide truncate">
            {sim?.title || currentSimId}
          </h2>
          <span className="hidden md:inline text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100 text-stone-700 border-stone-200 shadow-sm">
            60 FPS Engine
          </span>
        </div>

        {/* Vector Display Toggles */}
        <div className="flex items-center gap-1 bg-slate-100 shrink-0 border border-slate-200 p-1 rounded-xl text-[10px] font-mono">
          <span className="text-slate-600 hidden xl:inline px-1.5 font-sans font-semibold">Vectors:</span>
          
          <button 
            onClick={() => toggleVector('velocity')}
            className={`px-2 py-0.5 rounded-lg transition-all ${showVelocityVector ? 'bg-amber-600 text-slate-900 font-bold shadow' : 'text-slate-500 hover:text-slate-700'}`}
          >
            v (Velocity)
          </button>
          
          <button 
            onClick={() => toggleVector('acceleration')}
            className={`px-2 py-0.5 rounded-lg transition-all ${showAccelerationVector ? 'bg-amber-600 text-slate-900 font-bold shadow' : 'text-slate-500 hover:text-slate-700'}`}
          >
            a (Accel)
          </button>
          
          <button 
            onClick={() => toggleVector('force')}
            className={`px-2 py-0.5 rounded-lg transition-all ${showForceVector ? 'bg-stone-600 text-slate-900 font-bold shadow' : 'text-slate-500 hover:text-slate-700'}`}
          >
            F (Force)
          </button>
          
          <button 
            onClick={() => toggleVector('grid')}
            className={`px-2 py-0.5 rounded-lg transition-all ${showGrid ? 'bg-stone-600 text-slate-900 font-bold shadow' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Grid
          </button>
        </div>
      </div>

      {/* Main Interactive Canvas Viewport */}
      <div ref={containerRef} className="flex-1 relative overflow-hidden bg-transparent flex items-center justify-center">
        {renderActiveSimulation()}
      </div>

      {/* Bottom Playback & Speed Controls Bar */}
      <div className="h-14 bg-slate-50 shadow-md/95 border-t border-slate-200 px-4 flex items-center justify-between overflow-x-auto hide-scrollbar z-20 flex-shrink-0 backdrop-blur-md">
        {/* Play / Pause & Reset */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleRunning}
            className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 ${
              isRunning 
                ? 'bg-gradient-to-tr from-stone-600 to-stone-500 text-slate-900 shadow-stone-500/30' 
                : 'bg-gradient-to-tr from-orange-600 to-orange-500 text-slate-900 shadow-orange-500/30'
            }`}
            title={isRunning ? 'Pause Simulation' : 'Play / Resume Simulation'}
          >
            {isRunning ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>

          <button
            onClick={handleReset}
            className="w-9 h-9 rounded-xl bg-slate-50 shadow-md hover:bg-space-700 border border-slate-200 flex items-center justify-center text-slate-700 hover:text-slate-900 transition-all shadow"
            title="Reset simulation time and motion position"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="hidden sm:flex flex-col ml-2">
            <span className="text-[11px] font-bold text-slate-800">{isRunning ? 'Running Simulation...' : 'Simulation Paused'}</span>
            <span className="text-[9px] font-mono text-slate-600">Time Step: Real-time dynamic integration</span>
          </div>
        </div>

        {/* Slow-Motion Speed Selector */}
        <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 p-1 px-2 rounded-xl text-xs font-semibold">
          <Clock className="w-4 h-4 text-stone-400 mr-1 hidden sm:inline" />
          <span className="text-slate-600 mr-1 hidden sm:inline text-xs">Speed:</span>
          
          {[0.25, 0.5, 1, 2].map((spd) => (
            <button
              key={spd}
              onClick={() => setPlaybackSpeed(spd)}
              className={`px-2 py-1 rounded-lg font-mono transition-all text-xs ${
                playbackSpeed === spd
                  ? 'bg-gradient-to-r from-stone-600 to-stone-500 text-slate-900 font-extrabold shadow-md shadow-stone-500/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
