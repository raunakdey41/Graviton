import React, { useEffect, useRef, useState } from 'react';
import { useSimulationStore } from '../../store/useSimulationStore';
import { drawGrid, drawArrow, drawLegend, drawSphere } from '../../utils/canvasUtils';

export const UniversalMotionSim: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { parameters, isRunning, playbackSpeed, timeStep, showVelocityVector, showAccelerationVector, showGrid } = useSimulationStore();

  const [simState, setSimState] = useState({ x: 0, v: 0, a: 0, time: 0 });
  
  // physicsState persists between React renders without resetting
  const physicsState = useRef({ x: 0, v: parameters.initialVelocity || 0, t: 0, trails: [] as {x: number, y: number, alpha: number}[] });

  useEffect(() => {
    // Reset simulation when TimeStep or Parameters change while paused
    if (!useSimulationStore.getState().isRunning) {
      physicsState.current = { x: 0, v: parameters.initialVelocity || 0, t: 0, trails: [] };
      setSimState({ x: 0, v: parameters.initialVelocity || 0, a: parameters.acceleration || 0, time: 0 });
    }
  }, [timeStep, parameters.initialVelocity, parameters.acceleration]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let lastTime = performance.now();
    let trailTimer = 0;

    const render = (now: number) => {
      // Calculate delta time
      let dt = (now - lastTime) / 1000; // seconds
      if (dt > 0.1) dt = 0.016; // Prevent massive jumps if tab is inactive
      lastTime = now;
      
      // Apply playback speed modifier
      dt *= playbackSpeed;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;

      if (showGrid) drawGrid(ctx, width, height, 40);

      const a = parameters.acceleration || 0;
      let { x: currentX, v: currentV, t: currentT, trails } = physicsState.current;

      if (useSimulationStore.getState().isRunning) {
        // Step Physics: v = u + at, s = ut + 1/2at^2
        currentV += a * dt;
        currentX += currentV * dt;
        currentT += dt;
        
        // Wrapping logic (wrap around screen)
        // Let's assume 1 pixel = 1 meter for simplicity
        if (currentX > width + 50) currentX = -50;
        if (currentX < -50) currentX = width + 50;

        // Add trail dots every 0.1 seconds
        trailTimer += dt;
        if (trailTimer > 0.1) {
          trails.push({ x: currentX, y: height / 2, alpha: 1.0 });
          trailTimer = 0;
        }

        // Fade old trails
        trails.forEach(t => { t.alpha -= dt * 0.5; });
        trails = trails.filter(t => t.alpha > 0);

        physicsState.current = { x: currentX, v: currentV, t: currentT, trails };
        setSimState({ x: currentX, v: currentV, a, time: currentT });
      }

      const sphereY = height / 2;
      const sphereX = currentX;
      
      // Draw road
      ctx.fillStyle = '#334155';
      ctx.fillRect(0, sphereY + 20, width, 4);

      // Draw trails
      trails.forEach(t => {
        ctx.beginPath();
        ctx.arc(t.x, t.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(14, 165, 233, ${t.alpha})`;
        ctx.fill();
      });

      // Draw Sphere (Cyan glowing)
      drawSphere(ctx, sphereX, sphereY, 20, '#0ea5e9', '#0284c7');
      
      // Add a subtle glow
      ctx.beginPath();
      ctx.arc(sphereX, sphereY, 25, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(14, 165, 233, 0.2)';
      ctx.fill();

      // Draw Vectors
      if (showVelocityVector && Math.abs(currentV) > 0.5) {
        const vLength = currentV * 2; // Scale for visibility
        drawArrow(ctx, sphereX, sphereY - 30, sphereX + vLength, sphereY - 30, '#0ea5e9', `v = ${currentV.toFixed(1)} m/s`);
      }
      if (showAccelerationVector && Math.abs(a) > 0.1) {
        const aLength = a * 5; // Scale for visibility
        drawArrow(ctx, sphereX, sphereY - 50, sphereX + aLength, sphereY - 50, '#f59e0b', `a = ${a.toFixed(1)} m/s²`);
      }

      // Legend
      drawLegend(ctx, [
        { label: 'Object', color: '#0ea5e9' },
        { label: 'Velocity (v)', color: '#0ea5e9' },
        { label: 'Acceleration (a)', color: '#f59e0b' }
      ], 20, 20);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [playbackSpeed, parameters, showGrid, showVelocityVector, showAccelerationVector]);

  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center">
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={600} 
        className="w-full h-full object-contain  border border-slate-200 rounded-xl bg-white shadow-inner"
      />

      {/* Live Kinematics HUD Overlay */}
      <div className="absolute bottom-4 left-4 right-4 max-w-xl mx-auto bg-white/95 shadow-xl border border-slate-200 rounded-2xl p-3 px-5 backdrop-blur-md flex items-center justify-between gap-4 text-xs font-mono">
        <div>
          <div className="text-slate-500 font-sans font-bold mb-1">Time Elapsed</div>
          <div className="text-lg font-extrabold text-slate-900">{simState.time.toFixed(2)} s</div>
        </div>
        <div>
          <div className="text-slate-500 font-sans font-bold mb-1">Position (x)</div>
          <div className="text-lg font-extrabold text-cyan-600">{simState.x.toFixed(1)} m</div>
        </div>
        <div>
          <div className="text-slate-500 font-sans font-bold mb-1">Velocity (v)</div>
          <div className="text-lg font-extrabold text-cyan-600">{simState.v.toFixed(1)} m/s</div>
        </div>
        <div>
          <div className="text-slate-500 font-sans font-bold mb-1">Accel (a)</div>
          <div className="text-lg font-extrabold text-amber-600">{simState.a.toFixed(1)} m/s²</div>
        </div>
      </div>
    </div>
  );
};
