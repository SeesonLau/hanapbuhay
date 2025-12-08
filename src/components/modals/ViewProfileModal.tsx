"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProfileContactSection from "../view-profile/ProfileContactSection";
import JobListSection from "../view-profile/JobListSection";
import ReviewListSection from "../view-profile/ReviewListSection";
import ProjectListSection from "../view-profile/ProjectListSection";
import { useTheme } from '@/hooks/useTheme';

interface ViewProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userType?: 'applicant' | 'employer';
}

type MobileSection = 'contact' | 'reviews' | 'projects' | 'jobs';

export default function ViewProfileModal({ isOpen, onClose, userId, userType = 'applicant' }: ViewProfileModalProps) {
  const { theme } = useTheme();
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
      className="fixed inset-0 z-40 flex items-center justify-center px-2 sm:px-4"
      style={{ backgroundColor: theme.modal.overlay }}
      onClick={handleBackdropClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="rounded-lg shadow-lg w-full max-w-6xl h-[70vh] md:h-[90vh] overflow-hidden relative z-50 flex flex-col"
        style={{ backgroundColor: theme.modal.background }}
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 20, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="absolute top-4 right-4 z-50 text-2xl transition-colors"
          style={{ color: theme.modal.buttonClose }}
          onMouseOver={(e) => e.currentTarget.style.color = theme.modal.buttonCloseHover}
          onMouseOut={(e) => e.currentTarget.style.color = theme.modal.buttonClose}
          aria-label="Close modal"
        >
          ×
        </button>

        {/* Mobile Navigation Tabs */}
        <div 
          className="flex md:hidden border-b pt-10 px-2"
          style={{ 
            backgroundColor: theme.modal.background,
            borderBottomColor: theme.modal.headerBorder
          }}
        >
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className="flex-1 py-3 text-sm font-medium transition-colors border-b-2"
              style={{
                borderBottomColor: activeSection === section.id ? theme.colors.primary : 'transparent',
                color: activeSection === section.id ? theme.colors.primary : theme.colors.textMuted
              }}
              onMouseOver={(e) => {
                if (activeSection !== section.id) {
                  e.currentTarget.style.color = theme.colors.textSecondary;
                }
              }}
              onMouseOut={(e) => {
                if (activeSection !== section.id) {
                  e.currentTarget.style.color = theme.colors.textMuted;
                }
              }}
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
          <div 
            className="flex flex-col flex-shrink-0 border-r overflow-y-auto"
            style={{ borderRightColor: theme.modal.sectionBorder }}
          >
            <ProfileContactSection userId={userId} />
            <div 
              className="border-t my-2"
              style={{ borderTopColor: theme.modal.sectionBorder }}
            />
            <ReviewListSection userId={userId} />
          </div>

          <div className="flex flex-col flex-1 min-w-0 overflow-y-auto">
            <ProjectListSection userId={userId} />
            <div 
              className="border-t my-2"
              style={{ borderTopColor: theme.modal.sectionBorder }}
            />
            <JobListSection userId={userId} userType={userType} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}