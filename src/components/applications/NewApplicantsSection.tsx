'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { HiArrowDown } from 'react-icons/hi';
import ApplicantCard from './cards/ApplicantCard';

interface Applicant {
  userId: string;
  name: string;
  rating: number;
  dateApplied: string;
}

type SortOrder = 'newest' | 'oldest';

interface NewApplicantsSectionProps {
  sortOrder?: SortOrder;
}

export default function NewApplicantsSection({ sortOrder = 'newest' }: NewApplicantsSectionProps) {
  const applicants: Applicant[] = [
    { userId: '1', name: 'Maria Santos', rating: 4.7, dateApplied: 'Oct 5, 2025' },
    { userId: '2', name: 'Juan Dela Cruz', rating: 4.3, dateApplied: 'Oct 7, 2025' },
    { userId: '3', name: 'Ana Lopez', rating: 3.2, dateApplied: 'Oct 3, 2025' },
    { userId: '4', name: 'Carlos Reyes', rating: 5, dateApplied: 'Oct 8, 2025' },
    { userId: '5', name: 'Maria Santos', rating: 4.1, dateApplied: 'Oct 2, 2025' },
    { userId: '6', name: 'Juan Dela Cruz', rating: 4.0, dateApplied: 'Oct 6, 2025' },
    { userId: '7', name: 'Ana Lopez', rating: 4.5, dateApplied: 'Oct 4, 2025' },
  ];

  // Sort applicants based on sortOrder
  const sortedApplicants = useMemo(() => {
    return [...applicants].sort((a, b) => {
      const dateA = new Date(a.dateApplied).getTime();
      const dateB = new Date(b.dateApplied).getTime();
      
      // If sortOrder is 'newest', sort descending (newest first)
      // If sortOrder is 'oldest', sort ascending (oldest first)
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [sortOrder]);

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
  }, [sortedApplicants]);

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="rounded-lg max-h-[500px] overflow-y-auto scrollbar-hide py-2 px-2 snap-y snap-mandatory scroll-smooth"
        style={{
          scrollPaddingTop: '0.5rem',  
          scrollPaddingBottom: '0.5rem' 
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4 justify-items-center">
          {sortedApplicants.map((applicant, index) => (
            <div key={index} className="snap-start">
              <ApplicantCard
                userId={applicant.userId}
                name={applicant.name}
                rating={applicant.rating}
                dateApplied={applicant.dateApplied}
              />
            </div>
          ))}
        </div>
      </div>

      {isScrollable && !isAtBottom && (
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-2 bg-gradient-to-t from-white/95 to-transparent text-sm text-gray-neutral500">
          <HiArrowDown className="w-4 h-4 animate-bounce" />
        </div>
      )}
    </div>
  );
}