import React, { useEffect, useRef, useState } from 'react';
import { useSimulationStore } from '../../store/useSimulationStore';
import { drawGrid, drawLegend } from '../../utils/canvasUtils';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export const GasLawsSim: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { parameters, isRunning, playbackSpeed, timeStep, showGrid } = useSimulationStore();
  const [pressureAtm, setPressureAtm] = useState(1.0);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    // Initialize random atoms
    const atoms: Particle[] = [];
    for (let i = 0; i < 40; i++) {
      atoms.push({
        x: 250 + Math.random() * 250,
        y: 150 + Math.random() * 200,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6
      });
    }
    particlesRef.current = atoms;
  }, [timeStep]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const V_L = parameters.volume || 4.0;
    const T_K = parameters.temperature || 300;
    const n = parameters.moles || 2.0;
    const dt = 0.5 * playbackSpeed;

    const R = 8.314;
    const P_atm = ((n * R * T_K) / (V_L * 1e-3)) / 101325;

    const chamberWidth = Math.min(520, V_L * 65);
    const chamberLeft = 140;
    const chamberTop = 120;
    const chamberHeight = 320;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      if (showGrid) drawGrid(ctx, width, height, 40);

      if (useSimulationStore.getState().isRunning) {
        setPressureAtm(P_atm);
        const speedScale = Math.sqrt(T_K / 300);
        
        particlesRef.current.forEach(p => {
          p.x += p.vx * speedScale * dt;
          p.y += p.vy * speedScale * dt;
          
          if (p.x < chamberLeft + 12) { p.x = chamberLeft + 12; p.vx *= -1; }
          if (p.x > chamberLeft + chamberWidth - 12) { p.x = chamberLeft + chamberWidth - 12; p.vx *= -1; }
          if (p.y < chamberTop + 12) { p.y = chamberTop + 12; p.vy *= -1; }
          if (p.y > chamberTop + chamberHeight - 12) { p.y = chamberTop + chamberHeight - 12; p.vy *= -1; }
        });
      }

      // Draw Piston Chamber
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.fillRect(chamberLeft, chamberTop, chamberWidth, chamberHeight);
      ctx.strokeStyle = '#A0522D';
      ctx.lineWidth = 6;
      ctx.strokeRect(chamberLeft, chamberTop, chamberWidth, chamberHeight);

      // Draw Moving Piston Head on Right
      ctx.fillStyle = '#64748B';
      ctx.fillRect(chamberLeft + chamberWidth, chamberTop - 10, 30, chamberHeight + 20);
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 14px font-mono';
      ctx.fillText(`Piston Volume = ${V_L} L`, chamberLeft + 15, chamberTop - 18);

      // Draw Molecules
      particlesRef.current.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = T_K > 450 ? '#800000' : '#D2691E';
        ctx.shadowColor = T_K > 450 ? '#800000' : '#D2691E';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      drawLegend(ctx, [
        { label: 'Ideal Gas Molecule Collisions', color: '#D2691E' },
        { label: 'Thermal Piston Enclosure', color: '#A0522D' }
      ], 20, 20);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [playbackSpeed, parameters, showGrid]);

  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center">
      <canvas ref={canvasRef} width={800} height={600} className="w-full h-full object-contain  border border-slate-200 rounded-xl bg-white shadow-inner" />
      
      <div className="absolute bottom-4 max-w-xl mx-auto w-full bg-white/95 shadow-xl border border-slate-200 rounded-2xl p-3.5 px-6 shadow-2xl backdrop-blur-md flex items-center justify-between font-mono text-xs">
        <div>
          <div className="text-slate-400 font-sans font-bold mb-1">Temperature (T)</div>
          <div className="text-base font-bold text-stone-400">{parameters.temperature || 300} K</div>
        </div>
        <div>
          <div className="text-slate-400 font-sans font-bold mb-1">Chamber Volume (V)</div>
          <div className="text-base font-bold text-amber-300">{parameters.volume || 4.0} L</div>
        </div>
        <div>
          <div className="text-slate-400 font-sans font-bold mb-1">Internal Pressure (P)</div>
          <div className="text-base font-bold text-orange-400">{pressureAtm.toFixed(2)} atm</div>
        </div>
      </div>
    </div>
  );
};
