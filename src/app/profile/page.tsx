// src/app/profile/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/lib/services/auth-services';
import { UserService } from '@/lib/services/user-services';
import { User } from '@/lib/models';
import { ROUTES } from '@/lib/constants';
import ProfileForm from '@/components/profile/ProfileForm';
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Banner Section with Header */}
      <Banner
        variant="profile"
        showSearchBar={false}
      />

      {/* User ID Display 
      {user && (
        <div className="text-center mt-6">
          <p className="text-lg font-semibold text-black">
            User ID: <span className="font-mono">{user.userId}</span>
          </p>
        </div>
      )} */}

      <main className="flex-grow flex items-center justify-center p-6">
        <div className="max-w-5xl w-full flex gap-6">
          {user && <ProfileForm userId={user.userId} className="flex-1" />}
          {user && <ProjectsSection userId={user.userId} className="flex-1" />}
        </div>
      </main>
    </div>
  );
}
