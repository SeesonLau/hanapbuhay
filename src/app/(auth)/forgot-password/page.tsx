import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
          <p className="mt-2 text-gray-600">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
        </div>
        
        <ForgotPasswordForm />
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Remember your password?{' '}
            <Link href={ROUTES.LOGIN} className="text-blue-600 hover:text-blue-800">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
