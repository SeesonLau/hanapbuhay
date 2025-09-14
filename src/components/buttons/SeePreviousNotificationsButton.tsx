import React from 'react';
import { ButtonProps } from '../types';
import { getGrayColor } from '@/lib/colors';

const SeePreviousNotificationsButton: React.FC<ButtonProps> = ({ 
  onClick, 
  disabled = false, 
  className = '', 
  children = 'See previous notifications', 
  type = 'button' 
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-96 h-7 bg-[#F5F5F5] rounded-[5px] inline-flex justify-center items-center gap-2.5 hover:bg-[#E6E7E7] disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      style={{
        backgroundColor: disabled ? getGrayColor('default') : '#F5F5F5',
        color: '#AEB2B1'
      }}
      onMouseOver={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = getGrayColor('default');
          e.currentTarget.style.boxShadow = '0px 4px 4px 0px rgba(0,0,0,0.25)';
        }
      }}
      onMouseOut={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = '#F5F5F5';
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
    >
      <span className="justify-start text-xs font-medium font-['Inter']">
        {children}
      </span>
    </button>
  );
};

export default SeePreviousNotificationsButton;
