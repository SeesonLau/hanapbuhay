"use client";

import React from "react";
import { HiArrowDown } from "react-icons/hi";
import AppliedJobCard from "@/components/cards/AppliedJobCardList";
import type { AppliedJob } from "@/components/cards/AppliedJobCardList";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";

interface Props {
  applications: AppliedJob[];
  loading?: boolean;
  isLoadingMore?: boolean;
  error?: string | null;
  hasMore?: boolean;
  viewMode: "card" | "list";
  onDelete?: (jobId: string) => void;
  onOpen?: (job: any) => void;
  onLoadMore?: () => void;
}

const ApplicationsSection: React.FC<Props> = ({
  applications,
  loading,
  isLoadingMore,
  error,
  hasMore,
  viewMode,
  onDelete,
  onOpen,
  onLoadMore,
}) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
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

  if (loading && (!applications || applications.length === 0)) {
    return (
      <div
        className="text-center py-8"
        style={{ color: theme.colors.textSecondary }}
      >
        {t.jobs.appliedJobs.loadingApplications}
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

  if (!applications || applications.length === 0) {
    return (
      <div
        className="text-center py-8"
        style={{ color: theme.colors.textMuted }}
      >
        {t.jobs.appliedJobs.noApplicationsAvailable}
      </div>
    );
  }

  const renderLoadMore = () => (
    <>
      {hasMore && !isLoadingMore && (
        <div ref={observerTarget} className="w-full flex justify-center items-center py-6">
          <button
            onClick={onLoadMore}
            className="flex flex-col items-center gap-2 px-6 py-4 rounded-lg transition-colors cursor-pointer border-none bg-transparent"
            style={{
              backgroundColor: 'transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.surfaceHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <HiArrowDown 
              className="w-6 h-6 animate-bounce"
              style={{ color: theme.colors.primary }}
            />
            <span
              className="text-small font-medium"
              style={{ color: theme.colors.textSecondary }}
            >
              {t.jobs.appliedJobs.scrollForMore}
            </span>
          </button>
        </div>
      )}
      {isLoadingMore && (
        <div
          className="w-full text-center py-4"
          style={{ color: theme.colors.textSecondary }}
        >
          {t.jobs.appliedJobs.loadingMoreApplications}
        </div>
      )}
      {!hasMore && applications.length > 0 && (
        <div
          className="w-full text-center py-4"
          style={{ color: theme.colors.textMuted }}
        >
          {t.jobs.appliedJobs.reachedEnd}
        </div>
      )}
    </>
  );

  return (
    <div className="mt-8 space-y-6 relative">
      {viewMode === "card" ? (
        <div className="relative">
          <div className="py-2 px-2">
            <div 
              className="w-full grid grid-cols-1 tablet:grid-cols-2 laptop-L:grid-cols-3 gap-4 items-stretch"
              style={{
                gridAutoRows: 'min-content'
              }}
            >
              {applications.map((app) => (
                <div key={app.id} className="h-full">
                  <AppliedJobCard
                    job={app}
                    variant="card"
                    onDelete={onDelete}
                    onClick={onOpen}
                  />
                </div>
              ))}
            </div>
            {renderLoadMore()}
          </div>
        </div>
      ) : (
        <div className="w-full overflow-x-hidden">
          <div className="flex flex-col items-start gap-4 mx-auto w-full">
            {applications.map((app) => (
              <AppliedJobCard
                key={app.id}
                job={app}
                variant="list"
                onDelete={onDelete}
                onClick={onOpen}
              />
            ))}
          </div>
          {renderLoadMore()}
        </div>
      )}
    </div>
  );
};

export default ApplicationsSection;