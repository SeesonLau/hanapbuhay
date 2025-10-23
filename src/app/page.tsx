'use client';
import { useState, useEffect } from 'react';
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

  const renderLeftContent = () => {
    switch (authView) {
      case 'signup':
        return (
          <div className="flex-1 max-w-lg">
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <div className="flex items-center mb-6">
                <button 
                  onClick={handleBackToHome}
                  className="mr-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Back to home"
                >
                  <FiArrowLeft size={24} className="text-gray-700" />
                </button>
                <h2 
                  className="text-2xl font-bold text-gray-800"
                >
                  Create Account
                </h2>
              </div>
              <SignupForm />
            </div>
          </div>
        );
      
      case 'login':
        return (
          <div className="flex-1 max-w-lg">
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <div className="flex items-center mb-6">
                <button 
                  onClick={handleBackToHome}
                  className="mr-2 p-1 rounded-full hover:bg-primary-500 text-gray-neutral50 transition-colors"
                  aria-label="Back to home"
                >
                  <FiArrowLeft size={24} className="text-gray-700" />
                </button>
                <h2 
                  className="text-2xl font-bold text-gray-800"
                >
                  Login
                </h2>
              </div>
              <LoginForm onForgotPassword={() => setAuthView('forgot-password')} />
            </div>
          </div>
        );
      
      case 'forgot-password':
        return (
          <div className="flex-1 max-w-lg">
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <div className="flex items-center mb-6">
                <button 
                  onClick={() => setAuthView('login')}
                  className="mr-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Back to login"
                >
                  <FiArrowLeft size={24} className="text-gray-700" />
                </button>
                <h2 
                  className="text-2xl font-bold text-gray-800"
                >
                  Reset Password
                </h2>
              </div>
              <ForgotPasswordForm onBackToLogin={() => setAuthView('login')} />
            </div>
          </div>
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
                    e.currentTarget.style.backgroundColor = getBlueDarkColor('default');
                  }
                }}
                onMouseOut={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = 'transparent';
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
      <section className="min-h-screen flex items-center justify-center px-4 py-12 pt-24 relative z-10">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16 lg:gap-24">
          {/* Left side - Dynamic content based on authView */}
          {renderLeftContent()}
          
          {/* Right side - Image - Made larger */}
          <div className="flex-1 flex justify-center">
            <div className="relative w-full max-w-xl h-[28rem] md:h-[32rem] lg:h-[36rem] rounded-lg overflow-hidden">
              <Image
                src="/image/home-image1.png"
                alt="People connecting through HanapBuhay"
                fill
                style={{ objectFit: 'contain' }}
                priority
                className="scale-125"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Other Sections - Only show when in default view */}
      {authView === 'default' && (
        <div className="pt-16 relative z-10">
          <BenefitsSection />
          <HowItWorksSection />
          <TestimonialsSection />
        </div>
      )}

      {/* Footer Section - Added at the bottom */}
      <Footer />
    </div>
  );
}
