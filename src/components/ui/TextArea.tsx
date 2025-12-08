// src/components/ui/TextArea.tsx
'use client';

import React, { forwardRef, useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';

export interface TextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'type'> {
  label?: string;
  error?: string;
  helperText?: string;
  hasError?: boolean;
  disabled?: boolean;
  required?: boolean;
  width?: string;
  responsive?: boolean;
  className?: string;
  minLength?: number;
  maxLength?: number;
  enableValidation?: boolean;
  customValidator?: (value: string) => { isValid: boolean; error?: string };
  onValidationChange?: (isValid: boolean, error?: string) => void;
  showCharCount?: boolean;
  height?: string;
  variant?: 'default' | 'glassmorphism';
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(({
  label,
  error,
  helperText,
  hasError = false,
  disabled = false,
  required = false,
  width,
  className = '',
  responsive = true,
  minLength,
  maxLength,
  enableValidation = true,
  customValidator,
  onValidationChange,
  showCharCount = false,
  height = '128px',
  variant = 'default',
  placeholder,
  value,
  defaultValue,
  onChange,
  onBlur,
  ...props
}, ref) => {
  const { theme } = useTheme();
  const [internalValue, setInternalValue] = useState(value || defaultValue || '');
  const [validationError, setValidationError] = useState<string | undefined>();
  const [touched, setTouched] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const validateInput = (inputValue: string): { isValid: boolean; error?: string } => {
    if (customValidator) {
      return customValidator(inputValue);
    }

    if (required && !inputValue.trim()) {
      return { isValid: false, error: `${label || 'This field'} is required` };
    }

    if (minLength && inputValue.length > 0 && inputValue.length < minLength) {
      return { isValid: false, error: `Minimum ${minLength} characters required` };
    }

    if (maxLength && inputValue.length > maxLength) {
      return { isValid: false, error: `Maximum ${maxLength} characters allowed` };
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
  }, [internalValue, touched, enableValidation, required, minLength, maxLength]);

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onChange?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setTouched(true);
    onBlur?.(e);
  };

  const currentError = error || (touched ? validationError : undefined);
  const isInErrorState = hasError || !!currentError;

  const containerClasses = `flex flex-col items-start gap-[5px] ${className}`.trim();
  const textareaWrapperClasses = `relative flex w-full ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`.trim();

  const textareaClasses = `
    w-full 
    ${responsive ? 'px-4 py-3 sm:px-5 sm:py-3' : 'px-5 py-3'}
    border rounded-[10px] 
    ${responsive ? 'text-small sm:text-small' : 'text-small'}
    font-inter font-normal 
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:border-transparent
    disabled:cursor-not-allowed
    resize-none
    placeholder:font-inter placeholder:font-normal placeholder:text-small
  `.trim();

  const textareaStyle: React.CSSProperties = variant === 'glassmorphism' 
    ? {
        color: '#FFFFFF',
        backgroundColor: isInErrorState ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderColor: isInErrorState ? 'rgba(248, 113, 113, 0.5)' : 'rgba(255, 255, 255, 0.2)',
        ...(disabled && { backgroundColor: 'rgba(255, 255, 255, 0.05)', opacity: 0.5 }),
      }
    : {
        backgroundColor: disabled ? theme.colors.backgroundSecondary : theme.colors.surface,
        borderColor: isInErrorState ? theme.colors.error : theme.colors.border,
        color: theme.colors.text,
      };

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

  const helperTextClasses = `${responsive ? 'text-mini sm:text-tiny' : 'text-mini'} font-inter mt-1`;
  const charCountClasses = `${responsive ? 'text-mini sm:text-tiny' : 'text-mini'} font-inter text-right`;

  const helperTextStyle: React.CSSProperties = {
    color: theme.colors.textMuted,
  };

  const charCountStyle: React.CSSProperties = {
    color: theme.colors.textMuted,
  };

  const containerWidth = width || (responsive ? '100%' : '400px');
  
  const currentLength = String(internalValue).length;
  const charCountText = maxLength ? `${currentLength}/${maxLength}` : `${currentLength}`;

  return (
    <div 
      className={containerClasses}
      style={{ width: containerWidth, maxWidth: responsive ? '100%' : undefined }}
    >
      {label && (
        <label className={labelClasses} style={labelStyle}>
          {label}
          {required && (
            <span style={{ color: variant === 'glassmorphism' ? '#fca5a5' : theme.colors.error }}>*</span>
          )}
        </label>
      )}

      <div 
        className={textareaWrapperClasses}
        onMouseEnter={() => currentError && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <textarea
          ref={ref}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          minLength={minLength}
          maxLength={maxLength}
          value={value !== undefined ? value : internalValue}
          onChange={handleChange}
          onBlur={handleBlur}
          className={textareaClasses}
          style={{ ...textareaStyle, height }}
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
      </div>

      {showCharCount && !currentError && (
        <span className={charCountClasses} style={charCountStyle}>
          {charCountText}
        </span>
      )}

      {helperText && (
        <span className={helperTextClasses} style={helperTextStyle}>
          {helperText}
        </span>
      )}
    </div>
  );
});

TextArea.displayName = 'TextArea';

export default TextArea;