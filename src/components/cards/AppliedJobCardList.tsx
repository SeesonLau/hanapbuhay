'use client';

import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { GoClock } from "react-icons/go";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { LuCircleX } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";

// Status type for better type safety
export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

// Job application data interface
export interface AppliedJob {
  id: string;
  title: string;
  description: string;
  location: string;
  salary: number;
  salaryType: 'fixed' | 'monthly';
  appliedOn: string;
  status: ApplicationStatus;
  tags: string[];
  genderPreference?: string;
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

// Tag color variants
const tagColors = {
  blue: 'bg-primary-primary100 text-primary-primary700',
  green: 'bg-success-success100 text-success-success700',
  yellow: 'bg-warning-warning100 text-warning-warning700',
  gray: 'bg-gray-neutral100 text-gray-neutral700'
};

const getTagColor = (index: number): keyof typeof tagColors => {
  const colors: (keyof typeof tagColors)[] = ['blue', 'green', 'yellow', 'gray'];
  return colors[index % colors.length];
};

export default function AppliedJobCard({ 
  job, 
  variant = 'card', 
  onDelete, 
  className = '' 
}: AppliedJobCardProps) {
  const status = statusConfig[job.status] || statusConfig.unknown;
  
  // Debug: Log tags to see what we're getting
  console.log('Job tags:', job.title, job.tags);
  
  const handleDelete = () => {
    if (onDelete) {
      onDelete(job.id);
    }
  };

  const formatSalary = (amount: number, type: 'fixed' | 'monthly') => {
    return (
      <>
        <span className="text-success-success600 font-bold">PHP</span>{' '}
        <span className="text-gray-neutral700">{amount.toLocaleString()}.00{type === 'monthly' ? '/month' : ''}</span>
      </>
    );
  };

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
            {job.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className={`
                  px-2 py-1 rounded-md text-mini font-inter font-medium flex-shrink-0
                  ${tagColors[getTagColor(index)]}
                `}
              >
                {tag}
              </span>
            ))}
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
          <div className="flex items-center gap-1 px-2 py-1 bg-gray-neutral100 rounded-md w-fit">
            <span className="font-inter font-medium text-mini whitespace-nowrap">
              {formatSalary(job.salary, job.salaryType)}
            </span>
          </div>
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
        {job.tags && job.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {job.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className={`
                  px-2 py-1 rounded-md text-mini font-inter font-medium
                  ${tagColors[getTagColor(index)]}
                `}
              >
                {tag}
              </span>
            ))}
            {job.tags.length > 3 && (
              <span className="px-2 py-1 rounded-md text-mini font-inter font-medium bg-gray-neutral100 text-gray-neutral700">
                +{job.tags.length - 3}
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

        <div className="flex items-center px-3 py-1 bg-gray-neutral100 rounded-md">
          <span className="font-inter font-medium text-mini whitespace-nowrap">
            {formatSalary(job.salary, job.salaryType)}
          </span>
        </div>
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