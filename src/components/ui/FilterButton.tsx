import React from 'react';
import { RiFilterLine } from "react-icons/ri";
import { useTheme } from '@/hooks/useTheme';

export interface FilterButtonProps {
  onClick: () => void;
  filterCount?: number;
  className?: string;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  onClick,
  filterCount = 0,
  className = '',
}) => {
  const { theme } = useTheme();

  return (
    <button
      onClick={onClick}
      className={`lg:hidden flex items-center gap-1.5 mobile-M:gap-2 px-2 mobile-M:px-3 py-1.5 mobile-M:py-2 rounded-lg transition-all duration-300 group ${className}`}
      style={{
        backgroundColor: theme.colors.surface,
        border: `1px solid ${theme.colors.borderLight}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = theme.colors.border;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = theme.colors.borderLight;
      }}
      aria-label="Open filters"
    >
      {/* Filter Icon */}
      <div className="relative">
        <RiFilterLine 
          className="h-3.5 w-3.5 mobile-M:h-4 mobile-M:w-4 transition-colors duration-300" 
          style={{ color: theme.colors.textSecondary }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = theme.colors.primary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = theme.colors.textSecondary;
          }}
        />
        
        {/* Active filter count badge */}
        {filterCount > 0 && (
          <div 
            className="absolute -top-1.5 -right-1.5 text-[10px] font-bold rounded-full h-3.5 w-3.5 flex items-center justify-center transition-colors duration-300"
            style={{
              backgroundColor: theme.colors.primary,
              color: '#FFFFFF'
            }}
          >
            {filterCount}
          </div>
        )}
      </div>

      {/* Label */}
      <span 
        className="font-inter font-medium text-tiny mobile-M:text-small transition-colors duration-300"
        style={{ color: theme.colors.textSecondary }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = theme.colors.primary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = theme.colors.textSecondary;
        }}
      >
        Filter
      </span>
    </button>
  );
};

export default FilterButton;