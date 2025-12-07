// src/components/home/BenefitsSection.tsx
'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaHandshake, FaBriefcase, FaStar, FaMapMarkerAlt, FaBolt, FaShieldAlt } from 'react-icons/fa';
import { fontClasses } from '@/styles/fonts';
import { useTheme } from '@/hooks/useTheme';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function BenefitsSection() {
  const ref = useRef(null);
  const { theme } = useTheme();
  const isInView = useInView(ref, { once: false, amount: 0.15 });

  const features: Feature[] = [
    {
      icon: <FaMapMarkerAlt className="text-xl" />,
      title: "Local Connections",
      description: "Find trusted workers and clients right in your community, no more searching far and wide."
    },
    {
      icon: <FaBolt className="text-xl" />,
      title: "Quick Hiring",
      description: "Post a job in minutes and receive responses from nearby skilled professionals fast."
    },
    {
      icon: <FaStar className="text-xl" />,
      title: "Verified Reviews",
      description: "Build trust with transparent ratings and authentic feedback from the community."
    },
    {
      icon: <FaShieldAlt className="text-xl" />,
      title: "Secure Platform",
      description: "Your data and transactions are protected with our reliable and secure system."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as const
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as const
      }
    }
  };

  return (
    <section 
      id="benefits" 
      className="min-h-screen flex items-center justify-center relative py-16 tablet:py-20 laptop:py-24 laptop:snap-start laptop:snap-always overflow-hidden"
      ref={ref}
    >
      <motion.div 
        className="container mx-auto px-4 tablet:px-6 laptop:px-8 relative z-10 max-w-7xl"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {/* Main Layout: Left heading + Right grid */}
        <div className="grid grid-cols-1 laptop:grid-cols-12 gap-12 laptop:gap-16 items-start">
          
          {/* Left Section - Heading */}
          <motion.div 
            className="laptop:col-span-4 laptop:sticky laptop:top-32"
            variants={itemVariants}
          >
            <h2 
              className={`text-h2 tablet:text-h1 laptop:text-hero font-bold mb-6 leading-tight ${fontClasses.heading}`}
              style={{ color: theme.landing.headingPrimary }}
            >
              Core Features That{' '}
              <span 
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(to right, ${theme.landing.headingGradientStart}, ${theme.landing.headingGradientMid}, ${theme.landing.headingGradientEnd})`
                }}
              >
                Power Your Success
              </span>
            </h2>
            
            <p 
              className={`text-body tablet:text-lead leading-relaxed ${fontClasses.body}`}
              style={{ color: theme.landing.bodyText }}
            >
              A platform designed to connect local talent with opportunities, making hiring and finding work simpler than ever before.
            </p>

            {/* Decorative line */}
            <motion.div 
              className="hidden laptop:block mt-8 h-1 w-20 rounded-full"
              style={{
                backgroundImage: `linear-gradient(to right, ${theme.landing.accentSecondary}, ${theme.landing.accentPrimary})`
              }}
              initial={{ scaleX: 0, originX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
          </motion.div>

          {/* Right Section - Feature Grid */}
          <motion.div 
            className="laptop:col-span-8"
            variants={containerVariants}
          >
            <div className="grid grid-cols-1 mobile-L:grid-cols-2 gap-6 tablet:gap-8">
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  variants={cardVariants}
                  className="group"
                >
                  <div
                    className="h-full p-6 tablet:p-8 rounded-2xl border transition-all duration-500 hover:scale-[1.02]"
                    style={{
                      background: theme.landing.glassBg,
                      backdropFilter: 'blur(20px)',
                      borderColor: theme.landing.glassBorder,
                      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = theme.landing.glassHoverBorder;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = theme.landing.glassBorder;
                    }}
                  >
                    {/* Icon */}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                      style={{
                        background: theme.landing.iconBg,
                        border: `1px solid ${theme.landing.iconBorder}`
                      }}
                    >
                      <span style={{ color: theme.landing.accentPrimary }}>
                        {feature.icon}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 
                      className={`text-lead tablet:text-h3 font-semibold mb-3 ${fontClasses.heading}`}
                      style={{ color: theme.landing.headingPrimary }}
                    >
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p 
                      className={`text-small tablet:text-body leading-relaxed ${fontClasses.body}`}
                      style={{ color: theme.landing.bodyText }}
                    >
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}