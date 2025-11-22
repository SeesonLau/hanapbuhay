'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUserCircle } from 'react-icons/fa';
import Image from 'next/image';
import StarRating from '@/components/ui/StarRating';
import ChatIcon from '@/assets/chat.svg';
import ReviewIcon from '@/assets/review.svg';
import { RatingModal } from '@/components/modals/RatingModal';

interface ApplicantStatusCardProps {
  userId: string;
  name: string;
  rating?: number;
  reviewCount?: number;
  dateApplied: string;
  status: 'Accepted' | 'Denied' | 'Completed';
  profilePicUrl?: string | null;
  onProfileClick?: () => void; // modal trigger
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
  const router = useRouter();
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  const handleChatClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    router.push('/chat');
  };

  const handleReviewClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    setIsRatingModalOpen(true);
  };

  const handleSubmitRating = (rating: number, comment: string) => {
    console.log('Rating submitted:', { userId, rating, comment });
    // TODO: Implement API call to submit rating
  };

  const statusClasses =
    status === 'Accepted'
      ? 'text-[#71D852] border border-[#71D852]'
      : 'text-[#F87172] border border-[#F87172]';

  return (
    <div
      className="bg-white rounded-xl shadow-md p-4 w-full max-w-[300px] aspect-[300/172] flex flex-col justify-between border border-gray-neutral200 transition-transform duration-200 ease-in-out hover:scale-[1.02] hover:shadow-lg hover:bg-gray-50 cursor-pointer"
      onClick={onProfileClick} // entire card clickable
    >
      {/* Profile + Chat + Review */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          {profilePicUrl ? (
            <div className="relative w-[48px] h-[48px] rounded-full overflow-hidden">
              <Image
                src={profilePicUrl}
                alt={`${name}'s profile`}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <FaUserCircle className="text-gray-neutral400 w-[48px] h-[48px]" />
          )}
          <div className="flex flex-col">
            <span className="text-gray-neutral800 font-semibold text-small">{name}</span>
            <StarRating
              variant="display"
              value={rating}
              labelVariant="count"
              ratingCount={reviewCount}
              size="vs"
            />
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <Image
            src={ChatIcon}
            alt="Chat"
            width={20}
            height={20}
            onClick={handleChatClick}
            className="cursor-pointer hover:opacity-80 transition-opacity"
          />
          {status === 'Accepted' && (
            <Image
              src={ReviewIcon}
              alt="Review"
              width={20}
              height={20}
              onClick={handleReviewClick}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            />
          )}
        </div>
      </div>

      {/* Date Applied */}
      <div className="font-inter text-mini text-gray-neutral300 mt-2 text-center">
        Applied On:{' '}
        <span className="font-inter text-tiny font-medium text-gray-neutral500">
          {dateApplied}
        </span>
      </div>

      <hr className="mt-2 border-t border-gray-neutral200" />

      {/* Status */}
      <div className="mt-3">
        <span
          className={`text-tiny font-semibold px-4 h-[25px] flex items-center justify-center rounded-md bg-white w-full ${statusClasses}`}
        >
          {status}
        </span>
      </div>

      {/* Rating Modal */}
      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        workerName={name}
        onSubmit={handleSubmitRating}
      />
    </div>
  );
}
