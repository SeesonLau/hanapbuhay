// src/services/profile-services.ts
import { supabase } from './supabase/client';
import { Profile } from '../models/profile';

export class ProfileService {
  static async getProfileByUserId(userId: string): Promise<(Profile & { email?: string | null }) | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        users!inner (
          email,
          firstName,
          lastName
        )
      `)
      .eq('userId', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    if (!data) return null;

    // combine firstname + lastname from users
    return {
      ...data,
      name: `${data.users.firstName ?? ''} ${data.users.lastName ?? ''}`.trim(),
      email: data.users.email,
    };
  }

  static async upsertProfile(profile: Profile): Promise<boolean> {
    const { error } = await supabase.from('profiles').upsert([
      {
        ...profile,
        updatedAt: new Date().toISOString(),
        updatedBy: profile.userId,
      },
    ]);

    if (error) {
      console.error('Error upserting profile:', error);
      return false;
    }

    return true;
  }
}
