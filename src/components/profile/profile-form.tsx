'use client';

import { useEffect, useState } from "react";
import { Profile } from "@/lib/models/profile";
import { ProfileService } from "@/lib/services/profile-services";

interface ProfileFormProps {
  userId: string;
}

export default function ProfileForm({ userId }: ProfileFormProps) {
  const [profile, setProfile] = useState<Profile & { email?: string | null } | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const fetchProfileAndEmail = async () => {
    try {
      const profileData = await ProfileService.getProfileByUserId(userId);
      const userEmail = await ProfileService.getEmailByUserId(userId);

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
    } catch (err) {
      console.error("Error loading profile or email:", err);
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
        uploadedUrl = await ProfileService.uploadProfileImage(userId, selectedFile);
      }

      const fullName = `${firstName} ${lastName}`.trim();
      await ProfileService.upsertProfile({ ...profile, name: fullName, profilePictureUrl: uploadedUrl });
      alert("Profile saved successfully!");
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-black">Loading profile...</p>;

  return (
    <div className="p-4 bg-white shadow rounded-lg w-1/2 text-black">
      <h2 className="text-lg font-semibold mb-4">Profile Information</h2>

      {/* Profile Picture Upload */}
      <label className="block mb-2">Profile Picture</label>
      {previewUrl && (
        <img src={previewUrl} alt="Profile" className="w-24 h-24 object-cover mb-2 rounded-full border" />
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="mb-4"
      />

      {/* First Name */}
      <label className="block mb-1">First Name</label>
      <input
        type="text"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        className="border p-2 w-full mb-2"
      />

      {/* Last Name */}
      <label className="block mb-1">Last Name</label>
      <input
        type="text"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        className="border p-2 w-full mb-2"
      />

      {/* Address */}
      <label className="block mb-1">Address</label>
      <input
        type="text"
        value={profile?.address ?? ""}
        onChange={(e) => handleChange("address", e.target.value)}
        className="border p-2 w-full mb-2"
      />

      {/* Email */}
      <label className="block mb-1">Email</label>
      <input
        type="email"
        value={email}
        readOnly
        className="border p-2 w-full mb-2 bg-gray-100"
      />

      {/* Phone Number */}
      <label className="block mb-1">Phone Number</label>
      <input
        type="tel"
        value={profile?.phoneNumber ?? ""}
        onChange={(e) => handleChange("phoneNumber", e.target.value)}
        className="border p-2 w-full mb-2"
      />

      {/* Birthdate */}
      <label className="block mb-1">Birthdate</label>
      <input
        type="date"
        value={profile?.birthdate ?? ""}
        onChange={(e) => handleBirthdateChange(e.target.value)}
        className="border p-2 w-full mb-2"
      />

      {/* Age  */}
      <label className="block mb-1">Age</label>
      <input
        type="number"
        value={profile?.age ?? ""}
        readOnly
        className="border p-2 w-full mb-2 bg-gray-100"
      />

      {/* Sex */}
      <label className="block mb-1">Sex</label>
      <select
        value={profile?.sex ?? ""}
        onChange={(e) => handleChange("sex", e.target.value)}
        className="border p-2 w-full mb-4"
      >
        <option value="">Select Sex</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
