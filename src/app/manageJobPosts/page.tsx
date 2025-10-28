// src/app/manage-job-posts/page.tsx
"use client";

import { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import Banner from '@/components/ui/Banner';
import ApplicantsModal from '@/components/modals/ApplicantsModal';
import JobPostViewModal, { JobPostViewData } from '@/components/modals/JobPostViewModal';
import JobPostAddModal from '@/components/modals/JobPostAddModal';
import JobPostEditModal from '@/components/modals/JobPostEditModal';
import DeleteModal from '@/components/ui/DeleteModal';
import PostsSection from '@/components/posts/PostsSection';
import { Preloader, PreloaderMessages } from '@/components/ui/Preloader';
import { useJobPosts } from '@/hooks/useJobPosts';
import { AuthService } from '@/lib/services/auth-services';
import { Post } from '@/lib/models/posts';

export default function ManageJobPostsPage() {
  const [user, setUser] = useState<any | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const { jobs, loading, isLoadingMore, error, hasMore, handleSearch, loadMore, refresh, deletePost, updatePost, createPost } = useJobPosts(userId, { skip: !userId });
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isApplicantsModalOpen, setIsApplicantsModalOpen] = useState(false);
  const [isJobViewOpen, setIsJobViewOpen] = useState(false);
  
  // View mode state
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  
  // Selected item states
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
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
  };

  const handleCreatePost = () => {
    setIsAddModalOpen(true);
  };

  const handleEditPost = (post: Post) => {
    setSelectedPost(post);
    setIsEditModalOpen(true);
  };

  const handleDeletePost = (post: Post) => {
    setSelectedPost(post);
    setIsDeleteModalOpen(true);
  };

  const handlePostSaved = async (data?: any) => {
    // If editing an existing post, call updatePost from the hook
    try {
      if (selectedPost && data) {
        // Map form data to Post partial fields
        const payload: Partial<Post> = {
          title: data.title ?? selectedPost.title,
          description: data.about ?? selectedPost.description,
          // Price: try to parse numeric from string
          price: data.salary ? Number(String(data.salary).replace(/[^0-9.-]+/g, '')) : (selectedPost.price ?? 0),
          subType: data.subTypes ?? (data.jobTypes ?? selectedPost.subType),
          location: data.city ?? selectedPost.location,
        };

        await updatePost?.(selectedPost.postId, payload);
      } else if (!selectedPost && data) {
        // Creating new post
        try {
          const payload: Omit<Post, 'postId' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'deletedBy'> = {
            userId: userId as string,
            title: data.title ?? "",
            description: data.about ?? "",
            price: data.salary ? Number(String(data.salary).replace(/[^0-9.-]+/g, '')) : 0,
            type: (data.jobTypes && data.jobTypes[0]) || (data.subTypes && data.subTypes[0]) || 'other',
            subType: data.subTypes ?? (data.jobTypes ?? []),
            location: data.city ?? (data.province ?? ''),
            imageUrl: '',
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
    <div className="min-h-screen">
      {/* Banner Section with Header and Search */}
      <Banner 
        variant="manageJobPosts" 
        onSearch={handleSearch} 
        onPostClick={handleCreatePost}
      />

      <main className="pl-4 pr-4 pb-8 pt-[240px]">
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
          onOpen={(data) => { setSelectedJob(data); setIsJobViewOpen(true); }}
          onViewApplicants={handleOpenApplicants}
          onEdit={handleEditPost}
          onDelete={handleDeletePost}
        />

        {/* Modals */}
        <JobPostAddModal 
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handlePostSaved}
        />

        <JobPostEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handlePostSaved}
          post={selectedPost}
        />

        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handlePostDeleted}
          title="Delete Job Post"
          description="Are you sure you want to delete this job post? This action cannot be undone."
          confirmText="Delete"
          variant="trash"
        />

        <ApplicantsModal 
          isOpen={isApplicantsModalOpen}
          onClose={() => setIsApplicantsModalOpen(false)}
          title={selectedApplicants?.title ?? 'Applicants'}
          applicantCount={selectedApplicants?.applicantCount ?? 0}
          postId={selectedApplicants?.postId}
        />

        <JobPostViewModal 
          isOpen={isJobViewOpen} 
          onClose={() => setIsJobViewOpen(false)} 
          job={selectedJob}
        />
      </main>
    </div>
  );
}