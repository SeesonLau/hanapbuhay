// src/app/manage-job-posts/page.tsx
"use client";

import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Banner from '@/components/ui/Banner';
import AddButtonIcon from '@/assets/add.svg';
import StatsSection from '@/components/posts/StatsSection';
import { useStats } from '@/hooks/useStats';
import Sort from '@/components/ui/Sort';
import { ViewToggle } from '@/components/ui/ViewToggle';
import ApplicantsModal from '@/components/modals/ApplicantsViewModal';
import JobPostViewModal, { JobPostViewData } from '@/components/modals/JobPostViewModal';
import JobPostAddModal from '@/components/modals/JobPostAddModal';
import JobPostEditModal from '@/components/modals/JobPostEditModal';
import DeleteModal from '@/components/ui/DeleteModal';
import PostsSection from '@/components/posts/PostsSection';
import { Preloader, PreloaderMessages } from '@/components/ui/Preloader';
import { useJobPosts } from '@/hooks/useJobPosts';
import { AuthService } from '@/lib/services/auth-services';
import { Post } from '@/lib/models/posts';
import FilterSection, { FilterOptions } from '@/components/ui/FilterSection';
import FilterButton from '@/components/ui/FilterButton';
import FilterModal from '@/components/ui/FilterModal';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/hooks/useLanguage';

