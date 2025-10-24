// src/app/manage-job-posts/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import Banner from '@/components/ui/Banner';
import ApplicantsModal from '@/components/modals/ApplicantsModal';
import JobPostViewModal, { JobPostViewData } from '@/components/modals/JobPostViewModal';
import PostsSection from '@/components/posts/PostsSection';
import { PostForm } from '@/components/mock/posts/PostForm';
import { useJobPosts } from '@/hooks/useJobPosts';
import { AuthService } from '@/lib/services/auth-services';
import { Post } from '@/lib/models/posts';
import { PostService } from '@/lib/services/posts-services';
import { DeleteModal } from '@/components/ui/DeleteModal';
// Removed toggle and card/list for simplified page per request

export default function ManageJobPostsPage() {
  type ManageJobData = {
    id: string;
    title: string;
    description: string;
    location: string;
    salary: string;
    salaryPeriod: string;
    postedDate: string;
    applicantCount?: number;
    genderTags?: string[];
    experienceTags?: string[];
    jobTypeTags?: string[];
  };

  const [user, setUser] = useState<any | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const { jobs, loading, isLoadingMore, error, hasMore, handleSearch, loadMore, refresh } = useJobPosts(userId);
  
  const [showPostForm, setShowPostForm] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [isJobViewOpen, setIsJobViewOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPostViewData | null>(null);
  const [selectedApplicants, setSelectedApplicants] = useState<{ title: string; applicantCount: number; postId: string } | null>(null);
  const [isProcessingDelete, setIsProcessingDelete] = useState(false);

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

  // handleSearch from hook will handle fetching

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleOpenApplicants = (data: { id: string; title: string; applicantCount?: number }) => {
    setSelectedApplicants({ title: data.title, applicantCount: data.applicantCount ?? 0, postId: data.id });
    setIsModalOpen(true);
  };

  const handleCreatePost = () => {
    setSelectedPost(null);
    setShowPostForm(true);
  };

  const handleEditPost = (post: Post) => {
    /*setSelectedPost(post);
    setShowPostForm(true);*/
  };

  const handlePostSaved = () => {
    setShowPostForm(false);
    setSelectedPost(null);
    refresh(); // Refresh the posts list
  };

  const handleFormCancel = () => {
    setShowPostForm(false);
    setSelectedPost(null);
  };

  const handleDeletePost = async (post: Post) => {
    /*if (!userId) return;
    
    setIsProcessingDelete(true);
    try {
      await PostService.deletePost(post.postId, userId);
      toast.success('Post deleted successfully');
      refresh(); // Refresh the posts list
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    } finally {
      setIsProcessingDelete(false);
    }*/
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
    userName={user?.name ?? user?.email ?? user?.id} 
  />

      <main className="pl-4 pr-4 pb-8 pt-8">
        {/* Delete Modal */}
        <DeleteModal
          isOpen={!!postToDelete}
          title="Delete Post"
          description="Are you sure you want to delete this post? This action cannot be undone."
          confirmText="Delete"
          variant="trash"
          isProcessing={isProcessingDelete}
          onConfirm={() => {
            if (postToDelete) {
              handleDeletePost(postToDelete);
              setPostToDelete(null);
            }
          }}
          onClose={() => !isProcessingDelete && setPostToDelete(null)}
        />

        <PostsSection
          jobs={jobs as any}
          variant="manage"
          loading={loading}
          isLoadingMore={isLoadingMore}
          error={error}
          hasMore={hasMore}
          viewMode={viewMode}
          onViewModeChange={(v) => setViewMode(v)}
          onLoadMore={loadMore}
          onOpen={(data) => { setSelectedJob(data); setIsJobViewOpen(true); }}
          onViewApplicants={handleOpenApplicants}
          onEdit={handleEditPost}
          onDelete={(post: Post) => setPostToDelete(post)}
        />

        {/* Modal */}
        <ApplicantsModal isOpen={isModalOpen} onClose={closeModal} title={selectedApplicants?.title ?? 'Applicants'} applicantCount={selectedApplicants?.applicantCount ?? 0} postId={selectedApplicants?.postId} />
        <JobPostViewModal 
          isOpen={isJobViewOpen} 
          onClose={() => setIsJobViewOpen(false)} 
          job={selectedJob}
        />
      </main>
    </div>
  );
}
