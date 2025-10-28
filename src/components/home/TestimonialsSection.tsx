// src/components/home/TestimonialsSection.tsx
'use client';
import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { getBlueDarkColor, getNeutral600Color, getNeutral300Color, getWhiteColor } from '@/styles/colors';
import { fontClasses } from '@/styles/fonts';

export default function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
      className="min-h-screen flex items-center justify-center relative py-20"
      ref={ref}
    >
      <div className="container mx-auto px-4">
        {/* Testimonials Heading */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
          transition={{ duration: 0.6 }}
        >
          <h2 
            className={`text-5xl md:text-6xl font-bold ${fontClasses.heading}`}
            style={{ color: getBlueDarkColor('default') }}
          >
            Testimonials
          </h2>
        </motion.div>
        
        {/* Three Columns */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-8 border border-white border-opacity-20 flex flex-col items-center text-center"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}
              variants={cardVariants}
              whileHover={{ 
                scale: 1.05,
                y: -10,
                boxShadow: '0 16px 48px rgba(0, 0, 0, 0.15)'
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <motion.div 
                className="w-32 h-32 rounded-full overflow-hidden mb-6 border-4" 
                style={{ borderColor: getWhiteColor(0.2) }}
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
                className={`text-lg mb-6 ${fontClasses.body}`}
                style={{ color: getNeutral300Color() }}
              >
                "{testimonial.quote}"
              </p>
              <p 
                className={`text-lg font-bold mb-2 ${fontClasses.body}`}
                style={{ color: getWhiteColor() }}
              >
                - {testimonial.name}
              </p>
              <p 
                className={`text-md ${fontClasses.body}`}
                style={{ color: getNeutral600Color() }}
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
