'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/lib/services/auth-services';
import { UserService } from '@/lib/services/user-services';
import { User } from '@/lib/models/user';
import { ROUTES } from '@/lib/constants';
import ProfileSection from '@/components/profile/ProfileSection';
import ProjectsSection from '@/components/profile/ProjectSection';
import Banner from '@/components/ui/Banner';
import { Preloader, PreloaderMessages } from '@/components/ui/Preloader';
import { ArrowLeft, Briefcase } from 'lucide-react';

type ViewMode = 'profile' | 'work-experience';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [contentReady, setContentReady] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('profile');
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
      const timer = setTimeout(() => setContentReady(true), 300);
      return () => clearTimeout(timer);
    }
  }, [loading, user]);

  const handleViewProjects = () => {
    setViewMode('work-experience');
  };

  const handleBackToProfile = () => {
    setViewMode('profile');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-default overflow-x-hidden">
      <div className="fixed inset-0 -z-10 bg-gray-default" />
      <Preloader
        message={PreloaderMessages.LOADING_PROFILE}
        isVisible={!contentReady}
      />

      {contentReady && (
        <>
          {/* Fixed Banner */}
          <Banner variant="profile" showSearchBar={false} />

          <main className="flex-grow flex p-3 pt-[220px]">
            <div className="w-full h-full flex flex-col md:flex-row gap-10 md:gap-0">
              {/* Mobile/Tablet View (768px and below) */}
              <div className="lg:hidden w-full">
                {viewMode === 'profile' && user && (
                  <div className="relative">
                    {/* View Work Experience Button */}
                    <button
                      onClick={handleViewProjects}
                      className="absolute top-0 right-0 z-10 flex items-center justify-center w-10 h-10 bg-blue-400 hover:bg-blue-500 text-white rounded-full transition-colors duration-200 shadow-md"
                      aria-label="View Work Experience"
                    >
                      <Briefcase className="w-5 h-5" />
                    </button>
                    
                    <ProfileSection userId={user.userId} className="w-full" />
                  </div>
                )}

                {viewMode === 'work-experience' && user && (
                  <div className="relative">
                    {/* Back to Profile Button */}
                    <button
                      onClick={handleBackToProfile}
                      className="absolute top-0 left-0 z-10 flex items-center justify-center w-10 h-10 bg-blue-400 hover:bg-blue-500 text-white rounded-full transition-colors duration-200 shadow-md"
                      aria-label="Back to Profile"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    
                    <ProjectsSection userId={user.userId} className="w-full" />
                  </div>
                )}
              </div>

              {/* Desktop View (above 768px) */}
              <div className="hidden lg:flex w-full gap-0">
                {user && <ProfileSection userId={user.userId} className="flex-1" />}
                <div className="w-px bg-gray-neutral300 -my-3"></div>
                {user && <ProjectsSection userId={user.userId} className="flex-1" />}
              </div>
            </div>
          </main>
        </>
      )}
    </div>
  );
}