// src/components/ui/EllipseBackground.tsx
'use client';
import { useEffect, useState } from 'react';

export default function EllipseBackground() {
  const [scrollPercentage, setScrollPercentage] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const percentage = (currentScroll / scrollHeight) * 100;
      setScrollPercentage(percentage);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // User-defined color palette
  const blue1 = '#2C67FF';
  const blue2 = '#57AEFF';
  const blue3 = '#4A46FF';
  const pink = '#FF4DED';

  const calculateStyle = (
    initialTop: number,
    initialLeft: number,
    size: number,
    color: string,
    scrollFactor: number
  ) => {
    const top = initialTop - scrollPercentage * scrollFactor;
    const opacity = 1 - Math.abs(50 - top) / 50; // Fades in and out
    const scale = 1 + (scrollPercentage / 100) * 0.2; // Gently scales up

    return {
      top: `${top}%`,
      left: `${initialLeft}%`,
      width: `${size}px`,
      height: `${size}px`,
      background: `radial-gradient(circle, ${color} 0%, transparent 60%)`,
      filter: 'blur(100px)',
      opacity: Math.max(0, opacity * 0.7),
      transform: `translate(-50%, -50%) scale(${scale})`,
      transition: 'top 0.5s ease-out, opacity 0.5s ease-out, transform 0.5s ease-out',
    };
  };

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-black">
      <div
        className="absolute rounded-full"
        style={calculateStyle(20, 25, 600, blue1, 1.5)}
      />
      <div
        className="absolute rounded-full"
        style={calculateStyle(80, 15, 500, blue2, 1.2)}
      />
      <div
        className="absolute rounded-full"
        style={calculateStyle(50, 75, 700, blue3, 1.8)}
      />
      <div
        className="absolute rounded-full"
        style={calculateStyle(110, 60, 550, pink, 1.0)}
      />
       <div
        className="absolute rounded-full"
        style={calculateStyle(10, 85, 450, blue1, 2.0)}
      />
    </div>
  );
}
