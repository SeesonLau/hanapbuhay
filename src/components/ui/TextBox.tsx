// src/components/ui/TextBox.tsx
import React, { forwardRef, useState, useEffect } from 'react';
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
import { useTheme } from '@/hooks/useTheme';

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
  hideRequiredAsterisk?: boolean;
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
  hideRequiredAsterisk,
  placeholder,
  value,
  defaultValue,
  onChange,
  onBlur,
  phonePrefix,
  ...props
}, ref) => {
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [internalValue, setInternalValue] = useState(value || defaultValue || '');
  const [validationError, setValidationError] = useState<string | undefined>();
  const [touched, setTouched] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  
  const inputType = type === 'password' && showPassword ? 'text' : type;

  const validateInput = (inputValue: string): ValidationResult => {
    if (customValidator) {
      return customValidator(inputValue);
    }

    if (required && !inputValue.trim()) {
      return validateRequired(inputValue, label);
    }

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

  useEffect(() => {
    if (enableValidation && touched) {
      const validation = validateInput(String(internalValue));
      setValidationError(validation.error);
      setIsValid(validation.isValid && !!internalValue);
      onValidationChange?.(validation.isValid, validation.error);
    }
  }, [internalValue, touched, enableValidation, required, type, min, max, minPasswordLength]);

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    
    if (type === 'tel') {
      newValue = newValue.replace(/\D/g, '');
      newValue = newValue.slice(0, 11);
      e.target.value = newValue;
    }
    
    setInternalValue(newValue);
    onChange?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched(true);
    onBlur?.(e);
  };

  const currentError = error || (touched ? validationError : undefined);
  const isInErrorState = hasError || !!currentError;

  const computedIconSizeClass = typeof iconSize === 'number' ? '' : (iconSize === 'sm' ? 'w-3 h-3' : 'w-4 h-4');
  const computedIconInlineStyle: React.CSSProperties | undefined = typeof iconSize === 'number' ? { width: iconSize, height: iconSize } : undefined;
  const iconInnerClass = `${computedIconSizeClass} flex items-center justify-center`;

  const containerClasses = `flex flex-col items-start gap-[5px] ${className}`.trim();
  const inputWrapperClasses = `relative flex items-center w-full ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`.trim();

  const hasRightIcon = (type === 'password' && (internalValue || value)) || 
                      (rightIcon !== undefined && type !== 'password') || 
                      (showSuccessIcon && isValid && touched && !currentError) || 
                      showLoadingIcon;

  const hasPhonePrefix = type === 'tel' && phonePrefix;
  
  const inputClasses = `
    w-full
    ${!props.style?.height ? (responsive ? 'h-10 sm:h-10' : 'h-10') : ''}
    ${responsive ? 'px-4 py-1 sm:px-5 sm:py-2' : 'px-5 py-2'}
    border rounded-[10px]
    ${!props.style?.fontSize ? (responsive ? 'text-small sm:text-small' : 'text-small') : ''}
    font-inter font-normal
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:border-transparent
    disabled:cursor-not-allowed
    ${leftIcon ? (responsive ? 'pl-9 sm:pl-9' : 'pl-9') : (responsive ? 'pl-4 sm:pl-5' : 'pl-5')}
    ${hasRightIcon ? (responsive ? 'pr-9 sm:pr-9' : 'pr-9') : (responsive ? 'pr-4 sm:pr-5' : 'pr-5')}
    placeholder:font-inter placeholder:font-normal placeholder:text-small
    ${type === 'password' ? '[&::-ms-reveal]:hidden [&::-ms-clear]:hidden [&::-webkit-credentials-auto-fill-button]:hidden [&::-webkit-strong-password-auto-fill-button]:hidden' : ''}
  `.trim();

  const inputStyle: React.CSSProperties = variant === 'glassmorphism' 
    ? {
        color: '#FFFFFF',
        backgroundColor: isInErrorState ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderColor: isInErrorState ? 'rgba(248, 113, 113, 0.5)' : 'rgba(255, 255, 255, 0.2)',
        ...(disabled && { backgroundColor: 'rgba(255, 255, 255, 0.05)', opacity: 0.5 }),
      }
    : {
        backgroundColor: disabled ? theme.colors.backgroundSecondary : theme.colors.surface,
        borderColor: isInErrorState ? theme.colors.error : '#2A2D2D',
        color: theme.colors.text,
      };

  const passwordInputStyles = type === 'password' ? {
    WebkitTextSecurity: showPassword ? 'none' : 'disc',
  } as React.CSSProperties : {};

  const labelClasses = `
    ${responsive ? 'text-body sm:text-body' : 'text-body'}
    font-semibold font-inter
  `.trim();

  const labelStyle: React.CSSProperties = variant === 'glassmorphism'
    ? {
        color: isInErrorState ? '#fca5a5' : '#FFFFFF',
      }
    : {
        color: isInErrorState ? theme.colors.error : theme.colors.text,
      };

  const iconClasses = `absolute top-1/2 transform -translate-y-1/2 flex items-center justify-center ${responsive ? 'w-4 h-4 sm:w-4 sm:h-4' : 'w-4 h-4'}`;
  
  const iconStyle: React.CSSProperties = variant === 'glassmorphism'
    ? { color: 'rgba(255, 255, 255, 0.6)' }
    : { color: theme.colors.textMuted };

  const helperTextClasses = `${responsive ? 'text-mini sm:text-tiny' : 'text-mini'} font-inter mt-1`;
  const helperTextStyle: React.CSSProperties = {
    color: theme.colors.textMuted,
  };

  const containerWidth = width || (responsive ? '100%' : '400px');

  return (
    <div 
      className={containerClasses}
      style={{ width: containerWidth, maxWidth: responsive ? '100%' : undefined }}
    >
      {label && (
        <label className={labelClasses} style={labelStyle}>
          {label}
          {required && !hideRequiredAsterisk && (
            <span style={{ color: variant === 'glassmorphism' ? '#fca5a5' : theme.colors.error }}>*</span>
          )}
        </label>
      )}

      <div 
        className={inputWrapperClasses}
        onMouseEnter={() => currentError && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {leftIcon && (
          <div className={`${iconClasses} ${responsive ? 'left-3 sm:left-3' : 'left-3'}`} style={iconStyle}>
            <div className={iconInnerClass} style={computedIconInlineStyle}>
              {leftIcon}
            </div>
          </div>
        )}

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
          className={inputClasses}
          style={{ ...inputStyle, ...passwordInputStyles }}
          {...props}
        />

        {currentError && showTooltip && (
          <div className="absolute right-0 bottom-full mb-2 z-50 pointer-events-none">
            <div 
              className="relative px-2 py-1 rounded shadow-lg text-mini font-inter whitespace-nowrap max-w-xs"
              style={{ backgroundColor: theme.colors.error, color: '#FFFFFF' }}
            >
              {currentError}
              <div 
                className="absolute right-4 top-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px]"
                style={{ borderTopColor: theme.colors.error }}
              />
            </div>
          </div>
        )}

        {hasRightIcon && (
          <div className={`${iconClasses} ${responsive ? 'right-3 sm:right-3' : 'right-3'}`}>
            <div className={iconInnerClass} style={computedIconInlineStyle}>
              {type === 'password' && (internalValue || value) ? (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`transition-colors duration-200 ${computedIconSizeClass} flex items-center justify-center`}
                  style={{ color: variant === 'glassmorphism' ? 'rgba(255, 255, 255, 0.6)' : theme.colors.textMuted }}
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
                <div 
                  className={`${computedIconSizeClass} rounded-full animate-spin`} 
                  style={{
                    ...computedIconInlineStyle,
                    border: `2px solid ${variant === 'glassmorphism' ? 'rgba(255, 255, 255, 0.4)' : theme.colors.textMuted}`,
                    borderTopColor: 'transparent',
                  }}
                />
              ) : showSuccessIcon && isValid && touched && !currentError ? (
                successIcon || (
                  <FaCheck className={computedIconSizeClass} style={{ ...computedIconInlineStyle, color: theme.colors.success }} />
                )
              ) : (
                <div style={iconStyle}>{rightIcon}</div>
              )}
            </div>
          </div>
        )}
      </div>

      {helperText && (
        <span className={helperTextClasses} style={helperTextStyle}>
          {helperText}
        </span>
      )}
    </div>
  );
});

TextBox.displayName = 'TextBox';

export default TextBox;
