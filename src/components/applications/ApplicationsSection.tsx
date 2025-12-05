"use client";

import React from "react";
import AppliedJobCard from "@/components/cards/AppliedJobCardList";
import type { AppliedJob } from "@/components/cards/AppliedJobCardList";

interface Props {
  applications: AppliedJob[];
  loading?: boolean;
  error?: string | null;
  viewMode: "card" | "list";
  onDelete?: (jobId: string) => void;
  onOpen?: (job: AppliedJob) => void;
}

const ApplicationsSection: React.FC<Props> = ({
  applications,
  loading,
  error,
  viewMode,
  onDelete,
  onOpen,
}) => {
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
          <div className="py-2 px-2">
            <div 
              className="w-full grid grid-cols-1 tablet:grid-cols-2 laptop-L:grid-cols-3 gap-4 items-stretch"
              style={{
                gridAutoRows: 'min-content'
              }}
            >
              {applications.map((app) => (
                <div key={app.id} className="snap-start h-full">
                  <AppliedJobCard
                    job={app}
                    variant="card"
                    onDelete={onDelete}
                    onClick={onOpen}
                  />
                </div>
              ))}
            </div>
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
        </div>
      )}
    </div>
  );
};

export default ApplicationsSection;
