import React, { useEffect, useRef, useState } from 'react';
import { useSimulationStore } from '../../store/useSimulationStore';
import { drawGrid, drawArrow, drawLegend, drawSphere, getCanvasPoint } from '../../utils/canvasUtils';

export const FreeFallSim: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { parameters, playbackSpeed, timeStep, showVelocityVector, showAccelerationVector, showForceVector, showGrid, setParameter, setIsRunning } = useSimulationStore();

  const [simState, setSimState] = useState({ y: 0, v: 0, a: 0, time: 0 });
  const [showTelemetry, setShowTelemetry] = useState(true);
  const physicsState = useRef({ y: 0, v: 0, t: 0 });
  const isDragging = useRef(false);

  useEffect(() => {
    physicsState.current = { y: 0, v: 0, t: 0 };
    setSimState({ y: 0, v: 0, a: 0, time: 0 });
  }, [timeStep, parameters.height]); 

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const g = parameters.gravity ?? 9.81;
    const m = parameters.mass ?? 5;
    const dt = 0.016 * playbackSpeed;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const maxH = parameters.height || 80;

      if (showGrid) drawGrid(ctx, width, height, 40);

      let { y: currentY, v: currentV, t: currentT } = physicsState.current;

      if (useSimulationStore.getState().isRunning && currentY < maxH) {
        const currentA = g;

        currentV += currentA * dt;
        currentY += currentV * dt;
        currentT += dt;
        if (currentY >= maxH) {
          currentY = maxH;
          currentV = 0;
        }
        physicsState.current = { y: currentY, v: currentV, t: currentT };
        setSimState({ y: currentY, v: currentV, a: currentA, time: currentT });
      }

      // If dragging, we force the ball to the top (currentY=0)
      if (isDragging.current) {
        physicsState.current = { y: 0, v: 0, t: 0 };
        currentY = 0;
      }

      // Drawing map coordinates
      const groundY = height - 60;
      const startY = 60;
      const scaleY = (groundY - startY) / maxH;
      const radius = 22 + (m * 0.5);
      const sphereY = Math.min(groundY - radius, startY + currentY * scaleY);
      const sphereX = width / 2;

      // Draw release platform and ground
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(sphereX - 80, startY - 10, 160, 10);
      ctx.fillStyle = '#4a2c16';
      ctx.fillRect(0, groundY, width, height - groundY);
      ctx.font = 'bold 13px Inter';
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`Ground Surface (0.0 m)`, width / 2 - 60, groundY + 25);

      // Draw Sphere
      drawSphere(ctx, sphereX, sphereY, radius, isDragging.current ? '#D2B48C' : '#A0522D', '#8B4513');

      // Draw Vectors
      if (showVelocityVector && currentV > 0.5) {
        drawArrow(ctx, sphereX, sphereY, sphereX, sphereY + Math.min(120, currentV * 3), '#8B4513', `v = ${simState.v.toFixed(1)} m/s`);
      }
      if (showAccelerationVector) {
        const aVal = useSimulationStore.getState().isRunning && currentY < maxH ? g : 0;
        if (aVal > 0.2) {
          drawArrow(ctx, sphereX + 35, sphereY, sphereX + 35, sphereY + aVal * 5, '#D2B48C', `a = ${aVal.toFixed(1)} m/s²`);
        }
      }
      if (showForceVector && currentY < maxH && useSimulationStore.getState().isRunning) {
        // Gravity down
        drawArrow(ctx, sphereX - 35, sphereY, sphereX - 35, sphereY + (m * g) * 0.8, '#800000', `mg = ${(m * g).toFixed(1)} N`);
      }

      // Legend
      drawLegend(ctx, [
        { label: 'Velocity Vector (v)', color: '#8B4513' },
        { label: 'Acceleration (a)', color: '#D2B48C' },
        { label: 'Gravitational Weight (mg)', color: '#800000' }
      ], 20, 20);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [playbackSpeed, parameters, showGrid, showVelocityVector, showAccelerationVector, showForceVector, timeStep]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { x, y } = getCanvasPoint(e, canvas);

    const maxH = parameters.height || 80;
    const m = parameters.mass || 5;
    const groundY = canvas.height - 60;
    const startY = 60;
    const scaleY = (groundY - startY) / maxH;
    const sphereY = startY + physicsState.current.y * scaleY;
    const sphereX = canvas.width / 2;
    const radius = 22 + (m * 0.5);

    if (Math.hypot(x - sphereX, y - sphereY) < radius * 1.5) {
      isDragging.current = true;
      setIsRunning(false);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDragging.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { y } = getCanvasPoint(e, canvas);

    const groundY = canvas.height - 60;
    // We want the ball to be mapped to the new max height.
    // If we drag the ball UP, max height INCREASES.
    // However, in our visual scale, the platform is ALWAYS at startY (60).
    // The ground is ALWAYS at groundY (height - 60).
    // If the user drags the ball up and down, how do we map this to maxH?
    // Let's do a relative change based on mouse movement delta, or 
    // map the mouse position directly to a conceptual scale if 1px = 0.5m.
    // To make it intuitive, dragging down DECREASES maxH, dragging up INCREASES maxH.
    // Let's use a fixed visual scale for the drag calculation: 10 pixels = 1 meter.
    
    // startY is 60. 
    // Let's map maxH = (groundY - y) / 3 
    // Example: if y = groundY, maxH = 0.
    // If y = 60 (startY), maxH = (600 - 60 - 60)/3 = 160m
    const newMaxH = Math.max(10, Math.min(200, (groundY - y) / 2.5));
    setParameter('height', newMaxH);
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const m = parameters.mass || 5;
  const maxH = parameters.height || 80;
  const currentH = Math.max(0, maxH - simState.y);
  const potEnergy = m * (parameters.gravity || 9.81) * currentH;
  const kinEnergy = 0.5 * m * simState.v * simState.v;

  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center p-2 md:p-6 pb-20">
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={600} 
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className={`w-full h-full object-contain border border-slate-200 rounded-xl bg-white shadow-inner ${isDragging.current ? 'cursor-grabbing' : 'cursor-grab'}`}
      />

      <div className={`absolute left-4 right-4 max-w-xl mx-auto w-full transition-transform duration-500 ease-in-out ${showTelemetry ? 'bottom-4 translate-y-0' : 'bottom-4 translate-y-[calc(100%+1.2rem)]'}`}>
        {/* Toggle Button */}
        <button 
          onClick={() => setShowTelemetry(!showTelemetry)}
          className="absolute -top-7 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md border border-slate-200 border-b-0 rounded-t-xl px-5 py-1 text-[11px] font-bold text-slate-500 shadow-md hover:text-slate-700 transition-colors pointer-events-auto"
        >
          {showTelemetry ? 'Hide Data' : 'Show Data'}
        </button>

        {/* Panel */}
        <div className="w-full bg-white/95 shadow-xl border border-slate-200 rounded-2xl p-3 px-5 backdrop-blur-md flex items-center justify-between gap-4 text-xs font-mono pointer-events-none">
        <div>
          <div className="text-slate-500 font-sans font-bold mb-1">Time Elapsed</div>
          <div className="text-lg font-extrabold text-slate-900">{simState.time.toFixed(2)} s</div>
        </div>
        <div>
          <div className="text-slate-500 font-sans font-bold mb-1">Current Altitude</div>
          <div className="text-lg font-extrabold text-amber-600">{currentH.toFixed(1)} m</div>
        </div>
        <div className="flex-1 max-w-xs">
          <div className="flex justify-between text-[11px] mb-1 font-sans">
            <span className="text-stone-500 font-bold">PE: {potEnergy.toFixed(0)} J</span>
            <span className="text-amber-600 font-bold">KE: {kinEnergy.toFixed(0)} J</span>
          </div>
          <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden flex border border-slate-300">
            <div className="bg-stone-500 transition-all duration-100" style={{ width: `${Math.min(100, (potEnergy / (potEnergy + kinEnergy + 0.1)) * 100)}%` }} />
            <div className="bg-amber-400 transition-all duration-100" style={{ width: `${Math.min(100, (kinEnergy / (potEnergy + kinEnergy + 0.1)) * 100)}%` }} />
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};
