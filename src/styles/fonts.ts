import { Inter, Alexandria } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const alexandria = Alexandria({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-alexandria',
});

// For applying font classes directly
export const fontClasses = {
  heading: 'font-alexandria',
  body: 'font-inter',
};

export const FONTS = {
  heading: 'var(--font-alexandria)',
  body: 'var(--font-inter)',
};
