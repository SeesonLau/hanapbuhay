"use client";

import { useState, useRef, useEffect } from "react";
import { HiArrowRight } from "react-icons/hi";
import ProjectViewCard from "./cards/ProjectViewCard";
import ProjectViewModal from "@/components/modals/ProjectViewModal";
import { ProjectService } from "@/lib/services/project-services";
import { Project } from "@/lib/models/profile";

interface ProjectListSectionProps {
  userId: string;
}

export default function ProjectListSection({ userId }: ProjectListSectionProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const projectsData = await ProjectService.getProjectsByUserId(userId);
        setProjects(projectsData);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [userId]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    setIsScrollable(el.scrollWidth > el.clientWidth);

    const handleScroll = () => {
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 10;
      setIsAtEnd(atEnd);
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [projects]);

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += e.deltaY;
      e.preventDefault();
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center w-full h-[348px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400"></div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="p-6 w-full h-[348px] flex flex-col">
        <p className="font-inter font-semibold body">Work Experiences</p>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-center text-gray-neutral400">No work experiences added</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 relative -mb-4 w-full max-w-[795px] h-[348px]">
      <p className="font-inter font-semibold body mb-2">Work Experiences</p>

      <div
        ref={scrollRef}
        onWheel={handleWheel}
        className="flex gap-4 p-2 overflow-x-auto w-full scrollbar-hide scroll-smooth snap-x snap-mandatory justify-start"
        style={{ scrollPaddingLeft: "0.5rem", scrollPaddingRight: "0.5rem" }}
      >
        {projects.map((project, index) => (
          <div className="snap-start flex-shrink-0" key={project.projectId || index}>
            <ProjectViewCard
              title={project.title}
              description={project.description || undefined}
              projectPictureUrl={project.projectImages?.[0]}
              onClick={() => setSelectedProject(project)}
            />
          </div>
        ))}
      </div>

      {isScrollable && !isAtEnd && (
        <div className="absolute top-1/2 -translate-y-1/2 right-0 h-32 flex items-center justify-center px-2 bg-gradient-to-l from-white/95 to-transparent pointer-events-none">
          <HiArrowRight className="w-4 h-4 text-gray-neutral500 animate-bounce" />
        </div>
      )}

      {selectedProject && (
        <ProjectViewModal
          projectId={selectedProject.projectId || ""}
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          title={selectedProject.title}
          description={selectedProject.description || undefined}
          projectPictureUrls={selectedProject.projectImages || []}
        />
      )}
    </div>
  );
}