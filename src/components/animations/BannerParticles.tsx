'use client';

import React, { useRef, useEffect, memo, useMemo } from 'react';
import { useTheme } from '@/hooks/useTheme';
import {
  SpringParticle,
  createSpringParticle,
  updateSpringParticle,
  renderSpringParticle,
} from '@/components/animations/SpringAnimate';
import {
  SummerParticle,
  createSummerParticle,
  updateSummerParticle,
  renderSummerParticle,
} from '@/components/animations/SummerAnimate';
import {
  AutumnParticle,
  createAutumnParticle,
  updateAutumnParticle,
  renderAutumnParticle,
} from '@/components/animations/AutumnAnimate';
import {
  WinterParticle,
  createWinterParticle,
  updateWinterParticle,
  renderWinterParticle,
} from '@/components/animations/WinterAnimate';

interface BannerParticlesProps {
  particleCount?: number;
  className?: string;
}

type Particle = SpringParticle | SummerParticle | AutumnParticle | WinterParticle;

const BannerParticles: React.FC<BannerParticlesProps> = memo(({
  particleCount = 25,
  className = ''
}) => {
  const { theme, themeName } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  // Generate classic particles (DOM-based for classic theme only)
  const classicParticles = useMemo(() => {
    if (themeName !== 'classic') return [];
    
    const colors = theme.banner?.particleColors || ['#60a5fa', '#93c5fd', '#ffffff'];
    
    return Array.from({ length: particleCount }, (_, i) => {
      const colorIndex = Math.floor(Math.random() * colors.length);
      const size = 2 + Math.random() * 4;
      const opacity = 0.2 + Math.random() * 0.4;
      const duration = 5 + Math.random() * 6;
      const delay = Math.random() * 4;
      const top = `${Math.random() * 100}%`;

      return {
        id: i,
        left: `${Math.random() * 100}%`,
        top,
        size,
        opacity,
        duration,
        delay,
        color: colors[colorIndex],
      };
    });
  }, [particleCount, theme.banner?.particleColors, themeName]);

  useEffect(() => {
    // Skip canvas animation for classic theme
    if (themeName === 'classic') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Set canvas size
    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    updateCanvasSize();

    // Initialize particles based on theme
    const initParticles = () => {
      particlesRef.current = [];
      
      for (let i = 0; i < particleCount; i++) {
        let particle: Particle;
        switch (themeName) {
          case 'spring':
            particle = createSpringParticle(canvas.width, canvas.height);
            break;
          case 'summer':
            particle = createSummerParticle(canvas.width, canvas.height);
            break;
          case 'autumn':
            particle = createAutumnParticle(canvas.width, canvas.height);
            break;
          case 'winter':
            particle = createWinterParticle(canvas.width, canvas.height);
            break;
          default:
            return;
        }
        particlesRef.current.push(particle);
      }
    };
    initParticles();

    // Animation loop
    const animate = () => {
      const time = (Date.now() - startTimeRef.current) / 1000;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and render particles
      particlesRef.current.forEach((particle) => {
        switch (themeName) {
          case 'spring':
            updateSpringParticle(particle as SpringParticle, time, canvas.width, canvas.height);
            renderSpringParticle(ctx, particle as SpringParticle);
            break;
          case 'summer':
            updateSummerParticle(particle as SummerParticle, time, canvas.width, canvas.height);
            renderSummerParticle(ctx, particle as SummerParticle);
            break;
          case 'autumn':
            updateAutumnParticle(particle as AutumnParticle, time, canvas.width, canvas.height);
            renderAutumnParticle(ctx, particle as AutumnParticle);
            break;
          case 'winter':
            updateWinterParticle(particle as WinterParticle, time, canvas.width, canvas.height);
            renderWinterParticle(ctx, particle as WinterParticle);
            break;
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      updateCanvasSize();
      initParticles();
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [themeName, particleCount]);

  // Reinitialize when theme changes
  useEffect(() => {
    startTimeRef.current = Date.now();
  }, [themeName]);

  // Render classic theme with DOM particles
  if (themeName === 'classic') {
    return (
      <div 
        className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
        aria-hidden="true"
      >
        <style>{`
          @keyframes classicFloat {
            0%, 100% { transform: translate3d(0, 0, 0); }
            50% { transform: translate3d(8px, -6px, 0); }
          }
          
          .banner-particle {
            position: absolute;
            will-change: transform;
            contain: strict;
            border-radius: 50%;
          }
        `}</style>
        
        {classicParticles.map((particle) => (
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
              animation: `classicFloat ${particle.duration}s ease-in-out ${particle.delay}s infinite`,
            }}
          />
        ))}
      </div>
    );
  }

  // Render canvas for seasonal themes
  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      aria-hidden="true"
      style={{ width: '100%', height: '100%' }}
    />
  );
});

BannerParticles.displayName = 'BannerParticles';

export default BannerParticles;