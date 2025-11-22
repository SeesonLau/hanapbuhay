import React from 'react'
import StarRating from './StarRating'

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
    <div className={`
      flex flex-col
      px-5 py-3
      w-full min-h-[81px]
      bg-white
      border border-gray-neutral300
      rounded-[10px]
      box-border
      ${className}
    `}>
      {/* Header Row: Avatar + Name/Rating Column */}
      <div className="flex items-center gap-3 mb-2">
        {/* Avatar */}
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center overflow-hidden">
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt={reviewerName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-tiny font-medium text-purple-700">
              {getInitials(reviewerName)}
            </span>
          )}
        </div>

        {/* Name and Rating Column */}
        <div className="flex flex-col gap-0 flex-1">
          {/* Name */}
          <h4 className="text-mini font-alexandria font-semibold text-gray-neutral900">
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
      <p className="text-mini font-alexandria font-light text-gray-neutral600">
        {reviewText}
      </p>
    </div>
  )
}