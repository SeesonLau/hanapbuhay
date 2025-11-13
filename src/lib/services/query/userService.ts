import { supabase } from '@/lib/services/supabase/client';
import { BaseService } from './baseService';
import { User, UserWithProfile, Profile, SearchFilters } from './types';

export class UserService extends BaseService {
  /**
   * Fetch all users with optional filtering
   * Queries columns: userId, email, role, createdBy, createdAt, 
   *                  updatedBy, updatedAt, deletedBy, deletedAt
   */
  static async getUsers(filters: SearchFilters = {}): Promise<User[]> {
    let query = supabase
      .from('users')            // FROM users table
      .select('*')              // SELECT all user columns
      .is('deletedAt', null);   // WHERE deletedAt IS NULL

    // Apply email search filter
    if (filters.searchTerm) {
      query = query.ilike('email', `%${filters.searchTerm}%`);  // WHERE email ILIKE %term%
    }

    // Apply role filter
    if (filters.role) {
      query = query.eq('role', filters.role);  // AND role = 'admin'/'user'
    }

    // Date range filters for createdAt
    if (filters.dateFrom) {
      query = query.gte('createdAt', filters.dateFrom);  // AND createdAt >= dateFrom
    }

    if (filters.dateTo) {
      query = query.lte('createdAt', filters.dateTo);    // AND createdAt <= dateTo
    }

    const { data, error } = await query.order('createdAt', { ascending: false });  // ORDER BY createdAt DESC

    if (error) {
      console.error('Error fetching users:', error);
      throw new Error(`Failed to fetch users: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Get user by userId (primary key)
   */
  static async getUserById(userId: string): Promise<User | null> {
    return this.getById<User>('users', userId);  // Uses baseService getById
  }

  /**
   * Search users across email and role fields
   */
  static async searchUsers(searchTerm: string, filters: SearchFilters = {}): Promise<User[]> {
    return this.search<User>(
      'users', 
      ['email', 'role'],  // Search these columns
      searchTerm, 
      filters
    );
  }

  /**
   * Get users with their associated profiles (JOIN equivalent)
   * This performs two separate queries and joins them in code
   */
  static async getUsersWithProfiles(): Promise<UserWithProfile[]> {
    // First query: get all active users
    const users = await this.getUsers();
    
    if (users.length === 0) {
      return [];
    }

    // Second query: get profiles for all the users we found
    const userIds = users.map(user => user.userId);
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')              // SELECT all profile columns
      .in('userId', userIds)    // WHERE userId IN (user1, user2, user3...)
      .is('deletedAt', null);   // AND deletedAt IS NULL

    if (error) {
      console.error('Error fetching profiles for users:', error);
      throw new Error(`Failed to fetch profiles: ${error.message}`);
    }

    // Manual JOIN in JavaScript: combine each user with their profile
    const usersWithProfiles = users.map(user => {
      const userProfile = profiles?.find(profile => profile.userId === user.userId) || null;
      return {
        ...user,
        profile: userProfile  // Add profile data to user object
      };
    });

    return usersWithProfiles;
  }

  /**
   * Get single user with their profile
   */
  static async getUserWithProfile(userId: string): Promise<UserWithProfile | null> {
    const user = await this.getUserById(userId);
    if (!user) return null;

    // Get profile for this specific user
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')              // SELECT all profile columns
      .eq('userId', userId)     // WHERE userId = specific user
      .is('deletedAt', null)    // AND deletedAt IS NULL
      .single();                // Expect single result

    if (error && error.code !== 'PGRST116') {  // Ignore "not found" error
      console.error('Error fetching profile:', error);
      throw new Error(`Failed to fetch profile: ${error.message}`);
    }

    return {
      ...user,
      profile: profile || null  // Combine user with profile (or null if no profile)
    };
  }

  /**
   * Get users by specific role
   */
  static async getUsersByRole(role: string): Promise<User[]> {
    return this.getAll<User>('users', { role });  // WHERE role = provided value
  }

  /**
   * Get soft-deleted users (where deletedAt is NOT NULL)
   */
  static async getDeletedUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')                    // SELECT all columns
      .not('deletedAt', 'is', null)   // WHERE deletedAt IS NOT NULL
      .order('deletedAt', { ascending: false });  // ORDER BY deletedAt DESC

    if (error) {
      console.error('Error fetching deleted users:', error);
      throw new Error(`Failed to fetch deleted users: ${error.message}`);
    }

    return data || [];
  }
}