import React, { useEffect, useRef, useState } from 'react';
import { useSimulationStore } from '../../store/useSimulationStore';
import { drawGrid, drawArrow, drawLegend, drawSphere } from '../../utils/canvasUtils';

export const ProjectileSim: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { parameters, isRunning, playbackSpeed, timeStep, showVelocityVector, showAccelerationVector, showGrid, showTrajectory } = useSimulationStore();
  
  const [flightData, setFlightData] = useState({ x: 0, y: 0, vx: 0, vy: 0, maxH: 0, time: 0, landed: false });
  const [showTelemetry, setShowTelemetry] = useState(true);
  const scaleRef = useRef(15);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;
    const v0 = parameters.velocity || 35;
    const angleDeg = parameters.angle || 45;
    const h0 = parameters.height || 0;
    const g = parameters.gravity || 9.81;
    const rad = (angleDeg * Math.PI) / 180;

    const vx0 = v0 * Math.cos(rad);
    const vy0 = v0 * Math.sin(rad);
    const dt = 0.02 * playbackSpeed;

    const trail: { x: number; y: number }[] = [];
    let curMaxY = h0;
    let landed = false;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      if (showGrid) drawGrid(ctx, width, height, 40);

      const x_meters = vx0 * t;
      const y_meters = h0 + vy0 * t - 0.5 * g * t * t;
      const vy = vy0 - g * t;

      if (y_meters > curMaxY) curMaxY = y_meters;

      if (useSimulationStore.getState().isRunning && !landed) {
        if (y_meters <= 0 && t > 0.1) {
          landed = true;
          setFlightData({ x: x_meters, y: 0, vx: vx0, vy: 0, maxH: curMaxY, time: t, landed: true });
        } else {
          t += dt;
          setFlightData({ x: x_meters, y: y_meters, vx: vx0, vy, maxH: curMaxY, time: t, landed: false });
        }
      }

      const startX = 60;
      const groundY = height - 70;
      
      // Calculate true flight metrics based on h0
      const t_flight = (vy0 + Math.sqrt(vy0 * vy0 + 2 * g * h0)) / g;
      const maxRange = Math.max(10, vx0 * t_flight);
      const maxHeight = Math.max(10, h0 + (vy0 * vy0) / (2 * g));

      const availableWidth = width - startX - 60;
      const availableHeight = height - 120;

      const scaleX = availableWidth / maxRange;
      const scaleY = availableHeight / maxHeight;
      const targetScale = Math.min(scaleX, scaleY, 20); // dynamically scale, max zoom is 20 pixels/meter
      
      // Smooth interpolation for camera auto-zoom
      scaleRef.current = scaleRef.current + (targetScale - scaleRef.current) * 0.05;
      const scale = scaleRef.current;

      const projX = startX + x_meters * scale;
      const projY = groundY - Math.max(0, y_meters) * scale;

      if (useSimulationStore.getState().isRunning && !landed && showTrajectory) {
        trail.push({ x: projX, y: projY });
      }

      // Draw Ground
      ctx.fillStyle = '#A0522D';
      ctx.fillRect(0, groundY, width, height - groundY);
      ctx.font = 'bold 12px Inter';
      ctx.fillStyle = '#000000';
      ctx.fillText('Flat Artillery Firing Field (0 m elevation)', 80, groundY + 25);

      // Draw Cannon platform if height > 0
      if (h0 > 0) {
        ctx.fillStyle = '#64748B';
        ctx.fillRect(startX - 30, groundY - h0 * scale, 60, h0 * scale);
      }

      // Draw Cannon Barrel
      ctx.save();
      ctx.translate(startX, groundY - h0 * scale);
      ctx.rotate(-rad);
      ctx.fillStyle = '#E2E8F0';
      ctx.fillRect(0, -8, 45, 16);
      ctx.restore();
      drawSphere(ctx, startX, groundY - h0 * scale, 14, '#475569');

      // Draw Parabolic Trail
      if (showTrajectory && trail.length > 1) {
        ctx.save();
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.7)';
        ctx.lineWidth = 3;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(trail[0].x, trail[0].y);
        trail.forEach(pt => ctx.lineTo(pt.x, pt.y));
        ctx.stroke();
        ctx.restore();
      }

      // Draw Projectile
      drawSphere(ctx, projX, projY, 12, '#800000', '#D2B48C');

      if (!landed) {
        // Vectors
        if (showVelocityVector) {
          drawArrow(ctx, projX, projY, projX + vx0 * 2.5, projY - vy * 2.5, '#8B4513', `v = ${Math.sqrt(vx0*vx0+vy*vy).toFixed(1)} m/s`);
        }
        if (showAccelerationVector) {
          drawArrow(ctx, projX, projY, projX, projY + g * 5, '#CD853F', `g = ${g.toFixed(1)} m/s²`);
        }
      } else {
        // Impact Marker
        ctx.fillStyle = '#D2B48C';
        ctx.font = 'bold 14px font-mono';
        ctx.fillText(`Impact Range: ${x_meters.toFixed(1)} m!`, projX - 45, groundY - 20);
      }

      // Legend
      drawLegend(ctx, [
        { label: 'Instantaneous Velocity (v)', color: '#8B4513' },
        { label: 'Gravitational Accel (g)', color: '#CD853F' },
        { label: 'Parabolic Flight Trace', color: '#D2B48C' }
      ], 20, 20);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [playbackSpeed, parameters, showGrid, showVelocityVector, showAccelerationVector, showTrajectory, timeStep]);

  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} width={800} height={600} className="w-full h-full object-cover max-w-4xl border border-slate-200 rounded-xl bg-white shadow-inner" />
      
      <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 max-w-2xl w-full transition-transform duration-500 ease-in-out ${showTelemetry ? 'translate-y-0' : 'translate-y-[calc(100%+1.2rem)]'}`}>
        {/* Toggle Button */}
        <button 
          onClick={() => setShowTelemetry(!showTelemetry)}
          className="absolute -top-7 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md border border-slate-200 border-b-0 rounded-t-xl px-5 py-1 text-[11px] font-bold text-slate-500 shadow-md hover:text-slate-700 transition-colors"
        >
          {showTelemetry ? 'Hide Data' : 'Show Data'}
        </button>

        {/* Telemetry Box */}
        <div className="w-full bg-white/95 shadow-xl border border-slate-200 rounded-2xl p-3.5 px-6 shadow-2xl backdrop-blur-md flex items-center justify-between font-mono text-xs">
          <div>
            <div className="text-slate-400 font-sans font-bold mb-1">Time of Flight</div>
            <div className="text-base font-bold text-stone-400">{flightData.time.toFixed(2)} s</div>
          </div>
          <div>
            <div className="text-slate-400 font-sans font-bold mb-1">Horizontal Range</div>
            <div className="text-base font-bold text-amber-400">{flightData.x.toFixed(1)} m</div>
          </div>
          <div>
            <div className="text-slate-400 font-sans font-bold mb-1">Max Peak Altitude</div>
            <div className="text-base font-bold text-orange-400">{flightData.maxH.toFixed(1)} m</div>
          </div>
        </div>
      </div>
    </div>
  );
};
