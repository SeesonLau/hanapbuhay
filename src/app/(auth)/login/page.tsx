import { LoginForm } from '@/components/auth/LoginForm';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Sign In</h1>
          <p className="mt-2 text-gray-600">Welcome back! Please sign in to your account.</p>
        </div>
        
        <LoginForm />
        
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href={ROUTES.SIGNUP} className="text-blue-600 hover:text-blue-800 font-medium">
              Sign up here
            </Link>
          </p>
          <p className="text-sm text-gray-600">
            <Link href={ROUTES.FORGOT_PASSWORD} className="text-blue-600 hover:text-blue-800 font-medium">
              Forgot your password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
