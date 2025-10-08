  import React, { useCallback, useMemo, useState } from 'react'

  type Variant = 'display' | 'rating'

  type Appearance = 'compact' | 'normal' | 'large'

  interface StarRatingProps {
    variant?: Variant
    value?: number 
    onChange?: (v: number) => void 
    size?: 'sm' | 'md' | 'lg' 
    className?: string
    max?: number
    appearance?: Appearance 
  }

  const SIZE_MAP: Record<string, string> = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  // star svg path
  function StarIcon(props: { className?: string }) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        className={props.className}
      >
        <path d="M12 .587l3.668 7.431L23.4 9.75l-5.7 5.557L19.6 24 12 19.897 4.4 24l1.9-8.693L.6 9.75l7.732-1.732L12 .587z" />
      </svg>
    )
  }

  export default function StarRating({
    variant = 'display',
    value = 0,
    onChange,
    size = 'md',
    className = '',
    max = 5,
    appearance = 'normal',
  }: StarRatingProps) {
    const [hover, setHover] = useState<number | null>(null)
    const [focusIndex, setFocusIndex] = useState<number | null>(null)

    const displayed = variant === 'rating' && hover != null ? hover : value

    const stars = useMemo(() => Array.from({ length: max }).map((_, i) => i + 1), [max])

    const handleSelect = useCallback(
      (v: number) => {
        if (variant !== 'rating') return
        onChange?.(v)
      },
      [onChange, variant]
    )

    const onKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (variant !== 'rating') return
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
          e.preventDefault()
          const next = Math.min(max, Math.max(1, (value || 0) + 1))
          onChange?.(next)
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
          e.preventDefault()
          const prev = Math.max(1, Math.min(max, (value || 0) - 1))
          onChange?.(prev)
        } else if (e.key === 'Home') {
          e.preventDefault()
          onChange?.(1)
        } else if (e.key === 'End') {
          e.preventDefault()
          onChange?.(max)
        }
      },
      [onChange, variant, max, value]
    )

    return (
      <div
        className={`inline-flex items-center space-x-2 ${className}`}
        role={variant === 'rating' ? 'slider' : undefined}
        aria-valuemin={variant === 'rating' ? 1 : undefined}
        aria-valuemax={variant === 'rating' ? max : undefined}
        aria-valuenow={variant === 'rating' ? Math.round(value || 0) : undefined}
        tabIndex={variant === 'rating' ? 0 : undefined}
        onKeyDown={onKeyDown}
        aria-label={variant === 'rating' ? `Rate ${max} stars` : undefined}
      >
        <div className="flex items-center gap-1">
          {stars.map((star) => {
            const fillLevel = Math.max(0, Math.min(1, (displayed || 0) - (star - 1)))
            const isInteractive = variant === 'rating'

            // For display variant: show stars based on the actual value
            // For interactive variant: show stars based on hover (if hovering) or current value
            let shouldShowYellow = false
            
            if (variant === 'display') {
              // Display variant: show partial fill based on actual value
              shouldShowYellow = fillLevel > 0
            } else {
              // Interactive variant: when hovering, show stars 1 through N as yellow
              // when not hovering, show stars based on current value
              if (hover !== null) {
                shouldShowYellow = star <= hover
              } else {
                shouldShowYellow = star <= Math.round(value || 0)
              }
            }

            // non-interactive display: render a span with no hover effects or pointer cursor
            if (!isInteractive) {
              return (
                <span key={star} className={`relative p-0 leading-none ${SIZE_MAP[size]}`}>
                  <div className="relative inline-block">
                    {/* Background gray star */}
                    <StarIcon className={`${SIZE_MAP[size]} text-gray-300`} />
                    {/* Yellow fill based on fillLevel */}
                    {fillLevel > 0 && (
                      <div
                        style={{ 
                          width: `${Math.round(fillLevel * 100)}%`, 
                          overflow: 'hidden'
                        }}
                        className="absolute top-0 left-0 h-full"
                      >
                        <StarIcon className={`${SIZE_MAP[size]} text-yellow-400 absolute top-0 left-0`} />
                      </div>
                    )}
                  </div>
                </span>
              )
            }

            // interactive: use button with hover handlers
            return (
              <button
                key={star}
                type="button"
                className={`relative p-0 leading-none cursor-pointer focus:outline-none ${SIZE_MAP[size]}`}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setFocusIndex(star)}
                onBlur={() => setFocusIndex(null)}
                onClick={() => handleSelect(star)}
                aria-label={`${star} star`}
                aria-pressed={star <= Math.round(value || 0)}
              >
                <div className="relative inline-block">
                  {/* background empty star (gray) */}
                  <StarIcon className={`text-gray-300 ${SIZE_MAP[size]} absolute inset-0`} />
                  {/* filled star (yellow) - show full star when should be yellow */}
                  {shouldShowYellow && (
                    <div
                      style={{ color: '#F9CE41' }}
                      className="absolute top-0 left-0 h-full w-full"
                    >
                      <StarIcon className={`${SIZE_MAP[size]} relative`} />
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {variant === 'display' && (
          <span className="text-sm text-gray-600">
            {Number(value).toFixed(1)}/{max}.0
          </span>
        )}
      </div>
    )
  }
