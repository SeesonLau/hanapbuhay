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
import EllipseBackground from '@/components/ui/EllipseBackground';
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
    <div className="min-h-screen relative" style={{ backgroundColor: '#141515' }}>
      {/* Ellipse Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <EllipseBackground />
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
        className="min-h-screen flex items-center justify-center px-4 py-12 pt-24 relative z-10"
        style={{ 
          y: heroY,
          opacity: heroOpacity
        }}
      >
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16 lg:gap-24">
          {/* Left side - Hero Text */}
          <motion.div 
            className="flex-1 text-white space-y-6 max-w-lg"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8, 
              delay: 0.2,
              ease: [0.16, 1, 0.3, 1]
            }}
          >
            <motion.h1 
              className={fontClasses.heading}
              style={{
                fontSize: TYPOGRAPHY.hero.fontSize,
                fontWeight: TYPOGRAPHY.hero.fontWeight,
                lineHeight: TYPOGRAPHY.hero.lineHeight
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
              className={`${fontClasses.body} text-gray-300`}
              style={{
                fontSize: TYPOGRAPHY.lead.fontSize,
                fontWeight: TYPOGRAPHY.lead.fontWeight,
                lineHeight: TYPOGRAPHY.lead.lineHeight
              }}
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
              className="flex flex-col sm:flex-row gap-4 mt-8"
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
              >
                <Link href="/signup">
                  <Button 
                    variant="primary"
                    size="lg"
                    useCustomHover={true}
                    fullRounded={true}
                    className="w-full sm:w-auto justify-center px-8 py-3 min-w-44 shadow-lg hover:shadow-xl transition-shadow"
                  >
                    Sign Up
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link href="/login">
                  <Button 
                    variant="ghost"
                    size="lg"
                    fullRounded={true}
                    className="w-full sm:w-auto justify-center px-8 py-3 min-w-44"
                    style={{
                      outlineColor: getBlueDarkColor('default'),
                      color: getBlueDarkColor('default'),
                      backgroundColor: 'transparent',
                      outline: '2px solid',
                      outlineOffset: '-2px'
                    }}
                    onMouseOver={(e) => {
                      if (!e.currentTarget.disabled) {
                        e.currentTarget.style.backgroundColor = '#1453E1';
                        e.currentTarget.style.color = 'white';
                        e.currentTarget.style.outlineColor = '#1453E1';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!e.currentTarget.disabled) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = getBlueDarkColor('default');
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
            className="flex-1 flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.8, 
              delay: 0.4,
              ease: [0.16, 1, 0.3, 1]
            }}
          >
            <motion.div 
              className="relative w-full max-w-xl h-[28rem] md:h-[32rem] lg:h-[36rem] rounded-lg overflow-hidden"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Image
                src="/image/home-image1.png"
                alt="People connecting through HanapBuhay"
                fill
                style={{ objectFit: 'contain' }}
                priority
                className="scale-125"
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Other Sections */}
      <motion.div 
        className="pt-16 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <BenefitsSection />
        <HowItWorksSection />
        <TestimonialsSection />
      </motion.div>

      {/* Footer Section */}
      <Footer />
    </div>
  );
}