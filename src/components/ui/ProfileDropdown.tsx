'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { 
  getBlueColor, 
  getGrayColor, 
  getWhiteColor,
  getNeutral100Color
} from '@/styles/colors';
import { ROUTES } from '@/lib/constants';

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
  if (!isOpen) return null;

  const top = anchorRect ? (anchorRect.bottom + 8) : 72;
  const left = anchorRect ? Math.max(8, Math.min(window.innerWidth - 200, anchorRect.right - 192)) : undefined;
  const right = left === undefined ? 8 : undefined;

  return createPortal(
    <div 
      className="fixed w-48 rounded-md shadow-lg py-1 z-[1000] transition-all duration-300 ease-in-out pointer-events-auto"
      style={{ 
        backgroundColor: getWhiteColor(),
        border: `1px solid ${getGrayColor('border')}`,
        backdropFilter: 'blur(10px)',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
        top,
        left,
        right,
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
        onClick={onClose}
      >
        Profile
      </Link>

      <Link
        href={ROUTES.QUERY}
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
        onClick={onClose}
      >
        Query Test
      </Link>

      <button
        onClick={onOpenSettings}
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
        onClick={onSignOut}
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
    </div>,
    document.body
  );
};

export default ProfileDropdown;
