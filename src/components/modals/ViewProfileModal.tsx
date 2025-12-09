"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProfileContactSection from "../view-profile/ProfileContactSection";
import JobListSection from "../view-profile/JobListSection";
import ReviewListSection from "../view-profile/ReviewListSection";
import ProjectListSection from "../view-profile/ProjectListSection";
import { useTheme } from '@/hooks/useTheme';
import { ProfileService } from '@/lib/services/profile-services';
import { ApplicationService } from "@/lib/services/applications-services";
import { PostService } from "@/lib/services/posts-services";
import { ApplicationStatus } from "@/lib/constants/application-status";
import { ProjectService } from "@/lib/services/project-services";
import { ReviewService } from "@/lib/services/reviews-services";
import { Post } from "@/lib/models/posts";
import { Project } from "@/lib/models/profile";

interface ViewProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userType?: 'applicant' | 'employer';
}

type MobileSection = 'contact' | 'reviews' | 'projects' | 'jobs';

interface Job {
  postId: string;
  title: string;
  location: string;
  hiredDate: string;
}

interface Review {
  reviewId: string;
  rating: number;
  comment: string | null;
  createdBy: string;
  reviewerName: string;
  avatarUrl?: string;
}

interface ProfileData {
  profilePicUrl: string | null;
  name: string | null;
  sex: string | null;
  age: number | null;
  email: string | null;
  phoneNumber: string | null;
  address: string | null;
}

