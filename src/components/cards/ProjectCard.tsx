'use client';

import { useState } from 'react';
import { Project } from '@/lib/models/profile';
import { DeleteModal } from '@/components/ui/DeleteModal';
import { ProjectService } from '@/lib/services/project-services';
import { toast } from 'react-hot-toast';
import { ProjectMessages } from '@/resources/messages/project';
import { X } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

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
  const { theme } = useTheme();
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
        className="relative flex w-full max-w-[873px] h-[15.475rem] p-[15px] gap-x-10 shadow rounded-lg cursor-pointer transition"
        style={{
          backgroundColor: theme.colors.cardBg,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)';
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleDeleteClick}
          className="absolute top-3 right-3 p-1.5 rounded-full transition-colors"
          style={{
            backgroundColor: 'transparent',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.backgroundSecondary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <X 
            size={20} 
            style={{ color: theme.colors.textSecondary }}
          />
        </button>

        {/* Image Carousel */}
        <div 
          className="relative aspect-square w-[45%] flex-shrink-0 overflow-hidden rounded-lg group"
          style={{ backgroundColor: theme.colors.backgroundSecondary }}
        >
          {images && images.length > 0 ? (
            <>
              <img
                src={images[currentImageIndex]}
                alt={`${project.title} image ${currentImageIndex + 1}`}
                className="w-full h-full object-contain transition-all duration-300"
                style={{ backgroundColor: theme.colors.surface }}
              />

              {/* Navigation arrows */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md transition opacity-0 group-hover:opacity-100"
                    style={{ backgroundColor: theme.colors.text }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = theme.colors.textSecondary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = theme.colors.text;
                    }}
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md transition opacity-0 group-hover:opacity-100"
                    style={{ backgroundColor: theme.colors.text }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = theme.colors.textSecondary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = theme.colors.text;
                    }}
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
                      className="w-2.5 h-2.5 rounded-full transition-all"
                      style={{
                        backgroundColor: i === currentImageIndex 
                          ? theme.colors.text 
                          : theme.colors.textMuted,
                      }}
                    ></div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center"
              style={{ color: theme.colors.textMuted }}
            >
              No Image
            </div>
          )}
        </div>

        {/* Text Content */}
        <div className="flex flex-col flex-1 min-w-0 min-h-0 gap-2 pr-2 justify-center">
          <div className="flex-shrink-0"> 
            <p 
              className="font-inter font-bold text-xl line-clamp-2 break-words"
              style={{ color: theme.colors.text }}
            >
              {truncateChars(project.title ?? '', titleCharLimit)}
            </p>
          </div>

          {project.description && (
            <div className="flex-1 min-h-0 overflow-hidden max-w-md">
              <p 
                className="font-inter font-light line-clamp-5 break-words whitespace-pre-line"
                style={{ color: theme.colors.textSecondary }}
              >
                {truncateChars(project.description ?? '', descCharLimit)}
              </p>
            </div>
          )}
        </div>
      </div>

      <DeleteModal
        isOpen={showDeleteModal}
        isProcessing={isDeleting}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        modalType="deleteProject"
      />
    </>
  );
}