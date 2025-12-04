'use client';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { GoClock } from "react-icons/go";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { LuCircleX } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";
import { StaticGenderTag, StaticExperienceLevelTag, StaticJobTypeTag, StaticSalaryTag, StaticLocationTag } from '@/components/ui/TagItem';
import { JobType, SubTypes } from '@/lib/constants/job-types';
import { Gender } from '@/lib/constants/gender';
import { ExperienceLevel } from '@/lib/constants/experience-level';

// Status type for better type safety
export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

// Job application data interface
export interface AppliedJob {
  id: string;
  title: string;
  description: string;
  location: string;
  salary: string;
  salaryPeriod: string;
  appliedOn: string;
  status: ApplicationStatus;
  genderTags?: string[];
  experienceTags?: string[];
  jobTypeTags?: string[];
  raw?: any; // Store complete application object with posts data for modal
}

// Component props interface
export interface AppliedJobCardProps {
  job: AppliedJob;
  variant?: 'card' | 'list';
  onDelete?: (jobId: string) => void;
  onClick?: (job: AppliedJob) => void;
  className?: string;
}

// Status styling configuration
const statusConfig = {
  pending: {
    text: 'Pending',
    bgColor: 'bg-warning-warning100',
    textColor: 'text-warning-warning700',
    icon: GoClock
  },
  approved: {
    text: 'Approved',
    bgColor: 'bg-success-success100',
    textColor: 'text-success-success700',
    icon: IoCheckmarkCircleOutline
  },
  rejected: {
    text: 'Rejected',
    bgColor: 'bg-error-error100',
    textColor: 'text-error-error700',
    icon: LuCircleX
  },
  unknown: {
    text: 'Unknown',
    bgColor: 'bg-gray-neutral100',
    textColor: 'text-gray-neutral700',
    icon: GoClock
  },
};

