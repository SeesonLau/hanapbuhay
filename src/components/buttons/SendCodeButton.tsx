// components/buttons/SendCodeButton.tsx
import { ButtonProps } from '../types';
import { getBlueDarkColor, getWhiteColor } from '@/lib/colors';

const SendCodeButton: React.FC<ButtonProps> = ({ 
  onClick, 
  disabled = false, 
  className = '', 
  children = 'Send Code',
  type = 'button'
}) => {
  const bgColor = disabled ? getBlueDarkColor('default', 0.5) : getBlueDarkColor('default');
  const hoverBgColor = getBlueDarkColor('hover');
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-60 px-2.5 py-3 rounded-lg inline-flex justify-start items-center gap-2.5 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 ${className}`}
      style={{ 
        backgroundColor: bgColor,
      }}
      onMouseOver={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = hoverBgColor;
          e.currentTarget.style.justifyContent = 'space-between';
        }
      }}
      onMouseOut={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = bgColor;
          e.currentTarget.style.justifyContent = 'flex-start';
        }
      }}
    >
      <div className="flex-1 flex justify-center items-center gap-2.5">
        <span className="justify-start text-lg font-semibold font-inter" style={{ color: getWhiteColor() }}>
          {children}
        </span>
      </div>
    </button>
  );
};

export default SendCodeButton;