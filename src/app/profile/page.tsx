'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/lib/services/auth-services';
import { UserService } from '@/lib/services/user-services';
import { User } from '@/lib/models';
import { ROUTES } from '@/lib/constants';
import ProfileForm from '@/components/profile/profile-form';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await AuthService.getCurrentUser();

      if (!currentUser) {
        router.push(ROUTES.LOGIN);
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
      {/* Top Nav */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-semibold">Profile</h1>
            <button
              onClick={() => router.push(ROUTES.DASHBOARD)}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </nav>

      {/* User ID Display */}
      {user && (
        <div className="text-center mt-6">
          <p className="text-lg font-semibold text-black">
            User ID: <span className="font-mono">{user.userId}</span>
          </p>
        </div>
      )}

      {/* Main Section */}
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="max-w-5xl w-full flex gap-6">
          {/* Profile Form (Left Side) */}
          {user && <ProfileForm userId={user.userId} />}

          {/* Project Section (Right Side placeholder for now) */}
          <div className="w-1/2 bg-white shadow rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Projects</h2>
            <p className="text-gray-500">Project section coming soon...</p>
          </div>
        </div>
      </main>
    </div>
  );
}