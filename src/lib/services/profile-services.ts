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
    try {
      const { data: existing, error: fetchError } = await supabase
        .from('profiles')
        .select('userId, createdAt, createdBy')
        .eq('userId', profile.userId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        toast.error(ProfileMessages.CHECK_EXISTING_PROFILE_ERROR);
        return false;
      }

      const payload: any = {
        ...profile,
        updatedAt: new Date().toISOString(),
        updatedBy: profile.userId,
      };

      if (!existing) {
        payload.createdAt = new Date().toISOString();
        payload.createdBy = profile.userId;
      } else {
        payload.createdAt = existing.createdAt;
        payload.createdBy = existing.createdBy;
      }

      const { error } = await supabase.from('profiles').upsert(payload, {
        onConflict: 'userId',
      });

      if (error) {
        toast.error(ProfileMessages.SAVE_PROFILE_ERROR);
        return false;
      }

      return true;
    } catch {
      toast.error(ProfileMessages.CHECK_EXISTING_PROFILE_ERROR);
      return false;
    }
  }

  static async uploadProfileImage(userId: string, file: File): Promise<string | null> {
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

    if (file.size > MAX_FILE_SIZE) {
      toast.error(ProfileMessages.FILE_SIZE_EXCEEDED);
      return null;
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('profile-images')
      .upload(filePath, file);

    if (uploadError) {
      console.error("Upload error:", uploadError.message);
      toast.error(ProfileMessages.UPLOAD_IMAGE_ERROR);
      return null;
    }

    const { data } = supabase.storage
      .from('profile-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  }
}
