import React, { useEffect, useRef, useState } from 'react';
import { useSimulationStore } from '../../store/useSimulationStore';
import { drawGrid, drawArrow, drawLegend , getCanvasPoint} from '../../utils/canvasUtils';

export const SpringMassSim: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { parameters, playbackSpeed, timeStep, showVelocityVector, showForceVector, showGrid, showTrajectory, setParameter, setIsRunning } = useSimulationStore();
  
  const [shmData, setShmData] = useState({ x: 0, v: 0, f: 0, period: 0 });
  const isDragging = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;
    const k = parameters.springConstant || 60;
    const m = parameters.mass || 3.0;
    let amp = parameters.amplitude || 2.0;
    const gamma = parameters.damping || 0.04;
    const dt = 0.016 * playbackSpeed;

    const omega0 = Math.sqrt(k / m);
    const period = (2 * Math.PI) / omega0;

    // We store history of displacement to draw live waveform graph
    const waveHistory: number[] = [];

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      if (showGrid) drawGrid(ctx, width, height, 40);

      if (useSimulationStore.getState().isRunning) {
        time += dt;
      } else if (isDragging.current) {
        time = 0;
        amp = useSimulationStore.getState().parameters.amplitude || 2.0;
      }

      // x(t) = A * e^(-0.5 * gamma * t) * cos(omega * t)
      const currentAmp = amp * Math.exp(-0.5 * gamma * time);
      const x = currentAmp * Math.cos(omega0 * time);
      const v = -omega0 * currentAmp * Math.sin(omega0 * time);
      const fRestoring = -k * x;

      if (useSimulationStore.getState().isRunning) {
        waveHistory.unshift(x);
        if (waveHistory.length > 250) waveHistory.pop();
        setShmData({ x, v, f: fRestoring, period });
      }

      const anchorX = 140;
      const anchorY = height / 2 - 40;
      const scale = 75; // pixels per meter
      const blockX = anchorX + 220 + x * scale;
      const blockY = anchorY;

      // Draw Wall
      ctx.fillStyle = '#64748B';
      ctx.fillRect(40, anchorY - 80, 100, 160);
      ctx.fillStyle = '#475569';
      for (let i = 0; i < 160; i += 20) {
        ctx.beginPath();
        ctx.moveTo(40, anchorY - 80 + i);
        ctx.lineTo(20, anchorY - 60 + i);
        ctx.strokeStyle = '#94A3B8';
        ctx.stroke();
      }

      // Draw Spring Coil
      ctx.save();
      ctx.strokeStyle = '#D2B48C';
      ctx.lineWidth = 4;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(140, anchorY);
      const turns = 12;
      const springLen = blockX - 140 - 35;
      const turnLen = springLen / turns;
      for (let i = 1; i <= turns; i++) {
        const sx = 140 + i * turnLen - turnLen / 2;
        const sy = anchorY + (i % 2 === 0 ? -22 : 22);
        ctx.lineTo(sx, sy);
      }
      ctx.lineTo(blockX - 35, anchorY);
      ctx.stroke();
      ctx.restore();

      // Draw Oscillating Mass Block
      ctx.save();
      const bw = 70;
      const bh = 70;
      ctx.fillStyle = isDragging.current ? '#8B4513' : '#A0522D';
      ctx.shadowColor = '#A0522D';
      ctx.shadowBlur = isDragging.current ? 18 : 12;
      ctx.fillRect(blockX - bw/2, blockY - bh/2, bw, bh);
      ctx.shadowBlur = 0;
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.strokeRect(blockX - bw/2, blockY - bh/2, bw, bh);
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 13px Inter';
      ctx.fillText(`${m} kg`, blockX - 18, blockY + 5);
      ctx.restore();

      // Vectors
      if (showForceVector && Math.abs(fRestoring) > 1) {
        drawArrow(ctx, blockX, blockY - 45, blockX + fRestoring * 1.2, blockY - 45, '#800000', `Fs = ${fRestoring.toFixed(1)} N`);
      }
      if (showVelocityVector && Math.abs(v) > 0.1) {
        drawArrow(ctx, blockX, blockY + 45, blockX + v * 20, blockY + 45, '#8B4513', `v = ${v.toFixed(1)} m/s`);
      }

      // Draw Live Harmonic Waveform trace underneath
      if (showTrajectory && waveHistory.length > 1) {
        const chartY = height - 130;
        const chartX = 140;
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.beginPath();
        ctx.moveTo(chartX, chartY);
        ctx.lineTo(chartX + 500, chartY);
        ctx.stroke();

        ctx.strokeStyle = '#D2691E';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        waveHistory.forEach((val, idx) => {
          const ptX = chartX + idx * 2;
          const ptY = chartY - val * 25;
          if (idx === 0) ctx.moveTo(ptX, ptY);
          else ctx.lineTo(ptX, ptY);
        });
        ctx.stroke();
        ctx.fillStyle = '#CD853F';
        ctx.font = 'bold 11px font-mono';
        ctx.fillText('Real-time Displacement Waveform x(t)', chartX, chartY - 45);
        ctx.restore();
      }

      // Legend
      drawLegend(ctx, [
        { label: 'Restoring Hooke Force', color: '#800000' },
        { label: 'Velocity Vector (v)', color: '#8B4513' },
        { label: 'Displacement Trace x(t)', color: '#D2691E' }
      ], 20, 20);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [playbackSpeed, parameters, showGrid, showVelocityVector, showForceVector, showTrajectory, timeStep]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const amp = parameters.amplitude || 2.0;
    const scale = 75;
    const anchorX = 140;
    const anchorY = canvas.height / 2 - 40;
    // initial x is just amp because time=0
    // actually, we should hit test the current blockX, blockY! 
    // To keep it simple, since we reset time=0 on drag, we can hit test the amplitude
    const blockX = anchorX + 220 + amp * scale;
    const blockY = anchorY;

    // A lenient bounding box for the block
    if (Math.abs(mx - blockX) < 50 && Math.abs(my - blockY) < 50) {
      isDragging.current = true;
      setIsRunning(false);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDragging.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;

    const anchorX = 140;
    const scale = 75;
    
    // Reverse calculate amplitude from blockX
    // blockX = anchorX + 220 + amp * scale;
    // amp = (blockX - anchorX - 220) / scale;
    let newAmp = (mx - anchorX - 220) / scale;
    
    // Restrict amplitude
    if (newAmp > 5) newAmp = 5;
    if (newAmp < -5) newAmp = -5; // negative amplitude is just starting from compressed state

    setParameter('amplitude', newAmp);
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
      
      <div className="absolute bottom-4 max-w-xl mx-auto w-full bg-white/95 shadow-xl border border-slate-200 rounded-2xl p-3.5 px-6 shadow-2xl backdrop-blur-md flex items-center justify-between font-mono text-xs pointer-events-none">
        <div>
          <div className="text-slate-400 font-sans font-bold mb-1">Displacement (x)</div>
          <div className="text-base font-bold text-amber-400">{shmData.x.toFixed(2)} m</div>
        </div>
        <div>
          <div className="text-slate-400 font-sans font-bold mb-1">Restoring Force (Fs)</div>
          <div className="text-base font-bold text-stone-400">{shmData.f.toFixed(2)} N</div>
        </div>
        <div>
          <div className="text-slate-400 font-sans font-bold mb-1">Harmonic Period (T)</div>
          <div className="text-base font-bold text-orange-400">{shmData.period.toFixed(2)} s</div>
        </div>
      </div>
    </div>
  );
};
