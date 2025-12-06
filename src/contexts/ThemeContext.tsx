'use client';

import React, { createContext, useEffect, useState } from 'react';
import { Theme, ThemeName, themes } from '@/styles/theme';

interface ThemeContextType {
  theme: Theme;
  themeName: ThemeName;
  setTheme: (themeName: ThemeName) => void;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'seasonal-theme';
const themeOrder: ThemeName[] = ['classic', 'spring', 'summer', 'autumn', 'winter'];

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>('classic');
  const [mounted, setMounted] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme && themes[savedTheme as ThemeName]) {
        setThemeName(savedTheme as ThemeName);
      } else {
        // Default to classic theme
        setThemeName('classic');
      }
    } catch (error) {
      console.error('Error loading theme:', error);
      setThemeName('classic');
    }
    setMounted(true);
  }, []);

  // Apply theme CSS variables
  useEffect(() => {
    if (!mounted) return;

    const theme = themes[themeName];
    const root = document.documentElement;

    // Apply color variables
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value);
    });

    // Apply gradient variables
    Object.entries(theme.gradients).forEach(([key, value]) => {
      root.style.setProperty(`--theme-gradient-${key}`, value);
    });

    // Save to localStorage
    try {
      localStorage.setItem(THEME_STORAGE_KEY, themeName);
    } catch (error) {
      console.error('Error saving theme:', error);
    }

    // Add theme class to body
    const themeClasses = themeOrder.map(t => `theme-${t}`);
    document.body.classList.remove(...themeClasses);
    document.body.classList.add(`theme-${themeName}`);
  }, [themeName, mounted]);

  const handleSetTheme = (newTheme: ThemeName) => {
    setThemeName(newTheme);
  };

  const toggleTheme = () => {
    const currentIndex = themeOrder.indexOf(themeName);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    setThemeName(themeOrder[nextIndex]);
  };

  const value: ThemeContextType = {
    theme: themes[themeName],
    themeName: themeName,
    setTheme: handleSetTheme,
    toggleTheme,
  };

  // Prevent flash of unstyled content
  if (!mounted) {
    return null;
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}