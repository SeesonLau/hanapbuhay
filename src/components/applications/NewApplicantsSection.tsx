'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { HiArrowDown } from 'react-icons/hi';
import ApplicantCard from './cards/ApplicantCard';
import { ApplicationService } from '@/lib/services/applications-services';
import { ProfileService } from '@/lib/services/profile-services';
import { ApplicationStatus } from '@/lib/constants/application-status';
import { toast } from 'react-hot-toast';

interface Applicant {
  userId: string;
  name: string;
  rating: number;
  dateApplied: string;
  applicationId: string;
}

type SortOrder = 'newest' | 'oldest';

interface NewApplicantsSectionProps {
  postId: string;
  sortOrder?: SortOrder;
  searchQuery?: string;
  refreshTrigger?: number;
  onStatusChange?: () => void;
}

export default function NewApplicantsSection({
  postId,
  sortOrder = 'newest',
  searchQuery = '',
  refreshTrigger = 0,
  onStatusChange,
}: NewApplicantsSectionProps) {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const fetchApplicants = useCallback(async () => {
    try {
      setLoading(true);

      const { applications, count } = await ApplicationService.getApplicationsByPostId(postId, {
        status: [ApplicationStatus.PENDING],
        pageSize: 100,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      setTotalCount(count);

      const applicantsWithProfiles = await Promise.all(
        applications.map(async (app) => {
          const profileData = await ProfileService.getNameProfilePic(app.userId);

          return {
            userId: app.userId,
            name: profileData?.name || 'Unknown Applicant',
            rating: 0, // placeholder
            dateApplied: new Date(app.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }),
            applicationId: app.applicationId,
          };
        })
      );

      setApplicants(applicantsWithProfiles);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchApplicants();
  }, [fetchApplicants, refreshTrigger]);

  // Filter and sort applicants
  const filteredAndSortedApplicants = useMemo(() => {
    let filtered = applicants;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = applicants.filter(
        (applicant) =>
          applicant.name.toLowerCase().includes(query) ||
          applicant.userId.toLowerCase().includes(query)
      );
    }

    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.dateApplied).getTime();
      const dateB = new Date(b.dateApplied).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [applicants, sortOrder, searchQuery]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

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

  const handleCardStatusChange = useCallback((status: ApplicationStatus) => {
    console.log('Status changed to:', status); 
    if (onStatusChange) {
      console.log('Calling parent onStatusChange'); 
      onStatusChange();
    }
  }, [onStatusChange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="rounded-lg max-h-[500px] overflow-y-auto scrollbar-hide py-2 px-2 snap-y snap-mandatory scroll-smooth"
        style={{
          scrollPaddingTop: '0.5rem',
          scrollPaddingBottom: '0.5rem',
        }}
      >
        {filteredAndSortedApplicants.length === 0 ? (
          <div className="text-center py-8 text-gray-neutral400">
            {searchQuery.trim()
              ? `No applicants found matching "${searchQuery}"`
              : 'No pending applicants yet'}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4 justify-items-center">
            {filteredAndSortedApplicants.map((applicant, index) => (
              <div key={`${applicant.applicationId}-${index}`} className="snap-start">
                <ApplicantCard
                  applicationId={applicant.applicationId} 
                  userId={applicant.userId}
                  name={applicant.name}
                  rating={applicant.rating}
                  dateApplied={applicant.dateApplied}
                  onStatusChange={handleCardStatusChange}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {isScrollable && !isAtBottom && filteredAndSortedApplicants.length > 0 && (
        <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center">
          <HiArrowDown className="w-4 h-4 animate-bounce text-gray-neutral500" />
        </div>
      )}
    </div>
  );
}