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
import { useTheme } from '@/hooks/useTheme';

type ViewMode = 'profile' | 'work-experience';

export default function ProfilePage() {
  const { theme } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [contentReady, setContentReady] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('profile');
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      // If someone navigated here directly with ?userId=..., treat manual/typed navigations as default and remove param
      if (typeof window !== 'undefined') {
        try {
          const url = new URL(window.location.href);
          const userIdParam = url.searchParams.get('userId');
          const ref = document.referrer || '';
          const isInternalRef = ref.startsWith(window.location.origin);
          if (userIdParam && !isInternalRef) {
            url.searchParams.delete('userId');
            window.history.replaceState({}, '', url.toString());
          }
        } catch (e) {
          // ignore
        }
      }
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
        // Reflect current user's id in the URL as a query param without adding history
        if (typeof window !== 'undefined' && userData?.userId) {
          try {
            const url = new URL(window.location.href);
            const existing = url.searchParams.get('userId');
            if (existing !== userData.userId) {
              url.searchParams.set('userId', String(userData.userId));
              window.history.replaceState({}, '', url.toString());
            }
          } catch (e) {
            // ignore URL errors
          }
        }
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
    <div 
      className="min-h-screen flex flex-col overflow-x-hidden"
      style={{ backgroundColor: theme.colors.background }}
    >
      <div 
        className="fixed inset-0 -z-10"
        style={{ backgroundColor: theme.colors.background }}
      />
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
                      className="absolute top-0 right-0 z-10 flex items-center justify-center w-10 h-10 text-white rounded-full transition-colors duration-200 shadow-md"
                      style={{
                        backgroundColor: theme.colors.primary,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = theme.colors.primaryHover;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = theme.colors.primary;
                      }}
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
                      className="absolute top-0 left-0 z-10 flex items-center justify-center w-10 h-10 text-white rounded-full transition-colors duration-200 shadow-md"
                      style={{
                        backgroundColor: theme.colors.primary,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = theme.colors.primaryHover;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = theme.colors.primary;
                      }}
                      aria-label="Back to Profile"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    
                    <ProjectsSection userId={user.userId} className="w-full" />
                  </div>
                )}
              </div>

              {/* Desktop View (above 768px) */}
              <div className="hidden lg:flex w-full">
                {user && <ProfileSection userId={user.userId} className="flex-1" />}
                <div 
                  className="w-px -my-3 flex-shrink-0"
                  style={{ backgroundColor: theme.colors.border }}
                ></div>
                {user && <ProjectsSection userId={user.userId} className="flex-1" />}
              </div>
            </div>
          </main>
        </>
      )}
    </div>
  );
}