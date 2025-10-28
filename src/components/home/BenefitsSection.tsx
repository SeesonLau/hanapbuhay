// src/components/home/BenefitsSection.tsx
'use client';
import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { FaHandshake, FaBriefcase, FaCheck } from 'react-icons/fa';
import { getNeutral100Color, getNeutral600Color } from '@/styles/colors';
import { fontClasses } from '@/styles/fonts';

export default function BenefitsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
      className="min-h-screen flex items-center justify-center relative py-20"
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
          className="text-center mb-16"
          variants={itemVariants}
        >
          <h2 
            className={`text-5xl md:text-6xl font-bold ${fontClasses.heading}`}
            style={{ color: getNeutral100Color() }}
          >
            Our Benefits
          </h2>
        </motion.div>
        
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left side - 40% - Image - Made larger */}
          <motion.div 
            className="w-full lg:w-2/5 flex justify-center"
            variants={itemVariants}
          >
            <motion.div 
              className="relative w-full h-96 lg:h-[32rem] rounded-lg overflow-hidden"
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
            className="w-full lg:w-3/5"
            variants={itemVariants}
          >
            <div 
              className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-10 lg:p-14 border border-white border-opacity-20"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
                {/* Column 1 - For Clients */}
                <motion.div 
                  className="space-y-8"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div className="flex flex-col items-center text-center">
                    <motion.div 
                      className="w-20 h-20 rounded-full bg-neutral-50 bg-opacity-20 flex items-center justify-center mb-5"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <FaHandshake className="text-3xl text-neutral-100" />
                    </motion.div>
                    <h3 
                      className={`text-3xl font-bold mb-5 ${fontClasses.heading}`}
                      style={{ color: getNeutral100Color() }}
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
                        <FaCheck className="text-green-400 mt-1.5 text-xl flex-shrink-0" />
                        <p 
                          className={`text-lg ${fontClasses.body}`}
                          style={{ color: getNeutral100Color() }}
                        >
                          {text}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
                
                {/* Column 2 - For Workers */}
                <motion.div 
                  className="space-y-8"
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <div className="flex flex-col items-center text-center">
                    <motion.div 
                      className="w-20 h-20 rounded-full bg-neutral-50 bg-opacity-20 flex items-center justify-center mb-5"
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <FaBriefcase className="text-3xl text-neutral-100" />
                    </motion.div>
                    <h3 
                      className={`text-3xl font-bold mb-5 ${fontClasses.heading}`}
                      style={{ color: getNeutral100Color() }}
                    >
                      For Workers
                    </h3>
                  </div>
                  
                  <div className="space-y-5">
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
                        <FaCheck className="text-green-400 mt-1.5 text-xl flex-shrink-0" />
                        <p 
                          className={`text-lg ${fontClasses.body}`}
                          style={{ color: getNeutral100Color() }}
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
