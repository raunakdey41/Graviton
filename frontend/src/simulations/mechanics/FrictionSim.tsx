import React, { useEffect, useRef, useState } from 'react';
import { useSimulationStore } from '../../store/useSimulationStore';
import { drawGrid, drawArrow, drawLegend } from '../../utils/canvasUtils';

export const FrictionSim: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { parameters, isRunning, playbackSpeed, timeStep, showVelocityVector, showAccelerationVector, showForceVector, showGrid } = useSimulationStore();
  const [simData, setSimData] = useState({ pos: 0, vel: 0, accel: 0, isSliding: false, frictionVal: 0 });
  const physicsState = useRef({ x: 0, v: 0 });

  useEffect(() => {
    physicsState.current = { x: 0, v: 0 };
    setSimData({ pos: 0, vel: 0, accel: 0, isSliding: false, frictionVal: 0 });
  }, [timeStep]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let { x, v } = physicsState.current;
    const dt = 0.016 * playbackSpeed;

    const angleDeg = parameters.angle || 25;
    const theta = (angleDeg * Math.PI) / 180;
    const m = parameters.mass || 10;
    const muS = parameters.staticCoeff || 0.55;
    const muK = parameters.kineticCoeff || 0.40;
    const Fext = parameters.appliedForce || 0;
    const g = 9.81;

    const N = m * g * Math.cos(theta);
    const mgSin = m * g * Math.sin(theta);
    const drivingForce = mgSin + Fext;
    const maxStaticFriction = muS * N;
    let friction = 0;
    let a = 0;
    let sliding = false;

    if (Math.abs(drivingForce) > maxStaticFriction || Math.abs(v) > 0.05) {
      sliding = true;
      friction = muK * N * Math.sign(drivingForce || 1);
      a = (drivingForce - friction) / m;
    } else {
      sliding = false;
      friction = drivingForce;
      a = 0;
      v = 0;
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;

      if (showGrid) drawGrid(ctx, width, height, 40);

      if (useSimulationStore.getState().isRunning && x < 8) {
        v += a * dt;
        x += v * dt;
        if (x < 0) { x = 0; v = 0; }
        physicsState.current = { x, v };
        setSimData({ pos: x, vel: v, accel: a, isSliding: sliding, frictionVal: Math.abs(friction) });
      }

      // Draw Ramp
      ctx.save();
      const rampBaseX = 100;
      const rampBaseY = height - 120;
      const rampLen = 520;
      const rampTopX = rampBaseX + rampLen * Math.cos(theta);
      const rampTopY = rampBaseY - rampLen * Math.sin(theta);

      // Fill ramp triangle
      ctx.fillStyle = 'rgba(139, 69, 19, 0.4)';
      ctx.strokeStyle = '#A0522D';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(rampBaseX, rampBaseY);
      ctx.lineTo(rampTopX, rampTopY);
      ctx.lineTo(rampTopX, rampBaseY);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Angle label
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 14px Inter';
      ctx.fillText(`θ = ${angleDeg}°`, rampBaseX + 45, rampBaseY - 15);
      ctx.restore();

      // Draw Block down ramp
      const blockDist = 380 - x * 40;
      const blockX = rampBaseX + blockDist * Math.cos(theta);
      const blockY = rampBaseY - blockDist * Math.sin(theta);

      ctx.save();
      ctx.translate(blockX, blockY);
      ctx.rotate(-theta);

      // Block drawing
      const bw = 64;
      const bh = 54;
      ctx.fillStyle = '#8B4513';
      ctx.shadowColor = '#8B4513';
      ctx.shadowBlur = 10;
      ctx.fillRect(-bw/2, -bh, bw, bh);
      ctx.shadowBlur = 0;
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.strokeRect(-bw/2, -bh, bw, bh);
      ctx.fillStyle = '#3E2723';
      ctx.font = 'bold 13px Inter';
      ctx.fillText(`${m} kg`, -18, -bh/2 + 5);

      // Vectors relative to block center
      const cx = 0;
      const cy = -bh/2;

      if (showForceVector) {
        // Normal force N (up perpendicular to slope)
        drawArrow(ctx, cx, cy, cx, cy - N * 0.8, '#D2B48C', `N = ${N.toFixed(0)} N`);
        // Friction f (up slope if sliding down)
        drawArrow(ctx, cx, cy + 18, cx + friction * 0.8, cy + 18, '#800000', `f = ${Math.abs(friction).toFixed(1)} N`);
        // Gravity down slope component mg sin theta
        drawArrow(ctx, cx, cy - 12, cx - mgSin * 0.8, cy - 12, '#A0522D', `mg sin θ = ${mgSin.toFixed(1)} N`);
      }
      if (showVelocityVector && Math.abs(v) > 0.1) {
        drawArrow(ctx, cx, cy, cx - v * 12, cy, '#D2691E', `v = ${v.toFixed(1)} m/s`);
      }
      if (showAccelerationVector && Math.abs(a) > 0.1) {
        drawArrow(ctx, cx, cy - 30, cx - a * 12, cy - 30, '#CD853F', `a = ${a.toFixed(1)} m/s²`);
      }

      ctx.restore();

      // Legend
      drawLegend(ctx, [
        { label: 'Normal Force (N)', color: '#D2B48C' },
        { label: 'Frictional Resistance (f)', color: '#800000' },
        { label: 'Down-slope Weight', color: '#A0522D' },
        { label: 'Sliding Velocity (v)', color: '#D2691E' }
      ], 20, 20);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [playbackSpeed, parameters, showGrid, showVelocityVector, showAccelerationVector, showForceVector, timeStep]);

  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center">
      <canvas ref={canvasRef} width={800} height={600} className="w-full h-full object-cover max-w-4xl border border-slate-200 rounded-xl bg-white shadow-inner" />
      
      {/* Live Status Overlay */}
      <div className="absolute bottom-4 max-w-xl mx-auto w-full bg-white/95 shadow-xl border border-slate-200 rounded-2xl p-3.5 px-6 shadow-2xl backdrop-blur-md flex items-center justify-between font-mono text-xs">
        <div>
          <div className="text-slate-400 font-sans font-bold mb-1">Motion State</div>
          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${simData.isSliding ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'}`}>
            {simData.isSliding ? 'SLIDING (Kinetic μₖ)' : 'STATIC GRIP (μₛ)'}
          </span>
        </div>
        <div>
          <div className="text-slate-400 font-sans font-bold mb-1">Friction Force</div>
          <div className="text-base font-bold text-stone-400">{simData.frictionVal.toFixed(2)} N</div>
        </div>
        <div>
          <div className="text-slate-400 font-sans font-bold mb-1">Sliding Accel (a)</div>
          <div className="text-base font-bold text-stone-400">{simData.accel.toFixed(2)} m/s²</div>
        </div>
      </div>
    </div>
  );
};
