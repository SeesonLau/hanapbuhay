"use client";

import React from 'react';
import { StaticGenderTag, StaticExperienceLevelTag, StaticJobTypeTag, StaticSalaryTag } from '@/components/ui/TagItem';
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

interface JobPostListProps {
  jobData: JobPostData;
  className?: string;
  onApply?: (id: string) => void;
  onOpen?: (data: JobPostData) => void;
}

export const JobPostList: React.FC<JobPostListProps> = ({ jobData, className = '', onApply, onOpen }) => {
  const {
    id,
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

  const shortTitle = title.length > 60 ? `${title.slice(0, 60)}...` : title;

  const normalizeJobType = (label: string): string | null => {
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

  return (
    <div 
      className={`w-full h-[60px] bg-white border border-gray-neutral200 shadow-sm px-6 rounded-[10px] transition-all duration-200 ease-out hover:shadow-md hover:-translate-y-[2px] hover:border-gray-neutral300 cursor-pointer ${className}`}
      onClick={() => onOpen?.(jobData)}
    >
      {/* Table-like aligned columns; collapse progressively by breakpoint */}
      <div
        className="grid items-center h-full gap-6 grid-cols-2 tablet:grid-cols-4 laptop:grid-cols-3 laptop-L:grid-cols-5"
      >
        {/* Title */}
        <div className="min-w-0 mobile-S:max-w-[150px]">
          <h3 className={`font-alexandria font-semibold text-[15px] truncate text-gray-neutral900`}>
            {shortTitle}
          </h3>
        </div>

        <div className="min-w-0 hidden tablet:block">
          <div className="flex items-center gap-2 whitespace-nowrap overflow-hidden">
            {firstTag && (
              firstTag.type === 'gender' ? (
                <StaticGenderTag label={firstTag.label} />
              ) : firstTag.type === 'experience' ? (
                <StaticExperienceLevelTag label={firstTag.label} />
              ) : (
                <StaticJobTypeTag label={firstTag.label} />
              )
            )}
            {hiddenCount > 0 && (
              <div className="inline-flex items-center justify-center px-2 h-[17px] rounded-[5px] text-[10px] bg-gray-neutral100 text-gray-neutral400">+{hiddenCount}</div>
            )}
          </div>
        </div>

        <div className="hidden laptop-L:flex items-center gap-3 whitespace-nowrap overflow-hidden">
          <StaticSalaryTag label={`${salary} /${salaryPeriod}`} />
        </div>

        <div className="hidden tablet:flex laptop:hidden laptop-L:flex items-center">
          <span className={`font-inter text-[10px] whitespace-nowrap text-gray-neutral600`}>Posted on: {postedDate}</span>
        </div>

        <div className="flex-shrink-0 justify-self-end flex justify-end">
          <button
            onClick={(e) => { e.stopPropagation(); onApply?.(id); }}
            className="px-4 py-2 bg-primary-primary500 text-white rounded-lg hover:bg-primary-primary600 transition-colors text-sm w-[140px] laptop:w-[130px] mobile-L:w-[120px] mobile-M:w-[110px] mobile-S:w-[100px]"
          >
            Apply Now
          </button>
        </div>

        
      </div>
    </div>
  );
};
