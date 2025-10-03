import React, { forwardRef, useId, useState, useEffect } from 'react';
import { getGrayColor, getBlueDarkColor, getWhiteColor, getNeutral400Color, getTypographyClass, getTypographyStyle } from '@/styles';

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
  sm: { box: 'w-4 h-4', text: 'text-sm px-3 py-1' },
  md: { box: 'w-5 h-5', text: 'text-sm px-4 py-1' },
  lg: { box: 'w-6 h-6', text: 'text-base px-4 py-2' }
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
  };

  const s = sizeMap[size] || sizeMap.md;
  const [isHover, setIsHover] = useState(false);
  const [isFocus, setIsFocus] = useState(false);

  return (
    <label
      htmlFor={inputId}
      className={`inline-flex items-center gap-3 select-none ${responsive ? 'w-full sm:w-auto' : ''} ${className}`}
    >
      <div
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        className={`flex items-center w-full px-5 py-1 gap-3 transition-colors duration-150 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        style={{
          transform: isHover || isFocus ? 'scale(1.06)' : 'scale(1)',
          transitionProperty: 'transform, background-color, border-color',
          transitionDuration: '150ms'
        }}
      >
        {/* Visual checkbox */}
        <div
          aria-hidden
          className={`flex items-center justify-center transition-colors duration-150 ${s.box} rounded-sm`}
          style={{
            background: disabled ? getGrayColor('neutral100') : (checked ? getBlueDarkColor('default') : (isHover ? getGrayColor('default') : getWhiteColor())),
            border: `1px solid ${disabled ? getGrayColor('neutral100') : (checked ? getBlueDarkColor('default') : getNeutral400Color())}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[14px] h-[14px] text-white" style={{
            opacity: checked ? 1 : 0,
            transform: checked ? 'scale(1)' : 'scale(0.8)',
            transition: 'opacity 150ms, transform 150ms'
          }}>
            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

    {/* Text label */}
    <span className={`${s.text} font-normal ${getTypographyClass('small')}`} style={{ color: getGrayColor('neutral600') }}>{label}</span>

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
