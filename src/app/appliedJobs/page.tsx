'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import Banner from '@/components/ui/Banner';
import StatsSection from '@/components/posts/StatsSection';
import { useStats } from '@/hooks/useStats';
import { Preloader, PreloaderMessages } from '@/components/ui/Preloader';
import { AuthService } from '@/lib/services/auth-services';
import { ViewToggle } from '@/components/ui/ViewToggle';
import Sort from '@/components/ui/Sort';
import FilterSection, { FilterOptions } from '@/components/ui/FilterSection';
import FilterButton from '@/components/ui/FilterButton';
import FilterModal from '@/components/ui/FilterModal';
import { ApplicationStatus } from '@/components/cards/AppliedJobCardList';
import useApplications from '@/hooks/useApplications';
import ApplicationsSection from '@/components/applications/ApplicationsSection';

export default function AppliedJobsPage() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'total' | null>(null);
  const [sortOption, setSortOption] = useState<string>('latest');
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    jobTypes: {},
    salaryRange: {
      lessThan5000: false,
      range10to20: false,
      moreThan20000: false,
      custom: false,
    },
    experienceLevel: {
      entryLevel: false,
      intermediate: false,
      professional: false,
    },
    preferredGender: {
      any: false,
      female: false,
      male: false,
      others: false,
    },
  });

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const current = await AuthService.getCurrentUser();
        if (!current) {
          window.location.href = '/auth/login';
          return;
        }
        setUser(current);
        setCurrentUserId(current.id);
      } catch (error) {
        console.error('Error fetching user:', error);
        window.location.href = '/auth/login';
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const { stats, error: statsError } = useStats({ variant: 'appliedJobs', userId: currentUserId });
  const { applications, loading: appsLoading, error: appsError } = useApplications(currentUserId);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    count += Object.values(activeFilters.jobTypes).filter(Boolean).length;
    count += Object.values(activeFilters.salaryRange).filter(Boolean).length;
    count += Object.values(activeFilters.experienceLevel).filter(Boolean).length;
    count += Object.values(activeFilters.preferredGender).filter(Boolean).length;
    return count;
  }, [activeFilters]);

  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    // TODO: Implement search functionality
  };

  const handleStatFilter = (type: 'total' | 'pending' | 'approved' | 'rejected') => {
    if (type === 'total') {
      setStatusFilter(null);
    } else {
      setStatusFilter(type as ApplicationStatus);
    }
  };

  const handleSortChange = useCallback((opt: any) => {
    const val = String(opt?.value ?? 'latest');
    setSortOption(val);
  }, []);

  const handleApplyFilters = (filters: FilterOptions) => {
    setActiveFilters(filters);
    // TODO: Apply filters to the applications list
  };

  const handleClearFilters = () => {
    setActiveFilters({
      jobTypes: {},
      salaryRange: {
        lessThan5000: false,
        range10to20: false,
        moreThan20000: false,
        custom: false,
      },
      experienceLevel: {
        entryLevel: false,
        intermediate: false,
        professional: false,
      },
      preferredGender: {
        any: false,
        female: false,
        male: false,
        others: false,
      },
    });
  };

  const handleDeleteApplication = (jobId: string) => {
    console.log('Delete application:', jobId);
    // TODO: Implement delete functionality
  };

  // Filter and sort applications
  const filteredAndSortedApplications = useMemo(() => {
    if (!applications) return [];

    // Filter by status
    let filtered = statusFilter 
      ? applications.filter(app => app.status === statusFilter)
      : applications;

    // Sort applications
    const sorted = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case 'latest':
          return new Date(b.appliedOn).getTime() - new Date(a.appliedOn).getTime();
        case 'oldest':
          return new Date(a.appliedOn).getTime() - new Date(b.appliedOn).getTime();
        case 'salary-asc':
          return a.salary - b.salary;
        case 'salary-desc':
          return b.salary - a.salary;
        default:
          return 0;
      }
    });

    return sorted;
  }, [applications, statusFilter, sortOption]);

  if (loading) {
    return (
      <Preloader
        isVisible={loading}
        message={PreloaderMessages.LOADING_JOBS}
        variant="default"
      />
    );
  }

  return (
    <div className="overflow-x-hidden">
      {/* Banner Section with Header and Search */}
      <Banner variant="appliedJobs" onSearch={handleSearch} />

      {/* Main Container with VH layout below banner */}
      <div className="mt-[200px] mobile-S:mt-[140px] mobile-M:mt-[145px] mobile-L:mt-[150px] tablet:mt-[180px] laptop:mt-[190px] laptop-L:mt-[200px] min-h-screen bg-gray-50">
        {/* Stats Section - Fixed on laptop, top on mobile/tablet */}
        <aside className="block laptop:hidden px-4 md:px-6">
          <StatsSection 
            stats={stats} 
            variant="appliedJobs" 
            loading={loading} 
            error={statsError} 
            onStatClick={handleStatFilter}
          />
        </aside>
        
        {/* Stats Section - Fixed sidebar on laptop only */}
        <aside className="hidden laptop:block fixed left-0 top-[200px] mobile-M:top-[205px] mobile-L:top-[210px] tablet:top-[220px] laptop:top-[200px] laptop-L:top-[200px] bottom-0 w-[180px] laptop-L:w-[200px] z-20 px-3 bg-gray-50">
          <StatsSection 
            stats={stats} 
            variant="appliedJobs" 
            loading={loading} 
            error={statsError} 
            onStatClick={handleStatFilter}
          />
        </aside>

        {/* Filter Section - Desktop Only (rightmost, no margin, full height) */}
        <aside className="hidden laptop:block fixed right-0 top-[200px] mobile-M:top-[205px] mobile-L:top-[210px] tablet:top-[220px] laptop:top-[200px] laptop-L:top-[200px] bottom-0 w-[280px] bg-white shadow-lg z-20 border-l border-gray-200 flex flex-col">
          {/* Sort & View Controls */}
          <div className="flex-shrink-0 bg-white border-b border-gray-200 px-3 py-2 z-10">
            <div className="flex items-center justify-between gap-3">
              {/* Sort By */}
              <div className="flex items-center gap-2">
                <span className="text-small text-gray-neutral600 whitespace-nowrap font-medium">Sort by</span>
                <Sort variant="findJobs" onChange={handleSortChange} />
              </div>
              
              {/* View Toggle */}
              <ViewToggle value={viewMode} onChange={setViewMode} />
            </div>
          </div>
          
          {/* Filter Section - takes remaining height */}
          <FilterSection
            initialFilters={activeFilters}
            onApply={handleApplyFilters}
            onClearAll={handleClearFilters}
            className="flex-1 min-h-0"
          />
        </aside>

        {/* Main Content Area - Applications list only */}
        <main className="w-full laptop:w-[calc(100%-460px)] laptop:ml-[180px] laptop-L:w-[calc(100%-480px)] laptop-L:ml-[200px]">
          <div className="px-4 md:px-6 laptop:px-6 pt-2 pb-6 max-w-full">
            <div className="space-y-4">
              {/* Controls Row with Filter Button - Mobile/Tablet Only */}
              <div className="laptop:hidden flex items-center justify-between gap-1.5 mobile-M:gap-3 bg-white rounded-lg px-2 mobile-M:px-4 py-2 mobile-M:py-3 shadow-sm">
                {/* Filter Button */}
                <FilterButton
                  onClick={() => setIsFilterModalOpen(true)}
                  filterCount={activeFilterCount}
                />
                
                {/* Sort By and View Toggle */}
                <div className="flex items-center gap-1.5 mobile-M:gap-3">
                  <span className="text-tiny mobile-M:text-small text-gray-neutral600 whitespace-nowrap hidden mobile-S:inline">Sort by</span>
                  <Sort variant="findJobs" onChange={handleSortChange} />
                  <ViewToggle value={viewMode} onChange={setViewMode} />
                </div>
              </div>

              {/* Applications Display */}
              <ApplicationsSection
                applications={filteredAndSortedApplications}
                loading={appsLoading}
                error={appsError}
                viewMode={viewMode}
                onDelete={handleDeleteApplication}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Filter Modal - Mobile Only */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilters}
        onClearAll={handleClearFilters}
        initialFilters={activeFilters}
      />
    </div>
  );
}