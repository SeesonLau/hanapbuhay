'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NotificationCard from "./NotificationCard";
import { Notification } from "@/lib/models/notification";
import { useNotifications } from "@/hooks/useNotification";
import { AuthService } from "@/lib/services/auth-services";
import { getNotificationRoute } from "@/lib/utils/notification-router";
import { HiBell } from "react-icons/hi";
import Button from "@/components/ui/Button";

interface NotificationPopUpProps {
  isScrolled?: boolean;
}

const NotificationPopUp: React.FC<NotificationPopUpProps> = ({ isScrolled = false }) => {
  const router = useRouter();
  const [showAll, setShowAll] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setUserLoading(true);
        const currentUser = await AuthService.getCurrentUser();
        if (currentUser) {
          setUserId(currentUser.id);
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      } finally {
        setUserLoading(false);
      }
    };

    fetchUser();
  }, []);

  const {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
  } = useNotifications(userId, {
    skip: userLoading || !userId, 
    autoRefresh: true, 
    pageSize: showAll ? 50 : 6,
  });

  const handleNotificationClick = async (notif: Notification & { actorName?: string; actorAvatar?: string }) => {
    try {
      if (!userId) return;

      if (!notif.isRead) {
        await markAsRead(notif.notificationId);
      }

      const route = getNotificationRoute(notif);
      router.push(route);
      
    } catch (error) {
      console.error('Error handling notification click:', error);
    }
  };

  const displayedNotifications = showAll ? notifications : notifications.slice(0, 6);

  return (
    <div 
      className={`fixed right-4 w-[500px] max-w-[calc(100vw-2rem)] bg-white shadow-lg rounded-2xl border border-gray-200 z-50 overflow-hidden transition-all duration-300 ${
        isScrolled ? 'top-14' : 'top-16'
      }`}
      style={{
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)'
      }}
    >
      {/* Header */}
      <div className="p-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HiBell className="w-5 h-5 text-gray-neutral700" />
          <span className="font-bold text-gray-neutral700 text-lead">
            Notifications
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs font-medium text-white bg-blue-600 rounded-full">
                {unreadCount}
              </span>
            )}
          </span>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            Mark all read
          </button>
        )}
      </div>
      
      {/* Notifications List */}
      <div className={`overflow-y-auto overflow-x-hidden ${showAll ? 'max-h-[30.75rem]' : 'max-h-fit'}`}>
        {(userLoading || loading) && notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-neutral500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-sm">Loading notifications...</p>
          </div>
        ) : !userId ? (
          <div className="p-8 text-center text-gray-neutral500">
            <p className="text-sm">Please log in to view notifications</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-neutral500">
            <HiBell className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No notifications yet</p>
          </div>
        ) : (
          displayedNotifications.map((notif) => (
            <NotificationCard 
              key={notif.notificationId} 
              notif={notif}
              actorName={notif.actorName}
              actorAvatar={notif.actorAvatar}
              onClick={() => handleNotificationClick(notif)}
            />
          ))
        )}
      </div>

      {/* Show More Button */}
      {notifications.length > 6 && !showAll && (
        <div className="p-3 border-t border-gray-200">
          <Button
            variant="neutral300"
            size="tiny"
            onClick={() => setShowAll(true)}
            className="w-full"
          >
            See previous notifications ({notifications.length - 6} more)
          </Button>
        </div>
      )}

      {/* View All Link */}
      {showAll && (
        <div className="p-3 border-t border-gray-200 text-center">
          <button
            onClick={() => router.push('/notifications')}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View all notifications
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationPopUp;