"use client";

import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from "react-icons/hi";
import Image from "next/image";
import ChatIcon from "@/assets/chat.svg"

interface ProfileContactFormProps {
  userId: string;
  profilePictureUrl?: string;
  name: string;
  gender: string;
  age: number;
  email: string;
  phoneNumber: string;
  address: string;
}

export default function ProfileContactForm({
  userId = "1",
  profilePictureUrl,
  name,
  gender,
  age,
  email,
  phoneNumber,
  address,
}: ProfileContactFormProps) {
  return (
    <div className="p-4 flex flex-col gap-4 -mb-6">
      <div className="flex items-center gap-4">
        {profilePictureUrl ? (
          <img
            src={profilePictureUrl}
            alt={name}
            className="w-20 h-20 rounded-[10px] object-cover"
          />
        ) : (
          <div className="w-20 h-20 bg-gray-neutral200 rounded-[10px] flex items-center justify-center text-gray-neutral500">
            No Image
          </div>
        )}
        <div>
          <p className="font-alexandria font-medium description">{name}</p>
          {gender && age && (
            <p className="text-primary-primary400 tiny">{gender} • {age} years old</p>
          )}
        </div>
        {/* Chat */}
        <Image
          src={ChatIcon}
          alt="Chat"
          width={24}
          height={24}
          className="cursor-pointer hover:opacity-80 transition-opacity"
        />
      </div>
      
      <div className="flex flex-col gap-3">
        {/* Email */}
        <div className="flex items-center gap-2">
          <HiOutlineMail className="w-5 h-5 text-gray-neutral500 flex-shrink-0" />
          <span className="flex gap-4">
            <span className="font-medium text-tiny text-gray-neutral500 w-16 flex-shrink-0">Email:</span>
            <span className="font-normal text-tiny text-gray-neutral400">{email}</span>
          </span>
        </div>

        {/* Phone */}
        {phoneNumber && (
          <div className="flex items-center gap-2">
            <HiOutlinePhone className="w-5 h-5 text-gray-neutral500 flex-shrink-0" />
            <span className="flex gap-4">
              <span className="font-semibold text-tiny text-gray-neutral500 w-16 flex-shrink-0">Phone:</span>
              <span className="font-normal text-tiny text-gray-neutral400">{phoneNumber}</span>
            </span>
          </div>
        )}

        {/* Address */}
        {address && (
          <div className="flex items-center gap-2">
            <HiOutlineLocationMarker className="w-5 h-5 text-gray-neutral500 flex-shrink-0" />
            <span className="flex gap-4">
              <span className="font-semibold text-tiny text-gray-neutral500 w-16 flex-shrink-0">Address:</span>
              <span className="font-normal text-tiny text-gray-neutral400">{address}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}