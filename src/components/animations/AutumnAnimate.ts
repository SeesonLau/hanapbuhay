// AutumnAnimate - Falling Leaves with heavy gravity and tumbling physics

export interface AutumnParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  scaleX: number;
  scaleY: number;
  flipSpeedX: number;
  flipSpeedY: number;
  flipPhaseX: number;
  flipPhaseY: number;
  color: string;
  drag: number;
  gravity: number;
}

const AUTUMN_COLORS = [
  '#D2691E', // chocolate
  '#CD853F', // peru
  '#B8860B', // dark goldenrod
  '#A0522D', // sienna
  '#8B4513', // saddle brown
  '#FF6347', // tomato
  '#DC143C', // crimson
  '#FF4500', // orange red
  '#DAA520', // goldenrod
  '#F4A460', // sandy brown
];

export function createAutumnParticle(canvasWidth: number, canvasHeight: number): AutumnParticle {
  return {
    x: Math.random() * canvasWidth,
    y: -50 - Math.random() * 100,
    vx: (Math.random() - 0.5) * 2,
    vy: 0,
    size: 15 + Math.random() * 20,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.1,
    scaleX: 1,
    scaleY: 1,
    flipSpeedX: 1 + Math.random() * 2,
    flipSpeedY: 0.5 + Math.random() * 1.5,
    flipPhaseX: Math.random() * Math.PI * 2,
    flipPhaseY: Math.random() * Math.PI * 2,
    color: AUTUMN_COLORS[Math.floor(Math.random() * AUTUMN_COLORS.length)],
    drag: 0.02 + Math.random() * 0.02,
    gravity: 0.08 + Math.random() * 0.04,
  };
}

export function updateAutumnParticle(
  particle: AutumnParticle,
  time: number,
  canvasWidth: number,
  canvasHeight: number
): void {
  // Apply heavy gravity
  particle.vy += particle.gravity;
  
  // Apply air resistance (drag)
  particle.vx *= (1 - particle.drag);
  particle.vy *= (1 - particle.drag * 0.5);
  
  // Occasional wind gusts
  if (Math.random() < 0.01) {
    particle.vx += (Math.random() - 0.3) * 3;
  }
  
  // Update position
  particle.x += particle.vx;
  particle.y += particle.vy;
  
  // Tumbling rotation - faster when falling faster
  particle.rotationSpeed += (Math.random() - 0.5) * 0.01;
  particle.rotationSpeed *= 0.98;
  particle.rotation += particle.rotationSpeed + particle.vy * 0.02;
  
  // 3D flip simulation using scale oscillation
  particle.scaleX = Math.cos(time * particle.flipSpeedX + particle.flipPhaseX);
  particle.scaleY = 0.6 + Math.abs(Math.sin(time * particle.flipSpeedY + particle.flipPhaseY)) * 0.4;
  
  // Reset when off screen
  if (particle.y > canvasHeight + particle.size) {
    particle.y = -particle.size - Math.random() * 50;
    particle.x = Math.random() * canvasWidth;
    particle.vy = 0;
    particle.vx = (Math.random() - 0.5) * 2;
    particle.color = AUTUMN_COLORS[Math.floor(Math.random() * AUTUMN_COLORS.length)];
  }
  
  // Horizontal bounds
  if (particle.x < -particle.size * 2) particle.x = canvasWidth + particle.size;
  if (particle.x > canvasWidth + particle.size * 2) particle.x = -particle.size;
}

export function renderAutumnParticle(
  ctx: CanvasRenderingContext2D,
  particle: AutumnParticle
): void {
  ctx.save();
  ctx.translate(particle.x, particle.y);
  ctx.rotate(particle.rotation);
  ctx.scale(particle.scaleX, particle.scaleY);
  
  const size = particle.size;
  
  // Draw maple-like leaf shape
  ctx.beginPath();
  ctx.fillStyle = particle.color;
  
  // Main leaf body with pointed lobes
  ctx.moveTo(0, -size);
  
  // Right side lobes
  ctx.bezierCurveTo(size * 0.3, -size * 0.8, size * 0.6, -size * 0.4, size * 0.8, -size * 0.5);
  ctx.bezierCurveTo(size * 0.7, -size * 0.2, size * 0.9, 0, size, size * 0.2);
  ctx.bezierCurveTo(size * 0.7, size * 0.1, size * 0.5, size * 0.3, size * 0.4, size * 0.6);
  ctx.bezierCurveTo(size * 0.3, size * 0.4, size * 0.2, size * 0.5, 0, size * 0.8);
  
  // Left side lobes (mirror)
  ctx.bezierCurveTo(-size * 0.2, size * 0.5, -size * 0.3, size * 0.4, -size * 0.4, size * 0.6);
  ctx.bezierCurveTo(-size * 0.5, size * 0.3, -size * 0.7, size * 0.1, -size, size * 0.2);
  ctx.bezierCurveTo(-size * 0.9, 0, -size * 0.7, -size * 0.2, -size * 0.8, -size * 0.5);
  ctx.bezierCurveTo(-size * 0.6, -size * 0.4, -size * 0.3, -size * 0.8, 0, -size);
  
  ctx.closePath();
  ctx.fill();
  
  // Add leaf vein
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, -size * 0.8);
  ctx.lineTo(0, size * 0.6);
  ctx.moveTo(0, -size * 0.3);
  ctx.lineTo(size * 0.5, -size * 0.1);
  ctx.moveTo(0, -size * 0.3);
  ctx.lineTo(-size * 0.5, -size * 0.1);
  ctx.moveTo(0, size * 0.2);
  ctx.lineTo(size * 0.3, size * 0.4);
  ctx.moveTo(0, size * 0.2);
  ctx.lineTo(-size * 0.3, size * 0.4);
  ctx.stroke();
  
  // Add slight highlight
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.beginPath();
  ctx.ellipse(-size * 0.2, -size * 0.3, size * 0.15, size * 0.25, -0.5, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();
}