export default function ViewProfileModal({ isOpen, onClose, userId, userType = 'applicant' }: ViewProfileModalProps) {
  const { theme } = useTheme();
  const [activeSection, setActiveSection] = useState<MobileSection>('contact');

  // Data states
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [userReviewCount, setUserReviewCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all data simultaneously when modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchAllData = async () => {
        setIsLoading(true);
        try {
          // Fetch all data in parallel using Promise.all
          const [profileRes, jobsRes, projectsRes, reviewsRes, avgRating, totalCount] = await Promise.all([
            // Profile data
            ProfileService.getProfileContact(userId),

            // Jobs data
            (async () => {
              if (userType === 'applicant') {
                const { applications } = await ApplicationService.getApplicationsByUserId(userId, {
                  status: [ApplicationStatus.APPROVED],
                  pageSize: 100,
                  sortBy: 'updatedAt',
                  sortOrder: 'desc'
                });

                return Promise.all(
                  applications.map(async (app: any) => ({
                    postId: app.postId,
                    title: app.posts?.title || 'Unknown Job',
                    location: app.posts?.location || 'Unknown Location',
                    hiredDate: new Date(app.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })
                  }))
                );
              } else {
                const { posts } = await PostService.getPostsByUserId(userId, {
                  page: 1,
                  pageSize: 100,
                  sortBy: 'createdAt',
                  sortOrder: 'desc'
                });

                return posts.map((post: Post) => ({
                  postId: post.postId,
                  title: post.title,
                  location: post.location || 'Unknown Location',
                  hiredDate: new Date(post.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                }));
              }
            })(),

            // Projects data
            ProjectService.getProjectsByUserId(userId),

            // Reviews data
            (async () => {
              const { reviews: reviewsData } = await ReviewService.getReviewsByUserId(userId, {
                pageSize: 100,
                sortBy: 'createdAt',
                sortOrder: 'desc'
              });

              return Promise.all(
                reviewsData.map(async (review) => {
                  const profileData = await ProfileService.getNameProfilePic(review.createdBy);
                  const displayName = profileData?.name
                    ? profileData.name.split('|||')[0].split(' ').slice(0, 2).join(' ')
                    : 'Anonymous';

                  return {
                    reviewId: review.reviewId,
                    rating: review.rating,
                    comment: review.comment ?? null,
                    createdBy: review.createdBy,
                    reviewerName: displayName,
                    avatarUrl: profileData?.profilePicUrl || undefined
                  };
                })
              );
            })(),

            // Average rating
            ReviewService.getAverageRating(userId),

            // Review count
            ReviewService.getTotalReviewsCountByUserId(userId)
          ]);

          setProfileData(profileRes);
          setJobs(jobsRes);
          setProjects(projectsRes);
          setReviews(reviewsRes);
          setAverageRating(avgRating);
          setUserReviewCount(totalCount);
        } catch (error) {
          console.error('Error fetching profile data:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchAllData();
    }
  }, [isOpen, userId, userType]);

  useEffect(() => {
    if (isOpen) {
      const prevHtml = document.documentElement.style.overflow;
      const prevBody = document.body.style.overflow;
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      return () => {
        document.documentElement.style.overflow = prevHtml;
        document.body.style.overflow = prevBody;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const sections = [
    { id: 'contact' as MobileSection, label: 'Profile' },
    { id: 'reviews' as MobileSection, label: 'Reviews' },
    { id: 'projects' as MobileSection, label: 'Projects' },
    { id: 'jobs' as MobileSection, label: 'Jobs' }
  ];

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center px-2 sm:px-4"
      style={{ backgroundColor: theme.modal.overlay }}
      onClick={handleBackdropClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="rounded-lg shadow-lg w-full max-w-6xl h-[70vh] md:h-[90vh] overflow-hidden relative z-[70] flex flex-col"
        style={{ backgroundColor: theme.modal.background }}
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 20, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="absolute top-1 right-4 z-[80] text-2xl transition-colors"
          style={{ color: theme.modal.buttonClose }}
          onMouseOver={(e) => e.currentTarget.style.color = theme.modal.buttonCloseHover}
          onMouseOut={(e) => e.currentTarget.style.color = theme.modal.buttonClose}
          aria-label="Close modal"
        >
          ×
        </button>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400"></div>
          </div>
        )}

        {/* Content - Only show when loading is complete */}
        {!isLoading && (
          <>
            {/* Mobile Navigation Tabs */}
            <div
          className="flex md:hidden pt-8 px-2"
          style={{
            backgroundColor: theme.modal.background
          }}
        >
          <div className="flex w-full border-b" style={{ borderBottomColor: theme.modal.headerBorder }}>
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className="flex-1 pb-3 text-sm font-medium transition-colors relative"
                style={{
                  color: activeSection === section.id ? theme.colors.primary : theme.colors.textMuted
                }}
                onMouseOver={(e) => {
                  if (activeSection !== section.id) {
                    e.currentTarget.style.color = theme.colors.textSecondary;
                  }
                }}
                onMouseOut={(e) => {
                  if (activeSection !== section.id) {
                    e.currentTarget.style.color = theme.colors.textMuted;
                  }
                }}
              >
                {section.label}
                {activeSection === section.id && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Single Section View */}
        <div className="flex md:hidden flex-1 overflow-y-auto">
          <div className="w-full">
            <div style={{ display: activeSection === 'contact' ? 'block' : 'none' }}>
              <ProfileContactSection userId={userId} profileData={profileData} />
            </div>
            <div style={{ display: activeSection === 'reviews' ? 'block' : 'none' }}>
              <ReviewListSection
                userId={userId}
                reviewsData={reviews}
                averageRating={averageRating}
                userReviewCount={userReviewCount}
              />
            </div>
            <div style={{ display: activeSection === 'projects' ? 'block' : 'none' }}>
              <ProjectListSection userId={userId} projectsData={projects} />
            </div>
            <div style={{ display: activeSection === 'jobs' ? 'block' : 'none' }}>
              <JobListSection userId={userId} userType={userType} jobsData={jobs} />
            </div>
          </div>
        </div>

        {/* Desktop Two Column Layout */}
        <div className="hidden md:flex flex-row h-full overflow-hidden">
          <div
            className="flex flex-col flex-shrink-0 border-r overflow-hidden"
            style={{ borderRightColor: theme.modal.sectionBorder }}
          >
            <ProfileContactSection userId={userId} profileData={profileData} />
            <div
              className="border-t my-2"
              style={{ borderTopColor: theme.modal.sectionBorder }}
            />
            <ReviewListSection
              userId={userId}
              reviewsData={reviews}
              averageRating={averageRating}
              userReviewCount={userReviewCount}
            />
          </div>

          <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
            <ProjectListSection userId={userId} projectsData={projects} />
            <div
              className="border-t my-2"
              style={{ borderTopColor: theme.modal.sectionBorder }}
            />
            <div className="flex-1 min-h-0 overflow-y-auto">
              <JobListSection userId={userId} userType={userType} jobsData={jobs} />
            </div>
          </div>
        </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}