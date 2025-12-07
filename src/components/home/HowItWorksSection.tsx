// src/components/home/HowItWorksSection.tsx
'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaSearch, FaUser, FaMapMarkerAlt } from 'react-icons/fa';
import { fontClasses } from '@/styles/fonts';
import { useTheme } from '@/hooks/useTheme';

export default function HowItWorksSection() {
  const ref = useRef(null);
  const { theme } = useTheme();
  const isInView = useInView(ref, { once: true, amount: 0.2, margin: "-20% 0px -20% 0px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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

  const steps = [
    {
      icon: FaSearch,
      title: "Profiles and Ratings",
      description: "Workers build trust with detailed profiles and a community-driven rating and review system."
    },
    {
      icon: FaUser,
      title: "Verified Users",
      description: "Both clients and workers are verified to ensure a safe and trustworthy community for everyone."
    },
    {
      icon: FaMapMarkerAlt,
      title: "Hyperlocal Matching",
      description: "Our platform connects you with reliable, skilled workers and jobs in your immediate community."
    }
  ];

  return (
    <section 
      id="how-it-works" 
      className="min-h-screen laptop:h-screen flex items-center justify-center relative py-24 laptop:snap-start laptop:snap-always"
      ref={ref}
    >
      <div className="container mx-auto px-4">
        {/* How It Works Heading - Centered above the content */}
        <motion.div 
          className="text-center mb-10 mobile-M:mb-12 tablet:mb-16 laptop:mb-20"
          initial={{ opacity: 0, y: -30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
          transition={{ duration: 0.6 }}
        >
          <h2 
            className={`text-h3 mobile-M:text-h2 tablet:text-h1 laptop:text-hero font-bold ${fontClasses.heading}`}
            style={{ color: theme.landing.headingPrimary }}
          >
            How It Works
          </h2>
        </motion.div>
        
        {/* Three Columns */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mobile-M:gap-8 tablet:gap-10 laptop:gap-12 max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                className="backdrop-blur-md rounded-2xl tablet:rounded-3xl p-6 mobile-M:p-8 tablet:p-10 border flex flex-col items-center text-center"
                style={{ 
                  backgroundColor: theme.landing.glassBg,
                  boxShadow: `0 8px 32px ${theme.landing.accentGlow}`,
                  borderColor: theme.landing.glassBorder
                }}
                variants={cardVariants}
                whileHover={{ 
                  scale: 1.05, 
                  y: -10,
                  boxShadow: `0 12px 48px ${theme.landing.accentGlow}`
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <motion.div 
                  className="w-20 h-20 mobile-M:w-22 mobile-M:h-22 tablet:w-24 tablet:h-24 rounded-full flex items-center justify-center mb-5 mobile-M:mb-6 tablet:mb-8"
                  style={{
                    background: theme.landing.iconBg,
                    border: `1px solid ${theme.landing.iconBorder}`
                  }}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Icon 
                    className="text-3xl mobile-M:text-[2.25rem] tablet:text-4xl" 
                    style={{ color: theme.landing.accentPrimary }}
                  />
                </motion.div>
                <h3 
                  className={`text-body mobile-M:text-lead tablet:text-h3 laptop:text-h2 font-bold mb-4 mobile-M:mb-5 tablet:mb-6 ${fontClasses.heading}`}
                  style={{ color: theme.landing.headingPrimary }}
                >
                  {step.title}
                </h3>
                <p 
                  className={`text-small mobile-M:text-small tablet:text-body laptop:text-lead ${fontClasses.body}`}
                  style={{ color: theme.landing.bodyText }}
                >
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}