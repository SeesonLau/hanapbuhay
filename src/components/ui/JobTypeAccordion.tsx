import React, { useState } from 'react';
import { IoChevronDown, IoChevronForward } from 'react-icons/io5';
import { JobType, SubTypes, getJobTypeOptions } from '@/lib/constants/job-types';
import Checkbox from './Checkbox';
import { getGrayColor, getTypographyClass, getTypographyStyle} from '@/styles';

export interface JobTypeSelection {
  [jobType: string]: string[];
}

export interface SimpleJobTypeAccordionProps {
  selectedJobTypes?: JobTypeSelection;
  onChange?: (selection: JobTypeSelection) => void;
  className?: string;
}

const SimpleJobTypeAccordion: React.FC<SimpleJobTypeAccordionProps> = ({
  selectedJobTypes = {},
  onChange,
  className = ''
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<JobType>>(new Set());
  const jobTypeOptions = getJobTypeOptions();

  const toggleSection = (jobType: JobType) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(jobType)) {
      newExpanded.delete(jobType);
    } else {
      newExpanded.add(jobType);
    }
    setExpandedSections(newExpanded);
  };

  const handleSubTypeChange = (jobType: JobType, subType: string, checked: boolean) => {
    const currentSelection = selectedJobTypes[jobType] || [];
    let newSelection: string[];

    if (checked) {
      newSelection = [...currentSelection, subType];
    } else {
      newSelection = currentSelection.filter(item => item !== subType);
    }

    const updatedJobTypes = {
      ...selectedJobTypes,
      [jobType]: newSelection
    };

    // Remove empty arrays to keep the object clean
    if (newSelection.length === 0) {
      delete updatedJobTypes[jobType];
    }

    onChange?.(updatedJobTypes);
  };

  return (
    <div className={`w-full max-w-[240px] bg-white ${className}`}>
      {jobTypeOptions.map(({ value: jobType, label }) => {
        const isExpanded = expandedSections.has(jobType as JobType);
        const subTypes = SubTypes[jobType as JobType] || [];

        return (
          <div key={jobType}>
            {/* Job Type Header */}
            <div
              className="flex items-center justify-between px-2 py-3 cursor-pointer hover:bg-gray-50"
              style={{...getTypographyStyle('body')}}
              onClick={() => subTypes.length > 0 && toggleSection(jobType as JobType)}
            >
              <span 
                className={getTypographyClass('small')}
                style={{ color: getGrayColor('neutral700') }}
              >
                {label}
              </span>
              
              {subTypes.length > 0 && (
                <div className="flex-shrink-0">
                  {isExpanded ? (
                    <IoChevronDown 
                      className="w-4 h-4" 
                      style={{ color: getGrayColor('neutral600') }}
                    />
                  ) : (
                    <IoChevronForward 
                      className="w-4 h-4" 
                      style={{ color: getGrayColor('neutral600') }}
                    />
                  )}
                </div>
              )}
            </div>

            {/* Subtypes - Only show when expanded */}
            {subTypes.length > 0 && isExpanded && (
              <div className="bg-white">
                {subTypes.map((subType) => {
                  const isChecked = selectedJobTypes[jobType]?.includes(subType) || false;
                  
                  return (
                    <div key={subType} className="px-2 py-1">
                      <Checkbox
                        label={subType}
                        checked={isChecked}
                        onChange={(checked) => handleSubTypeChange(jobType as JobType, subType, checked)}
                        size="sm"
                        className="w-full"
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SimpleJobTypeAccordion;