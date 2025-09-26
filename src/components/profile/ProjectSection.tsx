'use client';

import { useEffect, useState } from 'react';
import { Project } from '@/lib/models/profile';
import { ProjectService } from '@/lib/services/project-services';
import ProjectAddModal from './ProjectModal';
import ProjectCard from './ProjectCard'; 

interface ProjectsSectionProps {
  userId: string;
  className?: string;
}

export default function ProjectsSection({ userId, className }: ProjectsSectionProps) {
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
    <div className={`${className} flex flex-col gap-4 `}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-inter font-bold text-[20px] sm:text-[24px] md:text-[28px] lg:text-[30px] leading-[1.2] text-black">
          Add Work Experience
        </h2>
        <button
          onClick={() => { setEditingProject(null); setShowModal(true); }}
          className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
        >
          Add Project
        </button>
      </div>

      {/* Projects List */}
      <div className="overflow-y-auto max-h-[600px] pr-2 scrollbar-hide">
        <div className="flex flex-col gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.projectId}
              project={project}
              onClick={() => handleCardClick(project)}
            />
          ))}
        </div>
      </div>

      {/* Project Add Modal */}
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
