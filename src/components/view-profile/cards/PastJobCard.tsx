import React from 'react';
import { HiLocationMarker } from 'react-icons/hi';

interface PastJobCardProps {
  postId: string;
  title: string;
  address: string;
  hiredDate: string | Date;
  className?: string;
}

export default function PastJobCard({ postId, title, address, hiredDate, className = '' }: PastJobCardProps) {
  const dateString =
    hiredDate instanceof Date ? hiredDate.toLocaleDateString() : new Date(hiredDate).toLocaleDateString();

  return (
    <article
      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-10 p-4 rounded-lg shadow-md ring-1 ring-neutral-200 bg-white 
        transition-transform duration-200 ease-in-out hover:scale-[1.01] hover:shadow-lg ${className}`}
      role="group"
      aria-label={`Past job: ${title}`}>
        
      {/* Title */}
      <div className="flex-1 min-w-0">
        <p className="font-inter font-semibold truncate small">{title}</p>
      </div>

      {/* Location */}
      <div className="flex items-center gap-2 flex-1">
        <HiLocationMarker className="w-5 h-5 shrink-0" aria-hidden="true" />
        <p className="font-alexandria text-gray-neutral600 truncate tiny">{address}</p>
      </div>

      {/* Hired Date */}
      <div className="flex items-center text-mini text-gray-neutral500 whitespace-nowrap">
        <span className="font-inter font-medium mr-1">Hired Date:</span>
        <time dateTime={new Date(hiredDate).toISOString()}>{dateString}</time>
      </div>
    </article>
  );
}