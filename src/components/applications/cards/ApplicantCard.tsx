'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaUserCircle } from 'react-icons/fa';
import Image from 'next/image';
import ChatIcon from '@/assets/chat.svg';
import Button from '@/components/ui/Button';
import StarRating from '@/components/ui/StarRating';
import { ApplicationService } from '@/lib/services/applications-services';
import { ApplicationStatus } from '@/lib/constants/application-status';
import { AuthService } from '@/lib/services/auth-services';
import { toast } from 'react-hot-toast';

interface ApplicantCardProps {
  applicationId: string;
  userId: string;
  name: string;
  rating: number;
  reviewCount: number;
  dateApplied: string;
  profilePicUrl?: string | null;
  onStatusChange?: (status: ApplicationStatus) => void;
  onProfileClick?: () => void;
}

export default function ApplicantCard({
  applicationId,
  name,
  rating,
  reviewCount,
  dateApplied,
  profilePicUrl,
  onStatusChange,
  onProfileClick
}: ApplicantCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const router = useRouter();

  // Get current user (employer) on mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = await AuthService.getCurrentUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    };
    fetchCurrentUser();
  }, []);

  const handleStatusChange = async (newStatus: ApplicationStatus) => {
    if (!currentUserId) {
      toast.error('Unable to identify current user');
      return;
    }

    try {
      setIsLoading(true);
      
      await ApplicationService.updateApplicationStatus(
        applicationId, 
        newStatus, 
        currentUserId // Current logged-in user (employer)
      );

      if (onStatusChange) onStatusChange(newStatus);
    } catch (error) {
      console.error('Error updating application status:', error);
      toast.error('Failed to update application status.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push('/chat');
  };

  // Extract first 2 words of the name
  const displayName = name.trim().split(/\s+/).slice(0, 2).join(' ');

  return (
    <div
      className="bg-white rounded-xl shadow-md p-4 md:p-3 w-full max-w-[300px] md:max-w-[240px] aspect-[300/172] md:aspect-[240/138] flex flex-col justify-between border border-gray-neutral200 transition-transform duration-200 ease-in-out hover:scale-[1.02] hover:shadow-lg hover:bg-gray-50 cursor-pointer"
      onClick={onProfileClick}
    >
      {/* Profile + Chat */}
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
            <FaUserCircle className="text-gray-neutral400 w-[48px] h-[48px] md:w-[40px] md:h-[40px] flex-shrink-0" />
          )}
          <div className="flex flex-col min-w-0">
            <span className="text-gray-neutral800 font-semibold text-small md:text-xs truncate" title={name}>
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

        <Image
          src={ChatIcon}
          alt="Chat"
          width={20}
          height={20}
          onClick={handleChatClick}
          className="cursor-pointer hover:opacity-80 transition-opacity md:w-[18px] md:h-[18px] flex-shrink-0"
        />
      </div>

      {/* Date Applied */}
      <div className="font-inter text-mini md:text-[10px] text-gray-neutral300 mt-2 md:mt-1.5 text-center">
        Applied On:{' '}
        <span className="font-inter text-tiny md:text-[11px] font-medium text-gray-neutral500">
          {dateApplied}
        </span>
      </div>

      <hr className="mt-2 md:mt-1.5 border-t border-gray-neutral200" />

      {/* Approve / Deny Buttons */}
      <div className="flex justify-between gap-3 md:gap-2 mt-3 md:mt-2">
        <Button
          variant="approve"
          size="approveDeny"
          disabled={isLoading}
          onClick={(e) => { e.stopPropagation(); handleStatusChange(ApplicationStatus.APPROVED); }}
          className="md:text-xs md:py-1.5 md:px-3"
        >
          Approve
        </Button>
        <Button
          variant="deny"
          size="approveDeny"
          disabled={isLoading}
          onClick={(e) => { e.stopPropagation(); handleStatusChange(ApplicationStatus.REJECTED); }}
          className="md:text-xs md:py-1.5 md:px-3"
        >
          Deny
        </Button>
      </div>
    </div>
  );
}