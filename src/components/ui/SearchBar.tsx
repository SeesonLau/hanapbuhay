'use client';
import React, { useState, useEffect, useRef } from 'react';
import { IoSearchOutline } from "react-icons/io5";
import { CiLocationOn } from "react-icons/ci";
import ClearIcon from '@/assets/x.svg';
import Button from './Button';
import { PHILIPPINES_LOCATIONS } from '@/resources/locations/philippines';
import { PostService } from '@/lib/services/posts-services';
import { useTheme } from '@/hooks/useTheme';

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
  const { theme } = useTheme();
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

  useEffect(() => {
    if (location.trim() && variant === 'advanced') {
      const locationInput = location.toLowerCase().trim();
      const suggestions: Array<{ type: 'province' | 'city'; name: string; parent?: string }> = [];
      
      PHILIPPINES_LOCATIONS.forEach((province) => {
        const provinceLower = province.name.toLowerCase();
        
        if (provinceLower.includes(locationInput) || provinceLower.startsWith(locationInput)) {
          suggestions.push({ type: 'province', name: province.name });
          province.cities.slice(0, 3).forEach((city) => {
            suggestions.push({ type: 'city', name: city.name, parent: province.name });
          });
        }
        
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

      const limitedSuggestions = suggestions.slice(0, 8);
      setLocationSuggestions(limitedSuggestions as any);
      onLocationSuggestionsChange?.(limitedSuggestions.map((s) => s.parent ? `${s.parent} > ${s.name}` : s.name));
      setShowLocationSuggestions(limitedSuggestions.length > 0);
    } else {
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);
    }
  }, [location, variant, onLocationSuggestionsChange]);

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
      
      const timeoutId = setTimeout(fetchSuggestions, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setQuerySuggestions([]);
      setShowQuerySuggestions(false);
    }
  }, [searchQuery, variant, onQuerySuggestionsChange]);

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

  const SearchIcon = () => (
    <IoSearchOutline 
      className="w-[18px] h-[18px] flex-shrink-0 transition-colors duration-300" 
      style={{ color: theme.colors.textMuted }}
    />
  );

  const LocationIcon = () => (
    <CiLocationOn 
      className="w-[18px] h-[18px] flex-shrink-0 transition-colors duration-300" 
      style={{ color: theme.colors.textMuted }}
    />
  );

  const handleClearQuery = () => {
    setSearchQuery('');
    onSearch?.('', variant === 'advanced' ? location : undefined);
  };

  const handleClearLocation = () => {
    setLocation('');
    onSearch?.(searchQuery, '');
  };

  if (variant === 'simple') {
    return (
      <div className={`w-full ${className}`}>
        <div 
          className="flex flex-row items-center justify-between rounded-full shadow-lg h-[48px] border transition-all duration-300"
          style={{
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.borderLight
          }}
        >
          {/* Search Input Section */}
          <div className="flex items-center gap-2 px-4 flex-1 min-w-0">
            <SearchIcon />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              className="text-small font-normal font-inter bg-transparent border-none outline-none flex-1 min-w-0 w-full transition-colors duration-300"
              style={{
                color: theme.colors.text,
              }}
              onFocus={(e) => {
                e.currentTarget.style.outline = 'none';
              }}
            />
            {searchQuery && (
              <button onClick={handleClearQuery} className="focus:outline-none">
                <img src={(ClearIcon as any).src} alt="Clear" className="w-4 h-4" />
              </button>
            )}
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
      <div 
        className="flex flex-row items-center justify-between rounded-full shadow-lg h-[48px] border transition-all duration-300"
        style={{
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.borderLight
        }}
      >
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
              className="text-small font-normal font-inter bg-transparent border-none outline-none flex-1 min-w-0 w-full transition-colors duration-300"
              style={{
                color: theme.colors.text,
              }}
            />
            {searchQuery && (
              <button onClick={handleClearQuery} className="focus:outline-none">
                <img src={(ClearIcon as any).src} alt="Clear" className="w-4 h-4" />
              </button>
            )}
            
            {/* Job Title Suggestions Dropdown */}
            {showQuerySuggestions && querySuggestions.length > 0 && (
              <div
                ref={queryDropdownRef}
                className="absolute top-full left-0 right-0 mt-2 rounded-lg shadow-lg z-50 max-h-[240px] overflow-y-auto transition-colors duration-300"
                style={{ 
                  minWidth: '280px',
                  backgroundColor: theme.colors.surface,
                  border: `1px solid ${theme.colors.borderLight}`
                }}
              >
                {querySuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setSearchQuery(suggestion);
                      setShowQuerySuggestions(false);
                    }}
                    className="px-4 py-2 cursor-pointer text-small transition-colors duration-300 border-b last:border-b-0"
                    style={{
                      color: theme.colors.text,
                      borderColor: theme.colors.borderLight
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = theme.colors.surfaceHover;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <IoSearchOutline 
                      className="inline w-4 h-4 mr-2" 
                      style={{ color: theme.colors.textMuted }}
                    />
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center px-2">
            <div 
              className="w-px h-8 transition-colors duration-300"
              style={{ backgroundColor: theme.colors.borderLight }}
            />
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
              className="text-small font-normal font-inter bg-transparent border-none outline-none flex-1 min-w-0 w-full transition-colors duration-300"
              style={{
                color: theme.colors.text,
              }}
            />
            {location && (
              <button onClick={handleClearLocation} className="focus:outline-none">
                <img src={(ClearIcon as any).src} alt="Clear" className="w-4 h-4" />
              </button>
            )}
            
            {/* Location Suggestions Dropdown */}
            {showLocationSuggestions && locationSuggestions.length > 0 && (
              <div
                ref={locationDropdownRef}
                className="absolute top-full left-0 right-0 mt-2 rounded-lg shadow-lg z-50 max-h-[280px] overflow-y-auto transition-colors duration-300"
                style={{ 
                  minWidth: '300px',
                  backgroundColor: theme.colors.surface,
                  border: `1px solid ${theme.colors.borderLight}`
                }}
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
                    className={`px-4 py-2 cursor-pointer text-small transition-colors duration-300 border-b last:border-b-0 ${
                      suggestion.type === 'city' ? 'pl-8' : ''
                    }`}
                    style={{
                      backgroundColor: suggestion.type === 'province' ? theme.colors.pastelBgLight : 'transparent',
                      color: suggestion.type === 'province' ? theme.colors.text : theme.colors.textSecondary,
                      fontWeight: suggestion.type === 'province' ? 600 : 400,
                      borderColor: theme.colors.borderLight
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = theme.colors.surfaceHover;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = suggestion.type === 'province' ? theme.colors.pastelBgLight : 'transparent';
                    }}
                  >
                    <CiLocationOn 
                      className="inline w-4 h-4 mr-2" 
                      style={{ color: theme.colors.textMuted }}
                    />
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