import { supabase } from '@/lib/services/supabase/client';

export abstract class BaseService {
  /**
   * Generic method to fetch all records from a table with optional filtering
   * @param tableName - Name of the database table
   * @param filters - Key-value pairs for WHERE clause conditions
   * @returns Array of records of type T
   */
  protected static async getAll<T>(
    tableName: string, 
    filters: { [key: string]: any } = {}
  ): Promise<T[]> {
    // Start building the query: select all columns from specified table
    let query = supabase
      .from(tableName)          // FROM users/profiles table
      .select('*')              // SELECT all columns (* means all columns)
      .is('deletedAt', null);   // WHERE deletedAt IS NULL (soft delete filter)

    // Apply additional filters dynamically
    // Converts { role: 'admin', status: 'active' } to .eq('role', 'admin').eq('status', 'active')
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value);  // WHERE key = value
      }
    });

    // Execute the query with ordering
    const { data, error } = await query.order('createdAt', { ascending: false });  // ORDER BY createdAt DESC

    if (error) {
      console.error(`Error fetching ${tableName}:`, error);
      throw new Error(`Failed to fetch ${tableName}: ${error.message}`);
    }

    return data || [];  // Return empty array if no data
  }

  /**
   * Fetch a single record by userId (primary key)
   * @param tableName - Name of the database table
   * @param id - userId value to search for
   * @returns Single record or null if not found
   */
  protected static async getById<T>(
    tableName: string,
    id: string
  ): Promise<T | null> {
    const { data, error } = await supabase
      .from(tableName)          // FROM users/profiles table
      .select('*')              // SELECT all columns
      .eq('userId', id)         // WHERE userId = id (primary key lookup)
      .is('deletedAt', null)    // AND deletedAt IS NULL
      .single();                // Expect single result, throws if 0 or multiple rows

    if (error) {
      if (error.code === 'PGRST116') { // PGRST116 = "No rows returned" (not found)
        return null;
      }
      console.error(`Error fetching ${tableName} by id:`, error);
      throw new Error(`Failed to fetch ${tableName}: ${error.message}`);
    }

    return data;
  }

  /**
   * Search records across multiple fields with optional additional filters
   * @param tableName - Name of the database table
   * @param searchFields - Array of column names to search in
   * @param searchTerm - Text to search for
   * @param additionalFilters - Additional WHERE conditions
   * @returns Array of matching records
   */
  protected static async search<T>(
    tableName: string,
    searchFields: string[],
    searchTerm: string,
    additionalFilters: { [key: string]: any } = {}
  ): Promise<T[]> {
    // If no search term, fall back to getAll with filters
    if (!searchTerm.trim()) {
      return this.getAll(tableName, additionalFilters);
    }

    let query = supabase
      .from(tableName)          // FROM users/profiles table
      .select('*')              // SELECT all columns
      .is('deletedAt', null);   // WHERE deletedAt IS NULL

    // Build OR conditions for search: (field1 ILIKE %term% OR field2 ILIKE %term%)
    // Example: ['email', 'role'] becomes "email.ilike.%search% OR role.ilike.%search%"
    const searchConditions = searchFields.map(field => `${field}.ilike.%${searchTerm}%`);
    query = query.or(searchConditions.join(','));  // OR combination of search conditions

    // Apply additional filters (AND conditions with the OR search)
    Object.entries(additionalFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value);  // AND key = value
      }
    });

    const { data, error } = await query.order('createdAt', { ascending: false });  // ORDER BY createdAt DESC

    if (error) {
      console.error(`Error searching ${tableName}:`, error);
      throw new Error(`Failed to search ${tableName}: ${error.message}`);
    }

    return data || [];
  }
}