'use client';

import { useEffect, useState } from "react";
import { Profile } from "@/lib/models/profile";
import { ProfileService } from "@/lib/services/profile-services";

interface ProfileFormProps {
  userId: string;
}

export default function ProfileForm({ userId }: ProfileFormProps) {
  const [profile, setProfile] = useState<(Profile & { email?: string | null }) | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await ProfileService.getProfileByUserId(userId);
        if (data) {
          setProfile(data);
          const [f, ...l] = (data.name ?? "").split(" ");
          setFirstName(f ?? "");
          setLastName(l.join(" ") ?? "");
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  const handleChange = (field: keyof Profile, value: any) => {
    setProfile((prev) => prev ? { ...prev, [field]: value } : prev);
  };

  const handleBirthdateChange = (value: string) => {
    const birthdate = new Date(value);
    const today = new Date();
    if (birthdate > today) return; // prevent future dates

    const age = today.getFullYear() - birthdate.getFullYear() -
      (today < new Date(today.getFullYear(), birthdate.getMonth(), birthdate.getDate()) ? 1 : 0);

    setProfile((prev) => prev ? { ...prev, birthdate: value, age } : prev);
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      const fullName = `${firstName} ${lastName}`.trim();
      await ProfileService.upsertProfile({ ...profile, name: fullName });
      alert("Profile saved successfully!");
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="p-4 bg-white shadow rounded-lg w-1/2">
      <h2 className="text-lg font-semibold mb-4">Profile Information</h2>

      {/* Profile Picture URL */}
      <input
        type="text"
        placeholder="Profile Picture URL"
        value={profile?.profilePictureUrl ?? ""}
        onChange={(e) => handleChange("profilePictureUrl", e.target.value)}
        className="border p-2 w-full mb-2"
      />

      {/* First Name */}
      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        className="border p-2 w-full mb-2"
      />

      {/* Last Name */}
      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        className="border p-2 w-full mb-2"
      />

      {/* Address */}
      <input
        type="text"
        placeholder="Address"
        value={profile?.address ?? ""}
        onChange={(e) => handleChange("address", e.target.value)}
        className="border p-2 w-full mb-2"
      />

      {/* Email (read-only) */}
      <input
        type="email"
        value={profile?.email ?? ""}
        readOnly
        className="border p-2 w-full mb-2 bg-gray-100"
      />

      {/* Phone Number */}
      <input
        type="tel"
        placeholder="Phone Number"
        value={profile?.phoneNumber ?? ""}
        onChange={(e) => handleChange("phoneNumber", e.target.value)}
        className="border p-2 w-full mb-2"
      />

      {/* Birthdate */}
      <input
        type="date"
        value={profile?.birthdate ?? ""}
        onChange={(e) => handleBirthdateChange(e.target.value)}
        className="border p-2 w-full mb-2"
      />

      {/* Age (read-only, calculated) */}
      <input
        type="number"
        value={profile?.age ?? ""}
        readOnly
        className="border p-2 w-full mb-2 bg-gray-100"
      />

      {/* Sex */}
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
