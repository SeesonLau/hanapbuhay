'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NotificationCard from "./NotificationCard";
import { Notification } from "@/lib/models/notification";
import { NotificationService } from "@/lib/services/notifications-services";
import { AuthService } from "@/lib/services/auth-services";
import { getNotificationRoute } from "@/lib/utils/notification-router";
import { HiBell } from "react-icons/hi";
import Button from "@/components/ui/Button";

interface NotificationPopUpProps {
  isScrolled?: boolean;
}

interface EnrichedNotification extends Notification {
  actorName?: string;
  actorAvatar?: string;
}

const NotificationPopUp: React.FC<NotificationPopUpProps> = ({ isScrolled = false }) => {
  const router = useRouter();
  const [showAll, setShowAll] = useState(false);
  const [notifications, setNotifications] = useState<EnrichedNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Fetch current user and notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        
        // Get current user
        const currentUser = await AuthService.getCurrentUser();
        if (!currentUser) {
          setLoading(false);
          return;
        }
        
        setUserId(currentUser.id);

        // Fetch notifications
        const { notifications: fetchedNotifications } = await NotificationService.getNotificationsByUserId(
          currentUser.id,
          {
            page: 1,
            pageSize: showAll ? 50 : 6,
            sortBy: 'createdAt',
            sortOrder: 'desc',
          }
        );

        // Enrich notifications with actor data
        const enrichedNotifications = await enrichWithActorData(fetchedNotifications);
        setNotifications(enrichedNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [showAll]);

  // Enrich notifications with actor information
  const enrichWithActorData = async (notifs: Notification[]): Promise<EnrichedNotification[]> => {
    // Get unique actor IDs
    const actorIds = [...new Set(notifs.map(n => n.createdBy))];
    
    // TODO: Replace with your actual user service
    // const actors = await UserService.getUsersByIds(actorIds);
    // const actorMap = new Map(actors.map(a => [a.id, a]));

    // For now, return without enrichment
    // In production, you'd fetch user data and map it
    return notifs.map(notif => ({
      ...notif,
      // actorName: actorMap.get(notif.createdBy)?.name,
      // actorAvatar: actorMap.get(notif.createdBy)?.avatar,
    }));
  };

  // Subscribe to real-time notifications
  useEffect(() => {
    if (!userId) return;

    const unsubscribe = NotificationService.subscribeToNotifications(
      userId,
      async (newNotification) => {
        // Enrich the new notification
        const enriched = await enrichWithActorData([newNotification]);
        
        // Add new notification to the top of the list
        setNotifications((prev) => [enriched[0], ...prev]);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [userId]);

  // Handle notification click
  const handleNotificationClick = async (notif: Notification) => {
    try {
      if (!userId) return;

      // Mark as read if unread
      if (!notif.isRead) {
        await NotificationService.markAsRead(notif.notificationId, userId);
        
        // Update local state
        setNotifications((prev) =>
          prev.map((n) =>
            n.notificationId === notif.notificationId
              ? { ...n, isRead: true }
              : n
          )
        );
      }

      // Navigate to related page using relatedId
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
      <div className="p-3 border-b border-gray-200 flex items-center justify-center gap-2">
        <HiBell className="w-5 h-5 text-gray-700" />
        <span className="font-semibold text-gray-700">Notifications</span>
      </div>
      
      <div className={`overflow-y-auto overflow-x-hidden ${showAll ? 'max-h-[30.75rem]' : 'max-h-fit'}`}>
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-sm">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
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
    </div>
  );
};

export default NotificationPopUp;