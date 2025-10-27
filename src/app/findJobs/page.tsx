"use client";

import { useEffect, useState, useMemo } from "react";
import Banner from "@/components/ui/Banner";
import ViewProfileModal from "@/components/modals/ViewProfileModal";
import JobPostViewModal, { JobPostViewData } from "@/components/modals/JobPostViewModal";
import { ViewToggle } from "@/components/ui/ViewToggle";
import { JobPostCard } from "@/components/cards/JobPostCard";
import { StatCardFindJobs } from "@/components/cards/StatCardFindJobs";
import { JobPostList } from "@/components/cards/JobPostList";
import { PostService } from "@/lib/services/posts-services";
import { ApplicationService } from "@/lib/services/applications-services";
import { Post } from "@/lib/models/posts";
import Sort from "@/components/ui/Sort";

export default function FindJobsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isJobViewOpen, setIsJobViewOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPostViewData | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [appCounts, setAppCounts] = useState<Record<string, number>>({});
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

  const handleSearch = async (query: string, location?: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await PostService.getAllPosts({ searchTerm: query, location });
      setPosts(result.posts);
    } catch (err) {
      setError("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadInitial = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await PostService.getAllPosts();
        setPosts(result.posts);
      } catch (err) {
        setError("Failed to load posts");
      } finally {
        setLoading(false);
      }
    };
    loadInitial();
  }, []);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const entries = await Promise.all(
          posts.map(async (p) => {
            try {
              const count = await ApplicationService.getTotalApplicationsByPostIdCount(p.postId);
              return [p.postId, count] as const;
            } catch {
              return [p.postId, 0] as const;
            }
          })
        );
        setAppCounts(Object.fromEntries(entries));
      } catch {
        // ignore count errors
      }
    };

    if (posts.length) {
      fetchCounts();
    }
  }, [posts]);

  const formatPeso = (amount: number) => {
    return amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatPostedDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' });
    } catch {
      return iso;
    }
  };

  const postToJobData = (post: Post): JobPostViewData => {
    return {
      id: post.postId,
      title: post.title,
      description: post.description,
      location: post.location,
      salary: formatPeso(post.price),
      salaryPeriod: 'month',
      postedDate: formatPostedDate(post.createdAt),
      applicantCount: appCounts[post.postId] || 0,
      genderTags: [],
      experienceTags: [],
      jobTypeTags: [post.type, ...(post.subType || [])],
    };
  };

  return (
    <div className="min-h-screen">
      {/* Banner Section with Header and Search */}
      <Banner variant="findJobs" onSearch={handleSearch} />

      <main className="pl-4 pr-4 pb-8 pt-[240px]">
        {/* Stats Row */}
        <div className="w-full mb-6">
          <div className="max-w-screen-2xl mx-auto flex flex-wrap md:flex-nowrap items-stretch gap-4 justify-center md:justify-between">
            <StatCardFindJobs title="Total Jobs" variant="blue" />
            <StatCardFindJobs title="Completed" variant="green" />
            <StatCardFindJobs title="Ratings" variant="yellow" />
            <StatCardFindJobs title="Posted" variant="red" />
          </div>
        </div>

        {/* Job Posts Section */}
        <div className="mt-8 space-y-6">
          {/* Controls */}
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

          {/* Display */}
          {loading ? (
            <div className="text-center py-8">Loading job posts...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">{error}</div>
          ) : displayPosts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No job posts available.</div>
          ) : viewMode === 'card' ? (
            <div className="w-full flex justify-center">
              <div className="flex flex-wrap items-start justify-center gap-5">
                {displayPosts.map((post) => {
                  const jd = postToJobData(post);
                  return (
                    <JobPostCard
                      key={post.postId}
                      jobData={jd as any}
                      onOpen={(data) => { setSelectedJob(data as JobPostViewData); setIsJobViewOpen(true); }}
                      onApply={(id) => console.log('apply', id)}
                    />
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <div className="flex flex-col items-start gap-4 w-[1526px] mx-auto">
                {displayPosts.map((post) => {
                  const jd = postToJobData(post);
                  return (
                    <JobPostList
                      key={post.postId}
                      jobData={jd as any}
                      onOpen={(data) => { setSelectedJob(data as JobPostViewData); setIsJobViewOpen(true); }}
                      onApply={(id) => console.log('apply', id)}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
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
