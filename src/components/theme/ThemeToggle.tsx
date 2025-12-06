'use client';

import { useTheme } from '@/hooks/useTheme';

export default function ThemeToggle() {
  const { themeName, toggleTheme, theme } = useTheme();

  const getEmoji = () => {
    switch (themeName) {
      case 'classic': return '🎨';
      case 'spring': return '🌸';
      case 'summer': return '☀️';
      case 'autumn': return '🍂';
      case 'winter': return '❄️';
      default: return '🎨';
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-all hover:scale-110"
      title={`Current theme: ${theme.displayName}`}
    >
      <span className="text-2xl">{getEmoji()}</span>
    </button>
  );
}