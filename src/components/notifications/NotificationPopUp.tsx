'use client';

import React, { useState } from "react";
import NotificationCard from "./NotificationCard";
import { Notification } from "@/lib/models/notification"
import { NotificationType } from "@/lib/constants/notification-types";
import { HiBell } from "react-icons/hi";
import Button from "@/components/ui/Button";

const NotificationPopUp: React.FC = () => {
  const [showAll, setShowAll] = useState(false);

  const notifications: Notification[] = [
    { notificationId: 1, name: "John Doe", type: NotificationType.NEW_MESSAGE, message: "sent you a message", time: "2m ago", isRead: false },
    { notificationId: 2, name: "Jane Smith", type: NotificationType.JOB_APPLICATION, message: "applied to your job post", time: "10m ago", isRead: true },
    { notificationId: 3, name: "Alex Johnson", type: NotificationType.APPLICATION_ACCEPTED, message: "accepted your application", time: "30m ago", isRead: false },
    { notificationId: 4, name: "Chris Brown", type: NotificationType.NEW_MESSAGE, message: "sent you a message", time: "1h ago", isRead: true },
    { notificationId: 5, name: "Emily Davis", type: NotificationType.JOB_APPLICATION, message: "applied to your job post", time: "2h ago", isRead: false },
    { notificationId: 6, name: "Michael Wilson", type: NotificationType.APPLICATION_ACCEPTED, message: "accepted your application", time: "5h ago", isRead: true },
    { notificationId: 7, name: "Sarah Lee", type: NotificationType.NEW_MESSAGE, message: "sent you a message", time: "1d ago", isRead: false },
  ];

  const displayedNotifications = showAll ? notifications : notifications.slice(0, 6);

  return (
    <div className="fixed right-4 top-16 w-[500px] max-w-[calc(100vw-2rem)] bg-white shadow-lg rounded-2xl border border-gray-200 z-50 overflow-hidden">
      <div className="p-3 border-b border-gray-200 flex items-center justify-center gap-2">
        <HiBell className="w-5 h-5 text-gray-700" />
        <span className="font-semibold text-gray-700">Notifications</span>
      </div>
      <div className={`overflow-y-auto overflow-x-hidden ${showAll ? 'max-h-[30.75rem]' : 'max-h-fit'}`}>
        {displayedNotifications.map((notif) => (
          <NotificationCard key={notif.notificationId} notif={notif} />
        ))}
      </div>

      {notifications.length > 6 && !showAll && (
        <div className="p-3 border-t border-gray-200">
          <Button
            variant="neutral300"
            size="tiny"
            onClick={() => setShowAll(true)}
            className="w-full"
          >
            See previous notifications
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotificationPopUp;