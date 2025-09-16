// src/components/ui/EllipseBackground.tsx
'use client';
import { useEffect, useState } from 'react';
import FloatingEllipse from './FloatingEllipse';

export default function EllipseBackground() {
  const [activeSection, setActiveSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [pastHowItWorks, setPastHowItWorks] = useState(false);
  const [ellipsePositions, setEllipsePositions] = useState<Array<{left: string, top: string}>>([]);

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    let animationFrameId: number;
    
    const handleScroll = () => {
      setIsScrolling(true);
      
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      
      animationFrameId = requestAnimationFrame(() => {
        const sections = document.querySelectorAll('section');
        const scrollPosition = window.scrollY + 100;
        
        let currentSection = 0;
        let progress = 0;
        
        sections.forEach((section, index) => {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;
          
          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = index;
            progress = (scrollPosition - sectionTop) / sectionHeight;
          }
        });
        
        setActiveSection(currentSection);
        setScrollProgress(progress);
        
        // Check if we've scrolled past the how-it-works section (index 2)
        const howItWorksSection = sections[2];
        if (howItWorksSection) {
          const howItWorksBottom = howItWorksSection.offsetTop + howItWorksSection.offsetHeight;
          setPastHowItWorks(scrollPosition > howItWorksBottom);
        }
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          setIsScrolling(false);
        }, 300);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Pre-calculate random positions for when ellipses break apart
  useEffect(() => {
    if (pastHowItWorks && ellipsePositions.length === 0) {
      const positions = [];
      const numEllipses = 24; // Total number of ellipses we have
      
      for (let i = 0; i < numEllipses; i++) {
        // Generate random positions across the screen
        const randomX = Math.random() * 80 + 10; // 10% to 90%
        const randomY = Math.random() * 80 + 10; // 10% to 90%
        positions.push({ left: `${randomX}%`, top: `${randomY}%` });
      }
      
      setEllipsePositions(positions);
    }
  }, [pastHowItWorks, ellipsePositions.length]);

  // Calculate positions based on active section and scroll progress
  const getEllipsePosition = (baseLeft: number, baseTop: number, targetSection: number, index: number) => {
    // If we're past how-it-works section, use pre-calculated random positions
    if (pastHowItWorks && ellipsePositions.length > index) {
      return ellipsePositions[index];
    }
    
    // Define positions for each section
    const sectionPositions = [
      // Hero section (0) - Start further to the left
      { x: baseLeft - 35, y: baseTop + 5 },
      // Benefits section (1) - Move to default position (also moved left)
      { x: baseLeft - 20, y: baseTop },
      // How it works section (2)
      { x: baseLeft - 65, y: baseTop + 5 },
      // Testimonials section (3)
      { x: baseLeft, y: baseTop + 20 }
    ];
    
    // Get current and next section positions
    const currentSectionIndex = activeSection;
    const nextSectionIndex = Math.min(activeSection + 1, sectionPositions.length - 1);
    
    const currentPos = sectionPositions[currentSectionIndex];
    const nextPos = sectionPositions[nextSectionIndex];
    
    // Interpolate between current and next position based on scroll progress
    const interpolatedX = currentPos.x + (nextPos.x - currentPos.x) * scrollProgress;
    const interpolatedY = currentPos.y + (nextPos.y - currentPos.y) * scrollProgress;
    
    return {
      left: `${interpolatedX}%`,
      top: `${interpolatedY}%`
    };
  };

  // Strictly use only the specified colors
  const blue1 = '#2C67FF'; 
  const blue2 = '#57AEFF'; 
  const blue3 = '#4A46FF';
  const pink = '#FF4DED';

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Main cluster for hero section - Start slightly left and move to default */}
      <FloatingEllipse 
        color={blue1} 
        width={800} 
        height={800} 
        {...getEllipsePosition(70, 30, activeSection, 0)}
        opacity={0.15} 
        animationDelay="0s"
        animationDuration="25s"
        scrollEffect={activeSection}
        isScrolling={isScrolling}
        cluster={!pastHowItWorks}
        roaming={pastHowItWorks}
      />
      <FloatingEllipse 
        color={blue2} 
        width={700} 
        height={700} 
        {...getEllipsePosition(75, 35, activeSection, 1)}
        opacity={0.12} 
        animationDelay="3s"
        animationDuration="30s"
        scrollEffect={activeSection}
        isScrolling={isScrolling}
        cluster={!pastHowItWorks}
        roaming={pastHowItWorks}
      />
      <FloatingEllipse 
        color={blue3} 
        width={650} 
        height={650} 
        {...getEllipsePosition(80, 40, activeSection, 2)}
        opacity={0.1} 
        animationDelay="6s"
        animationDuration="28s"
        scrollEffect={activeSection}
        isScrolling={isScrolling}
        cluster={!pastHowItWorks}
        roaming={pastHowItWorks}
      />
      <FloatingEllipse 
        color={pink} 
        width={600} 
        height={600} 
        {...getEllipsePosition(65, 25, activeSection, 3)}
        opacity={0.08} 
        animationDelay="9s"
        animationDuration="22s"
        scrollEffect={activeSection}
        isScrolling={isScrolling}
        cluster={!pastHowItWorks}
        roaming={pastHowItWorks}
      />
      
      {/* Additional large ellipses for bigger cluster */}
      <FloatingEllipse 
        color={blue1} 
        width={550} 
        height={550} 
        {...getEllipsePosition(60, 20, activeSection, 4)}
        opacity={0.07} 
        animationDelay="12s"
        animationDuration="26s"
        scrollEffect={activeSection}
        isScrolling={isScrolling}
        cluster={!pastHowItWorks}
        roaming={pastHowItWorks}
      />
      <FloatingEllipse 
        color={blue2} 
        width={500} 
        height={500} 
        {...getEllipsePosition(85, 45, activeSection, 5)}
        opacity={0.06} 
        animationDelay="15s"
        animationDuration="24s"
        scrollEffect={activeSection}
        isScrolling={isScrolling}
        cluster={!pastHowItWorks}
        roaming={pastHowItWorks}
      />
      
      {/* Medium surrounding ellipses */}
      <FloatingEllipse 
        color={blue1} 
        width={400} 
        height={400} 
        {...getEllipsePosition(60, 20, activeSection, 6)}
        opacity={0.08} 
        animationDelay="2s"
        animationDuration="20s"
        scrollEffect={activeSection}
        isScrolling={isScrolling}
        roaming={true}
      />
      <FloatingEllipse 
        color={blue2} 
        width={380} 
        height={380} 
        {...getEllipsePosition(85, 25, activeSection, 7)}
        opacity={0.08} 
        animationDelay="4s"
        animationDuration="26s"
        scrollEffect={activeSection}
        isScrolling={isScrolling}
        roaming={true}
      />
      <FloatingEllipse 
        color={blue3} 
        width={420} 
        height={420} 
        {...getEllipsePosition(70, 45, activeSection, 8)}
        opacity={0.07} 
        animationDelay="6s"
        animationDuration="24s"
        scrollEffect={activeSection}
        isScrolling={isScrolling}
        roaming={true}
      />
      <FloatingEllipse 
        color={pink} 
        width={360} 
        height={360} 
        {...getEllipsePosition(75, 50, activeSection, 9)}
        opacity={0.07} 
        animationDelay="8s"
        animationDuration="22s"
        scrollEffect={activeSection}
        isScrolling={isScrolling}
        roaming={true}
      />
      
      {/* Additional medium ellipses */}
      <FloatingEllipse 
        color={blue1} 
        width={320} 
        height={320} 
        {...getEllipsePosition(55, 35, activeSection, 10)}
        opacity={0.06} 
        animationDelay="10s"
        animationDuration="18s"
        scrollEffect={activeSection}
        isScrolling={isScrolling}
        roaming={true}
      />
      <FloatingEllipse 
        color={blue2} 
        width={300} 
        height={300} 
        {...getEllipsePosition(90, 40, activeSection, 11)}
        opacity={0.06} 
        animationDelay="12s"
        animationDuration="20s"
        scrollEffect={activeSection}
        isScrolling={isScrolling}
        roaming={true}
      />
      
      {/* Small surrounding ellipses */}
      <FloatingEllipse 
        color={blue1} 
        width={280} 
        height={280} 
        {...getEllipsePosition(65, 15, activeSection, 12)}
        opacity={0.06} 
        animationDelay="1s"
        animationDuration="18s"
        scrollEffect={activeSection}
        isScrolling={isScrolling}
        roaming={true}
      />
      <FloatingEllipse 
        color={blue2} 
        width={250} 
        height={250} 
        {...getEllipsePosition(85, 15, activeSection, 13)}
        opacity={0.06} 
        animationDelay="3s"
        animationDuration="20s"
        scrollEffect={activeSection}
        isScrolling={isScrolling}
        roaming={true}
      />
      <FloatingEllipse 
        color={blue3} 
        width={220} 
        height={220} 
        {...getEllipsePosition(60, 50, activeSection, 14)}
        opacity={0.05} 
        animationDelay="5s"
        animationDuration="22s"
        scrollEffect={activeSection}
        isScrolling={isScrolling}
        roaming={true}
      />
      <FloatingEllipse 
        color={pink} 
        width={200} 
        height={200} 
        {...getEllipsePosition(90, 55, activeSection, 15)}
        opacity={0.05} 
        animationDelay="7s"
        animationDuration="24s"
        scrollEffect={activeSection}
        isScrolling={isScrolling}
        roaming={true}
      />
      
      {/* Additional small ellipses for more depth */}
      <FloatingEllipse 
        color={blue1} 
        width={230} 
        height={230} 
        {...getEllipsePosition(55, 30, activeSection, 16)}
        opacity={0.04} 
        animationDelay="9s"
        animationDuration="19s"
        scrollEffect={activeSection}
        isScrolling={isScrolling}
        roaming={true}
      />
      <FloatingEllipse 
        color={blue2} 
        width={210} 
        height={210} 
        {...getEllipsePosition(90, 35, activeSection, 17)}
        opacity={0.04} 
        animationDelay="11s"
        animationDuration="21s"
        scrollEffect={activeSection}
        isScrolling={isScrolling}
        roaming={true}
      />
      <FloatingEllipse 
        color={blue3} 
        width={190} 
        height={190} 
        {...getEllipsePosition(50, 45, activeSection, 18)}
        opacity={0.03} 
        animationDelay="13s"
        animationDuration="23s"
        scrollEffect={activeSection}
        isScrolling={isScrolling}
        roaming={true}
      />
      <FloatingEllipse 
        color={pink} 
        width={180} 
        height={180} 
        {...getEllipsePosition(95, 40, activeSection, 19)}
        opacity={0.03} 
        animationDelay="15s"
        animationDuration="25s"
        scrollEffect={activeSection}
        isScrolling={isScrolling}
        roaming={true}
      />
      
      {/* Extra small ellipses */}
      <FloatingEllipse 
        color={blue1} 
        width={150} 
        height={150} 
        {...getEllipsePosition(40, 25, activeSection, 20)}
        opacity={0.02} 
        animationDelay="17s"
        animationDuration="17s"
        scrollEffect={activeSection}
        isScrolling={isScrolling}
        roaming={true}
      />
      <FloatingEllipse 
        color={blue2} 
        width={130} 
        height={130} 
        {...getEllipsePosition(95, 20, activeSection, 21)}
        opacity={0.02} 
        animationDelay="19s"
        animationDuration="19s"
        scrollEffect={activeSection}
        isScrolling={isScrolling}
        roaming={true}
      />
      <FloatingEllipse 
        color={blue3} 
        width={120} 
        height={120} 
        {...getEllipsePosition(35, 40, activeSection, 22)}
        opacity={0.02} 
        animationDelay="21s"
        animationDuration="21s"
        scrollEffect={activeSection}
        isScrolling={isScrolling}
        roaming={true}
      />
      <FloatingEllipse 
        color={pink} 
        width={100} 
        height={100} 
        {...getEllipsePosition(100, 45, activeSection, 23)}
        opacity={0.02} 
        animationDelay="23s"
        animationDuration="23s"
        scrollEffect={activeSection}
        isScrolling={isScrolling}
        roaming={true}
      />
    </div>
  );
}
