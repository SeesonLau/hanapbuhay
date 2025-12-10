"use client";

import React from "react";
import { HiArrowDown } from "react-icons/hi";
import { JobPostCard } from "@/components/cards/JobPostCard";
import { JobPostList } from "@/components/cards/JobPostList";
import { ManageJobPostCard } from "@/components/cards/ManageJobPostCard";
import { ManageJobPostList } from "@/components/cards/ManageJobPostList";
import type { JobPostData } from "@/hooks/useJobPosts";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";

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
  onToggleLock?: (postId: string, isLocked: boolean) => void;
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
  onToggleLock,
}) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
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

  if (loading && (!jobs || jobs.length === 0)) {
    return (
      <div
        className="text-center py-8"
        style={{ color: theme.colors.textMuted }}
      >
        {variant === "manage"
          ? t.jobs.manageJobPosts.loadingJobPosts
          : t.jobs.findJobs.loadingJobPosts}
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="text-center py-8"
        style={{ color: theme.colors.error }}
      >
        {error}
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div
        className="text-center py-8"
        style={{ color: theme.colors.textMuted }}
      >
        {variant === "manage"
          ? t.jobs.manageJobPosts.noJobPostsAvailable
          : t.jobs.findJobs.noJobPostsAvailable}
      </div>
    );
  }

  const isManage = variant === "manage";

  return (
    <div className="mt-8 space-y-6 relative">
      {viewMode === "card" ? (
        <div className="relative">
          <div
            ref={scrollRef}
            className={"py-2 px-2"}
          >
            <div 
              className={`${
                isManage
                  ? 'w-full grid grid-cols-1 tablet:grid-cols-2 laptop-L:grid-cols-3 gap-5 items-stretch'
                  : 'w-full grid grid-cols-1 tablet:grid-cols-2 laptop-L:grid-cols-3 gap-4 items-stretch'
              }`}
              style={{
                gridAutoRows: 'min-content'
              }}
            >
              {jobs.map((job, idx) => (
                <div key={`${job.id}-${idx}`} className="snap-start h-full">
                  {isManage ? (
                    <ManageJobPostCard
                      jobData={job as any}
                      onOpen={onOpen}
                      onViewApplicants={onViewApplicants}
                      onEdit={(data) => onEdit?.(((data as any).raw) ?? data)}
                      onDelete={(data) => onDelete?.(((data as any).raw) ?? data)}
                      onToggleLock={onToggleLock}
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
                  className="flex flex-col items-center gap-2 px-6 py-4 rounded-lg transition-colors cursor-pointer border-none bg-transparent"
                  style={{
                    backgroundColor: 'transparent',
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = theme.colors.surfaceHover}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <HiArrowDown 
                    className="w-6 h-6 animate-bounce" 
                    style={{ color: theme.colors.primary }}
                  />
                  <span
                    className="text-small font-medium"
                    style={{ color: theme.colors.textMuted }}
                  >
                    {variant === "manage"
                      ? t.jobs.manageJobPosts.scrollForMore
                      : t.jobs.findJobs.scrollForMore}
                  </span>
                </button>
              </div>
            )}
            {hasMore && jobs.length > 0 && isLoadingMore && (
              <div
                className="w-full text-center py-4 snap-start"
                style={{ color: theme.colors.textMuted }}
              >
                {variant === "manage"
                  ? t.jobs.manageJobPosts.loadingMoreJobPosts
                  : t.jobs.findJobs.loadingMoreJobPosts}
              </div>
            )}
            {!hasMore && jobs.length > 0 && (
              <div 
                className="w-full text-center py-4 snap-start"
                style={{ color: theme.colors.textMuted }}
              >
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full overflow-x-hidden">
          <div className={`flex flex-col items-start gap-4 mx-auto w-full`}>
            {jobs.map((job, idx) => (
              isManage ? (
                <ManageJobPostList
                  key={`${job.id}-${idx}`}
                  jobData={job as any}
                  onOpen={onOpen}
                  onViewApplicants={onViewApplicants}
                  onEdit={(data) => onEdit?.(((data as any).raw) ?? data)}
                  onDelete={(data) => onDelete?.(((data as any).raw) ?? data)}
                  onToggleLock={onToggleLock}
                />
              ) : (
                <JobPostList key={`${job.id}-${idx}`} jobData={job as any} onOpen={onOpen} onApply={onApply} />
              )
            ))}
          </div>
          {hasMore && jobs.length > 0 && !isLoadingMore && (
            <div ref={observerTarget} className="w-full flex justify-center items-center py-6">
              <div className="flex flex-col items-center gap-2">
                <HiArrowDown 
                  className="w-6 h-6 animate-bounce" 
                  style={{ color: theme.colors.primary }}
                />
                <span className="text-small"></span>
              </div>
            </div>
          )}
          {hasMore && jobs.length > 0 && isLoadingMore && (
            <div
              className="w-full text-center py-4"
              style={{ color: theme.colors.textMuted }}
            >
              {variant === "manage"
                ? t.jobs.manageJobPosts.loadingMoreJobPosts
                : t.jobs.findJobs.loadingMoreJobPosts}
            </div>
          )}
          {!hasMore && jobs.length > 0 && (
            <div
              className="w-full text-center py-4"
              style={{ color: theme.colors.textMuted }}
            >
              {variant === "manage"
                ? t.jobs.manageJobPosts.reachedEnd
                : t.jobs.findJobs.reachedEnd}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostsSection;