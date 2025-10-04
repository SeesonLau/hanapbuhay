// src/app/profile/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/lib/services/auth-services';
import { UserService } from '@/lib/services/user-services';
import { User } from '@/lib/models';
import { ROUTES } from '@/lib/constants';
import ProfileSection from '@/components/profile/ProfileSection';
import ProjectsSection from '@/components/profile/ProjectSection';
import Banner from '@/components/ui/Banner';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await AuthService.getCurrentUser();

      if (!currentUser) {
        router.push(ROUTES.HOME);
        return;
      }

      const userData = await UserService.getUserById(currentUser.id);
      setUser(userData);
      setLoading(false);
    };

    fetchUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading Profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Banner Section with Header */}
      <Banner
        variant="profile"
        showSearchBar={false}
      />
      <main className="flex-grow flex p-3">
        <div className="w-full flex flex-col md:flex-row gap-10 md:gap-0">
          {user && <ProfileSection userId={user.userId} className="flex-1" />}
          <div className="hidden md:block w-px bg-gray-neutral300 md:-my-3"></div>
          {user && <ProjectsSection userId={user.userId} className="flex-1" />}
        </div>
      </main>
    </div>
  );
}
