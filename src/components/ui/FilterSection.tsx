import React, { useState, useRef, useEffect } from 'react';
import Button from './Button';
import Checkbox from './Checkbox';
import SimpleJobTypeAccordion, { JobTypeSelection } from './JobTypeAccordion';
import { IoChevronForward } from 'react-icons/io5';
import { HiArrowDown } from 'react-icons/hi';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/hooks/useLanguage';

export interface SalaryRange {
  lessThan5000: boolean;
  range10to20: boolean;
  moreThan20000: boolean;
  custom: boolean;
}

export interface ExperienceLevel {
  entryLevel: boolean;
  intermediate: boolean;
  professional: boolean;
}

export interface PreferredGender {
  any: boolean;
  female: boolean;
  male: boolean;
  others: boolean;
}

export interface FilterOptions {
  jobTypes: JobTypeSelection;
  salaryRange: SalaryRange;
  experienceLevel: ExperienceLevel;
  preferredGender: PreferredGender;
  status?: {
    deleted: boolean;
    locked: boolean;
    pending: boolean;
    approved: boolean;
    rejected: boolean;
  };
}

export interface FilterSectionProps {
  initialFilters?: Partial<FilterOptions>;
  onApply?: (filters: FilterOptions) => void;
  onClearAll?: () => void;
  className?: string;
  variant?: 'default' | 'appliedJobs';
}

