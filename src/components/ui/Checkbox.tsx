import React, { forwardRef, useId, useState, useEffect } from 'react';
import { ImCheckboxChecked, ImCheckboxUnchecked } from "react-icons/im";
import { useTheme } from '@/hooks/useTheme';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size'> {
  label?: string;
  checked?: boolean; 
  defaultChecked?: boolean; 
  onChange?: (checked: boolean, e?: React.ChangeEvent<HTMLInputElement>) => void;
  size?: 'sm' | 'md' | 'lg';
  responsive?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { icon: 'w-4 h-4', text: 'text-small font-inter px-3 py-1' },
  md: { icon: 'w-5 h-5', text: 'text-small font-inter px-4 py-1' },
  lg: { icon: 'w-6 h-6', text: 'text-body font-inter px-4 py-2' }
};

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>((props, ref) => {
  const {
    label,
    checked: controlledChecked,
    defaultChecked,
    onChange,
    id,
    name,
    disabled = false,
    size = 'md',
    responsive = true,
    className = '',
    ...rest
  } = props;

  const { theme } = useTheme();
  const autoId = useId();
  const inputId = id || `checkbox-${autoId}`;

  const isControlled = controlledChecked !== undefined;
  const [internalChecked, setInternalChecked] = useState<boolean>(Boolean(defaultChecked));

  useEffect(() => {
    if (isControlled) return;
    setInternalChecked(Boolean(defaultChecked));
  }, [defaultChecked, isControlled]);

  const checked = isControlled ? Boolean(controlledChecked) : internalChecked;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked;
    if (!isControlled) setInternalChecked(newChecked);
    onChange?.(newChecked, e);
  };

  const s = sizeMap[size] || sizeMap.md;

  return (
    <label
      htmlFor={inputId}
      className={`inline-flex items-center gap-1 select-none ${responsive ? 'w-full sm:w-auto' : ''} ${className}`}
    >
      <div
        className={`flex items-center w-full px-3 py-1 gap-1 transition-colors duration-300 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        {/* Visual checkbox */}
        <div
          aria-hidden
          className={`flex items-center justify-center transition-all duration-300 ${s.icon}`}
        >
          {checked ? (
            <ImCheckboxChecked
              className={`${s.icon} transition-all duration-300`}
              style={{
                color: disabled ? theme.colors.borderLight : theme.colors.primary
              }}
            />
          ) : (
            <ImCheckboxUnchecked
              className={`${s.icon} transition-all duration-300`}
              style={{
                color: disabled ? theme.colors.borderLight : theme.colors.textMuted
              }}
            />
          )}
        </div>

        {/* Text label */}
        <span 
          className={`${s.text} font-normal transition-colors duration-300`}
          style={{
            color: disabled ? theme.colors.textMuted : theme.colors.textSecondary
          }}
        >
          {label}
        </span>

        {/* Hidden native checkbox for accessibility */}
        <input
          ref={ref}
          id={inputId}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className="sr-only"
          {...rest}
        />
      </div>
    </label>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;