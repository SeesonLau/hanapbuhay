"use client";

import React from 'react';
import { getBlackColor, getNeutral600Color, getNeutral100Color, getNeutral400Color } from '@/styles/colors';
import { fontClasses } from '@/styles/fonts';
// Use public assets for icons
import { StaticGenderTag, StaticExperienceLevelTag, StaticJobTypeTag, StaticLocationTag, StaticSalaryTag } from './Tags';

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
}

export const ManageJobPostList: React.FC<ManageJobPostListProps> = ({ 
  jobData, 
  className = '' 
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

  const allTags = [
    ...jobTypeTags.map((label) => ({ type: 'jobtype' as const, label })),
    ...experienceTags.map((label) => ({ type: 'experience' as const, label })),
    ...genderTags.map((label) => ({ type: 'gender' as const, label })),
  ];
  const MAX_TAGS = 4;
  const visibleTags = allTags.slice(0, MAX_TAGS);
  const extraCount = Math.max(0, allTags.length - visibleTags.length);

  return (
    <div 
      className={`w-[1840px] h-[60px] bg-white border border-gray-200 shadow-sm px-6 rounded-[10px] transition-all duration-200 ease-out hover:shadow-md hover:-translate-y-[2px] hover:border-gray-300 ${className}`}
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
        <div className="flex items-center gap-0 w-[362px]">
          <button className="flex items-center justify-center flex-1 h-[30px] bg-white border border-gray-300 rounded-l-[10px] text-xs font-medium hover:bg-gray-50 transition-colors">
            <span className="text-blue-600 mr-1">{applicantCount}</span>
            <img src="/icons/profile.svg" alt="Applicants" className="w-[15px] h-[15px]" />
          </button>
          <button className="flex items-center justify-center flex-1 h-[30px] bg-white border-t border-b border-gray-300 hover:bg-gray-50 transition-colors">
            <img src="/icons/edit.svg" alt="Edit" className="w-[15px] h-[15px]" />
          </button>
          <button className="flex items-center justify-center flex-1 h-[30px] bg-white border border-gray-300 rounded-r-[10px] hover:bg-gray-50 transition-colors">
            <img src="/icons/delete.svg" alt="Delete" className="w-[15px] h-[15px]" />
          </button>
        </div>
      </div>
    </div>
  );
};