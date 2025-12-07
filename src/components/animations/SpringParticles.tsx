'use client';

import React, { memo, useMemo } from 'react';

interface SpringParticlesProps {
  particleCount?: number;
  className?: string;
}

const SpringParticles: React.FC<SpringParticlesProps> = memo(({
  particleCount = 25,
  className = ''
}) => {
  // Spring/Cherry Blossom colors - soft pinks and corals
  const colors = ['#FFB3D9', '#FFC7E8', '#FFDCF0', '#FFAAD6', '#ffffff'];

  const particles = useMemo(() => {
    return Array.from({ length: particleCount }, (_, i) => {
      const colorIndex = Math.floor(Math.random() * colors.length);
      
      return {
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${-10 - Math.random() * 20}%`, // Start above viewport
        size: 4 + Math.random() * 6, // Larger petal size
        opacity: 0.4 + Math.random() * 0.4,
        duration: 10 + Math.random() * 8, // Slow falling
        delay: Math.random() * 8,
        color: colors[colorIndex],
        // Unique sway parameters for each petal
        swayAmount: 20 + Math.random() * 40, // How far it sways
        swaySpeed: 3 + Math.random() * 3, // How fast it sways
        rotation: Math.random() * 360, // Initial rotation
      };
    });
  }, [particleCount]);

  return (
    <div 
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <style>{`
        @keyframes springPetalFall {
          0% { 
            transform: translate3d(0, 0, 0) rotate(var(--initial-rotation));
            opacity: 0;
          }
          5% { opacity: 1; }
          95% { opacity: 1; }
          100% { 
            transform: translate3d(
              calc(var(--sway-amount) * sin(var(--sway-progress) * 3.14159 * 4)), 
              120vh, 
              0
            ) rotate(calc(var(--initial-rotation) + 180deg));
            opacity: 0;
          }
        }
        
        .spring-petal {
          position: absolute;
          border-radius: 50% 30% 50% 30%;
          will-change: transform, opacity;
          contain: strict;
          animation: springPetalFall var(--duration) ease-in-out var(--delay) infinite;
        }
      `}</style>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="spring-petal"
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            '--duration': `${particle.duration}s`,
            '--delay': `${particle.delay}s`,
            '--sway-amount': `${particle.swayAmount}px`,
            '--sway-progress': Math.random(),
            '--initial-rotation': `${particle.rotation}deg`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
});

SpringParticles.displayName = 'SpringParticles';

export default SpringParticles;