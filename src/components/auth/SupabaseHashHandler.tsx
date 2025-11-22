// components/auth/SupabaseHashHandler.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/services/supabase/client';

export function SupabaseHashHandler() {
  const router = useRouter();

  useEffect(() => {
    const handleHashChange = async () => {
      try {
        // Check if there's a hash in the URL
        const hash = window.location.hash;
        
        if (!hash) return;

        // Parse hash parameters
        const hashParams = new URLSearchParams(hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');
        const error = hashParams.get('error');
        const errorDescription = hashParams.get('error_description');

        // Handle errors
        if (error) {
          console.error('Auth error from hash:', error, errorDescription);
          window.history.replaceState(null, '', window.location.pathname);
          router.push(`/login?error=${encodeURIComponent(errorDescription || error)}`);
          return;
        }

        // Handle password recovery
        if (type === 'recovery' && accessToken) {
          // Set the session using the tokens from the hash
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          });

          if (sessionError) {
            console.error('Session error:', sessionError);
            window.history.replaceState(null, '', window.location.pathname);
            router.push(`/forgot-password?error=${encodeURIComponent('Session expired. Please request a new reset link.')}`);
            return;
          }

          // Clear the hash and redirect to reset password page
          window.history.replaceState(null, '', window.location.pathname);
          router.push('/reset-password');
          return;
        }

        // Handle email confirmation (signup)
        if (type === 'signup' && accessToken) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          });

          if (sessionError) {
            console.error('Session error:', sessionError);
            window.history.replaceState(null, '', window.location.pathname);
            router.push(`/login?error=${encodeURIComponent('Email confirmation failed. Please try again.')}`);
            return;
          }

          window.history.replaceState(null, '', window.location.pathname);
          router.push('/findJobs?message=Email confirmed! Welcome to HanapBuhay.');
          return;
        }

        // Handle magic link
        if (type === 'magiclink' && accessToken) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          });

          if (sessionError) {
            console.error('Session error:', sessionError);
            window.history.replaceState(null, '', window.location.pathname);
            router.push(`/login?error=${encodeURIComponent('Magic link expired. Please try again.')}`);
            return;
          }

          window.history.replaceState(null, '', window.location.pathname);
          router.push('/findJobs');
          return;
        }

      } catch (error) {
        console.error('Error handling hash:', error);
      }
    };

    // Run on mount
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [router]);

  return null;
}