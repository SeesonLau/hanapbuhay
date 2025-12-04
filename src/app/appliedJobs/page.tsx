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
import { ApplicationService } from '@/lib/services/applications-services';
import FilterButton from '@/components/ui/FilterButton';
import FilterModal from '@/components/ui/FilterModal';
import { ApplicationStatus } from '@/components/cards/AppliedJobCardList';
import useApplications from '@/hooks/useApplications';
import ApplicationsSection from '@/components/applications/ApplicationsSection';
import { Gender } from '@/lib/constants/gender';
import { ExperienceLevel } from '@/lib/constants/experience-level';
import { JobType, SubTypes } from '@/lib/constants/job-types';
import JobPostViewModal, { JobPostViewData } from '@/components/modals/JobPostViewModal';

export default function AppliedJobsPage() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isJobViewOpen, setIsJobViewOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPostViewData | null>(null);
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
  const { 
    applications, 
    loading: appsLoading, 
    error: appsError,
    setSelectedApplicationId,
    setFiltersInUrl,
    setSortInUrl,
    parseUrlParams,
  } = useApplications(currentUserId);

  // On mount, restore sort and filters from URL to UI state
  useEffect(() => {
    const { sort, parsedFilters, applicationId } = parseUrlParams();
    if (sort) {
      // map sort back to UI value
      const uiSort = sort === 'date_desc' ? 'latest' : sort === 'date_asc' ? 'oldest' : sort === 'salary_asc' ? 'salary-asc' : sort === 'salary_desc' ? 'salary-desc' : 'latest';
      setSortOption(uiSort as string);
    }
    if (parsedFilters) {
      setActiveFilters(parsedFilters);
    }
    // If an applicationId exists in the URL, only honor it when navigation originated from inside the app.
    if (applicationId) {
      try {
        const ref = document.referrer || '';
        const isInternalRef = ref.startsWith(window.location.origin);
        if (isInternalRef) {
          setSelectedApplicationId?.(applicationId);
        } else {
          // Remove externally-typed applicationId and restore default state
          setSelectedApplicationId?.(null, false);
        }
      } catch (e) {
        // ignore
      }
    }
  }, []);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    
    // Count job types (each selected subtype counts as 1)
    Object.values(activeFilters.jobTypes).forEach((subtypes) => {
      if (Array.isArray(subtypes)) {
        count += subtypes.length;
      }
    });
    
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
    // Update URL with sort param
    setSortInUrl?.(val === 'latest' ? 'date_desc' : val === 'oldest' ? 'date_asc' : val === 'salary-asc' ? 'salary_asc' : val === 'salary-desc' ? 'salary_desc' : undefined);
  }, [setSortInUrl]);

  const handleApplyFilters = (filters: FilterOptions) => {
    setActiveFilters(filters);
    // Update URL with filters
    setFiltersInUrl?.(filters);
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
    // Clear filters from URL
    setFiltersInUrl?.(null);
  };

  const handleDeleteApplication = (jobId: string) => {
    console.log('Delete application:', jobId);
    // TODO: Implement delete functionality
  };

  const handleOpenJobView = async (job: any) => {
    // Update URL with application ID
    setSelectedApplicationId?.(job.id);

    // Extract raw application data
    const rawApp = job.raw || {};
    const post = rawApp.posts || rawApp.post || {};
    
    // Parse requirements from description if available
    const desc = job.description || '';
    const requirementsMatch = desc.match(/\[requirements\]\s*([\s\S]*)/i);
    const aboutText = requirementsMatch ? desc.substring(0, requirementsMatch.index).trim() : desc;
    const requirementsText = requirementsMatch ? requirementsMatch[1].trim() : '';
    const requirementsArray = requirementsText ? requirementsText.split('\n').map((r: string) => r.trim()).filter(Boolean) : [];
    
    // Fetch applicant count for this post
    let applicantCount = 0;
    if (post.postId) {
      try {
        applicantCount = await ApplicationService.getTotalApplicationsByPostIdCount(post.postId);
      } catch (error) {
        console.error('Error fetching applicant count:', error);
      }
    }
    
    // Transform AppliedJob to JobPostViewData format with complete data
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
      raw: post, // Pass raw post data for profile fetching
    };
    setSelectedJob(jobData);
    setIsJobViewOpen(true);
  };

  // Filter and sort applications
  const filteredAndSortedApplications = useMemo(() => {
    if (!applications) return [];

    let filtered = applications;

    // Filter by status (from stats section)
    if (statusFilter) {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // Apply job type filters
    const { jobTypes, salaryRange, experienceLevel, preferredGender } = activeFilters;

    // Job Type filtering
    const selectedJobTypeSubtypes: string[] = [];
    const selectedJobTypes: string[] = [];
    
    Object.entries(jobTypes).forEach(([jobType, subtypes]) => {
      if (subtypes && subtypes.length > 0) {
        subtypes.forEach((subtype: string) => {
          if (subtype === 'Other') {
            selectedJobTypes.push(jobType);
          } else {
            selectedJobTypeSubtypes.push(subtype);
          }
        });
      }
    });

    console.log('Job Type Filter Debug:', {
      selectedJobTypes,
      selectedJobTypeSubtypes,
      sampleAppJobTypeTags: filtered[0]?.jobTypeTags
    });

    if (selectedJobTypeSubtypes.length > 0 || selectedJobTypes.length > 0) {
      filtered = filtered.filter(app => {
        const jobTypeTags = app.jobTypeTags || [];
        
        console.log('Checking application:', {
          title: app.title,
          jobTypeTags,
          selectedJobTypeSubtypes,
          selectedJobTypes
        });
        
        // If we have specific subtypes selected, check if any match
        let hasSubtype = false;
        if (selectedJobTypeSubtypes.length > 0) {
          hasSubtype = selectedJobTypeSubtypes.some(subtype => jobTypeTags.includes(subtype));
        }
        
        // If we have main job types selected (from "Other"), check if any match
        let hasJobType = false;
        if (selectedJobTypes.length > 0) {
          hasJobType = selectedJobTypes.some(type => jobTypeTags.includes(type));
        }
        
        // Include if either condition is met (OR logic)
        const shouldInclude = 
          (selectedJobTypeSubtypes.length > 0 && hasSubtype) ||
          (selectedJobTypes.length > 0 && hasJobType);
        
        console.log('  -> hasSubtype:', hasSubtype, 'hasJobType:', hasJobType, 'shouldInclude:', shouldInclude);
        
        return shouldInclude;
      });
    }

    // Salary Range filtering
    const selectedSalaryRanges = Object.entries(salaryRange)
      .filter(([_, v]) => v)
      .map(([k]) => k);

    if (selectedSalaryRanges.length > 0) {
      filtered = filtered.filter(app => {
        // Extract numeric value from formatted salary string (e.g., "₱50,000.00")
        const salaryStr = app.salary || '';
        const numericSalary = parseFloat(salaryStr.replace(/[₱,]/g, ''));
        
        return selectedSalaryRanges.some(range => {
          if (range === 'lessThan5000') {
            return numericSalary < 5000;
          } else if (range === 'range10to20') {
            return numericSalary >= 10000 && numericSalary <= 20000;
          } else if (range === 'moreThan20000') {
            return numericSalary > 20000;
          }
          return true;
        });
      });
    }

    // Experience Level filtering
    const selectedExperienceLevels = Object.entries(experienceLevel)
      .filter(([_, v]) => v)
      .map(([k]) => {
        if (k === 'entryLevel') return ExperienceLevel.ENTRY;
        if (k === 'intermediate') return ExperienceLevel.INTERMEDIATE;
        if (k === 'professional') return ExperienceLevel.EXPERT;
        return k;
      });

    if (selectedExperienceLevels.length > 0) {
      filtered = filtered.filter(app => {
        const experienceTags = app.experienceTags || [];
        return selectedExperienceLevels.some(level => experienceTags.includes(level));
      });
    }

    // Preferred Gender filtering
    const selectedGenders = Object.entries(preferredGender)
      .filter(([_, v]) => v)
      .map(([k]) => {
        if (k === 'any') return Gender.ANY;
        if (k === 'male') return Gender.MALE;
        if (k === 'female') return Gender.FEMALE;
        if (k === 'others') return Gender.OTHERS;
        return k;
      });

    if (selectedGenders.length > 0) {
      filtered = filtered.filter(app => {
        const genderTags = app.genderTags || [];
        return selectedGenders.some(gender => genderTags.includes(gender));
      });
    }

    // Sort applications
    const sorted = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case 'latest':
          return new Date(b.appliedOn).getTime() - new Date(a.appliedOn).getTime();
        case 'oldest':
          return new Date(a.appliedOn).getTime() - new Date(b.appliedOn).getTime();
        case 'salary-asc': {
          const salaryA = parseFloat((a.salary || '0').replace(/[₱,]/g, ''));
          const salaryB = parseFloat((b.salary || '0').replace(/[₱,]/g, ''));
          return salaryA - salaryB;
        }
        case 'salary-desc': {
          const salaryA = parseFloat((a.salary || '0').replace(/[₱,]/g, ''));
          const salaryB = parseFloat((b.salary || '0').replace(/[₱,]/g, ''));
          return salaryB - salaryA;
        }
        default:
          return 0;
      }
    });

    return sorted;
  }, [applications, statusFilter, sortOption, activeFilters]);

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
    <div className="min-h-screen overflow-x-hidden">
      <div className="fixed inset-0 -z-10 bg-gray-default" />
      {/* Banner Section with Header and Search */}
      <Banner variant="appliedJobs" onSearch={handleSearch} />

      {/* Main Container with VH layout below banner */}
      <div className="mt-[200px] min-h-screen bg-gray-default">
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
        <aside className="hidden laptop:block fixed left-0 top-[200px] mobile-M:top-[205px] mobile-L:top-[210px] tablet:top-[220px] laptop:top-[200px] laptop-L:top-[200px] bottom-0 w-[180px] laptop-L:w-[200px] z-20 px-3 bg-transparent">
          <StatsSection 
            stats={stats} 
            variant="appliedJobs" 
            loading={loading} 
            error={statsError} 
            onStatClick={handleStatFilter}
          />
        </aside>

        {/* Filter Section - Desktop Only (rightmost, no margin, full height) */}
        <aside className="hidden laptop:block fixed right-0 top-[200px] mobile-M:top-[205px] mobile-L:top-[210px] tablet:top-[220px] laptop:top-[200px] laptop-L:top-[200px] bottom-0 w-[280px] bg-white shadow-lg z-40 border-l border-gray-200 flex flex-col pointer-events-auto">
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
            variant="appliedJobs"
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
                onOpen={handleOpenJobView}
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
        variant="appliedJobs"
      />

      {/* Job Post View Modal */}
      <JobPostViewModal
        isOpen={isJobViewOpen}
        onClose={() => { setSelectedApplicationId?.(null, false); setIsJobViewOpen(false); }}
        job={selectedJob}
      />
    </div>
  );
}