// Reusable HTML5 Canvas Drawing & Vector Utility functions for Graviton 60 FPS Simulations

export const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number, spacing: number = 40) => {
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;

  for (let x = 0; x < width; x += spacing) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += spacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  ctx.restore();
};

export const drawArrow = (
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  color: string,
  label: string = '',
  scale: number = 1
) => {
  const dx = (toX - fromX) * scale;
  const dy = (toY - fromY) * scale;
  const targetX = fromX + dx;
  const targetY = fromY + dy;
  const len = Math.sqrt(dx * dx + dy * dy);
  
  if (len < 3) return; // Ignore vanishingly small vectors

  const angle = Math.atan2(dy, dx);
  const headLen = Math.min(12, len * 0.4);

  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.shadowColor = color;
  ctx.shadowBlur = 6;

  // Draw arrow line shaft
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(targetX, targetY);
  ctx.stroke();

  // Draw arrow tip triangle
  ctx.beginPath();
  ctx.moveTo(targetX, targetY);
  ctx.lineTo(
    targetX - headLen * Math.cos(angle - Math.PI / 6),
    targetY - headLen * Math.sin(angle - Math.PI / 6)
  );
  ctx.lineTo(
    targetX - headLen * Math.cos(angle + Math.PI / 6),
    targetY - headLen * Math.sin(angle + Math.PI / 6)
  );
  ctx.closePath();
  ctx.fill();

  // Draw Label
  if (label) {
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#1e293b'; // dark slate for visibility on light canvas
    ctx.fillText(label, targetX + 6, targetY + 4);
  }
  ctx.restore();
};

export const drawLegend = (
  ctx: CanvasRenderingContext2D,
  items: { label: string; color: string }[],
  x: number = 20,
  y: number = 20
) => {
  ctx.save();
  const pad = 12;
  const lineH = 22;
  const boxWidth = 160;
  const boxHeight = items.length * lineH + pad * 2;

  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(x, y, boxWidth, boxHeight, 10);
  ctx.fill();
  ctx.stroke();

  ctx.font = 'bold 11px Inter, sans-serif';
  items.forEach((item, idx) => {
    const itemY = y + pad + idx * lineH + 12;
    // Color box
    ctx.fillStyle = item.color;
    ctx.shadowColor = item.color;
    ctx.shadowBlur = 5;
    ctx.fillRect(x + pad, itemY - 9, 14, 14);
    
    // Label
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#0F172A';
    ctx.fillText(item.label, x + pad + 22, itemY + 2);
  });

  ctx.restore();
};

export const drawSphere = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string,
  glow: string = color
) => {
  ctx.save();
  ctx.shadowColor = glow;
  ctx.shadowBlur = 15;

  const grad = ctx.createRadialGradient(x - radius * 0.3, y - radius * 0.3, radius * 0.1, x, y, radius);
  grad.addColorStop(0, '#0F172A');
  grad.addColorStop(0.3, color);
  grad.addColorStop(1, '#e2e8f0');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
};

export const getCanvasPoint = (e: React.PointerEvent<HTMLCanvasElement>, canvas: HTMLCanvasElement) => {
  const rect = canvas.getBoundingClientRect();
  const domRatio = rect.width / rect.height;
  const canvasRatio = canvas.width / canvas.height;
  
  let drawnWidth = rect.width;
  let drawnHeight = rect.height;
  
  if (domRatio > canvasRatio) {
    drawnWidth = rect.height * canvasRatio;
  } else {
    drawnHeight = rect.width / canvasRatio;
  }
  
  const offsetX = (rect.width - drawnWidth) / 2;
  const offsetY = (rect.height - drawnHeight) / 2;
  
  const px = e.clientX - rect.left - offsetX;
  const py = e.clientY - rect.top - offsetY;
  
  const scaleX = canvas.width / drawnWidth;
  const scaleY = canvas.height / drawnHeight;
  
  return { x: px * scaleX, y: py * scaleY };
};
