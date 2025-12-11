// src/components/home/BenefitsSection.tsx
'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaStar, FaMapMarkerAlt, FaBolt, FaShieldAlt } from 'react-icons/fa';
import { fontClasses } from '@/styles/fonts';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/hooks/useLanguage';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function BenefitsSection() {
  const ref = useRef(null);
  const { theme } = useTheme();
  const { t } = useLanguage();
  const isInView = useInView(ref, { once: false, amount: 0.15 });

  const features: Feature[] = [
    {
      icon: <FaMapMarkerAlt className="text-xl" />,
      title: t.home.benefits.localConnections.title,
      description: t.home.benefits.localConnections.description
    },
    {
      icon: <FaBolt className="text-xl" />,
      title: t.home.benefits.quickHiring.title,
      description: t.home.benefits.quickHiring.description
    },
    {
      icon: <FaStar className="text-xl" />,
      title: t.home.benefits.verifiedReviews.title,
      description: t.home.benefits.verifiedReviews.description
    },
    {
      icon: <FaShieldAlt className="text-xl" />,
      title: t.home.benefits.securePlatform.title,
      description: t.home.benefits.securePlatform.description
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
              {t.home.benefits.heading}{' '}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(to right, ${theme.landing.headingGradientStart}, ${theme.landing.headingGradientMid}, ${theme.landing.headingGradientEnd})`
                }}
              >
                {t.home.benefits.headingHighlight}
              </span>
            </h2>

            <p
              className={`text-body tablet:text-lead leading-relaxed ${fontClasses.body}`}
              style={{ color: theme.landing.bodyText }}
            >
              {t.home.benefits.subtitle}
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