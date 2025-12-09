'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import NewApplicantsSection from '@/components/applications/NewApplicantsSection';
import AllApplicantsSection from '@/components/applications/AllApplicantsSection';
import SearchBar from '@/components/ui/SearchBar';
import Sort from '../ui/Sort';
import { DropdownOption } from '../ui/Dropdown';
import { useTheme } from '@/hooks/useTheme';

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
  const { theme } = useTheme();
  const [newApplicantsSort, setNewApplicantsSort] = useState<SortOrder>('newest');
  const [allApplicantsSort, setAllApplicantsSort] = useState<SortOrder>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSection, setMobileSection] = useState<MobileSection>('new');
  
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSearch = (query: string) => {
    setSearchQuery(query);  
  };

  const truncateTitle = (text: string, maxLength: number = 50) => {
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

  if (!postId) {
    return (
      <div
        className="fixed inset-0 flex justify-center items-center z-50"
        style={{ backgroundColor: theme.modal.overlay }}
        onClick={handleOverlayClick}
      >
        <div 
          className="rounded-lg shadow-lg w-full max-w-md p-6 relative"
          style={{ backgroundColor: theme.modal.background }}
        >
          <h2 
            className="text-xl font-semibold mb-4"
            style={{ color: theme.colors.error }}
          >
            Error
          </h2>
          <p style={{ color: theme.colors.textMuted }}>
            Post ID is required to view applicants.
          </p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 rounded transition-colors"
            style={{ 
              backgroundColor: theme.colors.primary,
              color: '#fff'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = theme.colors.primaryHover}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = theme.colors.primary}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="fixed inset-0 flex justify-center items-center z-50"
      style={{ backgroundColor: theme.modal.overlay }}
      onClick={handleOverlayClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="rounded-lg shadow-lg w-full max-w-6xl max-h-[85vh] sm:max-h-[90vh] p-4 md:p-4 p-2 relative mx-4 flex flex-col"
        style={{ backgroundColor: theme.modal.background }}
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 20, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        {/* Header */}
        <div 
          className="pb-3 mb-3"
          style={{ borderBottom: `1px solid ${theme.modal.headerBorder}` }}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <h3 
                className="font-inter font-semibold text-sm sm:text-subtitle md:text-subtitle"
                style={{ color: theme.colors.text }}
              >
                {truncateTitle(title, 50)}
              </h3>
              <span 
                className="font-inter font-semibold text-xs sm:text-small md:text-small ml-2"
                style={{ color: theme.colors.primary }}
              >
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
                className="absolute top-4 right-4 z-10 text-2xl leading-none transition-colors"
                style={{ color: theme.modal.buttonClose }}
                onMouseOver={(e) => e.currentTarget.style.color = theme.modal.buttonCloseHover}
                onMouseOut={(e) => e.currentTarget.style.color = theme.modal.buttonClose}
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
            className="p-2 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ 
              backgroundColor: mobileSection === 'new' ? 'transparent' : theme.colors.surfaceHover 
            }}
            onMouseOver={(e) => {
              if (mobileSection !== 'new') {
                e.currentTarget.style.backgroundColor = theme.colors.surfaceHover;
              }
            }}
            onMouseOut={(e) => {
              if (mobileSection !== 'new') {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <HiChevronLeft 
              className="w-5 h-5" 
              style={{ color: theme.colors.textMuted }}
            />
          </button>
          <span 
            className="font-inter font-semibold text-sm"
            style={{ color: theme.colors.text }}
          >
            {mobileSection === 'new' ? 'New Applicants' : 'All Applicants'}
          </span>
          <button
            onClick={toggleMobileSection}
            disabled={mobileSection === 'all'}
            className="p-2 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ 
              backgroundColor: mobileSection === 'all' ? 'transparent' : theme.colors.surfaceHover 
            }}
            onMouseOver={(e) => {
              if (mobileSection !== 'all') {
                e.currentTarget.style.backgroundColor = theme.colors.surfaceHover;
              }
            }}
            onMouseOut={(e) => {
              if (mobileSection !== 'all') {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <HiChevronRight 
              className="w-5 h-5" 
              style={{ color: theme.colors.textMuted }}
            />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 overflow-y-auto max-h-[70vh] min-h-[60vh] px-4 md:px-0">
          <section 
            className={`md:pr-4 ${mobileSection === 'new' ? 'block' : 'hidden'} sm:block`}
            style={{ 
              borderRight: `1px solid ${theme.modal.sectionBorder}`,
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 
                className="font-inter text-sm sm:text-lead font-semibold hidden sm:block"
                style={{ color: theme.colors.text }}
              >
                New Applicants
              </h3>

              <div className="flex items-center gap-2 shrink-0 sm:ml-auto">
                <span 
                  className="text-xs sm:text-small font-medium whitespace-nowrap"
                  style={{ color: theme.colors.textMuted }}
                >
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
              <h3 
                className="font-inter text-sm sm:text-lead font-semibold hidden sm:block"
                style={{ color: theme.colors.text }}
              >
                All Applicants
              </h3>

              <div className="flex items-center gap-2 shrink-0 sm:ml-auto">
                <span 
                  className="text-xs sm:text-small font-medium whitespace-nowrap"
                  style={{ color: theme.colors.textMuted }}
                >
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