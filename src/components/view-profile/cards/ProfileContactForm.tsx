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
    <div className="p-4 pr-0 sm:pr-4 flex flex-col gap-4 -mb-6">
      {/* Mobile Layout */}
      <div className="flex sm:hidden flex-col gap-4 items-center">
        {profilePictureUrl ? (
          <img
            src={profilePictureUrl}
            alt={name}
            className="w-28 h-28 rounded-[10px] object-cover"
          />
        ) : (
          <div className="w-28 h-28 bg-gray-neutral200 rounded-[10px] flex items-center justify-center text-gray-neutral500">
            No Image
          </div>
        )}
        
        <div className="flex items-center justify-between w-full gap-2">
          <div className="flex-1">
            <p className="font-alexandria font-medium text-xl">{name}</p>
            {gender && age && (
              <p className="text-primary-primary400 text-base mt-1">{gender} • {age} years old</p>
            )}
          </div>
          <Image
            src={ChatIcon}
            alt="Chat"
            width={32}
            height={32}
            className="cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0"
          />
        </div>
      </div>

      {/* Desktop Layout - Horizontal */}
      <div className="hidden sm:flex items-center gap-4">
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
          <p className="font-alexandria font-medium body">{name}</p>
          {gender && age && (
            <p className="text-primary-primary400 tiny">{gender} • {age} years old</p>
          )}
        </div>
        <Image
          src={ChatIcon}
          alt="Chat"
          width={24}
          height={24}
          className="cursor-pointer hover:opacity-80 transition-opacity"
        />
      </div>
      
      {/* Contact Information - Larger on Mobile */}
      <div className="flex flex-col gap-5 sm:gap-3 w-full">
        {/* Email */}
        <div className="flex items-center gap-3">
          <HiOutlineMail className="w-7 h-7 sm:w-5 sm:h-5 text-gray-neutral500 flex-shrink-0" />
          <span className="flex gap-4 flex-1">
            <span className="font-medium text-base sm:text-tiny text-gray-neutral500 w-24 sm:w-16 flex-shrink-0">Email:</span>
            <span className="font-normal text-sm sm:text-tiny text-gray-neutral400 break-all">{email}</span>
          </span>
        </div>
        {/* Phone */}
        {phoneNumber && (
          <div className="flex items-center gap-3">
            <HiOutlinePhone className="w-7 h-7 sm:w-5 sm:h-5 text-gray-neutral500 flex-shrink-0" />
            <span className="flex gap-4 flex-1">
              <span className="font-semibold text-base sm:text-tiny text-gray-neutral500 w-24 sm:w-16 flex-shrink-0">Phone:</span>
              <span className="font-normal text-sm sm:text-tiny text-gray-neutral400">{phoneNumber}</span>
            </span>
          </div>
        )}
        {/* Address */}
        {address && (
          <div className="flex items-center gap-3">
            <HiOutlineLocationMarker className="w-7 h-7 sm:w-5 sm:h-5 text-gray-neutral500 flex-shrink-0" />
            <span className="flex gap-4 flex-1">
              <span className="font-semibold text-base sm:text-tiny text-gray-neutral500 w-24 sm:w-16 flex-shrink-0">Address:</span>
              <span className="font-normal text-sm sm:text-tiny text-gray-neutral400">{address}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}