'use client';

import ProfileForm from "./ProfileForm";
import { useTheme } from '@/hooks/useTheme';

interface ProfileSectionProps {
  userId: string;
  className?: string;
}

export default function ProfileSection({ userId, className }: ProfileSectionProps) {
  const { theme } = useTheme();
  
  return (
    <div
      className={`
        ${className} flex flex-col gap-3 px-5
        items-center text-center   
        md:items-start md:text-left 
      `}
    >
      <h3 
        className="text-description font-inter font-bold"
        style={{ color: theme.colors.text }}
      >
        Personal Details
      </h3>
      <ProfileForm userId={userId} className="w-full" />
    </div>
  );
}
