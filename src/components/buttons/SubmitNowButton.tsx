import { ButtonProps } from '../types';
import { getBlueColor, getWhiteColor } from '@/lib/colors';

const SubmitNowButton: React.FC<ButtonProps> = ({ 
  onClick, 
  disabled = false, 
  className = '', 
  children = 'Submit now',
  type = 'button'
}) => {
  const bgColor = disabled ? getBlueColor('default', 0.5) : getBlueColor('default');
  const hoverBgColor = getBlueColor('hover');
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-[510px] h-12 p-2.5 rounded-[10px] inline-flex justify-center items-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 ${className}`}
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
      <span className="justify-start text-base font-bold font-inter" style={{ color: getWhiteColor() }}>
        {children}
      </span>
    </button>
  );
};

export default SubmitNowButton;