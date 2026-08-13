import React, { useEffect, useRef, useState } from 'react';
import { useSimulationStore } from '../../store/useSimulationStore';
import { drawGrid, drawLegend } from '../../utils/canvasUtils';

interface Electron {
  x: number;
  y: number;
  vx: number;
  energy_eV: number;
}

export const PhotoelectricSim: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { parameters, isRunning, playbackSpeed, showGrid } = useSimulationStore();
  const [peState, setPeState] = useState({ ePhoton: 0, emitted: true });
  const electronsRef = useRef<Electron[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const lambda_nm = parameters.wavelength || 280;
    const intensity = parameters.intensity || 70;
    const workFunction_eV = parameters.workFunction || 2.3;
    const V_stopping = parameters.stoppingVoltage || -0.8;

    const hc_eV_nm = 1240;
    const ePhoton = hc_eV_nm / lambda_nm;
    const maxKe = ePhoton - workFunction_eV;
    const isEmitting = maxKe > 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      if (showGrid) drawGrid(ctx, width, height, 40);

      if (useSimulationStore.getState().isRunning) {
        setPeState({ ePhoton, emitted: isEmitting });

        // Spawn photoelectrons based on intensity if above threshold
        if (isEmitting && Math.random() < (intensity / 100) * 0.4) {
          electronsRef.current.push({
            x: 220,
            y: 200 + Math.random() * 160,
            vx: Math.sqrt(maxKe) * 4,
            energy_eV: maxKe
          });
        }

        // Move electrons across plate gap
        electronsRef.current.forEach(el => {
          // Stopping potential decelerates electron velocity
          el.x += (el.vx + (V_stopping * 0.5)) * playbackSpeed;
        });
        electronsRef.current = electronsRef.current.filter(e => e.x > 180 && e.x < 620);
      }

      // Draw Photon Beam shining down onto plate
      ctx.save();
      const beamColor = lambda_nm < 380 ? '#CD853F' : lambda_nm < 500 ? '#D2691E' : '#800000';
      ctx.fillStyle = beamColor;
      ctx.globalAlpha = (intensity / 100) * 0.35;
      ctx.beginPath();
      ctx.moveTo(300, 0);
      ctx.lineTo(160, 200);
      ctx.lineTo(240, 360);
      ctx.lineTo(400, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Draw Cathode Target Metal Plate
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(180, 180, 40, 200);
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 12px Inter';
      ctx.fillText(`Cathode (Φ = ${workFunction_eV} eV)`, 140, 405);

      // Draw Anode Collector Plate
      ctx.fillStyle = '#64748B';
      ctx.fillRect(580, 180, 40, 200);
      ctx.fillText(`Anode Collector (V = ${V_stopping} V)`, 530, 405);

      // Draw Emitted Electrons
      electronsRef.current.forEach(el => {
        ctx.beginPath();
        ctx.arc(el.x, el.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#FDE047';
        ctx.shadowColor = '#FDE047';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      drawLegend(ctx, [
        { label: `Incoming Photons (λ=${lambda_nm}nm)`, color: '#CD853F' },
        { label: 'Ejected Photoelectrons', color: '#FDE047' },
        { label: 'Target Metallic Cathode', color: '#94A3B8' }
      ], 20, 20);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [playbackSpeed, parameters, showGrid]);

  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center">
      <canvas ref={canvasRef} width={800} height={600} className="w-full h-full object-contain  border border-slate-200 rounded-xl bg-white shadow-inner" />
      
      <div className="absolute bottom-4 max-w-xl mx-auto w-full bg-white/95 shadow-xl border border-slate-200 rounded-2xl p-3.5 px-6 shadow-2xl backdrop-blur-md flex items-center justify-between font-mono text-xs">
        <div>
          <div className="text-slate-400 font-sans font-bold mb-1">Photon Energy (hf)</div>
          <div className="text-base font-bold text-stone-300">{peState.ePhoton.toFixed(2)} eV</div>
        </div>
        <div>
          <div className="text-slate-400 font-sans font-bold mb-1">Emission Status</div>
          <span className={`px-2 py-1 rounded font-bold ${peState.emitted ? 'bg-orange-500/20 text-orange-300' : 'bg-stone-500/20 text-stone-300'}`}>
            {peState.emitted ? 'EMITTING ELECTRON BEAM' : 'BELOW THRESHOLD (No Emission)'}
          </span>
        </div>
      </div>
    </div>
  );
};
