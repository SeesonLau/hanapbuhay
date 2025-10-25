"use client";

import { useState, useEffect } from "react";
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Banner from "@/components/ui/Banner";
import ViewProfileModal from "@/components/modals/ViewProfileModal";
import JobPostViewModal, { JobPostViewData } from "@/components/modals/JobPostViewModal";
import { StatCardFindJobs } from "@/components/cards/StatCardFindJobs";
import StatsSection from '@/components/sections/StatsSection';
import { useStats } from '@/hooks/useStats';
import { AuthService } from '@/lib/services/auth-services';
import { ApplicationService } from '@/lib/services/applications-services';
import PostsSection from '@/components/posts/PostsSection';
import { useJobPosts } from '@/hooks/useJobPosts';

export default function FindJobsPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isJobViewOpen, setIsJobViewOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPostViewData | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [user, setUser] = useState<any | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const { jobs, loading, isLoadingMore, error, hasMore, handleSearch, loadMore } = useJobPosts();

  const { stats, loading: statsLoading, error: statsError } = useStats({ variant: 'findJobs', userId });

  useEffect(() => {
    const getUser = async () => {
      const current = await AuthService.getCurrentUser();
      if (current) {
        setUser(current);
        setUserId(current.id);
      }
    };
    getUser();
  }, []);

  const handleApply = async (jobId: string) => {
    if (!userId) {
      toast.error('Please log in to apply for jobs');
      router.push('/auth/login');
      return;
    }

    try {
      await ApplicationService.createApplication(jobId, userId);
      toast.success('Application submitted successfully!');
      setIsJobViewOpen(false);
    } catch (error) {
      console.error('Error applying to job:', error);
    }
  };

  return (
    <div className="min-h-screen">
  {/* Banner Section with Header and Search */}
  <Banner variant="findJobs" onSearch={handleSearch} userName={user?.name ?? user?.email ?? user?.id} />

      <main className="pl-4 pr-4 pb-8 pt-8">
        {/* Stats Row */}
        <StatsSection stats={stats} variant="findJobs" loading={statsLoading} error={statsError} />

        <PostsSection
          jobs={jobs as any}
          variant="find"
          loading={loading}
          isLoadingMore={isLoadingMore}
          error={error}
          hasMore={hasMore}
          viewMode={viewMode}
          onViewModeChange={(v) => setViewMode(v)}
          onLoadMore={loadMore}
          onOpen={(data) => { setSelectedJob(data as JobPostViewData); setIsJobViewOpen(true); }}
          onApply={handleApply}
        />
      </main>

      {/* Modal */}
      <ViewProfileModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <JobPostViewModal
        isOpen={isJobViewOpen}
        onClose={() => setIsJobViewOpen(false)}
        job={selectedJob}
        onApply={handleApply}
      />
    </div>
  );
}
