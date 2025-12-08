import React, { useState } from 'react';
import { IoChevronDown, IoChevronForward } from 'react-icons/io5';
import { JobType, SubTypes, getJobTypeOptions } from '@/lib/constants/job-types';
import Checkbox from './Checkbox';
import { getTypographyClass, getTypographyStyle} from '@/styles';
import { useTheme } from '@/hooks/useTheme';

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
  const { theme } = useTheme();
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

    if (newSelection.length === 0) {
      delete updatedJobTypes[jobType];
    }

    onChange?.(updatedJobTypes);
  };

  return (
    <div 
      className={`w-full max-w-[240px] transition-colors duration-300 ${className}`}
      style={{ backgroundColor: theme.colors.surface }}
    >
      {jobTypeOptions.map(({ value: jobType, label }) => {
        const isExpanded = expandedSections.has(jobType as JobType);
        const subTypes = SubTypes[jobType as JobType] || [];

        return (
          <div key={jobType}>
            {/* Job Type Header */}
            <div
              className="flex items-center justify-between px-2 py-3 cursor-pointer transition-colors duration-300"
              style={{
                ...getTypographyStyle('body'),
                backgroundColor: isExpanded ? theme.modal.accordionBgActive : 'transparent'
              }}
              onMouseEnter={(e) => {
                if (!isExpanded) {
                  e.currentTarget.style.backgroundColor = theme.colors.surfaceHover;
                }
              }}
              onMouseLeave={(e) => {
                if (!isExpanded) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
              onClick={() => subTypes.length > 0 && toggleSection(jobType as JobType)}
            >
              <span 
                className={`${getTypographyClass('small')} transition-colors duration-300`}
                style={{ color: theme.modal.accordionText }}
              >
                {label}
              </span>
              
              {subTypes.length > 0 && (
                <div className="flex-shrink-0">
                  {isExpanded ? (
                    <IoChevronDown 
                      className="w-4 h-4 transition-all duration-300" 
                      style={{ color: theme.colors.textMuted }}
                    />
                  ) : (
                    <IoChevronForward 
                      className="w-4 h-4 transition-all duration-300" 
                      style={{ color: theme.colors.textMuted }}
                    />
                  )}
                </div>
              )}
            </div>

            {/* Subtypes - Only show when expanded */}
            {subTypes.length > 0 && isExpanded && (
              <div 
                className="transition-colors duration-300"
                style={{ backgroundColor: theme.colors.surface }}
              >
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