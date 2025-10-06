"use client";

interface ProjectViewCardProps {
  title: string;
  description?: string;
  projectPictureUrl?: string;
  titleCharLimit?: number;
  descCharLimit?: number;
  onClick?: () => void; 
}

const truncateChars = (text: string, limit: number) =>
  text.length > limit ? text.slice(0, limit) + "..." : text;

export default function ProjectViewCard({
  title,
  description,
  projectPictureUrl,
  titleCharLimit = 20,
  descCharLimit = 100,
  onClick,
}: ProjectViewCardProps) {
  return (
    <div
      onClick={onClick}
      className="flex-shrink-0 w-[173px] h-[252px] bg-white border border-gray-neutral200 rounded-[10px] shadow-md cursor-pointer 
                 hover:shadow-xl hover:scale-[1.03] transition-transform duration-200"
    >
      {projectPictureUrl ? (
        <img
          src={projectPictureUrl}
          alt={title}
          className="w-[150px] h-[94px] object-cover rounded-[10px] mx-auto mt-2"
        />
      ) : (
        <div className="w-[150px] h-[94px] bg-gray-200 rounded-[10px] flex items-center justify-center text-gray-neutral500 mx-auto mt-2">
          No Image
        </div>
      )}

      <div className="flex flex-col p-2 gap-1 h-[150px]">
        <p className="font-inter font-bold tiny text-gray-neutral700 break-words">
          {truncateChars(title, titleCharLimit)}
        </p>
        {description && (
          <p className="font-alexandria font-light mini text-gray-neutral700 break-words whitespace-pre-line">
            {truncateChars(description, descCharLimit)}
          </p>
        )}
      </div>
    </div>
  );
}
