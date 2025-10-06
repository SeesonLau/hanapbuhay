"use client";

import { useState, useRef, useEffect } from "react";
import { HiArrowRight } from "react-icons/hi";
import ProjectViewCard from "./cards/ProjectViewCard";
import ProjectViewModal from "@/components/modals/ProjectViewModal";

interface Project {
  projectId: string;
  title: string;
  description?: string;
  projectPictureUrl?: string;
}

export default function ProjectListSection() {
  const [projects] = useState<Project[]>([
    { projectId: "1", title: "E-commerce Website", description: "Full-stack e-commerce platform workworkworkworkworkworkworkworkworkworkworkworkworkworkworkworkworkworkworkworkwork" },
    { projectId: "2", title: "Portfolio Website", description: "Personal portfolio website" },
    { projectId: "3", title: "Mobile Chat App", description: "Real-time chat app" },
    { projectId: "4", title: "Blog Platform", description: "Modern blogging platform" },
    { projectId: "5", title: "Task Manager", description: "Productivity app for tasks" },
    { projectId: "6", title: "Social Media Dashboard", description: "Analytics dashboard" },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null); // modal state

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

  return (
    <div className="p-6 relative">
      <p className="font-inter font-semibold mb-2 body">Work Experiences</p>

      <div
        ref={scrollRef}
        onWheel={handleWheel}
        className="flex gap-4 p-2 overflow-x-auto max-w-full scrollbar-hide scroll-smooth snap-x snap-mandatory"
        style={{ scrollPaddingLeft: "0.5rem", scrollPaddingRight: "0.5rem" }}
      >
        {projects.map((project) => (
          <div className="snap-start flex-shrink-0" key={project.projectId}>
            <ProjectViewCard
              title={project.title}
              description={project.description}
              projectPictureUrl={project.projectPictureUrl}
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
          projectId={selectedProject.projectId}
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          title={selectedProject.title}
          description={selectedProject.description}
          projectPictureUrl={selectedProject.projectPictureUrl}
        />
      )}
    </div>
  );
}
