'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
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
type MobileSection = 'new' | 'all';

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
  const [mobileSection, setMobileSection] = useState<MobileSection>('new');
  
  // Refresh triggers for both sections
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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

  const handleStatusChange = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  const toggleMobileSection = () => {
    setMobileSection(prev => prev === 'new' ? 'all' : 'new');
  };

  useEffect(() => {
    if (isOpen) {
      const prevHtml = document.documentElement.style.overflow;
      const prevBody = document.body.style.overflow;
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      return () => {
        document.documentElement.style.overflow = prevHtml;
        document.body.style.overflow = prevBody;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

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
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={handleOverlayClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-white rounded-lg shadow-lg w-full max-w-6xl p-4 md:p-4 p-2 relative mx-4"
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 20, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        {/* Header */}
        <div className="border-b pb-3 mb-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <h3 className="font-inter font-semibold text-gray-neutral800 text-sm sm:text-subtitle md:text-subtitle">
                {truncateTitle(title, 20)}
              </h3>
              <span className="font-inter font-semibold text-primary-primary400 text-xs sm:text-small md:text-small ml-2">
                • {applicantCount} Applicants
              </span>
            </div>

            <div className="flex items-center gap-4 mr-10">
              <div className="w-full max-w-lg hidden sm:block">
                <SearchBar
                  variant="simple"
                  placeholder="Search applicants..."
                  onSearch={handleSearch}
                />
              </div>
              
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 text-2xl leading-none text-gray-neutral600 hover:text-gray-800 transition-colors"
              >
                ×
              </button>
            </div>
          </div>

          <div className="w-full mt-3 sm:hidden">
            <SearchBar
              variant="simple"
              placeholder="Search applicants..."
              onSearch={handleSearch}
            />
          </div>
        </div>

        {/* Mobile Section Navigation */}
        <div className="sm:hidden flex items-center justify-center gap-3 mb-3">
          <button
            onClick={toggleMobileSection}
            disabled={mobileSection === 'new'}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <HiChevronLeft className="w-5 h-5 text-gray-neutral600" />
          </button>
          <span className="font-inter font-semibold text-gray-neutral800 text-sm">
            {mobileSection === 'new' ? 'New Applicants' : 'All Applicants'}
          </span>
          <button
            onClick={toggleMobileSection}
            disabled={mobileSection === 'all'}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <HiChevronRight className="w-5 h-5 text-gray-neutral600" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 overflow-y-auto max-h-[70vh] min-h-[60vh] px-4 md:px-0">
          <section className={`md:pr-4 md:border-r border-gray-neutral200 ${mobileSection === 'new' ? 'block' : 'hidden'} sm:block`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-inter text-sm sm:text-lead font-semibold text-gray-neutral800 hidden sm:block">
                New Applicants
              </h3>

              <div className="flex items-center gap-2 shrink-0 sm:ml-auto">
                <span className="text-gray-neutral400 text-xs sm:text-small font-medium whitespace-nowrap">
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
              refreshTrigger={refreshTrigger}
              onStatusChange={handleStatusChange}
            />
          </section>

          <section className={`md:pl-4 ${mobileSection === 'all' ? 'block' : 'hidden'} sm:block`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-inter text-sm sm:text-lead font-semibold text-gray-neutral800 hidden sm:block">
                All Applicants
              </h3>

              <div className="flex items-center gap-2 shrink-0 sm:ml-auto">
                <span className="text-gray-neutral400 text-xs sm:text-small font-medium whitespace-nowrap">
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
              refreshTrigger={refreshTrigger}
            />
          </section>
        </div>
      </motion.div>
    </motion.div>
  );
}