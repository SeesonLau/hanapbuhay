'use client';

import { useEffect, useState, useRef } from "react";
import { Profile } from "@/lib/models/profile";
import { ProfileService } from "@/lib/services/profile-services";
import { combineToStoredName } from "@/lib/utils/profile-utils";
import { FaUserCircle } from 'react-icons/fa';
import { Edit3, Camera } from 'lucide-react';
import TextBox from "../ui/TextBox";
import SelectBox from "../ui/SelectBox";
import Button from "../ui/Button";
import { getProvinces, getCitiesByProvince } from "@/lib/constants/philippines-locations";
import { useTheme } from '@/hooks/useTheme';

interface ProfileFormProps {
  userId: string;
  className?: string;
}

export default function ProfileForm({ userId, className }: ProfileFormProps) {
  const { theme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<Profile & { email?: string | null } | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [email, setEmail] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);

  // Location states
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [streetAddress, setStreetAddress] = useState("");

  useEffect(() => {
    const fetchProfileAndEmail = async () => {
      try {
        const [profileData, userEmail, parsedName, displayName] = await Promise.all([
          ProfileService.getProfileByUserId(userId),
          ProfileService.getEmailByUserId(userId),
          ProfileService.getParsedNameByUserId(userId),
          ProfileService.getDisplayNameByUserId(userId)
        ]);

        if (profileData) {
          setProfile(profileData);
          setPreviewUrl(profileData.profilePictureUrl ?? null);
          
          if (profileData.address) {
            const addressParts = profileData.address.split(' | ');
            if (addressParts.length >= 3) {
              setProvince(addressParts[0]);
              setCity(addressParts[1]);
              setStreetAddress(addressParts.slice(2).join(' | '));
            } else if (addressParts.length === 2) {
              setProvince(addressParts[0]);
              setCity(addressParts[1]);
            } else if (addressParts.length === 1) {
              setProvince(addressParts[0]);
            }
          }
        }

        if (parsedName) {
          setFirstName(parsedName.firstName);
          setLastName(parsedName.lastName);
        }

        if (userEmail) {
          setEmail(userEmail);
        }

        if (displayName) {
          setDisplayName(displayName);
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndEmail();
  }, [userId]);

  const handleChange = (field: keyof Profile, value: any) => {
    setProfile((prev) => prev ? { ...prev, [field]: value } : prev);
  };

  const handleBirthdateChange = (value: string) => {
    const birthdate = new Date(value);
    const today = new Date();
    if (birthdate > today) return;

    const age = today.getFullYear() - birthdate.getFullYear() -
      (today < new Date(today.getFullYear(), birthdate.getMonth(), birthdate.getDate()) ? 1 : 0);

    setProfile((prev) => prev ? { ...prev, birthdate: value, age } : prev);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files[0]) return;
    const file = event.target.files[0];
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleProfilePictureClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);

    try {
      let uploadedUrl = profile.profilePictureUrl ?? null;
      
      if (selectedFile) {
        const result = await ProfileService.uploadProfileImage(userId, selectedFile);
        if (!result) {
          setSaving(false);
          return;
        }
        uploadedUrl = result;
      }

      const fullAddress = [province, city, streetAddress]
        .filter(Boolean)
        .join(' | ');

      const storedName = combineToStoredName(firstName, lastName);
      const success = await ProfileService.upsertProfile({ 
        ...profile, 
        name: storedName, 
        profilePictureUrl: uploadedUrl,
        address: fullAddress
      });
      
      if (success) {
        const newDisplayName = await ProfileService.getDisplayNameByUserId(userId);
        if (newDisplayName) {
          setDisplayName(newDisplayName);
        }
        setIsEditing(false); 
      }
    } catch {
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ color: theme.colors.textSecondary }}>Loading...</div>
    );
  }

  return (
    <div 
      className={`${className} relative h-full rounded-xl shadow-md flex flex-col overflow-y-auto scrollbar-hide`}
      style={{ backgroundColor: theme.colors.cardBg }}
    >
      {/* Main Content with Dynamic Spacing */}
      <div className="flex-1 flex flex-col px-[2vw] md:px-[4vw] lg:px-[5vw] py-[2vh] md:py-[3vh]">
        {/* Edit Icon */}
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="absolute top-[2vh] right-[2vw] p-[0.8vh] rounded-full transition z-10"
          style={{
            backgroundColor: 'transparent',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.backgroundSecondary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <Edit3 
            className="w-[2vh] h-[2vh] min-w-[14px] min-h-[14px]"
            style={{ color: theme.colors.textSecondary }}
          />
        </button>

        {/* Profile Picture Upload - Scales with viewport */}
        <div className="flex items-center justify-center mb-[2.5vh]" style={{ gap: 'clamp(0.75rem, 1.5vh, 1.5rem)' }}>
          <div
            className={`relative flex-shrink-0 group ${isEditing ? 'cursor-pointer' : ''}`}
            onClick={handleProfilePictureClick}
            style={{
              width: 'clamp(3rem, 11vh, 11rem)',
              height: 'clamp(3rem, 11vh, 11rem)',
            }}
          >
            {previewUrl ? (
              <>
                <img
                  src={previewUrl}
                  alt="Profile"
                  className={`w-full h-full object-cover rounded-full border ${isEditing ? 'group-hover:brightness-75 transition-all duration-200' : ''}`}
                  style={{ borderColor: theme.colors.border }}
                />
                {isEditing && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Camera 
                      className="text-white drop-shadow-lg"
                      style={{ 
                        width: 'clamp(1.5rem, 4vh, 2.5rem)',
                        height: 'clamp(1.5rem, 4vh, 2.5rem)'
                      }}
                    />
                  </div>
                )}
              </>
            ) : (
              <div 
                className={`w-full h-full flex items-center justify-center rounded-full relative ${isEditing ? 'transition' : ''}`}
                style={{ backgroundColor: theme.colors.backgroundSecondary }}
                onMouseEnter={(e) => {
                  if (isEditing) {
                    e.currentTarget.style.backgroundColor = theme.colors.background;
                  }
                }}
                onMouseLeave={(e) => {
                  if (isEditing) {
                    e.currentTarget.style.backgroundColor = theme.colors.backgroundSecondary;
                  }
                }}
              >
                <FaUserCircle 
                  className="w-full h-full"
                  style={{ color: theme.colors.textMuted }}
                />
                {isEditing && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Camera 
                      style={{ 
                        width: 'clamp(1.5rem, 4vh, 2.5rem)',
                        height: 'clamp(1.5rem, 4vh, 2.5rem)',
                        color: theme.colors.textSecondary
                      }}
                    />
                  </div>
                )}
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {displayName && (
            <div className="flex flex-col" style={{ gap: 'clamp(0.125rem, 0.5vh, 0.5rem)' }}>
              <p 
                className="font-alexandria font-bold"
                style={{ 
                  color: theme.colors.text,
                  fontSize: 'clamp(0.875rem, 2vh, 1.125rem)'
                }}
              >
                {displayName}
              </p>
              <p 
                className="font-alexandria"
                style={{ 
                  color: theme.colors.textMuted,
                  fontSize: 'clamp(0.625rem, 1.4vh, 0.875rem)'
                }}
              >
                {email}
              </p>
            </div>
          )}
        </div>

        {/* Form Fields Container with Dynamic Gaps */}
        <div className="flex flex-col flex-1" style={{ gap: 'clamp(0.75rem, 2.5vh, 3rem)' }}>
          {/* First & Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 'clamp(1.5rem, 4vh, 3rem)' }}>
            <TextBox
              label="First Name"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              width="100%"
              readOnly={!isEditing}
              disabled={!isEditing}
              style={{
                height: 'clamp(2.5rem, 5vh, 3.5rem)',
                fontSize: 'clamp(0.8rem, 1.6vh, 1rem)',
                borderColor: isEditing ? undefined : theme.colors.text,
                borderWidth: isEditing ? undefined : '1.5px',
                backgroundColor: isEditing ? undefined : theme.colors.background
              }}
            />

            <TextBox
              label="Last Name"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              width="100%"
              readOnly={!isEditing}
              disabled={!isEditing}
              style={{
                height: 'clamp(2.5rem, 5vh, 3.5rem)',
                fontSize: 'clamp(0.8rem, 1.6vh, 1rem)',
                borderColor: isEditing ? undefined : theme.colors.text,
                borderWidth: isEditing ? undefined : '1.5px',
                backgroundColor: isEditing ? undefined : theme.colors.background
              }}
            />
          </div>

          {/* Phone Number & Birthdate */}
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 'clamp(1.5rem, 4vh, 3rem)' }}>
            <TextBox
              label="Phone Number"
              type="tel"
              placeholder="09XXXXXXXXX"
              value={profile?.phoneNumber ?? ''}
              onChange={(e) => handleChange('phoneNumber', e.target.value)}
              width="100%"
              enableValidation={true}
              showSuccessIcon={true}
              readOnly={!isEditing}
              disabled={!isEditing}
              style={{
                height: 'clamp(2.5rem, 5vh, 3.5rem)',
                fontSize: 'clamp(0.8rem, 1.6vh, 1rem)',
                borderColor: isEditing ? undefined : theme.colors.text,
                borderWidth: isEditing ? undefined : '1.5px',
                backgroundColor: isEditing ? undefined : theme.colors.background
              }}
            />

            <TextBox
              label="Birthdate"
              type="date"
              value={profile?.birthdate ?? ''}
              onChange={(e) => handleBirthdateChange(e.target.value)}
              width="100%"
              readOnly={!isEditing}
              disabled={!isEditing}
              max={new Date().toISOString().split('T')[0]}
              onKeyDown={(e) => e.preventDefault()}
              onClick={(e) => {
                if (!isEditing) return;
                const input = e.currentTarget as HTMLInputElement;
                input.showPicker?.();
              }}
              style={{
                height: 'clamp(2.5rem, 5vh, 3.5rem)',
                fontSize: 'clamp(0.8rem, 1.6vh, 1rem)',
                borderColor: isEditing ? undefined : theme.colors.text,
                borderWidth: isEditing ? undefined : '1.5px',
                backgroundColor: isEditing ? undefined : theme.colors.background
              }}
            />
          </div>

          {/* Age & Sex */}
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 'clamp(1.5rem, 4vh, 3rem)' }}>
            <TextBox
              label="Age"
              type="number"
              value={profile?.age ?? ''}
              readOnly
              width="100%"
              disabled={!isEditing}
              style={{
                height: 'clamp(2.5rem, 5vh, 3.5rem)',
                fontSize: 'clamp(0.8rem, 1.6vh, 1rem)',
                borderColor: isEditing ? undefined : theme.colors.text,
                borderWidth: isEditing ? undefined : '1.5px',
                backgroundColor: isEditing ? undefined : theme.colors.background
              }}
            />

            <SelectBox
              label="Sex"
              value={profile?.sex ?? ''}
              onChange={(e) => handleChange("sex", e.target.value)}
              options={[
                { value: '', label: 'Select Sex' },
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
                { value: 'Other', label: 'Other' }
              ]}
              width="100%"
              disabled={!isEditing}
              style={{
                height: 'clamp(2.5rem, 5vh, 3.5rem)',
                fontSize: 'clamp(0.8rem, 1.6vh, 1rem)',
                borderColor: isEditing ? undefined : theme.colors.text,
                borderWidth: isEditing ? undefined : '1.5px',
                backgroundColor: isEditing ? undefined : theme.colors.background
              }}
            />
          </div>

          {/* Address Section*/}
          <div>
            <div
              className="font-semibold"
              style={{
                color: theme.colors.text,
                fontSize: 'clamp(0.75rem, 1.6vh, 0.95rem)',
                marginBottom: 'clamp(0.375rem, 1vh, 0.75rem)'
              }}
            >
              Address
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: 'clamp(0.5rem, 1.5vh, 1rem)' }}>
              <SelectBox
                options={getProvinces().map((prov) => ({ value: prov, label: prov }))}
                value={province}
                onChange={(e) => {
                  setProvince(e.target.value);
                  const cities = getCitiesByProvince(e.target.value);
                  setCity(cities.length > 0 ? cities[0] : "");
                }}
                placeholder="Select province"
                disabled={!isEditing}
                width="100%"
                style={{
                  height: 'clamp(2.5rem, 5vh, 3.5rem)',
                  fontSize: 'clamp(0.8rem, 1.6vh, 1rem)',
                  borderColor: isEditing ? undefined : theme.colors.text,
                  borderWidth: isEditing ? undefined : '1.5px',
                  backgroundColor: isEditing ? undefined : theme.colors.background
                }}
              />
              <SelectBox
                options={getCitiesByProvince(province).map((city_name) => ({ value: city_name, label: city_name }))}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Select city or municipality"
                disabled={!isEditing || !province}
                width="100%"
                style={{
                  height: 'clamp(2.5rem, 5vh, 3.5rem)',
                  fontSize: 'clamp(0.8rem, 1.6vh, 1rem)',
                  borderColor: isEditing ? undefined : theme.colors.text,
                  borderWidth: isEditing ? undefined : '1.5px',
                  backgroundColor: isEditing ? undefined : theme.colors.background
                }}
              />
              <TextBox
                placeholder="Specific address"
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                maxLength={50}
                width="100%"
                readOnly={!isEditing}
                disabled={!isEditing}
                style={{
                  height: 'clamp(2.5rem, 5vh, 3.5rem)',
                  fontSize: 'clamp(0.8rem, 1.6vh, 1rem)',
                  borderColor: isEditing ? undefined : theme.colors.text,
                  borderWidth: isEditing ? undefined : '1.5px',
                  backgroundColor: isEditing ? undefined : theme.colors.background
                }}
              />
            </div>
          </div>

          {/* Save Button with Dynamic Sizing */}
          <div
            className={`flex justify-center transition-all duration-200 ${isEditing ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            style={{
              marginTop: 'clamp(0.5rem, 1.5vh, 1rem)',
              height: isEditing ? 'auto' : '0',
              overflow: isEditing ? 'visible' : 'hidden'
            }}
          >
            <div
              style={{
                height: 'clamp(2.5rem, 5vh, 4rem)',
                width: 'clamp(18rem, 35vw, 25rem)',
                fontSize: 'clamp(0.875rem, 1.75vh, 1.125rem)'
              }}
            >
              <Button
                onClick={handleSave}
                disabled={saving}
                variant="primary400"
                size="xl"
                fullRounded={false}
                className="!h-full !w-full !text-[length:inherit]"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}