export default function ManageJobPostsPage() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<any | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const { jobs, loading, isLoadingMore, error, hasMore, handleSearch, handleSort, loadMore, refresh, deletePost, updatePost, createPost, toggleLockPost, applyFilters, setSelectedPostId, parseUrlParams, setSortInUrlForManage, updateQueryParams, sortValue } = useJobPosts(userId, { skip: !userId });
  const [initialLoading, setInitialLoading] = useState(true);
  const { stats, loading: statsLoading, error: statsError } = useStats({ variant: 'manageJobs', userId });
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRestrictionModalOpen, setIsRestrictionModalOpen] = useState(false);
  const [isApplicantsModalOpen, setIsApplicantsModalOpen] = useState(false);
  const [isJobViewOpen, setIsJobViewOpen] = useState(false);
  const [pendingPostId, setPendingPostId] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [hasPerformedInitialFetch, setHasPerformedInitialFetch] = useState(false);
  
  // View mode state
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
  
  // Selected item states
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isEditRestricted, setIsEditRestricted] = useState<boolean>(false);
  const [selectedJob, setSelectedJob] = useState<JobPostViewData | null>(null);
  const [selectedApplicants, setSelectedApplicants] = useState<{ title: string; applicantCount: number; postId: string } | null>(null);

  useEffect(() => {
    const init = async () => {
      setInitialLoading(true);
      try {
        const current = await AuthService.getCurrentUser();
        if (!current) {
          // Redirect to login if no user is found
          window.location.href = '/auth/login';
          return;
        }
        setUser(current);
        setUserId(current.id);
      } catch (error) {
        console.error('Error fetching user:', error);
        window.location.href = '/auth/login';
      } finally {
        setInitialLoading(false);
      }
    };
    init();
  }, []);

  // Handlers for modals
  const handleOpenApplicants = (data: { id: string; title: string; applicantCount?: number }) => {
    setSelectedApplicants({ title: data.title, applicantCount: data.applicantCount ?? 0, postId: data.id });
    setIsApplicantsModalOpen(true);
    updateQueryParams?.({ postId: data.id, action: 'applicants' });
  };

  const handleCreatePost = () => {
    // Ensure we are not carrying over a previously selected post
    setSelectedPost(null);
    setIsAddModalOpen(true);
  };

  const handleEditPost = async (post: Post) => {
    updateQueryParams?.({ postId: post.postId, action: 'edit' });
    try {
      setSelectedPost(post);
      const { ApplicationService } = await import('@/lib/services/applications-services');
      const count = await ApplicationService.getTotalApplicationsByPostIdCount(post.postId);
      if (count > 0) {
        setIsEditRestricted(true);
        setIsRestrictionModalOpen(true);
      } else {
        setIsEditRestricted(false);
        setIsEditModalOpen(true);
      }
    } catch (err) {
      setIsEditRestricted(false);
      setIsEditModalOpen(true);
    }
  };

  const handleDeletePost = (post: Post) => {
    setSelectedPost(post);
    setIsDeleteModalOpen(true);
  };

  // Stable sort change handler to avoid re-render loops
  const handleManageSortChange = useCallback((opt: any) => {
    const val = String(opt?.value ?? 'latest');
    setSortInUrlForManage?.(val);
  }, [setSortInUrlForManage]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    const jobTypeCount = Object.values(activeFilters.jobTypes).filter(Boolean).length;
    count += jobTypeCount;
    count += Object.values(activeFilters.salaryRange).filter(Boolean).length;
    count += Object.values(activeFilters.experienceLevel).filter(Boolean).length;
    count += Object.values(activeFilters.preferredGender).filter(Boolean).length;
    return count;
  }, [activeFilters]);

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

  const handlePostSaved = async (data?: any) => {
    // If editing an existing post, call updatePost from the hook
    try {
      // Use modal state to decide action. This avoids accidental updates when a previous selection lingers.
      if (isEditModalOpen && selectedPost && data) {
        // Map form data to Post partial fields
        const about = data.about ?? selectedPost.description ?? "";
        const qualifications = (data.qualifications ?? "").trim();
        const combinedDescription = qualifications
          ? `${about}\n\n[requirements]\n${qualifications}`
          : about;
          const payload: Partial<Post> = {
          title: data.title ?? selectedPost.title,
          description: combinedDescription,
          price: data.salary ? Number(String(data.salary).replace(/[^0-9.-]+/g, '')) : (selectedPost.price ?? 0),
          salaryType: data.salaryType,
          subType: Array.from(new Set([
            ...((data.subTypes ?? (data.jobTypes ?? selectedPost.subType)) || []),
            ...((data.experienceLevels ?? []) as string[]),
            ...((data.genders ?? []) as string[]),
          ])),
          location: (
            data.province || data.city || data.address
          )
            ? [
                data.province ?? '',
                data.city ?? '',
                (data.address ?? '').trim(),
              ]
                .filter(Boolean)
                .join(' > ')
            : selectedPost.location,
          updatedBy: userId as string,
        };

        await updatePost?.(selectedPost.postId, payload);
      } else if (isAddModalOpen && data) {
        // Creating new post
        try {
          const about = data.about ?? "";
          const qualifications = (data.qualifications ?? "").trim();
          const combinedDescription = qualifications
            ? `${about}\n\n[requirements]\n${qualifications}`
            : about;
          const payload: Omit<Post, 'postId' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'deletedBy'> = {
            userId: userId as string,
            title: data.title ?? "",
            description: combinedDescription,
            price: data.salary ? Number(String(data.salary).replace(/[^0-9.-]+/g, '')) : 0,
            salaryType: data.salaryType,
            type: (data.jobTypes && data.jobTypes[0]) || (data.subTypes && data.subTypes[0]) || 'other',
            subType: Array.from(new Set([
              ...((data.subTypes ?? (data.jobTypes ?? [])) || []),
              ...((data.experienceLevels ?? []) as string[]),
              ...((data.genders ?? []) as string[]),
            ])),
            location: [
              data.province ?? '',
              data.city ?? '',
              (data.address ?? '').trim(),
            ]
              .filter(Boolean)
              .join(' > '),
            imageUrl: '',
            isLocked: false,
            createdBy: userId as string,
            updatedBy: userId as string,
          };

          await createPost?.(payload);
        } catch (err) {
          console.error('Error creating post:', err);
        }
      }
    } catch (err) {
      console.error('Error saving post:', err);
    } finally {
      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
      setSelectedPost(null);
      refresh(); // Refresh the posts list
      updateQueryParams?.({ postId: undefined, action: undefined }, false);
    }
  };

  const handlePostDeleted = async () => {
    if (!selectedPost) return;
    try {
      await deletePost(selectedPost.postId);
      setIsDeleteModalOpen(false);
      refresh();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  // Handle deep linking for postId
  useEffect(() => {
    const postId = searchParams.get('postId');
    const action = searchParams.get('action');
    if (postId) {
      setPendingPostId(postId);
      setPendingAction(action);
      setSelectedPostId?.(postId);
    }
  }, [searchParams]);

  const prevLoading = useRef(loading);
  useEffect(() => {
    if (prevLoading.current && !loading) {
      setHasPerformedInitialFetch(true);
    }
    prevLoading.current = loading;
  }, [loading]);

  useEffect(() => {
    if (pendingPostId && hasPerformedInitialFetch && !loading) {
      const found = jobs.find((j) => j.id === pendingPostId);
      if (found) {
        if (pendingAction === 'applicants') {
          handleOpenApplicants({
            id: found.id,
            title: found.title,
            applicantCount: found.applicantCount
          });
        } else if (pendingAction === 'edit') {
          if (found.raw) {
            handleEditPost(found.raw);
          }
        } else {
          const data: JobPostViewData = {
            id: found.id,
            title: found.title,
            description: found.description,
            requirements: found.requirements ?? [],
            location: found.location ?? '',
            salary: String(found.salary).replace(/₱|,/g, ''),
            salaryPeriod: found.salaryPeriod ?? 'month',
            postedDate: found.postedDate ?? '',
            applicantCount: found.applicantCount ?? 0,
            genderTags: found.genderTags,
            experienceTags: found.experienceTags,
            jobTypeTags: found.jobTypeTags,
            raw: found.raw,
          };

          setSelectedJob(data);
          setIsJobViewOpen(true);
        }
        setPendingPostId(null);
        setPendingAction(null);
      } else {
        toast.error("Post not found or has been deleted.");
        updateQueryParams?.({ postId: undefined, action: undefined });
        setPendingPostId(null);
        setPendingAction(null);
      }
    }
  }, [jobs, pendingPostId, loading, hasPerformedInitialFetch, pendingAction]);

  // Show preloader while loading user data
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
      <Banner 
        variant="manageJobPosts" 
        onSearch={handleSearch} 
        onPostClick={handleCreatePost}
      />
      <div 
        className="mt-[200px] min-h-screen"
        style={{ backgroundColor: theme.colors.background }}
      >
        {/* Stats Section - fixed left on laptop, top on mobile/tablet */}
        <aside className="block laptop:hidden px-4 md:px-6">
          <StatsSection stats={stats} variant="manageJobs" loading={statsLoading} error={statsError} />
        </aside>

        {/* Stats Section - Desktop fixed left */}
        <aside 
          className="hidden laptop:block fixed left-0 top-[200px] mobile-M:top-[205px] mobile-L:top-[210px] tablet:top-[220px] laptop:top-[200px] laptop-L:top-[200px] bottom-0 w-[180px] laptop-L:w-[200px] z-20 px-3"
          style={{ backgroundColor: 'transparent' }}
        >
          <StatsSection stats={stats} variant="manageJobs" loading={statsLoading} error={statsError} />
        </aside>

        {/* Filter Section - Desktop Only (rightmost, fixed) */}
        <aside 
          className="hidden laptop:block fixed right-0 top-[200px] mobile-M:top-[205px] mobile-L:top-[210px] tablet:top-[220px] laptop:top-[200px] laptop-L:top-[200px] bottom-0 w-[280px] shadow-lg z-40 border-l flex flex-col pointer-events-auto transition-colors duration-300"
          style={{ 
            backgroundColor: theme.colors.sidebarBg,
            borderColor: theme.colors.borderLight 
          }}
        >
          {/* Sort & View Controls */}
          <div 
            className="flex-shrink-0 border-b px-3 py-2 z-10 transition-colors duration-300"
            style={{ 
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.borderLight 
            }}
          >
            <div className="flex items-center justify-between gap-3">
              {/* Sort By */}
              <div className="flex items-center gap-2">
                <span
                  className="text-small whitespace-nowrap font-medium"
                  style={{ color: theme.colors.textMuted }}
                >
                  {t.common.labels.sortBy}
                </span>
                <Sort variant="manageJobs" onChange={handleManageSortChange} value={sortValue} />
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
            variant="default"
          />
        </aside>

      <main className="w-full laptop:w-[calc(100%-460px)] laptop:ml-[180px] laptop-L:w-[calc(100%-480px)] laptop-L:ml-[200px]">
        <div className="px-4 md:px-6 laptop:px-6 pt-2 pb-6 max-w-full">
            <div className="space-y-4">
                {/* Controls Row with Filter Button - Mobile/Tablet Only */}
                <div 
                  className="laptop:hidden flex items-center justify-between gap-1.5 rounded-lg px-2 py-2 shadow-sm transition-colors duration-300"
                  style={{ backgroundColor: theme.colors.surface }}
                >
                    {/* Filter Button */}
                    <FilterButton
                        onClick={() => setIsFilterModalOpen(true)}
                        filterCount={activeFilterCount}
                    />
                    {/* Sort By and View Toggle */}
                    <div className="flex items-center gap-1.5">
                        <span
                          className="text-tiny whitespace-nowrap hidden mobile-S:inline"
                          style={{ color: theme.colors.textMuted }}
                        >
                          {t.common.labels.sortBy}
                        </span>
                        <Sort variant="manageJobs" onChange={handleManageSortChange} value={sortValue} />
                        <ViewToggle value={viewMode} onChange={setViewMode} />
                    </div>
                </div>
                <PostsSection
                    jobs={jobs}
                    variant="manage"
                    loading={loading}
                    isLoadingMore={isLoadingMore}
                    error={error}
                    hasMore={hasMore}
                    viewMode={viewMode}
                    onViewModeChange={(v) => setViewMode(v)}
                    onLoadMore={loadMore as () => void}
                    onOpen={(data) => { updateQueryParams?.({ postId: data?.id, action: undefined }); setSelectedJob(data); setIsJobViewOpen(true); }}
                    onViewApplicants={handleOpenApplicants}
                    onEdit={handleEditPost}
                    onDelete={handleDeletePost}
                    onToggleLock={toggleLockPost}
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
        variant="default"
      />
      {/* Modals */}
      <JobPostAddModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handlePostSaved}
      />

      <JobPostEditModal
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); updateQueryParams?.({ postId: undefined, action: undefined }, false); }}
        onSubmit={handlePostSaved}
        post={selectedPost}
        isRestricted={isEditRestricted}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handlePostDeleted}
        modalType="deleteJobPost"
      />

      <ApplicantsModal 
        isOpen={isApplicantsModalOpen}
        onClose={() => { setIsApplicantsModalOpen(false); updateQueryParams?.({ postId: undefined, action: undefined }, false); }}
        title={selectedApplicants?.title ?? 'Applicants'}
        applicantCount={selectedApplicants?.applicantCount ?? 0}
        postId={selectedApplicants?.postId}
      />

      <DeleteModal
        isOpen={isRestrictionModalOpen}
        onClose={() => setIsRestrictionModalOpen(false)}
        onConfirm={() => { setIsRestrictionModalOpen(false); setIsEditModalOpen(true); }}
        modalType="restrictEditJobPost"
      />

      <JobPostViewModal 
        isOpen={isJobViewOpen} 
        onClose={() => { setIsJobViewOpen(false); updateQueryParams?.({ postId: undefined, action: undefined }, false); }}
        job={selectedJob}
      />

      {/* Floating Add Post Button - Mobile only */}
      <button
        aria-label="Add Post"
        onClick={handleCreatePost}
        className="laptop:hidden fixed bottom-6 right-6 z-40 bg-transparent shadow-none p-0 flex items-center justify-center"
      >
        <img 
          src={typeof AddButtonIcon === 'string' ? AddButtonIcon : (AddButtonIcon as any).src} 
          alt="Add" 
          className="w-16 h-16" 
          style={{ filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.25))' }}
        />
      </button>
    </div>
  );
}
