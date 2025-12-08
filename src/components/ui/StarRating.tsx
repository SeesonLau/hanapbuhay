'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { useTheme } from '@/hooks/useTheme';

type Variant = 'display' | 'rating';
type LabelVariant = 'average' | 'count' | 'none';

interface StarRatingProps {
  variant?: Variant;
  value?: number;
  onChange?: (v: number) => void;
  size?: 'vs' | 'sm' | 'md' | 'lg' | 'xlg' | 'xxlg';
  className?: string;
  max?: number;
  labelVariant?: LabelVariant;
  ratingCount?: number;
}

const SIZE_MAP: Record<string, string> = {
  vs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-8 h-8',
  xlg: 'w-9 h-9',
  xxlg: 'w-10 h-10',
};

function StarIcon(props: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 15 14"
      fill="currentColor"
      aria-hidden="true"
      className={props.className}
      style={props.style}
    >
      <path 
        d="M7.20898 0.62207C7.31332 0.62207 7.42076 0.649738 7.5332 0.713867C7.62748 0.767656 7.6992 0.84846 7.74902 0.967773L7.75 0.96875L9.3125 4.67773L9.37109 4.81641L9.52051 4.8291L13.5547 5.18262C13.7134 5.20608 13.8142 5.25482 13.8779 5.31055C13.954 5.37718 14.015 5.46506 14.0576 5.58203C14.097 5.69028 14.1047 5.79972 14.0801 5.91406C14.0583 6.01501 14.0021 6.11177 13.8965 6.20605L10.8379 8.84961L10.7236 8.94824L10.7578 9.0957L11.6738 13.0332C11.7046 13.1669 11.6921 13.2716 11.6504 13.3594C11.5974 13.4707 11.5247 13.5608 11.4316 13.6328C11.3469 13.6984 11.2468 13.7375 11.125 13.748C11.0181 13.7573 10.9131 13.7318 10.8027 13.6611L10.7969 13.6582L7.33789 11.5742L7.20898 11.4971L7.08008 11.5742L3.62207 13.6582L3.61719 13.6611C3.50661 13.7315 3.40043 13.7569 3.29297 13.748C3.17178 13.7379 3.07183 13.6986 2.9873 13.6328C2.89378 13.56 2.8215 13.4694 2.76855 13.3584C2.72716 13.2716 2.7134 13.1676 2.74414 13.0332L3.66113 9.0957L3.69531 8.94824L3.58105 8.84961L0.521484 6.20703H0.522461C0.417028 6.11214 0.361747 6.01446 0.339844 5.91309C0.315146 5.79836 0.322442 5.68965 0.361328 5.58203C0.403287 5.46594 0.46402 5.37797 0.541016 5.31055C0.605986 5.25367 0.707822 5.20426 0.868164 5.18164L4.89746 4.8291L5.04785 4.81641L5.10645 4.67773L6.66895 0.96875V0.967773C6.71878 0.848324 6.79138 0.767685 6.88574 0.713867C6.99799 0.649897 7.10481 0.622119 7.20898 0.62207Z" 
        stroke="currentColor" 
        strokeWidth="0.5"
        fill="currentColor"
      />
    </svg>
  );
}

export default function StarRating({
  variant = 'display',
  value = 0,
  onChange,
  size = 'md',
  className = '',
  max = 5,
  labelVariant = 'average',
  ratingCount,
}: StarRatingProps) {
  const { theme } = useTheme();
  const [hover, setHover] = useState<number | null>(null);
  const [focusIndex, setFocusIndex] = useState<number | null>(null);

  const displayed = variant === 'rating' && hover != null ? hover : value;
  const stars = useMemo(() => Array.from({ length: max }).map((_, i) => i + 1), [max]);

  const handleSelect = useCallback(
    (v: number) => {
      if (variant !== 'rating') return;
      onChange?.(v);
    },
    [onChange, variant]
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (variant !== 'rating') return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault();
        const next = Math.min(max, Math.max(1, (value || 0) + 1));
        onChange?.(next);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault();
        const prev = Math.max(1, Math.min(max, (value || 0) - 1));
        onChange?.(prev);
      } else if (e.key === 'Home') {
        e.preventDefault();
        onChange?.(1);
      } else if (e.key === 'End') {
        e.preventDefault();
        onChange?.(max);
      }
    },
    [onChange, variant, max, value]
  );

  // Use theme's warning color for stars (yellow/golden)
  const starActiveColor = theme.colors.warning;
  const starInactiveColor = theme.colors.borderLight;

  return (
    <div
      className={`inline-flex items-center ${labelVariant !== 'none' ? 'space-x-2' : ''} ${className}`}
      role={variant === 'rating' ? 'slider' : undefined}
      aria-valuemin={variant === 'rating' ? 1 : undefined}
      aria-valuemax={variant === 'rating' ? max : undefined}
      aria-valuenow={variant === 'rating' ? Math.round(value || 0) : undefined}
      tabIndex={variant === 'rating' ? 0 : undefined}
      onKeyDown={onKeyDown}
      aria-label={variant === 'rating' ? `Rate ${max} stars` : undefined}
    >
      <div className={`flex items-center ${size === 'xlg' ? 'gap-3' : 'gap-1'}`}>
        {stars.map((star) => {
          const fillLevel = Math.max(0, Math.min(1, (displayed || 0) - (star - 1)));
          const isInteractive = variant === 'rating';

          let shouldShowYellow = false;
          
          if (variant === 'display') {
            shouldShowYellow = fillLevel > 0;
          } else {
            if (hover !== null) {
              shouldShowYellow = star <= hover;
            } else {
              shouldShowYellow = star <= Math.round(value || 0);
            }
          }

          if (!isInteractive) {
            return (
              <span key={star} className={`relative flex-shrink-0 ${SIZE_MAP[size]}`}>
                <div className={`relative ${SIZE_MAP[size]}`}>
                  <StarIcon className={SIZE_MAP[size]} style={{ color: starInactiveColor }} />
                  {fillLevel > 0 && (
                    <div
                      style={{ 
                        width: `${Math.round(fillLevel * 100)}%`, 
                        overflow: 'hidden'
                      }}
                      className="absolute top-0 left-0 h-full"
                    >
                      <StarIcon 
                        className={`${SIZE_MAP[size]} absolute top-0 left-0`} 
                        style={{ color: starActiveColor }}
                      />
                    </div>
                  )}
                </div>
              </span>
            );
          }

          return (
            <button
              key={star}
              type="button"
              className={`relative p-0 leading-none cursor-pointer focus:outline-none flex-shrink-0 ${SIZE_MAP[size]}`}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setFocusIndex(star)}
              onBlur={() => setFocusIndex(null)}
              onClick={() => handleSelect(star)}
              aria-label={`${star} star`}
              aria-pressed={star <= Math.round(value || 0)}
            >
              <div className={`relative ${SIZE_MAP[size]}`}>
                <StarIcon className={SIZE_MAP[size]} style={{ color: starInactiveColor }} />
                {shouldShowYellow && (
                  <div className={`absolute top-0 left-0 ${SIZE_MAP[size]}`}>
                    <StarIcon className={SIZE_MAP[size]} style={{ color: starActiveColor }} />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {variant === 'display' && labelVariant !== 'none' && (
        <span className="text-sm" style={{ color: theme.colors.textMuted }}>
          {labelVariant === 'average' 
            ? `${Number(value).toFixed(1)}/${max}.0`
            : labelVariant === 'count' && ratingCount !== undefined
              ? `(${ratingCount})`
              : ''
          }
        </span>
      )}
    </div>
  );
}