"use client";

import React from 'react';
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

interface ManageJobPostCardProps {
  jobData: JobPostData;
  className?: string;
}

export const ManageJobPostCard: React.FC<ManageJobPostCardProps> = ({ 
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

  // Combine tags and cap visible to 5, show overflow as n+
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
      className={`w-[420px] bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex flex-col transition-all duration-200 ease-out hover:shadow-md hover:-translate-y-[2px] hover:border-gray-300 ${className}`}
    >
      {/* Header */}
      <div className="flex-shrink-0 mb-[15px]">
        <h3 className="font-inter font-semibold text-[20px] text-gray-900 mb-2 truncate">{title}</h3>
        <p className="font-alexandria font-light text-[12px] text-gray-600 line-clamp-2">{description}</p>
      </div>

      {/* Tags Section - Horizontally Aligned with overflow count */}
      <div className="mb-[15px]">
        <div className="flex flex-wrap gap-1">
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
            <div className="inline-flex items-center justify-center px-2 h-[17px] rounded-[5px] text-[10px] bg-gray-200 text-gray-700">
              {extraCount}+
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 space-y-[15px]">
        {/* Location and Salary */}
        <div className="flex items-center gap-2">
          <StaticLocationTag label={location} />
          <StaticSalaryTag label={`${salary} /${salaryPeriod}`} />
        </div>

        {/* Posted Date */}
        <div className="flex justify-start">
          <span className="font-inter font-medium text-[10px] text-[#595959]">Posted on: {postedDate}</span>
        </div>
        
        {/* Action Buttons - Full Width */}
        <div className="flex gap-0 w-full">
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