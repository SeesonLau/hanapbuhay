'use client';

import React from "react";
import { HiOutlineUser } from "react-icons/hi";
import { Notification } from "@/lib/models/notification";

interface NotificationCardProps {
  notif: Notification;
  onClick?: () => void;
}

export default function NotificationCard({ notif, onClick }: NotificationCardProps) {
  return (
    <div
      onClick={onClick}
      className={`mx-2 my-2 cursor-pointer flex items-center transition-all duration-200
        h-[60px] gap-5 px-5 py-2.5
        bg-white hover:bg-gray-neutral100 active:bg-gray-neutral200
        rounded-lg hover:rounded-2xl`}
    >
      <div className={`w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full 
        ${notif.isRead ? "bg-gray-neutral200" : "bg-blue-500"}`}>
        <HiOutlineUser className={`w-6 h-6 ${notif.isRead ? "text-gray-neutral500" : "text-white"}`} />
      </div>

      <div className="flex-1 min-w-0">
        <p className={`font-inter mini truncate ${notif.isRead ? "font-normal" : "font-semibold"}`}>
          <span className="font-inter font-semibold mini">{notif.name}</span> {notif.message}
        </p>
      </div>

      <div className={`flex-shrink-0 text-xs ${notif.isRead ? "text-gray-neutral400" : "text-blue-600 font-medium"}`}>
        {notif.time}
      </div>

      {!notif.isRead && (
        <div className="w-2.5 h-2.5 rounded-full bg-blue-600 flex-shrink-0"></div>
      )}
    </div>
  );
}