"use client";

import { useEffect, useState, useMemo, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Banner from "@/components/ui/Banner";
import ViewProfileModal from "@/components/modals/ViewProfileModal";
import JobPostViewModal, { JobPostViewData } from "@/components/modals/JobPostViewModal";
import { ViewToggle } from "@/components/ui/ViewToggle";
import { JobPostCard } from "@/components/cards/JobPostCard";
import StatsSection from '@/components/posts/StatsSection';
import { useStats } from '@/hooks/useStats';
import { useJobPosts } from '@/hooks/useJobPosts';
import { useApplications } from '@/hooks/useApplications';
import { AuthService } from '@/lib/services/auth-services';
import PostsSection from '@/components/posts/PostsSection';
import { JobPostList } from "@/components/cards/JobPostList";
// PostService and ApplicationService usage moved into useJobPosts hook
import { Post } from "@/lib/models/posts";
import { Gender } from "@/lib/constants/gender";
import { ExperienceLevel } from "@/lib/constants/experience-level";
import { SubTypes } from "@/lib/constants/job-types";
import Sort from "@/components/ui/Sort";
import FilterSection, { FilterOptions } from "@/components/ui/FilterSection";
import FilterButton from "@/components/ui/FilterButton";
import FilterModal from "@/components/ui/FilterModal";
import DeleteModal from "@/components/ui/DeleteModal";

// Force dynamic rendering since we use useSearchParams
export const dynamic = 'force-dynamic';

// Wrapper component to handle Suspense boundary for useSearchParams
export default function FindJobsPage() {
  return (
    <Suspense fallback={<FindJobsPageFallback />}>
      <FindJobsPageContent />
    </Suspense>
  );
}

// Loading fallback component
function FindJobsPageFallback() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="fixed inset-0 -z-10 bg-gray-default" />
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    </div>
  );
}

function FindJobsPageContent() {
  const searchParams = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isJobViewOpen, setIsJobViewOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPostViewData | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
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
  } = useJobPosts(currentUserId ?? undefined, { excludeMine: true, excludeApplied: true });

  // Applications hook for apply functionality
  const { 
    createApplication,
    isConfirming,
    confirmApplication,
    cancelApplication,
  } = useApplications(currentUserId, { 
    skip: !currentUserId,
    onSuccess: refresh, // 🚀 Pass the refresh function here
  });

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    
    // Count job types
    const jobTypeCount = Object.values(activeFilters.jobTypes).filter(Boolean).length;
    count += jobTypeCount;
    
    // Count salary ranges
    const salaryCount = Object.values(activeFilters.salaryRange).filter(Boolean).length;
    count += salaryCount;
    
    // Count experience levels
    const experienceCount = Object.values(activeFilters.experienceLevel).filter(Boolean).length;
    count += experienceCount;
    
    // Count preferred genders
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
    // apply filters to the hook
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
    // delegate to hook
    await hookHandleSearch(query, location);
  };

  const handleApplyNow = useCallback(async (postId: string) => {
    createApplication(postId);
  }, [createApplication]);

  useEffect(() => {
    const initCurrentUser = async () => {
      const current = await AuthService.getCurrentUser();
      setCurrentUserId(current?.id ?? null);
    };
    initCurrentUser();
  }, []);

  // Check for pending job application from landing page
  useEffect(() => {
    const applyJobId = searchParams.get('applyJobId');
    if (applyJobId && jobs.length > 0 && currentUserId) {
      // Find the job from the loaded jobs
      const jobToApply = jobs.find(j => j.id === applyJobId);
      if (jobToApply) {
        // Trigger the application modal
        createApplication(applyJobId);
        
        // Clear the URL parameter
        window.history.replaceState({}, '', '/findJobs');
      }
    }
  }, [searchParams, jobs, currentUserId, createApplication]);

  // remove manual counts -- hook already fetches applicant counts for each post

  const formatPeso = (amount: number) => {
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="fixed inset-0 -z-10 bg-gray-default" />
      {/* Banner Section with Header and Search */}
      <Banner variant="findJobs" onSearch={handleSearch} />

      {/* Main Container with VH layout below banner */}
      <div className="mt-[200px] min-h-screen bg-gray-default">
        {/* Stats Section - Fixed on laptop, top on mobile/tablet */}
        <aside className="block laptop:hidden px-4 md:px-6">
          <StatsSection stats={stats} variant="findJobs" loading={statsLoading} error={statsError} />
        </aside>
        
        {/* Stats Section - Fixed sidebar on laptop only */}
        <aside className="hidden laptop:block fixed left-0 top-[200px] mobile-M:top-[205px] mobile-L:top-[210px] tablet:top-[220px] laptop:top-[200px] laptop-L:top-[200px] bottom-0 w-[180px] laptop-L:w-[200px] z-20 px-3 bg-transparent">
          <StatsSection stats={stats} variant="findJobs" loading={statsLoading} error={statsError} />
        </aside>

        {/* Filter Section - Desktop Only (rightmost, no margin, full height) */}
        <aside className="hidden laptop:block fixed right-0 top-[200px] mobile-M:top-[205px] mobile-L:top-[210px] tablet:top-[220px] laptop:top-[200px] laptop-L:top-[200px] bottom-0 w-[280px] bg-white shadow-lg z-40 border-l border-gray-200 flex flex-col pointer-events-auto">
          {/* Sort & View Controls */}
          <div className="flex-shrink-0 bg-white  border-b border-gray-200 px-3 py-2 z-10">
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
    </aside>        {/* Main Content Area - Job posts only */}
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