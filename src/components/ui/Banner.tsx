'use client';

import React from 'react';
import HeaderDashboard from './HeaderDashboard';
import SearchBar from './SearchBar';
import Button from './Button';
import BannerParticles from '@/components/animations/BannerParticles';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/hooks/useLanguage';

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
  const { theme } = useTheme();
  const { t } = useLanguage();

  const getBannerContent = () => {
    switch (variant) {
      case 'findJobs':
        return {
          title: t.jobs.findJobs.banner.title,
          highlight: t.jobs.findJobs.banner.highlight,
          searchVariant: 'advanced' as const,
          searchPlaceholder: searchPlaceholder || t.jobs.findJobs.banner.searchPlaceholder,
          locationPlaceholder: locationPlaceholder || t.jobs.findJobs.banner.locationPlaceholder
        };
      case 'manageJobPosts':
        return {
          title: t.jobs.manageJobPosts.banner.title,
          highlight: t.jobs.manageJobPosts.banner.highlight,
          subtitle: t.jobs.manageJobPosts.banner.subtitle,
          subtitleHighlight: t.jobs.manageJobPosts.banner.subtitleHighlight,
          endText: t.jobs.manageJobPosts.banner.endText,
          searchVariant: 'simple' as const,
          searchPlaceholder: searchPlaceholder || t.jobs.manageJobPosts.banner.searchPlaceholder,
          showPostButton: true
        };
      case 'appliedJobs':
        return {
          title: t.jobs.appliedJobs.banner.title,
          highlight: t.jobs.appliedJobs.banner.highlight,
          searchVariant: 'simple' as const,
          searchPlaceholder: searchPlaceholder || t.jobs.appliedJobs.banner.searchPlaceholder
        };
      case 'chat':
        return {
          title: t.chat.banner.title,
          highlight: t.chat.banner.highlight,
          subtitle: t.chat.banner.subtitle,
          subtitleHighlight: t.chat.banner.subtitleHighlight,
          searchVariant: 'simple' as const,
          searchPlaceholder: searchPlaceholder || 'Search',
          showSearchBar: false
        };
      case 'profile':
        return {
          title: t.profile.banner.title,
          highlight: t.profile.banner.highlight,
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

  // Create gradient from theme banner colors
  const bannerGradient = `linear-gradient(135deg, ${theme.banner.gradientStart} 0%, ${theme.banner.gradientMid} 50%, ${theme.banner.gradientEnd} 100%)`;

  return (
    <div 
      className={`w-full h-[200px] font-inter fixed top-0 left-0 right-0 z-50 pointer-events-none transition-all duration-500 ${className}`}
      style={{
        background: bannerGradient,
      }}
    >
      {/* Themed overlay for depth */}
      <div 
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse at top, transparent 0%, ${theme.banner.gradientStart}${Math.round(theme.banner.overlayOpacity * 255).toString(16)} 100%)`,
        }}
      />

      {/* Particles Background - Themed and animated based on season */}
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
            <span 
              className="bg-clip-text text-transparent transition-all duration-500"
              style={{
                backgroundImage: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.primaryLight})`,
              }}
            >
              {bannerContent.highlight}
            </span>
            {bannerContent.subtitle && (
              <>
                {' '}{bannerContent.subtitle}{' '}
                <span 
                  className="bg-clip-text text-transparent transition-all duration-500"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.primaryLight})`,
                  }}
                >
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
                  {t.common.buttons.post}
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