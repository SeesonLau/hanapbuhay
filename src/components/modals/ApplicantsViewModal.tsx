'use client';

import React, { useState } from 'react';
import NewApplicantsSection from '@/components/applications/NewApplicantsSection';
import AllApplicantsSection from '@/components/applications/AllApplicantsSection';
import SearchBar from '@/components/ui/SearchBar';
import Sort from '../ui/Sort';
import { DropdownOption } from '../ui/Dropdown';

interface ApplicantsModalProps {
  postId?: string;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  applicantCount?: number;
}

type SortOrder = 'newest' | 'oldest';

export default function ApplicantsModal({ 
  postId,
  isOpen, 
  onClose, 
  title = "", 
  applicantCount = 0 
}: ApplicantsModalProps) {
  const [newApplicantsSort, setNewApplicantsSort] = useState<SortOrder>('newest');
  const [allApplicantsSort, setAllApplicantsSort] = useState<SortOrder>('newest');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const truncateTitle = (text: string, maxLength: number = 30) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  const mapSortValue = (value: string): SortOrder => {
    switch (value) {
      case 'latest': return 'newest';
      case 'oldest': return 'oldest';
      default: return 'newest';
    }
  };

  const handleSortChangeNew = (option: DropdownOption) => {
    setNewApplicantsSort(mapSortValue(String(option.value ?? 'latest')));
  };

  const handleSortChangeAll = (option: DropdownOption) => {
    setAllApplicantsSort(mapSortValue(String(option.value ?? 'latest')));
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Show error if postId is missing
  if (!postId) {
    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        onClick={handleOverlayClick}
      >
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">Post ID is required to view applicants.</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-primary-400 text-white rounded hover:bg-primary-500"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-6xl p-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3 gap-4 mb-3">
          <div className="flex items-center gap-2">
            <h2 className="font-inter text-title font-semibold text-gray-neutral800">
              {truncateTitle(title)}
            </h2>
            <span className="font-inter font-semibold text-primary-primary400 text-small ml-2">
              • {applicantCount} Applicants
            </span>
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
              className="ml-4 -mt-8 text-gray-neutral500 hover:text-gray-neutral700 text-xl flex-shrink-0"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 overflow-y-auto max-h-[70vh] min-h-[60vh]">
          <section className="border-r border-gray-neutral200 pr-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-inter text-lead font-semibold text-gray-neutral800">
                New Applicants
              </h3>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-gray-neutral400 text-small font-medium whitespace-nowrap">
                  Sort by
                </span>
                <div className="w-auto px-2">
                  <Sort
                    variant="manageJobs"
                    onChange={handleSortChangeNew}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <NewApplicantsSection 
              postId={postId}
              sortOrder={newApplicantsSort} 
              searchQuery={searchQuery}
            />
          </section>

          <section className="pl-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-inter text-lead font-semibold text-gray-neutral800">
                All Applicants
              </h3>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-gray-neutral400 text-small font-medium whitespace-nowrap">
                  Sort by
                </span>
                <div className="w-auto px-2">
                  <Sort
                    variant="manageJobs"
                    onChange={handleSortChangeAll}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <AllApplicantsSection 
              postId={postId}
              sortOrder={allApplicantsSort}
              searchQuery={searchQuery}
            />
          </section>
        </div>
      </div>
    </div>
  );
}