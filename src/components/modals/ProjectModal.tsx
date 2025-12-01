'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Project } from '@/lib/models/profile';
import { ProjectService } from '@/lib/services/project-services';
import { toast } from 'react-hot-toast';
import { ProjectMessages } from '@/resources/messages/project';
import TextBox from "../ui/TextBox";
import TextArea from "../ui/TextArea";
import Button from "../ui/Button";

interface ProjectAddModalProps {
  userId: string;
  project?: Project; 
  onClose: () => void;
  onProjectAdded: () => void; 
}

export default function ProjectAddModal({
  userId,
  project,
  onClose,
  onProjectAdded,
}: ProjectAddModalProps) {
  const [title, setTitle] = useState(project?.title || '');
  const [description, setDescription] = useState(project?.description || '');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('grid');

  const MAX_IMAGES = 6;

  useEffect(() => {
    if (project) {
      const images = ProjectService.parseProjectImages(project.projectPictureUrl);
      setExistingImages(images);
      if (images.length > 0) {
        setViewMode('carousel');
      }
    }
  }, [project]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalImages = existingImages.length + imageFiles.length + files.length;

    if (totalImages > MAX_IMAGES) {
      toast.error(`Maximum ${MAX_IMAGES} images allowed`);
      return;
    }

    setImageFiles(prev => [...prev, ...files]);
  };

  const removeNewImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
    const totalImages = existingImages.length + imageFiles.length;
    if (currentImageIndex >= totalImages - 1 && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleApply = async () => {
    if (!title.trim()) {
      toast.error(ProjectMessages.TITLE_REQUIRED);
      return;
    }

    setLoading(true);

    try {
      const projectId = project?.projectId || crypto.randomUUID();

      let newImageUrls: string[] = [];
      if (imageFiles.length > 0) {
        newImageUrls = await ProjectService.uploadMultipleProjectImages(
          userId,
          projectId,
          imageFiles
        );

        if (newImageUrls.length !== imageFiles.length) {
          toast.error('Some images failed to upload');
          setLoading(false);
          return;
        }
      }

      const allImageUrls = [...existingImages, ...newImageUrls];

      const newProject: Project = {
        projectId,
        userId,
        title,
        description,
        projectImages: allImageUrls,
        projectPictureUrl: ProjectService.stringifyProjectImages(allImageUrls),
        createdAt: project?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const success = await ProjectService.upsertProject(newProject);
      if (success) {
        onProjectAdded();
        onClose();
      } else {
        //toast.error(ProjectMessages.SAVE_PROJECT_ERROR);
      }
    } catch (err) {
     // toast.error(GeneralMessages.UNEXPECTED_ERROR);
    } finally {
      setLoading(false);
    }
  };

  const totalImages = existingImages.length + imageFiles.length;
  const canAddMore = totalImages < MAX_IMAGES;
  const allImages = [
    ...existingImages.map((url, i) => ({ type: 'existing' as const, url, index: i })),
    ...imageFiles.map((file, i) => ({ type: 'new' as const, file, index: i }))
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-white rounded-2xl w-full max-w-[750px] max-h-[90vh] p-6 md:p-10 overflow-y-auto flex flex-col items-center scrollbar-hide relative"
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 20, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl text-gray-neutral600 hover:text-gray-800 transition-colors"
          aria-label="Close modal"
        >
          ×
        </button>

        <h3 className="font-inter font-bold text-lg md:text-2xl mb-4 md:mb-6">
          {project ? 'Edit Work Experience' : 'Add Work Experience'}
        </h3>

        {/* Image Section */}
        <div className="w-full max-w-[620px] mb-4 md:mb-6">
          {viewMode === 'carousel' && allImages.length > 0 ? (
            /* Carousel View */
            <div className="relative">
              {/* Main Carousel Display */}
              <div
                className="w-full h-[180px] md:h-[260px] rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center relative group cursor-pointer"
                onClick={() => setViewMode('grid')} 
              >
                {allImages[currentImageIndex].type === 'existing' ? (
                  <img
                    src={allImages[currentImageIndex].url}
                    alt={`Project ${currentImageIndex + 1}`}
                    className="w-full h-full object-contain bg-white"
                  />
                ) : (
                  <img
                    src={URL.createObjectURL(allImages[currentImageIndex].file)}
                    alt={`New ${currentImageIndex + 1}`}
                    className="w-full h-full object-contain bg-white"
                  />
                )}

                {/* Carousel Navigation */}
                {allImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); prevImage(); }} 
                      className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-gray-800 hover:bg-gray-700 text-white rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); nextImage(); }} 
                      className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-gray-800 hover:bg-gray-700 text-white rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      →
                    </button>
                  </>
                )}

                {/* Dot Indicators */}
                <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 md:gap-2">
                  {allImages.map((_, index) => (
                    <span
                      key={index}
                      className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${
                        index === currentImageIndex ? 'bg-gray-800' : 'bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              </div>

            </div>
          ) : (
            
            /* Grid View */
            <div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {/* Existing Images */}
                {existingImages.map((url, index) => (
                  <div key={`existing-${index}`} className="relative group aspect-square">
                    <img
                      src={url}
                      alt={`Project ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg border-2 border-gray-neutral300"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute top-1 right-1 md:top-2 md:right-2 bg-red-500 text-white rounded-full w-6 h-6 md:w-7 md:h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg text-sm md:text-base"
                    >
                      ×
                    </button>
                  </div>
                ))}

                {/* New Images */}
                {imageFiles.map((file, index) => (
                  <div key={`new-${index}`} className="relative group aspect-square">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`New ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg border-2 border-gray-neutral300" 
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute top-1 right-1 md:top-2 md:right-2 bg-red-500 text-white rounded-full w-6 h-6 md:w-7 md:h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg text-sm md:text-base"
                    >
                      ×
                    </button>
                  </div>
                ))}

                {/* Upload Button */}
                {canAddMore && (
                  <label className="aspect-square rounded-lg border-2 border-dashed border-gray-neutral400 hover:border-blue-500 hover:bg-blue-50 flex flex-col items-center justify-center cursor-pointer transition-all group">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 md:h-10 md:w-10 text-gray-neutral400 group-hover:text-blue-500 mb-1 md:mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <p className="text-xs text-gray-neutral500 group-hover:text-blue-500 font-medium">Add Photo</p>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Image Count Info */}
              <div className="mt-2 md:mt-3 text-center">
                <p className="text-xs md:text-sm text-grayneutral500">
                  {totalImages} / {MAX_IMAGES} images
                  {!canAddMore && <span className="text-red-500 ml-2">• Maximum reached</span>}
                </p>
              </div>

            </div>
          )}
        </div>

        <div className="w-full max-w-[620px] flex flex-col gap-3 md:gap-4">
          {/* Title */}
          <div>
            <TextBox
              label="Title"
              type="text"
              placeholder="Add title"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Description */}
          <div>
            <TextArea
              label="Description"
              placeholder="Add description"
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
              className="w-full"
              height="7.5rem"
              showCharCount={true}
              maxLength={500}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleApply}
              disabled={loading}
              variant="primary"
              size="md"
              className="flex-1"
              fullRounded={true}
            >
              {project ? 'Update' : 'Add'}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}