import React, { useEffect, useRef, useState } from 'react';
import { useSimulationStore } from '../../store/useSimulationStore';
import { drawGrid, drawArrow, drawLegend, drawSphere } from '../../utils/canvasUtils';

export const CircularMotionSim: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { parameters, isRunning, playbackSpeed, timeStep, showVelocityVector, showForceVector, showGrid, showTrajectory } = useSimulationStore();
  
  const [orbitData, setOrbitData] = useState({ fc: 0, omega: 0, period: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = 0;
    const R = parameters.radius || 3.5;
    const v = parameters.velocity || 5.0;
    const m = parameters.mass || 8.0;
    const dt = 0.016 * playbackSpeed;

    const omega = v / R;
    const fc = (m * v * v) / R;
    const period = (2 * Math.PI * R) / v;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      if (showGrid) drawGrid(ctx, width, height, 40);

      if (useSimulationStore.getState().isRunning) {
        angle += omega * dt;
        setOrbitData({ fc, omega, period });
      }

      const centerX = width / 2;
      const centerY = height / 2;
      const scale = 50; // pixels per meter
      const pixelR = R * scale;

      const satX = centerX + pixelR * Math.cos(angle);
      const satY = centerY + pixelR * Math.sin(angle);

      // Draw Orbit Path Ring
      if (showTrajectory) {
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.arc(centerX, centerY, pixelR, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Draw Central Planet/Pivot
      drawSphere(ctx, centerX, centerY, 28, '#A0522D', '#4F46E5');
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 12px Inter';
      ctx.fillText('Center (Pivot)', centerX - 36, centerY + 45);

      // Draw Satellite / Bob
      drawSphere(ctx, satX, satY, 18 + m * 0.5, '#8B4513', '#8B4513');
      ctx.fillText(`${m} kg`, satX + 22, satY + 4);

      // Vectors
      if (showVelocityVector) {
        // Tangential velocity is perpendicular to radius (-sin, cos)
        const vx = -Math.sin(angle) * v * 15;
        const vy = Math.cos(angle) * v * 15;
        drawArrow(ctx, satX, satY, satX + vx, satY + vy, '#A0522D', `v = ${v.toFixed(1)} m/s`);
      }
      if (showForceVector) {
        // Centripetal force vector points inward to center
        const fx = -Math.cos(angle) * Math.min(140, fc * 2);
        const fy = -Math.sin(angle) * Math.min(140, fc * 2);
        drawArrow(ctx, satX, satY, satX + fx, satY + fy, '#800000', `F_c = ${fc.toFixed(1)} N`);
      }

      // Legend
      drawLegend(ctx, [
        { label: 'Tangential Speed (v)', color: '#A0522D' },
        { label: 'Centripetal Force (Fc)', color: '#800000' },
        { label: 'Circular Orbit Path', color: '#A0522D' }
      ], 20, 20);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [playbackSpeed, parameters, showGrid, showVelocityVector, showForceVector, showTrajectory, timeStep]);

  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center">
      <canvas ref={canvasRef} width={800} height={600} className="w-full h-full object-cover max-w-4xl border border-slate-200 rounded-xl bg-white shadow-inner" />
      
      {/* Live Orbit Kinematics HUD */}
      <div className="absolute bottom-4 max-w-xl mx-auto w-full bg-white/95 shadow-xl border border-slate-200 rounded-2xl p-3.5 px-6 shadow-2xl backdrop-blur-md flex items-center justify-between font-mono text-xs">
        <div>
          <div className="text-slate-400 font-sans font-bold mb-1">Centripetal Force (Fc)</div>
          <div className="text-base font-bold text-stone-400">{orbitData.fc.toFixed(2)} N</div>
        </div>
        <div>
          <div className="text-slate-400 font-sans font-bold mb-1">Angular Frequency (ω)</div>
          <div className="text-base font-bold text-amber-300">{orbitData.omega.toFixed(2)} rad/s</div>
        </div>
        <div>
          <div className="text-slate-400 font-sans font-bold mb-1">Orbital Period (T)</div>
          <div className="text-base font-bold text-orange-400">{orbitData.period.toFixed(2)} s</div>
        </div>
      </div>
    </div>
  );
};
