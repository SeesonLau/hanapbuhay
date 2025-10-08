// src/components/ui/button.tsx
import React from 'react';

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
    const baseClasses = "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-primary400 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    
    const variants = {
      primary: `bg-primary-primary500 text-white ${!useCustomHover ? 'hover:bg-primary-primary600 active:bg-primary-primary700' : ''}`,
      primary400: `bg-primary-primary400 text-white ${!useCustomHover ? 'hover:bg-primary-primary500 active:bg-primary-primary600' : ''}`,
      secondary: "bg-gray-neutral100 text-gray-neutral900 border border-gray-neutral900 hover:bg-gray-neutral400 hover:text-white active:bg-gray-neutral500",
      danger: "bg-error-error500 text-white hover:bg-error-error600 active:bg-error-error700",
      ghost: "bg-transparent text-gray-neutral700 hover:bg-gray-neutral50 active:bg-gray-neutral100 border border-gray-neutral300",
      neutral300: "bg-gray-neutral200 text-gray-neutral900 hover:bg-gray-neutral300 active:bg-gray-neutral400",
      approve: "bg-success-success400 text-white hover:bg-success-success500 active:bg-success-success600",
      deny: "bg-error-error400 text-white hover:bg-error-error500 active:bg-error-error600"
    };

    const sizes = {
      tiny: "h-10 py-2 px-4 min-w-[100px] text-tiny font-inter",
      sm: "h-8 px-3 text-small min-w-[100px] font-inter",
      md: "h-10 py-2 px-4 min-w-[100px] text-body font-inter",
      lg: "h-12 px-6 text-lead min-w-[100px] font-inter",
      xl: "h-[2.1875rem] w-[25rem] px-5 text-body font-inter", // 400x35
      approveDeny: "h-[25px] w-[100px] text-mini rounded-[5px] font-inter"
    };

    const roundedClass = fullRounded ? "rounded-[40px]" : "rounded-md";

    const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${roundedClass} ${className || ''}`;

    // Handle custom hover for primary variant
    const handleMouseOver = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (useCustomHover && variant === 'primary' && !disabled) {
        e.currentTarget.style.backgroundColor = '#1453E1'; // primary-700
      }
      props.onMouseOver?.(e);
    };

    const handleMouseOut = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (useCustomHover && variant === 'primary' && !disabled) {
        e.currentTarget.style.backgroundColor = '#3289FF'; // primary-500
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
            backgroundColor: disabled ? '#858B8A' : '#3289FF', // gray-neutral400 : primary-500
            color: '#FFFFFF'
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
        <span className="text-center justify-center font-medium font-inter">
          {children}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
