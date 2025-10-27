import React from 'react';

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
      className={`lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-neutral300 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 group ${className}`}
      aria-label="Open filters"
    >
      {/* Filter Icon */}
      <div className="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-neutral700 group-hover:text-primary-primary500 transition-colors"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        
        {/* Active filter count badge */}
        {filterCount > 0 && (
          <div className="absolute -top-2 -right-2 bg-primary-primary500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
            {filterCount}
          </div>
        )}
      </div>

      {/* Label */}
      <span className="font-inter font-medium text-body text-gray-neutral700 group-hover:text-primary-primary500 transition-colors">
        Filter
      </span>

      {/* Chevron */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 text-gray-neutral500 group-hover:text-primary-primary500 transition-colors"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </button>
  );
};

export default FilterButton;
