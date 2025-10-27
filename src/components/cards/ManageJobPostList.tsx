"use client";

import React from 'react';
import { getBlackColor, getNeutral600Color, getNeutral100Color, getNeutral400Color } from '@/styles/colors';
import { fontClasses } from '@/styles/fonts';
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

  // Ensure horizontal arrangement and handle truncation/overflow
  const shortTitle = title.length > 20 ? `${title.slice(0, 20)}...` : title;
  const shortDescription = description.length > 50 ? `${description.slice(0, 50)}...` : description;

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
  const MAX_TAGS = 4;
  const visibleTags = allTags.slice(0, MAX_TAGS);
  const extraCount = Math.max(0, allTags.length - visibleTags.length);

  return (
    <div 
      className={`w-[1840px] h-[60px] bg-white border border-gray-200 shadow-sm px-6 rounded-[10px] transition-all duration-200 ease-out hover:shadow-md hover:-translate-y-[2px] hover:border-gray-300 cursor-pointer ${className}`}
      onClick={() => onOpen?.(jobData)}
    >
      {/* Strict horizontal layout */}
      <div className="flex flex-row items-center justify-between h-full gap-3">
        {/* Title + Description (horizontal alignment) */}
        <div className="min-w-0 flex items-center gap-3">
          <h3 className={`${fontClasses.heading} font-semibold text-[15px] whitespace-nowrap`} style={{ color: getBlackColor() }}>
            {shortTitle}
          </h3>
          <p className={`${fontClasses.body} font-light text-[12px] whitespace-nowrap`} style={{ color: getNeutral600Color() }}>
            {shortDescription}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-3">
          {visibleTags.map((tag, index) => (
            tag.type === 'gender' ? (
              <StaticGenderTag key={`tag-${index}`} label={tag.label} />
            ) : tag.type === 'experience' ? (
              <StaticExperienceLevelTag key={`tag-${index}`} label={tag.label} />
            ) : (
              <StaticJobTypeTag key={`tag-${index}`} label={tag.label} />
            )
          ))}
          {extraCount > 0 && (
            <div
              className="inline-flex items-center justify-center px-2 h-[17px] rounded-[5px] text-[10px]"
              style={{ backgroundColor: getNeutral100Color(), color: getNeutral400Color() }}
            >
              {extraCount}+
            </div>
          )}
        </div>

        {/* Location + Salary */}
        <div className="flex items-center gap-3">
          <StaticLocationTag label={location} />
          <StaticSalaryTag label={`${salary} /${salaryPeriod}`} />
        </div>

        {/* Posted Date */}
        <div className="flex-shrink-0">
          <span className={`${fontClasses.body} text-[10px]`} style={{ color: getNeutral600Color() }}>Posted on: {postedDate}</span>
        </div>

        {/* Action Buttons */}
        <ManageJobActionButtons
          applicantCount={applicantCount}
          onViewApplicants={() => onViewApplicants?.(jobData)}
          onEdit={() => onEdit?.(jobData)}
          onDelete={() => onDelete?.(jobData)}
          variant="horizontal"
          className="w-[362px]"
        />
      </div>
    </div>
  );
};