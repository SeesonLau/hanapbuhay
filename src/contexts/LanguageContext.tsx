'use client';

import React, { createContext, useEffect, useState } from 'react';
import { Locale, defaultLocale } from '@/i18n/config';
import enSettings from '@/i18n/locales/en/settings.json';
import tlSettings from '@/i18n/locales/tl/settings.json';
import enCommon from '@/i18n/locales/en/common.json';
import tlCommon from '@/i18n/locales/tl/common.json';
import enHome from '@/i18n/locales/en/home.json';
import tlHome from '@/i18n/locales/tl/home.json';
import enAuth from '@/i18n/locales/en/auth.json';
import tlAuth from '@/i18n/locales/tl/auth.json';
import enJobs from '@/i18n/locales/en/jobs.json';
import tlJobs from '@/i18n/locales/tl/jobs.json';
import enProfile from '@/i18n/locales/en/profile.json';
import tlProfile from '@/i18n/locales/tl/profile.json';
import enChat from '@/i18n/locales/en/chat.json';
import tlChat from '@/i18n/locales/tl/chat.json';
import enComponents from '@/i18n/locales/en/components.json';
import tlComponents from '@/i18n/locales/tl/components.json';

interface Translations {
  settings: typeof enSettings;
  common: typeof enCommon;
  home: typeof enHome;
  auth: typeof enAuth;
  jobs: typeof enJobs;
  profile: typeof enProfile;
  chat: typeof enChat;
  components: typeof enComponents;
}

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'app-language';

const translations: Record<Locale, Translations> = {
  en: {
    settings: enSettings,
    common: enCommon,
    home: enHome,
    auth: enAuth,
    jobs: enJobs,
    profile: enProfile,
    chat: enChat,
    components: enComponents,
  },
  tl: {
    settings: tlSettings,
    common: tlCommon,
    home: tlHome,
    auth: tlAuth,
    jobs: tlJobs,
    profile: tlProfile,
    chat: tlChat,
    components: tlComponents,
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [mounted, setMounted] = useState(false);

  // Load language from localStorage on mount
  useEffect(() => {
    try {
      const savedLocale = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLocale && (savedLocale === 'en' || savedLocale === 'tl')) {
        setLocaleState(savedLocale as Locale);
      } else {
        setLocaleState(defaultLocale);
      }
    } catch (error) {
      console.error('Error loading language:', error);
      setLocaleState(defaultLocale);
    }
    setMounted(true);
  }, []);

  // Save language to localStorage when it changes
  useEffect(() => {
    if (!mounted) return;

    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, locale);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  }, [locale, mounted]);

  const handleSetLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
  };

  const value: LanguageContextType = {
    locale,
    setLocale: handleSetLocale,
    t: translations[locale],
  };

  // Prevent flash of unstyled content
  if (!mounted) {
    return null;
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
