'use client';

import React, { memo, useMemo } from 'react';

interface SummerParticlesProps {
  particleCount?: number;
  className?: string;
}

const SummerParticles: React.FC<SummerParticlesProps> = memo(({
  particleCount = 25,
  className = ''
}) => {
  // Summer colors - vibrant greens and sunny yellows
  const colors = ['#FFE680', '#FFF4CC', '#8ED969', '#B8E68B', '#FFFACD'];

  const particles = useMemo(() => {
    return Array.from({ length: particleCount }, (_, i) => {
      const colorIndex = Math.floor(Math.random() * colors.length);
      
      return {
        id: i,
        left: `${Math.random() * 100}%`,
        bottom: `${-10 - Math.random() * 20}%`, // Start below viewport
        size: 3 + Math.random() * 5,
        opacity: 0.3 + Math.random() * 0.4,
        duration: 12 + Math.random() * 10, // Slow rise
        delay: Math.random() * 10,
        color: colors[colorIndex],
        // Float parameters
        floatAmount: 15 + Math.random() * 30,
        floatCycles: 3 + Math.random() * 3, // How many times it bobs
      };
    });
  }, [particleCount]);

  return (
    <div 
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <style>{`
        @keyframes summerPollenRise {
          0% { 
            transform: translate3d(0, 0, 0) scale(0.6);
            opacity: 0;
          }
          5% { opacity: 1; }
          50% {
            transform: translate3d(
              calc(var(--float-amount) * sin(var(--float-cycles) * 3.14159)),
              -60vh,
              0
            ) scale(1);
          }
          95% { opacity: 1; }
          100% { 
            transform: translate3d(
              calc(var(--float-amount) * sin(var(--float-cycles) * 3.14159 * 2)),
              -120vh,
              0
            ) scale(0.6);
            opacity: 0;
          }
        }
        
        .summer-pollen {
          position: absolute;
          border-radius: 50%;
          will-change: transform, opacity;
          contain: strict;
          animation: summerPollenRise var(--duration) ease-in-out var(--delay) infinite;
        }
      `}</style>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="summer-pollen"
          style={{
            left: particle.left,
            bottom: particle.bottom,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            '--duration': `${particle.duration}s`,
            '--delay': `${particle.delay}s`,
            '--float-amount': `${particle.floatAmount}px`,
            '--float-cycles': particle.floatCycles,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
});

SummerParticles.displayName = 'SummerParticles';

export default SummerParticles;