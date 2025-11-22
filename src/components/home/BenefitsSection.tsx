// src/components/home/BenefitsSection.tsx
'use client';
import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { FaHandshake, FaBriefcase, FaCheck } from 'react-icons/fa';
import { fontClasses } from '@/styles/fonts';

export default function BenefitsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2, margin: "-20% 0px -20% 0px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
        ease: "easeOut" as const
      }
    }
  };

  return (
    <section 
      id="benefits" 
      className="min-h-screen laptop:h-screen flex items-center justify-center relative py-20 laptop:snap-start laptop:snap-always"
      ref={ref}
    >
      <motion.div 
        className="container mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {/* Our Benefits Heading - Centered above the content */}
        <motion.div 
          className="text-center mb-8 mobile-M:mb-10 tablet:mb-12 laptop:mb-16"
          variants={itemVariants}
        >
          <h2 
            className={`text-h3 mobile-M:text-h2 tablet:text-h1 laptop:text-hero font-bold text-gray-neutral100 ${fontClasses.heading}`}
          >
            Our Benefits
          </h2>
        </motion.div>
        
        <div className="flex flex-col lg:flex-row items-center gap-8 mobile-M:gap-10 tablet:gap-12 laptop:gap-16">
          {/* Left side - 40% - Image - Made larger */}
          <motion.div 
            className="hidden laptop:flex w-full lg:w-2/5 justify-center"
            variants={itemVariants}
          >
            <motion.div 
              className="relative w-full h-64 mobile-M:h-72 mobile-L:h-80 tablet:h-96 laptop:h-[28rem] rounded-lg overflow-hidden"
              whileHover={{ scale: 1.02, rotate: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Image
                src="/image/home-image2.png"
                alt="Benefits of HanapBuhay"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </motion.div>
          </motion.div>
          
          {/* Right side - 60% - Content - Made larger */}
          <motion.div 
            className="w-full laptop:w-3/5"
            variants={itemVariants}
          >
            <div 
              className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 mobile-M:p-8 tablet:p-10 laptop:p-12 border border-white border-opacity-20"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mobile-M:gap-8 tablet:gap-10 laptop:gap-12">
                {/* Column 1 - For Clients */}
                <motion.div 
                  className="space-y-5 mobile-M:space-y-6 tablet:space-y-7 laptop:space-y-8"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div className="flex flex-col items-center text-center">
                    <motion.div 
                      className="w-16 h-16 mobile-M:w-18 mobile-M:h-18 tablet:w-20 tablet:h-20 rounded-full bg-neutral-50 bg-opacity-20 flex items-center justify-center mb-4 mobile-M:mb-5"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <FaHandshake className="text-2xl mobile-M:text-3xl text-neutral-100" />
                    </motion.div>
                    <h3 
                      className={`text-lead mobile-M:text-h3 tablet:text-h2 font-bold mb-4 mobile-M:mb-5 text-gray-neutral100 ${fontClasses.heading}`}
                    >
                      For Clients
                    </h3>
                  </div>
                  
                  <div className="space-y-5">
                    {[
                      // the word "trusted, reliable workers" should be bold
                      <>Find <span className="font-bold">trusted, reliable workers</span> in your local area, without the hassle of board platforms.</>,
                      // the word "transparent ratings and reviews" should be bold
                      <>Gain confidence in your choice with <span className="font-bold">transparent ratings and reviews</span> from the community.</>,
                      // the word "Post a job in minutes" should be bold
                      <><span className="font-bold">Post a job in minutes</span> and receive responses from nearby skilled individuals.</>
                    ].map((text, index) => (
                      <motion.div 
                        key={index} 
                        className="flex items-start gap-4"
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                        transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                      >
                        <FaCheck className="text-primary-primary500 mt-1 mobile-M:mt-1.5 text-lg mobile-M:text-xl flex-shrink-0" />
                        <p 
                          className={`text-body mobile-M:text-lead text-gray-neutral100 ${fontClasses.body}`}
                        >
                          {text}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
                
                {/* Column 2 - For Workers */}
                <motion.div 
                  className="space-y-5 mobile-M:space-y-6 tablet:space-y-7 laptop:space-y-8"
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <div className="flex flex-col items-center text-center">
                    <motion.div 
                      className="w-16 h-16 mobile-M:w-18 mobile-M:h-18 tablet:w-20 tablet:h-20 rounded-full bg-neutral-50 bg-opacity-20 flex items-center justify-center mb-4 mobile-M:mb-5"
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <FaBriefcase className="text-2xl mobile-M:text-3xl text-neutral-100" />
                    </motion.div>
                    <h3 
                      className={`text-lead mobile-M:text-h3 tablet:text-h2 font-bold mb-4 mobile-M:mb-5 text-gray-neutral100 ${fontClasses.heading}`}
                    >
                      For Workers
                    </h3>
                  </div>
                  
                  <div className="space-y-3 mobile-M:space-y-4 tablet:space-y-5">
                    {[
                      // the word "monetize your skills" should be bold
                      <>Easily <span className="font-bold">monetize your skills</span> and find jobs right in your locality.</>,
                      // the word "Build your professional reputation" should be bold
                      <><span className="font-bold">Build your professional reputation</span> through client feedback and a dedicated profile.</>,
                      // the word "reach more clients" should be bold
                      <>Discover new opportunities and <span className="font-bold">reach more clients</span> in your community.</>
                    ].map((text, index) => (
                      <motion.div 
                        key={index} 
                        className="flex items-start gap-4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                        transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                      >
                        <FaCheck className="text-primary-primary500 mt-1 mobile-M:mt-1.5 text-lg mobile-M:text-xl flex-shrink-0" />
                        <p 
                          className={`text-small mobile-M:text-body tablet:text-lead text-gray-neutral100 ${fontClasses.body}`}
                        >
                          {text}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
