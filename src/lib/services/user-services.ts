import { supabase } from './supabase/client';
import { User } from '../models';
import { toast } from 'react-hot-toast';
import { UserMessages } from '@/resources/messages/user';

export class UserService {
  static async getUserById(userId: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('userId', userId)
      .single();

    if (error) {
      toast.error(UserMessages.FETCH_USER_ERROR);
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
      toast.error(UserMessages.UPDATE_USER_ERROR);
      return false;
    }

    toast.success(UserMessages.UPDATE_USER_SUCCESS);
    return true;
  }
}
