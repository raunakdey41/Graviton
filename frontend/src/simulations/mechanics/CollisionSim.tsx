import React, { useEffect, useRef, useState } from 'react';
import { useSimulationStore } from '../../store/useSimulationStore';
import { drawGrid, drawArrow, drawLegend, drawSphere } from '../../utils/canvasUtils';

export const CollisionSim: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { parameters, isRunning, playbackSpeed, timeStep, showVelocityVector, showGrid } = useSimulationStore();

  const [colData, setColData] = useState({ pInit: 0, pCur: 0, keInit: 0, keCur: 0, collided: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const m1 = parameters.mass1 || 6;
    let v1 = parameters.velocity1 || 10;
    const m2 = parameters.mass2 || 12;
    let v2 = parameters.velocity2 || -4;
    const e = parameters.restitution !== undefined ? parameters.restitution : 1.0;
    const dt = 0.016 * playbackSpeed;

    const pInitial = m1 * v1 + m2 * v2;
    const keInitial = 0.5 * m1 * v1 * v1 + 0.5 * m2 * v2 * v2;

    let x1 = 180;
    let x2 = 560;
    let collided = false;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      if (showGrid) drawGrid(ctx, width, height, 40);

      const rad1 = 20 + m1 * 0.8;
      const rad2 = 20 + m2 * 0.8;

      if (useSimulationStore.getState().isRunning) {
        x1 += v1 * dt * 12;
        x2 += v2 * dt * 12;

        // Collision Check
        if (!collided && Math.abs(x2 - x1) <= (rad1 + rad2)) {
          collided = true;
          // Conservation of momentum and restitution equation:
          // v1_final - v2_final = -e * (v1_init - v2_init)
          // m1*v1_final + m2*v2_final = m1*v1_init + m2*v2_init
          const newV1 = ((m1 - e * m2) * v1 + (1 + e) * m2 * v2) / (m1 + m2);
          const newV2 = ((m2 - e * m1) * v2 + (1 + e) * m1 * v1) / (m1 + m2);
          v1 = newV1;
          v2 = newV2;
        }

        const pCur = m1 * v1 + m2 * v2;
        const keCur = 0.5 * m1 * v1 * v1 + 0.5 * m2 * v2 * v2;
        setColData({ pInit: pInitial, pCur, keInit: keInitial, keCur, collided });
      }

      const centerY = height / 2;

      // Draw Track Line
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(40, centerY + rad2 + 2, width - 80, 8);

      // Draw Ball 1
      drawSphere(ctx, x1, centerY, rad1, '#8B4513', '#A0522D');
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 12px Inter';
      ctx.fillText(`${m1}kg (v₁=${v1.toFixed(1)})`, x1 - 35, centerY - rad1 - 10);

      // Draw Ball 2
      drawSphere(ctx, x2, centerY, rad2, '#800000', '#D2B48C');
      ctx.fillText(`${m2}kg (v₂=${v2.toFixed(1)})`, x2 - 35, centerY - rad2 - 10);

      if (showVelocityVector) {
        if (Math.abs(v1) > 0.1) drawArrow(ctx, x1, centerY, x1 + v1 * 12, centerY, '#8B4513', 'v₁');
        if (Math.abs(v2) > 0.1) drawArrow(ctx, x2, centerY, x2 + v2 * 12, centerY, '#800000', 'v₂');
      }

      drawLegend(ctx, [
        { label: 'Ball 1 Velocity (v₁)', color: '#8B4513' },
        { label: 'Ball 2 Velocity (v₂)', color: '#800000' },
        { label: `Restitution e = ${e}`, color: '#CD853F' }
      ], 20, 20);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [playbackSpeed, parameters, showGrid, showVelocityVector, timeStep]);

  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center">
      <canvas ref={canvasRef} width={800} height={600} className="w-full h-full object-contain  border border-slate-200 rounded-xl bg-white shadow-inner" />
      
      <div className="absolute bottom-4 max-w-2xl mx-auto w-full bg-white/95 shadow-xl border border-slate-200 rounded-2xl p-3.5 px-6 shadow-2xl backdrop-blur-md flex items-center justify-between font-mono text-xs">
        <div>
          <div className="text-slate-400 font-sans font-bold mb-1">Total Momentum (P)</div>
          <div className="text-base font-bold text-orange-400">{colData.pCur.toFixed(1)} kg·m/s (Conserved)</div>
        </div>
        <div>
          <div className="text-slate-400 font-sans font-bold mb-1">Total Kinetic Energy</div>
          <div className="text-base font-bold text-amber-400">{colData.keCur.toFixed(1)} J</div>
        </div>
        <div>
          <div className="text-slate-400 font-sans font-bold mb-1">Status</div>
          <span className={`px-2 py-1 rounded font-bold ${colData.collided ? 'bg-stone-500/20 text-stone-300' : 'bg-white/10 text-slate-900'}`}>
            {colData.collided ? 'Post-Impact' : 'Approaching'}
          </span>
        </div>
      </div>
    </div>
  );
};
