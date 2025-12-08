'use client';

import { useEffect, useState, useRef } from 'react';
import { HiArrowDown } from 'react-icons/hi';
import { Project } from '@/lib/models/profile';
import { ProjectService } from '@/lib/services/project-services';
import ProjectAddModal from '../modals/ProjectModal';
import ProjectCard from '../cards/ProjectCard'; 
import AddButton from "@/assets/add.svg";
import { useTheme } from '@/hooks/useTheme';

interface ProjectsSectionProps {
  userId: string;
  className?: string;
}

export default function ProjectsSection({ userId, className }: ProjectsSectionProps) {
  const { theme } = useTheme();
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

  const handleAddClick = () => {
    setEditingProject(null);
    setShowModal(true);
  };

  return (
    <>
      <div className={`${className} flex flex-col gap-3 px-5 relative`}>
        <div className="flex items-center justify-center gap-4 lg:justify-start">
          <h3 
            className="text-description font-inter font-bold"
            style={{ color: theme.colors.text }}
          >
            Work Experience
          </h3>
          {/* Desktop Add Button */}
          <button
            onClick={handleAddClick}
            className="lg:block hidden hover:opacity-70 transition"
          >
            <img src={AddButton.src} alt="Add Project" className="w-8 h-8" />
          </button>
        </div>

        {/* Projects List */}
        <div
          ref={scrollRef}
          className="overflow-y-auto pr-2 scrollbar-hide scroll-smooth snap-y snap-mandatory"
          style={{
            height: 'calc(100vh - 280px)',
            scrollSnapType: 'y mandatory',
          }}
        >
          <div className="flex flex-col gap-8">
            {projects.map((project, index) => (
              <div
                key={project.projectId}
                className="snap-start"
                style={{
                  scrollSnapAlign: 'start',
                  marginTop: index === 0 ? '0' : undefined,
                  marginBottom: index === projects.length - 1 ? '0.5rem' : undefined,
                }}
              >
                <ProjectCard
                  project={project}
                  userId={userId}
                  onClick={() => handleCardClick(project)}
                  onDeleteSuccess={fetchProjects}
                />
              </div>
            ))}
          </div>
        </div>

        <div
          className="absolute left-0 right-0 flex items-center justify-center p-2 text-sm pointer-events-none"
          style={{ 
            bottom: '-0.5rem',
            color: theme.colors.textMuted
          }}
        >
          <HiArrowDown className="w-4 h-4 animate-bounce" />
        </div>
      </div>

      {/* Floating Add Button - Mobile/Tablet only */}
      {!showModal && (
        <button
          aria-label="Work Experience"
          onClick={handleAddClick}
          className="lg:hidden fixed bottom-6 right-6 z-40 bg-transparent shadow-none p-0 flex items-center justify-center"
        >
          <img 
            src={AddButton.src} 
            alt="Add" 
            className="w-16 h-16" 
            style={{ filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.25))' }}
          />
        </button>
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
    </>
  );
}