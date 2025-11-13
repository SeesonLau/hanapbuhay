import { supabase } from '@/lib/services/supabase/client';
import { BaseService } from './baseService';
import { Profile, SearchFilters } from './types';

export class ProfileService extends BaseService {
  /**
   * Fetch all profiles with optional filtering
   * Queries columns: userId, profilePictureUrl, name, address, phoneNumber, 
   *                  birthdate, sex, age, createdBy, createdAt, updatedBy, 
   *                  updatedAt, deletedBy, deletedAt
   */
  static async getProfiles(filters: SearchFilters = {}): Promise<Profile[]> {
    let query = supabase
      .from('profiles')         // FROM profiles table
      .select('*')              // SELECT all profile columns
      .is('deletedAt', null);   // WHERE deletedAt IS NULL

    // Apply search filter - searches name OR phoneNumber
    if (filters.searchTerm) {
      // WHERE (name ILIKE %term% OR phoneNumber ILIKE %term%)
      query = query.or(`name.ilike.%${filters.searchTerm}%,phoneNumber.ilike.%${filters.searchTerm}%`);
    }

    // Apply sex filter
    if (filters.sex) {
      query = query.eq('sex', filters.sex);  // AND sex = 'male'/'female'
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
      console.error('Error fetching profiles:', error);
      throw new Error(`Failed to fetch profiles: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Get profile by userId (primary key)
   * Queries same columns as getProfiles but for single user
   */
  static async getProfileByUserId(userId: string): Promise<Profile | null> {
    return this.getById<Profile>('profiles', userId);  // Uses baseService getById
  }

  /**
   * Search profiles across multiple fields
   * Searches in: name, phoneNumber, address, sex columns
   */
  static async searchProfiles(searchTerm: string, filters: SearchFilters = {}): Promise<Profile[]> {
    return this.search<Profile>(
      'profiles', 
      ['name', 'phoneNumber', 'address', 'sex'],  // Search these columns
      searchTerm, 
      filters
    );
  }

  /**
   * Get profiles filtered by sex
   */
  static async getProfilesBySex(sex: string): Promise<Profile[]> {
    return this.getAll<Profile>('profiles', { sex });  // WHERE sex = provided value
  }

  /**
   * Get soft-deleted profiles (where deletedAt is NOT NULL)
   */
  static async getDeletedProfiles(): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')                    // SELECT all columns
      .not('deletedAt', 'is', null)   // WHERE deletedAt IS NOT NULL (deleted records)
      .order('deletedAt', { ascending: false });  // ORDER BY deletedAt DESC

    if (error) {
      console.error('Error fetching deleted profiles:', error);
      throw new Error(`Failed to fetch deleted profiles: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Get profiles within age range
   * WHERE age >= minAge AND age <= maxAge
   */
  static async getProfilesWithAgeRange(minAge: number, maxAge: number): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')              // SELECT all columns
      .is('deletedAt', null)    // WHERE deletedAt IS NULL
      .gte('age', minAge)       // AND age >= minAge
      .lte('age', maxAge)       // AND age <= maxAge
      .order('age', { ascending: true });  // ORDER BY age ASC

    if (error) {
      console.error('Error fetching profiles by age range:', error);
      throw new Error(`Failed to fetch profiles by age range: ${error.message}`);
    }

    return data || [];
  }
}