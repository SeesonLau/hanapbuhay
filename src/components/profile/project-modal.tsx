'use client';

import { useState } from 'react';
import { Project } from '@/lib/models/profile';
import { ProjectService } from '@/lib/services/project-services';

interface ProjectAddModalProps {
  userId: string;
  project?: Project; // optional for editing
  onClose: () => void;
  onProjectAdded: () => void; // refresh list
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
    if (!title.trim()) return;

    setLoading(true);

    try {
      let imageUrl = project?.projectPictureUrl || null;
      if (imageFile) {
        imageUrl = await ProjectService.uploadProjectImage(userId, imageFile);
      }

      const newProject: Project = {
        projectId: project?.projectId, // undefined if creating
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
      }
    } catch (err) {
      console.error('Error saving project:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-96 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        <h3 className="text-lg font-semibold mb-4">Add Project</h3>
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          />
          <button
            onClick={handleApply}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Applying...' : 'Apply'}
          </button>
        </div>
      </div>
    </div>
  );
}
