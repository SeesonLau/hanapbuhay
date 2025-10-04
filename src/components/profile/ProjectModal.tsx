'use client';

import { useState } from 'react';
import { Project } from '@/lib/models/profile';
import { ProjectService } from '@/lib/services/project-services';
import { toast } from 'react-hot-toast';
import { ProjectMessages } from '@/resources/messages/project';
import { GeneralMessages } from '@/resources/messages/general';
import UploadIcon from "@/assets/upload.svg";
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    if (!title.trim()) {
        toast.error(ProjectMessages.TITLE_REQUIRED);
        return;
    }

    try {
      const projectId = project?.projectId || crypto.randomUUID();

      let imageUrl = project?.projectPictureUrl || null;
      if (imageFile) {
        const uploadedUrl = await ProjectService.uploadProjectImage(userId, projectId, imageFile);
        if (!uploadedUrl) {
          setLoading(false);
          return;
        }
        imageUrl = uploadedUrl;
      }

      const newProject: Project = {
        projectId,
        userId,
        title,
        description,
        projectPictureUrl: imageUrl,
        createdAt: project?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const success = await ProjectService.upsertProject(newProject);
      if (success) {
        onProjectAdded();
        onClose();
      } else {
        toast.error(ProjectMessages.SAVE_PROJECT_ERROR)
      }
    } catch (err) {
      toast.error(GeneralMessages.UNEXPECTED_ERROR);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-[90%] max-w-[750px] max-h-[90vh] p-10 overflow-y-auto flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-inter font-bold mb-3">
          {project ? 'Edit Work Experience' : 'Add Work Experience'}
        </h3>

        {/* Upload Image */}
        <label className="w-full max-w-[620px] h-[255px] rounded-2xl border border-dashed border-gray-neutral400 flex flex-col justify-center items-center overflow-hidden mb-6 cursor-pointer transition-all duration-300 hover:border-blue-400 hover:bg-blue-50/50 group">
          {imageFile ? (
            <img
              src={URL.createObjectURL(imageFile)}
              alt="Preview"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : project?.projectPictureUrl ? (
            <img
              src={project.projectPictureUrl}
              alt="Current project image"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex flex-col items-center gap-5 transition-transform duration-300 group-hover:scale-105">
              <img 
                src={UploadIcon.src} 
                alt="Upload" 
                className="transition-all duration-300 group-hover:[filter:brightness(0)_saturate(100%)_invert(42%)_sepia(93%)_saturate(1352%)_hue-rotate(200deg)_brightness(103%)_contrast(101%)]" 
              />
              <div className="w-[78px] h-[15px] flex items-center justify-center">
                <p className="text-gray-neutral400 text-xs font-medium transition-colors duration-300 group-hover:text-blue-500">Upload Photo</p>
              </div>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="hidden"
          />
        </label>

        <div className="w-full max-w-[620px] flex flex-col gap-4">
          {/* Title */}
          <div>
            <TextBox
              label="Title"
              type="text"
              placeholder="Add title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full"
            />
          </div>
          {/* Description */}
          <div>
            <TextArea
              label="Description"
              placeholder="Add description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full"
              height="11.125rem"
              showCharCount={true}
              maxLength={500}
            />
          </div>

          {/* Apply Button */}
          <Button
            onClick={handleApply}
            disabled={loading}
            isLoading={loading}
            variant="primary"
            size="md"
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
}
