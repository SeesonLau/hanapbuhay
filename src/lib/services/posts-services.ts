import { toast } from 'react-hot-toast';
import { supabase } from './supabase/client';
import { PostMessages } from '@/resources/messages/posts';
import { Post } from '../models/posts';

interface PostQueryParams {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  jobType?: string;
  subType?: string[];
  location?: string;
  priceRange?: { min: number; max: number };
  sortBy?: 'createdAt' | 'price' | 'title';
  sortOrder?: 'asc' | 'desc';
  userId?: string;
}

interface PaginatedPosts {
  posts: Post[];
  count: number;
  hasMore: boolean;
}

export class PostService {
  private static readonly STORAGE_BUCKET = 'post-images';
  private static readonly DEFAULT_PAGE_SIZE = 10;

  // Fetch all posts with pagination and filtering
  static async getAllPosts(params: PostQueryParams = {}): Promise<PaginatedPosts> {
    try {
      const {
        page = 1,
        pageSize = this.DEFAULT_PAGE_SIZE,
        searchTerm,
        jobType,
        subType,
        location,
        priceRange,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = params;

      let query = supabase
        .from('posts')
        .select(`*`, { count: 'exact' })
        .is('deletedAt', null);

      // Apply filters
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }
      if (jobType) {
        query = query.eq('type', jobType);
      }
      if (subType?.length) {
        query = query.contains('subType', subType);
      }
      if (location) {
        query = query.eq('location', location);
      }
      if (priceRange) {
        query = query
          .gte('price', priceRange.min)
          .lte('price', priceRange.max);
      }

      // Apply pagination and sorting
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data: posts, count, error } = await query
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range(from, to);

      if (error) throw error;

      return {
        posts: posts || [],
        count: count || 0,
        hasMore: count ? from + (posts?.length || 0) < count : false
      };
    } catch (error) {
      toast.error(PostMessages.FETCH_POSTS_ERROR);
      throw error;
    }
  }

  // Fetch single post by ID
  static async getPostById(id: string): Promise<Post | null> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`*`)
        .eq('postId', id)
        .is('deletedAt', null)
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      toast.error(PostMessages.FETCH_POST_ERROR);
      return null;
    }
  }

  // Fetch posts by user ID with pagination
  static async getPostsByUserId(userId: string, params: PostQueryParams = {}): Promise<PaginatedPosts> {
    try {
      const { page = 1, pageSize = this.DEFAULT_PAGE_SIZE } = params;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const {
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = params;

      const { data: posts, count, error } = await supabase
        .from('posts')
        .select(`*`, { count: 'exact' })
        .eq('userId', userId)
        .is('deletedAt', null)
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range(from, to);

      if (error) throw error;

      return {
        posts: posts || [],
        count: count || 0,
        hasMore: count ? from + (posts?.length || 0) < count : false
      };
    } catch (error) {
      toast.error(PostMessages.FETCH_POSTS_ERROR);
      throw error;
    }
  }

  // Create new post
  static async createPost(postData: Omit<Post, 'postId' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'deletedBy'>): Promise<Post> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert(postData)
        .select()
        .single();

      if (error) throw error;

      toast.success(PostMessages.CREATE_POST_SUCCESS);
      return data;
    } catch (error) {
      toast.error(PostMessages.CREATE_POST_ERROR);
      throw error;
    }
  }

  // Update existing post
  static async updatePost(postId: string, postData: Partial<Post>): Promise<Post> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .update({
          ...postData,
          updatedAt: new Date().toISOString()
        })
        .eq('postId', postId)
        .select()
        .single();

      if (error) throw error;

      toast.success(PostMessages.UPDATE_POST_SUCCESS);
      return data;
    } catch (error) {
      toast.error(PostMessages.UPDATE_POST_ERROR);
      throw error;
    }
  }

  // Soft delete post
  static async deletePost(postId: string, deletedBy: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('posts')
        .update({
          deletedAt: new Date().toISOString(),
          deletedBy: deletedBy
        })
        .eq('postId', postId);

      if (error) throw error;

      toast.success(PostMessages.DELETE_POST_SUCCESS);
      return true;
    } catch (error) {
      toast.error(PostMessages.DELETE_POST_ERROR);
      return false;
    }
  }

  // Upload image
  static async uploadImage(file: File): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(this.STORAGE_BUCKET)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from(this.STORAGE_BUCKET)
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      toast.error(PostMessages.UPLOAD_IMAGE_ERROR);
      return null;
    }
  }

  // Get total posts count
  static async getTotalPostsCount(): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('posts')
        .select('*', { count: 'exact' })
        .is('deletedAt', null);

      if (error) throw error;

      return count || 0;
    } catch (error) {
      toast.error(PostMessages.FETCH_POSTS_ERROR);
      throw error;
    }
  }

  // Get total posts count by user ID
  static async getTotalPostsByUserIdCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('posts')
        .select('*', { count: 'exact' })
        .eq('userId', userId)
        .is('deletedAt', null);

      if (error) throw error;

      return count || 0;
    } catch (error) {
      toast.error(PostMessages.FETCH_POSTS_ERROR);
      throw error;
    }
  }

  // Helper method to validate image file
  static validateImageFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      toast.error(PostMessages.IMAGE_TYPE_ERROR);
      return false;
    }

    if (file.size > maxSize) {
      toast.error(PostMessages.IMAGE_SIZE_ERROR);
      return false;
    }

    return true;
  }
}