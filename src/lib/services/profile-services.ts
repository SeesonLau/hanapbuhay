import { supabase } from './supabase/client';
import { Profile } from '../models/profile';
import { toast } from 'react-hot-toast';
import { ProfileMessages } from '@/resources/messages/profile';
import { formatDisplayName, parseStoredName, combineToStoredName } from '@/lib/utils/profile-utils';

export class ProfileService {
  static async getEmailByUserId(userId: string): Promise<string | null> {
    try {
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
    } catch (error) {
      toast.error(ProfileMessages.FETCH_EMAIL_ERROR);
      return null;
    }
  }

  static async getProfileByUserId(userId: string): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('userId', userId)
        .single();

      if (error) {
        if (error.code !== 'PGRST116') {
          toast.error(ProfileMessages.FETCH_PROFILE_ERROR);
        }
        return null;
      }

      return data as Profile;
    } catch (error) {
      toast.error(ProfileMessages.FETCH_PROFILE_ERROR);
      return null;
    }
  }

  static async getNameByUserId(userId: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('name')
        .eq('userId', userId)
        .single();

      if (error) {
        if (error.code !== 'PGRST116') {
          toast.error(ProfileMessages.FETCH_NAME_ERROR);
        }
        return null;
      }

      return data?.name ?? null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Gets the formatted display name for a user
   * Removes delimiter and limits first name to first 2 words
   */
  static async getDisplayNameByUserId
  (userId: string): Promise<string | null> {
    try {
      const storedName = await this.getNameByUserId(userId);
      if (!storedName) return null;
      
      return formatDisplayName(storedName);
    } catch (error) {
      return null;
    }
  }

  /**
   * Gets parsed first and last name components
   */
  static async getParsedNameByUserId(userId: string): Promise<{ firstName: string; lastName: string } | null> {
    try {
      const storedName = await this.getNameByUserId(userId);
      if (!storedName) return null;
      
      return parseStoredName(storedName);
    } catch (error) {
      return null;
    }
  }

  static async upsertProfile(profile: Profile): Promise<boolean> {
    try {
      console.log('Upserting profile:', profile);

      const { data: existing, error: fetchError } = await supabase
        .from('profiles')
        .select('userId, createdAt, createdBy')
        .eq('userId', profile.userId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        toast.error(ProfileMessages.CHECK_EXISTING_PROFILE_ERROR);
        return false;
      }

      const now = new Date().toISOString();
      
      const payload: any = {
        userId: profile.userId,
        name: profile.name,
        address: profile.address,
        phoneNumber: profile.phoneNumber,
        birthdate: profile.birthdate,
        age: profile.age,
        sex: profile.sex,
        profilePictureUrl: profile.profilePictureUrl,
        updatedAt: now,
        updatedBy: profile.userId,
      };

      if (!existing) {
        payload.createdAt = now;
        payload.createdBy = profile.userId;
      } else {
        payload.createdAt = existing.createdAt;
        payload.createdBy = existing.createdBy;
      }

      const { error, data } = await supabase
        .from('profiles')
        .upsert(payload, {
          onConflict: 'userId',
        })
        .select();

      if (error) {
        toast.error(ProfileMessages.SAVE_PROFILE_ERROR);
        return false;
      }
      toast.success(ProfileMessages.SAVE_SUCCESS);
      return true;
    } catch (error) {
      toast.error(ProfileMessages.CHECK_EXISTING_PROFILE_ERROR);
      return false;
    }
  }

  static async uploadProfileImage(userId: string, file: File): Promise<string | null> {
    try {
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
        toast.error(ProfileMessages.UPLOAD_IMAGE_ERROR);
        return null;
      }

      const { data } = supabase.storage
        .from('profile-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      toast.error(ProfileMessages.UPLOAD_IMAGE_ERROR);
      return null;
    }
  }

  static async getProfileContact(userId: string): Promise<{
    profilePicUrl: string | null;
    name: string | null;
    sex: string | null;
    age: number | null;
    email: string | null;
    phoneNumber: string | null;
    address: string | null;
  } | null> {
    try {
      // Fetch profile details
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('profilePictureUrl, name, sex, age, phoneNumber, address')
        .eq('userId', userId)
        .single();

      if (profileError) {
        if (profileError.code !== 'PGRST116') {
          toast.error(ProfileMessages.FETCH_PROFILE_ERROR);
        }
        return null;
      }

      // Fetch email separately from users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('email')
        .eq('userId', userId)
        .single();

      if (userError) {
        if (userError.code !== 'PGRST116') {
          toast.error(ProfileMessages.FETCH_EMAIL_ERROR);
        }
        return null;
      }

      return {
        profilePicUrl: profileData?.profilePictureUrl ?? null,
        name: profileData?.name ?? null,
        sex: profileData?.sex ?? null,
        age: profileData?.age ?? null,
        email: userData?.email ?? null,
        phoneNumber: profileData?.phoneNumber ?? null,
        address: profileData?.address ?? null,
      };
    } catch (error) {
      toast.error(ProfileMessages.FETCH_PROFILE_ERROR);
      return null;
    }
  }
  
  static async getNameProfilePic(userId: string): Promise<{ name: string | null; profilePicUrl: string | null } | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('name, profilePictureUrl')
        .eq('userId', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return {
        name: data?.name || null,
        profilePicUrl: data?.profilePictureUrl || null
      };
    } catch (error) {
      console.error('Unexpected error in getNameProfilePic:', error);
      return null;
    }
  }
}