export default function AppliedJobCard({
  job,
  variant = 'card',
  onDelete,
  onClick,
  className = ''
}: AppliedJobCardProps) {
  const status = statusConfig[job.status] || statusConfig.unknown;

  const handleDelete = () => {
    if (onDelete) {
      onDelete(job.id);
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick(job);
    }
  };

  // Removed formatSalary function - we'll use StaticSalaryTag instead

  // Extract and provide defaults for tag arrays
  const {
    genderTags = [],
    experienceTags = [],
    jobTypeTags = []
  } = job;

  // Debug logging
  console.log('AppliedJobCard Debug:', {
    title: job.title,
    genderTags,
    experienceTags,
    jobTypeTags,
    hasGender: genderTags.length > 0,
    hasExperience: experienceTags.length > 0,
    hasJobType: jobTypeTags.length > 0
  });

  // Normalize and filter tags (same pattern as ManageJobPostCard)
  const normalizeJobType = (label: string): string | null => {
    const isSubType = Object.values(JobType).some((jt) => (SubTypes[jt] || []).includes(label));
    console.log('normalizeJobType:', label, '→', isSubType ? label : null);
    return isSubType ? label : null;
  };

  const normalizedJobTypes = jobTypeTags
    .map((label) => normalizeJobType(label))
    .filter((t): t is string => Boolean(t));

  const normalizeGender = (label: string): string | null => {
    const isValid = Object.values(Gender).includes(label as Gender);
    console.log('normalizeGender:', label, '→', isValid ? label : null, 'Valid genders:', Object.values(Gender));
    return isValid ? label : null;
  };

  const normalizedGenders = genderTags
    .map((label) => normalizeGender(label))
    .filter((t): t is string => Boolean(t));

  const normalizeExperience = (label: string): string | null => {
    const isValid = Object.values(ExperienceLevel).includes(label as ExperienceLevel);
    console.log('normalizeExperience:', label, '→', isValid ? label : null);
    return isValid ? label : null;
  };

  const normalizedExperiences = experienceTags
    .map((label) => normalizeExperience(label))
    .filter((t): t is string => Boolean(t));

  const allTags = [
    ...normalizedJobTypes.map((label) => ({ type: 'jobtype' as const, label })),
    ...normalizedExperiences.map((label) => ({ type: 'experience' as const, label })),
    ...normalizedGenders.map((label) => ({ type: 'gender' as const, label })),
  ];

  console.log('Final allTags:', allTags);

  // Title truncation for consistent row height
  const shortTitle = job.title.length > 60 ? `${job.title.slice(0, 60)}...` : job.title;

  // Get first tag and count for display (similar to ManageJobPostList)
  const firstTag = allTags[0];
  const hiddenCount = Math.max(0, allTags.length - 1);

  // Dynamic tag measurement for card variant (similar to ManageJobPostCard)
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
  }, [job.title, job.description, job.location, job.salary, job.salaryPeriod, job.appliedOn, allTags.length]);

  useEffect(() => {
    const onResize = () => recomputeVisibleCount();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visibleTags = allTags.slice(0, Math.max(0, visibleCount));
  const extraCount = Math.max(0, allTags.length - visibleTags.length);

  if (variant === 'list') {
    return (
      <div
        onClick={handleClick}
        className={`w-full h-[60px] bg-white border border-gray-neutral200 shadow-sm px-6 rounded-[10px] transition-all duration-200 ease-out hover:shadow-md hover:-translate-y-[2px] hover:border-gray-neutral300 cursor-pointer ${className}`}
      >
        {/* Grid layout: Title | Tags | Salary | Date | Status+Delete */}
        <div className="grid items-center h-full gap-6 grid-cols-2 tablet:grid-cols-4 laptop:grid-cols-3 laptop-L:grid-cols-5">
          {/* Title */}
          <div className="min-w-0 flex items-center mobile-S:max-w-[150px]">
            <h3 className="font-alexandria font-semibold text-[15px] truncate text-gray-neutral900">
              {shortTitle}
            </h3>
          </div>

          {/* Tags - shown on tablet and up */}
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
                <div className="inline-flex items-center justify-center px-2 h-[17px] rounded-[5px] text-[10px] bg-gray-neutral100 text-gray-neutral400">
                  +{hiddenCount}
                </div>
              )}
            </div>
          </div>

          {/* Salary - Laptop-L (1440px) only */}
          <div className="hidden laptop-L:flex items-center gap-3 flex-1">
            <div className="w-[140px] min-w-[140px] max-w-[140px] overflow-hidden">
              <StaticSalaryTag label={`${job.salary} /${job.salaryPeriod}`} className="whitespace-nowrap w-full" />
            </div>
          </div>

          {/* Applied Date - Tablet and Laptop-L; hidden at Laptop */}
          <div className="hidden tablet:flex laptop:hidden laptop-L:flex flex-shrink-0">
            <span className="font-inter text-[10px] whitespace-nowrap text-gray-neutral600">
              Applied on: {job.appliedOn}
            </span>
          </div>

          {/* Status Badge + Delete Button (combined column, flush right) */}
          <div className="flex-shrink-0 justify-self-end flex items-center gap-3 justify-end">
            {/* Status Badge */}
            <div className={`flex items-center gap-1 px-2 py-1 rounded-md ${status.bgColor} ${status.textColor}`}>
              <status.icon className="w-3 h-3" />
              <span className="font-inter text-[10px] font-medium">{status.text}</span>
            </div>

            {/* Delete Button */}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                className="p-1.5 text-error-error500 hover:text-error-error600 hover:bg-error-error50 rounded-md transition-colors"
                title="Delete application"
              >
                <RiDeleteBin6Line className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Card variant
  return (
    <div
      onClick={handleClick}
      className={`w-full h-full min-h-[250px] bg-white rounded-lg shadow-[0px_0px_10px_rgba(0,0,0,0.25)] p-6 flex flex-col overflow-hidden transition-all duration-200 ease-out hover:shadow-lg hover:-translate-y-[2px] cursor-pointer ${className}`}
    >
      {/* Header with Title */}
      <div className="flex-shrink-0 mb-[16px] flex items-start justify-between">
        <div className="min-w-0">
          <h3 className="font-alexandria font-semibold text-[20px] mb-2 truncate text-gray-neutral900">{job.title}</h3>
          <p className="font-inter font-light text-[12px] line-clamp-1 text-gray-neutral600">{job.description}</p>
        </div>
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
            <div className="inline-flex items-center justify-center px-2 h-[17px] rounded-[5px] text-[10px] bg-gray-neutral100 text-gray-neutral400">
              {extraCount}+
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto space-y-[16px]">
        {/* Location and Salary */}
        <div className="flex flex-wrap items-center gap-2">
          <StaticLocationTag label={job.location} />
          <StaticSalaryTag label={`${job.salary} /${job.salaryPeriod}`} className="whitespace-nowrap" />
        </div>

        {/* Applied Date */}
        <div className="flex justify-start">
          <span className="font-inter font-medium text-[10px] text-gray-neutral600">Applied on: {job.appliedOn}</span>
        </div>

        {/* Status and Delete Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-inter text-tiny text-primary-primary500 font-medium">Status:</span>
            <div className={`flex items-center gap-1 px-3 py-1 rounded-md ${status.bgColor} ${status.textColor}`}>
              <status.icon className="w-4 h-4" />
              <span className="font-inter text-tiny font-medium">{status.text}</span>
            </div>
          </div>
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className="p-1 text-error-error500 hover:text-error-error600 hover:bg-error-error50 rounded transition-colors flex-shrink-0"
              title="Delete application"
            >
              <RiDeleteBin6Line className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}