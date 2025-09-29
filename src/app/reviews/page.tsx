'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import { ReviewComponent } from '@/components/mock/reviews/ReviewComponent';
import { ReviewsComponent } from '@/components/mock/reviews/ReviewsComponent';
import { supabase } from '@/lib/services/supabase/client';

export default function ReviewsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth/login');
      } else {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster />
      <div className="space-y-12">
        <h1 className="text-3xl font-bold mb-8">Reviews</h1>
        <ReviewsComponent />
        <div className="border-t pt-8">
          <h2 className="text-2xl font-semibold mb-4">Write a Review</h2>
          <ReviewComponent />
        </div>
      </div>
    </div>
  );
}