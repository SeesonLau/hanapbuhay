// src/app/page.tsx
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Welcome</h1>
          <p className="mt-2 text-gray-600">Please choose an option to continue</p>
        </div>
        
        <div className="space-y-4">
          <Link
            href={ROUTES.LOGIN}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 block text-center"
          >
            Login
          </Link>
          
          <Link
            href={ROUTES.SIGNUP}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 block text-center"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
