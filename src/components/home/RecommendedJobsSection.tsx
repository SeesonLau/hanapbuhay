// src/components/home/RecommendedJobsSection.tsx
'use client';
import { useRef, useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useInView } from 'framer-motion';
import { JobPostCard } from '@/components/cards/JobPostCard';
import { fontClasses } from '@/styles/fonts';
import { useJobPosts } from '@/hooks/useJobPosts';
import { Post } from '@/lib/models/posts';
import { Gender } from '@/lib/constants/gender';
import { ExperienceLevel } from '@/lib/constants/experience-level';
import { SubTypes } from '@/lib/constants/job-types';
import { useTheme } from '@/hooks/useTheme';

export default function RecommendedJobsSection() {
  const ref = useRef(null);
  const router = useRouter();
  const { theme } = useTheme();
  const isInView = useInView(ref, { once: false, amount: 0.15 });

  useEffect(() => {
    router.prefetch('/login');
  }, [router]);

  const {
    jobs,
    loading,
    error,
  } = useJobPosts(undefined, { 
    excludeMine: false, 
    excludeApplied: false
  });

  const recommendedJobs = [...jobs]
    .sort((a, b) => (b.applicantCount || 0) - (a.applicantCount || 0))
    .slice(0, 6);

  const handleApplyNow = useCallback((postId: string) => {
    sessionStorage.setItem('pendingJobApplication', postId);
    router.push('/login');
  }, [router]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <section 
      id="recommended-jobs" 
      className="min-h-screen flex items-center justify-center relative py-16 mobile-M:py-20 tablet:py-24 laptop:py-28"
      ref={ref}
    >
      <div className="container mx-auto px-4 mobile-M:px-6 tablet:px-8 laptop:px-12">
        {/* Section Heading */}
        <motion.div 
          className="text-center mb-8 mobile-M:mb-10 tablet:mb-12 laptop:mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
          transition={{ duration: 0.6 }}
        >
          <h2 
            className={`text-h2 mobile-M:text-h1 tablet:text-5xl laptop:text-hero font-bold mb-4 ${fontClasses.heading}`}
            style={{ color: theme.landing.headingPrimary }}
          >
            Recommended{' '}
            <span 
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(to right, ${theme.landing.headingGradientStart}, ${theme.landing.headingGradientMid}, ${theme.landing.headingGradientEnd})`
              }}
            >
              Jobs
            </span>
          </h2>
          
          <p 
            className={`text-body mobile-M:text-lead tablet:text-xl max-w-2xl mx-auto ${fontClasses.body}`}
            style={{ color: theme.landing.bodyText }}
          >
            Discover the most popular opportunities in your area
          </p>
        </motion.div>
        
        {/* Jobs Grid - Responsive layout */}
        <motion.div 
          className="grid grid-cols-1 mobile-L:grid-cols-2 laptop:grid-cols-3 gap-4 mobile-M:gap-5 tablet:gap-6 laptop:gap-8 max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {loading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, index) => (
              <motion.div
                key={`skeleton-${index}`}
                variants={cardVariants}
                className="w-full h-[300px] rounded-2xl tablet:rounded-3xl"
                style={{
                  background: theme.landing.sectionBg,
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${theme.landing.glassBorder}`,
                }}
              >
                <div className="animate-pulse h-full flex flex-col p-6 gap-4">
                  <div 
                    className="h-6 rounded w-3/4"
                    style={{ backgroundColor: theme.landing.sectionBgLight }}
                  />
                  <div 
                    className="h-4 rounded w-full"
                    style={{ backgroundColor: theme.landing.sectionBgLight }}
                  />
                  <div 
                    className="h-4 rounded w-2/3"
                    style={{ backgroundColor: theme.landing.sectionBgLight }}
                  />
                  <div className="mt-auto flex gap-2">
                    <div 
                      className="h-6 rounded w-20"
                      style={{ backgroundColor: theme.landing.sectionBgLight }}
                    />
                    <div 
                      className="h-6 rounded w-24"
                      style={{ backgroundColor: theme.landing.sectionBgLight }}
                    />
                  </div>
                </div>
              </motion.div>
            ))
          ) : recommendedJobs.length > 0 ? (
            recommendedJobs.map((job) => (
              <motion.div
                key={job.id}
                variants={cardVariants}
              >
                <JobPostCard
                  variant="glassy"
                  jobData={job}
                  disableCardClick={true}
                  onApply={handleApplyNow}
                />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p 
                className={`${fontClasses.body} text-lg`}
                style={{ color: theme.landing.bodyText }}
              >
                No jobs available at the moment. Check back later!
              </p>
            </div>
          )}
        </motion.div>

        {/* View All Jobs Button */}
        <motion.div 
          className="text-center mt-8 mobile-M:mt-10 tablet:mt-12 laptop:mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <motion.button
            onClick={() => router.push('/login')}
            className="inline-block px-8 py-3.5 border font-semibold rounded-full transition-all duration-300 backdrop-blur-sm text-body"
            style={{
              backgroundColor: theme.landing.iconBg,
              borderColor: theme.landing.iconBorder,
              color: theme.landing.headingPrimary
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.landing.glassHoverBg;
              e.currentTarget.style.borderColor = theme.landing.glassHoverBorder;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = theme.landing.iconBg;
              e.currentTarget.style.borderColor = theme.landing.iconBorder;
            }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            View All Jobs
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}