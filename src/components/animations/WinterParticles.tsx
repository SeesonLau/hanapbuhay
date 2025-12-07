'use client';

import React, { memo, useMemo } from 'react';

interface WinterParticlesProps {
  particleCount?: number;
  className?: string;
}

const WinterParticles: React.FC<WinterParticlesProps> = memo(({
  particleCount = 30,
  className = ''
}) => {
  // Winter colors - icy blues and whites
  const colors = ['#A3D0FF', '#D6ECFF', '#ffffff', '#E0F0FF', '#CCE5FF'];

  const particles = useMemo(() => {
    return Array.from({ length: particleCount }, (_, i) => {
      const colorIndex = Math.floor(Math.random() * colors.length);
      const isWhite = colorIndex === 2; // Pure white snowflakes
      
      return {
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${-10 - Math.random() * 20}%`,
        size: 2 + Math.random() * 5,
        opacity: isWhite ? 0.7 + Math.random() * 0.3 : 0.5 + Math.random() * 0.3,
        duration: 10 + Math.random() * 8, // Consistent slow fall
        delay: Math.random() * 10,
        color: colors[colorIndex],
        // Minimal drift for snowfall
        drift: -5 + Math.random() * 10, // Very slight horizontal movement
      };
    });
  }, [particleCount]);

  return (
    <div 
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <style>{`
        @keyframes winterSnowfall {
          0% { 
            transform: translate3d(0, 0, 0);
            opacity: 0;
          }
          5% { opacity: 1; }
          95% { opacity: 1; }
          100% { 
            transform: translate3d(var(--drift), 120vh, 0);
            opacity: 0;
          }
        }
        
        .winter-snowflake {
          position: absolute;
          border-radius: 50%;
          will-change: transform, opacity;
          contain: strict;
          animation: winterSnowfall var(--duration) linear var(--delay) infinite;
          box-shadow: 0 0 3px rgba(255, 255, 255, 0.3);
        }
      `}</style>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="winter-snowflake"
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            '--duration': `${particle.duration}s`,
            '--delay': `${particle.delay}s`,
            '--drift': `${particle.drift}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
});

WinterParticles.displayName = 'WinterParticles';

export default WinterParticles;