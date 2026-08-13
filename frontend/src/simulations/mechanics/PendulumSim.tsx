import React, { useEffect, useRef, useState } from 'react';
import { useSimulationStore } from '../../store/useSimulationStore';
import { drawGrid, drawArrow, drawLegend, drawSphere , getCanvasPoint} from '../../utils/canvasUtils';

export const PendulumSim: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { parameters, playbackSpeed, timeStep, showVelocityVector, showForceVector, showGrid, showTrajectory, setParameter, setIsRunning } = useSimulationStore();
  
  const [energyData, setEnergyData] = useState({ ke: 0, pe: 0, tot: 0, angleDeg: 0 });
  const isDragging = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let theta = ((parameters.angle || 30) * Math.PI) / 180;
    let omega = 0;
    const L = parameters.length || 2.5;
    const m = parameters.mass || 5;
    const damping = parameters.damping || 0.02;
    const g = 9.81;
    const dt = 0.016 * playbackSpeed;
    const trail: { x: number; y: number }[] = [];

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      if (showGrid) drawGrid(ctx, width, height, 40);

      if (useSimulationStore.getState().isRunning) {
        // d²θ/dt² = -(g/L)*sin(θ) - (b/m)*(dθ/dt)
        const alpha = -(g / L) * Math.sin(theta) - (damping / m) * omega;
        omega += alpha * dt;
        theta += omega * dt;
      } else if (isDragging.current) {
        // If dragging, we update the local theta from parameters in real-time
        // so the canvas immediately reflects the dragged position
        theta = ((useSimulationStore.getState().parameters.angle || 30) * Math.PI) / 180;
        omega = 0;
      }

      const pivotX = width / 2;
      const pivotY = 70;
      const scale = 140; // pixels per meter
      const bobX = pivotX + L * scale * Math.sin(theta);
      const bobY = pivotY + L * scale * Math.cos(theta);

      if (useSimulationStore.getState().isRunning && showTrajectory) {
        trail.push({ x: bobX, y: bobY });
        if (trail.length > 50) trail.shift();
      }

      // Draw Trajectory Trail
      if (showTrajectory && trail.length > 1) {
        ctx.save();
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(trail[0].x, trail[0].y);
        trail.forEach(pt => ctx.lineTo(pt.x, pt.y));
        ctx.stroke();
        ctx.restore();
      }

      // Draw Ceiling Anchor and String
      ctx.save();
      ctx.fillStyle = '#64748B';
      ctx.fillRect(pivotX - 60, pivotY - 10, 120, 10);
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(pivotX, pivotY);
      ctx.lineTo(bobX, bobY);
      ctx.stroke();
      ctx.restore();

      // Draw Bob Sphere
      const rad = 22 + m * 0.8;
      drawSphere(ctx, bobX, bobY, rad, isDragging.current ? '#A0522D' : '#800000', '#800000');

      // Vectors
      if (showVelocityVector && Math.abs(omega) > 0.05) {
        const vx = Math.cos(theta) * (omega * L) * 15;
        const vy = -Math.sin(theta) * (omega * L) * 15;
        drawArrow(ctx, bobX, bobY, bobX + vx, bobY + vy, '#8B4513', 'v');
      }
      if (showForceVector) {
        const fg = m * g;
        drawArrow(ctx, bobX, bobY, bobX, bobY + fg * 1.5, '#D2B48C', `mg = ${fg.toFixed(0)} N`);
      }

      // Calculate Energies
      const h = L * (1 - Math.cos(theta));
      const pe = m * g * h;
      const vLinear = omega * L;
      const ke = 0.5 * m * vLinear * vLinear;
      setEnergyData({ ke, pe, tot: ke + pe, angleDeg: (theta * 180) / Math.PI });

      // Legend
      drawLegend(ctx, [
        { label: 'Bob Velocity Vector (v)', color: '#8B4513' },
        { label: 'Gravitational Weight (mg)', color: '#D2B48C' },
        { label: 'Oscillation Path Trail', color: '#D2691E' }
      ], 20, 20);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [playbackSpeed, parameters, showGrid, showVelocityVector, showForceVector, showTrajectory, timeStep]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { x, y } = getCanvasPoint(e, canvas);

    const pivotX = canvas.width / 2;
    const pivotY = 70;
    const L = parameters.length || 2.5;
    const scale = 140; 
    const theta = ((parameters.angle || 30) * Math.PI) / 180;
    const bobX = pivotX + L * scale * Math.sin(theta);
    const bobY = pivotY + L * scale * Math.cos(theta);

    if (Math.hypot(x - bobX, y - bobY) < 40) {
      isDragging.current = true;
      setIsRunning(false); // Pause sim on drag
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDragging.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { x, y } = getCanvasPoint(e, canvas);

    const pivotX = canvas.width / 2;
    const pivotY = 70;
    
    // Calculate new angle based on cursor position relative to pivot
    let newTheta = Math.atan2(x - pivotX, y - pivotY);
    if (newTheta > Math.PI / 2) newTheta = Math.PI / 2;
    if (newTheta < -Math.PI / 2) newTheta = -Math.PI / 2;

    const newAngleDeg = (newTheta * 180) / Math.PI;
    setParameter('angle', newAngleDeg);
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center">
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={600} 
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className={`w-full h-full object-contain  border border-slate-200 rounded-xl bg-white shadow-inner ${isDragging.current ? 'cursor-grabbing' : 'cursor-grab'}`} 
      />
      
      {/* Live Harmonic Energy Exchange Bar */}
      <div className="absolute bottom-4 max-w-xl mx-auto w-full bg-white/95 shadow-xl border border-slate-200 rounded-2xl p-3.5 px-6 shadow-2xl backdrop-blur-md flex items-center justify-between font-mono text-xs pointer-events-none">
        <div>
          <div className="text-slate-400 font-sans font-bold mb-1">Angle (θ)</div>
          <div className="text-base font-bold text-stone-400">{energyData.angleDeg.toFixed(1)}°</div>
        </div>
        <div className="flex-1 max-w-xs ml-4">
          <div className="flex justify-between text-[11px] mb-1 font-sans">
            <span className="text-stone-400 font-bold">PE: {energyData.pe.toFixed(1)} J</span>
            <span className="text-amber-400 font-bold">KE: {energyData.ke.toFixed(1)} J</span>
            <span className="text-amber-300 font-bold">Total: {energyData.tot.toFixed(1)} J</span>
          </div>
          <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden flex border border-slate-200">
            <div className="bg-stone-500 transition-all duration-75" style={{ width: `${Math.min(100, (energyData.pe / (energyData.tot || 1)) * 100)}%` }} />
            <div className="bg-amber-400 transition-all duration-75" style={{ width: `${Math.min(100, (energyData.ke / (energyData.tot || 1)) * 100)}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
};
