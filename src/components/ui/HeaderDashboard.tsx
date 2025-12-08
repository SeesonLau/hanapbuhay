'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { HiBell, HiChevronDown } from 'react-icons/hi';
import { getRedColor } from '@/styles/colors';
import { fontClasses } from '@/styles/fonts';
import { AuthService } from '@/lib/services/auth-services';
import { NotificationService } from '@/lib/services/notifications-services';
import { ROUTES } from '@/lib/constants';
import SettingsModal from '@/components/modals/SettingsModal';
import NotificationPopUp from '../notifications/NotificationPopUp';
import { Preloader, PreloaderMessages } from "./Preloader";
import ProfileDropdown from './ProfileDropdown';
import { ProfileService } from "@/lib/services/profile-services";
import { useTheme } from '@/hooks/useTheme';

interface HeaderDashboardProps {
  userName?: string;
  userAvatar?: string;
  userEmail?: string;
  userRole?: string;
  userId?: string;
  userCreatedAt?: string;
}

const HeaderDashboard: React.FC<HeaderDashboardProps> = ({
  userName = '',
  userAvatar = '',
  userEmail = '',
  userRole = 'Job Seeker',
  userId = '',
  userCreatedAt = new Date().toISOString(),
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, themeName, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  
  const [userData, setUserData] = useState(() => {
    if (typeof window !== 'undefined') {
      const cached = sessionStorage.getItem('headerUserData');
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch (e) {}
      }
    }
    return {
      name: userName,
      email: userEmail,
      profilePicUrl: userAvatar,
      userId: userId
    };
  });
  const [isLoading, setIsLoading] = useState(false);

  const [unreadCount, setUnreadCount] = useState(() => {
    if (typeof window !== 'undefined') {
      const cached = sessionStorage.getItem('unreadNotificationCount');
      return cached ? parseInt(cached, 10) : 0;
    }
    return 0;
  });

  const [showGoodbye, setShowGoodbye] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!userData.name && !userData.email) {
          setIsLoading(true);
        }
        
        const currentUser = await AuthService.getCurrentUser();
        
        if (currentUser) {
          const userId = currentUser.id;
          const profileData = await ProfileService.getNameProfilePic(userId);
          const userEmail = await ProfileService.getEmailByUserId(userId);
          
          const newUserData = {
            name: profileData?.name || 'User',
            email: userEmail || '',
            profilePicUrl: profileData?.profilePicUrl || '',
            userId: userId
          };
          
          setUserData(newUserData);
          
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('headerUserData', JSON.stringify(newUserData));
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        const fallbackData = {
          name: userName || 'User',
          email: userEmail || '',
          profilePicUrl: userAvatar || '',
          userId: userId || ''
        };
        setUserData(fallbackData);
        
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('headerUserData', JSON.stringify(fallbackData));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userName, userEmail, userAvatar, userId]);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser();
        if (currentUser) {
          const count = await NotificationService.getUnreadCount(currentUser.id);
          setUnreadCount(count);
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('unreadNotificationCount', count.toString());
          }
        }
      } catch (error) {
        console.error('Error fetching unread count:', error);
        setUnreadCount(0);
      }
    };

    const cachedCount = typeof window !== 'undefined' ? sessionStorage.getItem('unreadNotificationCount') : null;
    if (!cachedCount) {
      fetchUnreadCount();
    } else {
      fetchUnreadCount();
    }

    let unsubscribe: (() => void) | null = null;
    
    const setupSubscription = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser();
        if (currentUser) {
          unsubscribe = NotificationService.subscribeToNotifications(
            currentUser.id,
            () => {
              fetchUnreadCount();
            }
          );
        }
      } catch (error) {
        console.error('Error setting up notification subscription:', error);
      }
    };

    setupSubscription();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    if (pathname === ROUTES.FINDJOBS) setActiveLink('find-jobs');
    else if (pathname === ROUTES.MANAGEJOBPOSTS) setActiveLink('manage-posts');
    else if (pathname === ROUTES.APPLIEDJOBS) setActiveLink('applied-jobs');
    else if (pathname === ROUTES.CHAT) setActiveLink('chat');
    else if (pathname === ROUTES.PROFILE) setActiveLink('');
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
    
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('headerUserData');
      sessionStorage.removeItem('unreadNotificationCount');
    }
    
    setTimeout(async () => {
      await AuthService.signOut();
      router.push(ROUTES.HOME);
    }, 2500);
  };

  const handleThemeToggle = () => {
    toggleTheme();
  };

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
    const handleClickOutside = (event: MouseEvent) => {
      const targetEl = event.target as HTMLElement;
      const inMenu = menuRef.current && menuRef.current.contains(targetEl);
      const onMenuButton = buttonRef.current && buttonRef.current.contains(targetEl);
      const inProfileAnchor = profileRef.current && profileRef.current.contains(targetEl);
      const inProfileDropdown = !!targetEl.closest('#profile-dropdown');

      if (!inMenu && !onMenuButton) {
        setIsMenuOpen(false);
      }

      if (!inProfileAnchor && !inProfileDropdown) {
        setIsProfileOpen(false);
      }

      if (!targetEl.closest('#notification-button')) {
        setShowNotifications(false);
      }
    };

    if (isMenuOpen || isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, isProfileOpen]);

  const navigationLinks = [
    { id: 'find-jobs', label: 'Find Jobs', route: ROUTES.FINDJOBS },
    { id: 'manage-posts', label: 'Manage Job Posts', route: ROUTES.MANAGEJOBPOSTS },
    { id: 'applied-jobs', label: 'Applied Jobs', route: ROUTES.APPLIEDJOBS },
    { id: 'chat', label: 'Chat', route: ROUTES.CHAT },
  ];

  const settingsUserData = {
    email: userData.email,
    role: userRole,
    userId: userData.userId,
    createdAt: userCreatedAt
  };

  const getDisplayName = () => {
    if (isLoading) return 'Loading...';
    if (!userData.name) return 'User';
    const firstName = userData.name.split(' ')[0];
    return firstName || userData.name;
  };

  const getAvatarInitial = () => {
    if (isLoading) return '...';
    if (!userData.name) return 'U';
    return userData.name.charAt(0).toUpperCase();
  };

  const themeInfo = getThemeInfo();

  return (
    <>
      <header className={`${fontClasses.body} w-full relative`}>
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 pt-3 pb-1 sm:pt-4 pb-1 flex items-center justify-between relative z-10">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="flex items-center">
              <Link href={ROUTES.FINDJOBS} className="cursor-pointer transition-all duration-500 hover:scale-105">
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

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 lg:gap-8 xl:gap-12 absolute left-1/2 transform -translate-x-1/2">
            {navigationLinks.map((link) => (
              <Link key={link.id} href={link.route}>
                <button
                  className={`group relative px-3 pt-4 pb-2 text-small md:text-body font-medium transition-all duration-300 focus:outline-none whitespace-nowrap transform hover:scale-105`}
                  style={{
                    color: activeLink === link.id ? theme.colors.primary : theme.landing.bodyText
                  }}
                  onMouseEnter={(e) => {
                    setHoveredLink(link.id);
                    if (activeLink !== link.id) {
                      e.currentTarget.style.color = theme.colors.primary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    setHoveredLink(null);
                    if (activeLink !== link.id) {
                      e.currentTarget.style.color = theme.landing.bodyText;
                    }
                  }}
                >
                  {link.label}
                  <span 
                    className={`absolute top-2 left-0 h-0.5 transition-all duration-300 ease-in-out ${
                      activeLink === link.id ? 'w-full' : 'w-0'
                    }`}
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                </button>
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Notification Bell */}
            <div className="relative">
              <button
                id="notification-button"
                className="p-2 transition-colors duration-300 focus:outline-none"
                style={{ color: theme.landing.bodyText }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = theme.colors.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = theme.landing.bodyText;
                }}
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <HiBell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center transition-colors duration-300"
                    style={{ backgroundColor: getRedColor() }}
                  >
                    {unreadCount}
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
                style={{ color: theme.landing.bodyText }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = theme.colors.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = theme.landing.bodyText;
                }}
              >
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{ background: 'transparent' }}
                  suppressHydrationWarning
                >
                  {userData.profilePicUrl ? (
                    <Image
                      src={userData.profilePicUrl}
                      alt={userData.name}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <span 
                      className="text-sm font-medium"
                      style={{ color: theme.landing.headingPrimary }}
                    >
                      {getAvatarInitial()}
                    </span>
                  )}
                </div>
                <span className="hidden sm:block text-body font-medium transition-all duration-300">
                  {getDisplayName()}
                </span>
                <HiChevronDown 
                  className="w-4 h-4 transition-transform duration-300" 
                  style={{ transform: isProfileOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} 
                />
              </button>

              <ProfileDropdown 
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                onOpenSettings={openSettings}
                onSignOut={handleSignOut}
                anchorRect={profileRef.current ? profileRef.current.getBoundingClientRect() : null}
              />
            </div>
          </div>
        </div>
      </header>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={closeSettings} 
        user={settingsUserData}
      />

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