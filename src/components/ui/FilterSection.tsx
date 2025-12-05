import React, { useState, useRef, useEffect } from 'react';
import Button from './Button';
import Checkbox from './Checkbox';
import SimpleJobTypeAccordion, { JobTypeSelection } from './JobTypeAccordion';
import { IoChevronForward } from 'react-icons/io5';
import { HiArrowDown } from 'react-icons/hi';

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
}

export interface FilterSectionProps {
  initialFilters?: Partial<FilterOptions>;
  onApply?: (filters: FilterOptions) => void;
  onClearAll?: () => void;
  className?: string;
  variant?: 'default' | 'appliedJobs'; // Add variant to control which filters to show
}

const FilterSection: React.FC<FilterSectionProps> = ({
  initialFilters,
  onApply,
  onClearAll,
  className = '',
  variant = 'default'
}) => {
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

  // Accordion states - All closed by default, except Salary Range for appliedJobs variant
  const [isJobTypeOpen, setIsJobTypeOpen] = useState(false);
  const [isSalaryOpen, setIsSalaryOpen] = useState(variant === 'appliedJobs');
  const [isExperienceOpen, setIsExperienceOpen] = useState(false);
  const [isGenderOpen, setIsGenderOpen] = useState(false);

  // Sync internal state when initialFilters prop changes (e.g., from URL params)
  useEffect(() => {
    if (initialFilters?.jobTypes) {
      setJobTypes(initialFilters.jobTypes);
      // Auto-open the job type accordion if there are filters
      if (Object.keys(initialFilters.jobTypes).length > 0) {
        setIsJobTypeOpen(true);
      }
    }
    if (initialFilters?.salaryRange) {
      setSalaryRange(initialFilters.salaryRange);
    }
    if (initialFilters?.experienceLevel) {
      setExperienceLevel(initialFilters.experienceLevel);
    }
    if (initialFilters?.preferredGender) {
      setPreferredGender(initialFilters.preferredGender);
    }
  }, [initialFilters]);

  // Scroll indicator state
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [hasScroll, setHasScroll] = useState(false);

  // Check if content is scrollable and if user is at bottom
  useEffect(() => {
    const checkScroll = () => {
      if (scrollRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        const atBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px threshold
        const scrollable = scrollHeight > clientHeight;
        
        setIsAtBottom(atBottom);
        setHasScroll(scrollable);
      }
    };

    checkScroll();
    const scrollElement = scrollRef.current;
    scrollElement?.addEventListener('scroll', checkScroll);
    
    // Re-check when accordion sections expand/collapse
    const observer = new ResizeObserver(checkScroll);
    if (scrollElement) {
      observer.observe(scrollElement);
    }

    return () => {
      scrollElement?.removeEventListener('scroll', checkScroll);
      observer.disconnect();
    };
  }, [isJobTypeOpen, isSalaryOpen, isExperienceOpen, isGenderOpen]);

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
    onClearAll?.();
  };

  const handleApply = () => {
    onApply?.({
      jobTypes,
      salaryRange,
      experienceLevel,
      preferredGender,
    });
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

  return (
    <div className={`flex flex-col h-[calc(100%-64px)] ${className}`}>
      {/* Header (static) */}
      <div className="flex-shrink-0 flex flex-row items-center justify-between px-4 py-4 bg-white">
        <h2 className="text-body font-alexandria font-bold text-gray-neutral900">Filter</h2>
        <button
          onClick={handleClearAll}
          className="text-small font-inter font-semibold text-primary-primary500 hover:text-primary-primary600 transition-colors duration-150"
        >
          Clear All
        </button>
      </div>

      {/* Scrollable content (red section) - Hide scrollbar but keep scrolling */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto bg-white min-h-0 scrollbar-hide relative"
      >
        {/* Job Type Section */}
        <div className="">
          <button
            onClick={() => setIsJobTypeOpen(!isJobTypeOpen)}
            className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors"
          >
            <h3 className="text-small font-inter font-semibold text-gray-neutral900">
              Job Type
            </h3>
            <IoChevronForward
              className={`h-5 w-5 text-gray-neutral600 transition-transform duration-200 ${
                isJobTypeOpen ? 'rotate-90' : ''
              }`}
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
            className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors"
          >
            <h3 className="text-small font-inter font-semibold text-gray-neutral900">
              Salary Range
            </h3>
            <IoChevronForward
              className={`h-5 w-5 text-gray-neutral600 transition-transform duration-200 ${
                isSalaryOpen ? 'rotate-90' : ''
              }`}
            />
          </button>
          {isSalaryOpen && (
            <div className="px-4 pb-3 space-y-2">
              <Checkbox
                label="Less than Php 5000"
                checked={salaryRange.lessThan5000}
                onChange={(checked) => handleSalaryChange('lessThan5000', checked)}
                size="sm"
              />
              <Checkbox
                label="Php 10,000 - Php 20,000"
                checked={salaryRange.range10to20}
                onChange={(checked) => handleSalaryChange('range10to20', checked)}
                size="sm"
              />
              <Checkbox
                label="More than Php 20,000"
                checked={salaryRange.moreThan20000}
                onChange={(checked) => handleSalaryChange('moreThan20000', checked)}
                size="sm"
              />
            </div>
          )}
        </div>

        {/* Experience Level Section - Hidden for appliedJobs variant */}
        {variant !== 'appliedJobs' && (
          <div className="">
            <button
              onClick={() => setIsExperienceOpen(!isExperienceOpen)}
              className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors"
            >
              <h3 className="text-small font-inter font-semibold text-gray-neutral900">
                Experience level
              </h3>
              <IoChevronForward
                className={`h-5 w-5 text-gray-neutral600 transition-transform duration-200 ${
                  isExperienceOpen ? 'rotate-90' : ''
                }`}
              />
            </button>
            {isExperienceOpen && (
              <div className="px-4 pb-3 space-y-2">
                <Checkbox
                  label="Entry level"
                  checked={experienceLevel.entryLevel}
                  onChange={(checked) => handleExperienceChange('entryLevel', checked)}
                  size="sm"
                />
                <Checkbox
                  label="Intermediate"
                  checked={experienceLevel.intermediate}
                  onChange={(checked) => handleExperienceChange('intermediate', checked)}
                  size="sm"
                />
                <Checkbox
                  label="Professional"
                  checked={experienceLevel.professional}
                  onChange={(checked) => handleExperienceChange('professional', checked)}
                  size="sm"
                />
              </div>
            )}
          </div>
        )}

        {/* Preferred Gender Section - Hidden for appliedJobs variant */}
        {variant !== 'appliedJobs' && (
          <div className="">
            <button
              onClick={() => setIsGenderOpen(!isGenderOpen)}
              className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors"
            >
              <h3 className="text-small font-inter font-semibold text-gray-neutral900">
                Preferred Gender
              </h3>
              <IoChevronForward
                className={`h-5 w-5 text-gray-neutral600 transition-transform duration-200 ${
                  isGenderOpen ? 'rotate-90' : ''
                }`}
              />
            </button>
            {isGenderOpen && (
              <div className="px-4 pb-3 space-y-2">
                <Checkbox
                  label="Any"
                  checked={preferredGender.any}
                  onChange={(checked) => handleGenderChange('any', checked)}
                  size="sm"
                />
                <Checkbox
                  label="Female"
                  checked={preferredGender.female}
                  onChange={(checked) => handleGenderChange('female', checked)}
                  size="sm"
                />
                <Checkbox
                  label="Male"
                  checked={preferredGender.male}
                  onChange={(checked) => handleGenderChange('male', checked)}
                  size="sm"
                />
                <Checkbox
                  label="Others"
                  checked={preferredGender.others}
                  onChange={(checked) => handleGenderChange('others', checked)}
                  size="sm"
                />
              </div>
            )}
          </div>
        )}

        {/* Scroll indicator - shows when there's more content below */}
        {hasScroll && !isAtBottom && (
          <div className="sticky bottom-0 left-0 right-0 flex items-center justify-center gap-2 bg-gradient-to-t from-white via-white/95 to-transparent pt-4 pb-2 text-sm text-gray-neutral500 pointer-events-none">
            <HiArrowDown className="w-4 h-4 animate-bounce" />
          </div>
        )}
      </div>

      {/* Fixed bottom Apply button (blue section) */}
      <div className="flex-shrink-0 border-t border-gray-neutral200 p-2 bg-white">
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