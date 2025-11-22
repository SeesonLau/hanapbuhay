// src/components/ui/TextBox.tsx
import React, { forwardRef, useState, useEffect } from 'react';
import { COLORS } from '@/styles';
import { VscEye } from "react-icons/vsc";
import { VscEyeClosed } from "react-icons/vsc";
import { FaCheck } from "react-icons/fa6";
import { 
  validateEmail, 
  validatePhone, 
  validateNumber, 
  validateRequired, 
  validateUrl, 
  validatePassword,
  ValidationResult 
} from '@/lib/utils/textbox-validation';

export interface TextBoxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** The type of input field */
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'date' | 'datetime-local' | 'time' | 'url' | 'search';
  /** Label text to display above the input */
  label?: string;
  /** Error message to display below the input */
  error?: string;
  /** Phone prefix to display (e.g., '+63') - only for tel type */
  phonePrefix?: string;
  /** Helper text to display below the input */
  helperText?: string;
  /** Icon component to display on the left side */
  leftIcon?: React.ReactNode;
  /** Icon component to display on the right side (Note: ignored for password fields which show eye toggle) */
  rightIcon?: React.ReactNode;
  /** Whether the input is in an error state */
  hasError?: boolean;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Whether the field is required */
  required?: boolean;
  /** Custom width override (defaults to responsive width) */
  width?: string;
  /** Make component fully responsive (default: true) */
  responsive?: boolean;
  /** Custom className for additional styling */
  className?: string;
  /** Enable real-time validation (default: true) */
  enableValidation?: boolean;
  /** Minimum value for number inputs or date string for date inputs */
  min?: number | string;
  /** Maximum value for number inputs or date string for date inputs */
  max?: number | string;
  /** Minimum length for password validation */
  minPasswordLength?: number;
  /** Custom validation function */
  customValidator?: (value: string) => ValidationResult;
  /** Callback when validation state changes */
  onValidationChange?: (isValid: boolean, error?: string) => void;
  /** Show success icon when validation passes */
  showSuccessIcon?: boolean;
  /** Custom success icon (defaults to green checkmark) */
  successIcon?: React.ReactNode;
  /** Show loading icon during async validation */
  showLoadingIcon?: boolean;
  /** Icon size: 'sm' (12px) | 'md' (16px) or explicit number (px) */
  iconSize?: 'sm' | 'md' | number;
  /** Visual variant: 'default' or 'glassmorphism' */
  variant?: 'default' | 'glassmorphism';
}

