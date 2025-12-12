'use client';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { StaticGenderTag, StaticExperienceLevelTag, StaticJobTypeTag, StaticLocationTag, StaticSalaryTag } from '@/components/ui/TagItem';
import ManageJobActionButtons from '@/components/posts/ManageJobActionButtons';
import { JobType, SubTypes } from '@/lib/constants/job-types';
import { Gender } from '@/lib/constants/gender';
import { ExperienceLevel } from '@/lib/constants/experience-level';
import { useTheme } from '@/hooks/useTheme';
import { parseLocationDetailed } from '@/lib/constants/philippines-locations';

interface JobPostData {
  id: string;
  title: string;
  description: string;
  location: string;
  salary: string;
  salaryPeriod: string;
  postedDate: string;
  isLocked: boolean;
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
  onToggleLock?: (postId: string, isLocked: boolean) => void;
}

export const ManageJobPostCard: React.FC<ManageJobPostCardProps> = ({ 
  jobData, 
  className = '',
  onOpen,
  onViewApplicants,
  onEdit,
  onDelete,
  onToggleLock,
}) => {
  const { theme } = useTheme();
  const {
    id,
    title,
    description,
    location,
    salary,
    salaryPeriod,
    postedDate,
    isLocked,
    applicantCount = 0,
    genderTags = [],
    experienceTags = [],
    jobTypeTags = []
  } = jobData;

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

  // Determine if we should use pastel colors (non-classic themes) or gray (classic theme)
  const shouldUsePastelColors = theme.name !== 'classic';

  // Format location with comma (e.g., "Cebu, Cebu City") - excludes address when locked
  const formatLocationWithComma = (locationString: string): string => {
    const { province, city } = parseLocationDetailed(locationString);
    let formatted = '';
    if (province) formatted += province;
    if (city) formatted += (formatted ? ', ' : '') + city;
    return formatted || locationString;
  };

  // Render tag with theme-based styling when locked
  const renderTag = (tag: typeof allTags[0], key: string) => {
    if (!isLocked) {
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
  
  const [visibleCount, setVisibleCount] = useState<number>(Math.min(allTags.length, 4));
  const measureRef = useRef<HTMLDivElement | null>(null);
  const overflowMeasureRef = useRef<HTMLDivElement | null>(null);
  const tagsRowRef = useRef<HTMLDivElement | null>(null);

  const tagMuted = isLocked ? 'text-gray-neutral600 bg-gray-neutral100' : '';

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
  }, [jobData.title, jobData.description, jobData.location, jobData.salary, jobData.salaryPeriod, jobData.postedDate, allTags.length]);

  useEffect(() => {
    const onResize = () => recomputeVisibleCount();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const visibleTags = allTags.slice(0, Math.max(0, visibleCount));
  const extraCount = Math.max(0, allTags.length - visibleTags.length);

  const cardBgColor = isLocked ? theme.colors.backgroundSecondary : theme.colors.cardBg;
  const textColor = isLocked ? theme.colors.textMuted : theme.colors.text;
  const textSecondaryColor = isLocked ? theme.colors.textMuted : theme.colors.textSecondary;

  return (
    <div 
      className={`w-full h-full min-h-[250px] rounded-lg p-6 flex flex-col overflow-hidden transition-all duration-300 ease-out cursor-pointer ${className}`}
      style={{
        backgroundColor: cardBgColor,
        boxShadow: '0px 0px 10px rgba(0,0,0,0.25)',
      }}
      onClick={() => onOpen?.(jobData)}
      onMouseEnter={(e) => {
        if (!isLocked) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0px 4px 20px rgba(0,0,0,0.3)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isLocked) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.25)';
        }
      }}
    >
      {/* Header */}
      <div className={`flex-shrink-0 mb-[16px] flex items-start justify-between`}>
        <div className="min-w-0">
          <h3 
            className={`font-alexandria font-semibold text-[20px] mb-2 truncate`}
            style={{ color: textColor }}
          >
            {title}
          </h3>
          <p 
            className={`font-inter font-light text-[12px] line-clamp-1`}
            style={{ color: textSecondaryColor }}
          >
            {description}
          </p>
        </div>
        <button
          type="button"
          aria-label={!isLocked ? 'Unlock' : 'Lock'}
          className={`inline-flex items-center justify-center h-8 w-8 bg-transparent`}
          style={{ 
            color: !isLocked ? theme.colors.success : theme.colors.textMuted 
          }}
          onClick={(e) => {
            e.stopPropagation();
            onToggleLock?.(id, !isLocked);
          }}
        >
          {!isLocked ? (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 10V7a5 5 0 019.5-2" />
              <rect x="5" y="10" width="14" height="10" rx="2" />
              <circle cx="12" cy="15" r="1.5" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 10V7a5 5 0 0110 0v3" />
              <rect x="5" y="10" width="14" height="10" rx="2" />
              <circle cx="12" cy="15" r="1.5" />
            </svg>
          )}
        </button>
      </div>

      {/* Tags Section */}
      <div className={`mb-[16px]`}>
        <div ref={measureRef} className="fixed -top-[9999px] -left-[9999px] flex flex-nowrap gap-1">
          {allTags.map((tag, index) => renderTag(tag, `measure-${index}`))}
        </div>
        <div 
          ref={overflowMeasureRef} 
          className="fixed -top-[9999px] -left-[9999px] inline-flex items-center justify-center px-2 h-[17px] rounded-[5px] text-[10px]"
          style={{
            backgroundColor: isLocked ? (shouldUsePastelColors ? theme.colors.pastelBgLight : '#f3f4f6') : '#f3f4f6',
            color: isLocked ? (shouldUsePastelColors ? theme.colors.pastelText : '#9ca3af') : '#9ca3af',
          }}
        >
          99+
        </div>

        <div ref={tagsRowRef} className="flex flex-nowrap gap-1 overflow-hidden whitespace-nowrap items-center">
          {visibleTags.map((tag, index) => renderTag(tag, `tag-${index}`))}
          {extraCount > 0 && (
            <div 
              className="inline-flex items-center justify-center px-2 h-[17px] rounded-[5px] text-[10px]"
              style={{
                backgroundColor: isLocked ? (shouldUsePastelColors ? theme.colors.pastelBgLight : '#f3f4f6') : '#f3f4f6',
                color: isLocked ? (shouldUsePastelColors ? theme.colors.pastelText : '#9ca3af') : '#9ca3af',
              }}
            >
              {extraCount}+
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto space-y-[16px]">
        {/* Location and Salary */}
        <div className={`flex flex-wrap items-center gap-2`}>
          <React.Fragment key="location-tag">
            {isLocked ? (
              <StaticLocationTag
                label={location}
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
                label={location} 
                showFullAddress={false} 
              />
            )}
          </React.Fragment>
          <React.Fragment key="salary-tag">
            {isLocked ? (
              <StaticSalaryTag
                label={`${salary} /${salaryPeriod}`}
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
                label={`${salary} /${salaryPeriod}`} 
                className="whitespace-nowrap"
              />
            )}
          </React.Fragment>
        </div>

        {/* Posted Date */}
        <div className={`flex justify-start`}>
          <span 
            className={`font-inter font-medium text-[10px]`}
            style={{ color: textSecondaryColor }}
          >
            Posted on: {postedDate}
          </span>
        </div>
        
        {/* Action Buttons */}
        <ManageJobActionButtons
          applicantCount={applicantCount}
          onViewApplicants={() => onViewApplicants?.(jobData)}
          onEdit={() => onEdit?.(jobData)}
          onDelete={() => onDelete?.(jobData)}
          variant="horizontal"
          className={`w-full ${!isLocked ? '' : ''}`}
        />
      </div>
    </div>
  );
};
