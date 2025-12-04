// src/components/home/BenefitsSection.tsx
'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaHandshake, FaBriefcase, FaCheck } from 'react-icons/fa';
import { fontClasses } from '@/styles/fonts';

interface Benefit {
  icon: React.ReactNode;
  title: string;
  description: string;
  highlight: string;
}

export default function BenefitsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2, margin: "-20% 0px -20% 0px" });

  const clientBenefits: Benefit[] = [
    {
      icon: <FaHandshake className="text-2xl" />,
      title: "trusted, reliable workers",
      description: "in your local area, without the hassle of broad platforms.",
      highlight: "Find"
    },
    {
      icon: <FaCheck className="text-2xl" />,
      title: "transparent ratings and reviews",
      description: "from the community.",
      highlight: "Gain confidence with"
    },
    {
      icon: <FaCheck className="text-2xl" />,
      title: "Post a job in minutes",
      description: "and receive responses from nearby skilled individuals.",
      highlight: ""
    }
  ];

  const workerBenefits: Benefit[] = [
    {
      icon: <FaBriefcase className="text-2xl" />,
      title: "monetize your skills",
      description: "and find jobs right in your locality.",
      highlight: "Easily"
    },
    {
      icon: <FaCheck className="text-2xl" />,
      title: "Build your professional reputation",
      description: "through client feedback and a dedicated profile.",
      highlight: ""
    },
    {
      icon: <FaCheck className="text-2xl" />,
      title: "reach more clients",
      description: "in your community.",
      highlight: "Discover new opportunities and"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
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

  const benefitCardVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
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
      {/* Animated background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <motion.div 
        className="container mx-auto px-4 tablet:px-6 laptop:px-8 relative z-10 max-w-7xl"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {/* Header Section */}
        <motion.div 
          className="text-center mb-12 tablet:mb-16 laptop:mb-20"
          variants={itemVariants}
        >
          <motion.div
            className="inline-block mb-4"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div 
              className="px-6 py-2 rounded-full border text-small font-medium"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                borderColor: 'rgba(255, 255, 255, 0.1)'
              }}
            >
            </div>
          </motion.div>
          
          <h2 
            className={`text-h2 tablet:text-h1 laptop:text-hero font-bold text-gray-neutral100 mb-4 ${fontClasses.heading}`}
          >
            Our <span className="text-blue-400">Benefits</span>
          </h2>
          
          <p className={`text-body tablet:text-lead text-gray-neutral300 max-w-2xl mx-auto ${fontClasses.body}`}>
            Experience a platform designed for both clients and workers to thrive
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 laptop:grid-cols-2 gap-8 laptop:gap-12">
          {/* For Clients Section */}
          <motion.div variants={itemVariants}>
            <div
              className="rounded-3xl border p-8 tablet:p-10 relative overflow-hidden h-full"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
                borderColor: 'rgba(255, 255, 255, 0.08)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}
            >
              {/* Header with Icon */}
              <div className="flex items-center gap-4 mb-8">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.2)'
                  }}
                >
                  <FaHandshake className="text-3xl text-blue-400" />
                </div>
                <div>
                  <h3 className={`text-h3 tablet:text-h2 font-bold text-gray-neutral100 ${fontClasses.heading}`}>
                    For Clients
                  </h3>
                  <p className={`text-small text-gray-neutral400 ${fontClasses.body}`}>
                    Find trusted professionals in your local area
                  </p>
                </div>
              </div>

              {/* Benefits List */}
              <div className="space-y-6">
                {clientBenefits.map((benefit, idx) => (
                  <motion.div
                    key={idx}
                    variants={benefitCardVariants}
                    className="group"
                  >
                    <div
                      className="p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.02]"
                      style={{
                        background: 'rgba(255, 255, 255, 0.02)',
                        backdropFilter: 'blur(10px)',
                        borderColor: 'rgba(255, 255, 255, 0.06)'
                      }}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center mt-0.5"
                          style={{
                            background: 'rgba(239, 143, 17, 0.1)',
                            border: '1px solid rgba(239, 143, 17, 0.2)'
                          }}
                        >
                          <FaCheck className="text-blue-400 text-sm" />
                        </div>
                        <div className="flex-1">
                          <p className={`text-body text-gray-neutral200 leading-relaxed ${fontClasses.body}`}>
                            {benefit.highlight && <span className="text-gray-neutral300">{benefit.highlight} </span>}
                            <span className="font-bold text-blue-400">{benefit.title}</span>
                            <span className="text-gray-neutral300"> {benefit.description}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* For Workers Section */}
          <motion.div variants={itemVariants}>
            <div
              className="rounded-3xl border p-8 tablet:p-10 relative overflow-hidden h-full"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
                borderColor: 'rgba(255, 255, 255, 0.08)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}
            >
              {/* Header with Icon */}
              <div className="flex items-center gap-4 mb-8">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.2)'
                  }}
                >
                  <FaBriefcase className="text-3xl text-blue-400" />
                </div>
                <div>
                  <h3 className={`text-h3 tablet:text-h2 font-bold text-gray-neutral100 ${fontClasses.heading}`}>
                    For Workers
                  </h3>
                  <p className={`text-small text-gray-neutral400 ${fontClasses.body}`}>
                    Monetize your skills and grow your business
                  </p>
                </div>
              </div>

              {/* Benefits List */}
              <div className="space-y-6">
                {workerBenefits.map((benefit, idx) => (
                  <motion.div
                    key={idx}
                    variants={benefitCardVariants}
                    className="group"
                  >
                    <div
                      className="p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.02]"
                      style={{
                        background: 'rgba(255, 255, 255, 0.02)',
                        backdropFilter: 'blur(10px)',
                        borderColor: 'rgba(255, 255, 255, 0.06)'
                      }}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center mt-0.5"
                          style={{
                            background: 'rgba(239, 143, 17, 0.1)',
                            border: '1px solid rgba(239, 143, 17, 0.2)'
                          }}
                        >
                          <FaCheck className="text-blue-400 text-sm" />
                        </div>
                        <div className="flex-1">
                          <p className={`text-body text-gray-neutral200 leading-relaxed ${fontClasses.body}`}>
                            {benefit.highlight && <span className="text-gray-neutral300">{benefit.highlight} </span>}
                            <span className="font-bold text-blue-400">{benefit.title}</span>
                            <span className="text-gray-neutral300"> {benefit.description}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
