'use client';

import React, { memo, useMemo } from 'react';

interface BannerParticlesProps {
  particleCount?: number;
  className?: string;
}

// Memoized particle component to prevent unnecessary re-renders
const BannerParticles: React.FC<BannerParticlesProps> = memo(({
  particleCount = 30,
  className = ''
}) => {
  // Generate particles once and memoize - uses CSS transforms for GPU acceleration
  const particles = useMemo(() => {
    return Array.from({ length: particleCount }, (_, i) => {
      const isBlue = i % 3 === 0;
      return {
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: 2 + Math.random() * 3,
        opacity: 0.15 + Math.random() * 0.35,
        duration: 4 + Math.random() * 4,
        delay: Math.random() * 3,
        color: isBlue ? '#60a5fa' : '#ffffff',
      };
    });
  }, [particleCount]);

  return (
    <div 
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <style>{`
        @keyframes bannerFloat {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(8px, -6px, 0); }
        }
        .banner-particle {
          position: absolute;
          border-radius: 50%;
          will-change: transform;
          contain: strict;
        }
      `}</style>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="banner-particle"
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            animation: `bannerFloat ${particle.duration}s ease-in-out ${particle.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
});

BannerParticles.displayName = 'BannerParticles';

export default BannerParticles;
