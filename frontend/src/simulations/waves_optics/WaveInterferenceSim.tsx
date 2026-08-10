import React, { useEffect, useRef, useState } from 'react';
import { useSimulationStore } from '../../store/useSimulationStore';

export const WaveInterferenceSim: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { parameters, playbackSpeed } = useSimulationStore();
  
  const [time, setTime] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = time;
    
    // Create offscreen canvas for pixel manipulation
    const offscreen = document.createElement('canvas');
    offscreen.width = 400; // Lower res for performance
    offscreen.height = 300;
    const offCtx = offscreen.getContext('2d');
    
    if (!offCtx) return;
    
    const imageData = offCtx.createImageData(offscreen.width, offscreen.height);
    const data = imageData.data;

    const render = () => {
      if (useSimulationStore.getState().isRunning) {
        t += 0.05 * playbackSpeed;
        setTime(t);
      }

      const freq = parameters.frequency || 5;
      const d = (parameters.separation || 15) * 5; // pixels
      
      const w = offscreen.width;
      const h = offscreen.height;
      const cx1 = w / 2 - d / 2;
      const cx2 = w / 2 + d / 2;
      const cy = h / 2;
      
      const k = freq * 0.1; // Wave number
      const omega = freq * 0.5; // Angular freq

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const r1 = Math.hypot(x - cx1, y - cy);
          const r2 = Math.hypot(x - cx2, y - cy);
          
          // Wave equation: A * sin(kr - wt)
          // Attenuate by distance (1/r)
          const z1 = (Math.sin(k * r1 - omega * t)) / (Math.sqrt(r1 + 1) * 0.1);
          const z2 = (Math.sin(k * r2 - omega * t)) / (Math.sqrt(r2 + 1) * 0.1);
          
          // Superposition
          const z = z1 + z2;
          
          // Map to color (-2 to 2) -> (0 to 255)
          const colorVal = Math.floor((z + 1.5) * 85);
          const clamped = Math.max(0, Math.min(255, colorVal));
          
          const index = (y * w + x) * 4;
          data[index] = clamped * 0.2; // R: slightly blue/cyan
          data[index + 1] = clamped * 0.5; // G
          data[index + 2] = clamped; // B
          data[index + 3] = 255; // Alpha
        }
      }
      
      offCtx.putImageData(imageData, 0, 0);
      
      // Draw scaled up to main canvas
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(offscreen, 0, 0, canvas.width, canvas.height);
      
      // Draw source positions
      const scaleX = canvas.width / w;
      const scaleY = canvas.height / h;
      
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(cx1 * scaleX, cy * scaleY, 4, 0, Math.PI * 2);
      ctx.arc(cx2 * scaleX, cy * scaleY, 4, 0, Math.PI * 2);
      ctx.fill();

      animId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animId);
  }, [parameters, playbackSpeed]);

  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center bg-slate-950">
      <canvas ref={canvasRef} width={800} height={600} className="w-full h-full object-cover max-w-4xl border border-slate-800 rounded-xl shadow-inner" />
    </div>
  );
};
