'use client';

import ProfileForm from "./ProfileForm";

interface ProfileSectionProps {
  userId: string;
  className?: string;
}

export default function ProfileSection({ userId, className }: ProfileSectionProps) {
  return (
    <section className={`${className} p-6 bg-white rounded-lg shadow-md`}>
      <ProfileForm userId={userId} className="w-full" />
    </section>
  );
}
