'use client';
import React, { useState } from 'react';
import { IoSearchOutline } from "react-icons/io5";
import { CiLocationOn } from "react-icons/ci";
import Button from './Button';

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

  // Search Icon Component
  const SearchIcon = () => (
    <IoSearchOutline className="w-[18px] h-[18px] text-gray-neutral400 flex-shrink-0" />
  );

  // Location Icon Component
  const LocationIcon = () => (
    <CiLocationOn className="w-[18px] h-[18px] text-gray-neutral400 flex-shrink-0" />
  );

  if (variant === 'simple') {
    return (
      <div className={`w-full ${className}`}>
        <div className="flex flex-row items-center justify-between bg-white rounded-full shadow-lg h-[48px] border border-gray-neutral200">
          {/* Search Input Section */}
          <div className="flex items-center gap-2 px-4 flex-1 min-w-0">
            <SearchIcon />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              className="text-gray-neutral800 placeholder:text-gray-neutral400 text-small font-inter font-inter bg-transparent border-none outline-none flex-1 min-w-0 w-full focus:placeholder:text-gray-neutral300 transition-colors duration-150"
            />
          </div>

          {/* Search Button */}
          <div className="mr-2">
            <Button
              onClick={handleSearch}
              variant="primary"
              size="sm"
              fullRounded={true}
              className="h-[36px] min-w-[100px]"
            >
              Search
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Advanced variant with job title and location
  return (
    <div className={`w-full ${className}`}>
      <div className="flex flex-row items-center justify-between bg-white rounded-full shadow-lg h-[48px] border border-gray-neutral200">
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
              className="text-gray-neutral800 placeholder:text-gray-neutral400 text-small font-inter font-inter bg-transparent border-none outline-none flex-1 min-w-0 w-full focus:placeholder:text-gray-neutral300 transition-colors duration-150"
            />
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center px-2">
            <div className="w-px h-8 bg-gray-neutral300"></div>
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
              className="text-gray-neutral800 placeholder:text-gray-neutral400 text-small font-inter font-inter bg-transparent border-none outline-none flex-1 min-w-0 w-full focus:placeholder:text-gray-neutral300 transition-colors duration-150"
            />
          </div>
        </div>

        {/* Search Button */}
        <div className="mr-2">
          <Button
            onClick={handleSearch}
            variant="primary"
            size="sm"
            fullRounded={true}
            className="h-[36px] min-w-[100px]"
          >
            Search
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;