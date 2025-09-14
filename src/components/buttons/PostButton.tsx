import { ButtonProps } from '../types';
import { getBlueDarkColor, getWhiteColor } from '@/lib/colors';

interface PostButtonProps extends ButtonProps {
  size?: 'small' | 'large';
}

const PostButton: React.FC<PostButtonProps> = ({ 
  onClick, 
  disabled = false, 
  className = '', 
  children = 'Post',
  type = 'button',
  size = 'small'
}) => {
  const bgColor = disabled ? getBlueDarkColor('default', 0.5) : getBlueDarkColor('default');
  const hoverBgColor = getBlueDarkColor('hover');
  
  const baseClasses = size === 'small' 
    ? 'w-40 h-14 rounded-[50px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.25)]'
    : 'w-[500px] h-14 rounded-[20px]';
    
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex justify-center items-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 ${baseClasses} ${className}`}
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
      <span className={`justify-start font-bold font-inter ${size === 'small' ? 'text-3xl' : 'text-2xl'}`} style={{ color: getWhiteColor() }}>
        {children}
      </span>
    </button>
  );
};

export default PostButton;