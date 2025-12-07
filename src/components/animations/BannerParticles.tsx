'use client';

import React, { memo, useMemo } from 'react';
import { useTheme } from '@/hooks/useTheme';

interface BannerParticlesProps {
  particleCount?: number;
  className?: string;
}

const BannerParticles: React.FC<BannerParticlesProps> = memo(({
  particleCount = 25,
  className = ''
}) => {
  const { theme, themeName } = useTheme();

  // Generate particles based on theme
  const particles = useMemo(() => {
    const colors = theme.banner?.particleColors || ['#60a5fa', '#93c5fd', '#ffffff'];
    
    return Array.from({ length: particleCount }, (_, i) => {
      const colorIndex = Math.floor(Math.random() * colors.length);
      
      // Theme-specific configurations
      let size, opacity, duration, delay, top;
      
      switch (themeName) {
        case 'spring':
          size = 4 + Math.random() * 6; // Larger petals
          opacity = 0.4 + Math.random() * 0.4;
          duration = 10 + Math.random() * 8; // Slow fall
          delay = Math.random() * 8;
          top = `${-10 - Math.random() * 20}%`; // Start above
          break;
          
        case 'summer':
          size = 3 + Math.random() * 5;
          opacity = 0.3 + Math.random() * 0.4;
          duration = 12 + Math.random() * 10; // Very slow rise
          delay = Math.random() * 10;
          top = `${100 + Math.random() * 20}%`; // Start below
          break;
          
        case 'autumn':
          size = 5 + Math.random() * 8; // Larger leaves
          opacity = 0.5 + Math.random() * 0.3;
          duration = 6 + Math.random() * 6; // Fast fall
          delay = Math.random() * 6;
          top = `${-10 - Math.random() * 20}%`; // Start above
          break;
          
        case 'winter':
          size = 2 + Math.random() * 5;
          opacity = 0.5 + Math.random() * 0.4;
          duration = 10 + Math.random() * 8; // Steady fall
          delay = Math.random() * 10;
          top = `${-10 - Math.random() * 20}%`; // Start above
          break;
          
        case 'classic':
        default:
          size = 2 + Math.random() * 4;
          opacity = 0.2 + Math.random() * 0.4;
          duration = 5 + Math.random() * 6;
          delay = Math.random() * 4;
          top = `${Math.random() * 100}%`; // Random position
          break;
      }

      return {
        id: i,
        left: `${Math.random() * 100}%`,
        top,
        size,
        opacity,
        duration,
        delay,
        color: colors[colorIndex],
        // Spring and Autumn specific
        swayAmount: 20 + Math.random() * 40,
        windStrength: 40 + Math.random() * 80,
        windDirection: Math.random() > 0.5 ? 1 : -1,
        // Summer specific
        floatAmount: 15 + Math.random() * 30,
        // Winter specific
        drift: -5 + Math.random() * 10,
        // Shape
        shape: themeName === 'autumn' || themeName === 'spring' 
          ? Math.random() > 0.5 ? 'ellipse' : 'circle'
          : themeName === 'winter' ? 'snowflake' : 'circle',
      };
    });
  }, [particleCount, theme.banner?.particleColors, themeName]);

  // Get animation styles based on theme
  const getAnimationKeyframes = () => {
    switch (themeName) {
      case 'spring':
        return `
          @keyframes springPetalFall {
            0% { 
              transform: translate3d(0, 0, 0) rotate(0deg);
              opacity: 0;
            }
            5% { opacity: 1; }
            95% { opacity: 1; }
            100% { 
              transform: translate3d(
                calc(var(--sway-amount) * sin(3.14159 * 4)), 
                120vh, 
                0
              ) rotate(180deg);
              opacity: 0;
            }
          }
        `;
        
      case 'summer':
        return `
          @keyframes summerPollenRise {
            0% { 
              transform: translate3d(0, 0, 0) scale(0.6);
              opacity: 0;
            }
            5% { opacity: 1; }
            50% {
              transform: translate3d(
                calc(var(--float-amount) * sin(3.14159 * 3)),
                -60vh,
                0
              ) scale(1);
            }
            95% { opacity: 1; }
            100% { 
              transform: translate3d(
                calc(var(--float-amount) * sin(3.14159 * 6)),
                -120vh,
                0
              ) scale(0.6);
              opacity: 0;
            }
          }
        `;
        
      case 'autumn':
        return `
          @keyframes autumnLeafFall {
            0% { 
              transform: translate3d(0, 0, 0) rotate(0deg);
              opacity: 0;
            }
            5% { opacity: 1; }
            25% {
              transform: translate3d(
                calc(var(--wind-strength) * var(--wind-direction) * 0.5),
                30vh,
                0
              ) rotate(90deg);
            }
            50% {
              transform: translate3d(
                calc(var(--wind-strength) * var(--wind-direction)),
                60vh,
                0
              ) rotate(180deg);
            }
            75% {
              transform: translate3d(
                calc(var(--wind-strength) * var(--wind-direction) * 1.2),
                90vh,
                0
              ) rotate(270deg);
            }
            95% { opacity: 1; }
            100% { 
              transform: translate3d(
                calc(var(--wind-strength) * var(--wind-direction) * 1.5),
                120vh,
                0
              ) rotate(360deg);
              opacity: 0;
            }
          }
        `;
        
      case 'winter':
        return `
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
        `;
        
      case 'classic':
      default:
        return `
          @keyframes classicFloat {
            0%, 100% { transform: translate3d(0, 0, 0); }
            50% { transform: translate3d(8px, -6px, 0); }
          }
        `;
    }
  };

  const getAnimationName = () => {
    switch (themeName) {
      case 'spring': return 'springPetalFall';
      case 'summer': return 'summerPollenRise';
      case 'autumn': return 'autumnLeafFall';
      case 'winter': return 'winterSnowfall';
      default: return 'classicFloat';
    }
  };

  const animationName = getAnimationName();

  return (
    <div 
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <style>{`
        ${getAnimationKeyframes()}
        
        .banner-particle {
          position: absolute;
          will-change: transform;
          contain: strict;
        }
        
        .banner-particle-circle {
          border-radius: 50%;
        }
        
        .banner-particle-ellipse {
          border-radius: 50% 30% 50% 30%;
        }
        
        .banner-particle-snowflake {
          border-radius: 50%;
          box-shadow: 0 0 3px rgba(255, 255, 255, 0.3);
        }
      `}</style>
      
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`banner-particle banner-particle-${particle.shape}`}
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            animation: `${animationName} ${particle.duration}s ${themeName === 'winter' ? 'linear' : 'ease-in-out'} ${particle.delay}s infinite`,
            // Spring variables
            '--sway-amount': `${particle.swayAmount}px`,
            // Summer variables
            '--float-amount': `${particle.floatAmount}px`,
            // Autumn variables
            '--wind-strength': `${particle.windStrength}px`,
            '--wind-direction': particle.windDirection,
            // Winter variables
            '--drift': `${particle.drift}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
});

BannerParticles.displayName = 'BannerParticles';

export default BannerParticles;