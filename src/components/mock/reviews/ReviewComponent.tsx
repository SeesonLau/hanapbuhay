'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { PostService } from '@/lib/services/posts-services';
import { ApplicationService } from '@/lib/services/applications-services';
import { ReviewService } from '@/lib/services/reviews-services';
import { Post } from '@/lib/models/posts';
import { supabase } from '@/lib/services/supabase/client';

import { Application } from '@/lib/models/application';

interface ApplicationWithRelations extends Application {
  users: {
    email: string;
  };
}

interface ReviewFormData {
  rating: number;
  comment: string;
  applicationId: string;
  workerId: string;
}

export const ReviewComponent: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [applications, setApplications] = useState<Record<string, ApplicationWithRelations[]>>({});
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [reviewForm, setReviewForm] = useState<ReviewFormData | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id || null);
      if (session?.user?.id) {
        await loadPosts(session.user.id);
      }
    };

    getSession();
  }, []);

  const loadPosts = async (userId: string) => {
    try {
      setLoading(true);
      const result = await PostService.getPostsByUserId(userId);
      setPosts(result.posts);
    } catch (error) {
      console.error('Error loading posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleViewApplicants = async (postId: string) => {
    try {
      setLoading(true);
      const result = await ApplicationService.getApplicationsByPostId(postId);
      // Type assertion since we know the service returns applications with user data
      setApplications(prev => ({
        ...prev,
        [postId]: result.applications as ApplicationWithRelations[]
      }));
      setSelectedPostId(postId);
    } catch (error) {
      console.error('Error loading applications:', error);
      toast.error('Failed to load applicants');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewClick = (application: Application) => {
    setReviewForm({
      rating: 5,
      comment: '',
      applicationId: application.applicationId,
      workerId: application.userId
    });
  };

  const handleSubmitReview = async () => {
    if (!reviewForm || !userId || !selectedPostId) return;

    try {
      await ReviewService.createReview(
        reviewForm.workerId,
        selectedPostId,
        reviewForm.rating,
        userId,
        reviewForm.comment || undefined
      );
      setReviewForm(null);
    } catch (error: any) {
      if (error?.code !== '23505') { // Ignore duplicate review errors as they're already toasted
        console.error('Error submitting review:', error);
      }
    }
  };

  if (!userId) {
    return <div className="text-center py-8">Please log in to review workers.</div>;
  }

  if (loading && !posts.length) {
    return <div className="text-center py-8">Loading your posts...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Your Job Posts</h2>

      {posts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          You haven't created any job posts yet.
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <div key={post.postId} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{post.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{post.description}</p>
                </div>
                <button
                  onClick={() => handleViewApplicants(post.postId)}
                  className="bg-blue-50 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-100"
                >
                  View Applicants
                </button>
              </div>

              {selectedPostId === post.postId && applications[post.postId] && (
                <div className="mt-4 space-y-4">
                  <h4 className="font-medium">Applicants:</h4>
                  {applications[post.postId].map(application => (
                    <div
                      key={application.applicationId}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
                    >
                      <span>{application.users.email}</span>
                      <button
                        onClick={() => handleReviewClick(application)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Review Worker
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {reviewForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Submit Review</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Rating</label>
                <select
                  value={reviewForm.rating}
                  onChange={e => setReviewForm(prev => prev ? {
                    ...prev,
                    rating: Number(e.target.value)
                  } : null)}
                  className="w-full border rounded-md p-2"
                >
                  {[5, 4, 3, 2, 1].map(rating => (
                    <option key={rating} value={rating}>
                      {rating} Star{rating !== 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Comment (Optional)</label>
                <textarea
                  value={reviewForm.comment}
                  onChange={e => setReviewForm(prev => prev ? {
                    ...prev,
                    comment: e.target.value
                  } : null)}
                  className="w-full border rounded-md p-2"
                  rows={4}
                  placeholder="Share your experience working with this person..."
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setReviewForm(null)}
                  className="px-4 py-2 border rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitReview}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};