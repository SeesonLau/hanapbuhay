'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { HiMenu, HiX, HiBell, HiChevronDown } from 'react-icons/hi';
import { 
  getBlueColor, 
  getGrayColor, 
  getWhiteColor, 
  getRedColor,
  getNeutral100Color,
  getNeutral300Color,
  getNeutral600Color,
  getPrimary500Color
} from '@/styles/colors';
import { fontClasses } from '@/styles/fonts';
import { TYPOGRAPHY } from '@/styles/typography';
import { AuthService } from '@/lib/services/auth-services';
import { ROUTES } from '@/lib/constants';
import SettingsModal from '@/components/modals/SettingsModal';
import NotificationPopUp from '../notifications/NotificationPopUp';
import { Preloader, PreloaderMessages } from "./Preloader";

interface HeaderDashboardProps {
  userName?: string;
  userAvatar?: string;
  userEmail?: string;
  userRole?: string;
  userId?: string;
  userCreatedAt?: string;
  notificationCount?: number;
}

const HeaderDashboard: React.FC<HeaderDashboardProps> = ({
  userName = 'Han Cruz',
  userAvatar,
  userEmail = 'user@example.com',
  userRole = 'Job Seeker',
  userId = '12345',
  userCreatedAt = new Date().toISOString(),
  notificationCount = 1,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false); // New state for notifications TEMPORARY
  const [activeLink, setActiveLink] = useState('');
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  //Logout animation state
  const [showGoodbye, setShowGoodbye] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Determine active link based on current path
  useEffect(() => {
    if (pathname === ROUTES.FINDJOBS) setActiveLink('find-jobs');
    else if (pathname === ROUTES.MANAGEJOBPOSTS) setActiveLink('manage-posts');
    else if (pathname === ROUTES.APPLIEDJOBS) setActiveLink('applied-jobs');
    else if (pathname === ROUTES.CHAT) setActiveLink('chat');
    else if (pathname === ROUTES.MOCK) setActiveLink('mock');
    else setActiveLink('find-jobs');
  }, [pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsProfileOpen(false);
    setShowNotifications(false); 
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsMenuOpen(false);
    setShowNotifications(false);
  };

  const openSettings = () => {
    setIsSettingsOpen(true);
    setIsProfileOpen(false);
    setShowNotifications(false);
  };

  const closeSettings = () => {
    setIsSettingsOpen(false);
  };

  const handleSignOut = async () => {
    setIsProfileOpen(false);
    setShowGoodbye(true);
    setTimeout(async () => {
      await AuthService.signOut();
      router.push(ROUTES.HOME);
    }, 2500);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
      
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }

      if (!(event.target as HTMLElement).closest('#notification-button')) {
        setShowNotifications(false);
      }
    };

    if (isMenuOpen || isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, isProfileOpen, showNotifications]);

  const navigationLinks = [
    { id: 'find-jobs', label: 'Find Jobs', route: ROUTES.FINDJOBS },
    { id: 'manage-posts', label: 'Manage Job Posts', route: ROUTES.MANAGEJOBPOSTS },
    { id: 'applied-jobs', label: 'Applied Jobs', route: ROUTES.APPLIEDJOBS },
    { id: 'chat', label: 'Chat', route: ROUTES.CHAT },
    { id: 'mock', label: 'Mock', route: ROUTES.MOCK },
  ];

  const userData = {
    email: userEmail,
    role: userRole,
    userId: userId,
    createdAt: userCreatedAt
  };

  return (
    <>
      {/* Header Section */}
      <header 
        className={`${fontClasses.body} w-full`}
      >
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-3 sm:py-4 flex items-center justify-between fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out">
            {/* Left Section - Brand/Logo */}
            <div className="flex-shrink-0">
              <div className="flex items-center">
                {/* Logo */}
                <Link href={ROUTES.DASHBOARD} className="cursor-pointer transition-transform duration-300 hover:scale-105">
                  <Image
                    src="/image/hanapbuhay-logo.svg"
                    alt="HanapBuhay Logo"
                    width={187}
                    height={68}
                    className="w-32 h-10 sm:w-40 sm:h-12 md:w-44 md:h-14 lg:w-48 lg:h-16"
                    priority
                  />
                </Link>
              </div>
            </div>

            {/* Center Section - Navigation Links (Desktop) */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8 xl:gap-12 absolute left-1/2 transform -translate-x-1/2">
              {navigationLinks.map((link) => (
                <Link key={link.id} href={link.route}>
                  <button
                    className={`group relative px-3 pt-4 pb-2 text-small md:text-body font-medium transition-all duration-300 focus:outline-none whitespace-nowrap ${
                      activeLink === link.id
                        ? 'text-blue-default'
                        : 'text-neutral-200 hover:text-blue-default'
                    }`}
                    onMouseEnter={() => setHoveredLink(link.id)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    {link.label}
                    {/* Animated underline - only shows when active */}
                    <span 
                      className={`absolute top-2 left-0 h-0.5 bg-blue-default transition-all duration-300 ease-in-out ${
                        activeLink === link.id ? 'w-full' : 'w-0'
                      }`}
                    />
                  </button>
                </Link>
              ))}
            </nav>

            {/* Right Section - Notifications & Profile */}
            <div className="flex items-center space-x-4">
              {/* Notification Bell */}
              <div className="relative">
                <button
                  id="notification-button"
                  className="p-2 transition-colors duration-300 focus:outline-none"
                  style={{ color: getWhiteColor() }}
                  onMouseOver={(e) => (e.currentTarget.style.color = getBlueColor())}
                  onMouseOut={(e) => (e.currentTarget.style.color = getWhiteColor())}
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <HiBell className="w-6 h-6" />
                  {notificationCount && notificationCount > 0 && (
                    <span
                      className="absolute -top-1 -right-1 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                      style={{ backgroundColor: getRedColor() }}
                    >
                      {notificationCount}
                    </span>
                  )}
                </button>

                {showNotifications && <NotificationPopUp />}
              </div>

              {/* User Profile */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={toggleProfile}
                  className="flex items-center space-x-2 transition-colors duration-300 focus:outline-none"
                  style={{ color: getWhiteColor() }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = getBlueColor();
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = getWhiteColor();
                  }}
                >
                  {/* Avatar */}
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ 
                      background: 'linear-gradient(to bottom right, #FF9F40, #FFD700)'
                    }}
                  >
                    {userAvatar ? (
                      <Image
                        src={userAvatar}
                        alt={userName}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <span 
                        className="text-sm font-medium"
                        style={{ color: getWhiteColor() }}
                      >
                        {userName.charAt(0)}
                      </span>
                    )}
                  </div>
                  <span 
                    className="hidden sm:block text-body font-medium"
                  >
                    {userName}
                  </span>
                  <HiChevronDown className="w-4 h-4 transition-transform duration-300" 
                    style={{ transform: isProfileOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} 
                  />
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-50 transition-all duration-300 ease-in-out"
                    style={{ 
                      backgroundColor: getWhiteColor(),
                      border: `1px solid ${getGrayColor('border')}`
                    }}
                  >
                    <Link
                      href={ROUTES.PROFILE}
                      className="block px-4 py-2 text-sm transition-colors duration-300"
                      style={{ 
                        color: getGrayColor('neutral600'),
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = getNeutral100Color();
                        e.currentTarget.style.color = getBlueColor();
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = getWhiteColor();
                        e.currentTarget.style.color = getGrayColor('neutral600');
                      }}
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={openSettings}
                      className="block w-full text-left px-4 py-2 text-sm transition-colors duration-300"
                      style={{ 
                        color: getGrayColor('neutral600'),
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = getNeutral100Color();
                        e.currentTarget.style.color = getBlueColor();
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = getWhiteColor();
                        e.currentTarget.style.color = getGrayColor('neutral600');
                      }}
                    >
                      Settings
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm transition-colors duration-300"
                      style={{ 
                        color: getGrayColor('neutral600'),
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = getNeutral100Color();
                        e.currentTarget.style.color = getBlueColor();
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = getWhiteColor();
                        e.currentTarget.style.color = getGrayColor('neutral600');
                      }}
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                ref={buttonRef}
                className="md:hidden p-2 focus:outline-none transition-colors duration-300"
                style={{ color: getWhiteColor() }}
                onClick={toggleMenu}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = getBlueColor();
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = getWhiteColor();
                }}
                aria-label="Toggle Menu"
              >
                {isMenuOpen ? (
                  <HiX className="w-6 h-6" />
                ) : (
                  <HiMenu className="w-6 h-6" />
                )}
              </button>
            </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div
            ref={menuRef}
            className="md:hidden absolute top-full right-4 mt-2 rounded-xl bg-gray-900 bg-opacity-95 min-w-48 transition-all duration-300 ease-in-out"
          >
            <div className="flex flex-col space-y-2 p-4">
              {navigationLinks.map((link) => (
                <Link key={link.id} href={link.route}>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className={`w-full text-left px-3 py-2 text-base font-medium transition-all duration-300 focus:outline-none rounded-lg ${
                      activeLink === link.id
                        ? 'bg-blue-default text-white'
                        : 'text-neutral-200 hover:bg-blue-default hover:text-white'
                    }`}
                  >
                    {link.label}
                  </button>
                </Link>
              ))}
              {/* Settings in Mobile Menu */}
              <button
                onClick={() => {
                  openSettings();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-base font-medium transition-all duration-300 focus:outline-none text-neutral-200 hover:bg-blue-default hover:text-white rounded-lg"
              >
                Settings
              </button>
              {/* Sign Out in Mobile Menu */}
              <button
                onClick={() => {
                  handleSignOut();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-base font-medium transition-all duration-300 focus:outline-none text-neutral-200 hover:bg-red-default hover:text-white rounded-lg"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={closeSettings} 
        user={userData}
      />

       {/* Goodbye Preloader */}
      {showGoodbye && (
        <Preloader
          message={PreloaderMessages.GOODBYE}
          isVisible={true}
          variant="goodbye"
        />
      )}
      
    </>
  );
};

export default HeaderDashboard;
