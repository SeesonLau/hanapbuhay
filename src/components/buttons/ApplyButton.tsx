import { ButtonProps } from '../types';
import { getBlueColor, getWhiteColor } from '@/lib/colors';

const ApplyButton: React.FC<ButtonProps> = ({ 
  onClick, 
  disabled = false, 
  className = '', 
  children = 'Apply Now',
  type = 'button'
}) => {
  const bgColor = disabled ? getBlueColor('default', 0.5) : getBlueColor('default');
  const hoverBgColor = getBlueColor('hover');
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-24 h-8 rounded-[5px] inline-flex justify-center items-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 ${className}`}
      style={{ 
        backgroundColor: bgColor,
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
      <span className="justify-start text-xs font-semibold font-inter" style={{ color: getWhiteColor() }}>
        {children}
      </span>
    </button>
  );
};

export default ApplyButton;