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

  return (
    <div 
      className={`w-[1820px] min-w-[1320px] px-4 py-3 rounded-xl backdrop-blur-sm inline-flex justify-start items-center gap-80 fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ease-out ${
        isVisible 
          ? 'translate-y-0 opacity-100' 
          : '-translate-y-full opacity-0 pointer-events-none'
      }`}
      style={{ 
        backgroundColor: whiteWithOpacity,
        // Add a subtle scale effect when at top (only on homepage)
        transform: isAtTop && isHomePage
          ? `translate(-50%, 0) scale(1)` 
          : `translate(-50%, 0) scale(0.98)`,
        transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease-out'
      }}
    >
      {/* Logo - Clickable to home or scroll to top */}
      <button 
        onClick={handleLogoClick}
        className="w-48 h-16 relative cursor-pointer transition-transform duration-300 hover:scale-105"
      >
        <Image
          className="w-48 h-16"
          src="/image/hanapbuhay-logo.svg"
          alt="HanapBuhat Logo"
          width={187}
          height={68}
          priority
        />
      </button>

      <div className="w-[800px] flex justify-center items-center gap-12">
        {/* Benefits */}
        <button
          onClick={() => onNavigateToSection('benefits')}
          className="flex justify-center items-center gap-2.5 cursor-pointer transition-all duration-300 hover:opacity-80 hover:scale-105"
        >
          <div 
            className="w-24 h-9 text-center justify-center text-neutral-200"
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

        {/* How it Works */}
        <button
          onClick={() => onNavigateToSection('how-it-works')}
          className="flex justify-center items-center gap-2.5 cursor-pointer transition-all duration-300 hover:opacity-80 hover:scale-105"
        >
          <div 
            className="w-40 h-9 text-center justify-center text-neutral-200"
            style={{
              fontSize: TYPOGRAPHY.body.fontSize,
              fontWeight: TYPOGRAPHY.body.fontWeight,
              lineHeight: TYPOGRAPHY.body.lineHeight,
              fontFamily: TYPOGRAPHY.body.fontFamily
            }}
          >
            How it Works
          </div>
        </button>

        {/* Testimonials */}
        <button
          onClick={() => onNavigateToSection('testimonials')}
          className="flex justify-center items-center gap-2.5 cursor-pointer transition-all duration-300 hover:opacity-80 hover:scale-105"
        >
          <div 
            className="w-28 h-9 text-center justify-center text-neutral-200"
            style={{
              fontSize: TYPOGRAPHY.body.fontSize,
              fontWeight: TYPOGRAPHY.body.fontWeight,
              lineHeight: TYPOGRAPHY.body.lineHeight,
              fontFamily: TYPOGRAPHY.body.fontFamily
            }}
          >
            Testimonials
          </div>
        </button>

        {/* Contact Us */}
        <button
          onClick={onNavigateToFooter}
          className="flex justify-center items-center gap-2.5 cursor-pointer transition-all duration-300 hover:opacity-80 hover:scale-105"
        >
          <div 
            className="w-32 h-9 text-center justify-center text-neutral-200"
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
      </div>
    </div>
  );
}
