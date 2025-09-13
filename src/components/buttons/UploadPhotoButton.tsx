// components/buttons/UploadPhotoButton.tsx
import { ButtonProps } from '../types';
import { getBlueColor, getWhiteColor } from '@/lib/colors';
import { FaUpload } from 'react-icons/fa';

const UploadPhotoButton: React.FC<ButtonProps> = ({ 
  onClick, 
  disabled = false, 
  className = '', 
  children = 'Upload Photo',
  type = 'button'
}) => {
  const bgColor = disabled ? getBlueColor('default', 0.5) : getBlueColor('default');
  const hoverBgColor = getBlueColor('hover');
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-36 h-6 rounded-[50px] inline-flex justify-center items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 ${className}`}
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
      <FaUpload className="text-white" size={12} />
      <span className="justify-start text-xs font-semibold font-inter" style={{ color: getWhiteColor() }}>
        {children}
      </span>
    </button>
  );
};

export default UploadPhotoButton;