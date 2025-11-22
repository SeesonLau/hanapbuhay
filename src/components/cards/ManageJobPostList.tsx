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

  return (
    <div 
      className={`w-full h-[60px] bg-white border border-gray-neutral200 shadow-sm px-6 rounded-[10px] transition-all duration-200 ease-out hover:shadow-md hover:-translate-y-[2px] hover:border-gray-neutral300 cursor-pointer ${className}`}
      onClick={() => onOpen?.(jobData)}
    >
      {/* Table-like aligned columns: Title | Tags | Location+Salary | Date | Actions */}
      <div
        className="grid items-center h-full gap-6 grid-cols-2 mobile-L:grid-cols-3 laptop:grid-cols-4 laptop-L:grid-cols-5"
      >
        {/* Title */}
        <div className="min-w-0">
          <h3 className={`font-alexandria font-semibold text-[15px] truncate text-gray-neutral900`}>
            {shortTitle}
          </h3>
        </div>

        {/* Tags (responsive: fewer tags on smaller screens; hidden on very small) */}
        <div className="min-w-0 hidden mobile-L:block">
          {/* Large (laptop and up): show up to 2 tags */}
          <div className="hidden laptop:flex items-center gap-3 whitespace-nowrap overflow-hidden">
            {tagsTop2.map((tag, index) => (
              tag.type === 'gender' ? (
                <StaticGenderTag key={`tag-lg-${index}`} label={tag.label} />
              ) : tag.type === 'experience' ? (
                <StaticExperienceLevelTag key={`tag-lg-${index}`} label={tag.label} />
              ) : (
                <StaticJobTypeTag key={`tag-lg-${index}`} label={tag.label} />
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
                <StaticGenderTag key={`tag-md-${index}`} label={tag.label} />
              ) : tag.type === 'experience' ? (
                <StaticExperienceLevelTag key={`tag-md-${index}`} label={tag.label} />
              ) : (
                <StaticJobTypeTag key={`tag-md-${index}`} label={tag.label} />
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
        <div className="hidden laptop:flex items-center gap-3 whitespace-nowrap overflow-hidden">
          <StaticLocationTag label={location} />
          <StaticSalaryTag label={`${salary} /${salaryPeriod}`} />
        </div>

        {/* Posted Date (single line; hide below laptop-L for progressive collapse) */}
        <div className="flex-shrink-0 hidden laptop-L:block">
          <span className={`font-inter text-[10px] whitespace-nowrap text-gray-neutral600`}>Posted on: {postedDate}</span>
        </div>

        {/* Action Buttons (flush right) */}
        <div className="flex-shrink-0 justify-self-end flex justify-end">
          <ManageJobActionButtons
            applicantCount={applicantCount}
            onViewApplicants={() => onViewApplicants?.(jobData)}
            onEdit={() => onEdit?.(jobData)}
            onDelete={() => onDelete?.(jobData)}
            variant="horizontal"
            className="w-[362px] laptop:w-[320px] tablet:w-[280px] mobile-L:w-[220px] mobile-M:w-[200px] mobile-S:w-[180px]"
          />
        </div>
      </div>
    </div>
  );
};