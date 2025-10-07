import React, { forwardRef, useId, useState, useEffect } from 'react';
import { ImCheckboxChecked, ImCheckboxUnchecked } from "react-icons/im";

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
    // Reset hover state after change to prevent sticky hover
    setIsHover(false);
  };

  const s = sizeMap[size] || sizeMap.md;
  const [isHover, setIsHover] = useState(false);
  const [isFocus, setIsFocus] = useState(false);

  return (
    <label
      htmlFor={inputId}
      className={`inline-flex items-center gap-1 select-none ${responsive ? 'w-full sm:w-auto' : ''} ${className}`}
    >
      <div
        onMouseEnter={() => !disabled && setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        onClick={() => {
          // Reset hover state on click to prevent sticky hover
          setTimeout(() => setIsHover(false), 0);
        }}
        className={`flex items-center w-full px-5 py-1 gap-1 transition-colors duration-150 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        style={{
          transform: isHover || isFocus ? 'scale(1.06)' : 'scale(1)',
          transitionProperty: 'transform, background-color, border-color',
          transitionDuration: '150ms'
        }}
      >
        {/* Visual checkbox */}
        <div
          aria-hidden
          className={`flex items-center justify-center transition-all duration-150 ${s.icon}`}
        >
          {checked ? (
            <ImCheckboxChecked 
              className={`${s.icon} transition-all duration-150 ${
                disabled 
                  ? 'text-gray-neutral300' 
                  : isHover 
                    ? 'text-primary-primary600' 
                    : 'text-primary-primary500'
              }`}
            />
          ) : (
            <ImCheckboxUnchecked 
              className={`${s.icon} transition-all duration-150 ${
                disabled 
                  ? 'text-gray-neutral300' 
                  : isHover 
                    ? 'text-gray-neutral500' 
                    : 'text-gray-neutral400'
              }`}
            />
          )}
        </div>

    {/* Text label */}
    <span className={`${s.text} font-normal text-gray-neutral600 ${disabled ? 'text-gray-neutral400' : ''}`}>{label}</span>

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
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          {...rest}
        />
      </div>
    </label>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;
