'use client';

import { useState } from 'react';
import { Project } from '@/lib/models/profile';
import DeleteIcon from "@/assets/delete.svg";
import { DeleteModal } from '@/components/ui/DeleteModal';
import { ProjectService } from '@/lib/services/project-services';
import { toast } from 'react-hot-toast';
import { ProjectMessages } from '@/resources/messages/project';

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
  userId, // Add this here
  onClick,
  onDeleteSuccess,
  titleCharLimit = 50, 
  descCharLimit = 200, 
}: ProjectCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  return (
    <>
      <div
        onClick={onClick}
        className="flex w-full max-w-[873px] h-[250px] p-[15px] gap-x-10 bg-white shadow rounded-lg cursor-pointer hover:shadow-md transition"
      >
        {/* Image / Placeholder */}
        {project.projectPictureUrl ? (
          <img
            src={project.projectPictureUrl}
            alt={project.title}
            className="w-1/2 h-full object-cover rounded-lg flex-shrink-0"
          />
        ) : (
          <div className="w-1/2 h-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-neutral500 flex-shrink-0">
            No Image
          </div>
        )}

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

          <div className="flex justify-end flex-shrink-0">
            <img 
              src={DeleteIcon.src}
              alt="Delete"
              onClick={handleDeleteClick}
              className="p-1 text-error-error500 hover:text-error-error600 hover:bg-error-error50 rounded transition-colors flex-shrink-0" 
            />
          </div>
        </div>
      </div>

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Work Experience"
        description="Are you sure you want to delete this work experience? This action cannot be undone."
        confirmText="Delete"
        variant="trash"
        isProcessing={isDeleting}
      />
    </>
  );
}