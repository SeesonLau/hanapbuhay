'use client';

import { useTheme } from '@/hooks/useTheme';
import { ThemeName } from '@/styles/theme';

export default function ThemeSelector() {
  const { themeName, setTheme } = useTheme();

  const themes: { name: ThemeName; label: string; emoji: string }[] = [
    { name: 'classic', label: 'Classic', emoji: '🎨' },
    { name: 'spring', label: 'Spring', emoji: '🌸' },
    { name: 'summer', label: 'Summer', emoji: '☀️' },
    { name: 'autumn', label: 'Autumn', emoji: '🍂' },
    { name: 'winter', label: 'Winter', emoji: '❄️' },
  ];

  return (
    <div className="flex gap-2 p-2 bg-white rounded-lg shadow-md">
      {themes.map((theme) => (
        <button
          key={theme.name}
          onClick={() => setTheme(theme.name)}
          className={`
            px-4 py-2 rounded-md font-medium transition-all
            ${themeName === theme.name 
              ? 'theme-bg-primary text-white scale-105' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }
          `}
        >
          <span className="mr-2">{theme.emoji}</span>
          {theme.label}
        </button>
      ))}
    </div>
  );
}