'use client';
import React, { useState, useEffect, useRef } from 'react';
import { IoSearchOutline } from "react-icons/io5";
import { CiLocationOn } from "react-icons/ci";
import Button from './Button';
import { searchLocations, PHILIPPINES_LOCATIONS } from '@/lib/constants/philippines-locations';
import { PostService } from '@/lib/services/posts-services';

interface SearchBarProps {
  variant?: 'simple' | 'advanced';
  onSearch?: (query: string, location?: string) => void;
  placeholder?: string;
  locationPlaceholder?: string;
  className?: string;
  onQuerySuggestionsChange?: (suggestions: string[]) => void;
  onLocationSuggestionsChange?: (suggestions: string[]) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  variant = 'simple',
  onSearch,
  placeholder = 'Search',
  locationPlaceholder = 'Location',
  className = '',
  onQuerySuggestionsChange,
  onLocationSuggestionsChange
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [querySuggestions, setQuerySuggestions] = useState<string[]>([]);
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [showQuerySuggestions, setShowQuerySuggestions] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const queryInputRef = useRef<HTMLInputElement>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const queryDropdownRef = useRef<HTMLDivElement>(null);
  const locationDropdownRef = useRef<HTMLDivElement>(null);

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchQuery, variant === 'advanced' ? location : undefined);
    }
    setShowQuerySuggestions(false);
    setShowLocationSuggestions(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Update location suggestions as user types
  useEffect(() => {
    if (location.trim() && variant === 'advanced') {
      const locationInput = location.toLowerCase().trim();
      
      // Find matching provinces and cities
      const suggestions: Array<{ type: 'province' | 'city'; name: string; parent?: string }> = [];
      
      PHILIPPINES_LOCATIONS.forEach((province) => {
        const provinceLower = province.name.toLowerCase();
        
        // If input matches province name, show all cities under it
        if (provinceLower.includes(locationInput) || provinceLower.startsWith(locationInput)) {
          suggestions.push({ type: 'province', name: province.name });
          // Add cities under this province
          province.cities.slice(0, 3).forEach((city) => {
            suggestions.push({ type: 'city', name: city.name, parent: province.name });
          });
        }
        
        // Also search for matching cities
        province.cities.forEach((city) => {
          const cityLower = city.name.toLowerCase();
          if (cityLower.includes(locationInput) || cityLower.startsWith(locationInput)) {
            const cityKey = `${province.name} > ${city.name}`;
            if (!suggestions.some((s) => s.type === 'city' && s.name === city.name && s.parent === province.name)) {
              suggestions.push({ type: 'city', name: city.name, parent: province.name });
            }
          }
        });
      });

      // Limit to 8 suggestions total
      const limitedSuggestions = suggestions.slice(0, 8);
      setLocationSuggestions(limitedSuggestions as any);
      onLocationSuggestionsChange?.(limitedSuggestions.map((s) => s.parent ? `${s.parent} > ${s.name}` : s.name));
      setShowLocationSuggestions(limitedSuggestions.length > 0);
    } else {
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);
    }
  }, [location, variant, onLocationSuggestionsChange]);

  // Update job title suggestions as user types
  useEffect(() => {
    if (searchQuery.trim() && variant === 'advanced') {
      const fetchSuggestions = async () => {
        try {
          const suggestions = await PostService.getJobTitleSuggestions(searchQuery);
          setQuerySuggestions(suggestions);
          onQuerySuggestionsChange?.(suggestions);
          setShowQuerySuggestions(suggestions.length > 0);
        } catch (err) {
          // Silently handle error
        }
      };
      
      // Debounce to avoid too many requests
      const timeoutId = setTimeout(fetchSuggestions, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setQuerySuggestions([]);
      setShowQuerySuggestions(false);
    }
  }, [searchQuery, variant, onQuerySuggestionsChange]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (queryDropdownRef.current && !queryDropdownRef.current.contains(event.target as Node)) {
        setShowQuerySuggestions(false);
      }
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target as Node)) {
        setShowLocationSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
              className="text-gray-neutral800 placeholder:text-gray-neutral400 text-small font-normal font-inter bg-transparent border-none outline-none flex-1 min-w-0 w-full transition-colors duration-150"
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
    <div className={`w-full relative ${className}`}>
      <div className="flex flex-row items-center justify-between bg-white rounded-full shadow-lg h-[48px] border border-gray-neutral200">
        {/* Content Container */}
        <div className="flex flex-row items-center flex-1 min-w-0">
          {/* Job Title/Keyword Input */}
          <div className="flex items-center gap-2 px-4 flex-1 min-w-0 relative">
            <SearchIcon />
            <input
              ref={queryInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                // Show suggestions if there's text
                if (e.target.value.trim()) {
                  setShowQuerySuggestions(true);
                } else {
                  setShowQuerySuggestions(false);
                }
              }}
              onFocus={() => {
                if (searchQuery.trim()) setShowQuerySuggestions(true);
              }}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              className="text-gray-neutral800 placeholder:text-gray-neutral400 text-small font-normal font-inter bg-transparent border-none outline-none flex-1 min-w-0 w-full transition-colors duration-150"
            />
            
            {/* Job Title Suggestions Dropdown */}
            {showQuerySuggestions && querySuggestions.length > 0 && (
              <div
                ref={queryDropdownRef}
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-neutral200 rounded-lg shadow-lg z-50 max-h-[240px] overflow-y-auto"
                style={{ minWidth: '280px' }}
              >
                {querySuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setSearchQuery(suggestion);
                      setShowQuerySuggestions(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-neutral100 cursor-pointer text-gray-neutral800 text-small transition-colors border-b border-gray-neutral100 last:border-b-0"
                  >
                    <IoSearchOutline className="inline w-4 h-4 mr-2 text-gray-neutral400" />
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center px-2">
            <div className="w-px h-8 bg-gray-neutral300"></div>
          </div>

          {/* Location Input */}
          <div className="flex items-center gap-2 px-4 flex-1 min-w-0 relative">
            <LocationIcon />
            <input
              ref={locationInputRef}
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onFocus={() => {
                if (location.trim()) setShowLocationSuggestions(true);
              }}
              onKeyPress={handleKeyPress}
              placeholder={locationPlaceholder}
              className="text-gray-neutral800 placeholder:text-gray-neutral400 text-small font-normal font-inter bg-transparent border-none outline-none flex-1 min-w-0 w-full transition-colors duration-150"
            />
            
            {/* Location Suggestions Dropdown */}
            {showLocationSuggestions && locationSuggestions.length > 0 && (
              <div
                ref={locationDropdownRef}
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-neutral200 rounded-lg shadow-lg z-50 max-h-[280px] overflow-y-auto"
                style={{ minWidth: '300px' }}
              >
                {(locationSuggestions as any).map((suggestion: any, index: number) => (
                  <div
                    key={index}
                    onClick={() => {
                      const displayValue = suggestion.parent 
                        ? `${suggestion.parent} > ${suggestion.name}`
                        : suggestion.name;
                      setLocation(displayValue);
                      setShowLocationSuggestions(false);
                    }}
                    className={`px-4 py-2 cursor-pointer text-small transition-colors border-b border-gray-neutral100 last:border-b-0 ${
                      suggestion.type === 'province'
                        ? 'bg-gray-neutral50 hover:bg-gray-neutral100 font-semibold text-gray-neutral800'
                        : 'hover:bg-gray-neutral100 text-gray-neutral700 pl-8'
                    }`}
                  >
                    <CiLocationOn className="inline w-4 h-4 mr-2 text-gray-neutral400" />
                    {suggestion.type === 'province' && suggestion.name}
                    {suggestion.type === 'city' && suggestion.name}
                  </div>
                ))}
              </div>
            )}
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