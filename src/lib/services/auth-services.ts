import { supabase } from './supabase/client';
import { AuthResponse } from '../models';
import { validatePassword, validateEmail } from '../utils/validation';

export class AuthService {
  static async signUp(email: string, password: string): Promise<AuthResponse> {
    try {
      if (!validateEmail(email)) {
        return { success: false, message: 'Invalid email format' };
      }

      const passwordErrors = validatePassword(password);
      if (passwordErrors.length > 0) {
        return { 
          success: false, 
          message: `Password requirements not met: ${passwordErrors.join(', ')}` 
        };
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/confirm`,
        },
      });

      if (authError) {
        return { success: false, message: authError.message };
      }

      if (authData.user) {
        const { error: dbError } = await supabase
          .from('users')
          .insert({
            userid: authData.user.id,
            email: authData.user.email,
            role: 'user',
            createdby: authData.user.id,
            createdat: new Date().toISOString(),
            updatedby: authData.user.id,
            updatedat: new Date().toISOString(),
          });

        if (dbError) {
          await supabase.auth.admin.deleteUser(authData.user.id);
          return { success: false, message: dbError.message };
        }

        return { 
          success: true, 
          message: 'Signup successful. Please check your email for verification.',
          data: authData.user 
        };
      }

      return { success: false, message: 'Signup failed' };
    } catch (error) {
      return { success: false, message: 'An unexpected error occurred' };
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
        return { success: false, message: error.message };
      }

      return { success: true, data: data.user };
    } catch (error) {
      return { success: false, message: 'An unexpected error occurred' };
    }
  }

  static async resendConfirmationEmail(email: string): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
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
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        return { success: false, message: error.message };
      }

      return { success: true, message: 'Password reset instructions sent to your email' };
    } catch (error) {
      return { success: false, message: 'An unexpected error occurred' };
    }
  }

  static async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }

  static async signOut(): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return { success: false, message: error.message };
      }
      return { success: true, message: 'Signed out successfully' };
    } catch (error) {
      return { success: false, message: 'An unexpected error occurred' };
    }
  }
}
