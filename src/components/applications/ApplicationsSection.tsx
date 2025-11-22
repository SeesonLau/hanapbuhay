"use client";

import React from "react";
import { HiArrowDown } from "react-icons/hi";
import AppliedJobCard from "@/components/cards/AppliedJobCardList";
import type { AppliedJob } from "@/components/cards/AppliedJobCardList";

interface Props {
  applications: AppliedJob[];
  loading?: boolean;
  error?: string | null;
  viewMode: "card" | "list";
  onDelete?: (jobId: string) => void;
}

const ApplicationsSection: React.FC<Props> = ({
  applications,
  loading,
  error,
  viewMode,
  onDelete,
}) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = React.useState(false);
  const [isAtBottom, setIsAtBottom] = React.useState(false);

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
  }, [applications, viewMode]);

  if (loading && (!applications || applications.length === 0)) {
    return <div className="text-center py-8">Loading applications...</div>;
  }
  
  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }
  
  if (!applications || applications.length === 0) {
    return <div className="text-center py-8 text-gray-500">No applications available.</div>;
  }

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
              className="w-full grid grid-cols-1 tablet:grid-cols-2 laptop-L:grid-cols-3 gap-4 auto-rows-fr"
            >
              {applications.map((app) => (
                <div key={app.id} className="snap-start w-full h-full">
                  <AppliedJobCard
                    job={app}
                    variant="card"
                    onDelete={onDelete}
                  />
                </div>
              ))}
            </div>
            {!isAtBottom && isScrollable && (
              <div className="sticky bottom-0 left-0 right-0 flex items-center justify-center gap-2 bg-gradient-to-t from-white via-white/95 to-transparent pt-4 pb-2 text-sm text-gray-neutral500 pointer-events-none">
                <HiArrowDown className="w-4 h-4 animate-bounce" />
              </div>
            )}
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
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsSection;
