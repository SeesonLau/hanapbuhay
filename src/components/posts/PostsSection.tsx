"use client";

import React from "react";
import { ViewToggle } from "@/components/ui/ViewToggle";
import { JobPostCard } from "@/components/cards/JobPostCard";
import { JobPostList } from "@/components/cards/JobPostList";
import { ManageJobPostCard } from "@/components/cards/ManageJobPostCard";
import { ManageJobPostList } from "@/components/cards/ManageJobPostList";
import type { JobPostData } from "@/hooks/useJobPosts";
import Sort from "@/components/ui/Sort";

type Variant = "find" | "manage";

interface Props {
  jobs: JobPostData[];
  variant?: Variant;
  loading?: boolean;
  isLoadingMore?: boolean;
  error?: string | null;
  hasMore?: boolean;
  viewMode: "card" | "list";
  onSortChange?: () => void;
  onViewModeChange: (v: "card" | "list") => void;
  onLoadMore?: () => void;
  onOpen?: (data: any) => void;
  onApply?: (id: string) => void;
  onViewApplicants?: (data: any) => void;
  onEdit?: (post: any) => void;
  onDelete?: (post: any) => void;
}

const PostsSection: React.FC<Props> = ({
  jobs,
  variant = "find",
  loading,
  isLoadingMore,
  error,
  hasMore,
  viewMode,
  onSortChange,
  onViewModeChange,
  onLoadMore,
  onOpen,
  onApply,
  onViewApplicants,
  onEdit,
  onDelete,
}) => {
  const observerTarget = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!onLoadMore || !hasMore || loading || isLoadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [onLoadMore, hasMore, loading, isLoadingMore]);

  if (loading && (!jobs || jobs.length === 0)) return <div className="text-center py-8">Loading job posts...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;
  if (!jobs || jobs.length === 0) return <div className="text-center py-8 text-gray-500">No job posts available.</div>;

  const isManage = variant === "manage";

  return (
    <div className="mt-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-small text-gray-neutral600 whitespace-nowrap">Showing: {jobs.length}</span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-small text-gray-neutral600 whitespace-nowrap">Sort by:</span>
            <Sort variant="findJobs" onChange={onSortChange} />
            <ViewToggle value={viewMode} onChange={onViewModeChange} />
          </div>
        </div>

      {viewMode === "card" ? (
        <div className="w-full flex justify-center">
          <div className="flex flex-wrap items-start justify-center gap-5">
            {jobs.map((job) => (
              isManage ? (
                <ManageJobPostCard
                  key={job.id}
                  jobData={job as any}
                  onOpen={onOpen}
                  onViewApplicants={onViewApplicants}
                  onEdit={(data) => onEdit?.(((data as any).raw) ?? data)}
                  onDelete={(data) => onDelete?.(((data as any).raw) ?? data)}
                />
              ) : (
                <JobPostCard key={job.id} jobData={job as any} onOpen={onOpen} onApply={onApply} />
              )
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full overflow-x-auto">
          <div className={`flex flex-col items-start gap-4 mx-auto ${viewMode === 'list' ? 'w-[1526px]' : ''}`}>
            {jobs.map((job) => (
              isManage ? (
                <ManageJobPostList
                  key={job.id}
                  jobData={job as any}
                  onOpen={onOpen}
                  onViewApplicants={onViewApplicants}
                  onEdit={(data) => onEdit?.(((data as any).raw) ?? data)}
                  onDelete={(data) => onDelete?.(((data as any).raw) ?? data)}
                />
              ) : (
                <JobPostList key={job.id} jobData={job as any} onOpen={onOpen} onApply={onApply} />
              )
            ))}
          </div>
          {hasMore && (
            <div ref={observerTarget} className="w-full text-center py-4">
              {isLoadingMore ? (
                <div className="text-gray-600">Loading more job posts...</div>
              ) : (
                <div className="text-gray-400">Scroll for more</div>
              )}
            </div>
          )}
          {!hasMore && jobs.length > 0 && (
            <div className="w-full text-center py-4 text-gray-500">
              You&apos;ve reached the end
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostsSection;