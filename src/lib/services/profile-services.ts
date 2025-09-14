import { supabase } from './supabase/client';
import { Profile } from '../models/profile';
import { toast } from 'react-hot-toast';
import { ProfileMessages } from '@/resources/messages/profile';

export class ProfileService {
  static async getEmailByUserId(userId: string): Promise<string | null> {
    const { data, error } = await supabase
      .from('users')
      .select('email')
      .eq('userId', userId)
      .single();

    if (error) {
      toast.error(ProfileMessages.FETCH_EMAIL_ERROR);
      return null;
    }

    return data?.email ?? null;
  }

  static async getProfileByUserId(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('userId', userId)
      .single();

    if (error) {
      toast.error(ProfileMessages.FETCH_PROFILE_ERROR);
      return null;
    }

    return data as Profile;
  }

  static async upsertProfile(profile: Profile): Promise<boolean> {
    const { data: existing, error: fetchError } = await supabase
      .from('profiles')
      .select('userId')
      .eq('userId', profile.userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { 
      toast.error(ProfileMessages.CHECK_EXISTING_PROFILE_ERROR);
      return false;
    }

    const { error } = await supabase
      .from('profiles')
      .upsert({
        ...profile,
        updatedAt: new Date().toISOString(),
        updatedBy: profile.userId,
        createdAt: existing ? undefined : new Date().toISOString(),
        createdBy: existing ? undefined : profile.userId,
      });

    if (error) {
      toast.error(ProfileMessages.SAVE_PROFILE_ERROR);
      return false;
    }

    return true;
  }

  static async uploadProfileImage(userId: string, file: File): Promise<string | null> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `profile-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('profile-images') 
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast.error(ProfileMessages.UPLOAD_IMAGE_ERROR);
      return null;
    }

    const { data } = supabase.storage
      .from('profile-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  }
}
