'use client';

import { useState, useEffect, useRef } from 'react';
import { HiArrowDown } from 'react-icons/hi';
import ApplicantCard from './cards/ApplicantCard';

interface Applicant {
  name: string;
  rating: number;
  dateApplied: string;
}

export default function NewApplicantsSection() {
  const applicants: Applicant[] = [
    { name: 'Maria Santos', rating: 4.7, dateApplied: 'Oct 5, 2025' },
    { name: 'Juan Dela Cruz', rating: 4.3, dateApplied: 'Oct 5, 2025' },
    { name: 'Ana Lopez', rating: 3.2, dateApplied: 'Oct 5, 2025' },
    { name: 'Carlos Reyes', rating: 5, dateApplied: 'Oct 5, 2025' },
    { name: 'Maria Santos', rating: 4.1, dateApplied: 'Oct 5, 2025' },
    { name: 'Juan Dela Cruz', rating: 4.0, dateApplied: 'Oct 5, 2025' },
    { name: 'Ana Lopez', rating: 4.5, dateApplied: 'Oct 5, 2025' },
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
      <p className="font-inter font-semibold text-gray-neutral900 mb-2">New Applicants</p>
      <div
        ref={scrollRef}
        className="rounded-lg max-h-[500px] overflow-y-auto scrollbar-hide py-2 px-2 snap-y snap-mandatory scroll-smooth"
        style={{
          scrollPaddingTop: '0.5rem',  
          scrollPaddingBottom: '0.5rem' 
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4 justify-items-center">
          {applicants.map((applicant, index) => (
            <div key={index} className="snap-start">
              <ApplicantCard
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