'use client';

import { Project } from '@/lib/models/profile';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <div
      onClick={onClick}
      className="flex w-full max-w-[873px] h-[250px] p-[15px] gap-x-10 gap-y-20 bg-white shadow rounded-lg cursor-pointer hover:shadow-md transition"
    >

      {project.projectPictureUrl ? (
        <img
          src={project.projectPictureUrl}
          alt={project.title}
          className="w-[220px] h-full object-cover rounded-lg"
        />
      ) : (
        <div className="w-[220px] h-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
          No Image
        </div>
      )}

      <div className="flex flex-col justify-center flex-1">
        <h3 className="font-semibold text-xl mb-2">{project.title}</h3>
        {project.description && (
          <p className="text-gray-600 text-base line-clamp-5">{project.description}</p>
        )}
      </div>
    </div>
  );
}
