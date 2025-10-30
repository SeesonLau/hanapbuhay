'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { HiArrowDown } from 'react-icons/hi';
import ApplicantStatusCard from './cards/ApplicantStatusCard';
import { ApplicationService } from '@/lib/services/applications-services';
import { ProfileService } from '@/lib/services/profile-services';
import { ApplicationStatus } from '@/lib/constants/application-status';
import { toast } from 'react-hot-toast';

interface Applicant {
  userId: string;
  name: string;
  status: 'Approved' | 'Rejected';
  rating: number;
  dateApplied: string;
  applicationId: string;
}

type SortOrder = 'newest' | 'oldest';

interface AllApplicantsSectionProps {
  postId: string;
  sortOrder?: SortOrder;
  searchQuery?: string;
  refreshTrigger?: number;
}

export default function AllApplicantsSection({ 
  postId,
  sortOrder = 'newest',
  searchQuery = '',
  refreshTrigger = 0
}: AllApplicantsSectionProps) {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        setLoading(true);
        
        const { applications } = await ApplicationService.getApplicationsByPostId(
          postId,
          {
            status: [ApplicationStatus.APPROVED, ApplicationStatus.REJECTED],
            pageSize: 100,
            sortBy: 'createdAt',
            sortOrder: 'desc'
          }
        );

        const applicantsWithProfiles = await Promise.all(
          applications.map(async (app) => {
            const profileData = await ProfileService.getNameProfilePic(app.userId);

            const cardStatus: 'Approved' | 'Rejected' =
              app.status === ApplicationStatus.APPROVED ? 'Approved' : 'Rejected';

            return {
              userId: app.userId,
              name: profileData?.name || 'Unknown Applicant',
              status: cardStatus,
              rating: 0,
              dateApplied: new Date(app.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              }),
              applicationId: app.applicationId
            };
          })
        );

        setApplicants(applicantsWithProfiles);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [postId, refreshTrigger]); 

  // Filter and sort applicants
  const filteredAndSortedApplicants = useMemo(() => {
    // Filter by search query
    let filtered = applicants;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = applicants.filter(applicant => 
        applicant.name.toLowerCase().includes(query) ||
        applicant.userId.toLowerCase().includes(query) ||
        applicant.status.toLowerCase().includes(query)
      );
    }

    // Sort by date
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

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [filteredAndSortedApplicants]);

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
        className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4 justify-items-center p-2 max-h-[500px] overflow-y-auto scrollbar-hide scroll-smooth"
      >
        {filteredAndSortedApplicants.length === 0 ? (
          <div className="col-span-2 text-center py-8 text-gray-neutral400">
            {searchQuery.trim() 
              ? `No applicants found matching "${searchQuery}"`
              : 'No accepted or denied applicants yet'
            }
          </div>
        ) : (
          filteredAndSortedApplicants.map((applicant, index) => (
            <ApplicantStatusCard
              key={`${applicant.applicationId}-${index}`}
              userId={applicant.userId}
              name={applicant.name}
              rating={applicant.rating}
              dateApplied={applicant.dateApplied}
              status={applicant.status === 'Approved' ? 'Accepted' : 'Denied'}
            />
          ))
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