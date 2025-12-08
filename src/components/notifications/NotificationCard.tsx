'use client';

import React from "react";
import { HiOutlineBriefcase, HiOutlineCheckCircle, HiOutlineChatAlt2, HiOutlineUser } from "react-icons/hi";
import { Notification } from "@/lib/models/notification";
import { NotificationType } from "@/lib/constants/notification-types";
import { useTheme } from "@/hooks/useTheme";

interface NotificationCardProps {
  notif: Notification;
  actorName?: string;
  actorAvatar?: string;
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

function parseMessageWithItalic(message: string) {
  const parts = message.split(/(\*[^*]+\*)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      const text = part.slice(1, -1);
      return <em key={index} className="font-semibold">{text}</em>;
    }
    return <span key={index}>{part}</span>;
  });
}

export default function NotificationCard({ 
  notif, 
  actorName, 
  actorAvatar, 
  onClick 
}: NotificationCardProps) {
  const { theme } = useTheme();
  const timeAgo = getTimeAgo(notif.createdAt);
  const Icon = getNotificationIcon(notif.type);

  // Get color scheme based on notification type and read status
  const getIconBgColor = () => {
    if (notif.isRead) return theme.colors.borderLight;
    
    switch (notif.type) {
      case NotificationType.JOB_APPLICATION:
        return theme.colors.primary;
      case NotificationType.APPLICATION_ACCEPTED:
        return theme.colors.success;
      case NotificationType.NEW_MESSAGE:
        return theme.colors.secondary;
      default:
        return theme.colors.primary;
    }
  };

  const getBadgeColor = () => {
    switch (notif.type) {
      case NotificationType.JOB_APPLICATION:
        return theme.colors.primaryDark;
      case NotificationType.APPLICATION_ACCEPTED:
        return theme.colors.success;
      case NotificationType.NEW_MESSAGE:
        return theme.colors.secondaryHover;
      default:
        return theme.colors.primaryDark;
    }
  };

  return (
    <div
      onClick={onClick}
      className="mx-2 my-2 cursor-pointer flex items-center transition-all duration-200 min-h-[60px] gap-4 px-4 py-3 rounded-lg hover:rounded-2xl border"
      style={{
        backgroundColor: notif.isRead ? theme.colors.surface : theme.colors.pastelBgLight,
        borderColor: notif.isRead ? theme.colors.borderLight : theme.colors.pastelBorder,
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = notif.isRead 
          ? theme.colors.surfaceHover 
          : theme.colors.pastelBg;
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = notif.isRead 
          ? theme.colors.surface 
          : theme.colors.pastelBgLight;
      }}
    >
      {/* Icon/Avatar */}
      <div 
        className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full"
        style={{ backgroundColor: getIconBgColor() }}
      >
        {actorAvatar ? (
          <img 
            src={actorAvatar} 
            alt={actorName || 'User'} 
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <Icon 
            className="w-6 h-6" 
            style={{ color: notif.isRead ? theme.colors.textMuted : '#FFFFFF' }}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p 
          className="text-small truncate"
          style={{ color: notif.isRead ? theme.colors.textMuted : theme.colors.text }}
        >
          {actorName && (
            <span className="font-semibold">{actorName} </span>
          )}
          {parseMessageWithItalic(notif.message)}
        </p>
      </div>

      {/* Time */}
      <div 
        className="flex-shrink-0 text-xs whitespace-nowrap text-mini"
        style={{ 
          color: notif.isRead ? theme.colors.textMuted : theme.colors.primary,
          fontWeight: notif.isRead ? 'normal' : '500'
        }}
      >
        {timeAgo}
      </div>

      {/* Unread indicator dot */}
      {!notif.isRead && (
        <div 
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: getBadgeColor() }}
        />
      )}
    </div>
  );
}