"use client";

import React from 'react';
import { getBlackColor, getNeutral600Color, getNeutral100Color, getNeutral400Color } from '@/styles/colors';
import { fontClasses } from '@/styles/fonts';
import { StaticGenderTag, StaticExperienceLevelTag, StaticJobTypeTag, StaticLocationTag, StaticSalaryTag } from '@/components/ui/TagItem';
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
  // Tags: show up to 4 max; remaining collapsed into +N
  const tagsTop4 = allTags.slice(0, 4);
  const extraCount = Math.max(0, allTags.length - tagsTop4.length);

  return (
    <div 
      className={`w-full h-[60px] bg-white border border-gray-200 shadow-sm px-6 rounded-[10px] transition-all duration-200 ease-out hover:shadow-md hover:-translate-y-[2px] hover:border-gray-300 cursor-pointer ${className}`}
      onClick={() => onOpen?.(jobData)}
    >
      {/* Table-like aligned columns; collapse progressively by breakpoint */}
      <div
        className="grid items-center h-full gap-6 grid-cols-2 mobile-L:grid-cols-3 laptop:grid-cols-4 laptop-L:grid-cols-4"
      >
        {/* Title */}
        <div className="min-w-0">
          <h3 className={`${fontClasses.heading} font-semibold text-[15px] truncate`} style={{ color: getBlackColor() }}>
            {shortTitle}
          </h3>
        </div>

        {/* Tags (responsive: single-line; hide below mobile-L) */}
        <div className="min-w-0 hidden mobile-L:block">
          {/* Large (laptop and up): show up to 4 tags */}
          <div className="hidden laptop:flex items-center gap-3 whitespace-nowrap overflow-hidden">
            {tagsTop4.map((tag, index) => (
              tag.type === 'gender' ? (
                <StaticGenderTag key={`tag-lg-${index}`} label={tag.label} />
              ) : tag.type === 'experience' ? (
                <StaticExperienceLevelTag key={`tag-lg-${index}`} label={tag.label} />
              ) : (
                <StaticJobTypeTag key={`tag-lg-${index}`} label={tag.label} />
              )
            ))}
            {extraCount > 0 && (
              <div
                className="inline-flex items-center justify-center px-2 h-[17px] rounded-[5px] text-[10px]"
                style={{ backgroundColor: getNeutral100Color(), color: getNeutral400Color() }}
              >
                +{extraCount}
              </div>
            )}
          </div>

          {/* Medium (>= mobile-L and < laptop): show up to 4 tags */}
          <div className="flex laptop:hidden items-center gap-2 whitespace-nowrap overflow-hidden">
            {tagsTop4.map((tag, index) => (
              tag.type === 'gender' ? (
                <StaticGenderTag key={`tag-md-${index}`} label={tag.label} />
              ) : tag.type === 'experience' ? (
                <StaticExperienceLevelTag key={`tag-md-${index}`} label={tag.label} />
              ) : (
                <StaticJobTypeTag key={`tag-md-${index}`} label={tag.label} />
              )
            ))}
            {extraCount > 0 && (
              <div
                className="inline-flex items-center justify-center px-2 h-[17px] rounded-[5px] text-[10px]"
                style={{ backgroundColor: getNeutral100Color(), color: getNeutral400Color() }}
              >
                +{extraCount}
              </div>
            )}
          </div>
        </div>

        {/* Location + Salary (hide below laptop; single-line) */}
        <div className="hidden laptop:flex items-center gap-3 whitespace-nowrap overflow-hidden">
          <StaticLocationTag label={location} />
          <StaticSalaryTag label={`${salary} /${salaryPeriod}`} />
        </div>

        {/* Date + Apply (keep a fixed 50px gap; visible on laptop-L+) */}
        <div className="hidden laptop-L:flex items-center justify-self-end justify-end gap-[100px]">
          <span className={`${fontClasses.body} text-[10px] whitespace-nowrap`} style={{ color: getNeutral600Color() }}>Posted on: {postedDate}</span>
          <button
            onClick={(e) => { e.stopPropagation(); onApply?.(id); }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm w-[140px] laptop:w-[130px] mobile-L:w-[120px] mobile-M:w-[110px] mobile-S:w-[100px]"
          >
            Apply Now
          </button>
        </div>

        {/* Actions only below laptop-L (date hidden); keep right aligned */}
        <div className="flex-shrink-0 justify-self-end flex justify-end laptop-L:hidden">
          <button
            onClick={(e) => { e.stopPropagation(); onApply?.(id); }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm w-[140px] laptop:w-[130px] mobile-L:w-[120px] mobile-M:w-[110px] mobile-S:w-[100px]"
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
};