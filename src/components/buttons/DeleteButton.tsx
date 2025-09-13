import { ButtonProps } from '../types';
import { getRedColor, getWhiteColor } from '@/lib/colors';
import { FaTrash } from 'react-icons/fa';

const DeleteButton: React.FC<ButtonProps> = ({ 
  onClick, 
  disabled = false, 
  className = '', 
  children = 'Delete',
  type = 'button'
}) => {
  const bgColor = disabled ? getRedColor('default', 0.5) : getRedColor('default');
  const hoverBgColor = getRedColor('hover');
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-32 h-12 rounded-[10px] inline-flex justify-center items-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 ${className}`}
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
      <FaTrash className="text-white" size={16} />
      <span className="justify-start text-xl font-semibold font-inter" style={{ color: getWhiteColor() }}>
        {children}
      </span>
    </button>
  );
};

export default DeleteButton;