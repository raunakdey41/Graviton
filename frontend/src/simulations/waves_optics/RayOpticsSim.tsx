import React, { useEffect, useRef } from 'react';
import { useSimulationStore } from '../../store/useSimulationStore';
import { drawGrid, drawLegend } from '../../utils/canvasUtils';

export const RayOpticsSim: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { parameters, showGrid } = useSimulationStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const opticType = parameters.opticType || 0; // 0: Convex Lens, 1: Concave Lens, 2: Concave Mirror, 3: Convex Mirror
    let fMag = parameters.focalLength || 20; // cm
    const u = parameters.objectDistance || -45; // cm
    const h0 = parameters.objectHeight || 12; // cm

    // Setup focal length and calculate image
    let f = fMag;
    let v = 0;
    let mag = 1;
    let isMirror = false;

    if (opticType === 0) {
      // Convex Lens (f > 0)
      f = Math.abs(fMag);
      v = (f * u) / (u + f);
      mag = v / u;
    } else if (opticType === 1) {
      // Concave Lens (f < 0)
      f = -Math.abs(fMag);
      v = (f * u) / (u + f);
      mag = v / u;
    } else if (opticType === 2) {
      // Concave Mirror (f < 0 in cartesian)
      isMirror = true;
      f = -Math.abs(fMag);
      v = (f * u) / (u - f);
      mag = -v / u;
    } else if (opticType === 3) {
      // Convex Mirror (f > 0 in cartesian)
      isMirror = true;
      f = Math.abs(fMag);
      v = (f * u) / (u - f);
      mag = -v / u;
    }

    const hImage = h0 * mag;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      if (showGrid) drawGrid(ctx, width, height, 30);

      const centerX = width / 2;
      const centerY = height / 2;
      const scaleX = 5; // px per cm
      const scaleY = 7; // px per cm

      // Principal Optical Axis
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();

      // Draw Optical Element at center
      ctx.save();
      if (!isMirror) {
        ctx.strokeStyle = '#38bdf8';
        ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        if (opticType === 0) { // Convex Lens
          ctx.moveTo(centerX, centerY - 90);
          ctx.quadraticCurveTo(centerX + 25, centerY, centerX, centerY + 90);
          ctx.quadraticCurveTo(centerX - 25, centerY, centerX, centerY - 90);
        } else { // Concave Lens
          ctx.moveTo(centerX - 15, centerY - 80);
          ctx.quadraticCurveTo(centerX, centerY, centerX - 15, centerY + 80);
          ctx.lineTo(centerX + 15, centerY + 80);
          ctx.quadraticCurveTo(centerX, centerY, centerX + 15, centerY - 80);
          ctx.closePath();
        }
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.strokeStyle = '#94a3b8'; // Silver mirror
        ctx.lineWidth = 4;
        ctx.beginPath();
        if (opticType === 2) { // Concave Mirror (curves inward)
          ctx.arc(centerX + 60, centerY, 100, Math.PI - 0.9, Math.PI + 0.9);
        } else { // Convex Mirror (curves outward)
          ctx.arc(centerX - 60, centerY, 100, -0.9, 0.9);
        }
        ctx.stroke();
        
        // Hashes to indicate opaque side
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1;
        for(let i = -70; i <= 70; i += 15) {
          ctx.beginPath();
          if (opticType === 2) { // Hashes on right side
            const x = centerX + 60 - Math.sqrt(100*100 - i*i);
            ctx.moveTo(x, centerY + i);
            ctx.lineTo(x + 10, centerY + i + 5);
          } else { // Hashes on right side of convex mirror arc
            const x = centerX - 60 + Math.sqrt(100*100 - i*i);
            ctx.moveTo(x, centerY + i);
            ctx.lineTo(x + 10, centerY + i + 5);
          }
          ctx.stroke();
        }
      }
      ctx.restore();

      // Draw Focal Points F and Center of Curvature C
      const fPx = Math.abs(f) * scaleX;
      let points = [centerX - fPx, centerX + fPx];
      if (isMirror) {
         // Mirror only has one active focus
         points = [centerX + f * scaleX]; 
         points.push(centerX + 2 * f * scaleX); // Center of curvature
      }

      points.forEach((ptX, index) => {
        ctx.fillStyle = '#D2B48C';
        ctx.beginPath();
        ctx.arc(ptX, centerY, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = 'bold 12px font-mono';
        const label = (isMirror && index === 1) ? 'C' : 'F';
        ctx.fillText(label, ptX - 4, centerY + 20);
      });

      // Draw Object (at u)
      const objX = centerX + u * scaleX;
      const objTopY = centerY - h0 * scaleY;
      ctx.save();
      ctx.strokeStyle = '#A0522D';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(objX, centerY);
      ctx.lineTo(objX, objTopY);
      ctx.stroke();
      // Arrowhead for object
      ctx.fillStyle = '#A0522D';
      ctx.beginPath();
      ctx.moveTo(objX, objTopY - 6);
      ctx.lineTo(objX - 5, objTopY + 5);
      ctx.lineTo(objX + 5, objTopY + 5);
      ctx.fill();
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 12px Inter';
      ctx.fillText(`Obj u=${u}cm`, objX - 40, objTopY - 15);
      ctx.restore();

      // Draw Image (at v)
      if (Math.abs(v) < 200) {
        const imgX = centerX + v * scaleX;
        const imgTopY = centerY - hImage * scaleY;
        ctx.save();
        
        // Real images for lens are v > 0, for mirror are v < 0
        const isReal = isMirror ? (v < 0) : (v > 0);
        ctx.strokeStyle = isReal ? '#800000' : 'rgba(244, 63, 94, 0.6)'; // dashed if virtual
        
        if (!isReal) ctx.setLineDash([5, 5]);
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(imgX, centerY);
        ctx.lineTo(imgX, imgTopY);
        ctx.stroke();
        
        ctx.fillStyle = isReal ? '#800000' : 'rgba(244, 63, 94, 0.6)';
        ctx.beginPath();
        if (hImage > 0) {
          ctx.moveTo(imgX, imgTopY - 6);
          ctx.lineTo(imgX - 5, imgTopY + 5);
          ctx.lineTo(imgX + 5, imgTopY + 5);
        } else {
          ctx.moveTo(imgX, imgTopY + 6);
          ctx.lineTo(imgX - 5, imgTopY - 5);
          ctx.lineTo(imgX + 5, imgTopY - 5);
        }
        ctx.fill();
        ctx.font = 'bold 12px Inter';
        ctx.fillText(`Img v=${v.toFixed(1)}cm`, imgX - 35, imgTopY + (hImage > 0 ? -15 : 25));
        ctx.restore();
      }

      // Draw Cardinal Rays
      ctx.save();
      ctx.strokeStyle = '#FDE047';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = '#FDE047';
      ctx.shadowBlur = 4;

      // Ray 1: Parallel to axis -> diverges/converges through focus
      ctx.beginPath();
      ctx.moveTo(objX, objTopY);
      // Incident
      if (isMirror) {
        // Find intersection with mirror
        const hitX = opticType === 2 ? (centerX + 60 - Math.sqrt(100*100 - (objTopY-centerY)**2)) : (centerX - 60 + Math.sqrt(100*100 - (objTopY-centerY)**2));
        ctx.lineTo(hitX, objTopY);
        // Reflected Ray
        ctx.lineTo(centerX + 300 * Math.sign(f), objTopY + ((centerY - objTopY) / (hitX - (centerX + f*scaleX))) * (300 * Math.sign(f) - hitX));
      } else {
        ctx.lineTo(centerX, objTopY);
        // Refracted
        if (f > 0) {
          ctx.lineTo(centerX + 300, centerY - (objTopY - centerY) * (300 / fPx));
        } else {
          ctx.lineTo(centerX + 300, centerY + (objTopY - centerY) * (300 / fPx));
        }
      }
      ctx.stroke();

      // Ray 2: Center ray (unbent for lens, reflects symmetrical for mirror)
      ctx.beginPath();
      ctx.moveTo(objX, objTopY);
      if (isMirror) {
        // hits pole
        ctx.lineTo(centerX, centerY);
        ctx.lineTo(centerX - 300, centerY + (objTopY - centerY) * (300 / Math.abs(objX - centerX)));
      } else {
        ctx.lineTo(centerX + 300, centerY - (objTopY - centerY) * (300 / Math.abs(objX - centerX)));
      }
      ctx.stroke();
      ctx.restore();

      drawLegend(ctx, [
        { label: 'Object', color: '#A0522D' },
        { label: 'Image', color: '#800000' },
        { label: 'Construction Rays', color: '#FDE047' }
      ], 20, 20);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [parameters, showGrid]);

  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center">
      <canvas ref={canvasRef} width={800} height={600} className="w-full h-full object-contain  border border-slate-200 rounded-xl bg-slate-900 shadow-inner" />
    </div>
  );
};
