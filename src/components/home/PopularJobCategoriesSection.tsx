// src/components/home/PopularJobCategoriesSection.tsx
'use client';
import { useRef, useMemo, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { fontClasses } from '@/styles/fonts';
import { JobType, SubTypes } from '@/lib/constants/job-types';
import { PostService } from '@/lib/services/posts-services';
import { ApplicationService } from '@/lib/services/applications-services';
import type { Post } from '@/lib/models/posts';
import { useTheme } from '@/hooks/useTheme';
import type { Theme } from '@/styles/theme';

// Job type icon mapping
const jobTypeIcons: Record<JobType, string> = {
  [JobType.AGRICULTURE]: '/icons/Agriculture.svg',
  [JobType.DIGITAL]: '/icons/Digital.svg',
  [JobType.IT]: '/icons/IT.svg',
  [JobType.CREATIVE]: '/icons/Creative.svg',
  [JobType.CONSTRUCTION]: '/icons/Construction.svg',
  [JobType.SERVICE]: '/icons/Service.svg',
  [JobType.SKILLED]: '/icons/Skilled.svg',
  [JobType.OTHER]: '/icons/Service.svg', // Fallback icon
};

// Map JobType to theme category colors
const jobTypeToCategory: Record<JobType, keyof Theme['landing']['categoryColors']> = {
  [JobType.AGRICULTURE]: 'agriculture',
  [JobType.DIGITAL]: 'digital',
  [JobType.IT]: 'it',
  [JobType.CREATIVE]: 'creative',
  [JobType.CONSTRUCTION]: 'construction',
  [JobType.SERVICE]: 'service',
  [JobType.SKILLED]: 'skilled',
  [JobType.OTHER]: 'other',
};

interface CategoryData {
  type: JobType;
  label: string;
  icon: string;
  totalApplicants: number;
  openPositions: number;
  colors: { bg: string; border: string; iconBg: string };
}

export default function PopularJobCategoriesSection() {
  const ref = useRef(null);
  const { theme } = useTheme();
  // Bidirectional scroll animation - replays when scrolling back into view
  const isInView = useInView(ref, { once: false, amount: 0.15 });

  // State for posts and loading
  const [posts, setPosts] = useState<{ post: Post; applicantCount: number }[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch ALL jobs to count by category (use large page size to get all posts)
  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        setLoading(true);
        // Fetch all posts with a large page size
        const result = await PostService.getAllPosts({
          page: 1,
          pageSize: 1000, // Large enough to get all posts
          sortBy: 'createdAt',
          sortOrder: 'desc',
        });

        // Get applicant counts for each post
        const postsWithCounts = await Promise.all(
          result.posts.map(async (post) => {
            const applicantCount = await ApplicationService.getTotalApplicationsByPostIdCount(post.postId).catch(() => 0);
            return { post, applicantCount };
          })
        );

        setPosts(postsWithCounts);
      } catch (error) {
        console.error('Error fetching posts for categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPosts();
  }, []);

  // Calculate total applicants per job type and sort by most applicants
  const categoriesData = useMemo<CategoryData[]>(() => {
    const applicantsByType: Record<string, number> = {};
    const jobCountByType: Record<string, number> = {};
    
    // Initialize all job types with 0
    Object.values(JobType).forEach(type => {
      if (type !== JobType.OTHER) {
        applicantsByType[type] = 0;
        jobCountByType[type] = 0;
      }
    });

    // Count total applicants by job type category
    // Job posts store both the main type (e.g., "Agriculture") and subtypes (e.g., "Fruit Picker") in subType array
    posts.forEach(({ post, applicantCount }) => {
      const postType = post.type; // Main job type (e.g., "Agriculture")
      const subtypes = post.subType || []; // Array of subtypes selected
      
      // Check which JobType category this job belongs to
      Object.values(JobType).forEach(jobType => {
        if (jobType !== JobType.OTHER) {
          const jobTypeSubtypes = SubTypes[jobType] || [];
          // A job belongs to a category if:
          // 1. The post's main type matches this JobType
          // 2. OR any of the post's subtypes match a subtype under this JobType
          const matchesMainType = postType === jobType;
          const matchesSubtype = subtypes.some(sub => 
            jobTypeSubtypes.some(jts => sub.toLowerCase() === jts.toLowerCase())
          );
          
          if (matchesMainType || matchesSubtype) {
            applicantsByType[jobType] = (applicantsByType[jobType] || 0) + applicantCount;
            jobCountByType[jobType] = (jobCountByType[jobType] || 0) + 1;
          }
        }
      });
    });

    // Create sorted array by total applicants (most popular first) and take top 4
    const categories = Object.values(JobType)
      .filter(type => type !== JobType.OTHER)
      .map(type => {
        const categoryKey = jobTypeToCategory[type];
        return {
          type,
          label: type,
          icon: jobTypeIcons[type],
          totalApplicants: applicantsByType[type] || 0,
          openPositions: jobCountByType[type] || 0,
          colors: theme.landing.categoryColors[categoryKey],
        };
      })
      .sort((a, b) => b.totalApplicants - a.totalApplicants)
      .slice(0, 4); // Take top 4 categories only

    return categories;
  }, [posts, theme]);

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
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <section 
      id="popular-categories" 
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
            Popular Job{' '}
            <span 
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(to right, ${theme.landing.headingGradientStart}, ${theme.landing.headingGradientMid}, ${theme.landing.headingGradientEnd})`
              }}
            >
              Categories
            </span>
          </h2>
          
          <p 
            className={`text-body mobile-M:text-lead tablet:text-xl max-w-2xl mx-auto ${fontClasses.body}`}
            style={{ color: theme.landing.bodyText }}
          >
            Explore the most in-demand job categories in your area
          </p>
        </motion.div>
        
        {/* Categories Grid - 1 col mobile, 2 cols mobile-L, 3 cols tablet, 4 cols laptop */}
        <motion.div 
          className="grid grid-cols-1 mobile-L:grid-cols-2 tablet:grid-cols-3 laptop:grid-cols-4 gap-4 mobile-M:gap-5 tablet:gap-6 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {loading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <motion.div
                key={`skeleton-${index}`}
                variants={cardVariants}
                className="h-[140px] mobile-M:h-[160px] rounded-2xl animate-pulse"
                style={{
                  background: theme.landing.sectionBg,
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${theme.landing.glassBorder}`,
                }}
              />
            ))
          ) : (
            categoriesData.map((category, index) => (
              <motion.div
                key={category.type}
                variants={cardVariants}
                className="group relative rounded-2xl p-5 mobile-M:p-6 overflow-hidden"
                style={{
                  background: category.colors.bg,
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${category.colors.border}`,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}
                whileHover={{ 
                  scale: 1.03, 
                  y: -5,
                  boxShadow: '0 16px 48px rgba(0, 0, 0, 0.2)'
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {/* Icon */}
                <div 
                  className="w-12 h-12 mobile-M:w-14 mobile-M:h-14 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: category.colors.iconBg }}
                >
                  <img 
                    src={category.icon} 
                    alt={category.label} 
                    className="w-7 h-7 mobile-M:w-8 mobile-M:h-8"
                    style={{ filter: 'brightness(0) invert(1)' }}
                  />
                </div>

                {/* Category Name */}
                <h3 
                  className={`${fontClasses.heading} font-semibold text-body mobile-M:text-lead mb-2`}
                  style={{ color: theme.landing.headingPrimary }}
                >
                  {category.label}
                </h3>

                {/* Total Applicants Count */}
                <p 
                  className={`${fontClasses.body} text-small`}
                  style={{ color: theme.landing.bodyText }}
                >
                  <span 
                    className="font-semibold"
                    style={{ color: theme.landing.accentPrimary }}
                  >
                    {category.totalApplicants}
                  </span>
                  {' '}applicant{category.totalApplicants !== 1 ? 's' : ''}
                </p>

                {/* Decorative gradient overlay on hover */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${category.colors.border} 0%, transparent 50%)`,
                  }}
                />
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </section>
  );
}