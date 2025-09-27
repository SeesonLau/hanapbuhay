'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { PostService } from '@/lib/services/posts-services';
import { Post } from '@/lib/models/posts';
import { PostMessages } from '@/resources/messages/posts';

interface PostListProps {
  initialPosts?: Post[];
  onPostClick?: (post: Post) => void;
  showFilters?: boolean;
  userId?: string;
}

export const PostList: React.FC<PostListProps> = ({
  initialPosts,
  onPostClick,
  showFilters = true,
  userId
}) => {
  const [posts, setPosts] = useState<Post[]>(initialPosts || []);
  const [loading, setLoading] = useState(!initialPosts);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState<{
    sortBy: 'createdAt' | 'price' | 'title';
    sortOrder: 'asc' | 'desc';
    jobType: string;
    location: string;
  }>({
    sortBy: 'createdAt',
    sortOrder: 'desc',
    jobType: '',
    location: ''
  });

  const loadPosts = useCallback(async (newPage: number = 1, resetPosts: boolean = false) => {
    // When filters change, we always want to reset and go to page 1.
    // The `newPage` and `resetPosts` are primarily for the "Load More" button.
    const pageToLoad = resetPosts ? 1 : newPage;

    try {
      setLoading(true);
      const params = {
        ...filters,
        page: pageToLoad,
        userId
      };

      const result = userId
        ? await PostService.getPostsByUserId(userId, params)
        : await PostService.getAllPosts(params);

      if (resetPosts || pageToLoad === 1) {
        setPosts(result.posts);
      } else {
        setPosts(prev => [...prev, ...result.posts]);
      }
      
      setHasMore(result.hasMore);
      setPage(pageToLoad);
    } catch (error) {
      // The service layer already shows a toast on error.
      // We just need to log it for debugging.
      console.log('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, userId]);

  const loadMore = () => {
    if (!loading && hasMore) {
      loadPosts(page + 1);
    }
  };

  useEffect(() => {
    if (!initialPosts) {
      loadPosts(1, true);
    }
  }, [initialPosts, loadPosts]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [sortBy, sortOrder] = e.target.value.split('-');
    setFilters(prev => ({
      ...prev,
      sortBy: sortBy as 'createdAt' | 'price' | 'title',
      sortOrder: sortOrder as 'asc' | 'desc'
    }));
  };

  if (loading && !posts.length) {
    return <div className="text-center py-8">Loading posts...</div>;
  }

  if (!loading && !posts.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        {userId ? 'No user posts found' : 'No posts found'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showFilters && (
        <div className="flex justify-between items-center mb-4">
          <select
            className="border rounded-md p-2 bg-white"
            onChange={handleSortChange}
            value={`${filters.sortBy}-${filters.sortOrder}`}
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="title-asc">Title: A to Z</option>
            <option value="title-desc">Title: Z to A</option>
          </select>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => (
          <div
            key={post.postId}
            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onPostClick?.(post)}
          >
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
                {post.description.length > 100 
                  ? `${post.description.substring(0, 100)}...`
                  : post.description
                }
              </p>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-lg">₱{post.price.toLocaleString()}</span>
                <span className="text-sm text-gray-500">{post.location}</span>
              </div>
              {post.subType && post.subType.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {post.subType.map((type, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {hasMore && !loading && (
        <div className="text-center py-4">
          <button
            onClick={loadMore}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
          >
            Load More
          </button>
        </div>
      )}

      {loading && posts.length > 0 && (
        <div className="text-center py-4">
          <span className="text-gray-500">Loading more posts...</span>
        </div>
      )}
    </div>
  );
};