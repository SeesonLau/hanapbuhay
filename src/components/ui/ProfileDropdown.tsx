'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { useTheme } from '@/hooks/useTheme';

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
  onSignOut: () => void;
  anchorRect?: DOMRect | null;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  isOpen,
  onClose,
  onOpenSettings,
  onSignOut,
  anchorRect,
}) => {
  const { theme } = useTheme();

  if (!isOpen) return null;

  const top = anchorRect ? (anchorRect.bottom + 8) : 72;
  const right = anchorRect
    ? Math.max(8, (typeof window !== 'undefined' ? window.innerWidth : 0) - anchorRect.right)
    : 8;

  const menuItems = [
    { href: ROUTES.FINDJOBS, label: 'Find Jobs', showOnMobile: true },
    { href: ROUTES.MANAGEJOBPOSTS, label: 'Manage Job Posts', showOnMobile: true },
    { href: ROUTES.APPLIEDJOBS, label: 'Applied Jobs', showOnMobile: true },
    { href: ROUTES.CHAT, label: 'Chat', showOnMobile: true },
    { href: ROUTES.PROFILE, label: 'Profile', showOnMobile: false },
    { href: ROUTES.QUERY, label: 'Query Test', showOnMobile: false },
  ];

  return createPortal(
    <div 
      id="profile-dropdown"
      className="fixed rounded-md shadow-lg py-1 z-[1000] transition-all duration-300 ease-in-out pointer-events-auto"
      style={{ 
        backgroundColor: theme.modal.background,
        border: `1px solid ${theme.modal.sectionBorder}`,
        backdropFilter: 'blur(10px)',
        boxShadow: `0 10px 25px ${theme.modal.overlay}`,
        top,
        right,
        width: 'max-content'
      }}
    >
      {menuItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`block px-4 py-2 text-sm transition-colors duration-300 whitespace-nowrap ${item.showOnMobile ? 'lg:hidden' : ''}`}
          style={{ 
            color: theme.colors.textSecondary,
            backgroundColor: 'transparent'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.surfaceHover;
            e.currentTarget.style.color = theme.colors.primary;
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = theme.colors.textSecondary;
          }}
          onClick={onClose}
        >
          {item.label}
        </Link>
      ))}

      <button
        onClick={onOpenSettings}
        className="block w-full text-left px-4 py-2 text-sm transition-colors duration-300 whitespace-nowrap"
        style={{ 
          color: theme.colors.textSecondary,
          backgroundColor: 'transparent'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = theme.colors.surfaceHover;
          e.currentTarget.style.color = theme.colors.primary;
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = theme.colors.textSecondary;
        }}
      >
        Settings
      </button>

      <button
        onClick={onSignOut}
        className="block w-full text-left px-4 py-2 text-sm transition-colors duration-300 whitespace-nowrap"
        style={{ 
          color: theme.colors.textSecondary,
          backgroundColor: 'transparent'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = theme.colors.surfaceHover;
          e.currentTarget.style.color = theme.colors.primary;
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = theme.colors.textSecondary;
        }}
      >
        Sign out
      </button>
    </div>,
    document.body
  );
};

export default ProfileDropdown;