'use client';
import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Lenis from 'lenis';
import HeaderHome from '@/components/ui/HeaderHome';
import BenefitsSection from '@/components/home/BenefitsSection';
import RecommendedJobsSection from '@/components/home/RecommendedJobsSection';
import PopularJobCategoriesSection from '@/components/home/PopularJobCategoriesSection';
import Footer from '@/components/ui/Footer';
import Image from 'next/image';
import {
  fontClasses
} from '@/styles';
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

// Dynamically import classic particles only
const ClassicParticles = dynamic(() => import('@/components/animations/Particles'), {
  ssr: false,
  loading: () => null,
});

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const heroRef = useRef(null);
  const router = useRouter();
  const { theme, themeName } = useTheme();
  const { scrollYProgress } = useScroll();
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<(SpringParticle | SummerParticle | AutumnParticle | WinterParticle)[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  // Prefetch login and signup pages for instant navigation
  useEffect(() => {
    router.prefetch('/login');
    router.prefetch('/signup');
    router.prefetch('/findJobs');
  }, [router]);

  // Initialize Lenis smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Canvas animation for seasonal themes
  useEffect(() => {
    if (themeName === 'classic') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateCanvasSize();

    const particleCount = 80;
    const initParticles = () => {
      particlesRef.current = [];
      
      for (let i = 0; i < particleCount; i++) {
        let particle: SpringParticle | SummerParticle | AutumnParticle | WinterParticle;
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

    const animate = () => {
      const time = (Date.now() - startTimeRef.current) / 1000;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

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

    const handleResize = () => {
      updateCanvasSize();
      initParticles();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [themeName]);

  useEffect(() => {
    startTimeRef.current = Date.now();
  }, [themeName]);

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

  // Render appropriate particle animation based on theme
  const renderParticles = () => {
    if (themeName === 'classic') {
      return (
        <ClassicParticles
          particleColors={theme.banner.particleColors}
          particleCount={150}
          particleSpread={12}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={false}
          particleHoverFactor={0}
          alphaParticles={true}
          disableRotation={false}
          sizeRandomness={1.2}
          cameraDistance={25}
          pixelRatio={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1}
        />
      );
    }

    return (
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ width: '100%', height: '100%' }}
      />
    );
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `linear-gradient(to bottom right, ${theme.landing.bgGradientStart}, ${theme.landing.bgGradientMid}, ${theme.landing.bgGradientEnd})`
      }}
    >
      {/* Seasonal Particle Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {renderParticles()}
      </div>

      {/* Header Section */}
      <div className="relative z-20">
        <HeaderHome 
          onNavigateToSection={scrollToSection}
          onNavigateToFooter={scrollToFooter}
          isScrolled={isScrolled}
        />
      </div>

      {/* Hero Section */}
      <section 
        id="hero"
        ref={heroRef}
        className="min-h-screen flex items-center justify-center px-4 mobile-M:px-6 tablet:px-8 laptop:px-12 pt-16 mobile-M:pt-20 tablet:pt-24 pb-8 mobile-M:pb-10 tablet:pb-12 relative z-10"
      >
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 laptop:grid-cols-2 gap-8 mobile-M:gap-10 tablet:gap-12 laptop:gap-16 items-center">
            {/* Left side - Hero Text */}
            <motion.div
              className="space-y-4 mobile-M:space-y-5 tablet:space-y-6 laptop:space-y-8 text-center laptop:text-left"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.2,
                ease: [0.16, 1, 0.3, 1]
              }}
            >
              <motion.h1 
                className={`${fontClasses.heading} font-bold text-h2 mobile-M:text-h1 tablet:text-5xl laptop:text-6xl leading-tight`}
                style={{ color: theme.landing.headingPrimary }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.3,
                  ease: [0.16, 1, 0.3, 1]
                }}
              >
                Find Your Next{' '}
                <span 
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${theme.landing.headingGradientStart}, ${theme.landing.headingGradientMid}, ${theme.landing.headingGradientEnd})`
                  }}
                >
                  Opportunity
                </span>
              </motion.h1>

              <motion.p
                className={`${fontClasses.body} text-body mobile-M:text-lead tablet:text-xl leading-relaxed`}
                style={{ color: theme.landing.bodyText }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.5,
                  ease: [0.16, 1, 0.3, 1]
                }}
              >
                Connect with opportunities that matter. Whether you're seeking work or offering it, HanapBuhay makes finding the perfect match effortless and rewarding.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div 
                className="flex flex-col mobile-L:flex-row gap-3 mobile-M:gap-4 pt-2 mobile-M:pt-4 justify-center laptop:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.7,
                  ease: [0.16, 1, 0.3, 1]
                }}
              >
                <motion.button
                  onClick={() => router.push('/signup')}
                  className="px-6 mobile-M:px-8 py-2.5 mobile-M:py-3 tablet:py-3.5 text-small mobile-M:text-body font-semibold rounded-full transition-all duration-300 cursor-pointer"
                  style={{
                    backgroundColor: theme.landing.accentSecondary,
                    color: theme.landing.headingPrimary,
                    boxShadow: `0 4px 24px ${theme.landing.accentGlow}`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 8px 32px ${theme.landing.accentGlow}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = `0 4px 24px ${theme.landing.accentGlow}`;
                  }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get Started
                </motion.button>
                <motion.button
                  onClick={() => router.push('/login')}
                  className="px-6 mobile-M:px-8 py-2.5 mobile-M:py-3 tablet:py-3.5 border-2 text-small mobile-M:text-body font-semibold rounded-full transition-all duration-300 backdrop-blur-sm cursor-pointer"
                  style={{
                    borderColor: theme.landing.glassBorder,
                    color: theme.landing.headingPrimary,
                    backgroundColor: 'rgba(255, 255, 255, 0.05)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = theme.landing.glassHoverBorder;
                    e.currentTarget.style.backgroundColor = theme.landing.glassHoverBg;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = theme.landing.glassBorder;
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Sign In
                </motion.button>
              </motion.div>
            </motion.div>
            
            {/* Right side - Illustration */}
            <motion.div 
              className="relative hidden laptop:block"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.4,
                ease: [0.16, 1, 0.3, 1]
              }}
            >
              <div 
                className="rounded-2xl tablet:rounded-3xl p-6 tablet:p-8 relative overflow-hidden"
                style={{
                  background: theme.landing.glassBg,
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${theme.landing.glassBorder}`,
                  boxShadow: `0 8px 32px ${theme.landing.accentGlow}`
                }}
              >
                {/* Decorative gradient */}
                <div 
                  className="absolute inset-0 opacity-20"
                  style={{
                    background: `linear-gradient(135deg, ${theme.landing.sectionBg} 0%, ${theme.landing.sectionBgLight} 100%)`
                  }}
                />
                
                <div className="relative h-72 tablet:h-80 laptop:h-96 rounded-xl tablet:rounded-2xl overflow-hidden">
                  <Image
                    src="/image/home-image1.png"
                    alt="People connecting through HanapBuhay"
                    fill
                    style={{ objectFit: 'contain' }}
                    priority
                  />
                </div>
              </div>

              {/* Floating elements */}
              <motion.div
                className="absolute -top-4 -right-4 w-20 h-20 rounded-full blur-xl"
                style={{ backgroundColor: theme.landing.accentGlow }}
                animate={{
                  y: [0, -20, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full blur-xl"
                style={{ backgroundColor: theme.landing.iconBg }}
                animate={{
                  y: [0, 20, 0],
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Other Sections */}
      <div className="relative z-10">
        <BenefitsSection />
        <RecommendedJobsSection />
        <PopularJobCategoriesSection />
      </div>

      {/* Footer Section */}
      <Footer />
    </div>
  );
}