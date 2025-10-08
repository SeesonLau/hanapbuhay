"use client";

import React, { useState } from 'react';
import { getColor, getGrayColor, getBlackColor, getWhiteColor } from '@/styles/colors';
import { fontClasses } from '@/styles/fonts';
// Icons served from public/icons

// =====================
// Static display tags
// =====================

interface StaticTagProps {
  label: string;
  className?: string;
}

export const StaticGenderTag: React.FC<StaticTagProps> = ({ label, className = '' }) => {
  return (
    <div 
      className={`inline-flex items-center justify-center px-3 h-[17px] rounded-[5px] text-[10px] ${className}`}
      style={{ color: getColor('tag', 'genderText'), backgroundColor: getColor('tag', 'genderBg') }}
    >
      {label}
    </div>
  );
};

export const StaticExperienceLevelTag: React.FC<StaticTagProps> = ({ label, className = '' }) => {
  return (
    <div 
      className={`inline-flex items-center justify-center px-3 h-[17px] rounded-[5px] text-[10px] ${className}`}
      style={{ color: getColor('tag', 'experienceText'), backgroundColor: getColor('tag', 'experienceBg') }}
    >
      {label}
    </div>
  );
};

export const StaticJobTypeTag: React.FC<StaticTagProps> = ({ label, className = '' }) => {
  return (
    <div 
      className={`inline-flex items-center justify-center px-3 h-[17px] rounded-[5px] text-[10px] ${className}`}
      style={{ color: getColor('tag', 'jobText'), backgroundColor: getColor('tag', 'jobBg') }}
    >
      {label}
    </div>
  );
};

interface StaticLocationTagProps {
  label: string;
  className?: string;
}

export const StaticLocationTag: React.FC<StaticLocationTagProps> = ({ label, className = '' }) => {
  return (
    <div 
      className={`inline-flex items-center justify-center px-3 h-[25px] rounded-[5px] ${fontClasses.heading} font-normal text-[10px] ${className}`}
      style={{ color: getBlackColor(), backgroundColor: getGrayColor('default') }}
    >
      <img 
        src="/icons/Location.svg" 
        alt="Location icon" 
        className="w-[15px] h-[15px] mr-2" 
      />
      {label}
    </div>
  );
};

interface StaticSalaryTagProps {
  label: string;
  className?: string;
}

export const StaticSalaryTag: React.FC<StaticSalaryTagProps> = ({ label, className = '' }) => {
  return (
    <div 
      className={`inline-flex items-center justify-center px-3 h-[25px] rounded-[5px] ${fontClasses.heading} font-normal text-[10px] ${className}`}
      style={{ color: getBlackColor(), backgroundColor: getGrayColor('default') }}
    >
      <img 
        src="/icons/PHP.svg" 
        alt="Salary icon" 
        className="w-[15px] h-[15px] mr-2" 
      />
      {label}
    </div>
  );
};

// =====================
// Interactive tags
// =====================

interface BaseTagProps {
  label: string;
  onClick?: () => void;
  selected?: boolean;
  className?: string;
}

export const BaseTag: React.FC<BaseTagProps> = ({ 
  label, 
  onClick, 
  selected = false,
  className = ''
}) => {
  const [isSelected, setIsSelected] = useState(selected);

  const handleClick = () => {
    setIsSelected(!isSelected);
    if (onClick) onClick();
  };

  return (
    <div 
      className={`inline-flex items-center justify-center px-3 h-[17px] rounded-[5px] text-[10px] cursor-pointer ${className}`}
      onClick={handleClick}
    >
      {label}
    </div>
  );
};

interface GenderTagProps extends BaseTagProps {}

export const GenderTag: React.FC<GenderTagProps> = ({ 
  label, 
  onClick, 
  selected = false 
}) => {
  const [isSelected, setIsSelected] = useState(selected);

  const handleClick = () => {
    setIsSelected(!isSelected);
    if (onClick) onClick();
  };

  return (
    <div 
      className={`inline-flex items-center justify-center px-3 h-[17px] rounded-[5px] text-[10px] cursor-pointer`}
      style={{
        color: getColor('tag', 'genderText'),
        backgroundColor: isSelected ? getColor('tag', 'genderSelectedBg') : getColor('tag', 'genderUnselectedBg')
      }}
      onClick={handleClick}
    >
      {label}
    </div>
  );
};

interface ExperienceLevelTagProps extends BaseTagProps {}

export const ExperienceLevelTag: React.FC<ExperienceLevelTagProps> = ({ 
  label, 
  onClick, 
  selected = false 
}) => {
  const [isSelected, setIsSelected] = useState(selected);

  const handleClick = () => {
    setIsSelected(!isSelected);
    if (onClick) onClick();
  };

  return (
    <div 
      className={`inline-flex items-center justify-center px-3 h-[17px] rounded-[5px] text-[10px] cursor-pointer`}
      style={{
        color: getColor('tag', 'experienceText'),
        backgroundColor: isSelected ? getColor('tag', 'experienceSelectedBg') : getColor('tag', 'experienceUnselectedBg')
      }}
      onClick={handleClick}
    >
      {label}
    </div>
  );
};

interface JobTypeTagProps extends BaseTagProps {
  onRemove?: () => void;
  categoryIcon?: string;
}

export const JobTypeTag: React.FC<JobTypeTagProps> = ({ 
  label, 
  onClick, 
  selected = false,
  onRemove,
  categoryIcon
}) => {
  const [isSelected, setIsSelected] = useState(selected);

  const handleClick = () => {
    setIsSelected(!isSelected);
    if (onClick) onClick();
  };

  return (
    <div 
      className={`inline-flex items-center justify-center px-3 h-[17px] rounded-[5px] text-[10px] cursor-pointer`}
      style={{
        backgroundColor: isSelected ? getColor('tag', 'jobText') : getColor('tag', 'jobUnselectedBg'),
        color: isSelected ? getWhiteColor() : getColor('tag', 'jobText')
      }}
      onClick={handleClick}
    >
      {categoryIcon && (
        <img 
          src={categoryIcon} 
          alt={`${label} icon`} 
          className="w-3 h-3 mr-1" 
          style={{ 
            filter: isSelected 
              ? 'brightness(0) invert(1)' 
              : 'brightness(0) saturate(100%) invert(27%) sepia(99%) saturate(2613%) hue-rotate(214deg) brightness(99%) contrast(101%)'
          }}
        />
      )}
      <span>{label}</span>
      {isSelected && (
        <span 
          className="ml-1 cursor-pointer" 
          onClick={(e) => {
            e.stopPropagation();
            if (onRemove) onRemove();
          }}
        >
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L7 7M1 7L7 1" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      )}
    </div>
  );
};