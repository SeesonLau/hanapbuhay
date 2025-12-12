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
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/hooks/useLanguage';
import { parseLocationDetailed } from '@/lib/constants/philippines-locations';

export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

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
  raw?: any;
}

export interface AppliedJobCardProps {
  job: AppliedJob;
  variant?: 'card' | 'list';
  onDelete?: (jobId: string) => void;
  onClick?: (job: AppliedJob) => void;
  className?: string;
}

export const ApplicationStatusBadge = ({ 
  status, 
  isLocked = false, 
  isDeleted = false,
  className = '',
  size = 'sm'
}: { 
  status: ApplicationStatus; 
  isLocked?: boolean; 
  isDeleted?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const shouldUsePastelColors = theme.name !== 'classic';

  const statusConfig = {
    pending: {
      text: t.jobs.appliedJobs.status.pending,
      bgColor: 'bg-warning-warning100',
      textColor: 'text-warning-warning700',
      icon: GoClock
    },
    approved: {
      text: t.jobs.appliedJobs.status.approved,
      bgColor: 'bg-success-success100',
      textColor: 'text-success-success700',
      icon: IoCheckmarkCircleOutline
    },
    rejected: {
      text: t.jobs.appliedJobs.status.rejected,
      bgColor: 'bg-error-error100',
      textColor: 'text-error-error700',
      icon: LuCircleX
    },
    unknown: {
      text: t.jobs.appliedJobs.status.unknown,
      bgColor: 'bg-gray-neutral100',
      textColor: 'text-gray-neutral700',
      icon: GoClock
    },
  };

  const config = statusConfig[status] || statusConfig.unknown;
  const isMuted = isLocked || isDeleted;
  
  const statusOverride = isDeleted
    ? { text: t.jobs.appliedJobs.status.deleted, bgColor: 'bg-gray-neutral100', textColor: 'text-gray-neutral600', icon: RiDeleteBin6Line }
    : isLocked
      ? { text: t.jobs.appliedJobs.status.locked, bgColor: 'bg-gray-neutral100', textColor: 'text-gray-neutral600', icon: LuCircleX }
      : null;
      
  const displayStatus = statusOverride || config;
  const Icon = displayStatus.icon;
  
  const iconClass = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
  const textClass = size === 'sm' ? 'text-[10px]' : 'text-tiny';
  const paddingClass = size === 'sm' ? 'px-2 py-1' : 'px-3 py-1';

  if (isMuted) {
    return (
      <div className={`flex items-center gap-1 ${paddingClass} rounded-md ${className}`} style={{
        backgroundColor: shouldUsePastelColors ? theme.colors.pastelBg : '#e5e7eb',
        color: shouldUsePastelColors ? theme.colors.pastelText : '#9ca3af',
      }}>
        <Icon className={iconClass} />
        <span className={`font-inter ${textClass} font-medium`}>{displayStatus.text}</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1 ${paddingClass} rounded-md ${displayStatus.bgColor} ${displayStatus.textColor} ${className}`}>
      <Icon className={iconClass} />
      <span className={`font-inter ${textClass} font-medium`}>{displayStatus.text}</span>
    </div>
  );
};

export default function AppliedJobCard({
  job,
  variant = 'card',
  onDelete,
  onClick,
  className = ''
}: AppliedJobCardProps) {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const statusConfig = {
    pending: {
      text: t.jobs.appliedJobs.status.pending,
      bgColor: 'bg-warning-warning100',
      textColor: 'text-warning-warning700',
      icon: GoClock
    },
    approved: {
      text: t.jobs.appliedJobs.status.approved,
      bgColor: 'bg-success-success100',
      textColor: 'text-success-success700',
      icon: IoCheckmarkCircleOutline
    },
    rejected: {
      text: t.jobs.appliedJobs.status.rejected,
      bgColor: 'bg-error-error100',
      textColor: 'text-error-error700',
      icon: LuCircleX
    },
    unknown: {
      text: t.jobs.appliedJobs.status.unknown,
      bgColor: 'bg-gray-neutral100',
      textColor: 'text-gray-neutral700',
      icon: GoClock
    },
  };

  const status = statusConfig[job.status] || statusConfig.unknown;
  const rawPost = (job as any)?.raw?.posts ?? (job as any)?.raw?.post ?? {};
  const isLocked = Boolean(rawPost?.isLocked ?? rawPost?.is_locked);
  const isDeleted = Boolean(rawPost?.deletedAt ?? rawPost?.deleted_at);
  const isMuted = isLocked || isDeleted;
  const statusOverride = isDeleted
    ? { text: t.jobs.appliedJobs.status.deleted, bgColor: 'bg-gray-neutral100', textColor: 'text-gray-neutral600', icon: RiDeleteBin6Line }
    : isLocked
      ? { text: t.jobs.appliedJobs.status.locked, bgColor: 'bg-gray-neutral100', textColor: 'text-gray-neutral600', icon: LuCircleX }
      : null;
  const displayStatus = statusOverride || status;

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

  const getAboutText = (description: string): string => {
    const requirementsMatch = description.match(/\[requirements\]\s*([\s\S]*)/i);
    return requirementsMatch ? description.substring(0, requirementsMatch.index).trim() : description;
  };

  const aboutText = getAboutText(job.description);

  const {
    genderTags = [],
    experienceTags = [],
    jobTypeTags = []
  } = job;

  const normalizeJobType = (label: string): string | null => {
    const isSubType = Object.values(JobType).some((jt) => (SubTypes[jt] || []).includes(label));
    return isSubType ? label : null;
  };

  const normalizedJobTypes = jobTypeTags
    .map((label) => normalizeJobType(label))
    .filter((t): t is string => Boolean(t));

  const normalizeGender = (label: string): string | null => {
    const isValid = Object.values(Gender).includes(label as Gender);
    return isValid ? label : null;
  };

  const normalizedGenders = genderTags
    .map((label) => normalizeGender(label))
    .filter((t): t is string => Boolean(t));

  const normalizeExperience = (label: string): string | null => {
    const isValid = Object.values(ExperienceLevel).includes(label as ExperienceLevel);
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

  const shortTitle = job.title.length > 60 ? `${job.title.slice(0, 60)}...` : job.title;
  const firstTag = allTags[0];
  const hiddenCount = Math.max(0, allTags.length - 1);

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
    const gapPx = 4;
    const overflowWidth = overflowMeasure ? overflowMeasure.offsetWidth : 24;

    let used = 0;
    let count = 0;
    for (let i = 0; i < widths.length; i++) {
      const w = widths[i] + (i > 0 ? gapPx : 0);
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
  }, [job.title, job.description, job.location, job.salary, job.salaryPeriod, job.appliedOn, allTags.length]);

  useEffect(() => {
    const onResize = () => recomputeVisibleCount();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const visibleTags = allTags.slice(0, Math.max(0, visibleCount));
  const extraCount = Math.max(0, allTags.length - visibleTags.length);

  // Determine if we should use pastel colors (non-classic themes) or gray (classic theme)
  const shouldUsePastelColors = theme.name !== 'classic';

  // Format location with comma (e.g., "Cebu, Cebu City") - excludes address when muted
  const formatLocationWithComma = (locationString: string): string => {
    const { province, city } = parseLocationDetailed(locationString);
    let formatted = '';
    if (province) formatted += province;
    if (city) formatted += (formatted ? ', ' : '') + city;
    return formatted || locationString;
  };

  // Render tag with theme-based styling when muted
  const renderTag = (tag: typeof allTags[0], key: string) => {
    if (!isMuted) {
      if (tag.type === 'gender') {
        return <StaticGenderTag key={key} label={tag.label} />;
      } else if (tag.type === 'experience') {
        return <StaticExperienceLevelTag key={key} label={tag.label} />;
      } else {
        return <StaticJobTypeTag key={key} label={tag.label} />;
      }
    }

    return (
      <div key={key} style={{
        backgroundColor: shouldUsePastelColors ? theme.colors.pastelBg : '#e5e7eb',
        color: shouldUsePastelColors ? theme.colors.pastelText : '#9ca3af',
        display: 'inline-flex',
        borderRadius: '5px',
        padding: '0 12px',
        height: '17px',
        fontSize: '10px',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {tag.label}
      </div>
    );
  };

  if (variant === 'list') {
    return (
      <div
        onClick={handleClick}
        className={`w-full h-[60px] border shadow-sm px-6 rounded-[10px] transition-all duration-300 ease-out cursor-pointer ${className}`}
        style={{
          backgroundColor: isMuted ? theme.colors.backgroundSecondary : theme.colors.cardBg,
          borderColor: theme.colors.cardBorder,
        }}
        onMouseEnter={(e) => {
          if (!isMuted) {
            e.currentTarget.style.backgroundColor = theme.colors.cardHover;
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isMuted) {
            e.currentTarget.style.backgroundColor = theme.colors.cardBg;
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
          }
        }}
      >
        <div className="grid items-center h-full gap-6 grid-cols-2 tablet:grid-cols-4 laptop:grid-cols-3 laptop-L:grid-cols-5">
          <div className="min-w-0 flex items-center mobile-S:max-w-[150px]">
            <h3 
              className="font-alexandria font-semibold text-[15px] truncate"
              style={{ color: isMuted ? theme.colors.textMuted : theme.colors.text }}
            >
              {shortTitle}
            </h3>
          </div>

          <div className="min-w-0 hidden tablet:block">
            <div className={`flex items-center gap-2 whitespace-nowrap overflow-hidden`}>
              {firstTag && renderTag(firstTag, 'first-tag')}
              {hiddenCount > 0 && (
                <div 
                  className="inline-flex items-center justify-center px-2 h-[17px] rounded-[5px] text-[10px]"
                  style={{
                    backgroundColor: isMuted ? (shouldUsePastelColors ? theme.colors.pastelBgLight : '#f3f4f6') : '#f3f4f6',
                    color: isMuted ? (shouldUsePastelColors ? theme.colors.pastelText : '#9ca3af') : '#9ca3af',
                  }}
                >
                  +{hiddenCount}
                </div>
              )}
            </div>
          </div>

          <div className={`hidden laptop-L:flex items-center gap-3 flex-1`}>
            <div className="w-[140px] min-w-[140px] max-w-[140px] overflow-hidden">
              {isMuted ? (
                <StaticSalaryTag 
                  label={`${job.salary} /${job.salaryPeriod}`} 
                  className="whitespace-nowrap w-full"
                  iconColor={shouldUsePastelColors ? theme.colors.pastelText : '#9ca3af'}
                  style={{
                    backgroundColor: shouldUsePastelColors ? theme.colors.pastelBg : '#e5e7eb',
                    color: shouldUsePastelColors ? theme.colors.pastelText : '#9ca3af',
                    borderRadius: '5px',
                    padding: '0 12px',
                    fontSize: '10px',
                  }}
                />
              ) : (
                <StaticSalaryTag 
                  label={`${job.salary} /${job.salaryPeriod}`} 
                  className="whitespace-nowrap w-full"
                />
              )}
            </div>
          </div>

          <div className="hidden tablet:flex laptop:hidden laptop-L:flex flex-shrink-0">
            <span 
              className="font-inter text-[10px] whitespace-nowrap"
              style={{ color: isMuted ? theme.colors.textMuted : theme.colors.textSecondary }}
            >
              {t.jobs.appliedJobs.appliedOn}: {job.appliedOn}
            </span>
          </div>

          <div className="flex-shrink-0 justify-self-end flex items-center gap-3 justify-end">
            {isMuted ? (
              <div 
                className="flex items-center gap-1 px-2 py-1 rounded-md"
                style={{
                  backgroundColor: shouldUsePastelColors ? theme.colors.pastelBg : '#e5e7eb',
                  color: shouldUsePastelColors ? theme.colors.pastelText : '#9ca3af',
                }}
              >
                <displayStatus.icon className="w-3 h-3" />
                <span className="font-inter text-[10px] font-medium">{displayStatus.text}</span>
              </div>
            ) : (
              <div 
                className={`flex items-center gap-1 px-2 py-1 rounded-md ${displayStatus.bgColor} ${displayStatus.textColor}`}
              >
                <displayStatus.icon className="w-3 h-3" />
                <span className="font-inter text-[10px] font-medium">{displayStatus.text}</span>
              </div>
            )}

            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                className="p-1.5 rounded-md transition-colors"
                style={isMuted ? {
                  color: shouldUsePastelColors ? theme.colors.pastelText : '#9ca3af',
                  backgroundColor: shouldUsePastelColors ? theme.colors.pastelBgLight : '#f3f4f6',
                } : {
                  color: '#ef4444',
                  backgroundColor: 'transparent',
                }}
                title={t.jobs.appliedJobs.withdrawApplication}
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
      className={`relative group w-full h-full min-h-[220px] rounded-lg p-6 flex flex-col transition-all duration-300 ease-out cursor-pointer ${className}`}
      style={{
        backgroundColor: isMuted ? theme.colors.backgroundSecondary : theme.colors.cardBg,
        boxShadow: '0px 0px 10px rgba(0,0,0,0.25)',
      }}
      onMouseEnter={(e) => {
        if (!isMuted) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0px 4px 20px rgba(0,0,0,0.3)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isMuted) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.25)';
        }
      }}
    >
      <div className={`flex-shrink-0 mb-[16px] flex items-start justify-between gap-2`}>
        <div className="min-w-0 flex-1">
          <h3 
            className="font-alexandria font-semibold text-[20px] truncate"
            style={{ color: isMuted ? theme.colors.textMuted : theme.colors.text }}
          >
            {job.title}
          </h3>
          <p 
            className="font-inter font-light text-[12px] line-clamp-1"
            style={{ color: isMuted ? theme.colors.textMuted : theme.colors.textSecondary }}
          >
            {aboutText}
          </p>
        </div>
        
        {onDelete && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className="laptop:!hidden z-10 flex-shrink-0 border-2 rounded-full w-6 h-6 items-center justify-center hover:bg-error-error50 shadow-md leading-none text-xl font-medium"
              style={{
                display: 'flex',
                backgroundColor: isMuted ? (shouldUsePastelColors ? theme.colors.pastelBg : '#e5e7eb') : 'white',
                borderColor: isMuted ? (shouldUsePastelColors ? theme.colors.pastelText : '#9ca3af') : '#ef4444',
                color: isMuted ? (shouldUsePastelColors ? theme.colors.pastelText : '#9ca3af') : '#ef4444',
              }}
              title="Withdraw application"
            >
              −
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className="hidden laptop:!flex z-10 flex-shrink-0 border-2 rounded-full w-6 h-6 items-center justify-center shadow-md leading-none text-xl font-medium opacity-0 group-hover:opacity-100 transition-opacity"
              style={{
                backgroundColor: isMuted ? (shouldUsePastelColors ? theme.colors.pastelBg : '#e5e7eb') : 'white',
                borderColor: isMuted ? (shouldUsePastelColors ? theme.colors.pastelText : '#9ca3af') : '#ef4444',
                color: isMuted ? (shouldUsePastelColors ? theme.colors.pastelText : '#9ca3af') : '#ef4444',
              }}
              title="Withdraw application"
            >
              −
            </button>
          </>
        )}
      </div>

      <div className="mb-[16px]">
        <div ref={measureRef} className="fixed -top-[9999px] -left-[9999px] flex flex-nowrap gap-1">
          {allTags.map((tag, index) => renderTag(tag, `measure-${index}`))}
        </div>
        <div 
          ref={overflowMeasureRef} 
          className="fixed -top-[9999px] -left-[9999px] inline-flex items-center justify-center px-2 h-[17px] rounded-[5px] text-[10px]"
          style={{
            backgroundColor: isMuted ? (shouldUsePastelColors ? theme.colors.pastelBgLight : '#f3f4f6') : '#f3f4f6',
            color: isMuted ? (shouldUsePastelColors ? theme.colors.pastelText : '#9ca3af') : '#9ca3af',
          }}
        >
          99+
        </div>

        <div ref={tagsRowRef} className={`flex flex-nowrap gap-1 overflow-hidden whitespace-nowrap items-center`}>
          {visibleTags.map((tag, index) => renderTag(tag, `tag-${index}`))}
          {extraCount > 0 && (
            <div 
              className="inline-flex items-center justify-center px-2 h-[17px] rounded-[5px] text-[10px]"
              style={{
                backgroundColor: isMuted ? (shouldUsePastelColors ? theme.colors.pastelBgLight : '#f3f4f6') : '#f3f4f6',
                color: isMuted ? (shouldUsePastelColors ? theme.colors.pastelText : '#9ca3af') : '#9ca3af',
              }}
            >
              {extraCount}+
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto space-y-[16px]">
        <div className={`flex flex-wrap items-center gap-2`}>
          {isMuted ? (
            <StaticLocationTag
              label={job.location}
              showFullAddress={false}
              iconColor={shouldUsePastelColors ? theme.colors.pastelText : '#9ca3af'}
              style={{
                backgroundColor: shouldUsePastelColors ? theme.colors.pastelBg : '#e5e7eb',
                color: shouldUsePastelColors ? theme.colors.pastelText : '#9ca3af',
                borderRadius: '5px',
                padding: '0 12px',
                fontSize: '10px',
              }}
            />
          ) : (
            <StaticLocationTag 
              label={job.location} 
              showFullAddress={false} 
            />
          )}
          {isMuted ? (
            <StaticSalaryTag
              label={`${job.salary} /${job.salaryPeriod}`}
              className="whitespace-nowrap"
              iconColor={shouldUsePastelColors ? theme.colors.pastelText : '#9ca3af'}
              style={{
                backgroundColor: shouldUsePastelColors ? theme.colors.pastelBg : '#e5e7eb',
                color: shouldUsePastelColors ? theme.colors.pastelText : '#9ca3af',
                borderRadius: '5px',
                padding: '0 12px',
                fontSize: '10px',
              }}
            />
          ) : (
            <StaticSalaryTag 
              label={`${job.salary} /${job.salaryPeriod}`} 
              className="whitespace-nowrap"
            />
          )}
        </div>

        <div className="flex items-center justify-between">
          <span 
            className="font-inter font-medium text-[10px]"
            style={{ color: isMuted ? theme.colors.textMuted : theme.colors.textSecondary }}
          >
            Applied on: {job.appliedOn}
          </span>
          {isMuted ? (
            <div 
              className="flex items-center gap-1 px-3 py-1 rounded-md"
              style={{
                backgroundColor: shouldUsePastelColors ? theme.colors.pastelBg : '#e5e7eb',
                color: shouldUsePastelColors ? theme.colors.pastelText : '#9ca3af',
              }}
            >
              <displayStatus.icon className="w-4 h-4" />
              <span className="font-inter text-tiny font-medium">{displayStatus.text}</span>
            </div>
          ) : (
            <div 
              className={`flex items-center gap-1 px-3 py-1 rounded-md ${displayStatus.bgColor} ${displayStatus.textColor}`}
            >
              <displayStatus.icon className="w-4 h-4" />
              <span className="font-inter text-tiny font-medium">{displayStatus.text}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
