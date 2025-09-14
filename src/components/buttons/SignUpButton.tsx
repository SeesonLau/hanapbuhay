import React from 'react';
import { ButtonProps } from '../types';
import { getBlueDarkColor, getWhiteColor, getNeutral400Color } from '@/lib/colors';

const SignUpButton: React.FC<ButtonProps> = ({ 
  onClick, 
  disabled = false, 
  className = '', 
  children = 'Sign Up', 
  type = 'button' 
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`min-w-44 px-4 py-2 bg-[#3289FF] rounded-[40px] inline-flex justify-center items-center gap-2.5 hover:bg-[#1453E1] disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      style={{
        backgroundColor: disabled ? getNeutral400Color() : getBlueDarkColor('default'),
        color: getWhiteColor()
      }}
      onMouseOver={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = '#1453E1';
        }
      }}
      onMouseOut={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = getBlueDarkColor('default');
        }
      }}
    >
      <span className="text-center justify-center text-2xl font-bold font-['Inter'] leading-10">
        {children}
      </span>
    </button>
  );
};

export default SignUpButton;
