'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { Post } from '@/lib/models/posts';
import { PostService } from '@/lib/services/posts-services';
import { ApplicationService } from '@/lib/services/applications-services';
import { PostMessages } from '@/resources/messages/posts';
import { ApplicationMessages } from '@/resources/messages/applications';
import { supabase } from '@/lib/services/supabase/client';

export const ApplyComponent: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id || null);
    };

    getSession();
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const result = await PostService.getAllPosts();
      setPosts(result.posts);
    } catch (error) {
      toast.error(PostMessages.FETCH_POSTS_ERROR);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (postId: string) => {
    if (!userId) {
      toast.error('Please log in to apply for jobs');
      return;
    }

    try {
      await ApplicationService.createApplication(postId, userId);
      // Optionally refresh the posts list or mark this post as applied
    } catch (error) {
      // Error is already handled in the service
      console.error('Error applying to job:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading job posts...</div>;
  }

  if (!posts.length) {
    return <div className="text-center py-8">No job posts available.</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Available Jobs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => (
          <div key={post.postId} className="border rounded-lg overflow-hidden shadow-sm">
            {post.imageUrl && (
              <div className="relative h-48">
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                {post.description}
              </p>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-lg">₱{post.price.toLocaleString()}</span>
                <span className="text-sm text-gray-500">{post.location}</span>
              </div>
              <button
                onClick={() => handleApply(post.postId)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Apply Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};