// SummerAnimate - Fireflies with wandering steering behaviors

export interface SummerParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseSize: number;
  glowIntensity: number;
  glowPhase: number;
  glowSpeed: number;
  wanderAngle: number;
  wanderSpeed: number;
  maxSpeed: number;
  trailPositions: { x: number; y: number; alpha: number }[];
}

export function createSummerParticle(canvasWidth: number, canvasHeight: number): SummerParticle {
  return {
    x: Math.random() * canvasWidth,
    y: Math.random() * canvasHeight,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    size: 3 + Math.random() * 4,
    baseSize: 3 + Math.random() * 4,
    glowIntensity: Math.random(),
    glowPhase: Math.random() * Math.PI * 2,
    glowSpeed: 1 + Math.random() * 2,
    wanderAngle: Math.random() * Math.PI * 2,
    wanderSpeed: 0.05 + Math.random() * 0.1,
    maxSpeed: 0.8 + Math.random() * 0.4,
    trailPositions: [],
  };
}

// Simple Perlin-like noise using sine combinations
function pseudoNoise(x: number, y: number, time: number): number {
  return (
    Math.sin(x * 0.01 + time * 0.5) * 0.5 +
    Math.sin(y * 0.01 + time * 0.3) * 0.3 +
    Math.sin((x + y) * 0.005 + time * 0.7) * 0.2
  );
}

export function updateSummerParticle(
  particle: SummerParticle,
  time: number,
  canvasWidth: number,
  canvasHeight: number
): void {
  // Store trail position
  particle.trailPositions.unshift({ 
    x: particle.x, 
    y: particle.y, 
    alpha: particle.glowIntensity 
  });
  if (particle.trailPositions.length > 8) {
    particle.trailPositions.pop();
  }
  
  // Wandering steering behavior using pseudo-noise
  const noiseValue = pseudoNoise(particle.x, particle.y, time);
  particle.wanderAngle += noiseValue * particle.wanderSpeed;
  
  // Apply steering force
  const steerX = Math.cos(particle.wanderAngle) * 0.02;
  const steerY = Math.sin(particle.wanderAngle) * 0.02;
  
  particle.vx += steerX;
  particle.vy += steerY;
  
  // Slight upward float against gravity
  particle.vy -= 0.005;
  
  // Apply drag
  particle.vx *= 0.98;
  particle.vy *= 0.98;
  
  // Limit speed
  const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
  if (speed > particle.maxSpeed) {
    particle.vx = (particle.vx / speed) * particle.maxSpeed;
    particle.vy = (particle.vy / speed) * particle.maxSpeed;
  }
  
  particle.x += particle.vx;
  particle.y += particle.vy;
  
  // Pulsing glow effect - organic breathing
  particle.glowIntensity = 0.3 + Math.pow(Math.sin(time * particle.glowSpeed + particle.glowPhase), 2) * 0.7;
  particle.size = particle.baseSize * (0.8 + particle.glowIntensity * 0.4);
  
  // Soft boundary wrapping
  const margin = 50;
  if (particle.x < -margin) particle.x = canvasWidth + margin;
  if (particle.x > canvasWidth + margin) particle.x = -margin;
  if (particle.y < -margin) particle.y = canvasHeight + margin;
  if (particle.y > canvasHeight + margin) particle.y = -margin;
}

export function renderSummerParticle(
  ctx: CanvasRenderingContext2D,
  particle: SummerParticle
): void {
  // Render trail
  particle.trailPositions.forEach((pos, i) => {
    const trailAlpha = (1 - i / particle.trailPositions.length) * 0.3 * pos.alpha;
    const trailSize = particle.size * (1 - i / particle.trailPositions.length) * 0.5;
    
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, trailSize, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 150, ${trailAlpha})`;
    ctx.fill();
  });
  
  // Outer glow
  const glowRadius = particle.size * 4 * particle.glowIntensity;
  const outerGlow = ctx.createRadialGradient(
    particle.x, particle.y, 0,
    particle.x, particle.y, glowRadius
  );
  outerGlow.addColorStop(0, `rgba(255, 255, 180, ${particle.glowIntensity * 0.6})`);
  outerGlow.addColorStop(0.3, `rgba(200, 255, 100, ${particle.glowIntensity * 0.3})`);
  outerGlow.addColorStop(1, 'rgba(150, 255, 50, 0)');
  
  ctx.beginPath();
  ctx.arc(particle.x, particle.y, glowRadius, 0, Math.PI * 2);
  ctx.fillStyle = outerGlow;
  ctx.fill();
  
  // Core bright center
  const coreGradient = ctx.createRadialGradient(
    particle.x, particle.y, 0,
    particle.x, particle.y, particle.size
  );
  coreGradient.addColorStop(0, `rgba(255, 255, 255, ${particle.glowIntensity})`);
  coreGradient.addColorStop(0.5, `rgba(255, 255, 200, ${particle.glowIntensity * 0.8})`);
  coreGradient.addColorStop(1, `rgba(200, 255, 100, ${particle.glowIntensity * 0.4})`);
  
  ctx.beginPath();
  ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
  ctx.fillStyle = coreGradient;
  ctx.fill();
}