const FilterSection: React.FC<FilterSectionProps> = ({
  initialFilters,
  onApply,
  onClearAll,
  className = '',
  variant = 'default'
}) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [jobTypes, setJobTypes] = useState<JobTypeSelection>(initialFilters?.jobTypes || {});
  const [salaryRange, setSalaryRange] = useState<SalaryRange>(
    initialFilters?.salaryRange || {
      lessThan5000: false,
      range10to20: false,
      moreThan20000: false,
      custom: false,
    }
  );
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(
    initialFilters?.experienceLevel || {
      entryLevel: false,
      intermediate: false,
      professional: false,
    }
  );
  const [preferredGender, setPreferredGender] = useState<PreferredGender>(
    initialFilters?.preferredGender || {
      any: false,
      female: false,
      male: false,
      others: false,
    }
  );

  const [status, setStatus] = useState<NonNullable<FilterOptions['status']>>(initialFilters?.status || {
    deleted: false,
    locked: false,
    pending: false,
    approved: false,
    rejected: false,
  });

  const [isJobTypeOpen, setIsJobTypeOpen] = useState(false);
  const [isSalaryOpen, setIsSalaryOpen] = useState(false);
  const [isExperienceOpen, setIsExperienceOpen] = useState(false);
  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [hasScroll, setHasScroll] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (scrollRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        const atBottom = scrollTop + clientHeight >= scrollHeight - 10;
        const scrollable = scrollHeight > clientHeight;
        
        setIsAtBottom(atBottom);
        setHasScroll(scrollable);
      }
    };

    checkScroll();
    const scrollElement = scrollRef.current;
    scrollElement?.addEventListener('scroll', checkScroll);
    
    const observer = new ResizeObserver(checkScroll);
    if (scrollElement) {
      observer.observe(scrollElement);
    }

    return () => {
      scrollElement?.removeEventListener('scroll', checkScroll);
      observer.disconnect();
    };
  }, [isJobTypeOpen, isSalaryOpen, isExperienceOpen, isGenderOpen, isStatusOpen]);

  const handleClearAll = () => {
    setJobTypes({});
    setSalaryRange({
      lessThan5000: false,
      range10to20: false,
      moreThan20000: false,
      custom: false,
    });
    setExperienceLevel({
      entryLevel: false,
      intermediate: false,
      professional: false,
    });
    setPreferredGender({
      any: false,
      female: false,
      male: false,
      others: false,
    });
    if (variant === 'appliedJobs') {
      setStatus({
        deleted: false,
        locked: false,
        pending: false,
        approved: false,
        rejected: false,
      });
    }
    onClearAll?.();
  };

  const handleApply = () => {
    const payload: FilterOptions = {
      jobTypes,
      salaryRange,
      experienceLevel,
      preferredGender,
    };
    if (variant === 'appliedJobs') {
      (payload as any).status = status;
    }
    onApply?.(payload);
  };

  const handleSalaryChange = (key: keyof SalaryRange, checked: boolean) => {
    setSalaryRange((prev) => ({ ...prev, [key]: checked }));
  };

  const handleExperienceChange = (key: keyof ExperienceLevel, checked: boolean) => {
    setExperienceLevel((prev) => ({ ...prev, [key]: checked }));
  };

  const handleGenderChange = (key: keyof PreferredGender, checked: boolean) => {
    setPreferredGender((prev) => ({ ...prev, [key]: checked }));
  };

  const handleStatusChange = (key: keyof NonNullable<FilterOptions['status']>, checked: boolean) => {
    setStatus((prev) => ({ ...prev, [key]: checked }));
  };

  return (
    <div className={`flex flex-col h-[calc(100%-64px)] ${className}`}>
      {/* Header (static) */}
      <div 
        className="flex-shrink-0 flex flex-row items-center justify-between px-4 py-4 transition-colors duration-300"
        style={{ backgroundColor: theme.colors.surface }}
      >
        <h2
          className="text-lead font-alexandria font-bold transition-colors duration-300"
          style={{ color: theme.colors.text }}
        >
          {t.components.filters.title}
        </h2>
        <button
          onClick={handleClearAll}
          className="text-small font-inter font-normal transition-colors duration-300"
          style={{ color: theme.colors.primary }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = theme.colors.primaryHover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = theme.colors.primary;
          }}
        >
          {t.components.filters.clear}
        </button>
      </div>

      {/* Scrollable content */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto min-h-0 scrollbar-hide relative transition-colors duration-300"
        style={{ backgroundColor: theme.colors.surface }}
      >
        {variant === 'appliedJobs' && (
          <div className="">
            <button
              onClick={() => setIsStatusOpen(!isStatusOpen)}
              className="w-full flex items-center justify-between px-5 py-3 transition-colors duration-300"
              style={{ 
                backgroundColor: isStatusOpen ? theme.modal.accordionBgActive : 'transparent'
              }}
              onMouseEnter={(e) => {
                if (!isStatusOpen) {
                  e.currentTarget.style.backgroundColor = theme.colors.surfaceHover;
                }
              }}
              onMouseLeave={(e) => {
                if (!isStatusOpen) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <h3
                className="text-body font-inter font-normal transition-colors duration-300"
                style={{ color: theme.modal.accordionText }}
              >
                {t.components.filters.status}
              </h3>
              <IoChevronForward
                className={`h-5 w-5 transition-all duration-300 ${isStatusOpen ? 'rotate-90' : ''}`}
                style={{ color: theme.colors.textMuted }}
              />
            </button>
            {isStatusOpen && (
              <div className="px-4 pb-3 space-y-2">
                <Checkbox label={t.components.filters.statusDeleted} checked={status.deleted} onChange={(c) => handleStatusChange('deleted', c)} size="sm" />
                <Checkbox label={t.components.filters.statusLocked} checked={status.locked} onChange={(c) => handleStatusChange('locked', c)} size="sm" />
                <Checkbox label={t.components.filters.statusPending} checked={status.pending} onChange={(c) => handleStatusChange('pending', c)} size="sm" />
                <Checkbox label={t.components.filters.statusApproved} checked={status.approved} onChange={(c) => handleStatusChange('approved', c)} size="sm" />
                <Checkbox label={t.components.filters.statusRejected} checked={status.rejected} onChange={(c) => handleStatusChange('rejected', c)} size="sm" />
              </div>
            )}
          </div>
        )}

        {/* Job Type Section */}
        <div className="">
          <button
            onClick={() => setIsJobTypeOpen(!isJobTypeOpen)}
            className="w-full flex items-center justify-between px-5 py-3 transition-colors duration-300"
            style={{ 
              backgroundColor: isJobTypeOpen ? theme.modal.accordionBgActive : 'transparent'
            }}
            onMouseEnter={(e) => {
              if (!isJobTypeOpen) {
                e.currentTarget.style.backgroundColor = theme.colors.surfaceHover;
              }
            }}
            onMouseLeave={(e) => {
              if (!isJobTypeOpen) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <h3
              className="text-body font-inter font-normal transition-colors duration-300"
              style={{ color: theme.modal.accordionText }}
            >
              {t.components.filters.jobType}
            </h3>
            <IoChevronForward
              className={`h-5 w-5 transition-all duration-300 ${isJobTypeOpen ? 'rotate-90' : ''}`}
              style={{ color: theme.colors.textMuted }}
            />
          </button>
          {isJobTypeOpen && (
            <div className="px-4 pb-3">
              <SimpleJobTypeAccordion
                selectedJobTypes={jobTypes}
                onChange={setJobTypes}
                className="w-full"
              />
            </div>
          )}
        </div>

        {/* Salary Range Section */}
        <div className="">
          <button
            onClick={() => setIsSalaryOpen(!isSalaryOpen)}
            className="w-full flex items-center justify-between px-5 py-3 transition-colors duration-300"
            style={{ 
              backgroundColor: isSalaryOpen ? theme.modal.accordionBgActive : 'transparent'
            }}
            onMouseEnter={(e) => {
              if (!isSalaryOpen) {
                e.currentTarget.style.backgroundColor = theme.colors.surfaceHover;
              }
            }}
            onMouseLeave={(e) => {
              if (!isSalaryOpen) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <h3
              className="text-body font-inter font-normal transition-colors duration-300"
              style={{ color: theme.modal.accordionText }}
            >
              {t.components.filters.salary}
            </h3>
            <IoChevronForward
              className={`h-5 w-5 transition-all duration-300 ${isSalaryOpen ? 'rotate-90' : ''}`}
              style={{ color: theme.colors.textMuted }}
            />
          </button>
          {isSalaryOpen && (
            <div className="px-4 pb-3 space-y-2">
              <Checkbox label={t.components.filters.salaryLessThan5000} checked={salaryRange.lessThan5000} onChange={(checked) => handleSalaryChange('lessThan5000', checked)} size="sm" />
              <Checkbox label={t.components.filters.salary10to20} checked={salaryRange.range10to20} onChange={(checked) => handleSalaryChange('range10to20', checked)} size="sm" />
              <Checkbox label={t.components.filters.salaryMoreThan20000} checked={salaryRange.moreThan20000} onChange={(checked) => handleSalaryChange('moreThan20000', checked)} size="sm" />
              <Checkbox label={t.components.filters.salaryCustom} checked={salaryRange.custom} onChange={(checked) => handleSalaryChange('custom', checked)} size="sm" />
            </div>
          )}
        </div>

        {/* Experience Level Section */}
        {variant !== 'appliedJobs' && (
          <div className="">
            <button
              onClick={() => setIsExperienceOpen(!isExperienceOpen)}
              className="w-full flex items-center justify-between px-5 py-3 transition-colors duration-300"
              style={{ 
                backgroundColor: isExperienceOpen ? theme.modal.accordionBgActive : 'transparent'
              }}
              onMouseEnter={(e) => {
                if (!isExperienceOpen) {
                  e.currentTarget.style.backgroundColor = theme.colors.surfaceHover;
                }
              }}
              onMouseLeave={(e) => {
                if (!isExperienceOpen) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <h3
                className="text-body font-inter font-normal transition-colors duration-300"
                style={{ color: theme.modal.accordionText }}
              >
                {t.components.filters.experienceLevel}
              </h3>
              <IoChevronForward
                className={`h-5 w-5 transition-all duration-300 ${isExperienceOpen ? 'rotate-90' : ''}`}
                style={{ color: theme.colors.textMuted }}
              />
            </button>
            {isExperienceOpen && (
              <div className="px-4 pb-3 space-y-2">
                <Checkbox label={t.components.filters.entryLevel} checked={experienceLevel.entryLevel} onChange={(checked) => handleExperienceChange('entryLevel', checked)} size="sm" />
                <Checkbox label={t.components.filters.intermediate} checked={experienceLevel.intermediate} onChange={(checked) => handleExperienceChange('intermediate', checked)} size="sm" />
                <Checkbox label={t.components.filters.professional} checked={experienceLevel.professional} onChange={(checked) => handleExperienceChange('professional', checked)} size="sm" />
              </div>
            )}
          </div>
        )}

        {/* Preferred Gender Section */}
        {variant !== 'appliedJobs' && (
          <div className="">
            <button
              onClick={() => setIsGenderOpen(!isGenderOpen)}
              className="w-full flex items-center justify-between px-5 py-3 transition-colors duration-300"
              style={{ 
                backgroundColor: isGenderOpen ? theme.modal.accordionBgActive : 'transparent'
              }}
              onMouseEnter={(e) => {
                if (!isGenderOpen) {
                  e.currentTarget.style.backgroundColor = theme.colors.surfaceHover;
                }
              }}
              onMouseLeave={(e) => {
                if (!isGenderOpen) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <h3
                className="text-body font-inter font-normal transition-colors duration-300"
                style={{ color: theme.modal.accordionText }}
              >
                {t.components.filters.preferredGender}
              </h3>
              <IoChevronForward
                className={`h-5 w-5 transition-all duration-300 ${isGenderOpen ? 'rotate-90' : ''}`}
                style={{ color: theme.colors.textMuted }}
              />
            </button>
            {isGenderOpen && (
              <div className="px-4 pb-3 space-y-2">
                <Checkbox label={t.components.filters.genderAny} checked={preferredGender.any} onChange={(checked) => handleGenderChange('any', checked)} size="sm" />
                <Checkbox label={t.components.filters.genderFemale} checked={preferredGender.female} onChange={(checked) => handleGenderChange('female', checked)} size="sm" />
                <Checkbox label={t.components.filters.genderMale} checked={preferredGender.male} onChange={(checked) => handleGenderChange('male', checked)} size="sm" />
                <Checkbox label={t.components.filters.genderOthers} checked={preferredGender.others} onChange={(checked) => handleGenderChange('others', checked)} size="sm" />
              </div>
            )}
          </div>
        )}

        {/* Scroll indicator */}
        {hasScroll && !isAtBottom && (
          <div 
            className="sticky bottom-0 left-0 right-0 flex items-center justify-center gap-2 pt-4 pb-2 text-sm pointer-events-none transition-colors duration-300"
            style={{
              background: `linear-gradient(to top, ${theme.colors.surface}, ${theme.colors.surface}F2, transparent)`,
              color: theme.colors.textMuted
            }}
          >
            <HiArrowDown className="w-4 h-4 animate-bounce" />
          </div>
        )}
      </div>

      {/* Fixed bottom Apply button */}
      <div 
        className="flex-shrink-0 p-3 transition-colors duration-300"
        style={{ 
          backgroundColor: theme.colors.surface,
          borderTop: `1px solid ${theme.colors.borderLight}`
        }}
      >
        <Button
          variant="primary"
          size="md"
          onClick={handleApply}
          className="w-full"
          fullRounded
        >
          Apply
        </Button>
      </div>
    </div>
  );
};

export default FilterSection;
