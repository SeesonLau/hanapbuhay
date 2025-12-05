// src/components/ui/TextArea.tsx
import React, { forwardRef, useState, useEffect } from 'react';

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
  /** Visual variant: 'default' or 'glassmorphism' */
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

  const containerClasses = `
    flex flex-col items-start gap-[5px] 
    ${className}
  `.trim();

  const textareaWrapperClasses = `
    relative flex w-full
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
  `.trim();

  const textareaClasses = variant === 'glassmorphism'
    ? `
      w-full 
      ${responsive ? 'px-4 py-3 sm:px-5 sm:py-3' : 'px-5 py-3'}
      border rounded-[10px] 
      ${responsive ? 'text-small sm:text-small' : 'text-small'}
      font-inter font-normal 
      text-white
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:border-transparent
      disabled:cursor-not-allowed
      resize-none
      ${isInErrorState ? 
        'border-red-400/50 focus:ring-red-400/20 bg-red-500/10 backdrop-blur-[10px]' : 
        'border-white/20 hover:border-white/30 focus:border-blue-300/50 focus:ring-blue-300/20 bg-white/10 backdrop-blur-[10px] hover:bg-white/15'
      }
      placeholder:text-white/50 placeholder:font-inter placeholder:font-normal placeholder:text-small
      disabled:bg-white/5 disabled:opacity-50
    `.trim()
    : `
      w-full 
      ${responsive ? 'px-4 py-3 sm:px-5 sm:py-3' : 'px-5 py-3'}
      border rounded-[10px] 
      ${responsive ? 'text-small sm:text-small' : 'text-small'}
      font-inter font-normal 
      bg-white 
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-primary-primary400 focus:border-transparent
      disabled:bg-gray-neutral50 disabled:cursor-not-allowed
      resize-none
      ${isInErrorState ? 
        'border-error-error500 focus:ring-error-error200' : 
        'border-gray-neutral300 hover:border-gray-neutral400 focus:border-primary-primary500'
      }
      placeholder:text-gray-neutral400 placeholder:font-inter placeholder:font-normal placeholder:text-small
    `.trim();

  const labelClasses = variant === 'glassmorphism'
    ? `
      ${responsive ? 'text-body sm:text-body' : 'text-body'}
      font-semibold font-inter text-white
      ${isInErrorState ? 'text-red-300' : ''}
      ${required ? 'after:content-["*"] after:text-red-300 after:ml-1' : ''}
    `.trim()
    : `
      ${responsive ? 'text-body sm:text-body' : 'text-body'}
      font-semibold font-inter text-gray-neutral900
      ${isInErrorState ? 'text-error-error600' : ''}
      ${required ? 'after:content-["*"] after:text-error-error500 after:ml-1' : ''}
    `.trim();

  const helperTextClasses = `${responsive ? 'text-mini sm:text-tiny' : 'text-mini'} font-inter text-gray-neutral500 mt-1`;
  const charCountClasses = `${responsive ? 'text-mini sm:text-tiny' : 'text-mini'} font-inter text-gray-neutral500 text-right`;

  const containerWidth = width || (responsive ? '100%' : '400px');
  
  const currentLength = String(internalValue).length;
  const charCountText = maxLength ? `${currentLength}/${maxLength}` : `${currentLength}`;

  return (
    <div 
      className={containerClasses}
      style={{ width: containerWidth, maxWidth: responsive ? '100%' : undefined }}
    >
      {label && (
        <label className={labelClasses}>
          {label}
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
          style={{ height }}
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
      </div>

      {showCharCount && !currentError && (
        <span className={charCountClasses}>
          {charCountText}
        </span>
      )}

      {/* Helper Text (errors now shown in tooltip on hover) */}
      {helperText && (
        <span className={helperTextClasses}>
          {helperText}
        </span>
      )}
    </div>
  );
});

TextArea.displayName = 'TextArea';

export default TextArea;