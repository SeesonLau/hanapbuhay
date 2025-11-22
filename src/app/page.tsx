'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import HeaderHome from '@/components/ui/HeaderHome';
import BenefitsSection from '@/components/home/BenefitsSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import Footer from '@/components/ui/Footer';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { 
  getBlueDarkColor, 
  TYPOGRAPHY,
  fontClasses 
} from '@/styles';
import LiquidEther from '@/components/ui/LiquidEther';
import Link from 'next/link';

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 80;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const scrollToFooter = () => {
    const footer = document.querySelector('footer');
    if (footer) {
      const headerHeight = 80;
      const footerPosition = footer.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = footerPosition - headerHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen relative overflow-y-auto laptop:snap-y laptop:snap-proximity" style={{ backgroundColor: '#141515' }}>
      {/* Ellipse Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <LiquidEther
          colors={[ '#5227FF', '#FF9FFC', '#B19EEF' ]}
          mouseForce={20}
          cursorSize={100}
          isViscous={false}
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div>
      
      {/* Header Section */}
      <HeaderHome 
        onNavigateToSection={scrollToSection}
        onNavigateToFooter={scrollToFooter}
        isScrolled={isScrolled}
      />

      {/* Hero Section */}
      <motion.section 
        ref={heroRef}
        className="min-h-screen laptop:h-screen flex items-center justify-center px-4 mobile-M:px-6 tablet:px-8 laptop:px-24 py-12 pt-20 mobile-M:pt-24 tablet:pt-28 laptop:pt-30 relative z-10 laptop:snap-start laptop:snap-always"
        style={{ 
          y: heroY,
          opacity: heroOpacity
        }}
      >
        <div className="container mx-auto flex flex-col tablet:flex-row items-center justify-center gap-8 mobile-M:gap-10 tablet:gap-12 laptop:gap-14">
          {/* Left side - Hero Text */}
          <motion.div 
            className="flex-1 text-white space-y-4 mobile-M:space-y-5 tablet:space-y-6 max-w-full tablet:max-w-lg laptop:max-w-xl text-center tablet:text-left"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8, 
              delay: 0.2,
              ease: [0.16, 1, 0.3, 1]
            }}
          >
            <motion.h1 
              className={`${fontClasses.heading} font-alexandria font-bold text-h2  mobile-M:text-4xl mobile-L:text-[2.75rem] tablet:text-5xl laptop:text-[3.125rem] leading-tight`}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: 0.3,
                ease: [0.16, 1, 0.3, 1]
              }}
            >
              <motion.span 
                className="block"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.3,
                  ease: [0.16, 1, 0.3, 1]
                }}
              >
                Connecting People,
              </motion.span>
              <motion.span 
                className="block"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.5,
                  ease: [0.16, 1, 0.3, 1]
                }}
              >
                Creating Opportunities
              </motion.span>
            </motion.h1>
            <motion.p 
              className={`${fontClasses.body} font-alexandria font-normal text-gray-300 text-sm mobile-M:text-base mobile-L:text-lg tablet:text-xl laptop:text-[1.25rem] leading-relaxed`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: 0.7,
                ease: [0.16, 1, 0.3, 1]
              }}
            >
              HanapBuhay bridges people who need help with those who can offer it. Together, we make everyday life easier.
            </motion.p>
            <motion.div 
              className="flex flex-col mobile-L:flex-row gap-3 mobile-M:gap-4 mt-6 mobile-M:mt-8 justify-center tablet:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: 0.9,
                ease: [0.16, 1, 0.3, 1]
              }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="w-full mobile-L:w-auto"
              >
                <Link href="/signup" className="block">
                  <Button 
                    variant="primary"
                    size="lg"
                    useCustomHover={true}
                    fullRounded={true}
                    className="w-full mobile-L:w-auto justify-center px-6 mobile-M:px-8 py-2.5 mobile-M:py-3 min-w-full mobile-L:min-w-40 tablet:min-w-44 text-sm mobile-M:text-base shadow-lg hover:shadow-xl transition-shadow"
                  >
                    Sign Up
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="w-full mobile-L:w-auto"
              >
                <Link href="/login" className="block">
                  <Button 
                    variant="ghost"
                    size="lg"
                    fullRounded={true}
                    className="w-full mobile-L:w-auto justify-center px-6 mobile-M:px-8 py-2.5 mobile-M:py-3 min-w-full mobile-L:min-w-40 tablet:min-w-44 text-sm mobile-M:text-base transition-all duration-300"
                    style={{
                      outlineColor: getBlueDarkColor('default'),
                      color: getBlueDarkColor('default'),
                      backgroundColor: 'transparent',
                      outline: '2px solid',
                      outlineOffset: '-2px',
                      boxShadow: 'none'
                    }}
                    onMouseOver={(e) => {
                      if (!e.currentTarget.disabled) {
                        e.currentTarget.style.boxShadow = `0 0 20px ${getBlueDarkColor('default')}, 0 0 40px ${getBlueDarkColor('default')}40`;
                        e.currentTarget.style.outlineColor = getBlueDarkColor('hover');
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!e.currentTarget.disabled) {
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.outlineColor = getBlueDarkColor('default');
                      }
                    }}
                  >
                    Login
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
          
          {/* Right side - Image */}
          <motion.div 
            className="hidden laptop:flex flex-1 justify-center w-full tablet:w-auto"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.8, 
              delay: 0.4,
              ease: [0.16, 1, 0.3, 1]
            }}
          >
            <motion.div 
              className="relative w-full max-w-sm mobile-M:max-w-md mobile-L:max-w-lg tablet:max-w-xl laptop:max-w-2xl h-64 mobile-M:h-72 mobile-L:h-80 tablet:h-96 laptop:h-[28rem] rounded-lg overflow-hidden"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Image
                src="/image/home-image1.png"
                alt="People connecting through HanapBuhay"
                fill
                style={{ objectFit: 'contain' }}
                priority
                className="scale-110 mobile-M:scale-115 tablet:scale-125"
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Other Sections */}
      <div className="relative z-10">
        <BenefitsSection />
        <HowItWorksSection />
        <TestimonialsSection />
      </div>

      {/* Footer Section */}
      <Footer />
    </div>
  );
}