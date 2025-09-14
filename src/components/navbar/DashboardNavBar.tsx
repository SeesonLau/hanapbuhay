'use client';

import React, { useState, useEffect, useRef } from 'react';
import { HiMenu, HiX, HiBell, HiChevronDown } from 'react-icons/hi';

interface DashboardNavBarProps {
  activeLink?: 'find-jobs' | 'manage-posts' | 'applied-jobs' | 'chat';
  userName?: string;
  userAvatar?: string;
  notificationCount?: number;
  onSearch?: (query: string, location: string) => void;
  onNavigate?: (linkId: string) => void;
}

const DashboardNavBar: React.FC<DashboardNavBarProps> = ({
  activeLink = 'find-jobs',
  userName = 'Han Cruz',
  userAvatar,
  notificationCount = 1,
  onSearch,
  onNavigate
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  
  
  const menuRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsProfileOpen(false);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsMenuOpen(false);
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
    };

    if (isMenuOpen || isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, isProfileOpen]);

  const navigationLinks = [
    { id: 'find-jobs', label: 'Find Jobs' },
    { id: 'manage-posts', label: 'Manage Job Posts' },
    { id: 'applied-jobs', label: 'Applied Jobs' },
    { id: 'chat', label: 'Chat' },
  ];

  return (
    <>
      {/* Main Navigation Bar */}
      <nav className="bg-gray-900 text-white shadow-lg w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 w-full p-10">
            {/* Left Section - Brand/Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                {/* Logo */}
                <img 
                  src="/logo.svg" 
                  alt="HanapBuhay Logo" 
                  className="h-14 w-auto mr-3"
                />
              </div>
            </div>

            {/* Center Section - Navigation Links (Desktop) */}
            <div className="hidden md:flex items-center space-x-8">
              {navigationLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => onNavigate?.(link.id)}
                  className="group relative px-3 pt-4 pb-2 text-sm font-medium transition-all duration-300 focus:outline-none"
                  style={{
                    color: activeLink === link.id || hoveredLink === link.id ? '#60a5fa' : 'white',
                    transition: 'color 0.3s ease-in-out'
                  }}
                  onMouseEnter={() => {
                    setHoveredLink(link.id);
                  }}
                  onMouseLeave={() => {
                    setHoveredLink(null);
                  }}
                >
                  {link.label}
                  {/* Animated underline */}
                  <span 
                    className="absolute top-2 left-0 h-0.5 bg-blue-400 border-b-2 border-blue-400"
                    style={{
                      width: activeLink === link.id ? '100%' : '0%',
                      transition: 'width 0.3s ease-in-out'
                    }}
                  />
                </button>
              ))}
            </div>

            {/* Right Section - Notifications & Profile */}
            <div className="flex items-center space-x-4">
              {/* Notification Bell */}
              <div className="relative">
                <button className="p-2 text-white hover:text-blue-400 focus:text-blue-400 transition-colors">
                  <HiBell className="w-6 h-6" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notificationCount}
                    </span>
                  )}
                </button>
              </div>

              {/* User Profile */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={toggleProfile}
                  className="flex items-center space-x-2 text-white hover:text-blue-400 focus:text-blue-400 transition-colors"
                >
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-yellow-500 flex items-center justify-center">
                    {userAvatar ? (
                      <img
                        src={userAvatar}
                        alt={userName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-sm font-medium">
                        {userName.charAt(0)}
                      </span>
                    )}
                  </div>
                  <span className="hidden sm:block text-sm font-medium">{userName}</span>
                  <HiChevronDown className="w-4 h-4" />
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <a
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </a>
                    <a
                      href="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </a>
                    <a
                      href="/logout"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </a>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                ref={buttonRef}
                className="md:hidden p-2 text-white hover:text-blue-400 focus:text-blue-400"
                onClick={toggleMenu}
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

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
            ref={menuRef}
            className="md:hidden bg-gray-800 border-t border-gray-700"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    onNavigate?.(link.id);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-base font-medium transition-all duration-300 ${
                    activeLink === link.id
                      ? 'text-blue-400 bg-gray-700'
                      : 'text-white hover:text-blue-400 focus:text-blue-400 hover:bg-gray-700 focus:bg-gray-700'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

    </>
  );
};

export default DashboardNavBar;
