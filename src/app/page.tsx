'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';
import HeaderHome from '@/components/ui/HeaderHome';
import BenefitsSection from '@/components/home/BenefitsSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import Footer from '@/components/ui/Footer';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { 
  getBlueDarkColor, 
  getGrayColor,
  TYPOGRAPHY,
  fontClasses 
} from '@/styles';
import EllipseBackground from '@/components/ui/EllipseBackground';
import { SignupForm } from '@/components/auth/SignupForm';
import { LoginForm } from '@/components/auth/LoginForm';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

type AuthView = 'default' | 'signup' | 'login' | 'forgot-password';

export default function HomePage() {
  const [authView, setAuthView] = useState<AuthView>('default');
  const [isScrolled, setIsScrolled] = useState(false);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  
  // Parallax effects
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBackToHome = () => {
    setAuthView('default');
  };

  const scrollToSection = (sectionId: string) => {
    if (authView !== 'default') {
      setAuthView('default');
      
      // Wait for the next render cycle to ensure the section is visible
      setTimeout(() => {
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
      }, 100);
    } else {
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
    }
  };

  const scrollToFooter = () => {
    if (authView !== 'default') {
      setAuthView('default');
      
      // Wait for the next render cycle to ensure the footer is visible
      setTimeout(() => {
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
      }, 100);
    } else {
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
    }
  };

  const renderAuthContent = () => {
    const formVariants = {
      hidden: { 
        opacity: 0, 
        x: authView === 'signup' ? -50 : 50,
        scale: 0.95
      },
      visible: { 
        opacity: 1, 
        x: 0,
        scale: 1,
        transition: {
          duration: 0.5,
          ease: [0.16, 1, 0.3, 1] as [number, number, number, number]
        }
      },
      exit: { 
        opacity: 0, 
        x: authView === 'signup' ? 50 : -50,
        scale: 0.95,
        transition: {
          duration: 0.3,
          ease: [0.16, 1, 0.3, 1] as [number, number, number, number]
        }
      }
    };

    const illustrationVariants = {
      hidden: { 
        opacity: 0, 
        x: authView === 'signup' ? 50 : -50,
        scale: 0.9
      },
      visible: { 
        opacity: 1, 
        x: 0,
        scale: 1,
        transition: {
          duration: 0.6,
          ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
          delay: 0.1
        }
      },
      exit: { 
        opacity: 0, 
        x: authView === 'signup' ? -50 : 50,
        scale: 0.9,
        transition: {
          duration: 0.3,
          ease: [0.16, 1, 0.3, 1] as [number, number, number, number]
        }
      }
    };

    switch (authView) {
      case 'signup':
        return (
          <>
            {/* Left side - Signup Form */}
            <motion.div 
              key="signup-form"
              className="flex-1 flex items-center justify-center"
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="w-full max-w-md bg-white rounded-2xl px-8 py-3 shadow-xl">
                <SignupForm 
                  onBackClick={handleBackToHome}
                  onSignInClick={() => setAuthView('login')}
                />
              </div>
            </motion.div>
            
            {/* Right side - Signup Illustration */}
            <motion.div 
              key="signup-illustration"
              className="flex-1 flex items-center justify-center bg-transparent"
              variants={illustrationVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="relative w-full max-w-lg h-[32rem] flex items-center justify-center">
                <Image
                  src="/image/signup-illustration.svg"
                  alt="Sign up illustration"
                  width={500}
                  height={500}
                  priority
                  className="object-contain"
                />
              </div>
            </motion.div>
          </>
        );
      
      case 'login':
      case 'forgot-password':
        return (
          <>
            {/* Left side - Login Illustration */}
            <motion.div 
              key="login-illustration"
              className="flex-1 flex items-center justify-center bg-transparent"
              variants={illustrationVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="relative w-full max-w-lg h-[32rem] flex items-center justify-center">
                <Image
                  src="/image/login-illustration.svg"
                  alt="Login illustration"
                  width={500}
                  height={500}
                  priority
                  className="object-contain"
                />
              </div>
            </motion.div>

            {/* Right side - Login/Forgot Password Form */}
            <motion.div 
              key={authView} // Use authView as key to animate between login and forgot-password
              className="flex-1 flex items-center justify-center"
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-xl">
                <AnimatePresence mode="wait">
                  {authView === 'login' ? (
                    <motion.div
                      key="login-form"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <LoginForm 
                        onForgotPassword={() => setAuthView('forgot-password')}
                        onBackClick={handleBackToHome}
                        onSignUpClick={() => setAuthView('signup')}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="forgot-password-form"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ForgotPasswordForm onBackToLogin={() => setAuthView('login')} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        );
      
      default:
        return (
          <div className="flex-1 text-white space-y-6 max-w-lg">
            <h1 
              className={fontClasses.heading}
              style={{
                fontSize: TYPOGRAPHY.hero.fontSize,
                fontWeight: TYPOGRAPHY.hero.fontWeight,
                lineHeight: TYPOGRAPHY.hero.lineHeight
              }}
            >
              <span className="block">Connecting People,</span>
              <span className="block">Creating Opportunities</span>
            </h1>
            <p 
              className={`${fontClasses.body} text-gray-300`}
              style={{
                fontSize: TYPOGRAPHY.lead.fontSize,
                fontWeight: TYPOGRAPHY.lead.fontWeight,
                lineHeight: TYPOGRAPHY.lead.lineHeight
              }}
            >
              HanapBuhay bridges people who need help with those who can offer it. Together, we make everyday life easier.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button 
                onClick={() => setAuthView('signup')}
                variant="primary"
                size="lg"
                useCustomHover={true}
                fullRounded={true}
                className="w-full sm:w-auto justify-center px-8 py-3 min-w-44"
              >
                Sign Up
              </Button>
              <Button 
                onClick={() => setAuthView('login')}
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
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#141515' }}>
      {/* Ellipse Background that spans the entire page */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <EllipseBackground />
      </div>
      
      {/* Header Section */}
      <HeaderHome 
        onNavigateToSection={scrollToSection}
        onNavigateToFooter={scrollToFooter}
        isScrolled={isScrolled}
      />

      {/* Hero Section with Text and Image */}
      <motion.section 
        ref={heroRef}
        className="min-h-screen flex items-center justify-center px-4 py-12 pt-24 relative z-10"
        style={{ 
          y: authView === 'default' ? heroY : 0,
          opacity: authView === 'default' ? heroOpacity : 1
        }}
      >
        <AnimatePresence mode="wait">
          {authView === 'default' ? (
            <motion.div 
              key="landing-page"
              className="container mx-auto flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16 lg:gap-24"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ 
                duration: 0.6, 
                ease: [0.16, 1, 0.3, 1] as [number, number, number, number]
              }}
            >
              {/* Left side - Hero Text */}
              <motion.div 
                className="flex-1 text-white space-y-6 max-w-lg"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.2,
                  ease: [0.16, 1, 0.3, 1] as [number, number, number, number]
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
                      ease: [0.16, 1, 0.3, 1] as [number, number, number, number]
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
                      ease: [0.16, 1, 0.3, 1] as [number, number, number, number]
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
                    ease: [0.16, 1, 0.3, 1] as [number, number, number, number]
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
                    ease: [0.16, 1, 0.3, 1] as [number, number, number, number]
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Button 
                      onClick={() => setAuthView('signup')}
                      variant="primary"
                      size="lg"
                      useCustomHover={true}
                      fullRounded={true}
                      className="w-full sm:w-auto justify-center px-8 py-3 min-w-44 shadow-lg hover:shadow-xl transition-shadow"
                    >
                      Sign Up
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Button 
                      onClick={() => setAuthView('login')}
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
                  ease: [0.16, 1, 0.3, 1] as [number, number, number, number]
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
            </motion.div>
          ) : (
            <motion.div 
              key="auth-view"
              className="w-full mt-4 max-w-7xl mx-auto flex flex-col md:flex-row min-h-[600px] bg-transparent rounded-3xl shadow-2xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ 
                duration: 0.5, 
                ease: [0.16, 1, 0.3, 1] as [number, number, number, number]
              }}
            >
              {renderAuthContent()}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      {/* Other Sections - Only show when in default view */}
      {authView === 'default' && (
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
      )}

      {/* Footer Section - Added at the bottom */}
      <Footer />
    </div>
  );
}
