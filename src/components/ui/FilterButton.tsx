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
      className={`lg:hidden flex items-center gap-2 px-3 py-2 bg-white border border-gray-neutral300 rounded-lg hover:border-gray-neutral400 transition-all duration-200 group ${className}`}
      aria-label="Open filters"
    >
      {/* Filter Icon */}
      <div className="relative">
        <RiFilterLine className="h-4 w-4 text-gray-neutral700 group-hover:text-primary-primary500 transition-colors" />
        
        {/* Active filter count badge */}
        {filterCount > 0 && (
          <div className="absolute -top-1.5 -right-1.5 bg-primary-primary500 text-white text-[10px] font-bold rounded-full h-3.5 w-3.5 flex items-center justify-center">
            {filterCount}
          </div>
        )}
      </div>

      {/* Label */}
      <span className="font-inter font-medium text-small text-gray-neutral700 group-hover:text-primary-primary500 transition-colors">
        Filter
      </span>
    </button>
  );
};

export default FilterButton;
