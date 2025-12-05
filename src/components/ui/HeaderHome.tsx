'use client';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { getWhiteColor, TYPOGRAPHY, fontClasses } from '@/styles';
import { useEffect, useState } from 'react';
import { ROUTES } from '@/lib/constants';

interface HeaderHomeProps {
  onNavigateToSection: (sectionId: string) => void;
  onNavigateToFooter: () => void;
  isScrolled?: boolean;
}

export default function HeaderHome({ 
  onNavigateToSection, 
  onNavigateToFooter, 
  isScrolled = false 
}: HeaderHomeProps) {
  const whiteWithOpacity = getWhiteColor(0.15);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isHomePage = pathname === '/';

  const handleLogoClick = () => {
    if (isHomePage) {
      // On homepage, scroll to top
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      // On other pages, navigate to homepage
      router.push(ROUTES.HOME);
    }
  };

  useEffect(() => {
    const controlHeader = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;
        
        // Only apply scroll behavior on homepage
        if (isHomePage) {
          // Check if at top of page
          setIsAtTop(currentScrollY < 50);
          
          // Show header when scrolling up, hide when scrolling down
          if (currentScrollY > lastScrollY && currentScrollY > 100) {
            setIsVisible(false); // Scrolling down
            setIsMobileMenuOpen(false); // Close mobile menu when scrolling down
          } else {
            setIsVisible(true); // Scrolling up or at top
          }
        } else {
          // On other pages, always show header
          setIsVisible(true);
          setIsAtTop(true);
        }
        
        setLastScrollY(currentScrollY);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlHeader);
      
      return () => {
        window.removeEventListener('scroll', controlHeader);
      };
    }
  }, [lastScrollY, isHomePage]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobileMenuOpen) {
        const target = event.target as Element;
        if (!target.closest('.mobile-menu-container') && !target.closest('.mobile-menu-button')) {
          setIsMobileMenuOpen(false);
        }
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isMobileMenuOpen]);

  return (
    <header 
      className={`w-full px-4 sm:px-6 md:px-8 lg:px-12 py-2 sm:py-3 flex items-center justify-between fixed top-2 sm:top-4 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        isVisible 
          ? 'translate-y-0 opacity-100' 
          : '-translate-y-full opacity-0 pointer-events-none'
      }`}
      style={{ 
        // Add a subtle scale effect when at top (only on homepage)
        transform: isAtTop && isHomePage
          ? `scale(1)` 
          : `scale(0.98)`,
        transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease-out'
      }}
    >
      {/* Logo - Clickable to home or scroll to top */}
      <div className="flex-shrink-0">
        <button 
          onClick={handleLogoClick}
          className="cursor-pointer transition-transform duration-300 hover:scale-105"
        >
          <Image
            className="w-32 h-10 sm:w-40 sm:h-12 md:w-44 md:h-14 lg:w-48 lg:h-16"
            src="/image/hanapbuhay-logo.svg"
            alt="HanapBuhat Logo"
            width={187}
            height={68}
            priority
          />
        </button>
      </div>

      {/* Desktop Navigation - Centered */}
      <nav className="hidden laptop:flex items-center gap-6 lg:gap-8 xl:gap-12 absolute left-1/2 transform -translate-x-1/2">
        {/* Benefits */}
        <button
          onClick={() => onNavigateToSection('benefits')}
          className="flex justify-center items-center cursor-pointer transition-all duration-300 hover:scale-105"
        >
          <div 
            className="text-center text-neutral-200 hover:text-blue-default px-2 py-2 text-sm tablet:text-base whitespace-nowrap transition-colors duration-300"
            style={{
              fontSize: TYPOGRAPHY.body.fontSize,
              fontWeight: TYPOGRAPHY.body.fontWeight,
              lineHeight: TYPOGRAPHY.body.lineHeight,
              fontFamily: TYPOGRAPHY.body.fontFamily
            }}
          >
            Benefits
          </div>
        </button>

        {/* Recommendations */}
        <button
          onClick={() => onNavigateToSection('recommended-jobs')}
          className="flex justify-center items-center cursor-pointer transition-all duration-300 hover:scale-105"
        >
          <div 
            className="text-center text-neutral-200 hover:text-blue-default px-2 py-2 text-sm tablet:text-base whitespace-nowrap transition-colors duration-300"
            style={{
              fontSize: TYPOGRAPHY.body.fontSize,
              fontWeight: TYPOGRAPHY.body.fontWeight,
              lineHeight: TYPOGRAPHY.body.lineHeight,
              fontFamily: TYPOGRAPHY.body.fontFamily
            }}
          >
            Recommendations
          </div>
        </button>

        {/* Popular */}
        <button
          onClick={() => onNavigateToSection('popular-categories')}
          className="flex justify-center items-center cursor-pointer transition-all duration-300 hover:scale-105"
        >
          <div 
            className="text-center text-neutral-200 hover:text-blue-default px-2 py-2 text-sm tablet:text-base whitespace-nowrap transition-colors duration-300"
            style={{
              fontSize: TYPOGRAPHY.body.fontSize,
              fontWeight: TYPOGRAPHY.body.fontWeight,
              lineHeight: TYPOGRAPHY.body.lineHeight,
              fontFamily: TYPOGRAPHY.body.fontFamily
            }}
          >
            Popular
          </div>
        </button>

        {/* Contact Us */}
        <button
          onClick={onNavigateToFooter}
          className="flex justify-center items-center cursor-pointer transition-all duration-300 hover:scale-105"
        >
          <div 
            className="text-center text-neutral-200 hover:text-blue-default px-2 py-2 text-sm tablet:text-base whitespace-nowrap transition-colors duration-300"
            style={{
              fontSize: TYPOGRAPHY.body.fontSize,
              fontWeight: TYPOGRAPHY.body.fontWeight,
              lineHeight: TYPOGRAPHY.body.lineHeight,
              fontFamily: TYPOGRAPHY.body.fontFamily
            }}
          >
            Contact Us
          </div>
        </button>
      </nav>

      {/* Mobile Menu Button */}
      <div className="flex-shrink-0">
        <button
          className="mobile-menu-button laptop:hidden flex flex-col items-center justify-center w-8 h-8 space-y-1.5 cursor-pointer"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
        <span 
          className={`w-6 h-0.5 bg-neutral-200 transition-all duration-300 ${
            isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
          }`}
        />
        <span 
          className={`w-6 h-0.5 bg-neutral-200 transition-all duration-300 ${
            isMobileMenuOpen ? 'opacity-0' : ''
          }`}
        />
        <span 
          className={`w-6 h-0.5 bg-neutral-200 transition-all duration-300 ${
            isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
          }`}
        />
      </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-menu-container laptop:hidden absolute top-full right-4 mt-2 rounded-xl bg-gray-900 bg-opacity-95 min-w-48"
        >
          <nav className="flex flex-col space-y-2 p-4">
            <button
              onClick={() => {
                onNavigateToSection('benefits');
                setIsMobileMenuOpen(false);
              }}
              className="text-left text-neutral-200 py-3 px-2 hover:bg-blue-default hover:text-white rounded-lg transition-all duration-300"
              style={{
                fontSize: TYPOGRAPHY.body.fontSize,
                fontWeight: TYPOGRAPHY.body.fontWeight,
                lineHeight: TYPOGRAPHY.body.lineHeight,
                fontFamily: TYPOGRAPHY.body.fontFamily
              }}
            >
              Benefits
            </button>
            <button
              onClick={() => {
                onNavigateToSection('recommended-jobs');
                setIsMobileMenuOpen(false);
              }}
              className="text-left text-neutral-200 py-3 px-2 hover:bg-blue-default hover:text-white rounded-lg transition-all duration-300"
              style={{
                fontSize: TYPOGRAPHY.body.fontSize,
                fontWeight: TYPOGRAPHY.body.fontWeight,
                lineHeight: TYPOGRAPHY.body.lineHeight,
                fontFamily: TYPOGRAPHY.body.fontFamily
              }}
            >
              Recommendations
            </button>
            <button
              onClick={() => {
                onNavigateToSection('popular-categories');
                setIsMobileMenuOpen(false);
              }}
              className="text-left text-neutral-200 py-3 px-2 hover:bg-blue-default hover:text-white rounded-lg transition-all duration-300"
              style={{
                fontSize: TYPOGRAPHY.body.fontSize,
                fontWeight: TYPOGRAPHY.body.fontWeight,
                lineHeight: TYPOGRAPHY.body.lineHeight,
                fontFamily: TYPOGRAPHY.body.fontFamily
              }}
            >
              Popular
            </button>
            <button
              onClick={() => {
                onNavigateToFooter();
                setIsMobileMenuOpen(false);
              }}
              className="text-left text-neutral-200 py-3 px-2 hover:bg-blue-default hover:text-white rounded-lg transition-all duration-300"
              style={{
                fontSize: TYPOGRAPHY.body.fontSize,
                fontWeight: TYPOGRAPHY.body.fontWeight,
                lineHeight: TYPOGRAPHY.body.lineHeight,
                fontFamily: TYPOGRAPHY.body.fontFamily
              }}
            >
              Contact Us
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
