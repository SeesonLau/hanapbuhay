"use client";

import { useState, useEffect } from "react";
import Banner from "@/components/ui/Banner";
import ViewProfileModal from "@/components/modals/ViewProfileModal";
import JobPostViewModal, { JobPostViewData } from "@/components/modals/JobPostViewModal";
import { StatCardFindJobs } from "@/components/cards/StatCardFindJobs";
import StatsSection from '@/components/sections/StatsSection';
import { useStats } from '@/hooks/useStats';
import { AuthService } from '@/lib/services/auth-services';
import PostsSection from '@/components/posts/PostsSection';
import { useJobPosts } from '@/hooks/useJobPosts';

export default function FindJobsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isJobViewOpen, setIsJobViewOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPostViewData | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [user, setUser] = useState<any | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const { jobs, loading, error, handleSearch } = useJobPosts();

  const { stats, loading: statsLoading, error: statsError } = useStats({ variant: 'findJobs', userId });

  useEffect(() => {
    const getUser = async () => {
      const current = await AuthService.getCurrentUser();
      setUser(current ?? null);
      setUserId(current?.id ?? null);
    };
    getUser();
  }, []);

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
          error={error}
          viewMode={viewMode}
          onViewModeChange={(v) => setViewMode(v)}
          onOpen={(data) => { setSelectedJob(data as JobPostViewData); setIsJobViewOpen(true); }}
          onApply={(id) => console.log('apply', id)}
        />
      </main>

      {/* Modal */}
      <ViewProfileModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <JobPostViewModal
        isOpen={isJobViewOpen}
        onClose={() => setIsJobViewOpen(false)}
        job={selectedJob}
        onApply={(id) => console.log('apply', id)}
      />
    </div>
  );
}
