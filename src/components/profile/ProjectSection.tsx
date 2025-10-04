'use client';

import { useEffect, useState, useRef } from 'react';
import { HiArrowDown } from 'react-icons/hi';
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

  const fetchProjects = async () => {
    const data = await ProjectService.getProjectsByUserId(userId);
    setProjects(data);
  };

  useEffect(() => {
    fetchProjects();
  }, [userId]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    setIsScrollable(el.scrollHeight > el.clientHeight);

    const handleScroll = () => {
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 10;
      setIsAtBottom(atBottom);
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [projects]);

  const handleProjectAddedOrUpdated = () => {
    fetchProjects();
  };

  const handleCardClick = (project: Project) => {
    setEditingProject(project);
    setShowModal(true);
  };

  return (
    <div className={`${className} flex flex-col gap-2 px-5 relative`}>
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
        ref={scrollRef}
        className="overflow-y-auto pr-2 scrollbar-hide snap-y snap-mandatory scroll-smooth" 
        style={{ 
          height: 'calc(100vh - 280px)',
          scrollPaddingTop: '0.5rem',
          scrollPaddingBottom: '0.5rem'
        }}
      >
        <div className="flex flex-col gap-8">
          {projects.map((project) => (
            <div key={project.projectId} className="snap-start">
              <ProjectCard
                project={project}
                userId={userId}
                onClick={() => handleCardClick(project)}
                onDeleteSuccess={() => {
                  fetchProjects();
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      {isScrollable && !isAtBottom && (
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-2 bg-gradient-to-t from-white/95 to-transparent p-0 text-sm text-gray-neutral500 pointer-events-none">
          <HiArrowDown className="w-4 h-4 animate-bounce" />
        </div>
      )}

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