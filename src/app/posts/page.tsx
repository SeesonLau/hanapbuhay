'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PostForm } from '@/components/mock/posts/PostForm';
import { PostList } from '@/components/mock/posts/PostList';
import { supabase } from '@/lib/services/supabase/client';
import { Toaster } from 'react-hot-toast';
import { Post } from '@/lib/models/posts';

export default function PostsPage() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

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

  const handleCreatePost = () => {
    setSelectedPost(null);
    setShowForm(true);
  };

  const handleEditPost = (post: Post) => {
    setSelectedPost(post);
    setShowForm(true);
  };

  const handlePostSaved = () => {
    setShowForm(false);
    setSelectedPost(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedPost(null);
  };

  if (showForm) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Toaster />
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {selectedPost ? 'Edit Post' : 'Create New Post'}
          </h1>
          <button
            onClick={handleFormCancel}
            className="text-gray-600 hover:text-gray-800 px-3 py-1 rounded-md"
          >
            Cancel
          </button>
        </div>
        <PostForm
          post={selectedPost}
          onSubmit={handlePostSaved}
          onCancel={handleFormCancel}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Posts</h1>
        <button
          onClick={handleCreatePost}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Create Post
        </button>
      </div>
      <PostList onPostClick={handleEditPost} />
    </div>
  );
}