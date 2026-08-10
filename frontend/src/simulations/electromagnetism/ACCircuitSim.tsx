import React, { useEffect, useRef, useState } from 'react';
import { useSimulationStore } from '../../store/useSimulationStore';
import { drawGrid, drawLegend } from '../../utils/canvasUtils';

export const ACCircuitSim: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { parameters, isRunning, playbackSpeed, timeStep, showGrid } = useSimulationStore();
  const [acData, setAcData] = useState({ z: 0, f0: 0, phi: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;
    const R = parameters.resistance || 50;
    const L_mH = parameters.inductance || 100;
    const C_uF = parameters.capacitance || 50;
    const freq = parameters.frequency || 70;
    const V0 = parameters.voltage || 120;

    const L = L_mH * 1e-3;
    const C = C_uF * 1e-6;
    const w = 2 * Math.PI * freq;
    const XL = w * L;
    const XC = 1 / (w * C);
    const Z = Math.sqrt(R * R + (XL - XC) * (XL - XC));
    const I0 = V0 / Z;
    const phi = Math.atan2(XL - XC, R);
    const f0 = 1 / (2 * Math.PI * Math.sqrt(L * C));
    const dt = 0.001 * playbackSpeed;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      if (showGrid) drawGrid(ctx, width, height, 40);

      if (useSimulationStore.getState().isRunning) {
        t += dt;
        setAcData({ z: Z, f0, phi: (phi * 180) / Math.PI });
      }

      // Draw Voltage and Current Waveforms over time
      const chartY = height / 2 - 20;
      const startX = 60;
      const endX = width - 60;
      const waveWidth = endX - startX;

      // Center axis
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.beginPath();
      ctx.moveTo(startX, chartY);
      ctx.lineTo(endX, chartY);
      ctx.stroke();

      // Voltage waveform V(t)
      ctx.save();
      ctx.strokeStyle = '#8B4513';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let x = 0; x <= waveWidth; x += 3) {
        const timeAtX = t + (x / waveWidth) * 0.05;
        const vVal = V0 * Math.sin(w * timeAtX);
        const ptY = chartY - (vVal * 0.7);
        if (x === 0) ctx.moveTo(startX + x, ptY);
        else ctx.lineTo(startX + x, ptY);
      }
      ctx.stroke();

      // Current waveform I(t)
      ctx.strokeStyle = '#D2B48C';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let x = 0; x <= waveWidth; x += 3) {
        const timeAtX = t + (x / waveWidth) * 0.05;
        const iVal = I0 * Math.sin(w * timeAtX - phi);
        const ptY = chartY - (iVal * 25);
        if (x === 0) ctx.moveTo(startX + x, ptY);
        else ctx.lineTo(startX + x, ptY);
      }
      ctx.stroke();
      ctx.restore();

      // Draw Rotating Phasor Diagram in bottom right corner
      const phasorX = width - 140;
      const phasorY = height - 130;
      ctx.save();
      ctx.fillStyle = 'rgba(14, 19, 45, 0.9)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.beginPath();
      ctx.arc(phasorX, phasorY, 70, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Voltage phasor
      ctx.strokeStyle = '#8B4513';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(phasorX, phasorY);
      ctx.lineTo(phasorX + 55 * Math.cos(w * t), phasorY - 55 * Math.sin(w * t));
      ctx.stroke();

      // Current phasor (shifted by phi)
      ctx.strokeStyle = '#D2B48C';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(phasorX, phasorY);
      ctx.lineTo(phasorX + 45 * Math.cos(w * t - phi), phasorY - 45 * Math.sin(w * t - phi));
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 11px Inter';
      ctx.fillText('Rotating Phasor Dial', phasorX - 55, phasorY - 78);
      ctx.restore();

      drawLegend(ctx, [
        { label: 'Voltage Waveform V(t)', color: '#8B4513' },
        { label: 'Current Waveform I(t)', color: '#D2B48C' },
        { label: `Phase Shift φ = ${acData.phi.toFixed(1)}°`, color: '#CD853F' }
      ], 20, 20);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [playbackSpeed, parameters, showGrid, timeStep]);

  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center">
      <canvas ref={canvasRef} width={800} height={600} className="w-full h-full object-cover max-w-4xl border border-slate-200 rounded-xl bg-white shadow-inner" />
      
      <div className="absolute bottom-4 left-4 max-w-md bg-white/95 shadow-xl border border-slate-200 rounded-2xl p-3.5 px-5 shadow-2xl backdrop-blur-md flex items-center justify-between gap-4 font-mono text-xs">
        <div>
          <div className="text-slate-400 font-sans font-bold mb-1">Resonance f₀</div>
          <div className="text-base font-bold text-orange-400">{acData.f0.toFixed(1)} Hz</div>
        </div>
        <div>
          <div className="text-slate-400 font-sans font-bold mb-1">Net Impedance Z</div>
          <div className="text-base font-bold text-amber-300">{acData.z.toFixed(1)} Ω</div>
        </div>
      </div>
    </div>
  );
};
