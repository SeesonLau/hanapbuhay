import { supabase } from './supabase/client';
import { Post } from '../models/posts';

interface RequestParams {
  page: number;
  pageSize: number;
  searchTerm?: string;
  location?: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  jobType?: string | string[];
  subType?: string[];
  priceRange?: { min: number; max: number };
  experienceLevel?: string | string[];
  preferredGender?: string | string[];
  matchMode?: 'mixed'; // For when both subType and type filtering is needed
  // ... other filter params
}

export class PostService {
  /**
   * Fetches all job posts with pagination, search, and filtering.
   */
  static async getAllPosts(params: RequestParams): Promise<{ posts: Post[], hasMore: boolean }> {
    const { page, pageSize, searchTerm, location, sortBy, sortOrder, jobType, subType, priceRange, matchMode } = params;
    const offset = (page - 1) * pageSize;

    // Log filter params for debugging
    console.log('getAllPosts filter params:', { jobType, subType, matchMode });

    let query = supabase
      .from('posts')
      .select('*', { count: 'exact' })
      .is('deletedAt', null); // Exclude soft-deleted posts

    // Apply search term filter (for title, description, etc.)
    // Search using ilike on title and description fields
    if (searchTerm) {
      const cleanSearchTerm = searchTerm.replace(/\*/g, '').trim();
      if (cleanSearchTerm) {
        query = query.or(`title.ilike.%${cleanSearchTerm}%,description.ilike.%${cleanSearchTerm}%`);
      }
    }

    // Apply location filter
    if (location) {
      // Use 'ilike' for a case-insensitive "contains" search
      query = query.ilike('location', `%${location}%`);
    }

    // Apply job type and subtype filters
    // Logic:
    // - If specific subtypes are selected (e.g., "Farmhand"), match subType field
    // - If "Other" is selected for a job type (e.g., "Agriculture"), match type field
    // - If both exist, use OR: (subType contains [...] OR type IN [...])
    if (subType && subType.length > 0) {
      if (jobType && matchMode === 'mixed') {
        const otherJobTypes = Array.isArray(jobType) ? jobType : [jobType];
        console.log('Adding mixed filter - otherJobTypes:', otherJobTypes);
        // Mixed mode: (subType contains any of the specific subtypes) OR (type is one of the "Other" job types)
        const subTypeFilter = `subType.cs.{${subType.join(',')}}`;
        const jobTypeFilter = `type.in.(${otherJobTypes.join(',')})`;
        query = query.or(`${subTypeFilter},${jobTypeFilter}`);
      } else {
        // Only specific subtypes are selected.
        // The 'subType' column is an array, so we use the 'cs' (contains) operator.
        // The format is `column.cs.{value1,value2}`
        console.log('Filtering by subType (contains):', subType);
        const subTypeFilter = `subType.cs.{${subType.join(',')}}`;
        query = query.or(subTypeFilter);
      }
    } else if (jobType) {
      console.log('Filtering by jobType:', jobType);
      // Only job type filtering (when "Other" is selected without specific subtypes)
      if (Array.isArray(jobType)) {
        // Multiple job types: use .in() operator
        console.log('Using .in() for multiple job types:', jobType);
        query = query.in('type', jobType);
      } else {
        // Single job type: use .eq() operator
        console.log('Using .eq() for single job type:', jobType);
        query = query.eq('type', jobType);
      }
    }

    // Apply experience level filter (stored in subType array)
    if (params.experienceLevel) {
      const expArr = Array.isArray(params.experienceLevel) ? params.experienceLevel : [params.experienceLevel];
      if (expArr.length > 0) {
        const expFilter = `subType.cs.{${expArr.join(',')}}`;
        console.log('Filtering by experienceLevel (subType contains):', expArr);
        query = query.or(expFilter);
      }
    }

    // Apply preferred gender filter (also stored in subType array as tags)
    if (params.preferredGender) {
      const gArr = Array.isArray(params.preferredGender) ? params.preferredGender : [params.preferredGender];
      if (gArr.length > 0) {
        const genderFilter = `subType.cs.{${gArr.join(',')}}`;
        console.log('Filtering by preferredGender (subType contains):', gArr);
        query = query.or(genderFilter);
      }
    }

    // Apply price range filter
    if (priceRange) {
      query = query
        .gte('price', priceRange.min)
        .lte('price', priceRange.max);
    }

    // Apply ordering and pagination at the end
    query = query
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(offset, offset + pageSize - 1);

    const { data, error, count } = await query;

    if (error) {
      throw new Error('Could not fetch posts.');
    }

    const hasMore = count ? count > offset + data.length : false;

    return { posts: data as Post[], hasMore };
  }

