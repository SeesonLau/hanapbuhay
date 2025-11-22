'use client';

import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { GoClock } from "react-icons/go";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { LuCircleX } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";
import { StaticGenderTag, StaticExperienceLevelTag, StaticJobTypeTag, StaticSalaryTag } from '@/components/ui/TagItem';
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
}

// Component props interface
export interface AppliedJobCardProps {
  job: AppliedJob;
  variant?: 'card' | 'list';
  onDelete?: (jobId: string) => void;
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
  className = '' 
}: AppliedJobCardProps) {
  const status = statusConfig[job.status] || statusConfig.unknown;
  
  const handleDelete = () => {
    if (onDelete) {
      onDelete(job.id);
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

  if (variant === 'list') {
    return (
      <div className={`
        flex flex-wrap items-center justify-between
        px-6 py-3
        gap-3
        w-full
        bg-white
        shadow-[0px_0px_10px_rgba(0,0,0,0.25)]
        rounded-[10px]
        hover:shadow-lg transition-shadow duration-200
        ${className}
      `}>
        {/* Job Title - Fixed width */}
        <div className="w-40 min-w-0 flex-shrink-0">
          <h3 className="font-alexandria font-bold text-small text-gray-neutral900 truncate">
            {job.title}
          </h3>
        </div>

        {/* Description - Fixed width with truncation */}
        <div className="w-48 min-w-0 flex-shrink-0">
          <p className="font-inter text-mini text-gray-neutral600 truncate">
            {job.description}
          </p>
        </div>

        {/* Tags - Fixed width */}
        <div className="w-52 min-w-0 flex-shrink-0">
          <div className="flex gap-1 flex-wrap">
            {allTags.slice(0, 3).map((tag, index) => (
              tag.type === 'gender' ? (
                <StaticGenderTag key={`tag-${index}`} label={tag.label} />
              ) : tag.type === 'experience' ? (
                <StaticExperienceLevelTag key={`tag-${index}`} label={tag.label} />
              ) : (
                <StaticJobTypeTag key={`tag-${index}`} label={tag.label} />
              )
            ))}
            {allTags.length > 3 && (
              <div className="inline-flex items-center justify-center px-2 h-[17px] rounded-[5px] text-[10px] bg-gray-neutral100 text-gray-neutral400">
                +{allTags.length - 3}
              </div>
            )}
          </div>
        </div>

        {/* Location - Fixed width */}
        <div className="w-32 min-w-0 flex-shrink-0">
          <div className="flex items-center gap-1 px-2 py-1 bg-gray-neutral100 rounded-md w-fit">
            <FaMapMarkerAlt className="w-3 h-3 text-error-error500 flex-shrink-0" />
            <span className="font-inter text-mini text-gray-neutral700 truncate">{job.location}</span>
          </div>
        </div>

        {/* Salary - Fixed width */}
        <div className="w-32 min-w-0 flex-shrink-0">
          <StaticSalaryTag label={`${job.salary} /${job.salaryPeriod}`} className="whitespace-nowrap" />
        </div>

        {/* Applied Date - Fixed width */}
        <div className="w-40 min-w-0 flex-shrink-0">
          <div className="text-gray-neutral500 font-inter text-mini">
            Applied on: <span className="font-medium text-gray-neutral700">{job.appliedOn}</span>
          </div>
        </div>

        {/* Status - Fixed width */}
        <div className="w-32 min-w-0 flex-shrink-0">
          <div className="flex items-center gap-1">
            <span className="font-inter text-mini text-primary-primary500 font-medium">Status:</span>
            <div className={`
              flex items-center gap-1 px-2 py-1 rounded-md
              ${status.bgColor} ${status.textColor}
            `}>
              <status.icon className="w-3 h-3" />
              <span className="font-inter text-mini font-medium">{status.text}</span>
            </div>
          </div>
        </div>

        {/* Delete Button - Fixed width */}
        <div className="w-10 flex-shrink-0 flex justify-end">
          {onDelete && (
            <button
              onClick={handleDelete}
              className="p-1.5 text-error-error500 hover:text-error-error600 hover:bg-error-error50 rounded-md transition-colors"
              title="Delete application"
            >
              <RiDeleteBin6Line className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Card variant
  return (
    <div className={`
      flex flex-col
      p-6
      gap-2
      w-full
      h-full
      bg-white
      shadow-[0px_0px_10px_rgba(0,0,0,0.25)]
      rounded-[10px]
      hover:shadow-lg transition-shadow duration-200
      ${className}
    `}>
      {/* Header with Title and Delete Button */}
      <div className="flex justify-between items-start gap-3 flex-shrink-0">
        <div className="flex-1 min-w-0">
          <h2 className="font-alexandria font-bold text-lead text-gray-neutral900 line-clamp-1">
            {job.title}
          </h2>
        </div>       
      </div>

      {/* Description */}
      <div className="flex-shrink-0">
        <p className="font-inter text-tiny text-gray-neutral600 line-clamp-2">
          {job.description}
        </p>
      </div>

      {/* Tags */}
      <div className="flex-shrink-0 min-h-[32px]">
        {allTags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {allTags.slice(0, 3).map((tag, index) => (
              tag.type === 'gender' ? (
                <StaticGenderTag key={`tag-${index}`} label={tag.label} />
              ) : tag.type === 'experience' ? (
                <StaticExperienceLevelTag key={`tag-${index}`} label={tag.label} />
              ) : (
                <StaticJobTypeTag key={`tag-${index}`} label={tag.label} />
              )
            ))}
            {allTags.length > 3 && (
              <span className="px-2 py-1 rounded-md text-mini font-inter font-medium bg-gray-neutral100 text-gray-neutral400">
                +{allTags.length - 3}
              </span>
            )}
          </div>
        ) : (
          <div className="text-gray-neutral400 text-mini italic">No tags</div>
        )}
      </div>

      {/* Location and Salary */}
      <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
        <div className="flex items-center gap-1 px-3 py-1 bg-gray-neutral100 rounded-md">
          <FaMapMarkerAlt className="w-3 h-3 text-error-error500 flex-shrink-0" />
          <span className="font-inter text-mini text-gray-neutral700 truncate">{job.location}</span>
        </div>

        <StaticSalaryTag label={`${job.salary} /${job.salaryPeriod}`} className="whitespace-nowrap" />
      </div>

      {/* Applied Date */}
      <div className="text-gray-neutral500 font-inter text-mini flex-shrink-0">
        Applied on: <span className="font-medium text-gray-neutral700">{job.appliedOn}</span>
      </div>

      {/* Spacer to push status to bottom */}
      <div className="flex-grow"></div>

      {/* Status */}
      <div className="flex items-center justify-between flex-shrink-0 pt-2">
        <div className="flex items-center gap-2">
          <span className="font-inter text-tiny text-primary-primary500 font-medium">Status:</span>
          <div className={`
            flex items-center gap-1 px-3 py-1 rounded-md
            ${status.bgColor} ${status.textColor}
          `}>
            <status.icon className="w-4 h-4" />
            <span className="font-inter text-tiny font-medium">{status.text}</span>
          </div>
        </div>
        {onDelete && (
          <button
            onClick={handleDelete}
            className="p-1 text-error-error500 hover:text-error-error600 hover:bg-error-error50 rounded transition-colors flex-shrink-0"
            title="Delete application"
          >
            <RiDeleteBin6Line className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}