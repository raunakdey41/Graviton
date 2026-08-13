import React, { useEffect, useRef } from 'react';
import { useSimulationStore } from '../../store/useSimulationStore';

export const GammaRadiationSim: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { parameters, playbackSpeed } = useSimulationStore();
  const photons = useRef<Array<{x: number, y: number, speed: number, waveOffset: number}>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const thickness = parameters.leadThickness || 5;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cy = canvas.height / 2;

      // Draw source
      ctx.fillStyle = '#475569';
      ctx.fillRect(50, cy - 40, 60, 80);
      ctx.fillStyle = '#a78bfa';
      ctx.font = 'bold 16px font-mono';
      ctx.fillText('Co-60', 55, cy + 5);

      // Draw Shield
      const shieldX = 350;
      if (thickness > 0) {
        ctx.fillStyle = '#475569'; // Lead
        const width = thickness * 10;
        ctx.fillRect(shieldX, cy - 150, width, 300);
        ctx.fillStyle = '#000000';
        ctx.fillText(`Lead (${thickness}cm)`, shieldX, cy - 160);
      }

      if (useSimulationStore.getState().isRunning) {
        // Emit photons
        if (Math.random() < 0.4 * playbackSpeed) {
          photons.current.push({ x: 110, y: cy + (Math.random() - 0.5) * 60, speed: 12, waveOffset: Math.random() * Math.PI * 2 });
        }
        
        // Update photons
        photons.current = photons.current.filter(p => {
          p.x += p.speed * playbackSpeed;
          p.waveOffset += 0.5;

          // Attenuation check when inside lead block
          if (thickness > 0 && p.x >= shieldX && p.x <= shieldX + thickness * 10) {
            // Probabilistic absorption based on distance traveled in lead
            // I = I0 * e^(-ux) -> simulate per frame chance of absorption
            const absorptionChance = 0.05; // 5% per frame inside lead
            if (Math.random() < absorptionChance) {
              return false; // Absorbed
            }
          }
          return p.x < canvas.width;
        });
      }

      // Draw photons as waves
      ctx.strokeStyle = '#a78bfa'; // Gamma is purple
      ctx.lineWidth = 2;
      photons.current.forEach(p => {
        ctx.beginPath();
        for(let i=0; i<30; i++) {
          const px = p.x - i;
          const py = p.y + Math.sin(p.waveOffset - i * 0.5) * 4;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      });

      // Legend
      ctx.fillStyle = '#0f172a';
      ctx.font = '14px sans-serif';
      ctx.fillText('Gamma Rays (High-energy Photons): Highly penetrating, attenuated by thick lead.', 20, 30);

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
