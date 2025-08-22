import { supabase } from './supabase/client';
import { User } from '../models';

export class UserService {
  static async getUserById(userId: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('userId', userId)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }

    return data;
  }

  static async updateUser(userId: string, updates: Partial<User>): Promise<boolean> {
    const { error } = await supabase
      .from('users')
      .update({
        ...updates,
        updatedAt: new Date().toISOString(),
        updatedBy: userId
      })
      .eq('userId', userId);

    if (error) {
      console.error('Error updating user:', error);
      return false;
    }

    return true;
  }
}
