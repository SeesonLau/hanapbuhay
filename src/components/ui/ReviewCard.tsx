import React from 'react'
import StarRating from './StarRating'
import { useTheme } from '@/hooks/useTheme'

interface ReviewCardProps {
  rating: number
  reviewText: string
  reviewerName: string
  avatarUrl?: string
  className?: string
}

export default function ReviewCard({
  rating,
  reviewText,
  reviewerName,
  avatarUrl,
  className = ''
}: ReviewCardProps) {
  const { theme } = useTheme();

  // Generate initials from name for fallback avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase()
  }

  return (
    <div 
      className={`
        flex flex-col
        px-5 py-3
        w-full min-h-[81px]
        rounded-[10px]
        box-border
        transition-all duration-300
        ${className}
      `}
      style={{
        backgroundColor: theme.colors.cardBg,
        border: `1px solid ${theme.colors.cardBorder}`
      }}
    >
      {/* Header Row: Avatar + Name/Rating Column */}
      <div className="flex items-center gap-3 mb-2">
        {/* Avatar */}
        <div 
          className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center overflow-hidden transition-colors duration-300"
          style={{
            backgroundColor: theme.colors.pastelBg
          }}
        >
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt={reviewerName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span 
              className="text-tiny font-medium transition-colors duration-300"
              style={{
                color: theme.colors.pastelText
              }}
            >
              {getInitials(reviewerName)}
            </span>
          )}
        </div>

        {/* Name and Rating Column */}
        <div className="flex flex-col gap-0 flex-1">
          {/* Name */}
          <h4 
            className="text-mini font-alexandria font-semibold transition-colors duration-300"
            style={{
              color: theme.colors.text
            }}
          >
            {reviewerName}
          </h4>

          {/* Rating */}
          <StarRating
            variant="display"
            value={rating}
            labelVariant="none"
            size="sm"
          />
        </div>
      </div>

      {/* Review text - full width, aligned with left edge */}
      <p 
        className="text-mini font-alexandria font-light transition-colors duration-300"
        style={{
          color: theme.colors.textSecondary
        }}
      >
        {reviewText}
      </p>
    </div>
  )
}