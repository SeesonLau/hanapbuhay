"use client";

import React, { useState, useEffect } from 'react';
import { parseLocationDetailed } from '@/lib/constants/philippines-locations';
// Icons served from public/icons

// =====================
// Static display tags
// =====================

interface StaticTagProps {
  label: string;
  className?: string;
  variant?: 'default' | 'glassy';
}

export const StaticGenderTag: React.FC<StaticTagProps> = ({ label, className = '', variant = 'default' }) => {
  const isGlassy = variant === 'glassy';
  return (
    <div 
      className={`inline-flex items-center justify-center px-3 h-[17px] rounded-[5px] text-[10px] ${
        isGlassy 
          ? 'text-pink-300 bg-pink-500/20 backdrop-blur-sm border border-pink-500/30' 
          : 'text-tag-genderText bg-tag-genderBg'
      } ${className}`}
    >
      {label}
    </div>
  );
};

export const StaticExperienceLevelTag: React.FC<StaticTagProps> = ({ label, className = '', variant = 'default' }) => {
  const isGlassy = variant === 'glassy';
  return (
    <div 
      className={`inline-flex items-center justify-center px-3 h-[17px] rounded-[5px] text-[10px] ${
        isGlassy 
          ? 'text-emerald-300 bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/30' 
          : 'text-tag-experienceText bg-tag-experienceBg'
      } ${className}`}
    >
      {label}
    </div>
  );
};

export const StaticJobTypeTag: React.FC<StaticTagProps> = ({ label, className = '', variant = 'default' }) => {
  const isGlassy = variant === 'glassy';
  return (
    <div 
      className={`inline-flex items-center justify-center px-3 h-[17px] rounded-[5px] text-[10px] ${
        isGlassy 
          ? 'text-blue-300 bg-blue-500/20 backdrop-blur-sm border border-blue-500/30' 
          : 'text-tag-jobText bg-tag-jobBg'
      } ${className}`}
    >
      {label}
    </div>
  );
};

interface StaticLocationTagProps {
  label: string;
  className?: string;
  variant?: 'default' | 'glassy';
}

export const StaticLocationTag: React.FC<StaticLocationTagProps> = ({ label, className = '', variant = 'default' }) => {
  const { province, city, address } = parseLocationDetailed(label || '');
  const hasAddress = !!address;
  const isGlassy = variant === 'glassy';
  return (
    <div 
      className={`inline-flex items-center px-3 h-[25px] rounded-[5px] font-alexandria font-normal text-[10px] min-w-0 max-w-full ${
        isGlassy 
          ? 'text-gray-200 bg-white/10 backdrop-blur-sm border border-white/20' 
          : 'text-black bg-gray-default'
      } ${className}`}
    >
      <img 
        src="/icons/Location.svg" 
        alt="Location" 
        className="w-[15px] h-[15px] mr-2" 
        style={isGlassy ? { filter: 'brightness(0) invert(1)' } : undefined}
      />
      <div className="flex items-center min-w-0">
        {province && <span className="flex-shrink-0">{province}</span>}
        {city && <span className="flex-shrink-0">{province ? ', ' : ''}{city}</span>}
        {hasAddress && (
          <span className="truncate">{(province || city) ? ', ' : ''}{address}</span>
        )}
        {!province && !city && !hasAddress && (
          <span className="truncate">{label}</span>
        )}
      </div>
    </div>
  );
};

interface StaticSalaryTagProps {
  label: string;
  className?: string;
  variant?: 'default' | 'glassy';
}

export const StaticSalaryTag: React.FC<StaticSalaryTagProps> = ({ label, className = '', variant = 'default' }) => {
  const isGlassy = variant === 'glassy';
  return (
    <div 
      className={`inline-flex items-center justify-center px-3 h-[25px] rounded-[5px] font-alexandria font-normal text-[10px] ${
        isGlassy 
          ? 'text-gray-200 bg-white/10 backdrop-blur-sm border border-white/20' 
          : 'text-black bg-gray-default'
      } ${className}`}
    >
      <img 
        src="/icons/PHP.svg" 
        alt="Salary icon" 
        className="w-[15px] h-[15px] mr-2" 
        style={isGlassy ? { filter: 'brightness(0) invert(1)' } : undefined}
      />
      {label.replace(/₱/g, '')}
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
  useEffect(() => { setIsSelected(selected); }, [selected]);

  const handleClick = () => {
    if (onClick) onClick();
  };

  return (
    <div 
      className={`inline-flex items-center justify-center px-3 h-[17px] rounded-[5px] text-[10px] cursor-pointer text-tag-genderText ${isSelected ? 'bg-tag-genderSelectedBg' : 'bg-tag-genderUnselectedBg'}`}
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
  useEffect(() => { setIsSelected(selected); }, [selected]);

  const handleClick = () => {
    if (onClick) onClick();
  };

  return (
    <div 
      className={`inline-flex items-center justify-center px-3 h-[17px] rounded-[5px] text-[10px] cursor-pointer text-tag-experienceText ${isSelected ? 'bg-tag-experienceSelectedBg' : 'bg-tag-experienceUnselectedBg'}`}
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
  useEffect(() => { setIsSelected(selected); }, [selected]);

  const handleClick = () => {
    if (onClick) onClick();
  };

  return (
    <div 
      className={`inline-flex items-center justify-center px-3 h-auto min-h-[17px] rounded-[5px] text-[10px] leading-[14px] cursor-pointer whitespace-normal break-words ${isSelected ? 'bg-tag-jobText text-white' : 'bg-tag-jobUnselectedBg text-tag-jobText'}`}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleClick(); }}
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
      <span className="whitespace-normal break-words">{label}</span>
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
