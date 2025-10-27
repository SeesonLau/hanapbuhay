"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { getBlackColor, getNeutral600Color, getNeutral100Color, getNeutral400Color } from '@/styles/colors';
import { fontClasses } from '@/styles/fonts';
// Use public assets for icons
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

interface ManageJobPostCardProps {
  jobData: JobPostData;
  className?: string;
  onOpen?: (data: JobPostData) => void;
  onViewApplicants?: (data: JobPostData) => void;
  onEdit?: (data: JobPostData) => void;
}

export const ManageJobPostCard: React.FC<ManageJobPostCardProps> = ({ 
  jobData, 
  className = '',
  onOpen,
  onViewApplicants,
  onEdit,
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
  // Dynamically determine how many tags fit on a single row
  const [visibleCount, setVisibleCount] = useState<number>(Math.min(allTags.length, 4));
  const measureRef = useRef<HTMLDivElement | null>(null);
  const overflowMeasureRef = useRef<HTMLDivElement | null>(null);
  const tagsRowRef = useRef<HTMLDivElement | null>(null);

  const recomputeVisibleCount = () => {
    const container = tagsRowRef.current;
    const measure = measureRef.current;
    const overflowMeasure = overflowMeasureRef.current;
    if (!container || !measure) {
      setVisibleCount(Math.min(allTags.length, 4));
      return;
    }

    const maxWidth = container.clientWidth;
    const children = Array.from(measure.children) as HTMLElement[];
    const widths = children.map((el) => el.offsetWidth);
    const gapPx = 4; // gap-1
    const overflowWidth = overflowMeasure ? overflowMeasure.offsetWidth : 24; // fallback

    let used = 0;
    let count = 0;
    for (let i = 0; i < widths.length; i++) {
      const w = widths[i] + (i > 0 ? gapPx : 0);
      // If adding this tag means there will still be hidden tags, reserve space for overflow indicator
      const willHideSome = (i + 1) < widths.length;
      const reserve = willHideSome ? (overflowWidth + gapPx) : 0;

      if (used + w + reserve <= maxWidth) {
        used += w;
        count += 1;
      } else {
        break;
      }
    }

    setVisibleCount(count);
  };

  useLayoutEffect(() => {
    recomputeVisibleCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobData.title, jobData.description, jobData.location, jobData.salary, jobData.salaryPeriod, jobData.postedDate, allTags.length]);

  useEffect(() => {
    const onResize = () => recomputeVisibleCount();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visibleTags = allTags.slice(0, Math.max(0, visibleCount));
  const extraCount = Math.max(0, allTags.length - visibleTags.length);

  return (
    <div 
      className={`w-[420px] h-[250px] min-h-[250px] max-h-[250px] bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex flex-col overflow-hidden transition-all duration-200 ease-out hover:shadow-md hover:-translate-y-[2px] hover:border-gray-300 cursor-pointer ${className}`}
      onClick={() => onOpen?.(jobData)}
    >
      {/* Header */}
      <div className="flex-shrink-0 mb-[16px]">
        <h3 className={`${fontClasses.heading} font-semibold text-[20px] mb-2 truncate`} style={{ color: getBlackColor() }}>{title}</h3>
        <p className={`${fontClasses.body} font-light text-[12px] line-clamp-1`} style={{ color: getNeutral600Color() }}>{description}</p>
      </div>

      {/* Tags Section - Single row that adapts to fit */}
      <div className="mb-[16px]">
        {/* Hidden measurers to calculate widths without wrapping */}
        <div ref={measureRef} className="fixed -top-[9999px] -left-[9999px] flex flex-nowrap gap-1">
          {allTags.map((tag, index) => (
            tag.type === 'gender' ? (
              <StaticGenderTag key={`measure-${index}`} label={tag.label} />
            ) : tag.type === 'experience' ? (
              <StaticExperienceLevelTag key={`measure-${index}`} label={tag.label} />
            ) : (
              <StaticJobTypeTag key={`measure-${index}`} label={tag.label} />
            )
          ))}
        </div>
        {/* Measure overflow indicator width */}
        <div ref={overflowMeasureRef} className="fixed -top-[9999px] -left-[9999px] inline-flex items-center justify-center px-2 h-[17px] rounded-[5px] text-[10px]" style={{ backgroundColor: getNeutral100Color(), color: getNeutral400Color() }}>
          99+
        </div>

        <div ref={tagsRowRef} className="flex flex-nowrap gap-1 overflow-hidden whitespace-nowrap items-center">
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
      </div>

      {/* Footer */}
      <div className="mt-auto space-y-[16px]">
        {/* Location and Salary */}
        <div className="flex items-center gap-2">
          <StaticLocationTag label={location} />
          <StaticSalaryTag label={`${salary} /${salaryPeriod}`} />
        </div>

        {/* Posted Date */}
        <div className="flex justify-start">
          <span className={`${fontClasses.body} font-medium text-[10px]`} style={{ color: getNeutral600Color() }}>Posted on: {postedDate}</span>
        </div>
        
        {/* Action Buttons - Full Width */}
        <div className="flex gap-0 w-full">
          <button className="flex items-center justify-center flex-1 h-[30px] bg-white border border-gray-300 rounded-l-[10px] text-xs font-medium hover:bg-gray-50 transition-colors" onClick={(e) => { e.stopPropagation(); onViewApplicants?.(jobData); }}>
            <span className="text-blue-600 mr-1">{applicantCount}</span>
            <img src="/icons/profile.svg" alt="Applicants" className="w-[15px] h-[15px]" />
          </button>
          <button className="flex items-center justify-center flex-1 h-[30px] bg-white border-t border-b border-gray-300 hover:bg-gray-50 transition-colors" onClick={(e) => { e.stopPropagation(); onEdit?.(jobData); }}>
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