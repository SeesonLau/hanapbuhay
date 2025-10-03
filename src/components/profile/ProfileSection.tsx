'use client';

import ProfileForm from "./ProfileForm";

interface ProfileSectionProps {
  userId: string;
  className?: string;
}

export default function ProfileSection({ userId, className }: ProfileSectionProps) {
  return (
    <div className={`${className} flex flex-col gap-4 `}>
      <h3 className="font-inter font-bold text-gray-neutral700">
          Personal Details
      </h3>
      <ProfileForm userId={userId} className="w-full" />
    </div>
  );
}
