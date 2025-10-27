import React, { useState } from 'react';
import Button from './Button';
import Checkbox from './Checkbox';
import SimpleJobTypeAccordion, { JobTypeSelection } from './JobTypeAccordion';

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
}

const FilterSection: React.FC<FilterSectionProps> = ({
  initialFilters,
  onApply,
  onClearAll,
  className = ''
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
    <div
      className={`flex flex-col bg-white overflow-hidden w-full max-w-[240px] h-auto max-h-[982px] ${className}`}
      style={{
        padding: '20px 24px',
        gap: '10px',
      }}
    >
      {/* Header */}
      <div className="flex flex-row items-center justify-between mb-2">
        <h2 className="text-lead font-alexandria font-bold text-gray-neutral900">
          Filter
        </h2>
        <button
          onClick={handleClearAll}
          className="text-small font-inter font-normal text-primary-primary500 hover:text-primary-primary600 transition-colors duration-150"
        >
          Clear All
        </button>
      </div>

      {/* Divider */}
      <div className="w-full h-[1px] mb-4 bg-gray-neutral200" />

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-5 custom-scrollbar">
        {/* Job Type Section */}
        <div className="space-y-3">
          <h3 className="text-body font-inter font-bold text-gray-neutral900">
            Job Type
          </h3>
          <SimpleJobTypeAccordion
            selectedJobTypes={jobTypes}
            onChange={setJobTypes}
            className="w-full"
          />
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-gray-neutral200" />

        {/* Salary Range Section */}
        <div className="space-y-3">
          <h3 className="text-body font-inter font-bold text-gray-neutral900">
            Salary Range
          </h3>
          <div className="space-y-2">
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
            <Checkbox
              label="Custom"
              checked={salaryRange.custom}
              onChange={(checked) => handleSalaryChange('custom', checked)}
              size="sm"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-gray-neutral200" />

        {/* Experience Level Section */}
        <div className="space-y-3">
          <h3 className="text-body font-inter font-bold text-gray-neutral900">
            Experience level
          </h3>
          <div className="space-y-2">
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
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-gray-neutral200" />

        {/* Preferred Gender Section */}
        <div className="space-y-3">
          <h3 className="text-body font-inter font-bold text-gray-neutral900">
            Preferred Gender
          </h3>
          <div className="flex flex-col space-y-2">
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
        </div>
      </div>

      {/* Apply Button */}
      <div className="mt-2">
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

      <style jsx>{`
        .custom-scrollbar {
          /* Hide scrollbar for Chrome, Safari and Opera */
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE and Edge */
        }

        .custom-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
      `}</style>
    </div>
  );
};

export default FilterSection;
