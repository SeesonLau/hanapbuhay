'use client';

import React from 'react';
import NewApplicantsSection from '@/components/applications/NewApplicantsSection';
import AllApplicantsSection from '@/components/applications/AllApplicantsSection';
import SearchBar from '@/components/ui/SearchBar';

interface ApplicantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  applicantCount?: number;
}

export default function ApplicantsModal({ 
  isOpen, 
  onClose, 
  title = "Frontend Developer", 
  applicantCount = 12 
}: ApplicantsModalProps) {
  if (!isOpen) return null;

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
  };

  const truncateTitle = (text: string, maxLength: number = 30) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-6xl p-4 relative">
        
        <div className="flex items-center justify-between border-b pb-3 gap-4 mb-3">
          <div className="flex items-center gap-2">
            <h2 className="font-inter text-title font-semibold text-gray-neutral800">{truncateTitle(title)}</h2>
            <span className="font-inter font-semibold text-primary-primary400 text-small ml-2"> • {applicantCount} Applicants</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-full max-w-lg">
              <SearchBar
                variant="simple"
                placeholder="Search applicants..."
                onSearch={handleSearch}
              />
            </div>
            
            <button
              onClick={onClose}
              className="text-gray-neutral500 hover:text-gray-neutral700 text-xl flex-shrink-0"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 overflow-y-auto max-h-[70vh]">
          <section className="border-r border-gray-neutral200 pr-4">
            <NewApplicantsSection />
          </section>

          <section className="pl-4">
            <AllApplicantsSection />
          </section>
        </div>
      </div>
    </div>
  );
}