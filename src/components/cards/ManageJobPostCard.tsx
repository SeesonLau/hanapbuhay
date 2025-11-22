'use client';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
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

interface ManageJobPostCardProps {
  jobData: JobPostData;
  className?: string;
  onOpen?: (data: JobPostData) => void;
  onViewApplicants?: (data: JobPostData) => void;
  onEdit?: (data: JobPostData) => void;
  onDelete?: (data: JobPostData) => void;
}

export const ManageJobPostCard: React.FC<ManageJobPostCardProps> = ({ 
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
      className={`w-full min-h-[250px] bg-white rounded-lg border border-gray-neutral200 shadow-sm p-6 flex flex-col overflow-hidden transition-all duration-200 ease-out hover:shadow-md hover:-translate-y-[2px] hover:border-gray-neutral300 cursor-pointer ${className}`}
      onClick={() => onOpen?.(jobData)}
    >
      {/* Header */}
      <div className="flex-shrink-0 mb-[16px]">
        <h3 className={`font-alexandria font-semibold text-[20px] mb-2 truncate text-gray-neutral900`}>{title}</h3>
        <p className={`font-inter font-light text-[12px] line-clamp-1 text-gray-neutral600`}>{description}</p>
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
        <div ref={overflowMeasureRef} className="fixed -top-[9999px] -left-[9999px] inline-flex items-center justify-center px-2 h-[17px] rounded-[5px] text-[10px] bg-gray-neutral100 text-gray-neutral400">
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
              className="inline-flex items-center justify-center px-2 h-[17px] rounded-[5px] text-[10px] bg-gray-neutral100 text-gray-neutral400"
            >
              {extraCount}+
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto space-y-[16px]">
        {/* Location and Salary */}
        <div className="flex flex-wrap items-center gap-2">
          <StaticLocationTag label={location} className="whitespace-nowrap" />
          <StaticSalaryTag label={`${salary} /${salaryPeriod}`} className="whitespace-nowrap" />
        </div>

        {/* Posted Date */}
        <div className="flex justify-start">
          <span className={`font-inter font-medium text-[10px] text-gray-neutral600`}>Posted on: {postedDate}</span>
        </div>
        
        {/* Action Buttons */}
        <ManageJobActionButtons
          applicantCount={applicantCount}
          onViewApplicants={() => onViewApplicants?.(jobData)}
          onEdit={() => onEdit?.(jobData)}
          onDelete={() => onDelete?.(jobData)}
          variant="horizontal"
          className="w-full"
        />
      </div>
    </div>
  );
};