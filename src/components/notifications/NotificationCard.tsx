'use client';

import React from "react";
import { HiOutlineBriefcase, HiOutlineCheckCircle, HiOutlineChatAlt2, HiOutlineUser } from "react-icons/hi";
import { Notification } from "@/lib/models/notification";
import { NotificationType } from "@/lib/constants/notification-types";

interface NotificationCardProps {
  notif: Notification;
  actorName?: string;      // Fetched using createdBy
  actorAvatar?: string;    // Fetched using createdBy
  onClick?: () => void;
}

function getTimeAgo(date: string): string {
  const now = new Date();
  const notifDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - notifDate.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return notifDate.toLocaleDateString();
}

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case NotificationType.JOB_APPLICATION:
      return HiOutlineBriefcase;
    case NotificationType.APPLICATION_ACCEPTED:
      return HiOutlineCheckCircle;
    case NotificationType.NEW_MESSAGE:
      return HiOutlineChatAlt2;
    default:
      return HiOutlineUser;
  }
}

function getColorScheme(type: NotificationType, isRead: boolean) {
  if (isRead) {
    return { bg: "bg-gray-200", icon: "text-gray-500", badge: "bg-gray-600" };
  }

  switch (type) {
    case NotificationType.JOB_APPLICATION:
      return { bg: "bg-blue-500", icon: "text-white", badge: "bg-blue-600" };
    case NotificationType.APPLICATION_ACCEPTED:
      return { bg: "bg-green-500", icon: "text-white", badge: "bg-green-600" };
    case NotificationType.NEW_MESSAGE:
      return { bg: "bg-purple-500", icon: "text-white", badge: "bg-purple-600" };
    default:
      return { bg: "bg-blue-500", icon: "text-white", badge: "bg-blue-600" };
  }
}

export default function NotificationCard({ 
  notif, 
  actorName, 
  actorAvatar, 
  onClick 
}: NotificationCardProps) {
  const timeAgo = getTimeAgo(notif.createdAt);
  const Icon = getNotificationIcon(notif.type);
  const colors = getColorScheme(notif.type, notif.isRead);

  return (
    <div
      onClick={onClick}
      className={`mx-2 my-2 cursor-pointer flex items-center transition-all duration-200
        min-h-[60px] gap-4 px-4 py-3
        bg-white hover:bg-gray-50 active:bg-gray-100
        rounded-lg hover:rounded-2xl border border-gray-200
        ${!notif.isRead ? 'bg-blue-50/30' : ''}`}
    >
      {/* Icon/Avatar */}
      <div className={`w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full ${colors.bg}`}>
        {actorAvatar ? (
          <img 
            src={actorAvatar} 
            alt={actorName || 'User'} 
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <Icon className={`w-6 h-6 ${colors.icon}`} />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-small truncate ${notif.isRead ? "text-gray-neutral600" : "text-gray-neutral900"}`}>
          {actorName && (
            <span className="font-semibold">{actorName} </span>
          )}
          {notif.message}
        </p>
      </div>

      {/* Time */}
      <div className={`flex-shrink-0 text-xs whitespace-nowrap text-mini ${
        notif.isRead ? "text-gray-400" : "text-blue-600 font-medium"
      }`}>
        {timeAgo}
      </div>

      {/* Unread indicator dot */}
      {!notif.isRead && (
        <div className={`w-2 h-2 rounded-full ${colors.badge} flex-shrink-0`} />
      )}
    </div>
  );
}