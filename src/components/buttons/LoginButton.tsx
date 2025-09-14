import React from 'react';
import { ButtonProps } from '../types';
import { getBlueDarkColor, getGrayColor } from '@/lib/colors';

const LoginButton: React.FC<ButtonProps> = ({ 
  onClick, 
  disabled = false, 
  className = '', 
  children = 'Log In', 
  type = 'button' 
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`min-w-44 px-4 py-2 rounded-[40px] outline outline-2 outline-offset-[-2px] inline-flex justify-center items-center gap-2.5 hover:bg-[#E6E7E7] disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      style={{
        outlineColor: getBlueDarkColor('default'),
        color: getBlueDarkColor('default'),
        backgroundColor: 'transparent'
      }}
      onMouseOver={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = getGrayColor('default');
        }
      }}
      onMouseOut={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = 'transparent';
        }
      }}
    >
      <div className="flex justify-center items-center gap-2.5">
        <span className="text-center justify-center text-2xl font-bold font-['Inter'] leading-10">
          {children}
        </span>
      </div>
    </button>
  );
};

export default LoginButton;
