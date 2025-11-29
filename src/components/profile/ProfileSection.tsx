'use client';

import ProfileForm from "./ProfileForm";

interface ProfileSectionProps {
  userId: string;
  className?: string;
}

export default function ProfileSection({ userId, className }: ProfileSectionProps) {
  return (
    <div
      className={`
        ${className} flex flex-col gap-3 px-8
        items-center text-center   
        md:items-start md:text-left 
      `}
    >
      <h3 className="text-description font-inter font-bold text-gray-neutral700">
        Personal Details
      </h3>
      <ProfileForm userId={userId} className="w-full md:w-auto" />
    </div>
  );
}