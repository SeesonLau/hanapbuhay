import React from 'react';
import { ButtonProps } from '../types';
import { getBlueColor, getBlueDarkColor, getWhiteColor, getGrayColor } from '@/lib/colors';

const ApplyNowButton: React.FC<ButtonProps> = ({ 
  onClick, 
  disabled = false, 
  className = '', 
  children = 'Apply Now', 
  type = 'button' 
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-24 h-8 bg-[#59ACFF] rounded-[5px] inline-flex justify-center items-center gap-2.5 hover:bg-[#3289FF] disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      style={{
        backgroundColor: disabled ? getGrayColor('default') : getBlueColor('default'),
        color: getWhiteColor()
      }}
      onMouseOver={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = getBlueDarkColor('default');
          e.currentTarget.style.boxShadow = '0px 2px 2px 0px rgba(0,0,0,0.25)';
        }
      }}
      onMouseOut={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = getBlueColor('default');
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
    >
      <span className="justify-start text-white text-xs font-semibold font-['Inter']">
        {children}
      </span>
    </button>
  );
};

export default ApplyNowButton;
