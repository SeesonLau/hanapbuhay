// src/app/manage-job-posts/page.tsx
"use client";

import { useEffect, useState, useCallback, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import Banner from '@/components/ui/Banner';
import ApplicantsModal from '@/components/modals/ApplicantsModal';
import JobPostViewModal, { JobPostViewData } from '@/components/modals/JobPostViewModal';
import { ViewToggle } from '@/components/ui/ViewToggle';
import PostsSection from '@/components/posts/PostsSection';
import { PostForm } from '@/components/mock/posts/PostForm';
import { useJobPosts } from '@/hooks/useJobPosts';
import { AuthService } from '@/lib/services/auth-services';
import { Post } from '@/lib/models/posts';
import Sort from '@/components/ui/Sort';
import JobPostAddModal from '@/components/modals/JobPostAddModal';
import JobPostEditModal from '@/components/modals/JobPostEditModal';
import { JobType, SubTypes } from '@/lib/constants/job-types';
import type { JobPostAddFormData } from '@/components/modals/JobPostAddModal';

export default function ManageJobPostsPage() {
  type ManageJobData = {
    id: string;
    title: string;
    description: string;
    location: string;
    salary: string;
    salaryPeriod: string;
    postedDate: string;
    createdAt: string;
    applicantCount?: number;
    genderTags?: string[];
    experienceTags?: string[];
    jobTypeTags?: string[];
  };

  const [posts, setPosts] = useState<ManageJobData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [user, setUser] = useState<any | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const { jobs, loading, isLoadingMore, error, hasMore, handleSearch, loadMore, refresh } = useJobPosts(userId);
  
  const [showPostForm, setShowPostForm] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [isJobViewOpen, setIsJobViewOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPostViewData | null>(null);
  const [selectedApplicants, setSelectedApplicants] = useState<{ title: string; applicantCount: number; postId: string } | null>(null);

  const formatPeso = (amount: number): string => {
    try {
      return amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } catch {
      return String(amount);
    }
  };

  const formatPostedDate = (iso: string): string => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const postToManageData = (post: Post, applicantCount = 0): ManageJobData => ({
    id: post.postId,
    title: post.title,
    description: post.description,
    location: post.location,
    salary: formatPeso(post.price),
    salaryPeriod: 'month',
    postedDate: formatPostedDate(post.createdAt),
    applicantCount,
    genderTags: [],
    experienceTags: [],
    jobTypeTags: post.subType || [],
  });

  const displayPosts = useMemo(() => {
    const sorted = [...posts];
    if (sortValue === 'latest') {
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }
    return sorted;
  }, [posts, sortValue]);

  const handleSortChange = (opt: any) => {
    setSortValue(String(opt?.value ?? 'latest') as 'latest' | 'oldest');
  };

  useEffect(() => {
    const init = async () => {
      const current = await AuthService.getCurrentUser();
      if (!current) {
        // Redirect to login if no user is found
        window.location.href = '/auth/login';
        return;
      }
      setUser(current);
      setUserId(current.id);
    };
    init();
  }, []);

  const closeModal = () => setIsModalOpen(false);

  const handleOpenApplicants = (data: { id: string; title: string; applicantCount?: number }) => {
    setSelectedApplicants({ title: data.title, applicantCount: data.applicantCount ?? 0, postId: data.id });
    setIsModalOpen(true);
  };

  const handleCreatePost = () => {
    setSelectedPost(null);
    setShowPostForm(true);
  };

  // Placeholder for edit handler

  const handlePostSaved = () => {
    setShowPostForm(false);
    setSelectedPost(null);
    refresh(); // Refresh the posts list
  };

  const handleFormCancel = () => {
    setShowPostForm(false);
    setSelectedPost(null);
  };

  if (showPostForm) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {selectedPost ? 'Edit Post' : 'Create New Post'}
          </h1>
          <button
            onClick={handleFormCancel}
            className="text-gray-600 hover:text-gray-800 px-3 py-1 rounded-md"
          >
            Cancel
          </button>
        </div>
        <PostForm
          post={selectedPost}
          onSubmit={handlePostSaved}
          onCancel={handleFormCancel}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
  {/* Banner Section with Header and Search */}
  <Banner 
    variant="manageJobPosts" 
    onSearch={handleSearch} 
    onPostClick={handleCreatePost}
  />

      <div className="w-full px-12 sm:px-12 md:px-16 lg:px-32">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Showing: {displayPosts.length}</span>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-gray-neutral400 text-small font-medium whitespace-nowrap">Sort by</span>
            <Sort variant="manageJobs" onChange={handleSortChange} />
            <ViewToggle value={viewMode} onChange={setViewMode} />
          </div>
        </div>
      </div>

      <main className="pl-4 pr-4 pb-8 pt-8">
        {/* Placeholder for delete modal */}        <PostsSection
          jobs={jobs}
          variant="manage"
          loading={loading}
          isLoadingMore={isLoadingMore}
          error={error}
          hasMore={hasMore}
          viewMode={viewMode}
          onViewModeChange={(v) => setViewMode(v)}
          onLoadMore={loadMore as () => void}
          onOpen={(data) => { setSelectedJob(data); setIsJobViewOpen(true); }}
          onViewApplicants={handleOpenApplicants}
        />

        {/* Modal */}
        <ApplicantsModal isOpen={isModalOpen} onClose={closeModal} title={selectedApplicants?.title ?? 'Applicants'} applicantCount={selectedApplicants?.applicantCount ?? 0} postId={selectedApplicants?.postId} />
        <JobPostViewModal 
          isOpen={isJobViewOpen} 
          onClose={() => setIsJobViewOpen(false)} 
          job={selectedJob}
        />
        <JobPostAddModal 
          isOpen={isAddOpen} 
          onClose={() => setIsAddOpen(false)}
          onSubmit={(data) => { console.log('New Job Post:', data); }}
        />
        <JobPostEditModal 
          key={editKey}
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          initialData={editInitial}
          onSubmit={(data) => { console.log('Edit Job Post:', data); }}
        />
      </main>
    </div>
  );
}
