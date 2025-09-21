// src/components/ui/FloatingEllipse.tsx
'use client';
import { useEffect, useRef } from 'react';

interface FloatingEllipseProps {
  color: string;
  width: number;
  height: number;
  left: string;
  top: string;
  opacity: number;
  animationDelay?: string;
  animationDuration?: string;
  scrollEffect: number;
  roaming?: boolean;
  cluster?: boolean;
  isScrolling: boolean;
}

export default function FloatingEllipse({ 
  color, 
  width, 
  height, 
  left, 
  top, 
  opacity, 
  animationDelay = '0s',
  animationDuration = '15s',
  scrollEffect,
  roaming = false,
  cluster = false,
  isScrolling = false
}: FloatingEllipseProps) {
  const ellipseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ellipse = ellipseRef.current;
    if (!ellipse) return;

    // Set initial position
    ellipse.style.left = left;
    ellipse.style.top = top;
    
    // Random floating animation
    const moveEllipse = () => {
      if (roaming) {
        // Movement for roaming ellipses
        const x = (Math.random() * 15) - 7.5;
        const y = (Math.random() * 15) - 7.5;
        ellipse.style.transform = `translate(${x}px, ${y}px) scale(${1 - scrollEffect * 0.02})`;
      } else if (cluster) {
        // Very subtle movement for clustered ellipses
        const x = (Math.random() * 4) - 2;
        const y = (Math.random() * 4) - 2;
        ellipse.style.transform = `translate(${x}px, ${y}px) scale(${1 - scrollEffect * 0.02})`;
      }
    };

    // Initial movement
    moveEllipse();
    
    // Set up interval for continuous movement
    const interval = setInterval(moveEllipse, roaming ? 3000 : 5000);
    
    return () => clearInterval(interval);
  }, [scrollEffect, left, top, roaming, cluster]);

  return (
    <div
      ref={ellipseRef}
      className="absolute pointer-events-none transition-all duration-1000 ease-out"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        left,
        top,
        opacity,
        background: `radial-gradient(ellipse at center, ${color} 0%, transparent 70%)`,
        borderRadius: '50%',
        animation: `pulse ${animationDuration} ease-in-out ${animationDelay} infinite alternate`,
        zIndex: 0,
        filter: 'blur(20px)',
        transform: `scale(${1 - scrollEffect * 0.02})`,
        transition: isScrolling 
          ? 'left 0.8s cubic-bezier(0.33, 1, 0.68, 1), top 0.8s cubic-bezier(0.33, 1, 0.68, 1), transform 0.8s ease-out, opacity 0.8s ease-out' 
          : 'left 1.2s cubic-bezier(0.33, 1, 0.68, 1), top 1.2s cubic-bezier(0.33, 1, 0.68, 1), transform 1.2s ease-out, opacity 1.2s ease-out',
        mixBlendMode: 'screen',
      }}
    />
  );
}
