import React, { useEffect, useRef } from 'react';
import { useSimulationStore } from '../../store/useSimulationStore';

export const AlphaRadiationSim: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { parameters, playbackSpeed } = useSimulationStore();
  const particles = useRef<Array<{x: number, y: number, speed: number}>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const shield = parameters.shield || 0; // 0: None, 1: Paper, 2: Aluminum

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cy = canvas.height / 2;

      // Draw source
      ctx.fillStyle = '#475569';
      ctx.fillRect(50, cy - 40, 60, 80);
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 16px font-mono';
      ctx.fillText('Am-241', 55, cy + 5);

      // Draw Shield
      const shieldX = 400;
      if (shield === 1) {
        ctx.fillStyle = '#f8fafc'; // Paper
        ctx.fillRect(shieldX, cy - 150, 10, 300);
        ctx.fillStyle = '#000000';
        ctx.fillText('Paper', shieldX - 15, cy - 160);
      } else if (shield === 2) {
        ctx.fillStyle = '#94a3b8'; // Aluminum
        ctx.fillRect(shieldX, cy - 150, 15, 300);
        ctx.fillStyle = '#000000';
        ctx.fillText('Aluminum', shieldX - 25, cy - 160);
      }

      if (useSimulationStore.getState().isRunning) {
        // Emit particles
        if (Math.random() < 0.2 * playbackSpeed) {
          particles.current.push({ x: 110, y: cy + (Math.random() - 0.5) * 60, speed: 4 + Math.random() * 2 });
        }
        
        // Update particles
        particles.current = particles.current.filter(p => {
          p.x += p.speed * playbackSpeed;
          // Alpha is stopped by anything (Paper or Aluminum)
          if (shield > 0 && p.x >= shieldX - 10) {
            return false; // Absorbed
          }
          return p.x < canvas.width;
        });
      }

      // Draw particles
      particles.current.forEach(p => {
        ctx.fillStyle = '#ef4444'; // Alpha is red
        ctx.beginPath();
        ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000000';
        ctx.font = '10px sans-serif';
        ctx.fillText('α', p.x - 3, p.y + 3);
      });

      // Legend
      ctx.fillStyle = '#0f172a';
      ctx.font = '14px sans-serif';
      ctx.fillText('Alpha Particles (He nucleus): High mass, stopped by paper.', 20, 30);

      animId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animId);
  }, [parameters, playbackSpeed]);

  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center">
      <canvas ref={canvasRef} width={800} height={600} className="w-full h-full object-contain  border border-slate-200 rounded-xl bg-slate-50 shadow-inner" />
    </div>
  );
};
