'use client';

import { useEffect, useState } from "react";
import { Profile } from "@/lib/models/profile";
import { ProfileService } from "@/lib/services/profile-services";
import { toast } from "react-hot-toast";
import { ProfileMessages } from "@/resources/messages/profile";
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
        const [profileData, userEmail, userName] = await Promise.all([
          ProfileService.getProfileByUserId(userId),
          ProfileService.getEmailByUserId(userId),
          ProfileService.getNameByUserId(userId)
        ]);

        if (profileData) {
          setProfile(profileData);
          const [f, ...l] = (profileData.name ?? "").split(" ");
          setFirstName(f ?? "");
          setLastName(l.join(" ") ?? "");
          setPreviewUrl(profileData.profilePictureUrl ?? null);
        }

        if (userEmail) {
          setEmail(userEmail); 
        }

        if (userName) {
          setDisplayName(userName);
        }
      } catch (err) {
        toast.error(ProfileMessages.LOAD_ERROR);
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

      const fullName = `${firstName} ${lastName}`.trim();
      const success = await ProfileService.upsertProfile({ ...profile, name: fullName, profilePictureUrl: uploadedUrl });
      
      if (success) {
        setDisplayName(fullName);
        toast.success(ProfileMessages.SAVE_SUCCESS);
      } else {
        toast.error(ProfileMessages.SAVE_ERROR);
      }
    } catch (err) {
      toast.error(ProfileMessages.SAVE_ERROR);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`${className}  py-7 px-10 bg-white rounded-xl shadow-md flex flex-col gap-6`}>

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
            <img src={upload2.src} alt="Upload" className="w-5 h-5" />
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
          isLoading={saving}
        > 
          Save
        </Button>
      </div>
    </div>
  );
}
