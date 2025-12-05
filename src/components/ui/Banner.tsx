'use client';

import React from 'react';
import HeaderDashboard from './HeaderDashboard';
import SearchBar from './SearchBar';
import Button from './Button';
import BannerParticles from '@/components/animations/BannerParticles';

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
  onPostClick?: () => void;
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
  children,
  onPostClick
}) => {

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
      className={`w-full h-[200px] font-inter fixed top-0 left-0 right-0 z-50 pointer-events-none bg-gradient-to-br from-black via-slate-900 to-blue-950 ${className}`}
    >
      {/* Particles Background - CSS-based particles spread across entire banner */}
      <div className="absolute inset-0 overflow-hidden">
        <BannerParticles particleCount={25} />
      </div>

      {/* Header Dashboard */}
      <div className="pointer-events-auto relative z-10">
      <HeaderDashboard
        userName={userName}
        userAvatar={userAvatar}
        userEmail={userEmail}
        userRole={userRole}
        userId={userId}
        userCreatedAt={userCreatedAt}
      />
      </div>

      {/* Banner Content Container - Left-aligned structure */}
      <div className="flex flex-col py-3 px-4 md:px-6 laptop:px-32 w-full h-full relative z-10">
        {/* Banner Text Section - Left-aligned typography and spacing */}
        <div className={`text-start mb-1 w-full ${variant === 'profile' || variant === 'chat' ? 'mt-3 sm:mt-4' : 'mt-0'} pointer-events-none`}>
          <h1 className="text-body sm:text-body md:text-description lg:text-lead font-bold font-alexandria text-white leading-tight mb-1.5 sm:mb-2">
            {bannerContent.title}{' '}
            <span className="bg-gradient-to-r from-primary-primary400 to-primary-primary600 bg-clip-text text-transparent">
              {bannerContent.highlight}
            </span>
            {bannerContent.subtitle && (
              <>
                {' '}{bannerContent.subtitle}{' '}
                <span className="bg-gradient-to-r from-primary-primary400 to-primary-primary600 bg-clip-text text-transparent">
                  {bannerContent.subtitleHighlight}
                </span>
              </>
            )}
            {bannerContent.endText && (
              <> {bannerContent.endText}</>
            )}
            {/* Post Button for Manage Job Posts - Inline with text */}
            {bannerContent.showPostButton && (
              <span className="hidden laptop:inline-block ml-3 align-middle pointer-events-auto">
                <Button
                  variant="primary"
                  size="sm"
                  fullRounded={true}
                  className="px-4 py-1 text-sm"
                  onClick={onPostClick}
                >
                  Post
                </Button>
              </span>
            )}
          </h1>
        </div>

        {/* Search Bar Section - Full width and left-aligned (hidden for profile and chat variants) */}
        {variant !== 'profile' && variant !== 'chat' && (
          <div className="w-full flex items-center pointer-events-auto">
            {shouldShowSearch && (
              <SearchBar
                variant={bannerContent.searchVariant}
                onSearch={onSearch}
                placeholder={bannerContent.searchPlaceholder}
                locationPlaceholder={bannerContent.locationPlaceholder}
                className="w-full"
              />
            )}
          </div>
        )}

        {/* Custom Children Content */}
        {children && (
          <div className="w-full max-w-4xl mx-auto mt-3">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default Banner;
