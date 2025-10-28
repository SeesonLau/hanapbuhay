import { supabase } from './supabase/client';
import { Post } from '../models/posts';

interface RequestParams {
  page: number;
  pageSize: number;
  searchTerm?: string;
  location?: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  jobType?: string;
  subType?: string[];
  priceRange?: { min: number; max: number };
  // ... other filter params
}

export class PostService {
  /**
   * Fetches all job posts with pagination, search, and filtering.
   */
  static async getAllPosts(params: RequestParams): Promise<{ posts: Post[], hasMore: boolean }> {
    const { page, pageSize, searchTerm, location, sortBy, sortOrder, jobType, subType, priceRange } = params;
    const offset = (page - 1) * pageSize;

    let query = supabase
      .from('posts')
      .select('*', { count: 'exact' })
      .is('deletedAt', null) // Exclude soft-deleted posts
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(offset, offset + pageSize - 1);

    // Apply search term filter (for title, description, etc.)
    // Assumes you have a full-text search index on 'fts' column
    if (searchTerm) {
      query = query.textSearch('fts', searchTerm.replace(/\*/g, ''), {
        type: 'websearch',
        config: 'english',
      });
    }

    // Apply location filter
    if (location) {
      // Use 'ilike' for a case-insensitive "contains" search
      query = query.ilike('location', `%${location}%`);
    }

    // Apply job type and subtype filters
    if (jobType) {
      query = query.eq('type', jobType);
    }
    if (subType && subType.length > 0) {
      query = query.in('subType', subType);
    }

    // Apply price range filter
    if (priceRange) {
      query = query
        .gte('price', priceRange.min)
        .lte('price', priceRange.max);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching posts:', error);
      throw new Error('Could not fetch posts.');
    }

    const hasMore = count ? count > offset + data.length : false;

    return { posts: data as Post[], hasMore };
  }

  /**
   * Fetches all job posts for a specific user.
   */
  static async getPostsByUserId(userId: string, params: RequestParams): Promise<{ posts: Post[], hasMore: boolean }> {
    const { page, pageSize, searchTerm, location, sortBy, sortOrder } = params;
    const offset = (page - 1) * pageSize;

    let query = supabase
      .from('posts')
      .select('*', { count: 'exact' })
      .eq('userId', userId)
      .is('deletedAt', null)
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(offset, offset + pageSize - 1);

    if (searchTerm) {
      query = query.textSearch('fts', searchTerm.replace(/\*/g, ''), { type: 'websearch', config: 'english' });
    }
    if (location) {
      query = query.ilike('location', `%${location}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching posts by user:', error);
      throw new Error('Could not fetch user posts.');
    }

    const hasMore = count ? count > offset + data.length : false;
    return { posts: data as Post[], hasMore };
  }

  /**
   * Creates a new job post.
   */
  static async createPost(postData: Omit<Post, 'postId' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'deletedBy'>): Promise<Post> {
    const { data, error } = await supabase.from('posts').insert(postData).select().single();
    if (error) {
      console.error('Error creating post:', error);
      throw new Error('Could not create post.');
    }
    return data as Post;
  }

  /**
   * Updates an existing job post.
   */
  static async updatePost(postId: string, postData: Partial<Post>): Promise<Post> {
    const { data, error } = await supabase.from('posts').update(postData).eq('postId', postId).select().single();
    if (error) {
      console.error('Error updating post:', error);
      throw new Error('Could not update post.');
    }
    return data as Post;
  }

  /**
   * Soft-deletes a job post.
   */
  static async deletePost(postId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('posts')
      .update({ deletedAt: new Date().toISOString(), deletedBy: userId })
      .match({ postId: postId, userId: userId });

    if (error) {
      console.error('Error deleting post:', error);
      throw new Error('Could not delete post.');
    }
  }

  /**
   * Gets the total count of all active posts.
   */
  static async getTotalActivePostsCount(): Promise<number> {
    const { count, error } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .is('deletedAt', null);

    if (error) {
      console.error('Error getting total posts count:', error);
      return 0;
    }
    return count ?? 0;
  }

  /**
   * Gets the total count of posts for a specific user.
   */
  static async getPostCountByUserId(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('userId', userId)
      .is('deletedAt', null);

    if (error) {
      console.error('Error getting user posts count:', error);
      return 0;
    }
    return count ?? 0;
  }
}