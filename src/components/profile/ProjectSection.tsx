'use client';

import { useEffect, useState } from 'react';
import { Project } from '@/lib/models/profile';
import { ProjectService } from '@/lib/services/project-services';
import ProjectAddModal from './ProjectModal';
import ProjectCard from './ProjectCard'; 
import AddButton from "@/assets/add.svg";

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
    <div className={`${className} flex flex-col gap-2 px-5`}>
      <div className="flex items-center gap-2">
        <h3 className="font-inter font-bold text-gray-neutral700">
          Add Work Experience
        </h3>
        <button
          onClick={() => { setEditingProject(null); setShowModal(true); }}
          className="hover:opacity-70 transition"
        >
          <img src={AddButton.src} alt="Add Project" className="w-8 h-8" />
        </button>
      </div>

      {/* Projects List */}
      <div 
        className="overflow-y-auto pr-2 scrollbar-hide" 
        style={{ height: 'calc(100vh - 280px)' }}
      >
        <div className="flex flex-col gap-4">
          {projects.map((project) => (
            <ProjectCard
          key={project.projectId}
          project={project}
          userId={userId}
          onClick={() => handleCardClick(project)}
          onDeleteSuccess={() => {
            fetchProjects();
          }}
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
