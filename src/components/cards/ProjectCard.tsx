'use client';

import { useState } from 'react';
import { Project } from '@/lib/models/profile';
import { DeleteModal } from '@/components/ui/DeleteModal';
import { ProjectService } from '@/lib/services/project-services';
import { toast } from 'react-hot-toast';
import { ProjectMessages } from '@/resources/messages/project';
import { X } from 'lucide-react'; // Using a clean close icon

interface ProjectCardProps {
  project: Project;
  userId: string;
  onClick: () => void;
  onDeleteSuccess: () => void;
  titleCharLimit?: number;
  descCharLimit?: number;
}

export default function ProjectCard({
  project,
  userId,
  onClick,
  onDeleteSuccess,
  titleCharLimit = 50,
  descCharLimit = 200,
}: ProjectCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const truncateChars = (text: string, limit: number) => {
    if (!text) return '';
    return text.length <= limit ? text : text.slice(0, limit) + '...';
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      if (!project.projectId || !userId) {
        toast.error(ProjectMessages.MISSING_PROJECT_INFO);
        setIsDeleting(false);
        return;
      }
      const success = await ProjectService.deleteProject(project.projectId, userId);
      if (success) {
        setShowDeleteModal(false);
        await new Promise(resolve => setTimeout(resolve, 100));
        onDeleteSuccess();
      }
    } finally {
      setIsDeleting(false);
    }
  };

  // Parse project images
  const images = project.projectImages?.length
    ? project.projectImages
    : ProjectService.parseProjectImages(project.projectPictureUrl);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!images || images.length <= 1) return;
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!images || images.length <= 1) return;
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <div
        onClick={onClick}
        className="relative flex w-full max-w-[873px] h-[15.475rem] p-[15px] gap-x-10 bg-white shadow rounded-lg cursor-pointer hover:shadow-md transition"
      >
        {/* Close Button */}
        <button
          onClick={handleDeleteClick}
          className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-gray-neutral100 transition-colors"
        >
          <X size={20} className="text-gray-neutral600 hover:text-gray-neutral800" />
        </button>

        {/* Image Carousel */}
        <div className="relative aspect-square w-[45%] flex-shrink-0 overflow-hidden rounded-lg bg-gray-neutral200 group">

          {images && images.length > 0 ? (
            <>
              <img
                src={images[currentImageIndex]}
                alt={`${project.title} image ${currentImageIndex + 1}`}
                className="w-full h-full object-contain bg-white transition-all duration-300"
              />

              {/* Navigation arrows */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-gray-800 hover:bg-gray-700 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:bg-white transition opacity-0 group-hover:opacity-100"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-gray-800 hover:bg-gray-700 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:bg-white transition opacity-0 group-hover:opacity-100"
                  >
                    →
                  </button>
                </>
              )}

              {/* Dots indicator */}
              {images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, i) => (
                    <div
                      key={i}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        i === currentImageIndex ? 'bg-gray-800' : 'bg-gray-400'
                      }`}
                    ></div>
                  ))}
                </div>
              )}

            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-neutral500">
              No Image
            </div>
          )}
        </div>

        {/* Text Content */}
        <div className="flex flex-col flex-1 min-w-0 min-h-0 gap-2 pr-2 justify-center">
          <div className="flex-shrink-0"> 
            <p className="font-inter font-bold text-xl line-clamp-2 break-words">
              {truncateChars(project.title ?? '', titleCharLimit)}
            </p>
          </div>

          {project.description && (
            <div className="flex-1 min-h-0 overflow-hidden max-w-md">
              <p className="font-inter font-light text-gray-neutral800 line-clamp-5 break-words whitespace-pre-line">
                {truncateChars(project.description ?? '', descCharLimit)}
              </p>
            </div>
          )}
        </div>
      </div>

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Project"
        description="Are you sure you want to delete this project? This action cannot be undone."
        confirmText="Delete"
        variant="trash"
      />
    </>
  );
}
