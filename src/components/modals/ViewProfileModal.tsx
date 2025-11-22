"use client";

import ProfileContactSection from "../view-profile/ProfileContactSection";
import JobListSection from "../view-profile/JobListSection";
import ReviewListSection from "../view-profile/ReviewListSection";
import ProjectListSection from "../view-profile/ProjectListSection";

interface ViewProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userType?: 'applicant' | 'employer'; // Optional, defaults to 'applicant'
}

export default function ViewProfileModal({ isOpen, onClose, userId, userType = 'applicant' }: ViewProfileModalProps) {
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
        className="bg-white rounded-lg shadow-lg w-full max-w-6xl h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col md:flex-row h-full overflow-hidden">
          <div className="flex flex-col flex-shrink-0 border-r border-gray-neutral200 overflow-y-auto">
            <ProfileContactSection userId={userId} />
            <div className="border-t border-gray-neutral200 my-2"></div>
            <ReviewListSection userId={userId} />
          </div>

          <div className="flex flex-col flex-1 min-w-0 overflow-y-auto">  
            <ProjectListSection userId={userId} />
            <div className="border-t border-gray-neutral200 my-2"></div>
            <JobListSection userId={userId} userType={userType} />
          </div>
        </div>
      </div>
    </div>
  );
}