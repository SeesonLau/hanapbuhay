'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { HiArrowDown } from 'react-icons/hi';
import ApplicantStatusCard from './cards/ApplicantStatusCard';
import { ApplicationService } from '@/lib/services/applications-services';
import { ProfileService } from '@/lib/services/profile-services';
import { ReviewService } from '@/lib/services/reviews-services';
import { ApplicationStatus } from '@/lib/constants/application-status';
import ViewProfileModal from '../modals/ViewProfileModal';
import { useTheme } from '@/hooks/useTheme';
import { supabase } from '@/lib/services/supabase/client'; // Added supabase import

interface Applicant {
  userId: string;
  name: string;
  status: 'Approved' | 'Rejected';
  rating: number;
  reviewCount: number;
  dateApplied: string;
  applicationId: string;
  profilePicUrl: string | null;
  hasBeenReviewed: boolean; // Added
}

type SortOrder = 'newest' | 'oldest';

interface AllApplicantsSectionProps {
  postId: string;
  sortOrder?: SortOrder;
  searchQuery?: string;
  refreshTrigger?: number;
  onStatusChange?: () => void;
}

export default function AllApplicantsSection({
  postId,
  sortOrder = 'newest',
  searchQuery = '',
  refreshTrigger = 0,
  onStatusChange,
}: AllApplicantsSectionProps) {
  const { theme } = useTheme();
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  const openProfileModal = (userId: string) => {
    setSelectedUserId(userId);
    setIsModalOpen(true);
  };

  const closeProfileModal = () => {
    setSelectedUserId(null);
    setIsModalOpen(false);
  };

  const fetchApplicants = useCallback(async () => {
    try {
      setLoading(true);

      const { data: { session } } = await supabase.auth.getSession(); // Get current user session
      const reviewerId = session?.user?.id;

      const { applications } = await ApplicationService.getApplicationsByPostId(postId, {
        status: [ApplicationStatus.APPROVED, ApplicationStatus.REJECTED],
        pageSize: 100,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      const applicantsWithProfiles = await Promise.all(
        applications.map(async (app) => {
          const displayName = await ProfileService.getDisplayNameByUserId(app.userId);
          const profileData = await ProfileService.getNameProfilePic(app.userId);
          const averageRating = await ReviewService.getAverageRating(app.userId);
          const totalReviews = await ReviewService.getTotalReviewsCountByUserId(app.userId);
          
          // Check if the current user (reviewerId) has already reviewed this worker for this post
          const hasBeenReviewed = reviewerId 
            ? await ReviewService.hasUserReviewedWorkerForPost(reviewerId, app.userId, postId)
            : false;

          const cardStatus: 'Approved' | 'Rejected' =
            app.status === ApplicationStatus.APPROVED ? 'Approved' : 'Rejected';

          return {
            userId: app.userId,
            name: displayName || 'Unknown Applicant',
            status: cardStatus,
            rating: averageRating || 0,
            reviewCount: totalReviews || 0,
            dateApplied: new Date(app.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }),
            applicationId: app.applicationId,
            profilePicUrl: profileData?.profilePicUrl || null,
            hasBeenReviewed: hasBeenReviewed, // Assign the result
          };
        })
      );

      setApplicants(applicantsWithProfiles);
    } catch (error) {
      console.error('Error fetching applicants:', error);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchApplicants();
  }, [fetchApplicants, refreshTrigger]);

  const filteredAndSortedApplicants = useMemo(() => {
    let filtered = applicants;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = applicants.filter(
        (applicant) =>
          applicant.name.toLowerCase().includes(query) ||
          applicant.userId.toLowerCase().includes(query) ||
          applicant.status.toLowerCase().includes(query)
      );
    }

    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.dateApplied).getTime();
      const dateB = new Date(b.dateApplied).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [applicants, sortOrder, searchQuery]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    setIsScrollable(el.scrollHeight > el.clientHeight);

    const handleScroll = () => {
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 10;
      setIsAtBottom(atBottom);
    };

    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, [filteredAndSortedApplicants]);

  const handleCardStatusChange = useCallback(
    (status: ApplicationStatus) => {
      console.log('Status changed to:', status);
      if (onStatusChange) {
        console.log('Calling parent onStatusChange');
        onStatusChange();
      }
    },
    [onStatusChange]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div 
          className="animate-spin rounded-full h-8 w-8 border-b-2"
          style={{ borderColor: theme.colors.primary }}
        ></div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 justify-items-center p-2 max-h-[350px] md:max-h-[500px] overflow-y-auto scrollbar-hide scroll-smooth"
      >
        {filteredAndSortedApplicants.length === 0 ? (
          <div 
            className="col-span-full text-center py-8"
            style={{ color: theme.colors.textMuted }}
          >
            {searchQuery.trim()
              ? `No applicants found matching "${searchQuery}"`
              : 'No accepted or denied applicants yet'}
          </div>
        ) : (
          filteredAndSortedApplicants.map((applicant, index) => (
            <ApplicantStatusCard
              key={`${applicant.applicationId}-${index}`}
              userId={applicant.userId}
              postId={postId}
              applicationId={applicant.applicationId}
              name={applicant.name}
              rating={applicant.rating}
              reviewCount={applicant.reviewCount}
              dateApplied={applicant.dateApplied}
              // Conditional status update
              status={
                applicant.hasBeenReviewed && applicant.status === 'Approved'
                  ? 'Completed'
                  : (applicant.status === 'Approved' ? 'Accepted' : 'Denied')
              }
              profilePicUrl={applicant.profilePicUrl}
              onProfileClick={() => openProfileModal(applicant.userId)}
            />
          ))
        )}
      </div>

      {isScrollable && !isAtBottom && filteredAndSortedApplicants.length > 0 && (
        <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center">
          <HiArrowDown 
            className="w-4 h-4 animate-bounce"
            style={{ color: theme.colors.textMuted }}
          />
        </div>
      )}

      {selectedUserId && (
        <ViewProfileModal
          userId={selectedUserId}
          isOpen={isModalOpen}
          onClose={closeProfileModal}
          userType="applicant"
        />
      )}
    </div>
  );
}
