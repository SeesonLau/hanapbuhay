'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { ApplicationService } from '@/lib/services/applications-services';
import { ApplicationStatus, ApplicationStatusLabels, ApplicationStatusColors } from '@/lib/constants/application-status';
import { supabase } from '@/lib/services/supabase/client';

interface Application {
  applicationId: string;
  postId: string;
  status: ApplicationStatus;
  posts: {
    title: string;
    description: string;
    price: number;
    location: string;
  };
}

export const ApplicationsComponent: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
     const fetchUser = async () => {
       const { data: { session } } = await supabase.auth.getSession();
       setUserId(session?.user?.id ?? null);
     };
 
     fetchUser();
  }, []);

  useEffect(() => {
    if (userId) {
      loadApplications(userId);
    }
  }, [userId]);

  const loadApplications = async (currentUserId: string) => {
    try {
      setLoading(true);
      console.log('Loading applications for user:', currentUserId);
      
      const applicationsResult = await ApplicationService.getApplicationsByUserId(currentUserId);
      console.log('Applications result:', applicationsResult);
      
      const count = await ApplicationService.getTotalApplicationsByUserIdCount(currentUserId);
      console.log('Total count:', count);
      
      setApplications(
        applicationsResult.applications.map((app: any) => {
          console.log('Processing application:', app);
          return {
            applicationId: app.applicationId,
            postId: app.postId,
            status: app.status,
            posts: {
              title: app.posts?.title ?? '',
              description: app.posts?.description ?? '',
              price: app.posts?.price ?? 0,
              location: app.posts?.location ?? '',
            },
          };
        })
      );
      setTotalCount(count);
    } catch (error) {
      console.error('Error loading applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId: string, newStatus: ApplicationStatus) => {
    if (!userId) return;
 
    try {
      await ApplicationService.updateApplicationStatus(applicationId, newStatus, userId);
      // Optimistic update for better UX
      setApplications(prev =>
        prev.map(app =>
          app.applicationId === applicationId ? { ...app, status: newStatus } : app
        )
      );
      toast.success('Application status updated!');
    } catch (error) {
      console.error('Error updating application status:', error);
      toast.error('Failed to update status.');
    }
  };

  if (!userId) {
    return <div className="text-center py-8">Please log in to view your applications.</div>;
  }

  if (loading) {
    return <div className="text-center py-8">Loading your applications...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Applications</h2>
        <div className="text-sm text-gray-600">
          Total Applications: {totalCount}
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          You haven't applied to any jobs yet.
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <div
              key={application.applicationId}
              className="border rounded-lg p-4 space-y-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{application.posts.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {application.posts.description}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm text-gray-500">
                      ₱{application.posts.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500">
                      {application.posts.location}
                    </span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${ApplicationStatusColors[application.status]}`}>
                  {ApplicationStatusLabels[application.status]}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {Object.values(ApplicationStatus).map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusUpdate(application.applicationId, status)}
                    disabled={application.status === status}
                    className={`px-3 py-1 rounded-md text-sm ${
                      application.status === status
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                    }`}
                  >
                    {ApplicationStatusLabels[status]}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};