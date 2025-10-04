"use client";

interface ProjectViewModalProps {
  title: string;
  description?: string;
  projectPictureUrl?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectViewModal({
  title,
  description,
  projectPictureUrl,
  isOpen,
  onClose,
}: ProjectViewModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[10px] shadow-xl w-full max-w-md h-[550px] p-8 flex flex-col"
        onClick={(e) => e.stopPropagation()} 
      >
        {/* Image */}
        {projectPictureUrl ? (
          <img
            src={projectPictureUrl}
            alt={title}
            className="w-full h-[180px] object-cover rounded-[10px] mb-4 flex-shrink-0"
          />
        ) : (
          <div className="w-full h-[180px] bg-gray-200 rounded-[10px] flex items-center justify-center text-gray-neutral500 mb-4 flex-shrink-0">
            No Image
          </div>
        )}

        {/* Title */}
        <h2 className="font-inter font-bold mb-4 text-gray-neutral800">{title}</h2>

        {/* Description */}
        {description && (
          <div className="overflow-y-auto">
            <p className="font-alexandria font-light text-gray-neutral600 whitespace-pre-wrap break-words body">
              {description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
