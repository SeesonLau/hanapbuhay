'use client';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { getWhiteColor, TYPOGRAPHY } from '@/styles';
import { useEffect, useState } from 'react';
import { ROUTES } from '@/lib/constants';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/hooks/useLanguage';
import { FiSun, FiGlobe } from 'react-icons/fi';

interface HeaderHomeProps {
  onNavigateToSection: (sectionId: string) => void;
  onNavigateToFooter: () => void;
  isScrolled?: boolean;
}

// Theme cycle order
const THEME_ORDER = ['classic', 'spring', 'summer', 'autumn', 'winter'] as const;

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
  const { theme, themeName, setTheme, toggleTheme } = useTheme();
  const { locale, setLocale, t } = useLanguage();

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

  const handleThemeToggle = () => {
    toggleTheme();
  };

  const handleLanguageToggle = () => {
    setLocale(locale === 'en' ? 'tl' : 'en');
  };

  // Get theme icon and label based on current theme
  const getThemeInfo = () => {
    switch (themeName) {
      case 'classic':
        return { icon: '🎨', label: 'Classic' };
      case 'spring':
        return { icon: '🌸', label: 'Spring' };
      case 'summer':
        return { icon: '☀️', label: 'Summer' };
      case 'autumn':
        return { icon: '🍂', label: 'Autumn' };
      case 'winter':
        return { icon: '❄️', label: 'Winter' };
      default:
        return { icon: '🎨', label: 'Classic' };
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

  const themeInfo = getThemeInfo();

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
            className="text-center px-2 py-2 text-sm tablet:text-base whitespace-nowrap transition-colors duration-300"
            style={{
              color: theme.landing.bodyText,
              fontSize: TYPOGRAPHY.body.fontSize,
              fontWeight: TYPOGRAPHY.body.fontWeight,
              lineHeight: TYPOGRAPHY.body.lineHeight,
              fontFamily: TYPOGRAPHY.body.fontFamily
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = theme.landing.accentPrimary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = theme.landing.bodyText;
            }}
          >
            {t.components.header.benefits}
          </div>
        </button>

        {/* Recommendations */}
        <button
          onClick={() => onNavigateToSection('recommended-jobs')}
          className="flex justify-center items-center cursor-pointer transition-all duration-300 hover:scale-105"
        >
          <div
            className="text-center px-2 py-2 text-sm tablet:text-base whitespace-nowrap transition-colors duration-300"
            style={{
              color: theme.landing.bodyText,
              fontSize: TYPOGRAPHY.body.fontSize,
              fontWeight: TYPOGRAPHY.body.fontWeight,
              lineHeight: TYPOGRAPHY.body.lineHeight,
              fontFamily: TYPOGRAPHY.body.fontFamily
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = theme.landing.accentPrimary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = theme.landing.bodyText;
            }}
          >
            {t.components.header.recommendations}
          </div>
        </button>

        {/* Popular */}
        <button
          onClick={() => onNavigateToSection('popular-categories')}
          className="flex justify-center items-center cursor-pointer transition-all duration-300 hover:scale-105"
        >
          <div
            className="text-center px-2 py-2 text-sm tablet:text-base whitespace-nowrap transition-colors duration-300"
            style={{
              color: theme.landing.bodyText,
              fontSize: TYPOGRAPHY.body.fontSize,
              fontWeight: TYPOGRAPHY.body.fontWeight,
              lineHeight: TYPOGRAPHY.body.lineHeight,
              fontFamily: TYPOGRAPHY.body.fontFamily
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = theme.landing.accentPrimary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = theme.landing.bodyText;
            }}
          >
            {t.components.header.popularCategories}
          </div>
        </button>

        {/* Contact Us */}
        <button
          onClick={onNavigateToFooter}
          className="flex justify-center items-center cursor-pointer transition-all duration-300 hover:scale-105"
        >
          <div
            className="text-center px-2 py-2 text-sm tablet:text-base whitespace-nowrap transition-colors duration-300"
            style={{
              color: theme.landing.bodyText,
              fontSize: TYPOGRAPHY.body.fontSize,
              fontWeight: TYPOGRAPHY.body.fontWeight,
              lineHeight: TYPOGRAPHY.body.lineHeight,
              fontFamily: TYPOGRAPHY.body.fontFamily
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = theme.landing.accentPrimary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = theme.landing.bodyText;
            }}
          >
            {t.components.header.contactUs}
          </div>
        </button>
      </nav>

      {/* Action Buttons - Theme & Language Switcher */}
      <div className="flex-shrink-0 flex items-center gap-2 sm:gap-3">
        <button
          onClick={handleThemeToggle}
          className="group relative p-2 sm:p-2.5 rounded-full transition-all duration-300 hover:scale-110 active:scale-95"
          style={{
            backgroundColor: theme.landing.iconBg,
            border: `2px solid ${theme.landing.iconBorder}`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme.landing.glassHoverBg;
            e.currentTarget.style.borderColor = theme.landing.glassHoverBorder;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = theme.landing.iconBg;
            e.currentTarget.style.borderColor = theme.landing.iconBorder;
          }}
          title={`Switch to next theme (Current: ${themeInfo.label})`}
          aria-label={`Switch theme. Current: ${themeInfo.label}`}
        >
          <FiSun 
            size={20} 
            className="transition-colors duration-300"
            style={{ color: theme.landing.accentPrimary }}
          />
          
          {/* Tooltip */}
          <div 
            className="absolute -bottom-10 right-0 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 backdrop-blur-sm"
            style={{
              backgroundColor: theme.landing.glassBg,
              border: `1px solid ${theme.landing.glassBorder}`,
              color: theme.landing.headingPrimary,
            }}
          >
            {themeInfo.icon} {themeInfo.label}
          </div>
        </button>

        {/* Language Switcher Button */}
        <button
          onClick={handleLanguageToggle}
          className="group relative p-2 sm:p-2.5 rounded-full transition-all duration-300 hover:scale-110 active:scale-95"
          style={{
            backgroundColor: theme.landing.iconBg,
            border: `2px solid ${theme.landing.iconBorder}`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme.landing.glassHoverBg;
            e.currentTarget.style.borderColor = theme.landing.glassHoverBorder;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = theme.landing.iconBg;
            e.currentTarget.style.borderColor = theme.landing.iconBorder;
          }}
          title={`Switch language (Current: ${locale === 'en' ? 'English' : 'Tagalog'})`}
          aria-label={`Switch language. Current: ${locale === 'en' ? 'English' : 'Tagalog'}`}
        >
          <FiGlobe
            size={20}
            className="transition-colors duration-300"
            style={{ color: theme.landing.accentPrimary }}
          />

          {/* Tooltip */}
          <div
            className="absolute -bottom-10 right-0 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 backdrop-blur-sm"
            style={{
              backgroundColor: theme.landing.glassBg,
              border: `1px solid ${theme.landing.glassBorder}`,
              color: theme.landing.headingPrimary,
            }}
          >
            {locale === 'en' ? '🇬🇧 English' : '🇵🇭 Tagalog'}
          </div>
        </button>
      </div>
    </header>
  );
}