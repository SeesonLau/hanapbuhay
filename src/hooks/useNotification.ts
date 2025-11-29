// hooks/useNotifications.ts
"use client";

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { NotificationService } from '@/lib/services/notifications-services';
import { Notification } from '@/lib/models/notification';
import { NotificationType } from '@/lib/constants/notification-types';
import { supabase } from '@/lib/services/supabase/client';

interface UseNotificationsOptions {
  skip?: boolean;
  pageSize?: number;
  type?: NotificationType | NotificationType[];
  isRead?: boolean;
  autoRefresh?: boolean; // Enable real-time updates
}

interface NotificationWithActor extends Notification {
  actorName?: string;
  actorAvatar?: string;
}

export function useNotifications(
  userId?: string | null,
  options: UseNotificationsOptions = {}
) {
  const [notifications, setNotifications] = useState<NotificationWithActor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Fetch actor details (the person who created the notification)
  const fetchActorDetails = useCallback(async (createdBy: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('name, profilePictureUrl')
        .eq('userId', createdBy)
        .maybeSingle();

      if (error || !data) {
        return { actorName: 'Someone', actorAvatar: undefined };
      }

      // Parse the name: split by " | " and take only the first word of the first name
      let displayName = 'Someone';
      if (data.name) {
        const parts = data.name.split(' | '); // Split by delimiter
        const firstName = parts[0] || ''; // Get first name part
        const firstWord = firstName.trim().split(' ')[0]; // Get first word only
        displayName = firstWord || 'Someone';
      }

      return {
        actorName: displayName,
        actorAvatar: data.profilePictureUrl || undefined
      };
    } catch (err) {
      console.error('Failed to fetch actor details:', err);
      return { actorName: 'Someone', actorAvatar: undefined };
    }
  }, []);

  // Load notifications
  const load = useCallback(async (page: number = 1) => {
    if (!userId) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    console.log('Loading notifications for userId:', userId, 'page:', page);
    setLoading(true);
    setError(null);

    try {
      // Fetch notifications using NotificationService
      const result = await NotificationService.getNotificationsByUserId(userId, {
        page,
        pageSize: options.pageSize ?? 20,
        type: options.type,
        isRead: options.isRead,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });

      console.log('Fetched notifications:', result.notifications.length, 'hasMore:', result.hasMore);

      // Fetch actor details for each notification
      const notificationsWithActors = await Promise.all(
        result.notifications.map(async (notif) => {
          const actorDetails = await fetchActorDetails(notif.createdBy);
          return {
            ...notif,
            ...actorDetails
          };
        })
      );

      // If loading page 1, replace; otherwise append
      if (page === 1) {
        setNotifications(notificationsWithActors);
      } else {
        setNotifications(prev => [...prev, ...notificationsWithActors]);
      }

      setHasMore(result.hasMore);
      setCurrentPage(page);

      // Fetch unread count using NotificationService
      const count = await NotificationService.getUnreadCount(userId);
      console.log('Unread count:', count);
      setUnreadCount(count);
    } catch (err) {
      console.error('Failed to load notifications', err);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, [userId, options.pageSize, options.type, options.isRead, fetchActorDetails]);

  // Initial load
  useEffect(() => {
    if (options.skip) return;
    load(1);
  }, [load, options.skip]);

  // Real-time subscription
  useEffect(() => {
    if (!userId || !options.autoRefresh) return;

    console.log('Setting up real-time notification subscription for user:', userId);

    // Subscribe to new notifications using NotificationService
    const unsubscribeNew = NotificationService.subscribeToNotifications(
      userId,
      async (newNotification) => {
        console.log('New notification received:', newNotification);
        
        // Fetch actor details for the new notification
        const actorDetails = await fetchActorDetails(newNotification.createdBy);
        const notificationWithActor = {
          ...newNotification,
          ...actorDetails
        };

        // Add to the beginning of the list
        setNotifications(prev => [notificationWithActor, ...prev]);
        
        // Update unread count
        if (!newNotification.isRead) {
          setUnreadCount(prev => prev + 1);
        }

        // Show toast notification
        toast.success(`New notification from ${actorDetails.actorName}`);
      }
    );

    // Subscribe to notification updates using NotificationService
    const unsubscribeUpdates = NotificationService.subscribeToNotificationUpdates(
      userId,
      (updatedNotification) => {
        console.log('Notification updated:', updatedNotification);
        
        // Update the notification in the list
        setNotifications(prev =>
          prev.map(notif =>
            notif.notificationId === updatedNotification.notificationId
              ? { ...notif, ...updatedNotification }
              : notif
          )
        );

        // Recalculate unread count
        NotificationService.getUnreadCount(userId).then(setUnreadCount);
      }
    );

    return () => {
      console.log('Cleaning up notification subscriptions');
      unsubscribeNew();
      unsubscribeUpdates();
    };
  }, [userId, options.autoRefresh, fetchActorDetails]);

  // Mark single notification as read using NotificationService
  const markAsRead = useCallback(async (notificationId: string) => {
    if (!userId) return;

    try {
      await NotificationService.markAsRead(notificationId, userId);
      
      // Update local state
      setNotifications(prev =>
        prev.map(notif =>
          notif.notificationId === notificationId
            ? { ...notif, isRead: true }
            : notif
        )
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, [userId]);

  // Mark all notifications as read using NotificationService
  const markAllAsRead = useCallback(async () => {
    if (!userId) return;

    try {
      await NotificationService.markAllAsRead(userId);
      
      // Update local state
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, isRead: true }))
      );
      
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  }, [userId]);

  // Delete notification using NotificationService
  const deleteNotification = useCallback(async (notificationId: string) => {
    if (!userId) return;

    try {
      await NotificationService.deleteNotification(notificationId, userId);
      
      // Remove from local state
      setNotifications(prev =>
        prev.filter(notif => notif.notificationId !== notificationId)
      );
      
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }, [userId]);

  // Load more notifications (pagination)
  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    await load(currentPage + 1);
  }, [hasMore, loading, currentPage, load]);

  return {
    notifications,
    loading,
    error,
    unreadCount,
    hasMore,
    refresh: () => load(1),
    markAsRead,
    markAllAsRead,
    deleteNotification,
    loadMore
  };
}

export default useNotifications;