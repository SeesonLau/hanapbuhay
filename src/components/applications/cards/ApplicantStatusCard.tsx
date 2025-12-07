'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUserCircle } from 'react-icons/fa';
import Image from 'next/image';
import StarRating from '@/components/ui/StarRating';
import ChatIcon from '@/assets/chat.svg';
import ReviewIcon from '@/assets/review.svg';
import { RatingModal } from '@/components/modals/RatingModal';
import { useTheme } from '@/hooks/useTheme';

interface ApplicantStatusCardProps {
  userId: string;
  name: string;
  rating?: number;
  reviewCount?: number;
  dateApplied: string;
  status: 'Accepted' | 'Denied' | 'Completed';
  profilePicUrl?: string | null;
  onProfileClick?: () => void; 
}

export default function ApplicantStatusCard({
  userId,
  name,
  rating = 0,
  reviewCount = 0,
  dateApplied,
  status,
  profilePicUrl,
  onProfileClick
}: ApplicantStatusCardProps) {
  const { theme } = useTheme();
  const router = useRouter();
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  const handleChatClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    router.push('/chat');
  };

  const handleReviewClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    setIsRatingModalOpen(true);
  };

  const handleSubmitRating = (rating: number, comment: string) => {
    console.log('Rating submitted:', { userId, rating, comment });
  };

  const statusColors = status === 'Accepted'
    ? { color: theme.colors.success, borderColor: theme.colors.success }
    : { color: theme.colors.error, borderColor: theme.colors.error };

  const displayName = name.trim().split(/\s+/).slice(0, 2).join(' ');

  return (
    <div
      className="rounded-xl shadow-md p-4 md:p-3 w-full max-w-[300px] md:max-w-[240px] aspect-[300/172] md:aspect-[240/138] flex flex-col justify-between border transition-transform duration-200 ease-in-out hover:scale-[1.02] hover:shadow-lg cursor-pointer"
      style={{
        backgroundColor: theme.colors.cardBg,
        borderColor: theme.colors.cardBorder,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = theme.colors.cardHover;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = theme.colors.cardBg;
      }}
      onClick={onProfileClick} 
    >
      {/* Profile + Chat + Review */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3 md:gap-2">
          {profilePicUrl ? (
            <div className="relative w-[48px] h-[48px] md:w-[40px] md:h-[40px] rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={profilePicUrl}
                alt={`${name}'s profile`}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <FaUserCircle 
              className="w-[48px] h-[48px] md:w-[40px] md:h-[40px] flex-shrink-0"
              style={{ color: theme.colors.textMuted }}
            />
          )}
          <div className="flex flex-col min-w-0">
            <span 
              className="font-semibold text-small md:text-xs truncate" 
              title={name}
              style={{ color: theme.colors.text }}
            >
              {displayName}
            </span>
            <StarRating
              variant="display"
              value={rating}
              labelVariant="count"
              ratingCount={reviewCount}
              size="vs"
            />
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 md:gap-1.5 flex-shrink-0">
          <Image
            src={ChatIcon}
            alt="Chat"
            width={20}
            height={20}
            onClick={handleChatClick}
            className="cursor-pointer hover:opacity-80 transition-opacity md:w-[18px] md:h-[18px]"
          />
          {status === 'Accepted' && (
            <Image
              src={ReviewIcon}
              alt="Review"
              width={20}
              height={20}
              onClick={handleReviewClick}
              className="cursor-pointer hover:opacity-80 transition-opacity md:w-[18px] md:h-[18px]"
            />
          )}
        </div>
      </div>

      {/* Date Applied */}
      <div 
        className="font-inter text-mini md:text-[10px] mt-2 md:mt-1.5 text-center"
        style={{ color: theme.colors.textMuted }}
      >
        Applied On:{' '}
        <span 
          className="font-inter text-tiny md:text-[11px] font-medium"
          style={{ color: theme.colors.textSecondary }}
        >
          {dateApplied}
        </span>
      </div>

      <hr 
        className="mt-2 md:mt-1.5 border-t"
        style={{ borderColor: theme.colors.border }}
      />

      {/* Status */}
      <div className="mt-3 md:mt-2">
        <span
          className="text-tiny md:text-xs font-semibold px-4 md:px-3 h-[25px] md:h-[22px] flex items-center justify-center rounded-md w-full border"
          style={{
            color: statusColors.color,
            borderColor: statusColors.borderColor,
            backgroundColor: theme.colors.surface,
          }}
        >
          {status}
        </span>
      </div>

      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        workerName={name}
        onSubmit={handleSubmitRating}
      />
    </div>
  );
}
