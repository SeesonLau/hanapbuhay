import React from 'react';
import { StaticGenderTag, StaticExperienceLevelTag, StaticJobTypeTag, StaticSalaryTag } from '@/components/ui/TagItem';
import ManageJobActionButtons from '@/components/posts/ManageJobActionButtons';
import { JobType, SubTypes } from '@/lib/constants/job-types';
import { Gender } from '@/lib/constants/gender';
import { ExperienceLevel } from '@/lib/constants/experience-level';
import { useTheme } from '@/hooks/useTheme';

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

interface ManageJobPostListProps {
  jobData: JobPostData;
  className?: string;
  onOpen?: (data: JobPostData) => void;
  onViewApplicants?: (data: JobPostData) => void;
  onEdit?: (data: JobPostData) => void;
  onDelete?: (data: JobPostData) => void;
  onToggleLock?: (postId: string, isLocked: boolean) => void;
}

export const ManageJobPostList: React.FC<ManageJobPostListProps> = ({ 
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

  const shortTitle = title.length > 60 ? `${title.slice(0, 60)}...` : title;

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
  const firstTag = allTags[0];
  const hiddenCount = Math.max(0, allTags.length - 1);

  const listBgColor = isLocked ? theme.colors.backgroundSecondary : theme.colors.cardBg;
  const listBorderColor = isLocked ? theme.colors.borderLight : theme.colors.cardBorder;
  const titleColor = isLocked ? theme.colors.textMuted : theme.colors.text;
  const dateColor = isLocked ? theme.colors.textMuted : theme.colors.textSecondary;

  return (
    <div 
      className={`w-full h-[60px] border shadow-sm px-6 rounded-[10px] transition-all duration-300 ease-out cursor-pointer ${className}`}
      style={{
        backgroundColor: listBgColor,
        borderColor: listBorderColor,
      }}
      onClick={() => onOpen?.(jobData)}
      onMouseEnter={(e) => {
        if (!isLocked) {
          e.currentTarget.style.backgroundColor = theme.colors.cardHover;
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
          e.currentTarget.style.borderColor = theme.colors.border;
        }
      }}
      onMouseLeave={(e) => {
        if (!isLocked) {
          e.currentTarget.style.backgroundColor = theme.colors.cardBg;
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
          e.currentTarget.style.borderColor = theme.colors.cardBorder;
        }
      }}
    >
      <div
        className="grid items-center h-full gap-6 grid-cols-2 tablet:grid-cols-4 laptop:grid-cols-3 laptop-L:grid-cols-5"
      >
        {/* Title */}
        <div className={`min-w-0 flex items-center mobile-S:max-w-[150px] ${isLocked ? 'filter grayscale' : ''}`}>
          <h3 
            className="font-alexandria font-semibold text-[15px] truncate"
            style={{ color: titleColor }}
          >
            {shortTitle}
          </h3>
        </div>

        <div className={`min-w-0 hidden tablet:block ${isLocked ? 'filter grayscale' : ''}`}>
          <div className="flex items-center gap-2 whitespace-nowrap overflow-hidden">
            {firstTag && (
              firstTag.type === 'gender' ? (
                <StaticGenderTag label={firstTag.label} className={isLocked ? 'text-gray-neutral600 bg-gray-neutral100' : ''} />
              ) : firstTag.type === 'experience' ? (
                <StaticExperienceLevelTag label={firstTag.label} className={isLocked ? 'text-gray-neutral600 bg-gray-neutral100' : ''} />
              ) : (
                <StaticJobTypeTag label={firstTag.label} className={isLocked ? 'text-gray-neutral600 bg-gray-neutral100' : ''} />
              )
            )}
            {hiddenCount > 0 && (
              <div className="inline-flex items-center justify-center px-2 h-[17px] rounded-[5px] text-[10px] bg-gray-neutral100 text-gray-neutral400">+{hiddenCount}</div>
            )}
          </div>
        </div>

        {/* Salary - Laptop-L (1440px) only */}
        <div className={`hidden laptop-L:flex items-center gap-3 flex-1 ${isLocked ? 'filter grayscale' : ''}`}>
          <div className="w-[140px] min-w-[140px] max-w-[140px] overflow-hidden">
            <StaticSalaryTag label={`${salary} /${salaryPeriod}`} className={`whitespace-nowrap ${isLocked ? 'text-gray-neutral600 bg-gray-neutral100' : ''} w-full`} />
          </div>
        </div>

        {/* Date Posted - Tablet and Laptop-L; hidden at Laptop */}
        <div className={`hidden tablet:flex laptop:hidden laptop-L:flex flex-shrink-0 ${isLocked ? 'filter grayscale' : ''}`}>
          <span 
            className="font-inter text-[10px] whitespace-nowrap"
            style={{ color: dateColor }}
          >
            Posted on: {postedDate}
          </span>
        </div>

        {/* Action Buttons (flush right, compact/hug content) */}
        <div className="flex-shrink-0 justify-self-end flex justify-end">
          <ManageJobActionButtons
            applicantCount={applicantCount}
            onViewApplicants={() => onViewApplicants?.(jobData)}
            onEdit={() => onEdit?.(jobData)}
            onDelete={() => onDelete?.(jobData)}
            variant="compact"
            showLockToggle
            isOpenLock={!isLocked}
            onToggleLock={() => onToggleLock?.(id, !isLocked)}
            className="w-auto"
          />
        </div>
      </div>
    </div>
  );
};