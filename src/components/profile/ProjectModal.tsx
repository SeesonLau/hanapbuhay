'use client';

import { useState } from 'react';
import { Project } from '@/lib/models/profile';
import { ProjectService } from '@/lib/services/project-services';
import { toast } from 'react-hot-toast';
import { ProjectMessages } from '@/resources/messages/project';
import { GeneralMessages } from '@/resources/messages/general';
import upload from "@/assets/upload.png";
import { inter } from '@/styles/fonts';

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
        className="bg-white rounded-2xl w-[90%] max-w-[800px] max-h-[90vh] p-6 overflow-y-auto flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className={`${inter.className} font-bold text-[25px] leading-normal text-black mb-6 text-center`}>
          Add Work Experience
        </h3>

        {/* Upload Image */}
        <label className="w-full max-w-[620px] h-[255px] rounded-2xl border border-dashed border-gray-400 flex flex-col justify-center items-center overflow-hidden mb-6 cursor-pointer">
          {imageFile ? (
            <img
              src={URL.createObjectURL(imageFile)}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-5">
              <img src={upload.src} alt="Upload icon" />
              <div className="w-[78px] h-[15px] flex items-center justify-center">
                <p className="text-gray-400 text-xs font-medium">Upload Photo</p>
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
            <label className={`${inter.className} block text-black text-2xl font-semibold mb-2`}>
              Title
            </label>
            <input
              type="text"
              placeholder="Add title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-11 rounded-[10px] outline outline-1 outline-gray-400 px-4 text-base font-light placeholder-gray-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className={`${inter.className} block text-black text-2xl font-semibold mb-2`}>
              Description
            </label>
            <textarea
              placeholder="Add description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-32 rounded-[10px] outline outline-1 outline-gray-400 px-4 py-3 text-base font-light placeholder-gray-400 resize-none"
            />
          </div>

          {/* Apply Button */}
          <button
            onClick={handleApply}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 self-center"
          >
            {loading ? 'Applying...' : 'Apply'}
          </button>
        </div>
      </div>
    </div>

  );
}
