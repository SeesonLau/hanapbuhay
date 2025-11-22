'use client';

import { useEffect, useState } from "react";
import { Profile } from "@/lib/models/profile";
import { ProfileService } from "@/lib/services/profile-services";
import { combineToStoredName } from "@/lib/utils/profile-utils";
import { FaUserCircle } from 'react-icons/fa';
import { Edit3 } from 'lucide-react';
import TextBox from "../ui/TextBox";
import SelectBox from "../ui/SelectBox";
import Button from "../ui/Button";

interface ProfileFormProps {
  userId: string;
  className?: string;
}

export default function ProfileForm({ userId, className }: ProfileFormProps) {
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
      document.getElementById('profile-picture-input')?.click();
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

      const storedName = combineToStoredName(firstName, lastName);
      const success = await ProfileService.upsertProfile({ 
        ...profile, 
        name: storedName, 
        profilePictureUrl: uploadedUrl 
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

  if (loading) return <div>Loading...</div>;

  return (
    <div className={`${className} relative py-6 px-10 bg-white rounded-xl shadow-md flex flex-col gap-5`}>

      {/* Edit Icon */}
      <button
        onClick={() => setIsEditing(!isEditing)}
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-neutral100 transition"
      >
        <Edit3 size={20} className="text-gray-neutral600" />
      </button>

      {/* Profile Picture Upload */}
      <div className="flex items-center justify-center gap-6">
        <div 
          className={`relative flex-shrink-0 ${isEditing ? 'cursor-pointer' : ''}`}
          onClick={handleProfilePictureClick}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Profile"
              className={`w-24 h-24 object-cover rounded-full border ${isEditing ? 'hover:opacity-80 transition' : ''}`}
            />
          ) : (
            <div className={`w-24 h-24 flex items-center justify-center rounded-full bg-gray-neutral100 ${isEditing ? 'hover:bg-gray-neutral200 transition' : ''}`}>
              <FaUserCircle className="w-24 h-24 text-gray-neutral400" />
            </div>
          )}
          
          {/* Hidden file input */}
          <input
            id="profile-picture-input"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {displayName && (
          <div className="flex flex-col gap-1">
            <p className="font-alexandria font-bold text-gray-neutral700 text-lead">
              {displayName}
            </p>
            <p className="font-alexandria text-gray-neutral400 text-body">
              {email}
            </p>
          </div>
        )}
      </div>

      {/* First & Last Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <TextBox
          label="First Name"
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          width="100%"
          readOnly={!isEditing}
          disabled={!isEditing}
        />

        <TextBox
          label="Last Name"
          placeholder="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          width="100%"
          readOnly={!isEditing}
          disabled={!isEditing}
        />
      </div>

      {/* Address & Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <TextBox
          label="Address"
          placeholder="Address"
          value={profile?.address ?? ''}
          onChange={(e) => handleChange('address', e.target.value)}
          width="100%"
          readOnly={!isEditing}
          disabled={!isEditing}
        />

        <TextBox
          label="Email"
          type="email"
          value={email}
          readOnly
          width="100%"
          disabled
        />
      </div>

      {/* Phone Number & Birthdate */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <TextBox
          label="Phone Number"
          type="tel"
          placeholder="Enter your phone number"
          value={profile?.phoneNumber ?? ''}
          onChange={(e) => handleChange('phoneNumber', e.target.value)}
          width="100%"
          enableValidation={true}
          showSuccessIcon={true}
          readOnly={!isEditing}
          disabled={!isEditing}
        />

        <TextBox
          label="Birthdate"
          type="date"
          value={profile?.birthdate ?? ''}
          onChange={(e) => handleBirthdateChange(e.target.value)}
          width="100%"
          readOnly={!isEditing}
          disabled={!isEditing}
        />
      </div>

      {/* Age & Sex */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <TextBox
          label="Age"
          type="number"
          value={profile?.age ?? ''}
          readOnly
          width="100%"
          disabled
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
        />
      </div>
        
      {/* Save Button - Always rendered but only visible when editing */}
      <div className={`flex justify-center transition-opacity duration-200 ${isEditing ? 'opacity-100' : 'opacity-0 pointer-events-none h-0'}`}>
        <Button
          onClick={handleSave}
          disabled={saving}
          variant="primary400"
          size="xl"
          fullRounded={false}
        > 
          Save
        </Button>
      </div>
    </div>
  );
}