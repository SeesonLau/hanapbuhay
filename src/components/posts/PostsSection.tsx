"use client";

import React from "react";
import { HiArrowDown } from "react-icons/hi";
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
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = React.useState(false);
  const [isAtBottom, setIsAtBottom] = React.useState(false);

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

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el || viewMode !== "card") return;

    setIsScrollable(el.scrollHeight > el.clientHeight);

    const handleScroll = () => {
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 10;
      setIsAtBottom(atBottom);
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [jobs, viewMode]);

  if (loading && (!jobs || jobs.length === 0)) return <div className="text-center py-8">Loading job posts...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;
  if (!jobs || jobs.length === 0) return <div className="text-center py-8 text-gray-500">No job posts available.</div>;

  const isManage = variant === "manage";

  return (
    <div className="mt-8 space-y-6 relative">
      {viewMode === "card" ? (
        <div className="relative">
          <div
            ref={scrollRef}
            className="max-h-[600px] overflow-y-auto scrollbar-hide py-2 px-2 snap-y snap-mandatory scroll-smooth"
            style={{ scrollPaddingTop: "0.5rem", scrollPaddingBottom: "0.5rem" }}
          >
            <div 
              className={`${
                isManage
                  ? 'w-full grid grid-cols-1 mobile-L:grid-cols-2 tablet:grid-cols-3 laptop-L:grid-cols-4 gap-5'
                  : 'w-full grid grid-cols-1 tablet:grid-cols-2 laptop-L:grid-cols-3 gap-4 justify-items-center'
              }`}
              style={{
                gridAutoRows: 'min-content'
              }}
            >
              {jobs.map((job) => (
                <div key={job.id} className="snap-start">
                  {isManage ? (
                    <ManageJobPostCard
                      jobData={job as any}
                      onOpen={onOpen}
                      onViewApplicants={onViewApplicants}
                      onEdit={(data) => onEdit?.(((data as any).raw) ?? data)}
                      onDelete={(data) => onDelete?.(((data as any).raw) ?? data)}
                    />
                  ) : (
                    <JobPostCard jobData={job as any} onOpen={onOpen} onApply={onApply} />
                  )}
                </div>
              ))}
            </div>
            {hasMore && jobs.length > 0 && !isLoadingMore && (
              <div ref={observerTarget} className="w-full flex justify-center items-center py-6 snap-start">
                <button
                  onClick={onLoadMore}
                  className="flex flex-col items-center gap-2 px-6 py-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border-none bg-transparent"
                >
                  <HiArrowDown className="w-6 h-6 text-primary-primary500 animate-bounce" />
                  <span className="text-small text-gray-neutral600 font-medium">Scroll for more</span>
                </button>
              </div>
            )}
            {hasMore && jobs.length > 0 && isLoadingMore && (
              <div className="w-full text-center py-4 snap-start">
                <div className="text-gray-600">Loading more job posts...</div>
              </div>
            )}
            {!hasMore && jobs.length > 0 && (
              <div className="w-full text-center py-4 text-gray-500 snap-start">
              </div>
            )}
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
          {hasMore && jobs.length > 0 && !isLoadingMore && (
            <div ref={observerTarget} className="w-full flex justify-center items-center py-6">
              <div className="flex flex-col items-center gap-2">
                <HiArrowDown className="w-6 h-6 text-primary-primary500 animate-bounce" />
                <span className="text-small text-gray-neutral600"></span>
              </div>
            </div>
          )}
          {hasMore && jobs.length > 0 && isLoadingMore && (
            <div className="w-full text-center py-4">
              <div className="text-gray-600">Loading more job posts...</div>
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