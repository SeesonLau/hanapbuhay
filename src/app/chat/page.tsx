'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/lib/services/auth-services';
import { ROUTES } from '@/lib/constants';

export default function ChatPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await AuthService.getCurrentUser();
      
      if (!currentUser) {
        router.push(ROUTES.LOGIN);
        return;
      }

      setLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleBackToDashboard = () => {
    router.push(ROUTES.DASHBOARD);
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
            <h1 className="text-xl font-semibold">Chat</h1>
            <button
              onClick={handleBackToDashboard}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white overflow-hidden shadow rounded-lg h-96">
            <div className="px-4 py-5 sm:p-6 h-full flex flex-col">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Chat Interface</h2>
              
              <div className="flex-1 bg-gray-100 rounded-lg p-4 mb-4 overflow-y-auto">
                <div className="space-y-4">
                  <div className="flex justify-start">
                    <div className="bg-white rounded-lg p-3 max-w-xs shadow">
                      <p className="text-gray-800">Hello! How can I help you today?</p>
                      <span className="text-xs text-gray-500 block mt-1">10:30 AM</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <div className="bg-blue-100 rounded-lg p-3 max-w-xs shadow">
                      <p className="text-gray-800">I have a question about my account.</p>
                      <span className="text-xs text-gray-500 block mt-1">10:32 AM</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex">
                <input 
                  type="text" 
                  placeholder="Type your message..." 
                  className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
