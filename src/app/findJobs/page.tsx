"use client";

import { useEffect, useState, useMemo, useCallback, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import Banner from "@/components/ui/Banner";
import JobPostViewModal, { JobPostViewData } from "@/components/modals/JobPostViewModal";
import { ViewToggle } from "@/components/ui/ViewToggle";
import StatsSection from '@/components/posts/StatsSection';
import { useStats } from '@/hooks/useStats';
import { useJobPosts } from '@/hooks/useJobPosts';
import { useApplications } from '@/hooks/useApplications';
import { AuthService } from '@/lib/services/auth-services';
import PostsSection from '@/components/posts/PostsSection';
import Sort from "@/components/ui/Sort";
import FilterSection, { FilterOptions } from "@/components/ui/FilterSection";
import FilterButton from "@/components/ui/FilterButton";
import FilterModal from "@/components/ui/FilterModal";
import DeleteModal from "@/components/ui/DeleteModal";
import { Preloader, PreloaderMessages } from "@/components/ui/Preloader";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";

export default function FindJobsPage() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const [initialLoading, setInitialLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isJobViewOpen, setIsJobViewOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPostViewData | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [pendingPostId, setPendingPostId] = useState<string | null>(null);
  const [hasPerformedInitialFetch, setHasPerformedInitialFetch] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
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

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Stats for the page (uses hook)
  const { stats, loading: statsLoading, error: statsError } = useStats({ variant: 'findJobs', userId: currentUserId });

  const {
    jobs,
    loading: jobsLoading,
    isLoadingMore,
    error: jobsError,
    hasMore,
    handleSearch: hookHandleSearch,
    handleSort: hookHandleSort,
    loadMore,
    refresh,
    applyFilters,
    setSortInUrl,
    setSelectedPostId,
    sortValue,
  } = useJobPosts(currentUserId ?? undefined, { excludeMine: true, excludeApplied: true, skip: !currentUserId });

  // Applications hook for apply functionality
  const { 
    createApplication,
    isConfirming,
    confirmApplication,
    cancelApplication,
  } = useApplications(currentUserId, { 
    skip: !currentUserId,
    onSuccess: refresh,
  });

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    
    const jobTypeCount = Object.values(activeFilters.jobTypes).filter(Boolean).length;
    count += jobTypeCount;
    
    const salaryCount = Object.values(activeFilters.salaryRange).filter(Boolean).length;
    count += salaryCount;
    
    const experienceCount = Object.values(activeFilters.experienceLevel).filter(Boolean).length;
    count += experienceCount;
    
    const genderCount = Object.values(activeFilters.preferredGender).filter(Boolean).length;
    count += genderCount;
    
    return count;
  }, [activeFilters]);

  const handleSortChange = useCallback((opt: any) => {
    const val = String(opt?.value ?? 'latest');
    const sortParam = val === 'latest' ? 'date_desc' : val === 'oldest' ? 'date_asc' : val === 'salary-asc' ? 'salary_asc' : val === 'salary-desc' ? 'salary_desc' : undefined;
    setSortInUrl?.(sortParam);
  }, [setSortInUrl]);

  const handleApplyFilters = (filters: FilterOptions) => {
    setActiveFilters(filters);
    applyFilters?.(filters);
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
    applyFilters?.(null);
  };

  const handleSearch = async (query: string, location?: string) => {
    await hookHandleSearch(query, location);
  };

  const handleApplyNow = useCallback(async (postId: string) => {
    createApplication(postId);
  }, [createApplication]);

  useEffect(() => {
    const initCurrentUser = async () => {
      setInitialLoading(true);
      const current = await AuthService.getCurrentUser();
      setCurrentUserId(current?.id ?? null);
      setInitialLoading(false);
    };
    initCurrentUser();
  }, []);

  // Check for pending job application from landing page
  useEffect(() => {
    const applyJobId = searchParams.get('applyJobId');
    if (applyJobId && jobs.length > 0 && currentUserId) {
      const jobToApply = jobs.find(j => j.id === applyJobId);
      if (jobToApply) {
        createApplication(applyJobId);
        window.history.replaceState({}, '', '/findJobs');
      }
    }
  }, [searchParams, jobs, currentUserId, createApplication]);

  // Handle deep linking for postId (e.g. from notifications)
  useEffect(() => {
    const postId = searchParams.get('postId');
    if (postId) {
      setPendingPostId(postId);
      setSelectedPostId?.(postId);
    }
  }, [searchParams]);

  const prevLoading = useRef(jobsLoading);
  useEffect(() => {
    if (prevLoading.current && !jobsLoading) {
      setHasPerformedInitialFetch(true);
    }
    prevLoading.current = jobsLoading;
  }, [jobsLoading]);

  useEffect(() => {
    if (pendingPostId && hasPerformedInitialFetch && !jobsLoading) {
      const job = jobs.find(j => j.id === pendingPostId);
      if (job) {
        setSelectedJob(job as JobPostViewData);
        setIsJobViewOpen(true);
        setPendingPostId(null);
      } else {
        toast.error("Post not found or has been deleted.");
        setSelectedPostId?.(null);
        setPendingPostId(null);
      }
    }
  }, [jobs, pendingPostId, jobsLoading, hasPerformedInitialFetch]);

  const formatPeso = (amount: number) => {
  };

  if (initialLoading) {
    return (
      <Preloader
        isVisible={initialLoading}
        message={PreloaderMessages.LOADING_JOBS}
        variant="default"
      />
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <div 
        className="fixed inset-0 -z-10"
        style={{ backgroundColor: theme.colors.background }}
      />
      
      {/* Banner Section with Header and Search */}
      <Banner variant="findJobs" onSearch={handleSearch} />

      {/* Main Container with VH layout below banner */}
      <div 
        className="mt-[200px] min-h-screen"
        style={{ backgroundColor: theme.colors.background }}
      >
        {/* Stats Section - Fixed on laptop, top on mobile/tablet */}
        <aside className="block laptop:hidden px-4 md:px-6">
          <StatsSection stats={stats} variant="findJobs" loading={statsLoading} error={statsError} />
        </aside>
        
        {/* Stats Section - Fixed sidebar on laptop only */}
        <aside className="hidden laptop:block fixed left-0 top-[200px] mobile-M:top-[205px] mobile-L:top-[210px] tablet:top-[220px] laptop:top-[200px] laptop-L:top-[200px] bottom-0 w-[180px] laptop-L:w-[200px] z-20 px-3 bg-transparent">
          <StatsSection stats={stats} variant="findJobs" loading={statsLoading} error={statsError} />
        </aside>

        {/* Filter Section - Desktop Only */}
        <aside 
          className="hidden laptop:block fixed right-0 top-[200px] mobile-M:top-[205px] mobile-L:top-[210px] tablet:top-[220px] laptop:top-[200px] laptop-L:top-[200px] bottom-0 w-[280px] shadow-lg z-40 border-l flex flex-col pointer-events-auto transition-colors duration-300"
          style={{
            backgroundColor: theme.colors.sidebarBg,
            borderColor: theme.colors.borderLight,
          }}
        >
          {/* Sort & View Controls */}
          <div 
            className="flex-shrink-0 border-b px-3 py-2 z-10 transition-colors duration-300"
            style={{
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.borderLight,
            }}
          >
            <div className="flex items-center justify-between gap-3">
              {/* Sort By */}
              <div className="flex items-center gap-2">
                <span
                  className="text-small whitespace-nowrap font-medium"
                  style={{ color: theme.colors.textSecondary }}
                >
                  {t.common.labels.sortBy}
                </span>
                <Sort variant="findJobs" onChange={handleSortChange} value={sortValue} />
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

        {/* Main Content Area - Job posts only */}
        <main className="w-full laptop:w-[calc(100%-460px)] laptop:ml-[180px] laptop-L:w-[calc(100%-480px)] laptop-L:ml-[200px]">
          <div className="px-4 md:px-6 laptop:px-6 pt-2 pb-6 max-w-full">
            <div className="space-y-4">
              {/* Controls Row with Filter Button - Mobile/Tablet Only */}
              <div 
                className="laptop:hidden flex items-center justify-between gap-1.5 mobile-M:gap-3 rounded-lg px-2 mobile-M:px-4 py-2 mobile-M:py-3 shadow-sm"
                style={{ backgroundColor: theme.colors.surface }}
              >
                {/* Filter Button */}
                <FilterButton
                  onClick={() => setIsFilterModalOpen(true)}
                  filterCount={activeFilterCount}
                />
                
                {/* Sort By and View Toggle */}
                <div className="flex items-center gap-1.5 mobile-M:gap-3">
                  <span
                    className="text-tiny mobile-M:text-small whitespace-nowrap hidden mobile-S:inline"
                    style={{ color: theme.colors.textSecondary }}
                  >
                    {t.common.labels.sortBy}
                  </span>
                  <Sort variant="findJobs" onChange={handleSortChange} value={sortValue} />
                  <ViewToggle value={viewMode} onChange={setViewMode} />
                </div>
              </div>

              {/* Display */}
              <PostsSection
                jobs={jobs}
                variant="find"
                loading={jobsLoading}
                isLoadingMore={isLoadingMore}
                error={jobsError}
                hasMore={hasMore}
                viewMode={viewMode}
                onViewModeChange={(v: 'card' | 'list') => setViewMode(v)}
                onLoadMore={loadMore as () => void}
                onOpen={(data: any) => { setSelectedPostId?.(data.id); setSelectedJob(data as JobPostViewData); setIsJobViewOpen(true); }}
                onApply={handleApplyNow}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Modal */}
      <JobPostViewModal
        isOpen={isJobViewOpen}
        onClose={() => { setSelectedPostId?.(null, false); setIsJobViewOpen(false); }}
        job={selectedJob}
        onApply={handleApplyNow}
      />
      
      {/* Filter Modal - Mobile Only */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilters}
        onClearAll={handleClearFilters}
        initialFilters={activeFilters}
      />

      <DeleteModal
        isOpen={isConfirming}
        onClose={cancelApplication}
        onConfirm={confirmApplication}
        modalType="createApplication"
      />
    </div>
  );
}
