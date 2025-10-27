// src/app/manage-job-posts/page.tsx
"use client";

import { useEffect, useState, useMemo } from 'react';
import Banner from '@/components/ui/Banner';
import ApplicantsModal from '@/components/modals/ApplicantsViewModal';
import JobPostViewModal, { JobPostViewData } from '@/components/modals/JobPostViewModal';
import { ViewToggle } from '@/components/ui/ViewToggle';
import { ManageJobPostCard } from '@/components/cards/ManageJobPostCard';
import { ManageJobPostList } from '@/components/cards/ManageJobPostList';
import type { Post } from '@/lib/models/posts';
import { PostService } from '@/lib/services/posts-services';
import { ApplicationService } from '@/lib/services/applications-services';
import Sort from '@/components/ui/Sort';
import JobPostAddModal from '@/components/modals/JobPostAddModal';
import JobPostEditModal from '@/components/modals/JobPostEditModal';
import { JobType, SubTypes } from '@/lib/constants/job-types';
import type { JobPostAddFormData } from '@/components/modals/JobPostAddModal';
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
    createdAt: string;
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
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPostViewData | null>(null);
  const [selectedApplicants, setSelectedApplicants] = useState<{ title: string; applicantCount: number; postId?: string } | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editInitial, setEditInitial] = useState<Partial<JobPostAddFormData> & { subTypes?: string[] } | undefined>(undefined);
  const [sortValue, setSortValue] = useState<'latest' | 'oldest'>('latest');
  const [editKey, setEditKey] = useState<string>('');

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
    createdAt: post.createdAt,
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
      <Banner variant="manageJobPosts" onSearch={handleSearch} onPostClick={() => setIsAddOpen(true)} />

      <main className="pl-4 pr-4 pb-8 pt-2">

        {/* Job Posts Section */}
        <div className="mt-2 space-y-6">
          {/* Controls */}
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

          {/* Display */}
          {loading ? (
            <div className="max-w-screen-2xl mx-auto bg-white rounded-lg shadow-md p-6 text-center text-gray-600">Loading posts…</div>
          ) : error ? (
            <div className="max-w-screen-2xl mx-auto bg-white rounded-lg shadow-md p-6 text-center text-red-600">{error}</div>
          ) : posts.length === 0 ? (
            <div className="max-w-screen-2xl mx-auto bg-white rounded-lg shadow-md p-6 text-center text-gray-600">No posts yet.</div>
          ) : viewMode === 'card' ? (
            <div className="w-full flex justify-center">
              <div className="flex flex-wrap items-start justify-center gap-5">
                {displayPosts.map((jobPost) => (
                  <ManageJobPostCard 
                    key={jobPost.id} 
                    jobData={jobPost} 
                    onOpen={(data) => { setSelectedJob(data); setIsJobViewOpen(true); }}
                    onViewApplicants={handleOpenApplicants}
                    onEdit={(data) => {
                      const rawTags = data.jobTypeTags ?? [];
                      const tags = rawTags.map(t => (t ?? '').trim()).filter(t => t.length > 0);

                      const allJobTypes = Object.values(JobType).filter((jt) => jt !== JobType.OTHER);
                      const directJobTypes = Array.from(new Set(
                        tags
                          .map((t) => t.toLowerCase())
                          .filter((tLower) => allJobTypes.some((jt) => jt.toLowerCase() === tLower))
                          .map((tLower) => allJobTypes.find((jt) => jt.toLowerCase() === tLower)!)
                      ));

                      const validSubTypes = Array.from(new Set(
                        tags
                          .filter((t) => t.toLowerCase() !== 'other')
                          .map((t) => t.toLowerCase())
                          .map((tLower) => {
                            for (const jt of Object.values(JobType)) {
                              const match = (SubTypes[jt] || []).find((s) => s.toLowerCase() === tLower);
                              if (match) return match; // canonical subtype label
                            }
                            return null;
                          })
                          .filter((v): v is string => !!v)
                      ));

                      const inferredFromSubs = Array.from(new Set(
                        Object.entries(SubTypes)
                          .filter(([, subs]) => validSubTypes.some((s) => subs.includes(s)))
                          .map(([jt]) => jt)
                      ));

                      const jobTypes = Array.from(new Set([...directJobTypes, ...inferredFromSubs]));

                      const numericSalary = (data.salary || '').replace(/[^0-9.]/g, '');
                      setEditInitial({
                        title: data.title,
                        jobTypes,
                        experienceLevels: data.experienceTags ?? [],
                        genders: data.genderTags ?? [],
                        country: 'Philippines',
                        province: 'Cebu',
                        city: 'Cebu City',
                        address: '',
                        salary: numericSalary,
                        salaryPeriod: (data.salaryPeriod as any) || 'day',
                        about: data.description,
                        qualifications: '',
                        subTypes: validSubTypes,
                      });
                      setEditKey(`${data.id}-${Date.now()}`);
                      setIsEditOpen(true);
                    }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <div className="flex flex-col items-start gap-4 w-[1840px] mx-auto">
                {displayPosts.map((jobPost) => (
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
