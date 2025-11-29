"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

interface ProjectViewModalProps {
  projectId: string;
  title: string;
  description?: string;
  projectPictureUrls?: string[]; // Changed to array
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectViewModal({
  title,
  description,
  projectPictureUrls = [],
  isOpen,
  onClose,
}: ProjectViewModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen) return null;

  const hasImages = projectPictureUrls.length > 0;
  const hasMultipleImages = projectPictureUrls.length > 1;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % projectPictureUrls.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? projectPictureUrls.length - 1 : prev - 1
    );
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-auto"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-white rounded-[10px] shadow-xl w-full max-w-md h-[550px] p-8 flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 20, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >

        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="absolute top-4 right-4 text-2xl text-gray-neutral600 hover:text-gray-800 transition-colors"
          aria-label="Close modal"
        >
          ×
        </button>

        {/* Image Carousel */}
        {hasImages ? (
          <div className="relative w-full h-[180px] mb-4 flex-shrink-0">
            <div className="w-full h-full rounded-[10px] overflow-hidden bg-gray-100 flex items-center justify-center relative group">
              <img
                src={projectPictureUrls[currentImageIndex]}
                alt={`${title} ${currentImageIndex + 1}`}
                className="w-full h-full object-contain bg-white"
              />

              {/* Carousel Navigation */}
              {hasMultipleImages && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-800 hover:bg-gray-700 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-800 hover:bg-gray-700 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    →
                  </button>
                </>
              )}

              {/* Dot Indicators */}
              {hasMultipleImages && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                  {projectPictureUrls.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(index);
                      }}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex ? 'bg-gray-800' : 'bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="w-full h-[180px] bg-gray-200 rounded-[10px] flex items-center justify-center text-gray-neutral500 mb-4 flex-shrink-0">
            No Image
          </div>
        )}

        {/* Title */}
        <h2 className="font-inter font-bold mb-4 text-gray-neutral800">{title}</h2>

        {/* Description */}
        {description && (
          <div className="overflow-y-auto">
            <p className="font-alexandria font-light text-gray-neutral600 whitespace-pre-wrap break-words body">
              {description}
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
