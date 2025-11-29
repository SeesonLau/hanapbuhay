"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProfileContactSection from "../view-profile/ProfileContactSection";
import JobListSection from "../view-profile/JobListSection";
import ReviewListSection from "../view-profile/ReviewListSection";
import ProjectListSection from "../view-profile/ProjectListSection";

interface ViewProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userType?: 'applicant' | 'employer';
}

type MobileSection = 'contact' | 'reviews' | 'projects' | 'jobs';

export default function ViewProfileModal({ isOpen, onClose, userId, userType = 'applicant' }: ViewProfileModalProps) {
  const [activeSection, setActiveSection] = useState<MobileSection>('contact');

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

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const sections = [
    { id: 'contact' as MobileSection, label: 'Profile' },
    { id: 'reviews' as MobileSection, label: 'Reviews' },
    { id: 'projects' as MobileSection, label: 'Projects' },
    { id: 'jobs' as MobileSection, label: 'Jobs' }
  ];

  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 px-2 sm:px-4"
      onClick={handleBackdropClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-white rounded-lg shadow-lg w-full max-w-6xl h-[70vh] md:h-[90vh] overflow-hidden relative z-50 flex flex-col"
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 20, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="absolute top-4 right-4 z-50 text-2xl text-gray-600 hover:text-gray-800 transition-colors"
          aria-label="Close modal"
        >
          ×
        </button>

        {/* Mobile Navigation Tabs */}
        <div className="flex md:hidden border-b border-gray-200 pt-10 px-2 bg-white">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeSection === section.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>

        {/* Mobile Single Section View */}
        <div className="flex md:hidden flex-1 overflow-y-auto">
          {activeSection === 'contact' && (
            <div className="w-full">
              <ProfileContactSection userId={userId} />
            </div>
          )}
          {activeSection === 'reviews' && (
            <div className="w-full">
              <ReviewListSection userId={userId} />
            </div>
          )}
          {activeSection === 'projects' && (
            <div className="w-full">
              <ProjectListSection userId={userId} />
            </div>
          )}
          {activeSection === 'jobs' && (
            <div className="w-full">
              <JobListSection userId={userId} userType={userType} />
            </div>
          )}
        </div>

        {/* Desktop Two Column Layout */}
        <div className="hidden md:flex flex-row h-full overflow-hidden">
          <div className="flex flex-col flex-shrink-0 border-r border-gray-200 overflow-y-auto">
            <ProfileContactSection userId={userId} />
            <div className="border-t border-gray-200 my-2"></div>
            <ReviewListSection userId={userId} />
          </div>

          <div className="flex flex-col flex-1 min-w-0 overflow-y-auto">
            <ProjectListSection userId={userId} />
            <div className="border-t border-gray-200 my-2"></div>
            <JobListSection userId={userId} userType={userType} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}