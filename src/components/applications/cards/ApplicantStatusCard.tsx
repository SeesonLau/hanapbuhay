'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaUserCircle, FaStar } from 'react-icons/fa';
import Image from 'next/image';
import ChatIcon from '@/assets/chat.svg';
import StarRating from '@/components/ui/StarRating';
import ReviewIcon from '@/assets/review.svg';

interface ApplicantStatusCardProps {
  userId: string;
  name: string;
  rating?: number;
  reviewCount?: number;
  dateApplied: string;
  status: 'Accepted' | 'Denied' | 'Completed';
  profilePicUrl?: string | null;
}

export default function ApplicantStatusCard({
  name,
  rating = 0,
  reviewCount = 0,
  dateApplied,
  status,
  profilePicUrl,
}: ApplicantStatusCardProps) {
  const router = useRouter();

  /*
  const handleChatClick = () => {
    router.push(`/chat/${userId}`);
  }; */

  const handleChatClick = () => {
    router.push('/chat');
  };

  const statusClasses =
    status === 'Accepted'
      ? 'text-[#71D852] border border-[#71D852]'
      : 'text-[#F87172] border border-[#F87172]';
      

  return (
    <div className="bg-white rounded-xl shadow-md p-4 w-full max-w-[300px] aspect-[300/172] flex flex-col justify-between border border-gray-neutral200 hover:scale-[1.02] transition-transform duration-200 ease-in-out hover:shadow-lg hover:bg-gray-50">
      {/* Profile + Chat */}
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

        {/* Chat + Review */}
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
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => {
                console.log('Review clicked');
              }}
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
    </div>
  );
}