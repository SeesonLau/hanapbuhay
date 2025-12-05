"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { StaticGenderTag, StaticExperienceLevelTag, StaticJobTypeTag, StaticLocationTag, StaticSalaryTag } from '@/components/ui/TagItem';
import { JobType, SubTypes } from '@/lib/constants/job-types';
import { Gender } from '@/lib/constants/gender';
import { ExperienceLevel } from '@/lib/constants/experience-level';
import { fontClasses } from '@/styles/fonts';

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
  onApply?: (id: string) => void;
  onOpen?: (data: JobPostData) => void;
}

export const JobPostCard: React.FC<JobPostCardProps> = ({ jobData, className = '', variant = 'default', onApply, onOpen }) => {
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
  // Dynamically determine how many tags fit on a single row
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
    const gapPx = 4; // gap-1
    const overflowWidth = overflowMeasure ? overflowMeasure.offsetWidth : 24; // fallback

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobData.title, jobData.description, jobData.location, jobData.salary, jobData.salaryPeriod, jobData.postedDate, allTags.length]);

  React.useEffect(() => {
    const onResize = () => recomputeVisibleCount();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visibleTags = allTags.slice(0, Math.max(0, visibleCount));
  const extraCount = Math.max(0, allTags.length - visibleTags.length);

  // Glassy variant styles
  if (variant === 'glassy') {
    return (
      <motion.div 
        className={`w-full h-full min-h-[280px] mobile-M:min-h-[300px] rounded-2xl tablet:rounded-3xl p-5 mobile-M:p-6 tablet:p-7 laptop:p-8 flex flex-col overflow-hidden cursor-pointer ${className}`}
        style={{
          background: 'rgba(30, 58, 138, 0.15)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          boxShadow: '0 8px 32px rgba(30, 58, 138, 0.2)'
        }}
        onClick={() => onOpen?.(jobData)}
        whileHover={{ 
          scale: 1.02, 
          y: -4,
          boxShadow: '0 12px 48px rgba(30, 58, 138, 0.3)'
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Header */}
        <div className="flex-shrink-0 mb-4 mobile-M:mb-5 tablet:mb-6">
          <h3 className={`${fontClasses.heading} font-bold text-lead mobile-M:text-h3 tablet:text-h2 mb-2 mobile-M:mb-3 line-clamp-1 text-white`}>
            {title}
          </h3>
          <p className={`${fontClasses.body} font-light text-small mobile-M:text-body line-clamp-2 text-gray-300`}>
            {description}
          </p>
        </div>

        {/* Tags Section */}
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

        {/* Footer */}
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
            <motion.button
              onClick={(e) => { e.stopPropagation(); onApply?.(id); }}
              className="px-4 mobile-M:px-5 py-2 mobile-M:py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors text-small mobile-M:text-body font-semibold shadow-lg shadow-blue-600/30 whitespace-nowrap"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Apply Now
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Default variant
  return (
    <div 
      className={`w-full h-full min-h-[250px] bg-white rounded-lg shadow-[0px_0px_10px_rgba(0,0,0,0.25)] p-4 mobile-M:p-5 mobile-L:p-6 tablet:p-[30px] flex flex-col overflow-hidden transition-all duration-200 ease-out hover:shadow-lg hover:-translate-y-[2px] cursor-pointer ${className}`}
      onClick={() => onOpen?.(jobData)}
    >
      {/* Header */}
      <div className="flex-shrink-0 mb-3 mobile-M:mb-4 tablet:mb-[16px]">
        <h3 className={`font-alexandria font-semibold text-body mobile-M:text-lead mobile-L:text-title tablet:text-[20px] mb-1 mobile-M:mb-2 line-clamp-1 text-gray-neutral900 h-[1.5em]`}>{title}</h3>
        <p className={`font-inter font-light text-tiny mobile-M:text-small tablet:text-[12px] line-clamp-1 text-gray-neutral600 h-[1.2em]`}>{description}</p>
      </div>

      {/* Tags Section - Single row that adapts to fit */}
      <div className="mb-3 mobile-M:mb-4 tablet:mb-[16px]">
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
            <div
              className="inline-flex items-center justify-center px-2 h-[17px] rounded-[5px] text-[10px] bg-gray-neutral100 text-gray-neutral400"
            >
              {extraCount}+
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto space-y-3 mobile-M:space-y-4 tablet:space-y-[16px]">
        {/* Location and Salary */}
        <div className="flex items-center gap-2 flex-wrap">
          <StaticLocationTag label={location} />
          <StaticSalaryTag label={`${salary} /${salaryPeriod}`} />
        </div>

        {/* Posted Date + Applicants + Apply Button */}
        <div className="flex flex-col mobile-M:flex-row items-start mobile-M:items-center justify-between gap-2 mobile-M:gap-0">
          <div className="flex items-center gap-1.5 mobile-M:gap-2 flex-wrap">
            <span className={`font-inter font-medium text-[9px] mobile-M:text-[10px] text-gray-neutral600`}>Posted on: {postedDate}</span>
            <span className="text-gray-400 hidden mobile-M:inline">•</span>
            <span className={`font-inter text-[9px] mobile-M:text-[10px] text-gray-neutral600`}>{applicantCount} Applicants</span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onApply?.(id); }}
            className="px-3 mobile-M:px-4 py-1.5 mobile-M:py-2 bg-primary-primary500 text-white rounded-lg hover:bg-primary-primary600 transition-colors text-tiny mobile-M:text-small whitespace-nowrap"
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
};