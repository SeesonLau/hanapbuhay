"use client";

import ProfileContactForm from "./cards/ProfileContactForm";

export default function ProfileContactSection() {
  const profile = {
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
