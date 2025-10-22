// src/app/manage-job-posts/page.tsx
"use client";

import { useEffect, useState } from 'react';
import Banner from '@/components/ui/Banner';
import ApplicantsModal from '@/components/modals/ApplicantsModal';
import JobPostViewModal, { JobPostViewData } from '@/components/modals/JobPostViewModal';
import { ViewToggle } from '@/components/ui/ViewToggle';
import { ManageJobPostCard } from '@/components/cards/ManageJobPostCard';
import { ManageJobPostList } from '@/components/cards/ManageJobPostList';
import type { Post } from '@/lib/models/posts';
import { PostService } from '@/lib/services/posts-services';
import { ApplicationService } from '@/lib/services/applications-services';
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

  const [posts, setPosts] = useState<ManageJobData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [isJobViewOpen, setIsJobViewOpen] = useState(false);
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

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await PostService.getAllPosts();
        const posts: Post[] = result?.posts || [];
        const counts = await Promise.all(posts.map(p => ApplicationService.getTotalApplicationsByPostIdCount(p.postId).catch(() => 0)));
        const mapped = posts.map((p, idx) => postToManageData(p, counts[idx] ?? 0));
        setPosts(mapped);
      } catch (err: any) {
        setError(err?.message || 'Failed to load posts');
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  const handleSearch = (query: string, location?: string) => {
    console.log('Search query:', query);
    if (location) {
      console.log('Location:', location);
    }
    // Add your search logic here
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleOpenApplicants = (data: { id: string; title: string; applicantCount?: number }) => {
    setSelectedApplicants({ title: data.title, applicantCount: data.applicantCount ?? 0, postId: data.id });
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen">
      {/* Banner Section with Header and Search */}
      <Banner variant="manageJobPosts" onSearch={handleSearch} />

      <main className="pl-4 pr-4 pb-8 pt-8">
        {/* Container matching Find Jobs layout */}
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Manage Job Posts</h1>
          <p className="text-lg text-gray-600 mb-6">
            This is the Manage Job Posts page. Content coming soon...
          </p>

          {/* View Applicants Button */}
          <button
            onClick={openModal}
            className="px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
          >
            View Applicants
          </button>
        </div>

        {/* Job Posts Section */}
        <div className="mt-8 space-y-6">
          {/* Controls */}
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">View:</span>
              <ViewToggle value={viewMode} onChange={setViewMode} />
            </div>
          </div>

          {/* Display */}
          {loading ? (
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 text-center text-gray-600">Loading posts…</div>
          ) : error ? (
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 text-center text-red-600">{error}</div>
          ) : posts.length === 0 ? (
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 text-center text-gray-600">No posts yet.</div>
          ) : viewMode === 'card' ? (
            <div className="w-full flex justify-center">
              <div className="flex flex-wrap items-start justify-center gap-5">
                {posts.map((jobPost) => (
                  <ManageJobPostCard 
                    key={jobPost.id} 
                    jobData={jobPost} 
                    onOpen={(data) => { setSelectedJob(data); setIsJobViewOpen(true); }}
                    onViewApplicants={handleOpenApplicants}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <div className="flex flex-col items-start gap-4 w-[1840px] mx-auto">
                {posts.map((jobPost) => (
                  <ManageJobPostList 
                    key={jobPost.id} 
                    jobData={jobPost} 
                    onOpen={(data) => { setSelectedJob(data); setIsJobViewOpen(true); }}
                    onViewApplicants={handleOpenApplicants}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal */}
        <ApplicantsModal isOpen={isModalOpen} onClose={closeModal} title={selectedApplicants?.title ?? 'Applicants'} applicantCount={selectedApplicants?.applicantCount ?? 0} postId={selectedApplicants?.postId} />
        <JobPostViewModal 
          isOpen={isJobViewOpen} 
          onClose={() => setIsJobViewOpen(false)} 
          job={selectedJob}
          onApply={(id) => console.log('apply', id)}
        />
      </main>
    </div>
  );
}
