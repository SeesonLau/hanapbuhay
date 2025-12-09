"use client";

import { useState, useEffect } from 'react';
import ProfileContactForm from "./cards/ProfileContactForm";
import { ProfileService } from '@/lib/services/profile-services';
import { formatDisplayName } from '@/lib/utils/profile-utils';

interface ProfileData {
  profilePicUrl: string | null;
  name: string | null;
  sex: string | null;
  age: number | null;
  email: string | null;
  phoneNumber: string | null;
  address: string | null;
}

interface ProfileContactSectionProps {
  userId: string;
  profileData?: ProfileData | null;
}

export default function ProfileContactSection({ userId, profileData: externalProfileData }: ProfileContactSectionProps) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(!externalProfileData);

  useEffect(() => {
    // If data is provided externally, use it directly
    if (externalProfileData) {
      setProfile(externalProfileData);
      setLoading(false);
      return;
    }

    // Otherwise, fetch the data
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profileData = await ProfileService.getProfileContact(userId);
        setProfile(profileData);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, externalProfileData]);

  const formatAddress = (address: string | null): string => {
    if (!address) return "Not provided";
    return address.split('|').map(part => part.trim()).join(', ');
  };

  if (loading) {
    return (
      <div className="p-3 flex items-center justify-center max-w-[356px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-4 text-center text-gray-neutral400 max-w-[356px]">
        Profile not found
      </div>
    );
  }

  const displayName = profile.name ? formatDisplayName(profile.name) : "Unknown";

  return (
    <div className="p-4 max-w-[356px]">
      <ProfileContactForm
        userId={userId}
        profilePictureUrl={profile.profilePicUrl || undefined}
        name={displayName}
        gender={profile.sex || "Not specified"}
        age={profile.age || 0}
        email={profile.email || "Not provided"}
        phoneNumber={profile.phoneNumber || "Not provided"}
        address={formatAddress(profile.address)}
      />
    </div>
  );
}