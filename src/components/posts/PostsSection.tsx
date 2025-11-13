"use client";

import React from "react";
import { ViewToggle } from "@/components/ui/ViewToggle";
import { JobPostCard } from "@/components/cards/JobPostCard";
import { JobPostList } from "@/components/cards/JobPostList";
import { ManageJobPostCard } from "@/components/cards/ManageJobPostCard";
import { ManageJobPostList } from "@/components/cards/ManageJobPostList";
import type { JobPostData } from "@/hooks/useJobPosts";

type Variant = "find" | "manage";

interface Props {
  jobs: JobPostData[];
  variant?: Variant;
  loading?: boolean;
  isLoadingMore?: boolean;
  error?: string | null;
  hasMore?: boolean;
  viewMode: "card" | "list";
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
      {viewMode === "card" ? (
        <div className="w-full">
          <div className={`${isManage ? 'w-full flex flex-wrap items-start justify-start gap-5' : 'max-w-[1648px] mx-auto flex flex-wrap items-start justify-start gap-4'}`}>
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
        <div className="w-full overflow-x-hidden">
          <div className={`flex flex-col items-start gap-4 mx-auto w-full`}>
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