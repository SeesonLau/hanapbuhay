// src/components/ui/ViewToggle.tsx
"use client";

import React from 'react';

type ViewMode = 'card' | 'list';

export function ViewToggle({
  value,
  onChange,
}: {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
}) {
  return (
    <div className="flex bg-gray-100 rounded-full p-0.5 mobile-M:p-1">
      <button
        type="button"
        onClick={() => onChange('card')}
        aria-pressed={value === 'card'}
        className={`flex items-center justify-center w-8 h-8 mobile-M:w-10 mobile-M:h-10 rounded-full transition-colors ${
          value === 'card'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
        aria-label="Card view"
      >
        <img src="/icons/CardView.svg" alt="Card view" width={16} className="mobile-M:w-5" />
        <span className="sr-only">Card view</span>
      </button>
      <button
        type="button"
        onClick={() => onChange('list')}
        aria-pressed={value === 'list'}
        className={`flex items-center justify-center w-8 h-8 mobile-M:w-10 mobile-M:h-10 rounded-full transition-colors ${
          value === 'list'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
        aria-label="List view"
      >
        <img src="/icons/ListView.svg" alt="List view" width={16} className="mobile-M:w-5" />
        <span className="sr-only">List view</span>
      </button>
    </div>
  );
}