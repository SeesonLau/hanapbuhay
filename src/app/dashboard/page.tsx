// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/lib/services/auth-services';
import { UserService } from '@/lib/services/user-services';
import { User } from '@/lib/models';
import { ROUTES } from '@/lib/constants';
import SettingsModal from '@/components/ui/SettingsModal'; 

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-semibold">Dashboard</h1>
            <div className="flex space-x-2">
              <button
                onClick={handleTestingClick}
                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
              >
                Component Testing
              </button>
              <button
                onClick={handleChatClick}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Chat
              </button>
              <button
                onClick={openSettings}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                Settings
              </button>
              <button
                onClick={() => router.push(ROUTES.PROFILE)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Profile
              </button>
              <button
                onClick={handleSignOut}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>


      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
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
