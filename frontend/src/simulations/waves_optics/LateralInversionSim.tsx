import React, { useEffect, useRef } from 'react';
import { useSimulationStore } from '../../store/useSimulationStore';
import { drawGrid, drawLegend } from '../../utils/canvasUtils';

export const LateralInversionSim: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { parameters, showGrid } = useSimulationStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const u = parameters.distance || -40; // cm

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (showGrid) drawGrid(ctx, canvas.width, canvas.height, 40);
      
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const scale = 4; // px per cm

      // Draw Plane Mirror
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(cx - 5, cy - 150, 10, 300);
      // Hash marks
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1;
      for (let y = cy - 140; y < cy + 140; y += 15) {
        ctx.beginPath();
        ctx.moveTo(cx + 5, y);
        ctx.lineTo(cx + 15, y + 10);
        ctx.stroke();
      }

      // Draw Principal Axis
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.beginPath();
      ctx.moveTo(0, cy + 100);
      ctx.lineTo(canvas.width, cy + 100);
      ctx.stroke();

      const objX = cx + u * scale;
      const imgX = cx - u * scale; // v = -u

      // Draw Object (Letter F)
      ctx.save();
      ctx.translate(objX, cy);
      ctx.fillStyle = '#A0522D';
      ctx.font = 'bold 120px Inter';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('F', 0, 0);
      
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '14px Inter';
      ctx.fillText(`Real Object`, 0, 120);
      ctx.restore();

      // Draw Image (Laterally Inverted Letter F)
      ctx.save();
      ctx.translate(imgX, cy);
      ctx.scale(-1, 1); // Flip horizontally for lateral inversion
      ctx.fillStyle = 'rgba(128, 0, 0, 0.7)'; // Reddish for virtual
      ctx.font = 'bold 120px Inter';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('F', 0, 0);
      ctx.restore();

      ctx.save();
      ctx.translate(imgX, cy);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '14px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(`Virtual Image`, 0, 120);
      ctx.restore();

      drawLegend(ctx, [
        { label: 'Plane Mirror', color: '#94a3b8' },
        { label: 'Real Object', color: '#A0522D' },
        { label: 'Virtual Inverted Image', color: '#800000' }
      ], 20, 20);

      animId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animId);
  }, [parameters, showGrid]);

  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center">
      <canvas ref={canvasRef} width={800} height={600} className="w-full h-full object-cover max-w-4xl border border-slate-200 rounded-xl bg-white shadow-inner" />
    </div>
  );
};
