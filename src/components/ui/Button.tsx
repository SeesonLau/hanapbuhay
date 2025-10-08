// src/components/ui/button.tsx
import React from 'react';
import { getBlueDarkColor, getWhiteColor, getNeutral400Color, TYPOGRAPHY, fontClasses } from '@/styles';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'primary400' | 'secondary' | 'danger' | 'ghost' | 'neutral300' | 'approve' | 'deny';
  size?: 'tiny' | 'sm' | 'md' | 'lg' | 'xl' | 'approveDeny';
  isLoading?: boolean;
  children: React.ReactNode;
  useCustomHover?: boolean;
  fullRounded?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    isLoading, 
    children, 
    useCustomHover = false,
    fullRounded = false,
    disabled = false,
    ...props 
  }, ref) => {
    const baseClasses = "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    
    const variants = {
      primary: `bg-[#3289FF] text-white ${!useCustomHover ? 'hover:bg-[#1C6AF4] active:bg-[#1C6AF4]' : ''}`,
      primary400: `bg-[#59ACFF] text-white ${!useCustomHover ? 'hover:bg-[#3289FF] active:bg-[#3289FF]' : ''}`,
      secondary: "bg-[#e6e7e7] text-[#3B3E3E] border border-[#3B3E3E] hover:bg-[#858b8a] hover:text-white active:bg-[#858b8a]",
      danger: "bg-[#ED4A4A] text-white hover:bg-[#DA2727] active:bg-[#DA2727]",
      ghost: "bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200 border border-gray-300",
      neutral300: "bg-[#CFD2D1] text-[#3B3E3E] hover:bg-[#AEB2B1] active:bg-[#858b8a]",
      approve: "bg-[#71D852] text-white hover:bg-[#5EC844] active:bg-[#4EB636]",
      deny: "bg-[#F87172] text-white hover:bg-[#F15151] active:bg-[#E03A3A]"
    };

    const sizes = {
      tiny: "h-10 py-2 px-4 min-w-[100px] text-xs",
      sm: "h-8 px-3 text-small min-w-[100px]",
      md: "h-10 py-2 px-4 min-w-[100px]",
      lg: "h-12 px-6 text-lg min-w-[100px]",
      xl: "h-[2.1875rem] w-[25rem] px-5 text-base", // 400x35
      approveDeny: "h-[25px] w-[100px] text-tiny rounded-[5px]"
    };

    const roundedClass = fullRounded ? "rounded-[40px]" : "rounded-md";

    const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${roundedClass} ${className || ''}`;

    // Handle custom hover for primary variant
    const handleMouseOver = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (useCustomHover && variant === 'primary' && !disabled) {
        e.currentTarget.style.backgroundColor = '#1453E1';
      }
      props.onMouseOver?.(e);
    };

    const handleMouseOut = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (useCustomHover && variant === 'primary' && !disabled) {
        e.currentTarget.style.backgroundColor = getBlueDarkColor('default');
      }
      props.onMouseOut?.(e);
    };

    return (
      <button
        className={buttonClasses}
        ref={ref}
        disabled={isLoading || disabled}
        style={{
          ...(useCustomHover && variant === 'primary' && {
            backgroundColor: disabled ? getNeutral400Color() : getBlueDarkColor('default'),
            color: getWhiteColor()
          })
        }}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        <span 
          className="text-center justify-center"
          style={{
            //fontSize: TYPOGRAPHY.body.fontSize, -- Commented to allow customized font size
            fontWeight: TYPOGRAPHY.body.fontWeight,
            //lineHeight: TYPOGRAPHY.body.lineHeight, -- Commented to allow customized font size
            fontFamily: TYPOGRAPHY.body.fontFamily
          }}
        >
          {children}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
