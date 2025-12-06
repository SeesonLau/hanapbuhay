"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { StaticGenderTag, StaticExperienceLevelTag, StaticJobTypeTag, StaticLocationTag, StaticSalaryTag } from '@/components/ui/TagItem';
import { JobType, SubTypes } from '@/lib/constants/job-types';
import { Gender } from '@/lib/constants/gender';
import { ExperienceLevel } from '@/lib/constants/experience-level';
import { fontClasses } from '@/styles/fonts';
import Button from '@/components/ui/Button';
import { useTheme } from '@/hooks/useTheme';

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

interface JobPostCardProps {
  jobData: JobPostData;
  className?: string;
  variant?: 'default' | 'glassy';
  disableCardClick?: boolean;
  onApply?: (id: string) => void;
  onOpen?: (data: JobPostData) => void;
}

export const JobPostCard: React.FC<JobPostCardProps> = ({ 
  jobData, 
  className = '', 
  variant = 'default', 
  disableCardClick = false, 
  onApply, 
  onOpen 
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

  const [visibleCount, setVisibleCount] = React.useState<number>(Math.min(allTags.length, 4));
  const measureRef = React.useRef<HTMLDivElement | null>(null);
  const overflowMeasureRef = React.useRef<HTMLDivElement | null>(null);
  const tagsRowRef = React.useRef<HTMLDivElement | null>(null);

  const recomputeVisibleCount = React.useCallback(() => {
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
  }, [allTags.length]);

  React.useLayoutEffect(() => {
    recomputeVisibleCount();
  }, [jobData.title, jobData.description, jobData.location, jobData.salary, jobData.salaryPeriod, jobData.postedDate, allTags.length]);

  React.useEffect(() => {
    const onResize = () => recomputeVisibleCount();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const visibleTags = allTags.slice(0, Math.max(0, visibleCount));
  const extraCount = Math.max(0, allTags.length - visibleTags.length);

  // Glassy variant - uses gradient overlays
  if (variant === 'glassy') {
    return (
      <motion.div 
        className={`w-full h-full min-h-[280px] mobile-M:min-h-[300px] rounded-2xl tablet:rounded-3xl p-5 mobile-M:p-6 tablet:p-7 laptop:p-8 flex flex-col overflow-hidden ${disableCardClick ? '' : 'cursor-pointer'} ${className}`}
        style={{
          background: `linear-gradient(135deg, ${theme.colors.primary}15 0%, ${theme.colors.secondary}15 100%)`,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${theme.colors.primary}30`,
          boxShadow: `0 8px 32px ${theme.colors.primary}20`
        }}
        onClick={disableCardClick ? undefined : () => onOpen?.(jobData)}
        whileHover={disableCardClick ? undefined : { 
          scale: 1.02, 
          y: -4,
          boxShadow: `0 12px 48px ${theme.colors.primary}30`
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="flex-shrink-0 mb-4 mobile-M:mb-5 tablet:mb-6">
          <h3 className={`${fontClasses.heading} font-bold text-lead mobile-M:text-h3 tablet:text-h2 mb-2 mobile-M:mb-3 line-clamp-1 text-white`}>
            {title}
          </h3>
          <p className={`${fontClasses.body} font-light text-small mobile-M:text-body line-clamp-2 text-gray-300`}>
            {description}
          </p>
        </div>

        <div className="mb-4 mobile-M:mb-5 tablet:mb-6">
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
          <div ref={overflowMeasureRef} className="fixed -top-[9999px] -left-[9999px] inline-flex items-center justify-center px-2 h-[17px] rounded-[5px] text-[10px] bg-white/10 text-gray-300">
            99+
          </div>

          <div ref={tagsRowRef} className="flex flex-wrap gap-1 items-center min-h-[17px]">
            {visibleTags.map((tag, index) => (
              tag.type === 'gender' ? (
                <StaticGenderTag key={`tag-${index}`} label={tag.label} variant="glassy" />
              ) : tag.type === 'experience' ? (
                <StaticExperienceLevelTag key={`tag-${index}`} label={tag.label} variant="glassy" />
              ) : (
                <StaticJobTypeTag key={`tag-${index}`} label={tag.label} variant="glassy" />
              )
            ))}
            {extraCount > 0 && (
              <div className="inline-flex items-center justify-center px-2 h-[17px] rounded-[5px] text-[10px] bg-white/10 text-gray-300 backdrop-blur-sm border border-white/20">
                {extraCount}+
              </div>
            )}
          </div>
        </div>

        <div className="mt-auto space-y-4 mobile-M:space-y-5">
          <div className="flex items-center gap-2 flex-wrap">
            <StaticLocationTag label={location} variant="glassy" />
            <StaticSalaryTag label={`${salary} /${salaryPeriod}`} variant="glassy" />
          </div>

          <div className="flex flex-col mobile-M:flex-row items-start mobile-M:items-center justify-between gap-3 mobile-M:gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`${fontClasses.body} font-medium text-small text-gray-300`}>
                Posted: {postedDate}
              </span>
              <span className="text-gray-400 hidden mobile-M:inline">•</span>
              <span className={`${fontClasses.body} text-small text-blue-300 font-semibold`}>
                {applicantCount} Applicants
              </span>
            </div>
            <Button
              variant="glassy"
              size="sm"
              fullRounded
              onClick={(e) => { e.stopPropagation(); onApply?.(id); }}
            >
              Apply Now
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Default variant - themed
  return (
    <div 
      className={`w-full h-full min-h-[250px] rounded-lg p-4 mobile-M:p-5 mobile-L:p-6 tablet:p-[30px] flex flex-col overflow-hidden transition-all duration-300 ease-out cursor-pointer ${className}`}
      style={{
        backgroundColor: theme.colors.cardBg,
        boxShadow: '0px 0px 10px rgba(0,0,0,0.25)',
      }}
      onClick={() => onOpen?.(jobData)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0px 4px 20px rgba(0,0,0,0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.25)';
      }}
    >
      <div className="flex-shrink-0 mb-3 mobile-M:mb-4 tablet:mb-[16px]">
        <h3 
          className={`font-alexandria font-semibold text-body mobile-M:text-lead mobile-L:text-title tablet:text-[20px] mb-1 mobile-M:mb-2 line-clamp-1 h-[1.5em]`}
          style={{ color: theme.colors.text }}
        >
          {title}
        </h3>
        <p 
          className={`font-inter font-light text-tiny mobile-M:text-small tablet:text-[12px] line-clamp-1 h-[1.2em]`}
          style={{ color: theme.colors.textSecondary }}
        >
          {description}
        </p>
      </div>

      <div className="mb-3 mobile-M:mb-4 tablet:mb-[16px]">
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
        <div ref={overflowMeasureRef} className="fixed -top-[9999px] -left-[9999px] inline-flex items-center justify-center px-2 h-[17px] rounded-[5px] text-[10px] bg-gray-neutral100 text-gray-neutral400">
          99+
        </div>

        <div ref={tagsRowRef} className="flex flex-wrap gap-1 items-center min-h-[17px]">
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

      <div className="mt-auto space-y-3 mobile-M:space-y-4 tablet:space-y-[16px]">
        <div className="flex items-center gap-2 flex-wrap">
          <StaticLocationTag label={location} showFullAddress={false} />
          <StaticSalaryTag label={`${salary} /${salaryPeriod}`} />
        </div>

        <div className="flex flex-col mobile-M:flex-row items-start mobile-M:items-center justify-between gap-2 mobile-M:gap-0">
          <div className="flex items-center gap-1.5 mobile-M:gap-2 flex-wrap">
            <span 
              className={`font-inter font-medium text-[9px] mobile-M:text-[10px]`}
              style={{ color: theme.colors.textSecondary }}
            >
              Posted on: {postedDate}
            </span>
            <span className="text-gray-400 hidden mobile-M:inline">•</span>
            <span 
              className={`font-inter text-[9px] mobile-M:text-[10px]`}
              style={{ color: theme.colors.textSecondary }}
            >
              {applicantCount} Applicants
            </span>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={(e) => { e.stopPropagation(); onApply?.(id); }}
          >
            Apply Now
          </Button>
        </div>
      </div>
    </div>
  );
};