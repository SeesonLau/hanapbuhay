'use client';

import { useEffect, useState } from "react";
import { Profile } from "@/lib/models/profile";
import { ProfileService } from "@/lib/services/profile-services";
import { combineToStoredName } from "@/lib/utils/profile-utils";
import upload2 from "@/assets/upload2.svg";
import { FaUserCircle } from 'react-icons/fa';
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
      } catch (err) {
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
      }
    } catch (err) {
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`${className} py-7 px-10 bg-white rounded-xl shadow-md flex flex-col gap-6`}>

      {/* Profile Picture Upload */}
      <div className="flex items-center justify-center gap-6">
        <div className="relative flex-shrink-0">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Profile"
              className="w-24 h-24 object-cover rounded-full border"
            />
          ) : (
            <div className="w-24 h-24 flex items-center justify-center rounded-full bg-gray-neutral100">
              <FaUserCircle className="w-24 h-24 text-gray-neutral400" />
            </div>
          )}
          
          {/* Edit / Upload Icon */}
          <label className="absolute bottom-0 -right-5 p-2 rounded-full cursor-pointer flex items-center justify-center">
            <img src={upload2.src} alt="Upload" className="w-5 h-5 " />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
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
        />

        <TextBox
          label="Last Name"
          placeholder="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          width="100%"
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
        />

        <TextBox
          label="Birthdate"
          type="date"
          value={profile?.birthdate ?? ''}
          onChange={(e) => handleBirthdateChange(e.target.value)}
          width="100%"
        />
      </div>

      {/* Age */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <TextBox
          label="Age"
          type="number"
          value={profile?.age ?? ''}
          readOnly
          width="100%"
          disabled
        />

        {/* Sex */}
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
        />
      </div>
        
      {/* Save Button */}
      <div className="flex justify-center">
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