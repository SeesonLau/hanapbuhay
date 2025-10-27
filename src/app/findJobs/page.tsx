"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Banner from "@/components/ui/Banner";
import ViewProfileModal from "@/components/modals/ViewProfileModal";
import JobPostViewModal, { JobPostViewData } from "@/components/modals/JobPostViewModal";
import { ViewToggle } from "@/components/ui/ViewToggle";
import { StatCardFindJobs } from "@/components/cards/StatCardFindJobs";
import StatsSection from '@/components/sections/StatsSection';
import { useStats } from '@/hooks/useStats';
import { AuthService } from '@/lib/services/auth-services';
import { ApplicationService } from '@/lib/services/applications-services';
import PostsSection from '@/components/posts/PostsSection';
import { useJobPosts } from '@/hooks/useJobPosts';
import Sort from "@/components/ui/Sort";

export default function FindJobsPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isJobViewOpen, setIsJobViewOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPostViewData | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [appCounts, setAppCounts] = useState<Record<string, number>>({});
  const [user, setUser] = useState<any | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const { jobs, loading, isLoadingMore, error, hasMore, handleSearch, loadMore } = useJobPosts();

  const { stats, loading: statsLoading, error: statsError } = useStats({ variant: 'findJobs', userId });

  const [sortValue, setSortValue] = useState<string>('latest');

  // Derived posts based on sort selection
  const displayPosts = useMemo(() => {
    const sorted = [...posts];
    switch (sortValue) {
      case 'latest':
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'salary-asc':
        sorted.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case 'salary-desc':
        sorted.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      case 'nearby':
        sorted.sort((a, b) => String(a.location).localeCompare(String(b.location)));
        break;
      default:
        break;
    }
    return sorted;
  }, [posts, sortValue]);

  const handleSortChange = (opt: any) => {
    setSortValue(String(opt?.value ?? 'latest'));
  };

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
  <Banner variant="findJobs" onSearch={handleSearch} />

      <main className="pl-4 pr-4 pb-8 pt-8">
        {/* Stats Row */}
        <StatsSection stats={stats} variant="findJobs" loading={statsLoading} error={statsError} />

        <div className="max-w-screen-2xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Showing: {displayPosts.length}</span>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Sort by</span>
              <Sort variant="findJobs" onChange={handleSortChange} />
              <ViewToggle value={viewMode} onChange={setViewMode} />
            </div>
          </div>
        </div>

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
