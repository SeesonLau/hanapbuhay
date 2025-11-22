import React from 'react';
import { RiFilterLine } from "react-icons/ri";

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
  return (
    <button
      onClick={onClick}
      className={`lg:hidden flex items-center gap-1.5 mobile-M:gap-2 px-2 mobile-M:px-3 py-1.5 mobile-M:py-2 bg-white border border-gray-neutral300 rounded-lg hover:border-gray-neutral400 transition-all duration-200 group ${className}`}
      aria-label="Open filters"
    >
      {/* Filter Icon */}
      <div className="relative">
        <RiFilterLine className="h-3.5 w-3.5 mobile-M:h-4 mobile-M:w-4 text-gray-neutral700 group-hover:text-primary-primary500 transition-colors" />
        
        {/* Active filter count badge */}
        {filterCount > 0 && (
          <div className="absolute -top-1.5 -right-1.5 bg-primary-primary500 text-white text-[10px] font-bold rounded-full h-3.5 w-3.5 flex items-center justify-center">
            {filterCount}
          </div>
        )}
      </div>

      {/* Label */}
      <span className="font-inter font-medium text-tiny mobile-M:text-small text-gray-neutral700 group-hover:text-primary-primary500 transition-colors">
        Filter
      </span>
    </button>
  );
};

export default FilterButton;
