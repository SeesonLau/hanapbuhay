// components/buttons/CancelButton.tsx
import { ButtonProps } from '../types';
import { getGrayColor, getBlackColor } from '@/lib/colors';

const CancelButton: React.FC<ButtonProps> = ({ 
  onClick, 
  disabled = false, 
  className = '', 
  children = 'Cancel',
  type = 'button'
}) => {
  const bgColor = disabled ? getGrayColor('default', 0.5) : getGrayColor('default');
  const hoverBgColor = getGrayColor('hover');
  const borderColor = getGrayColor('border');
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-60 px-2.5 py-3 rounded-lg outline outline-1 outline-offset-[-1px] inline-flex justify-center items-center gap-2.5 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 ${className}`}
      style={{ 
        backgroundColor: bgColor,
        outlineColor: borderColor,
      }}
      onMouseOver={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = hoverBgColor;
        }
      }}
      onMouseOut={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = bgColor;
        }
      }}
    >
      <span className="text-lg font-semibold font-inter" style={{ color: getBlackColor() }}>
        {children}
      </span>
    </button>
  );
};

export default CancelButton;
