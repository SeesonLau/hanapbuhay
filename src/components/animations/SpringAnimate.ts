// SpringAnimate - Sakura/Pollen particles with gentle sine-wave swaying motion
export interface SpringParticle {
  x: number;
  y: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  swayAmplitude: number;
  swayFrequency: number;
  swayOffset: number;
  fallSpeed: number;
  opacity: number;
  petalShape: number; // 0-1 determines petal elongation
}

export function createSpringParticle(canvasWidth: number, canvasHeight: number): SpringParticle {
  return {
    x: Math.random() * canvasWidth,
    y: Math.random() * canvasHeight - canvasHeight,
    size: 8 + Math.random() * 12,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.02,
    swayAmplitude: 30 + Math.random() * 50,
    swayFrequency: 0.5 + Math.random() * 1.5,
    swayOffset: Math.random() * Math.PI * 2,
    fallSpeed: 0.3 + Math.random() * 0.5,
    opacity: 0.6 + Math.random() * 0.4,
    petalShape: 0.5 + Math.random() * 0.5,
  };
}

export function updateSpringParticle(
  particle: SpringParticle,
  time: number,
  canvasWidth: number,
  canvasHeight: number
): void {
  // Gentle sine-wave swaying motion
  const sway = Math.sin(time * particle.swayFrequency + particle.swayOffset) * particle.swayAmplitude * 0.01;
  
  particle.x += sway;
  particle.y += particle.fallSpeed;
  
  // Slow Z-axis rotation
  particle.rotation += particle.rotationSpeed;
  
  // Gentle opacity pulsing
  particle.opacity = 0.5 + Math.sin(time * 0.5 + particle.swayOffset) * 0.3;
  
  // Reset when off screen
  if (particle.y > canvasHeight + particle.size) {
    particle.y = -particle.size;
    particle.x = Math.random() * canvasWidth;
  }
  
  // Wrap horizontally
  if (particle.x < -particle.size) particle.x = canvasWidth + particle.size;
  if (particle.x > canvasWidth + particle.size) particle.x = -particle.size;
}

export function renderSpringParticle(
  ctx: CanvasRenderingContext2D,
  particle: SpringParticle
): void {
  ctx.save();
  ctx.translate(particle.x, particle.y);
  ctx.rotate(particle.rotation);
  ctx.globalAlpha = particle.opacity;
  
  // Draw sakura petal shape
  const size = particle.size;
  const elongation = particle.petalShape;
  
  ctx.beginPath();
  ctx.fillStyle = '#FFB7C5';
  
  // Create petal shape using bezier curves
  ctx.moveTo(0, -size * elongation);
  ctx.bezierCurveTo(
    size * 0.5, -size * 0.3,
    size * 0.5, size * 0.3,
    0, size * elongation
  );
  ctx.bezierCurveTo(
    -size * 0.5, size * 0.3,
    -size * 0.5, -size * 0.3,
    0, -size * elongation
  );
  ctx.fill();
  
  // Add subtle center gradient
  const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 0.3);
  gradient.addColorStop(0, 'rgba(255, 220, 230, 0.8)');
  gradient.addColorStop(1, 'rgba(255, 183, 197, 0)');
  ctx.fillStyle = gradient;
  ctx.fill();
  
  ctx.restore();
}
