import { supabase } from './supabase/client';
import { AuthResponse } from '../models';
import { validatePassword, validateEmail } from '../utils/validation';
import { toast } from 'react-hot-toast';
import { AuthMessages } from '@/resources/messages/auth';

export class AuthService {
  static async signUp(email: string, password: string, confirmPassword: string): Promise<AuthResponse> {
    try {
      if (!validateEmail(email)) {
        toast.error(AuthMessages.INVALID_EMAIL);
        return { success: false, message: AuthMessages.INVALID_EMAIL };
      }

      if (password !== confirmPassword) {
        toast.error(AuthMessages.PASSWORD_MISMATCH);
        return { success: false, message: AuthMessages.PASSWORD_MISMATCH };
      }
 
      const passwordErrors = validatePassword(password);
      if (passwordErrors.length > 0) {
        const msg = `${AuthMessages.PASSWORD_REQUIREMENTS}: ${passwordErrors.join(', ')}`;
        toast.error(msg);
        return { success: false, message: msg };
      }

      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                     (typeof window !== 'undefined' ? window.location.origin : '') ||
                     'http://localhost:3000';

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${siteUrl}/auth/confirm`,
        },
      });

      if (authError) {
        toast.error(authError.message);
        return { success: false, message: authError.message };
      }

      if (authData.user) {
        const { error: dbError } = await supabase
          .from('users')
          .insert({
            userId: authData.user.id,
            email: authData.user.email,
            role: 'user',
            createdBy: authData.user.id,
            createdAt: new Date().toISOString(),
            updatedBy: authData.user.id,
            updatedAt: new Date().toISOString(),
          });

        if (dbError) {
          await supabase.auth.admin.deleteUser(authData.user.id);
          toast.error(dbError.message);
          return { success: false, message: dbError.message };
        }

        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            userId: authData.user.id,
            createdBy: authData.user.id,
            updatedBy: authData.user.id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });

        if (profileError) {
          await supabase
            .from('users')
            .delete()
            .eq('userId', authData.user.id);

          await supabase.auth.admin.deleteUser(authData.user.id);
          toast.error(profileError.message);
          return { success: false, message: profileError.message };
        }

        toast.success(AuthMessages.SIGNUP_SUCCESS);
        return { success: true, message: AuthMessages.SIGNUP_SUCCESS, data: authData.user };
      }
      
      toast.error(AuthMessages.SIGNUP_ERROR);
      return { success: false, message: AuthMessages.SIGNUP_ERROR };
    } catch (err) {
      toast.error(AuthMessages.UNEXPECTED_ERROR);
      return { success: false, message: AuthMessages.UNEXPECTED_ERROR };
    }
  }

  static async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Check if the error is due to email not confirmed
        if (error.message.includes('Email not confirmed')) {
          // Offer to resend confirmation email
          return { 
            success: false, 
            message: 'Email not confirmed. Would you like us to resend the confirmation email?',
            needsConfirmation: true 
          };
        }
        toast.error(error.message);
        return { success: false, message: error.message };
      }

      toast.success(AuthMessages.LOGIN_SUCCESS);
      return { success: true, data: data.user };
    } catch (err) {
      toast.error(AuthMessages.UNEXPECTED_ERROR);
      return { success: false, message: AuthMessages.UNEXPECTED_ERROR };
    }
  }

  static async resendConfirmationEmail(email: string): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        toast.error(error.message);
        return { success: false, message: error.message };
      }

      return { success: true, message: 'Confirmation email sent successfully' };
    } catch (error) {
      return { success: false, message: 'An unexpected error occurred' };
    }
  }

  static async verifyEmail(token: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'signup',
      });

      if (error) {
        return { success: false, message: error.message };
      }

      return { success: true, message: 'Email verified successfully', data };
    } catch (error) {
      return { success: false, message: 'An unexpected error occurred' };
    }
  }

  static async forgotPassword(email: string): Promise<AuthResponse> {
    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                     (typeof window !== 'undefined' ? window.location.origin : '') ||
                     'http://localhost:3000';
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${siteUrl}/reset-password`,
      });

      if (error) {
        toast.error(error.message);
        return { success: false, message: error.message };
      }

      toast.success(AuthMessages.PASSWORD_RESET_SENT);
      return { success: true, message: AuthMessages.PASSWORD_RESET_SENT };
    } catch (err) {
      toast.error(AuthMessages.UNEXPECTED_ERROR);
      return { success: false, message: AuthMessages.UNEXPECTED_ERROR };
    }
  }

  static async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        toast.error(error.message);
        return null;
      }
      return user;
    } catch (err) {
      toast.error(AuthMessages.UNEXPECTED_ERROR);
      return null;
    }
  }

  static async signOut(): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message);
        return { success: false, message: error.message };
      }
      toast.success(AuthMessages.SIGNOUT_SUCCESS);
      return { success: true, message: AuthMessages.SIGNOUT_SUCCESS };
    } catch (err) {
      toast.error(AuthMessages.UNEXPECTED_ERROR);
      return { success: false, message: AuthMessages.UNEXPECTED_ERROR };
    }
  }
}
