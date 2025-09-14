import React from 'react';
import { ButtonProps } from '../types';
import { getGrayColor, getWhiteColor } from '@/lib/colors';

const VisitProfileButton: React.FC<ButtonProps> = ({ 
  onClick, 
  disabled = false, 
  className = '', 
  children = 'Visit Profile', 
  type = 'button' 
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-80 p-2.5 bg-[#858B8A] rounded-[10px] inline-flex justify-center items-center gap-2.5 hover:bg-[#5A605F] disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      style={{
        backgroundColor: disabled ? getGrayColor('hover') : getGrayColor('hover'),
        color: getWhiteColor()
      }}
      onMouseOver={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = '#5A605F';
          e.currentTarget.style.boxShadow = '0px 4px 4px 0px rgba(0,0,0,0.25)';
        }
      }}
      onMouseOut={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = '#858B8A';
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
    >
      <span className="justify-start text-white text-base font-semibold font-['Inter']">
        {children}
      </span>
    </button>
  );
};

export default VisitProfileButton;
