'use client';

import React from 'react';
import NewApplicantsSection from '@/components/applications/NewApplicantsSection';
import AllApplicantsSection from '@/components/applications/AllApplicantsSection';
import SearchBar from '@/components/ui/SearchBar';

interface ApplicantsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ApplicantsModal({ isOpen, onClose }: ApplicantsModalProps) {
  if (!isOpen) return null;

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-6xl p-6 relative space-y-6">
        
        <div className="flex flex-col sm:flex-row items-center justify-between border-b pb-4 relative">
          <div className="absolute left-0 flex items-center gap-2 pl-6">
            <h2 className="text-2xl font-bold text-gray-800">Applicants</h2>
            <span className="text-gray-600 text-lg">(12)</span>
          </div>

          <div className="flex justify-center w-full">
            <div className="w-full sm:w-96">
              <SearchBar
                variant="simple"
                placeholder="Search applicants..."
                onSearch={handleSearch}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto max-h-[60vh] pr-2">
          <section className="border-r border-gray-200 pr-4">
            <NewApplicantsSection />
          </section>

          <section className="pl-4">
            <AllApplicantsSection />
          </section>
        </div>

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>
      </div>
    </div>
  );
}