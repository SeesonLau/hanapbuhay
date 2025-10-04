// src/components/ui/SelectBox.tsx
import React, { forwardRef } from 'react';

export interface SelectBoxProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
  hasError?: boolean;
  disabled?: boolean;
  required?: boolean;
  width?: string;
  className?: string;
  responsive?: boolean;
}

const SelectBox = forwardRef<HTMLSelectElement, SelectBoxProps>(({
  label,
  error,
  helperText,
  options,
  hasError = false,
  disabled = false,
  required = false,
  width,
  className = '',
  responsive = true,
  value,
  onChange,
  ...props
}, ref) => {

  const containerClasses = `flex flex-col items-start gap-[5px] ${className}`.trim();
  const containerWidth = width || (responsive ? '100%' : '400px');

  const selectClasses = `
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
    appearance-none
    ${hasError || !!error ? 'border-red-500 focus:ring-red-400' : 'border-[#AEB2B1] hover:border-gray-400 focus:border-blue-500'}
  `.trim();

  const labelClasses = `
    ${responsive ? 'text-[15px] leading-[18px] sm:text-[15px] sm:leading-[18px]' : 'text-[15px] leading-[18px]'}
    font-semibold text-[#4D5151]
    ${hasError || !!error ? 'text-red-600' : ''}
    ${required ? 'after:content-["*"] after:text-red-500 after:ml-1' : ''}
  `.trim();

  const errorTextClasses = `${responsive ? 'text-xs sm:text-sm' : 'text-xs'} text-red-600 mt-1`;
  const helperTextClasses = `${responsive ? 'text-xs sm:text-sm' : 'text-xs'} text-gray-500 mt-1`;

  return (
    <div className={containerClasses} style={{ width: containerWidth, maxWidth: responsive ? '100%' : undefined }}>
      {label && <label className={labelClasses}>{label}</label>}

      <div className="relative w-full">
        <select
          ref={ref}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={selectClasses}
          {...props}
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <div className="pointer-events-none absolute right-4 top-1/2 transform -translate-y-1/2">
          <svg className="w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.585l3.71-3.354a.75.75 0 011.04 1.084l-4.25 3.834a.75.75 0 01-1.04 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {error && <span className={errorTextClasses}>{error}</span>}
      {!error && helperText && <span className={helperTextClasses}>{helperText}</span>}
    </div>
  );
});

SelectBox.displayName = 'SelectBox';
export default SelectBox;
