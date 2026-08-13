import React, { useEffect, useRef } from 'react';
import { useSimulationStore } from '../../store/useSimulationStore';
import { drawGrid, drawLegend } from '../../utils/canvasUtils';

export const CriticalAngleSim: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { parameters, showGrid } = useSimulationStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const n1 = parameters.n1 || 1.5;
    const n2 = parameters.n2 || 1.0;
    const angleDeg = parameters.angle || 30;
    const angleRad = (angleDeg * Math.PI) / 180;

    const criticalAngle = n1 > n2 ? Math.asin(n2 / n1) * (180 / Math.PI) : null;
    const isTIR = criticalAngle !== null && angleDeg > criticalAngle;
    
    // Snell's Law: n1 * sin(theta1) = n2 * sin(theta2)
    const sinTheta2 = (n1 / n2) * Math.sin(angleRad);
    const theta2Rad = isTIR ? angleRad : Math.asin(sinTheta2);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (showGrid) drawGrid(ctx, canvas.width, canvas.height, 40);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Draw Mediums
      ctx.fillStyle = `rgba(56, 189, 248, ${0.1 + (n1 - 1) * 0.2})`;
      ctx.fillRect(0, cy, canvas.width, cy); // Bottom medium
      
      ctx.fillStyle = `rgba(56, 189, 248, ${0.1 + (n2 - 1) * 0.2})`;
      ctx.fillRect(0, 0, canvas.width, cy); // Top medium

      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 16px Inter';
      ctx.fillText(`Medium 1 (n = ${n1.toFixed(2)})`, 20, canvas.height - 20);
      ctx.fillText(`Medium 2 (n = ${n2.toFixed(2)})`, 20, 30);

      // Draw Normal Line
      ctx.strokeStyle = '#94a3b8';
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(cx, 50);
      ctx.lineTo(cx, canvas.height - 50);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Incident Ray
      ctx.strokeStyle = '#fde047'; // Yellow laser
      ctx.lineWidth = 4;
      ctx.shadowColor = '#fde047';
      ctx.shadowBlur = 10;
      
      const rayLen = 250;
      const incX = cx - rayLen * Math.sin(angleRad);
      const incY = cy + rayLen * Math.cos(angleRad);
      
      ctx.beginPath();
      ctx.moveTo(incX, incY);
      ctx.lineTo(cx, cy);
      ctx.stroke();

      // Draw Refracted / Reflected Ray
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      if (isTIR) {
        // Reflection
        ctx.strokeStyle = '#fde047';
        const refX = cx + rayLen * Math.sin(angleRad);
        const refY = cy + rayLen * Math.cos(angleRad);
        ctx.lineTo(refX, refY);
        ctx.stroke();
        
        ctx.fillStyle = '#ef4444';
        ctx.shadowBlur = 0;
        ctx.font = 'bold 14px Inter';
        ctx.fillText('Total Internal Reflection', cx + 40, cy + 40);
      } else {
        // Refraction
        ctx.strokeStyle = '#fde047';
        // Reduced intensity for refracted ray
        ctx.globalAlpha = 0.7;
        const refX = cx + rayLen * Math.sin(theta2Rad);
        const refY = cy - rayLen * Math.cos(theta2Rad);
        ctx.lineTo(refX, refY);
        ctx.stroke();
        ctx.globalAlpha = 1.0;
      }
      
      // Draw partially reflected ray if not TIR
      if (!isTIR && angleDeg > 0) {
        ctx.beginPath();
        ctx.strokeStyle = '#fde047';
        ctx.globalAlpha = 0.2;
        const refX = cx + rayLen * Math.sin(angleRad);
        const refY = cy + rayLen * Math.cos(angleRad);
        ctx.moveTo(cx, cy);
        ctx.lineTo(refX, refY);
        ctx.stroke();
        ctx.globalAlpha = 1.0;
      }
      ctx.shadowBlur = 0;

      // Draw angles
      ctx.fillStyle = '#000000';
      ctx.font = '12px Inter';
      ctx.fillText(`i = ${angleDeg.toFixed(1)}°`, cx - 50, cy + 30);
      if (criticalAngle) {
        ctx.fillStyle = '#fca5a5';
        ctx.fillText(`Critical Angle = ${criticalAngle.toFixed(1)}°`, 20, canvas.height - 45);
      }

      drawLegend(ctx, [
        { label: 'Laser Ray', color: '#fde047' },
        { label: 'Normal Line', color: '#94a3b8' }
      ], canvas.width - 200, 20);

      animId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animId);
  }, [parameters, showGrid]);

  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center">
      <canvas ref={canvasRef} width={800} height={600} className="w-full h-full object-contain  border border-slate-200 rounded-xl bg-slate-900 shadow-inner" />
    </div>
  );
};
