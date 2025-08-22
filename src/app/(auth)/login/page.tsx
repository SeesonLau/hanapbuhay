// src/app/(auth)/login/page.tsx
import { LoginForm } from '@/components/auth/LoginForm';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Sign In</h1>
          <p className="mt-2 text-gray-600">Welcome back! Please sign in to your account.</p>
        </div>
        
        <LoginForm />
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href={ROUTES.SIGNUP} className="text-blue-600 hover:text-blue-800">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
