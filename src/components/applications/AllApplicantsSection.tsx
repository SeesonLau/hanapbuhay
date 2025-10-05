'use client';

import { useState, useEffect, useRef } from 'react';
import { HiArrowDown } from 'react-icons/hi';
import ApplicantStatusCard from './cards/ApplicantStatusCard';

interface Applicant {
  name: string;
  status: 'Accepted' | 'Denied';
  rating: number;
  dateApplied: string;
}

export default function AllApplicantsSection() {
  const applicants: Applicant[] = [
    { name: 'Maria Santos', status: 'Accepted', rating: 4.5, dateApplied: 'Oct 5, 2025' },
    { name: 'Juan Dela Cruz', status: 'Denied', rating: 4.5, dateApplied: 'Oct 5, 2025' },
    { name: 'Ana Lopez', status: 'Denied', rating: 4.5, dateApplied: 'Oct 5, 2025' },
    { name: 'Carlos Reyes', status: 'Accepted', rating: 4.5, dateApplied: 'Oct 5, 2025' },
  ];

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
  }, [applicants]);

  return (
    <div className="relative">
      <p className="font-inter font-semibold text-gray-neutral900 mb-2">All Applicants</p>
      <div
        ref={scrollRef}
        className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4 justify-items-center p-2 max-h-[500px] overflow-y-auto scrollbar-hide scroll-smooth"
      >
        {applicants.map((applicant, index) => (
          <ApplicantStatusCard
            key={index}
            name={applicant.name}
            rating={applicant.rating}
            dateApplied={applicant.dateApplied}
            status={applicant.status}
          />
        ))}
      </div>

      {isScrollable && !isAtBottom && (
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-2 bg-gradient-to-t from-white/95 to-transparent text-sm text-gray-neutral500">
          <HiArrowDown className="w-4 h-4 animate-bounce" />
        </div>
      )}
    </div>
  );
}