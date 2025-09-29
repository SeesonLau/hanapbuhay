'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import { ApplyComponent } from '@/components/mock/applications/ApplyComponent';
import { ApplicationsComponent } from '@/components/mock/applications/ApplicationsComponent';
import { supabase } from '@/lib/services/supabase/client';

export default function ApplicationsPage() {
  const router = useRouter();

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth/login');
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster />
      <div className="space-y-12">
        <ApplicationsComponent />
        <div className="border-t pt-8">
          <ApplyComponent />
        </div>
      </div>
    </div>
  );
}