"use client";

import ProfileContactSection from "../view-profile/ProfileContactSection";
import JobListSection from "../view-profile/JobListSection";
import ReviewListSection from "../view-profile/ReviewListSection";
import ProjectListSection from "../view-profile/ProjectListSection";

interface ViewProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ViewProfileModal({ isOpen, onClose }: ViewProfileModalProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-2 w-full max-w-6xl"
        onClick={(e) => e.stopPropagation()}
      >
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col gap-6 flex-shrink-0">
            <ProfileContactSection />
            <ReviewListSection />
          </div>

          <div className="flex flex-col flex-1 min-w-0">
            <ProjectListSection />
            <JobListSection />
          </div>
        </div>
      </div>
    </div>
  );
}