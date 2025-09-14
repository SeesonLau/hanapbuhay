'use client';

import { useEffect, useState } from 'react';
import { Project } from '@/lib/models/profile';
import { ProjectService } from '@/lib/services/project-services';
import ProjectAddModal from './ProjectModal';

interface ProjectsSectionProps {
  userId: string;
}

export default function ProjectsSection({ userId }: ProjectsSectionProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const fetchProjects = async () => {
    const data = await ProjectService.getProjectsByUserId(userId);
    setProjects(data);
  };

  useEffect(() => {
    fetchProjects();
  }, [userId]);

  const handleProjectAddedOrUpdated = () => {
    fetchProjects();
  };

  const handleCardClick = (project: Project) => {
    setEditingProject(project);
    setShowModal(true);
  };

  return (
    <div className="w-1/2 flex flex-col gap-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Projects</h2>
        <button
          onClick={() => { setEditingProject(null); setShowModal(true); }}
          className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
        >
          Add Project
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {projects.map((project) => (
          <div
            key={project.projectId}
            onClick={() => handleCardClick(project)}
            className="bg-white shadow rounded-lg p-4 cursor-pointer hover:shadow-md transition"
          >
            {project.projectPictureUrl && (
              <img
                src={project.projectPictureUrl}
                alt={project.title}
                className="w-full h-32 object-cover rounded-md mb-2"
              />
            )}
            <h3 className="font-semibold text-lg">{project.title}</h3>
            {project.description && <p className="text-gray-500">{project.description}</p>}
          </div>
        ))}
      </div>

      {showModal && (
        <ProjectAddModal
          userId={userId}
          project={editingProject || undefined}
          onClose={() => setShowModal(false)}
          onProjectAdded={handleProjectAddedOrUpdated}
        />
      )}
    </div>
  );
}
