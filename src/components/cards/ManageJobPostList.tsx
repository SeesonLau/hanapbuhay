"use client";

import React from 'react';
// Use public assets for icons
import { StaticGenderTag, StaticExperienceLevelTag, StaticJobTypeTag, StaticLocationTag, StaticSalaryTag } from '@/components/ui/TagItem';
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
  // Responsive tag subsets
  const tagsTop2 = allTags.slice(0, 2);
  const tagsTop1 = allTags.slice(0, 1);
  const extraCountLarge = Math.max(0, allTags.length - tagsTop2.length);
  const extraCountMedium = Math.max(0, allTags.length - tagsTop1.length);

  const [isOpen, setIsOpen] = React.useState(true);
  return (
    <div 
      className={`w-full h-[60px] ${isOpen ? 'bg-white' : 'bg-gray-neutral100'} border ${isOpen ? 'border-gray-neutral200' : 'border-gray-neutral300'} shadow-sm px-6 rounded-[10px] transition-all duration-200 ease-out ${isOpen ? 'hover:shadow-md hover:-translate-y-[2px] hover:border-gray-neutral300' : ''} cursor-pointer ${className}`}
      onClick={() => onOpen?.(jobData)}
    >
      {/* Table-like aligned columns: Title | Tags | Location+Salary | Date | Actions */}
      <div
        className="grid items-center h-full gap-6 grid-cols-2 mobile-L:grid-cols-3 laptop:grid-cols-4 laptop-L:grid-cols-5"
      >
        {/* Title */}
        <div className={`min-w-0 flex items-center gap-3 ${isOpen ? '' : 'filter grayscale'}`}>
          <h3 className={`font-alexandria font-semibold text-[15px] truncate ${isOpen ? 'text-gray-neutral900' : 'text-gray-neutral700'}`}>
            {shortTitle}
          </h3>
          <button
            type="button"
            aria-label={isOpen ? 'Open' : 'Closed'}
            className={`inline-flex items-center justify-center h-7 w-7 bg-transparent ${isOpen ? 'text-success-success400' : 'text-gray-neutral500'}`}
            onClick={(e) => { e.stopPropagation(); setIsOpen((v) => !v); }}
          >
            {isOpen ? (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 10V7a5 5 0 019.5-2" />
                <rect x="5" y="10" width="14" height="10" rx="2" />
                <circle cx="12" cy="15" r="1.5" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 10V7a5 5 0 0110 0v3" />
                <rect x="5" y="10" width="14" height="10" rx="2" />
                <circle cx="12" cy="15" r="1.5" />
              </svg>
            )}
          </button>
        </div>

        {/* Tags (responsive: fewer tags on smaller screens; hidden on very small) */}
        <div className={`min-w-0 hidden mobile-L:block ${isOpen ? '' : 'filter grayscale'}`}>
          {/* Large (laptop and up): show up to 2 tags */}
          <div className="hidden laptop:flex items-center gap-3 whitespace-nowrap overflow-hidden">
            {tagsTop2.map((tag, index) => (
              tag.type === 'gender' ? (
                <StaticGenderTag key={`tag-lg-${index}`} label={tag.label} className={isOpen ? '' : 'text-gray-neutral600 bg-gray-neutral100'} />
              ) : tag.type === 'experience' ? (
                <StaticExperienceLevelTag key={`tag-lg-${index}`} label={tag.label} className={isOpen ? '' : 'text-gray-neutral600 bg-gray-neutral100'} />
              ) : (
                <StaticJobTypeTag key={`tag-lg-${index}`} label={tag.label} className={isOpen ? '' : 'text-gray-neutral600 bg-gray-neutral100'} />
              )
            ))}
            {extraCountLarge > 0 && (
              <div
                className="inline-flex items-center justify-center px-2 h-[17px] rounded-[5px] text-[10px] bg-gray-neutral100 text-gray-neutral400"
              >
                +{extraCountLarge}
              </div>
            )}
          </div>

          {/* Medium (>= mobile-L and < laptop): show 1 tag */}
          <div className="flex laptop:hidden items-center gap-2 whitespace-nowrap overflow-hidden">
            {tagsTop1.map((tag, index) => (
              tag.type === 'gender' ? (
                <StaticGenderTag key={`tag-md-${index}`} label={tag.label} className={isOpen ? '' : 'text-gray-neutral600 bg-gray-neutral100'} />
              ) : tag.type === 'experience' ? (
                <StaticExperienceLevelTag key={`tag-md-${index}`} label={tag.label} className={isOpen ? '' : 'text-gray-neutral600 bg-gray-neutral100'} />
              ) : (
                <StaticJobTypeTag key={`tag-md-${index}`} label={tag.label} className={isOpen ? '' : 'text-gray-neutral600 bg-gray-neutral100'} />
              )
            ))}
            {extraCountMedium > 0 && (
              <div
                className="inline-flex items-center justify-center px-2 h-[17px] rounded-[5px] text-[10px] bg-gray-neutral100 text-gray-neutral400"
              >
                +{extraCountMedium}
              </div>
            )}
          </div>
        </div>

        {/* Location + Salary (hide below laptop) */}
        <div className={`hidden laptop:flex items-center gap-3 whitespace-nowrap overflow-hidden ${isOpen ? '' : 'filter grayscale'}`}>
          <StaticLocationTag label={location} className={isOpen ? '' : 'text-gray-neutral600 bg-gray-neutral100'} />
          <StaticSalaryTag label={`${salary} /${salaryPeriod}`} className={isOpen ? '' : 'text-gray-neutral600 bg-gray-neutral100'} />
        </div>

        {/* Posted Date (single line; hide below laptop-L for progressive collapse) */}
        <div className={`flex-shrink-0 hidden laptop-L:block ${isOpen ? '' : 'filter grayscale'}`}>
          <span className={`font-inter text-[10px] whitespace-nowrap ${isOpen ? 'text-gray-neutral600' : 'text-gray-neutral500'}`}>Posted on: {postedDate}</span>
        </div>

        {/* Action Buttons (flush right) */}
        <div className="flex-shrink-0 justify-self-end flex justify-end">
          <ManageJobActionButtons
            applicantCount={applicantCount}
            onViewApplicants={() => onViewApplicants?.(jobData)}
            onEdit={() => onEdit?.(jobData)}
            onDelete={() => onDelete?.(jobData)}
            variant="horizontal"
            className={`w-[362px] laptop:w-[320px] tablet:w-[280px] mobile-L:w-[220px] mobile-M:w-[200px] mobile-S:w-[180px]`}
          />
        </div>
      </div>
    </div>
  );
};