// src/components/home/HowItWorksSection.tsx
'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaSearch, FaUser, FaMapMarkerAlt } from 'react-icons/fa';
import { getNeutral100Color, getBlueDarkColor } from '@/styles/colors';
import { fontClasses } from '@/styles/fonts';

export default function HowItWorksSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
      className="min-h-screen flex items-center justify-center relative py-24"
      ref={ref}
    >
      <div className="container mx-auto px-4">
        {/* How It Works Heading - Centered above the content */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: -30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
          transition={{ duration: 0.6 }}
        >
          <h2 
            className={`text-6xl md:text-7xl font-bold ${fontClasses.heading}`}
            style={{ color: getBlueDarkColor('default') }}
          >
            How It Works
          </h2>
        </motion.div>
        
        {/* Three Columns */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                className="bg-white bg-opacity-10 backdrop-blur-md rounded-3xl p-10 border border-white border-opacity-20 flex flex-col items-center text-center"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}
                variants={cardVariants}
                whileHover={{ 
                  scale: 1.05, 
                  y: -10,
                  boxShadow: '0 12px 48px rgba(0, 0, 0, 0.2)'
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <motion.div 
                  className="w-24 h-24 rounded-full bg-blue-500 bg-opacity-20 flex items-center justify-center mb-8"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Icon className="text-4xl" style={{ color: getBlueDarkColor('default') }} />
                </motion.div>
                <h3 
                  className={`text-3xl font-bold mb-6 text-white ${fontClasses.heading}`}
                >
                  {step.title}
                </h3>
                <p 
                  className={`text-xl ${fontClasses.body}`}
                  style={{ color: getNeutral100Color() }}
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
