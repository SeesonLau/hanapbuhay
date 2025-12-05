// src/components/home/TestimonialsSection.tsx
'use client';
import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { fontClasses } from '@/styles/fonts';

export default function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2, margin: "-20% 0px -20% 0px" });

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

  const cardVariants = {
    hidden: { opacity: 0, y: 50, rotateX: -15 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut" as const
      }
    }
  };

  const testimonials = [
    {
      image: "/image/phoebe.jpeg",
      quote: "I found a fantastic handyman for my plumbing issue in less than an hour. The rating system gave me peace of mind. Highly recommend!",
      name: "Maria D.",
      role: "Client"
    },
    {
      image: "/image/phoebe.jpeg",
      quote: "HanapBuhay helped me get steady work as a tutor. The local job postings are exactly what I needed to grow my side business.",
      name: "Michelle R.",
      role: "Freelancer"
    },
    {
      image: "/image/phoebe.jpeg",
      quote: "I found a fantastic handyman for my plumbing issue in less than an hour. The rating system gave me peace of mind. Highly recommend!",
      name: "Phoebe W.",
      role: "Client"
    }
  ];

  return (
    <section 
      id="testimonials" 
      className="min-h-screen laptop:h-screen flex items-center justify-center relative py-20 laptop:snap-start laptop:snap-always"
      ref={ref}
    >
      <div className="container mx-auto px-4">
        {/* Testimonials Heading */}
        <motion.div 
          className="text-center mb-8 mobile-M:mb-10 tablet:mb-12 laptop:mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
          transition={{ duration: 0.6 }}
        >
          <h2 
            className={`text-h3 mobile-M:text-h2 tablet:text-h1 laptop:text-hero font-bold text-gray-neutral100 ${fontClasses.heading}`}
          >
            Testimonials
          </h2>
        </motion.div>
        
        {/* Three Columns */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-5 mobile-M:gap-6 tablet:gap-8 laptop:gap-10 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-5 mobile-M:p-6 tablet:p-7 laptop:p-8 border border-white border-opacity-20 flex flex-col items-center text-center"
              style={{ 
                backgroundColor: 'rgba(30, 58, 138, 0.15)',
                boxShadow: '0 8px 32px rgba(30, 58, 138, 0.2)',
                borderColor: 'rgba(59, 130, 246, 0.2)'
              }}
              variants={cardVariants}
              whileHover={{ 
                scale: 1.05,
                y: -10,
                boxShadow: '0 16px 48px rgba(30, 58, 138, 0.3)'
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <motion.div 
                className="w-24 h-24 mobile-M:w-28 mobile-M:h-28 tablet:w-32 tablet:h-32 rounded-full overflow-hidden mb-4 mobile-M:mb-5 tablet:mb-6 border-3 mobile-M:border-4 border-white/20" 
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <Image 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  width={128} 
                  height={128} 
                  className="object-cover w-full h-full"
                />
              </motion.div>
              <p 
                className={`text-small mobile-M:text-body tablet:text-lead mb-4 mobile-M:mb-5 tablet:mb-6 text-gray-neutral300 ${fontClasses.body}`}
              >
                "{testimonial.quote}"
              </p>
              <p 
                className={`text-small mobile-M:text-body tablet:text-lead font-bold mb-2 text-white ${fontClasses.body}`}
              >
                - {testimonial.name}
              </p>
              <p 
                className={`text-small mobile-M:text-body text-gray-neutral600 ${fontClasses.body}`}
              >
                {testimonial.role}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
