// src/components/ui/HeaderDashboard.tsx
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/lib/services/auth-services';
import { ROUTES } from '@/lib/constants';
import { getWhiteColor } from '@/lib/colors';

export default function HeaderDashboard() {
  const router = useRouter();
  const whiteWithOpacity = getWhiteColor(0.15);

  const handleSignOut = async () => {
    await AuthService.signOut();
    router.push(ROUTES.HOME);
  };

  return (
    <div 
      className="w-full px-4 py-3 rounded-xl backdrop-blur-sm flex justify-between items-center"
      style={{ backgroundColor: whiteWithOpacity }}
    >
      {/* Logo */}
      <Link href={ROUTES.DASHBOARD} className="w-48 h-16 relative cursor-pointer">
        <Image
          className="w-48 h-16"
          src="/image/hanapbuhay-logo.svg"
          alt="HanapBuhat Logo"
          width={187}
          height={68}
          priority
        />
      </Link>

      {/* Navigation Buttons */}
      <div className="flex justify-center items-center gap-8">
        {/* Find Jobs */}
        <Link href={ROUTES.FINDJOBS}>
          <button className="flex justify-center items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="text-center justify-center text-neutral-200 text-lg font-medium font-['DM_Sans'] leading-relaxed px-4 py-2">
              Find Jobs
            </div>
          </button>
        </Link>

        {/* Manage Job Posts */}
        <Link href={ROUTES.MANAGEJOBPOSTS}>
          <button className="flex justify-center items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="text-center justify-center text-neutral-200 text-lg font-medium font-['DM_Sans'] leading-relaxed px-4 py-2">
              Manage Job Posts
            </div>
          </button>
        </Link>

        {/* Applied Jobs */}
        <Link href={ROUTES.APPLIEDJOBS}>
          <button className="flex justify-center items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="text-center justify-center text-neutral-200 text-lg font-medium font-['DM_Sans'] leading-relaxed px-4 py-2">
              Applied Jobs
            </div>
          </button>
        </Link>

        {/* Chat */}
        <Link href={ROUTES.CHAT}>
          <button className="flex justify-center items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="text-center justify-center text-neutral-200 text-lg font-medium font-['DM_Sans'] leading-relaxed px-4 py-2">
              Chat
            </div>
          </button>
        </Link>
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-4">
        {/* User Icon */}
        <Link href={ROUTES.PROFILE}>
          <button className="flex justify-center items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-neutral-200 text-lg font-medium font-['DM_Sans']">
              👤
            </div>
          </button>
        </Link>

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          className="flex justify-center items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="text-center justify-center text-neutral-200 text-lg font-medium font-['DM_Sans'] leading-relaxed px-4 py-2">
            Sign Out
          </div>
        </button>
      </div>
    </div>
  );
}