  /**
   * Fetches all job posts for a specific user.
   */
  static async getPostsByUserId(userId: string, params: RequestParams): Promise<{ posts: Post[], hasMore: boolean }> {
    const { page, pageSize, searchTerm, location, sortBy, sortOrder, jobType, subType, priceRange, matchMode } = params;
    const offset = (page - 1) * pageSize;

    let query = supabase
      .from('posts')
      .select('*', { count: 'exact' })
      .eq('userId', userId)
      .is('deletedAt', null);

    if (searchTerm) {
      const cleanSearchTerm = searchTerm.replace(/\*/g, '').trim();
      if (cleanSearchTerm) {
        query = query.or(`title.ilike.%${cleanSearchTerm}%,description.ilike.%${cleanSearchTerm}%`);
      }
    }
    if (location) {
      query = query.ilike('location', `%${location}%`);
    }

    // Apply job type and subtype filters with same logic as getAllPosts
    if (subType && subType.length > 0) {
      if (jobType && matchMode === 'mixed') {
        const otherJobTypes = Array.isArray(jobType) ? jobType : [jobType];
        // Mixed mode: (subType contains any of the specific subtypes) OR (type is one of the "Other" job types)
        const subTypeFilter = `subType.cs.{${subType.join(',')}}`;
        const jobTypeFilter = `type.in.(${otherJobTypes.join(',')})`;
        query = query.or(`${subTypeFilter},${jobTypeFilter}`);
      } else {
        // Only specific subtypes are selected.
        // The 'subType' column is an array, so we use the 'cs' (contains) operator.
        // The format is `column.cs.{value1,value2}`
        const subTypeFilter = `subType.cs.{${subType.join(',')}}`;
        query = query.or(subTypeFilter);
      }
    } else if (jobType) {
      // Only job type filtering (when "Other" is selected without specific subtypes)
      if (Array.isArray(jobType)) {
        // Multiple job types: use .in() operator
        query = query.in('type', jobType);
      } else {
        // Single job type: use .eq() operator
        query = query.eq('type', jobType);
      }
    }

    // Apply price range filter
    if (priceRange) {
      query = query
        .gte('price', priceRange.min)
        .lte('price', priceRange.max);
    }

    // Apply ordering and pagination at the end
    query = query
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(offset, offset + pageSize - 1);

    const { data, error, count } = await query;

    if (error) {
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
      return 0;
    }
    return count ?? 0;
  }

  /**
   * Get job title suggestions based on search query
   * Returns distinct job titles that match the query
   */
  static async getJobTitleSuggestions(searchQuery: string): Promise<string[]> {
    if (!searchQuery.trim()) return [];

    const cleanQuery = searchQuery.toLowerCase().trim();

    try {
      const { data, error } = await supabase
        .from('posts')
        .select('title')
        .is('deletedAt', null)
        .limit(100); // Get a reasonable sample

      if (error) {
        return [];
      }

      if (!data || data.length === 0) return [];

      // Extract unique titles and filter by query match
      const uniqueTitles = Array.from(new Set(data.map((post: any) => post.title || '')));

      // Score and rank titles similar to the search ranking logic
      const scoredTitles = uniqueTitles
        .filter((title) => title.trim().length > 0)
        .map((title) => {
          const titleLower = title.toLowerCase();
          let score = 0;

          // Exact phrase match (highest priority)
          if (titleLower.includes(cleanQuery)) {
            score += 1000;
          }

          // All words present in title
          const queryWords = cleanQuery.split(/\s+/).filter(Boolean);
          const allWordsMatch = queryWords.every((word) => titleLower.includes(word));
          if (allWordsMatch) {
            score += 500;
          }

          // Starting letter sequence match
          const wordStartMatches = queryWords.filter((word) =>
            titleLower.split(/\s+/).some((titleWord: string) => titleWord.startsWith(word))
          ).length;
          score += wordStartMatches * 10;

          return { title, score };
        })
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10) // Limit to top 10 suggestions
        .map((item) => item.title);

      return scoredTitles;
    } catch (err) {
      return [];
    }
  }
}