// WinterAnimate - Crystalline Snowfall with parallax depth and shimmer

export interface WinterParticle {
  x: number;
  y: number;
  size: number;
  speed: number;
  layer: 0 | 1 | 2; // 0 = back (slow/small), 1 = mid, 2 = front (fast/large)
  opacity: number;
  baseOpacity: number;
  shimmerPhase: number;
  shimmerSpeed: number;
  shimmerIntensity: number;
  turbulenceOffset: number;
  turbulenceSpeed: number;
  rotation: number;
  rotationSpeed: number;
  crystalline: boolean; // true = snowflake shape, false = simple circle
}

// Layer configurations for parallax effect
const LAYER_CONFIG = {
  0: { sizeRange: [2, 4], speedRange: [0.3, 0.6], opacity: 0.3 },   // Back - tiny, slow
  1: { sizeRange: [4, 8], speedRange: [0.6, 1.2], opacity: 0.5 },   // Mid
  2: { sizeRange: [8, 14], speedRange: [1.2, 2.0], opacity: 0.8 },  // Front - large, fast
};

export function createWinterParticle(canvasWidth: number, canvasHeight: number): WinterParticle {
  // Distribute particles across layers: 40% back, 35% mid, 25% front
  const rand = Math.random();
  const layer: 0 | 1 | 2 = rand < 0.4 ? 0 : rand < 0.75 ? 1 : 2;
  
  const config = LAYER_CONFIG[layer];
  const size = config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]);
  const speed = config.speedRange[0] + Math.random() * (config.speedRange[1] - config.speedRange[0]);
  
  return {
    x: Math.random() * canvasWidth,
    y: Math.random() * canvasHeight - canvasHeight,
    size,
    speed,
    layer,
    opacity: config.opacity,
    baseOpacity: config.opacity,
    shimmerPhase: Math.random() * Math.PI * 2,
    shimmerSpeed: 2 + Math.random() * 4,
    shimmerIntensity: 0.3 + Math.random() * 0.4,
    turbulenceOffset: Math.random() * Math.PI * 2,
    turbulenceSpeed: 0.5 + Math.random() * 1,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.02,
    crystalline: layer === 2 || (layer === 1 && Math.random() > 0.5),
  };
}

export function updateWinterParticle(
  particle: WinterParticle,
  time: number,
  canvasWidth: number,
  canvasHeight: number
): void {
  // Linear descent
  particle.y += particle.speed;
  
  // Slight horizontal turbulence - gentle swaying
  const turbulence = Math.sin(time * particle.turbulenceSpeed + particle.turbulenceOffset) * 0.5;
  particle.x += turbulence * (particle.layer + 1) * 0.3;
  
  // Slow rotation for crystalline flakes
  if (particle.crystalline) {
    particle.rotation += particle.rotationSpeed;
  }
  
  // Shimmer effect - random twinkle
  const shimmer = Math.sin(time * particle.shimmerSpeed + particle.shimmerPhase);
  const shimmerBoost = shimmer > 0.7 ? (shimmer - 0.7) / 0.3 : 0; // Only boost at peaks
  particle.opacity = particle.baseOpacity + shimmerBoost * particle.shimmerIntensity;
  
  // Reset when off screen
  if (particle.y > canvasHeight + particle.size) {
    particle.y = -particle.size - Math.random() * 50;
    particle.x = Math.random() * canvasWidth;
    particle.shimmerPhase = Math.random() * Math.PI * 2;
  }
  
  // Horizontal wrapping
  if (particle.x < -particle.size) particle.x = canvasWidth + particle.size;
  if (particle.x > canvasWidth + particle.size) particle.x = -particle.size;
}

function drawSnowflake(ctx: CanvasRenderingContext2D, size: number, opacity: number): void {
  const arms = 6;
  const armLength = size;
  
  ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
  ctx.lineWidth = size * 0.15;
  ctx.lineCap = 'round';
  
  // Draw main arms
  for (let i = 0; i < arms; i++) {
    const angle = (i / arms) * Math.PI * 2;
    const endX = Math.cos(angle) * armLength;
    const endY = Math.sin(angle) * armLength;
    
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    
    // Small branches on each arm
    const branchLength = armLength * 0.4;
    const branchPos = armLength * 0.6;
    
    for (let side = -1; side <= 1; side += 2) {
      const branchAngle = angle + side * 0.5;
      const branchStartX = Math.cos(angle) * branchPos;
      const branchStartY = Math.sin(angle) * branchPos;
      const branchEndX = branchStartX + Math.cos(branchAngle) * branchLength;
      const branchEndY = branchStartY + Math.sin(branchAngle) * branchLength;
      
      ctx.beginPath();
      ctx.moveTo(branchStartX, branchStartY);
      ctx.lineTo(branchEndX, branchEndY);
      ctx.stroke();
    }
  }
  
  // Center dot
  ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.15, 0, Math.PI * 2);
  ctx.fill();
}

export function renderWinterParticle(
  ctx: CanvasRenderingContext2D,
  particle: WinterParticle
): void {
  ctx.save();
  ctx.translate(particle.x, particle.y);
  
  if (particle.crystalline) {
    // Draw detailed snowflake for front/mid layers
    ctx.rotate(particle.rotation);
    
    // Outer glow for magical effect
    const glowSize = particle.size * 2;
    const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, glowSize);
    glow.addColorStop(0, `rgba(200, 230, 255, ${particle.opacity * 0.3})`);
    glow.addColorStop(0.5, `rgba(180, 210, 255, ${particle.opacity * 0.1})`);
    glow.addColorStop(1, 'rgba(150, 200, 255, 0)');
    
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, glowSize, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw crystalline snowflake
    drawSnowflake(ctx, particle.size, particle.opacity);
    
  } else {
    // Simple soft circle for back layer particles
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, particle.size);
    gradient.addColorStop(0, `rgba(255, 255, 255, ${particle.opacity})`);
    gradient.addColorStop(0.4, `rgba(230, 240, 255, ${particle.opacity * 0.7})`);
    gradient.addColorStop(1, `rgba(200, 220, 255, 0)`);
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
    ctx.fill();
  }
  
  ctx.restore();
}
