'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { HiArrowDown } from 'react-icons/hi';
import ApplicantStatusCard from './cards/ApplicantStatusCard';

interface Applicant {
  userId: string;
  name: string;
  status: 'Accepted' | 'Denied';
  rating: number;
  dateApplied: string;
}

type SortOrder = 'newest' | 'oldest';

interface AllApplicantsSectionProps {
  sortOrder?: SortOrder;
  searchQuery?: string;
}

export default function AllApplicantsSection({ 
  sortOrder = 'newest',
  searchQuery = ''
}: AllApplicantsSectionProps) {
  const applicants: Applicant[] = [
    { userId: '1', name: 'Maria Santos', status: 'Accepted', rating: 4.5, dateApplied: 'Oct 5, 2025' },
    { userId: '2', name: 'Juan Dela Cruz', status: 'Denied', rating: 4.5, dateApplied: 'Oct 8, 2025' },
    { userId: '3', name: 'Ana Lopez', status: 'Denied', rating: 4.5, dateApplied: 'Oct 2, 2025' },
    { userId: '4', name: 'Carlos Reyes', status: 'Accepted', rating: 4.5, dateApplied: 'Oct 7, 2025' },
  ];

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
  }, [sortOrder, searchQuery]);

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

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4 justify-items-center p-2 max-h-[500px] overflow-y-auto scrollbar-hide scroll-smooth"
      >
        {filteredAndSortedApplicants.length === 0 ? (
          <div className="col-span-2 text-center py-8 text-gray-neutral400">
            No applicants found matching "{searchQuery}"
          </div>
        ) : (
          filteredAndSortedApplicants.map((applicant, index) => (
            <ApplicantStatusCard
              key={`${applicant.userId}-${index}`}
              userId={applicant.userId}
              name={applicant.name}
              rating={applicant.rating}
              dateApplied={applicant.dateApplied}
              status={applicant.status}
            />
          ))
        )}
      </div>

      {isScrollable && !isAtBottom && filteredAndSortedApplicants.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-2 bg-gradient-to-t from-white/95 to-transparent text-sm text-gray-neutral500">
          <HiArrowDown className="w-4 h-4 animate-bounce" />
        </div>
      )}
    </div>
  );
}