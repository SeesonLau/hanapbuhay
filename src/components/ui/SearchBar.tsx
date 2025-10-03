'use client';
import React, { useState } from 'react';

interface SearchBarProps {
  variant?: 'simple' | 'advanced';
  onSearch?: (query: string, location?: string) => void;
  placeholder?: string;
  locationPlaceholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  variant = 'simple',
  onSearch,
  placeholder = 'Search',
  locationPlaceholder = 'Location',
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchQuery, variant === 'advanced' ? location : undefined);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Search Icon SVG Component
  const SearchIcon = () => (
    <svg 
      width="18" 
      height="18" 
      viewBox="0 0 25 25" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      <path 
        d="M21.25 21.25L16.6125 16.6125M19.25 10.75C19.25 15.4404 15.4404 19.25 10.75 19.25C6.05964 19.25 2.25 15.4404 2.25 10.75C2.25 6.05964 6.05964 2.25 10.75 2.25C15.4404 2.25 19.25 6.05964 19.25 10.75Z" 
        stroke="#AEB2B1" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );

  // Location Icon SVG Component
  const LocationIcon = () => (
    <svg 
      width="18" 
      height="18" 
      viewBox="0 0 25 25" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      <path 
        d="M21 10.5C21 17.5 12.5 23.5 12.5 23.5S4 17.5 4 10.5C4 6.35786 7.35786 3 11.5 3H13.5C17.6421 3 21 6.35786 21 10.5Z" 
        stroke="#AEB2B1" 
        strokeWidth="1" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M12.5 13.5C14.1569 13.5 15.5 12.1569 15.5 10.5C15.5 8.84315 14.1569 7.5 12.5 7.5C10.8431 7.5 9.5 8.84315 9.5 10.5C9.5 12.1569 10.8431 13.5 12.5 13.5Z" 
        stroke="#AEB2B1" 
        strokeWidth="1" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );

  if (variant === 'simple') {
    return (
      <div className={`w-full ${className}`}>
        <div className="flex flex-row items-center justify-between bg-white rounded-full shadow-lg h-[48px]">
          {/* Search Input Section */}
          <div className="flex items-center gap-2 px-4 flex-1 min-w-0">
            <SearchIcon />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              className="text-gray-neutral300 text-sm font-normal font-inter bg-transparent border-none outline-none flex-1 min-w-0 w-full"
            />
          </div>

          {/* Search Button */}
          <button
          onClick={handleSearch}
          className="flex items-center justify-center py-2 bg-[#3289FF] hover:bg-[#1453E1] rounded-full transition-colors duration-200 min-w-[100px] h-[36px] mr-2 flex-shrink-0"
        >
          <span className="text-white text-sm font-inter font-semibold">
            Search
          </span>
        </button>
        </div>
      </div>
    );
  }

  // Advanced variant with job title and location
  return (
    <div className={`w-full ${className}`}>
      <div className="flex flex-row items-center justify-between bg-white rounded-full shadow-lg h-[48px]">
        {/* Content Container */}
        <div className="flex flex-row items-center flex-1 min-w-0">
          {/* Job Title/Keyword Input */}
          <div className="flex items-center gap-2 px-4 flex-1 min-w-0">
            <SearchIcon />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              className="text-gray-neutral300 text-sm font-normal font-inter bg-transparent border-none outline-none flex-1 min-w-0 w-full"
            />
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center px-2">
            <div className="w-px h-8 bg-gray-300"></div>
          </div>

          {/* Location Input */}
          <div className="flex items-center gap-2 px-4 flex-1 min-w-0">
            <LocationIcon />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={locationPlaceholder}
              className="text-gray-neutral300 text-sm font-normal font-inter bg-transparent border-none outline-none flex-1 min-w-0 w-full"
            />
          </div>
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="flex items-center justify-center py-2 bg-[#3289FF] hover:bg-[#1453E1] rounded-full transition-colors duration-200 min-w-[100px] h-[36px] mr-2 flex-shrink-0"
        >
          <span className="text-white text-sm font-inter font-semibold">
            Search
          </span>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;