"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Banner from "@/components/ui/Banner";
import ViewProfileModal from "@/components/modals/ViewProfileModal";
import JobPostViewModal, { JobPostViewData } from "@/components/modals/JobPostViewModal";
import { ViewToggle } from "@/components/ui/ViewToggle";
import { JobPostCard } from "@/components/cards/JobPostCard";
import StatsSection from '@/components/posts/StatsSection';
import { useStats } from '@/hooks/useStats';
import { useJobPosts } from '@/hooks/useJobPosts';
import { AuthService } from '@/lib/services/auth-services';
import PostsSection from '@/components/posts/PostsSection';
import { JobPostList } from "@/components/cards/JobPostList";
// PostService and ApplicationService usage moved into useJobPosts hook
import { Post } from "@/lib/models/posts";
import Sort from "@/components/ui/Sort";
import FilterSection, { FilterOptions } from "@/components/ui/FilterSection";
import FilterButton from "@/components/ui/FilterButton";
import FilterModal from "@/components/ui/FilterModal";

export default function FindJobsPage() {
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

  const [posts, setPosts] = useState<Post[]>([]);
  // replaced with useJobPosts
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [appCounts, setAppCounts] = useState<Record<string, number>>({});
  const [sortValue, setSortValue] = useState<string>('latest');
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
    applyFilters,
  } = useJobPosts(currentUserId ?? undefined, { excludeMine: true, excludeApplied: true });

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

  // Apply filters to posts
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Filter by job types
      const jobTypeKeys = Object.keys(activeFilters.jobTypes).filter(
        (key) => activeFilters.jobTypes[key]
      );
      if (jobTypeKeys.length > 0) {
        const postType = post.type.toLowerCase();
        const hasMatchingType = jobTypeKeys.some((key) => {
          if (key.includes('-')) {
            // It's a subtype like "cleaning-housekeeping"
            const [parent, sub] = key.split('-');
            return (
              postType === parent.toLowerCase() &&
              post.subType?.some((st) => st.toLowerCase() === sub.toLowerCase())
            );
          }
          return postType === key.toLowerCase();
        });
        if (!hasMatchingType) return false;
      }

      // Filter by salary range
      const { lessThan5000, range10to20, moreThan20000 } = activeFilters.salaryRange;
      if (lessThan5000 || range10to20 || moreThan20000) {
        const salary = post.price || 0;
        const matchesSalary =
          (lessThan5000 && salary < 5000) ||
          (range10to20 && salary >= 10000 && salary <= 20000) ||
          (moreThan20000 && salary > 20000);
        if (!matchesSalary) return false;
      }

      // Note: Experience level and preferred gender filters can be added
      // when the Post model includes these fields

      return true;
    });
  }, [posts, activeFilters]);

  // Derived posts based on sort selection
  const displayPosts = useMemo(() => {
    const sorted = [...filteredPosts];
    switch (sortValue) {
      case 'latest':
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'salary-asc':
        sorted.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case 'salary-desc':
        sorted.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      case 'nearby':
        sorted.sort((a, b) => String(a.location).localeCompare(String(b.location)));
        break;
      default:
        break;
    }
    return sorted;
  }, [filteredPosts, sortValue]);

  const handleSortChange = useCallback((opt: any) => {
      const val = String(opt?.value ?? 'latest');
      setSortValue(val);
      // map UI sort values to service sort params
      let sortBy: string = 'createdAt';
      let sortOrder: 'asc' | 'desc' = 'desc';
      switch (val) {
        case 'latest':
          sortBy = 'createdAt';
          sortOrder = 'desc';
          break;
        case 'oldest':
          sortBy = 'createdAt';
          sortOrder = 'asc';
          break;
        case 'salary-asc':
          sortBy = 'price';
          sortOrder = 'asc';
          break;
        case 'salary-desc':
          sortBy = 'price';
          sortOrder = 'desc';
          break;
        case 'nearby':
          sortBy = 'location';
          sortOrder = 'asc';
          break;
        default:
          break;
      }
      if (hookHandleSort) {
        hookHandleSort(sortBy, sortOrder);
      }
    }, [hookHandleSort]);

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
  };

  const handleSearch = async (query: string, location?: string) => {
    // delegate to hook
    await hookHandleSearch(query, location);
  };

  useEffect(() => {
    const initCurrentUser = async () => {
      const current = await AuthService.getCurrentUser();
      setCurrentUserId(current?.id ?? null);
    };
    initCurrentUser();
  }, []);

  // remove manual counts -- hook already fetches applicant counts for each post

  const formatPeso = (amount: number) => {
    return amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatPostedDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' });
    } catch {
      return iso;
    }
  };

  const postToJobData = (post: Post): JobPostViewData => {
    return {
      id: post.postId,
      title: post.title,
      description: post.description,
      location: post.location,
      salary: formatPeso(post.price),
      salaryPeriod: 'month',
      postedDate: formatPostedDate(post.createdAt),
      applicantCount: appCounts[post.postId] || 0,
      genderTags: [],
      experienceTags: [],
      jobTypeTags: [post.type, ...(post.subType || [])],
    };
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Banner Section with Header and Search */}
      <Banner variant="findJobs" onSearch={handleSearch} />

      {/* Main Container */}
      <div className="pt-[214px]">
        {/* Filter Section - Desktop Only (leftmost, no margin, full height) */}
        <aside className="hidden lg:block fixed left-0 top-[214px] bottom-0 w-[240px] bg-white shadow-lg overflow-y-auto z-20">
          <FilterSection
            initialFilters={activeFilters}
            onApply={handleApplyFilters}
            onClearAll={handleClearFilters}
            className="h-full"
          />
        </aside>

        {/* Main Content Area */}
        <main className="w-full lg:w-[calc(100%-240px)] lg:ml-[240px]">
          <div className="px-4 md:px-6 lg:px-8 pb-8 max-w-full">
            {/* Stats Row */}
            <StatsSection stats={stats} variant="findJobs" loading={statsLoading} error={statsError} />

            {/* Job Posts Section */}
            <div className="mt-8 space-y-6">
              {/* Controls Row with Filter Button */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Left side - Filter Button (Mobile) & Showing count */}
                <div className="flex items-center gap-3">
                  {/* Filter Button - Mobile Only */}
                  <div className="lg:hidden">
                    <FilterButton
                      onClick={() => setIsFilterModalOpen(true)}
                      filterCount={activeFilterCount}
                    />
                  </div>
                  <span className="text-small text-gray-neutral600 whitespace-nowrap">Showing: {jobs.length}</span>
                </div>
                
                {/* Right side - Sort & View Toggle */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-small text-gray-neutral600 whitespace-nowrap">Sort by</span>
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
                onOpen={(data: any) => { setSelectedJob(data as JobPostViewData); setIsJobViewOpen(true); }}
                onApply={(id: string) => console.log('apply', id)}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Modal */}
      <ViewProfileModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <JobPostViewModal
        isOpen={isJobViewOpen}
        onClose={() => setIsJobViewOpen(false)}
        job={selectedJob}
        onApply={(id) => console.log('apply', id)}
      />
      
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
