'use client';

import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import Image from 'next/image';
import ChatIcon from '@/assets/chat.svg';
import Button from '@/components/ui/Button';
import StarRating from '@/components/ui/StarRating';
import { ApplicationService } from '@/lib/services/applications-services';
import { ApplicationStatus } from '@/lib/constants/application-status';
import { toast } from 'react-hot-toast';

interface ApplicantCardProps {
  applicationId: string; 
  userId: string;
  name: string;
  rating: number;
  dateApplied: string;
  onStatusChange?: (status: ApplicationStatus) => void; 
}

export default function ApplicantCard({
  applicationId,
  userId,
  name,
  rating,
  dateApplied,
  onStatusChange
}: ApplicantCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [averageRating, setAverageRating] = useState<number>(4.6);
  const [reviewCount, setReviewCount] = useState<number>(12);

  const handleStatusChange = async (newStatus: ApplicationStatus) => {
    try {
      setIsLoading(true);
      await ApplicationService.updateApplicationStatus(applicationId, newStatus, userId);

      if (onStatusChange) onStatusChange(newStatus);
    } catch (error) {
      console.error(error);
      toast.error('Failed to update application status.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 w-full max-w-[300px] aspect-[300/172] flex flex-col justify-between border border-gray-neutral200 transition-transform duration-200 ease-in-out hover:scale-[1.02] hover:shadow-lg hover:bg-gray-50">
      {/* Profile + Chat */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <FaUserCircle className="text-gray-neutral400 w-[48px] h-[48px]" />
          <div className="flex flex-col">
            <span className="text-gray-neutral800 font-semibold text-small">{name}</span>
            <StarRating
              variant="display"
              value={averageRating}
              labelVariant="count"
              ratingCount={reviewCount}
              size="sm"
            />
          </div>
        </div>

        <Image
          src={ChatIcon}
          alt="Chat"
          width={20}
          height={20}
          className="cursor-pointer hover:opacity-80 transition-opacity"
        />
      </div>

      {/* Date Applied */}
      <div className="font-inter text-mini text-gray-neutral300 mt-2 text-center">
        Applied On:{' '}
        <span className="font-inter text-mini font-medium text-gray-neutral500">
          {dateApplied}
        </span>
      </div>

      <hr className="mt-2 border-t border-gray-neutral200" />

      {/* Approve / Deny Buttons */}
      <div className="flex justify-between gap-3 mt-3">
        <Button
          variant="approve"
          size="approveDeny"
          disabled={isLoading}
          onClick={() => handleStatusChange(ApplicationStatus.APPROVED)}
        >
          Approve
        </Button>
        <Button
          variant="deny"
          size="approveDeny"
          disabled={isLoading}
          onClick={() => handleStatusChange(ApplicationStatus.REJECTED)}
        >
          Deny
        </Button>
      </div>
    </div>
  );
}
