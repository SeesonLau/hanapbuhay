// src/components/ui/ViewToggle.tsx
"use client";

import React from 'react';
import { useTheme } from '@/hooks/useTheme';

type ViewMode = 'card' | 'list';

export function ViewToggle({
  value,
  onChange,
}: {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
}) {
  const { theme } = useTheme();

  const containerStyle: React.CSSProperties = {
    backgroundColor: theme.colors.backgroundSecondary,
  };

  const activeButtonStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
  };

  const inactiveButtonStyle: React.CSSProperties = {
    color: theme.colors.textMuted,
  };

  return (
    <div 
      className="flex rounded-full p-0.5 mobile-M:p-1" 
      style={containerStyle}
    >
      <button
        type="button"
        onClick={() => onChange('card')}
        aria-pressed={value === 'card'}
        className="flex items-center justify-center w-8 h-8 mobile-M:w-10 mobile-M:h-10 rounded-full transition-colors shadow-sm"
        style={value === 'card' ? activeButtonStyle : inactiveButtonStyle}
        aria-label="Card view"
      >
        <img src="/icons/CardView.svg" alt="Card view" width={16} className="mobile-M:w-5" />
        <span className="sr-only">Card view</span>
      </button>
      <button
        type="button"
        onClick={() => onChange('list')}
        aria-pressed={value === 'list'}
        className="flex items-center justify-center w-8 h-8 mobile-M:w-10 mobile-M:h-10 rounded-full transition-colors shadow-sm"
        style={value === 'list' ? activeButtonStyle : inactiveButtonStyle}
        aria-label="List view"
      >
        <img src="/icons/ListView.svg" alt="List view" width={16} className="mobile-M:w-5" />
        <span className="sr-only">List view</span>
      </button>
    </div>
  );
}