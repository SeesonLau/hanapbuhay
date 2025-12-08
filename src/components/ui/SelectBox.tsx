// src/components/ui/SelectBox.tsx
'use client';

import React, { forwardRef } from 'react';
import { useTheme } from '@/hooks/useTheme';

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
  placeholder?: string;
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
  placeholder,
  ...props
}, ref) => {
  const { theme } = useTheme();

  const containerClasses = `flex flex-col items-start gap-[5px] ${className}`.trim();
  const containerWidth = width || (responsive ? '100%' : '400px');

  const selectClasses = `
    w-full
    ${responsive ? 'h-10 sm:h-10' : 'h-10'}
    ${responsive ? 'px-4 py-1 sm:px-5 sm:py-2' : 'px-5 py-2'}
    border rounded-[10px] 
    ${responsive ? 'text-small sm:text-small' : 'text-small'}
    font-inter font-normal 
    transition-all duration-200
    focus:outline-none focus:ring-2
    disabled:cursor-not-allowed
    appearance-none
    ${responsive ? 'pr-9 sm:pr-9' : 'pr-9'}
  `.trim();

  const labelClasses = `
    ${responsive ? 'text-body sm:text-body' : 'text-body'}
    font-semibold font-inter
    ${required ? 'after:content-["*"] after:ml-1' : ''}
  `.trim();

  const errorTextClasses = `${responsive ? 'text-mini sm:text-tiny' : 'text-mini'} font-inter mt-1`;
  const helperTextClasses = `${responsive ? 'text-mini sm:text-tiny' : 'text-mini'} font-inter mt-1`;

  const selectStyle: React.CSSProperties = {
    backgroundColor: disabled ? theme.colors.backgroundSecondary : theme.colors.surface,
    borderColor: hasError || error ? theme.colors.error : theme.colors.border,
    color: theme.colors.text,
  };

  const labelStyle: React.CSSProperties = {
    color: hasError || error ? theme.colors.error : theme.colors.text,
  };

  const errorTextStyle: React.CSSProperties = {
    color: theme.colors.error,
  };

  const helperTextStyle: React.CSSProperties = {
    color: theme.colors.textMuted,
  };

  const iconStyle: React.CSSProperties = {
    color: theme.colors.textMuted,
  };

  return (
    <div className={containerClasses} style={{ width: containerWidth, maxWidth: responsive ? '100%' : undefined }}>
      {label && (
        <label className={labelClasses} style={labelStyle}>
          {label}
          {required && (
            <span style={{ color: theme.colors.error }}>*</span>
          )}
        </label>
      )}

      <div className="relative w-full">
        <select
          ref={ref}
          value={value ?? ''}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={selectClasses}
          style={selectStyle}
          {...props}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <div className="pointer-events-none absolute right-4 top-1/2 transform -translate-y-1/2">
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" style={iconStyle}>
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.585l3.71-3.354a.75.75 0 011.04 1.084l-4.25 3.834a.75.75 0 01-1.04 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {error && <span className={errorTextClasses} style={errorTextStyle}>{error}</span>}
      {!error && helperText && <span className={helperTextClasses} style={helperTextStyle}>{helperText}</span>}
    </div>
  );
});

SelectBox.displayName = 'SelectBox';
export default SelectBox;