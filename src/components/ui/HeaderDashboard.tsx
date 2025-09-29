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
import NotificationPopUp from './NotificationPopUp';

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
    await AuthService.signOut();
    router.push(ROUTES.HOME);
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
        className={`${fontClasses.body} w-full shadow-lg`}
        style={{ backgroundColor: getGrayColor('neutral600') }}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 w-full p-10">
            {/* Left Section - Brand/Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                {/* Logo */}
                <Link href={ROUTES.DASHBOARD} className="cursor-pointer">
                  <Image
                    src="/image/hanapbuhay-logo.svg"
                    alt="HanapBuhay Logo"
                    width={187}
                    height={68}
                    className="h-14 w-auto mr-3"
                    priority
                  />
                </Link>
              </div>
            </div>

            {/* Center Section - Navigation Links (Desktop) */}
            <div className="hidden md:flex items-center space-x-8">
              {navigationLinks.map((link) => (
                <Link key={link.id} href={link.route}>
                  <button
                    className="group relative px-3 pt-4 pb-2 text-sm font-medium transition-all duration-300 focus:outline-none"
                    style={{
                      color: activeLink === link.id || hoveredLink === link.id ? 
                        getBlueColor() : getWhiteColor(),
                      transition: 'color 0.3s ease-in-out'
                    }}
                    onMouseEnter={() => setHoveredLink(link.id)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    {link.label}
                    {/* Animated underline */}
                    <span 
                      className="absolute top-2 left-0 h-0.5 transition-all duration-300 ease-in-out"
                      style={{
                        width: activeLink === link.id || hoveredLink === link.id ? '100%' : '0%',
                        backgroundColor: getBlueColor(),
                      }}
                    />
                  </button>
                </Link>
              ))}
            </div>

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
                    className="hidden sm:block text-sm font-medium"
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
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div
            ref={menuRef}
            className="md:hidden border-t transition-all duration-300 ease-in-out"
            style={{ 
              backgroundColor: getGrayColor('neutral600'),
              borderColor: getGrayColor('border')
            }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationLinks.map((link) => (
                <Link key={link.id} href={link.route}>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className={`w-full text-left px-3 py-2 text-base font-medium transition-all duration-300 focus:outline-none ${
                      activeLink === link.id
                        ? 'bg-gray-700'
                        : 'hover:bg-gray-700 focus:bg-gray-700'
                    }`}
                    style={{
                      color: activeLink === link.id ? 
                        getBlueColor() : getWhiteColor(),
                    }}
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
                className="w-full text-left px-3 py-2 text-base font-medium transition-all duration-300 focus:outline-none hover:bg-gray-700 focus:bg-gray-700"
                style={{
                  color: getWhiteColor(),
                }}
              >
                Settings
              </button>
              {/* Sign Out in Mobile Menu */}
              <button
                onClick={() => {
                  handleSignOut();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-base font-medium transition-all duration-300 focus:outline-none hover:bg-gray-700 focus:bg-gray-700"
                style={{
                  color: getWhiteColor(),
                }}
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
    </>
  );
};

export default HeaderDashboard;
