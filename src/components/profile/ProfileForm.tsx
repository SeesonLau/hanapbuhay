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

interface ProfileFormProps {
  userId: string;
  className?: string;
}

export default function ProfileForm({ userId, className }: ProfileFormProps) {

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

      // Combine location into a single address string (format: "province | city | specificaddress")
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

  if (loading) return <div>Loading...</div>;

  return (
    <div className={`${className} relative h-full py-3 max-[425px]:py-2 md:py-6 lg:py-8 px-3 max-[425px]:px-2 md:px-10 lg:px-12 bg-white rounded-xl shadow-md flex flex-col gap-2.5 max-[425px]:gap-2 md:gap-5 overflow-y-auto`}>

      {/* Edit Icon */}
      <button
        onClick={() => setIsEditing(!isEditing)}
        className="absolute top-3 right-3 max-[425px]:top-2 max-[425px]:right-2 p-1.5 max-[425px]:p-1 rounded-full hover:bg-gray-neutral100 transition z-10"
      >
        <Edit3 size={18} className="text-gray-neutral600 max-[425px]:w-3.5 max-[425px]:h-3.5" />
      </button>

      {/* Profile Picture Upload */}
      <div className="flex items-center justify-center gap-3 max-[425px]:gap-2">
        <div 
          className={`relative flex-shrink-0 group ${isEditing ? 'cursor-pointer' : ''}`}
          onClick={handleProfilePictureClick}
        >
          {previewUrl ? (
            <>
              <img
                src={previewUrl}
                alt="Profile"
                className={`w-20 h-20 max-[425px]:w-12 max-[425px]:h-12 object-cover rounded-full border ${isEditing ? 'group-hover:brightness-75 transition-all duration-200' : ''}`}
              />
              {isEditing && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Camera className="w-8 h-8 max-[425px]:w-5 max-[425px]:h-5 text-white drop-shadow-lg" />
                </div>
              )}
            </>
          ) : (
            <div className={`w-20 h-20 max-[425px]:w-12 max-[425px]:h-12 flex items-center justify-center rounded-full bg-gray-neutral100 relative ${isEditing ? 'group-hover:bg-gray-neutral200 transition' : ''}`}>
              <FaUserCircle className="w-20 h-20 max-[425px]:w-12 max-[425px]:h-12 text-gray-neutral400" />
              {isEditing && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Camera className="w-8 h-8 max-[425px]:w-5 max-[425px]:h-5 text-gray-neutral600" />
                </div>
              )}
            </div>
          )}
          
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {displayName && (
          <div className="flex flex-col gap-0.5 max-[425px]:gap-0">
            <p className="font-alexandria font-bold text-gray-neutral700 text-body max-[425px]:text-sm">
              {displayName}
            </p>
            <p className="font-alexandria text-gray-neutral400 text-xs max-[425px]:text-[10px] max-[425px]:leading-tight">
              {email}
            </p>
          </div>
        )}
      </div>

      {/* First & Last Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-[425px]:gap-2 md:gap-10">
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

      {/* Phone Number & Birthdate */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-[425px]:gap-2 md:gap-10">
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
        />
      </div>

      {/* Age & Sex */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-[425px]:gap-2 md:gap-10">
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

      {/* Address Section*/}
      <div>
        <div className="text-small max-[425px]:text-xs font-semibold mb-1.5 max-[425px]:mb-1 text-gray-neutral900">Address</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 max-[425px]:gap-2">
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
          />
          <SelectBox 
            options={getCitiesByProvince(province).map((city_name) => ({ value: city_name, label: city_name }))}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Select city or municipality"
            disabled={!isEditing || !province}
            width="100%"
          />
          <TextBox 
            placeholder="Specific address" 
            value={streetAddress}
            onChange={(e) => setStreetAddress(e.target.value)}
            maxLength={50}
            width="100%"
            readOnly={!isEditing}
            disabled={!isEditing}
          />
        </div>
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