const TextBox = forwardRef<HTMLInputElement, TextBoxProps>(({
  type = 'text',
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  hasError = false,
  disabled = false,
  required = false,
  width,
  className = '',
  responsive = true,
  enableValidation = true,
  min,
  max,
  minPasswordLength = 8,
  customValidator,
  onValidationChange,
  showSuccessIcon = false,
  successIcon,
  showLoadingIcon = false,
  iconSize = 'md',
  variant = 'default',
  placeholder,
  value,
  defaultValue,
  onChange,
  onBlur,
  phonePrefix,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [internalValue, setInternalValue] = useState(value || defaultValue || '');
  const [validationError, setValidationError] = useState<string | undefined>();
  const [touched, setTouched] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  
  const inputType = type === 'password' && showPassword ? 'text' : type;

  // Validation function
  const validateInput = (inputValue: string): ValidationResult => {
    // Custom validator takes precedence
    if (customValidator) {
      return customValidator(inputValue);
    }

    // Required validation
    if (required && !inputValue.trim()) {
      return validateRequired(inputValue, label);
    }

    // Type-specific validation (only if field has content)
    if (inputValue.trim()) {
      switch (type) {
        case 'email':
          return validateEmail(inputValue);
        case 'tel':
          return validatePhone(inputValue);
        case 'number':
          return validateNumber(inputValue, typeof min === 'number' ? min : undefined, typeof max === 'number' ? max : undefined);
        case 'url':
          return validateUrl(inputValue);
        case 'password':
          return validatePassword(inputValue, minPasswordLength);
        default:
          return { isValid: true };
      }
    }

    return { isValid: true };
  };

  // Handle validation
  useEffect(() => {
    if (enableValidation && touched) {
      const validation = validateInput(String(internalValue));
      setValidationError(validation.error);
      setIsValid(validation.isValid && !!internalValue);
      onValidationChange?.(validation.isValid, validation.error);
    }
  }, [internalValue, touched, enableValidation, required, type, min, max, minPasswordLength]);

  // Update internal value when external value changes
  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    
    // For phone type, only allow numbers and limit to 11 digits
    if (type === 'tel') {
      // Remove any non-digit characters
      newValue = newValue.replace(/\D/g, '');
      // Limit to 11 digits
      newValue = newValue.slice(0, 11);
      // Update the event value
      e.target.value = newValue;
    }
    
    setInternalValue(newValue);
    onChange?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched(true);
    onBlur?.(e);
  };

  // Determine if we should show an error
  const currentError = error || (touched ? validationError : undefined);
  const isInErrorState = hasError || !!currentError;

  // Icon size handling: allow 'sm' (12px), 'md' (16px) or explicit pixel number
  const computedIconSizeClass = typeof iconSize === 'number' ? '' : (iconSize === 'sm' ? 'w-3 h-3' : 'w-4 h-4');
  const computedIconInlineStyle: React.CSSProperties | undefined = typeof iconSize === 'number' ? { width: iconSize, height: iconSize } : undefined;
  const iconInnerClass = `${computedIconSizeClass} flex items-center justify-center`;

  const containerClasses = `
    flex flex-col items-start gap-[5px] 
    ${className}
  `.trim();

  const inputWrapperClasses = `
    relative flex items-center w-full
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
  `.trim();

  // Determine if we have a right-side icon
  const hasRightIcon = (type === 'password' && (internalValue || value)) || 
                      (rightIcon !== undefined && type !== 'password') || 
                      (showSuccessIcon && isValid && touched && !currentError) || 
                      showLoadingIcon;

  const hasPhonePrefix = type === 'tel' && phonePrefix;
  
  const inputClasses = variant === 'glassmorphism' 
    ? `
      w-full 
      ${responsive ? 'h-10 sm:h-10' : 'h-10'}
      ${responsive ? 'px-4 py-1 sm:px-5 sm:py-2' : 'px-5 py-2'}
      border rounded-[10px] 
      ${responsive ? 'text-small sm:text-small' : 'text-small'}
      font-inter font-normal 
      text-white
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:border-transparent
      disabled:cursor-not-allowed
      ${leftIcon ? (responsive ? 'pl-9 sm:pl-9' : 'pl-9') : (responsive ? 'pl-4 sm:pl-5' : 'pl-5')}
      ${hasRightIcon ? (responsive ? 'pr-9 sm:pr-9' : 'pr-9') : (responsive ? 'pr-4 sm:pr-5' : 'pr-5')}
      ${isInErrorState ? 
        'border-red-400/50 focus:ring-red-400/20 bg-red-500/10 backdrop-blur-[10px]' : 
        'border-white/20 hover:border-white/30 focus:border-blue-300/50 focus:ring-blue-300/20 bg-white/10 backdrop-blur-[10px] hover:bg-white/15'
      }
      placeholder:text-white/50 placeholder:font-inter placeholder:font-normal placeholder:text-small
      disabled:bg-white/5 disabled:opacity-50
    `.trim()
    : `
      w-full 
      ${responsive ? 'h-10 sm:h-10' : 'h-10'}
      ${responsive ? 'px-4 py-1 sm:px-5 sm:py-2' : 'px-5 py-2'}
      border rounded-[10px] 
      ${responsive ? 'text-small sm:text-small' : 'text-small'}
      font-inter font-normal 
      bg-white 
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-primary-primary400 focus:border-transparent
      disabled:bg-gray-neutral50 disabled:cursor-not-allowed
      ${leftIcon ? (responsive ? 'pl-9 sm:pl-9' : 'pl-9') : (responsive ? 'pl-4 sm:pl-5' : 'pl-5')}
      ${hasRightIcon ? (responsive ? 'pr-9 sm:pr-9' : 'pr-9') : (responsive ? 'pr-4 sm:pr-5' : 'pr-5')}
      ${isInErrorState ? 
        'border-error-error500 focus:ring-error-error200' : 
        'border-gray-neutral300 hover:border-gray-neutral400 focus:border-primary-primary500'
      }
      placeholder:text-gray-neutral400 placeholder:font-inter placeholder:font-normal placeholder:text-small
    `.trim();

  // CSS to hide browser's default password toggle
  const passwordInputStyles = type === 'password' ? {
    // Hide Edge/IE password reveal button  
    WebkitTextSecurity: showPassword ? 'none' : 'disc',
  } as React.CSSProperties : {};

  const labelClasses = variant === 'glassmorphism'
    ? `
      ${responsive ? 'text-body sm:text-body' : 'text-body'}
      font-semibold font-inter text-white
      ${isInErrorState ? 'text-red-300' : ''}
      ${required ? 'after:content-["*"] after:text-red-300 after:ml-1' : ''}
    `.trim()
    : `
      ${responsive ? 'text-body sm:text-body' : 'text-body'}
      font-semibold font-inter text-black
      ${isInErrorState ? 'text-error-error600' : ''}
      ${required ? 'after:content-["*"] after:text-error-error500 after:ml-1' : ''}
    `.trim();

  const iconClasses = variant === 'glassmorphism'
    ? `absolute top-1/2 transform -translate-y-1/2 text-white/60 flex items-center justify-center ${responsive ? 'w-4 h-4 sm:w-4 sm:h-4' : 'w-4 h-4'}`
    : `absolute top-1/2 transform -translate-y-1/2 text-gray-neutral400 flex items-center justify-center ${responsive ? 'w-4 h-4 sm:w-4 sm:h-4' : 'w-4 h-4'}`;

  const errorTextClasses = `${responsive ? 'text-mini sm:text-tiny' : 'text-mini'} font-inter text-error-error600 mt-1`;
  const helperTextClasses = `${responsive ? 'text-mini sm:text-tiny' : 'text-mini'} font-inter text-gray-neutral500 mt-1`;

  // Determine container width - match original design specs
  const containerWidth = width || (responsive ? '100%' : '400px');

  return (
    <div 
      className={containerClasses}
      style={{ width: containerWidth, maxWidth: responsive ? '100%' : undefined }}
    >
        {/* Label */}
      {label && (
        <label className={labelClasses}>
          {label}
        </label>
      )}

      {/* Input Container */}
      <div 
        className={inputWrapperClasses}
        onMouseEnter={() => currentError && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Left Icon */}
        {leftIcon && (
          <div className={`${iconClasses} ${responsive ? 'left-3 sm:left-3' : 'left-3'}`}>
            <div className={iconInnerClass} style={computedIconInlineStyle}>
              {leftIcon}
            </div>
          </div>
        )}

        {/* Input Field */}
        <input
          ref={ref}
          type={inputType}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          min={min}
          max={max}
          value={value !== undefined ? value : internalValue}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`${inputClasses} ${type === 'password' ? '[&::-ms-reveal]:hidden [&::-ms-clear]:hidden [&::-webkit-credentials-auto-fill-button]:hidden [&::-webkit-strong-password-auto-fill-button]:hidden' : ''}`}
          style={passwordInputStyles}
          {...props}
        />

        {/* Validation Error Tooltip */}
        {currentError && showTooltip && (
          <div className="absolute right-0 bottom-full mb-2 z-50 pointer-events-none">
            <div className="relative bg-error-error600 text-white px-2 py-1 rounded shadow-lg text-mini font-inter whitespace-nowrap max-w-xs">
              {currentError}
              {/* Arrow pointing down */}
              <div className="absolute right-4 top-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-error-error600"></div>
            </div>
          </div>
        )}

        {/* Right Icon or Password Toggle */}
        {hasRightIcon && (
          <div className={`${iconClasses} ${responsive ? 'right-3 sm:right-3' : 'right-3'}`}>
            <div className={iconInnerClass} style={computedIconInlineStyle}>
              {type === 'password' && (internalValue || value) ? (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`${variant === 'glassmorphism' ? 'text-white/60 hover:text-white/90' : 'text-gray-neutral400 hover:text-gray-neutral600'} transition-colors duration-200 ${computedIconSizeClass} flex items-center justify-center`}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <VscEyeClosed className={computedIconSizeClass} style={computedIconInlineStyle} />
                  ) : (
                    <VscEye className={computedIconSizeClass} style={computedIconInlineStyle} />
                  )}
                </button>
              ) : showLoadingIcon ? (
                <div className={`${computedIconSizeClass} border ${variant === 'glassmorphism' ? 'border-white/40 border-t-transparent' : 'border-gray-400 border-t-transparent'} rounded-full animate-spin`} style={computedIconInlineStyle}></div>
              ) : showSuccessIcon && isValid && touched && !currentError ? (
                successIcon || (
                  <FaCheck className={`${computedIconSizeClass} text-success-success500`} style={computedIconInlineStyle} />
                )
              ) : (
                rightIcon
              )}
            </div>
          </div>
        )}
      </div>

      {/* Helper Text (errors now shown in tooltip on hover) */}
      {helperText && (
        <span className={helperTextClasses}>
          {helperText}
        </span>
      )}
    </div>
  );
});

TextBox.displayName = 'TextBox';

export default TextBox;