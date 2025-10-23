'use client';

import React, { useState, useEffect, useRef } from 'react';
import { HiMapPin, HiUsers } from 'react-icons/hi2';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi';
import ApplyButton from '../buttons/ApplyButton';

interface JobCardProps {
  title: string;
  description: string;
  jobType: string;
  experienceLevel: string;
  gender: string;
  location: string;
  salary: {
    amount: string;
    currency: string;
    period: string;
  };
  postedDate: string;
  applicantsCount: number;
  onApply?: () => void;
  className?: string;
}

const JobCard: React.FC<JobCardProps> = ({
  title,
  description,
  jobType,
  experienceLevel,
  gender,
  location,
  salary,
  postedDate,
  applicantsCount,
  onApply,
  className = ''
}) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [showExpandButton, setShowExpandButton] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (descriptionRef.current) {
      const element = descriptionRef.current;
      // Check if the text is actually being truncated
      const isTextTruncated = element.scrollHeight > element.clientHeight;
      setShowExpandButton(isTextTruncated);
    }
  }, [description]);


  return (
    <div 
      className={`bg-white rounded-lg shadow-md p-4 max-w-[480px] w-full h-full flex flex-col ${className}`}
    >
      {/* Job Title */}
      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 text-left">
        {title}
      </h3>

      {/* Job Description */}
      <div className="mb-3 text-left flex-grow flex flex-col justify-center">
        <p 
          ref={descriptionRef}
          className={`text-gray-700 text-xs ${isDescriptionExpanded ? '' : 'line-clamp-3'}`}
        >
          {description}
        </p>
        {showExpandButton && (
          <button
            onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
            className="flex items-center text-xs font-medium mt-1 focus:outline-none transition-colors duration-200"
            style={{ 
              color: '#2563eb',
              transition: 'color 0.2s ease-in-out'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#1d4ed8';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#2563eb';
            }}
          >
            {isDescriptionExpanded ? (
              <>
                Show less
                <HiChevronUp className="w-3 h-3 ml-1" />
              </>
            ) : (
              <>
                Show more
                <HiChevronDown className="w-3 h-3 ml-1" />
              </>
            )}
          </button>
        )}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-2 justify-start">
        {/* Job Type - Blue */}
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {jobType}
        </span>
        
        {/* Experience Level - Green */}
        <span 
          className="px-2 py-1 rounded-full text-xs font-medium text-green-800"
          style={{ backgroundColor: '#e1fbdd' }}
        >
          {experienceLevel}
        </span>
        
        {/* Gender - Yellow */}
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          {gender}
        </span>
      </div>

      {/* Location and Salary */}
      <div className="flex items-center justify-start mb-3 mt-3  bg-gray-100 rounded-full px-2 py-1">
        <div className="flex items-center text-gray-600">
          <HiMapPin className="w-3 h-3 text-red-500 mr-1" />
          <span className="text-xs mr-1">{location}</span>
        </div>
        <div className="flex items-center">
          <span className="text-xs text-gray-400 mr-1">|</span>
          <div className="text-xs">
            <span className="text-green-600 font-semibold">{salary.currency}</span>
            <span className="text-gray-900 font-semibold ml-1">{salary.amount}</span>
            <span className="text-blue-600 ml-1">{salary.period}</span>
          </div>
        </div>
      </div>

      {/* Footer with Posted Date, Applicants, and Apply Button */}
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center text-gray-500 text-xs">
          <span>Posted on: {postedDate}</span>
          <span className="mx-1">•</span>
          <span className="text-gray-400">{applicantsCount} Applicants</span>
        </div>
        
        <ApplyButton 
          onClick={onApply}
        />
      </div>
    </div>
  );
};

export default JobCard;
