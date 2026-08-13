import React, { useEffect, useRef, useState } from 'react';
import { useSimulationStore } from '../../store/useSimulationStore';
import { drawGrid, drawArrow, drawLegend, drawSphere } from '../../utils/canvasUtils';

export const MagneticFieldSim: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { parameters, isRunning, playbackSpeed, timeStep, showVelocityVector, showForceVector, showGrid } = useSimulationStore();
  
  const [lorentzData, setLorentzData] = useState({ radiusCm: 0, forceN: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = 0;
    const B = parameters.magField ?? 1.5;
    const v = parameters.velocity ?? 80;
    const q_mC = parameters.charge ?? 2;
    const m_mg = parameters.mass ?? 4;

    const q = Math.abs(q_mC) * 1e-3 || 1e-3;
    const m = m_mg * 1e-6;
    const r_meters = B === 0 ? Infinity : Math.abs((m * v) / (q * B));
    const force = q * v * Math.abs(B);
    const omega = r_meters === Infinity ? 0 : v / r_meters;
    const dt = 0.001 * playbackSpeed;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      if (showGrid) drawGrid(ctx, width, height, 40);

      if (useSimulationStore.getState().isRunning) {
        const direction = (q_mC >= 0 ? 1 : -1) * (B >= 0 ? 1 : -1);
        angle += direction * omega * dt;
        setLorentzData({ radiusCm: r_meters === Infinity ? 0 : r_meters * 100, forceN: force });
      }

      // Draw Magnetic Field Dots (Field into the screen 'X' or out of screen '•')
      ctx.fillStyle = '#64748B';
      ctx.font = '14px font-mono';
      for (let i = 80; i < width - 60; i += 60) {
        for (let j = 80; j < height - 100; j += 60) {
          ctx.fillText('⊗', i, j);
        }
      }

      // Cyclotron center and orbit
      const centerX = width / 2;
      const centerY = height / 2 - 20;
      const scale = 3.5; // pixels per cm
      const orbitR_px = Math.min(220, r_meters * 100 * scale);

      const partX = centerX + orbitR_px * Math.cos(angle);
      const partY = centerY + orbitR_px * Math.sin(angle);

      // Draw Orbit Path
      ctx.save();
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.35)';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(centerX, centerY, orbitR_px, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Draw Particle
      const color = q_mC >= 0 ? '#800000' : '#D2691E';
      drawSphere(ctx, partX, partY, 16, color, color);
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 12px Inter';
      ctx.fillText(`${q_mC >= 0 ? '+' : ''}${q_mC}mC Ion`, partX + 20, partY + 5);

      // Vectors
      if (showVelocityVector) {
        const vx = -Math.sin(angle) * (q_mC >= 0 ? 1 : -1) * 35;
        const vy = Math.cos(angle) * (q_mC >= 0 ? 1 : -1) * 35;
        drawArrow(ctx, partX, partY, partX + vx, partY + vy, '#A0522D', `v=${v}m/s`);
      }
      if (showForceVector) {
        // Lorentz force points inward to circle center
        drawArrow(ctx, partX, partY, partX + (centerX - partX) * 0.5, partY + (centerY - partY) * 0.5, '#D2B48C', 'F_B');
      }

      drawLegend(ctx, [
        { label: 'Charged Ion Particle', color: color },
        { label: 'Lorentz Magnetic Force (F_B)', color: '#D2B48C' },
        { label: 'Uniform Field (B ⊗ Into Screen)', color: '#64748B' }
      ], 20, 20);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [playbackSpeed, parameters, showGrid, showVelocityVector, showForceVector, timeStep]);

  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center">
      <canvas ref={canvasRef} width={800} height={600} className="w-full h-full object-contain  border border-slate-200 rounded-xl bg-white shadow-inner" />
      
      <div className="absolute bottom-4 max-w-xl mx-auto w-full bg-white/95 shadow-xl border border-slate-200 rounded-2xl p-3.5 px-6 shadow-2xl backdrop-blur-md flex items-center justify-between font-mono text-xs">
        <div>
          <div className="text-slate-400 font-sans font-bold mb-1">Orbital Radius (r)</div>
          <div className="text-base font-bold text-amber-300">{lorentzData.radiusCm.toFixed(1)} cm</div>
        </div>
        <div>
          <div className="text-slate-400 font-sans font-bold mb-1">Magnetic Deflect Force</div>
          <div className="text-base font-bold text-amber-400">{(lorentzData.forceN * 1e6).toFixed(2)} μN</div>
        </div>
      </div>
    </div>
  );
};
