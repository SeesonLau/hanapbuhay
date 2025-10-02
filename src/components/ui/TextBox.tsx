// src/components/ui/TextBox.tsx
import React, { forwardRef, useState, useEffect } from 'react';
import { COLORS } from '@/styles';
// Custom eye icons are now inline SVGs
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
  /** Minimum value for number inputs */
  min?: number;
  /** Maximum value for number inputs */
  max?: number;
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
  placeholder,
  value,
  defaultValue,
  onChange,
  onBlur,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [internalValue, setInternalValue] = useState(value || defaultValue || '');
  const [validationError, setValidationError] = useState<string | undefined>();
  const [touched, setTouched] = useState(false);
  const [isValid, setIsValid] = useState(false);
  
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
          return validateNumber(inputValue, min, max);
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
    const newValue = e.target.value;
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

  const inputClasses = `
    w-full 
    ${responsive ? 'h-10 sm:h-10' : 'h-10'}
    ${responsive ? 'px-4 py-1 sm:px-5 sm:py-2' : 'px-5 py-2'}
    border rounded-[10px] 
    ${responsive ? 'text-[12px] leading-[15px] sm:text-[12px] sm:leading-[15px]' : 'text-[12px] leading-[15px]'}
    font-light 
    bg-white 
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
    disabled:bg-gray-50 disabled:cursor-not-allowed
    ${leftIcon ? (responsive ? 'pl-9 sm:pl-9' : 'pl-9') : (responsive ? 'pl-4 sm:pl-5' : 'pl-5')}
    ${hasRightIcon ? (responsive ? 'pr-9 sm:pr-9' : 'pr-9') : (responsive ? 'pr-4 sm:pr-5' : 'pr-5')}
    ${isInErrorState ? 
      'border-red-500 focus:ring-red-400' : 
      'border-[#AEB2B1] hover:border-gray-400 focus:border-blue-500'
    }
    placeholder:text-[#AEB2B1] placeholder:font-light placeholder:text-[12px] placeholder:leading-[15px]
  `.trim();

  // CSS to hide browser's default password toggle
  const passwordInputStyles = type === 'password' ? {
    // Hide Edge/IE password reveal button  
    WebkitTextSecurity: showPassword ? 'none' : 'disc',
  } as React.CSSProperties : {};

  const labelClasses = `
    ${responsive ? 'text-[15px] leading-[18px] sm:text-[15px] sm:leading-[18px]' : 'text-[15px] leading-[18px]'}
    font-semibold text-[#4D5151]
    ${isInErrorState ? 'text-red-600' : ''}
    ${required ? 'after:content-["*"] after:text-red-500 after:ml-1' : ''}
  `.trim();

  const iconClasses = `absolute top-1/2 transform -translate-y-1/2 text-[#AEB2B1] flex items-center justify-center ${responsive ? 'w-4 h-4 sm:w-4 sm:h-4' : 'w-4 h-4'}`;

  const errorTextClasses = `${responsive ? 'text-xs sm:text-sm' : 'text-xs'} text-red-600 mt-1`;
  const helperTextClasses = `${responsive ? 'text-xs sm:text-sm' : 'text-xs'} text-gray-500 mt-1`;

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
      <div className={inputWrapperClasses}>
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

        {/* Right Icon or Password Toggle */}
        {hasRightIcon && (
          <div className={`${iconClasses} ${responsive ? 'right-3 sm:right-3' : 'right-3'}`}>
            <div className={iconInnerClass} style={computedIconInlineStyle}>
              {type === 'password' && (internalValue || value) ? (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`text-[#AEB2B1] hover:text-gray-600 transition-colors duration-200 ${computedIconSizeClass} flex items-center justify-center`}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    // Eye with slash - password is visible, click to hide
                    <svg className={computedIconSizeClass} style={computedIconInlineStyle} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2.21973 2.22032C2.09271 2.3473 2.01549 2.51566 2.00209 2.69477C1.98869 2.87388 2.04002 3.05185 2.14673 3.19632L2.21973 3.28032L6.25373 7.31532C4.28767 8.69484 2.88378 10.7359 2.29873 13.0653C2.25371 13.2571 2.28597 13.4589 2.38854 13.6272C2.4911 13.7954 2.65574 13.9165 2.84687 13.9643C3.038 14.0121 3.24026 13.9828 3.40995 13.8827C3.57965 13.7826 3.70313 13.6197 3.75373 13.4293C4.27354 11.3617 5.55133 9.56498 7.33373 8.39532L9.14373 10.2053C8.42073 10.9608 8.02232 11.9694 8.03386 13.015C8.04539 14.0607 8.46594 15.0602 9.20544 15.7996C9.94493 16.539 10.9446 16.9593 11.9902 16.9707C13.0359 16.982 14.0444 16.5835 14.7997 15.8603L20.7187 21.7803C20.8526 21.9145 21.0322 21.9931 21.2216 22.0002C21.411 22.0073 21.596 21.9425 21.7396 21.8187C21.8831 21.6949 21.9744 21.5214 21.9953 21.3331C22.0161 21.1447 21.9648 20.9554 21.8517 20.8033L21.7787 20.7193L15.6657 14.6053L15.6667 14.6033L14.4667 13.4053L11.5967 10.5353H11.5987L8.71873 7.65832L8.71973 7.65632L7.58673 6.52632L3.27973 2.22032C3.13911 2.07987 2.94848 2.00098 2.74973 2.00098C2.55098 2.00098 2.36036 2.07987 2.21973 2.22032ZM10.2037 11.2653L13.7387 14.8013C13.2672 15.2567 12.6357 15.5087 11.9802 15.503C11.3247 15.4973 10.6977 15.2344 10.2342 14.7709C9.77067 14.3073 9.50774 13.6803 9.50205 13.0248C9.49635 12.3693 9.74834 11.7368 10.2037 11.2653ZM11.9997 5.50032C10.9997 5.50032 10.0297 5.64832 9.11073 5.92532L10.3477 7.16132C12.4873 6.73767 14.7078 7.1524 16.5502 8.31975C18.3926 9.48709 19.716 11.3178 20.2467 13.4333C20.2985 13.6222 20.4222 13.7834 20.5913 13.8823C20.7604 13.9813 20.9615 14.0101 21.1516 13.9627C21.3417 13.9152 21.5056 13.7953 21.6084 13.6286C21.7113 13.4618 21.7447 13.2614 21.7017 13.0703C21.1599 10.9075 19.9109 8.98782 18.153 7.61626C16.3952 6.24469 14.2294 5.49993 11.9997 5.50032ZM12.1947 9.01032L15.9957 12.8103C15.9466 11.8182 15.5303 10.8798 14.8278 10.1775C14.1253 9.47525 13.1868 9.05922 12.1947 9.01032Z" fill="currentColor"/>
                    </svg>
                  ) : (
                    // Regular eye - password is hidden, click to show
                    <svg className={computedIconSizeClass} style={computedIconInlineStyle} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.9997 9.005C13.0606 9.005 14.078 9.42643 14.8281 10.1766C15.5783 10.9267 15.9997 11.9441 15.9997 13.005C15.9997 14.0659 15.5783 15.0833 14.8281 15.8334C14.078 16.5836 13.0606 17.005 11.9997 17.005C10.9388 17.005 9.92142 16.5836 9.17127 15.8334C8.42113 15.0833 7.9997 14.0659 7.9997 13.005C7.9997 11.9441 8.42113 10.9267 9.17127 10.1766C9.92142 9.42643 10.9388 9.005 11.9997 9.005ZM11.9997 10.505C11.3367 10.505 10.7008 10.7684 10.2319 11.2372C9.76309 11.7061 9.4997 12.342 9.4997 13.005C9.4997 13.668 9.76309 14.3039 10.2319 14.7728C10.7008 15.2416 11.3367 15.505 11.9997 15.505C12.6627 15.505 13.2986 15.2416 13.7675 14.7728C14.2363 14.3039 14.4997 13.668 14.4997 13.005C14.4997 12.342 14.2363 11.7061 13.7675 11.2372C13.2986 10.7684 12.6627 10.505 11.9997 10.505ZM11.9997 5.5C16.6127 5.5 20.5957 8.65 21.7007 13.064C21.7491 13.2569 21.7189 13.4612 21.6167 13.6319C21.5145 13.8025 21.3486 13.9256 21.1557 13.974C20.9628 14.0224 20.7585 13.9922 20.5878 13.89C20.4172 13.7878 20.2941 13.6219 20.2457 13.429C19.7827 11.5925 18.7199 9.96306 17.2257 8.79913C15.7316 7.6352 13.8916 7.00338 11.9976 7.00384C10.1036 7.0043 8.26401 7.63702 6.77043 8.80167C5.27684 9.96632 4.2148 11.5962 3.7527 13.433C3.72886 13.5286 3.68643 13.6186 3.62783 13.6978C3.56922 13.777 3.49559 13.8439 3.41113 13.8946C3.32668 13.9454 3.23305 13.979 3.13561 13.9935C3.03816 14.0081 2.9388 14.0033 2.8432 13.9795C2.7476 13.9557 2.65762 13.9132 2.57842 13.8546C2.49922 13.796 2.43233 13.7224 2.38158 13.6379C2.33084 13.5535 2.29722 13.4599 2.28266 13.3624C2.26809 13.265 2.27286 13.1656 2.2967 13.07C2.83854 10.907 4.08775 8.98722 5.8458 7.61563C7.60386 6.24405 9.7699 5.49939 11.9997 5.5Z" fill="currentColor"/>
                    </svg>
                  )}
                </button>
              ) : showLoadingIcon ? (
                <div className={`${computedIconSizeClass} border border-gray-400 border-t-transparent rounded-full animate-spin`} style={computedIconInlineStyle}></div>
              ) : showSuccessIcon && isValid && touched && !currentError ? (
                successIcon || (
                  <svg width={typeof iconSize === 'number' ? iconSize : (iconSize === 'sm' ? 12 : 16)} height={typeof iconSize === 'number' ? iconSize : (iconSize === 'sm' ? 12 : 16)} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={computedIconInlineStyle}>
                    <path d="M3 8L6.5 11.5L13 4" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )
              ) : (
                rightIcon
              )}
            </div>
          </div>
        )}
      </div>

      {/* Error or Helper Text */}
      {currentError && (
        <span className={errorTextClasses}>
          {currentError}
        </span>
      )}
      {!currentError && helperText && (
        <span className={helperTextClasses}>
          {helperText}
        </span>
      )}
    </div>
  );
});

TextBox.displayName = 'TextBox';

export default TextBox;