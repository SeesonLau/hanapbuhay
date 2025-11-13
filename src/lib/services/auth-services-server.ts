import { createServerSupabaseClient } from '@/lib/services/supabase/server-client';
import { AuthResponse } from '../models/user';

export class AuthServiceServer {
  static async verifyEmail(token: string): Promise<AuthResponse> {
    try {
      const supabase = createServerSupabaseClient();
      
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'signup',
      });

      if (error) {
        console.error('Email verification error:', error);
        return { 
          success: false, 
          message: error.message || 'Email verification failed' 
        };
      }

      return { 
        success: true, 
        message: 'Email verified successfully', 
        data 
      };
    } catch (error) {
      console.error('Unexpected error in email verification:', error);
      return { 
        success: false, 
        message: 'An unexpected error occurred during email verification' 
      };
    }
  }

  static async resendConfirmationEmail(email: string): Promise<AuthResponse> {
    try {
      const supabase = createServerSupabaseClient();
      
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

  static async forgotPassword(email: string): Promise<AuthResponse> {
    try {
      const supabase = createServerSupabaseClient();
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${siteUrl}/reset-password`,
      });

      if (error) {
        return { success: false, message: error.message };
      }

      return { success: true, message: 'Password reset instructions sent to your email' };
    } catch (error) {
      return { success: false, message: 'An unexpected error occurred' };
    }
  }
}
