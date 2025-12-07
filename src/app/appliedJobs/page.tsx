'use client';

import { toast } from 'react-hot-toast';
import { useEffect, useState, useMemo, useCallback } from 'react';
import Banner from '@/components/ui/Banner';
import StatsSection from '@/components/posts/StatsSection';
import { useStats } from '@/hooks/useStats';
import { Preloader, PreloaderMessages } from '@/components/ui/Preloader';
import { AuthService } from '@/lib/services/auth-services';
import { ViewToggle } from '@/components/ui/ViewToggle';
import Sort from '@/components/ui/Sort';
import FilterSection, { FilterOptions } from '@/components/ui/FilterSection';
import { ApplicationService } from '@/lib/services/applications-services';
import DeleteModal from '@/components/ui/DeleteModal';
import FilterButton from '@/components/ui/FilterButton';
import FilterModal from '@/components/ui/FilterModal';
import { ApplicationStatus, AppliedJob } from '@/components/cards/AppliedJobCardList';
import useApplications from '@/hooks/useApplications';
import ApplicationsSection from '@/components/applications/ApplicationsSection';
import JobPostViewModal, { JobPostViewData } from '@/components/modals/JobPostViewModal';

export default function AppliedJobsPage() {
  const [user, setUser] = useState<any | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isJobViewOpen, setIsJobViewOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPostViewData | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<AppliedJob | null>(null);
  
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
      setInitialLoading(true);
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
        setInitialLoading(false);
      }
    };
    init();
  }, []);

  const { stats, loading: statsLoading, error: statsError } = useStats({ variant: 'appliedJobs', userId: currentUserId });
  const { 
    applications, 
    loading, 
    isLoadingMore,
    hasMore,
    error: appsError,
    loadMore,
    handleSort,
    setSelectedApplicationId,
    deleteApplication,
    isDeleting,
    isDeleteConfirming,
    confirmDeleteApplication,
    cancelDeleteApplication,
    applyFilters,
    setSortInUrl,
    parseUrlParams,
    searchApplications,
  } = useApplications(currentUserId);

  useEffect(() => {
    const { parsedFilters, applicationId } = parseUrlParams();
    if (parsedFilters) {
      setActiveFilters(parsedFilters);
    }
    if (applicationId) {
      try {
        const ref = document.referrer || '';
        const isInternalRef = ref.startsWith(window.location.origin);
        if (isInternalRef) {
          setSelectedApplicationId?.(applicationId);
        } else {
          setSelectedApplicationId?.(null, false);
        }
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    Object.values(activeFilters.jobTypes).forEach((subtypes) => {
      if (Array.isArray(subtypes)) count += subtypes.length;
    });
    count += Object.values(activeFilters.salaryRange).filter(Boolean).length;
    count += Object.values(activeFilters.experienceLevel).filter(Boolean).length;
    count += Object.values(activeFilters.preferredGender).filter(Boolean).length;
    return count;
  }, [activeFilters]);

  const handleSearch = (query: string, location?: string) => {
    searchApplications?.(query, location);
  };

  const handleStatFilter = (type: 'total' | 'pending' | 'approved' | 'rejected') => {
    const statusFilter = type === 'total' ? null : { status: { [type]: true } };
    // This assumes applyFilters can handle a 'status' filter.
    // We may need to adjust useApplications hook if not.
    // For now, let's just log it.
    console.log("Stat filter clicked, would apply:", statusFilter);
  };

  const handleSortChange = useCallback((opt: any) => {
    const val = String(opt?.value ?? 'latest');
    let sortBy = 'createdAt';
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
    }
    handleSort?.(sortBy, sortOrder);
    setSortInUrl?.(val === 'latest' ? undefined : `${sortBy}_${sortOrder}`);
  }, [handleSort, setSortInUrl]);

  const handleApplyFilters = (filters: FilterOptions) => {
    setActiveFilters(filters);
    applyFilters?.(filters);
  };

  const handleClearFilters = () => {
    const emptyFilters: FilterOptions = {
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
    };
    setActiveFilters(emptyFilters);
    applyFilters?.(null);
  };

  const handleDeleteApplication = (applicationId: string) => {
    const appToDelete = applications.find(app => app.id === applicationId);
    if (appToDelete) {
      setSelectedApplication(appToDelete);
      deleteApplication?.(applicationId);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedApplication || !currentUserId) return;
    await confirmDeleteApplication?.();
    setSelectedApplication(null);
  };

  const handleOpenJobView = async (job: any) => {
    setSelectedApplicationId?.(job.id);
    const rawApp = job.raw || {};
    const post = rawApp.posts || rawApp.post || {};
    
    const desc = job.description || '';
    const requirementsMatch = desc.match(/\[requirements\]\s*([\s\S]*)/i);
    const aboutText = requirementsMatch ? desc.substring(0, requirementsMatch.index).trim() : desc;
    const requirementsText = requirementsMatch ? requirementsMatch[1].trim() : '';
    const requirementsArray = requirementsText ? requirementsText.split('\n').map((r: string) => r.trim()).filter(Boolean) : [];
    
    let applicantCount = 0;
    if (post.postId) {
      try {
        applicantCount = await ApplicationService.getTotalApplicationsByPostIdCount(post.postId);
      } catch (error) {
        console.error('Error fetching applicant count:', error);
      }
    }
    
    const jobData: JobPostViewData = {
      id: post.postId || job.id,
      title: job.title,
      description: aboutText,
      requirements: requirementsArray,
      location: job.location,
      salary: job.salary.replace('₱', '').replace(/,/g, ''),
      salaryPeriod: job.salaryPeriod,
      postedDate: rawApp.createdAt ? new Date(rawApp.createdAt).toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' }) : job.appliedOn,
      applicantCount,
      genderTags: job.genderTags,
      experienceTags: job.experienceTags,
      jobTypeTags: job.jobTypeTags,
      raw: post,
    };
    setSelectedJob(jobData);
    setIsJobViewOpen(true);
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
      <div className="fixed inset-0 -z-10 bg-gray-default" />
      <Banner variant="appliedJobs" onSearch={handleSearch} />

      <div className="mt-[200px] min-h-screen bg-gray-default">
        <aside className="block laptop:hidden px-4 md:px-6">
          <StatsSection 
            stats={stats} 
            variant="appliedJobs" 
            loading={statsLoading} 
            error={statsError} 
            onStatClick={handleStatFilter}
          />
        </aside>
        
        <aside className="hidden laptop:block fixed left-0 top-[200px] bottom-0 w-[180px] laptop-L:w-[200px] z-20 px-3 bg-transparent">
          <StatsSection 
            stats={stats} 
            variant="appliedJobs" 
            loading={statsLoading} 
            error={statsError} 
            onStatClick={handleStatFilter}
          />
        </aside>

        <aside className="hidden laptop:block fixed right-0 top-[200px] bottom-0 w-[280px] bg-white shadow-lg z-40 border-l border-gray-200 flex flex-col pointer-events-auto">
          <div className="flex-shrink-0 bg-white border-b border-gray-200 px-3 py-2 z-10">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-small text-gray-neutral600 whitespace-nowrap font-medium">Sort by</span>
                <Sort variant="findJobs" onChange={handleSortChange} />
              </div>
              <ViewToggle value={viewMode} onChange={setViewMode} />
            </div>
          </div>
          
          <FilterSection
            initialFilters={activeFilters}
            onApply={handleApplyFilters}
            onClearAll={handleClearFilters}
            className="flex-1 min-h-0"
            variant="appliedJobs"
          />
        </aside>

        <main className="w-full laptop:w-[calc(100%-460px)] laptop:ml-[180px] laptop-L:w-[calc(100%-480px)] laptop-L:ml-[200px]">
          <div className="px-4 md:px-6 laptop:px-6 pt-2 pb-6 max-w-full">
            <div className="space-y-4">
              <div className="laptop:hidden flex items-center justify-between gap-1.5 mobile-M:gap-3 bg-white rounded-lg px-2 mobile-M:px-4 py-2 mobile-M:py-3 shadow-sm">
                <FilterButton
                  onClick={() => setIsFilterModalOpen(true)}
                  filterCount={activeFilterCount}
                />
                
                <div className="flex items-center gap-1.5 mobile-M:gap-3">
                  <span className="text-tiny mobile-M:text-small text-gray-neutral600 whitespace-nowrap hidden mobile-S:inline">Sort by</span>
                  <Sort variant="findJobs" onChange={handleSortChange} />
                  <ViewToggle value={viewMode} onChange={setViewMode} />
                </div>
              </div>

              <ApplicationsSection
                applications={applications}
                loading={loading}
                isLoadingMore={isLoadingMore}
                hasMore={hasMore}
                onLoadMore={loadMore}
                error={appsError}
                viewMode={viewMode}
                onDelete={handleDeleteApplication}
                onOpen={handleOpenJobView}
              />
            </div>
          </div>
        </main>
      </div>

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilters}
        onClearAll={handleClearFilters}
        initialFilters={activeFilters}
        variant="appliedJobs"
      />

      <JobPostViewModal
        isOpen={isJobViewOpen}
        onClose={() => { setSelectedApplicationId?.(null, false); setIsJobViewOpen(false); }}
        job={selectedJob}
      />

      <DeleteModal
        isOpen={isDeleteConfirming}
        onClose={cancelDeleteApplication}
        onConfirm={handleConfirmDelete}
        modalType="withdrawApplication"
        isProcessing={isDeleting}
      />
    </div>
  );
}