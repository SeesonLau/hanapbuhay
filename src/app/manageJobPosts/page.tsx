// src/app/manage-job-posts/page.tsx
"use client";

import { useEffect, useState } from 'react';
import Banner from '@/components/ui/Banner';
import ApplicantsModal from '@/components/modals/ApplicantsModal';
import JobPostViewModal, { JobPostViewData } from '@/components/modals/JobPostViewModal';
import PostsSection from '@/components/posts/PostsSection';
import { useJobPosts } from '@/hooks/useJobPosts';
import { AuthService } from '@/lib/services/auth-services';
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
  const { jobs, loading, error, handleSearch, refresh } = useJobPosts(userId);

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


  useEffect(() => {
    const init = async () => {
  const current = await AuthService.getCurrentUser();
  setUser(current ?? null);
  setUserId(current?.id ?? null);
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

  return (
    <div className="min-h-screen">
  {/* Banner Section with Header and Search */}
  <Banner variant="manageJobPosts" onSearch={handleSearch} userName={user?.name ?? user?.email ?? user?.id} />

      <main className="pl-4 pr-4 pb-8 pt-8">
        {/* Container matching Find Jobs layout */}

        <PostsSection
          jobs={jobs as any}
          variant="manage"
          loading={loading}
          error={error}
          viewMode={viewMode}
          onViewModeChange={(v) => setViewMode(v)}
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
      </main>
    </div>
  );
}
