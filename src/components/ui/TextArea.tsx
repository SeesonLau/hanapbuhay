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

  const textareaClasses = `
    w-full 
    ${responsive ? 'px-4 py-3 sm:px-5 sm:py-3' : 'px-5 py-3'}
    border rounded-[10px] 
    ${responsive ? 'text-[12px] leading-[15px] sm:text-[12px] sm:leading-[15px]' : 'text-[12px] leading-[15px]'}
    font-light 
    bg-white 
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
    disabled:bg-gray-50 disabled:cursor-not-allowed
    resize-none
    ${isInErrorState ? 
      'border-red-500 focus:ring-red-400' : 
      'border-[#AEB2B1] hover:border-gray-400 focus:border-blue-500'
    }
    placeholder:text-[#AEB2B1] placeholder:font-light placeholder:text-[12px] placeholder:leading-[15px]
  `.trim();

  const labelClasses = `
    ${responsive ? 'text-[15px] leading-[18px] sm:text-[15px] sm:leading-[18px]' : 'text-[15px] leading-[18px]'}
    font-semibold text-[#4D5151]
    ${isInErrorState ? 'text-red-600' : ''}
    ${required ? 'after:content-["*"] after:text-red-500 after:ml-1' : ''}
  `.trim();

  const errorTextClasses = `${responsive ? 'text-xs sm:text-sm' : 'text-xs'} text-red-600 mt-1`;
  const helperTextClasses = `${responsive ? 'text-xs sm:text-sm' : 'text-xs'} text-gray-500 mt-1`;
  const charCountClasses = `${responsive ? 'text-xs sm:text-sm' : 'text-xs'} text-gray-500 text-right`;

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

      <div className={textareaWrapperClasses}>
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
      </div>

      {showCharCount && !currentError && (
        <span className={charCountClasses}>
          {charCountText}
        </span>
      )}

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

TextArea.displayName = 'TextArea';

export default TextArea;