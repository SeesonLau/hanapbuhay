'use client';

import React from 'react';
import HeaderDashboard from './HeaderDashboard';
import SearchBar from './SearchBar';
import Button from './Button';
import { fontClasses } from '@/styles/fonts';

interface BannerProps {
  variant: 'findJobs' | 'manageJobPosts' | 'appliedJobs' | 'chat' | 'profile' | 'settings';
  userName?: string;
  userAvatar?: string;
  userEmail?: string;
  userRole?: string;
  userId?: string;
  userCreatedAt?: string;
  notificationCount?: number;
  onSearch?: (query: string, location?: string) => void;
  searchPlaceholder?: string;
  locationPlaceholder?: string;
  showSearchBar?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const Banner: React.FC<BannerProps> = ({
  variant,
  userName,
  userAvatar,
  userEmail,
  userRole,
  userId,
  userCreatedAt,
  notificationCount,
  onSearch,
  searchPlaceholder,
  locationPlaceholder,
  showSearchBar = true,
  className = '',
  children
}) => {
  // Define banner content based on variant
  const getBannerContent = () => {
    switch (variant) {
      case 'findJobs':
        return {
          title: 'Find your Ideal Job at',
          highlight: 'HanapBuhay',
          searchVariant: 'advanced' as const,
          searchPlaceholder: searchPlaceholder || 'Job title or keyword',
          locationPlaceholder: locationPlaceholder || 'Location'
        };
      case 'manageJobPosts':
        return {
          title: 'Need a',
          highlight: 'Work',
          subtitle: 'done? Post a',
          subtitleHighlight: 'Job',
          endText: 'now!',
          searchVariant: 'simple' as const,
          searchPlaceholder: searchPlaceholder || 'Search',
          showPostButton: true
        };
      case 'appliedJobs':
        return {
          title: 'Track down your',
          highlight: 'Job Applications',
          searchVariant: 'simple' as const,
          searchPlaceholder: searchPlaceholder || 'Search'
        };
      case 'chat':
        return {
          title: 'Chat with',
          highlight: 'Clients',
          subtitle: 'and',
          subtitleHighlight: 'Workers',
          searchVariant: 'simple' as const,
          searchPlaceholder: searchPlaceholder || 'Search',
          showSearchBar: false
        };
      case 'profile':
        return {
          title: 'Customize your',
          highlight: 'Profile',
          searchVariant: 'simple' as const,
          searchPlaceholder: searchPlaceholder || 'Search',
          showSearchBar: false
        };
      case 'settings':
        return {
          title: 'Settings Page',
          searchVariant: 'simple' as const,
          searchPlaceholder: searchPlaceholder || 'Search',
          showSearchBar: false
        };
      default:
        return {
          title: 'Welcome to',
          highlight: 'HanapBuhay',
          searchVariant: 'simple' as const,
          searchPlaceholder: searchPlaceholder || 'Search'
        };
    }
  };

  const bannerContent = getBannerContent();
  const shouldShowSearch = showSearchBar && (bannerContent.showSearchBar !== false);

  return (
    <div 
      className={`w-full ${fontClasses.body} ${className}`}
      style={{ 
        background: 'radial-gradient(55% 45% at 50% 70%, #666666 0%, #000000 80.77%)'
      }}
    >
      {/* Header Dashboard */}
      <HeaderDashboard
        userName={userName}
        userAvatar={userAvatar}
        userEmail={userEmail}
        userRole={userRole}
        userId={userId}
        userCreatedAt={userCreatedAt}
        notificationCount={notificationCount}
      />

      {/* Banner Content */}
      <div className="flex flex-col px-4 sm:px-4 md:px-6 lg:px-8 pt-12 sm:pt-14 md:pt-16 lg:pt-28 pb-4 sm:pb-4 md:pb-6 lg:pb-8 max-w-7xl mx-auto w-full">
        {/* Banner Text - Left Aligned */}
        <div className="text-left mb-4 sm:mb-4 md:mb-5 lg:mb-6 w-full">
          <h1 className="text-h3 sm:text-body md:text-body lg:text-lead xl:text-lead font-bold text-white leading-tight">
            {bannerContent.title}{' '}
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              {bannerContent.highlight}
            </span>
            {bannerContent.subtitle && (
              <>
                {' '}{bannerContent.subtitle}{' '}
                <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  {bannerContent.subtitleHighlight}
                </span>
              </>
            )}
            {bannerContent.endText && (
              <> {bannerContent.endText}</>
            )}
            {/* Post Button for Manage Job Posts - Inline with text */}
            {bannerContent.showPostButton && (
              <Button
                variant="primary"
                size="sm"
                fullRounded={true}
                className="ml-2"
              >
                Post
              </Button>
            )}
          </h1>
        </div>

        {/* Search Bar - Full Width and Left Aligned */}
        {shouldShowSearch && (
          <div className="w-full">
            <SearchBar
              variant={bannerContent.searchVariant}
              onSearch={onSearch}
              placeholder={bannerContent.searchPlaceholder}
              locationPlaceholder={bannerContent.locationPlaceholder}
              className="w-full"
            />
          </div>
        )}

        {/* Custom Children Content */}
        {children && (
          <div className="w-full max-w-6xl mx-auto mt-6 sm:mt-8 md:mt-10 lg:mt-12">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default Banner;