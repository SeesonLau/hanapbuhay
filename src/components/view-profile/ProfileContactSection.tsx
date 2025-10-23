"use client";

import ProfileContactForm from "./cards/ProfileContactForm";

interface Profile {
  userId: string;
  profilePictureUrl?: string;
  name: string;
  gender: string;
  age: number;
  email: string;
  phoneNumber: string;
  address: string;
}

export default function ProfileContactSection() {
  const profile: Profile = {
    userId: "1",
    profilePictureUrl: "",
    name: "John Doe",
    gender: "Male",
    age: 25,
    email: "sample@email.com",
    phoneNumber: "+123 456 7890",
    address: "123 Main St, City, Country",
  };

  return (
    <div className="p-4">
      <ProfileContactForm
        userId={profile.userId}
        profilePictureUrl={profile.profilePictureUrl}
        name={profile.name}
        gender={profile.gender}
        age={profile.age}
        email={profile.email}
        phoneNumber={profile.phoneNumber}
        address={profile.address}
      />
    </div>
  );
}