// src/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/lib/services/auth-services';
import { UserService } from '@/lib/services/user-services';
import { User } from '@/lib/models';
import { ROUTES } from '@/lib/constants';
import SettingsModal from '@/components/modals/SettingsModal';
import HeaderDashboard from '@/components/ui/HeaderDashboard';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); 
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await AuthService.getCurrentUser();
      
      if (!currentUser) {
        router.push(ROUTES.LOGIN);
        return;
      }

      const userData = await UserService.getUserById(currentUser.id);
      setUser(userData);
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleSignOut = async () => {
    await AuthService.signOut();
    router.push(ROUTES.HOME);
  };

  const handleChatClick = () => {
    router.push(ROUTES.CHAT); 
  };

  const handleTestingClick = () => {
    router.push('/testing'); 
  };

  const openSettings = () => {
    setIsSettingsOpen(true);
  };

  const closeSettings = () => {
    setIsSettingsOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#141515' }}>
        <div className="text-lg text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#141515' }}>
      {/* Header Section */}
      <header className="w-full flex justify-center pt-8 px-4">
        <HeaderDashboard />
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 mt-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900">Welcome to your dashboard!</h2>
              {user && (
                <div className="mt-4 space-y-2">
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Role:</strong> {user.role}</p>
                  <p><strong>User ID:</strong> {user.userId}</p>
                  <p><strong>Created:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <SettingsModal isOpen={isSettingsOpen} onClose={closeSettings} user={user} />
    </div>
  );
}
