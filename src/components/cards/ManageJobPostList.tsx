"use client";

import React from 'react';
// Use public assets for icons
import { StaticGenderTag, StaticExperienceLevelTag, StaticJobTypeTag, StaticSalaryTag } from '@/components/ui/TagItem';
import ManageJobActionButtons from '@/components/posts/ManageJobActionButtons';
import { JobType, SubTypes } from '@/lib/constants/job-types';
import { Gender } from '@/lib/constants/gender';
import { ExperienceLevel } from '@/lib/constants/experience-level';

interface JobPostData {
  id: string;
  title: string;
  description: string;
  location: string;
  salary: string;
  salaryPeriod: string;
  postedDate: string;
  applicantCount?: number;
  genderTags?: string[];
  experienceTags?: string[];
  jobTypeTags?: string[];
}

interface ManageJobPostListProps {
  jobData: JobPostData;
  className?: string;
  onOpen?: (data: JobPostData) => void;
  onViewApplicants?: (data: JobPostData) => void;
  onEdit?: (data: JobPostData) => void;
  onDelete?: (data: JobPostData) => void;
}

export const ManageJobPostList: React.FC<ManageJobPostListProps> = ({ 
  jobData, 
  className = '',
  onOpen,
  onViewApplicants,
  onEdit,
  onDelete,
}) => {
  const {
    title,
    description,
    location,
    salary,
    salaryPeriod,
    postedDate,
    applicantCount = 0,
    genderTags = [],
    experienceTags = [],
    jobTypeTags = []
  } = jobData;

  // Title truncation for consistent row height
  const shortTitle = title.length > 60 ? `${title.slice(0, 60)}...` : title;

  const normalizeJobType = (label: string): string | null => {
    // Only allow subtypes; exclude top-level JobType enums from display
    const isSubType = Object.values(JobType).some((jt) => (SubTypes[jt] || []).includes(label));
    return isSubType ? label : null;
  };

  const normalizedJobTypes = jobTypeTags
    .map((label) => normalizeJobType(label))
    .filter((t): t is string => Boolean(t));

  const normalizeGender = (label: string): string | null => {
    return Object.values(Gender).includes(label as Gender) ? label : null;
  };

  const normalizedGenders = genderTags
    .map((label) => normalizeGender(label))
    .filter((t): t is string => Boolean(t));

  const normalizeExperience = (label: string): string | null => {
    return Object.values(ExperienceLevel).includes(label as ExperienceLevel) ? label : null;
  };

  const normalizedExperiences = experienceTags
    .map((label) => normalizeExperience(label))
    .filter((t): t is string => Boolean(t));

  const allTags = [
    ...normalizedJobTypes.map((label) => ({ type: 'jobtype' as const, label })),
    ...normalizedExperiences.map((label) => ({ type: 'experience' as const, label })),
    ...normalizedGenders.map((label) => ({ type: 'gender' as const, label })),
  ];
  const firstTag = allTags[0];
  const hiddenCount = Math.max(0, allTags.length - 1);

  const [isOpen, setIsOpen] = React.useState(true);
  return (
    <div 
      className={`w-full h-[60px] ${isOpen ? 'bg-white' : 'bg-gray-neutral100'} border ${isOpen ? 'border-gray-neutral200' : 'border-gray-neutral300'} shadow-sm px-6 rounded-[10px] transition-all duration-200 ease-out ${isOpen ? 'hover:shadow-md hover:-translate-y-[2px] hover:border-gray-neutral300' : ''} cursor-pointer ${className}`}
      onClick={() => onOpen?.(jobData)}
    >
      {/* Table-like aligned columns: Title | Tags | Location+Salary+Date | Actions */}
      <div
        className="grid items-center h-full gap-6 grid-cols-2 tablet:grid-cols-4 laptop:grid-cols-3 laptop-L:grid-cols-5"
      >
        {/* Title */}
        <div className={`min-w-0 flex items-center mobile-S:max-w-[150px] ${isOpen ? '' : 'filter grayscale'}`}>
          <h3 className={`font-alexandria font-semibold text-[15px] truncate ${isOpen ? 'text-gray-neutral900' : 'text-gray-neutral700'}`}>
            {shortTitle}
          </h3>
        </div>

        <div className={`min-w-0 hidden tablet:block ${isOpen ? '' : 'filter grayscale'}`}>
          <div className="flex items-center gap-2 whitespace-nowrap overflow-hidden">
            {firstTag && (
              firstTag.type === 'gender' ? (
                <StaticGenderTag label={firstTag.label} className={isOpen ? '' : 'text-gray-neutral600 bg-gray-neutral100'} />
              ) : firstTag.type === 'experience' ? (
                <StaticExperienceLevelTag label={firstTag.label} className={isOpen ? '' : 'text-gray-neutral600 bg-gray-neutral100'} />
              ) : (
                <StaticJobTypeTag label={firstTag.label} className={isOpen ? '' : 'text-gray-neutral600 bg-gray-neutral100'} />
              )
            )}
            {hiddenCount > 0 && (
              <div className="inline-flex items-center justify-center px-2 h-[17px] rounded-[5px] text-[10px] bg-gray-neutral100 text-gray-neutral400">+{hiddenCount}</div>
            )}
          </div>
        </div>

        {/* Salary - Laptop-L (1440px) only */}
        <div className={`hidden laptop-L:flex items-center gap-3 flex-1 ${isOpen ? '' : 'filter grayscale'}`}>
          <div className="w-[140px] min-w-[140px] max-w-[140px] overflow-hidden">
            <StaticSalaryTag label={`${salary} /${salaryPeriod}`} className={`whitespace-nowrap ${isOpen ? '' : 'text-gray-neutral600 bg-gray-neutral100'} w-full`} />
          </div>
        </div>

        {/* Date Posted - Tablet and Laptop-L; hidden at Laptop */}
        <div className={`hidden tablet:flex laptop:hidden laptop-L:flex flex-shrink-0 ${isOpen ? '' : 'filter grayscale'}`}>
          <span className={`font-inter text-[10px] whitespace-nowrap ${isOpen ? 'text-gray-neutral600' : 'text-gray-neutral500'}`}>Posted on: {postedDate}</span>
        </div>

        {/* Action Buttons (flush right, compact/hug content) */}
        <div className="flex-shrink-0 justify-self-end flex justify-end">
          <ManageJobActionButtons
            applicantCount={applicantCount}
            onViewApplicants={() => onViewApplicants?.(jobData)}
            onEdit={() => onEdit?.(jobData)}
            onDelete={() => onDelete?.(jobData)}
            variant="compact"
            showLockToggle
            isOpenLock={isOpen}
            onToggleLock={() => setIsOpen((v) => !v)}
            className="w-auto"
          />
        </div>
      </div>
    </div>
  );
};
