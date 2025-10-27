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
import { Preloader, PreloaderMessages } from '@/components/ui/Preloader';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [contentReady, setContentReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);

      try {
        const currentUser = await AuthService.getCurrentUser();

        if (!currentUser) {
          setLoading(false);
          router.push(ROUTES.HOME);
          return;
        }

        const userData = await UserService.getUserById(currentUser.id);
        setUser(userData);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  useEffect(() => {
    if (!loading && user) {
      // Small delay to ensure components have mounted
      const timer = setTimeout(() => {
        setContentReady(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [loading, user]);

  return (
    <div className="min-h-screen flex flex-col">
      <Preloader 
        message={PreloaderMessages.LOADING_PROFILE} 
        isVisible={!contentReady} 
      />

      {contentReady && (
        <>
          {/* Banner Section with Header */}
          <Banner
            variant="profile"
            showSearchBar={false}
          />
          
          <main className="pl-4 pr-4 pb-8 pt-[240px]">
            <div className="w-full h-full flex flex-col md:flex-row gap-10 md:gap-0">
              {user && <ProfileSection userId={user.userId} className="flex-1" />}
              <div className="hidden md:block w-px bg-gray-neutral300 md:-my-3"></div>
              {user && <ProjectsSection userId={user.userId} className="flex-1" />}
            </div>
          </main>
        </>
      )}
    </div>
  );
}