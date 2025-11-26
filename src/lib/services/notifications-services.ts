import { supabase } from './supabase/client';
import { Notification } from '../models/notification';
import { NotificationType } from '../constants/notification-types';
import { toast } from 'react-hot-toast';

interface NotificationParams {
  page: number;
  pageSize: number;
  type?: NotificationType | NotificationType[];
  isRead?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class NotificationService {
  /**
   * Fetches all notifications for a specific user with pagination and filtering.
   */
  static async getNotificationsByUserId(
    userId: string,
    params: NotificationParams
  ): Promise<{ notifications: Notification[]; hasMore: boolean }> {
    const {
      page,
      pageSize,
      type,
      isRead,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = params;
    const offset = (page - 1) * pageSize;

    let query = supabase
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('userId', userId)
      .is('deletedAt', null); // Exclude soft-deleted notifications

    // Apply notification type filter
    if (type) {
      if (Array.isArray(type)) {
        query = query.in('type', type);
      } else {
        query = query.eq('type', type);
      }
    }

    // Apply read/unread filter
    if (isRead !== undefined) {
      query = query.eq('isRead', isRead);
    }

    // Apply ordering and pagination
    query = query
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(offset, offset + pageSize - 1);

    const { data, error, count } = await query;

    if (error) {
      toast.error('Failed to fetch notifications');
      throw new Error('Could not fetch notifications.');
    }

    const hasMore = count ? count > offset + data.length : false;

    return { notifications: data as Notification[], hasMore };
  }

  /**
   * Gets the count of unread notifications for a specific user.
   */
  static async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('userId', userId)
      .eq('isRead', false)
      .is('deletedAt', null);

    if (error) {
      return 0;
    }
    return count ?? 0;
  }

  /**
   * Gets the count of unread notifications by type for a specific user.
   */
  static async getUnreadCountByType(
    userId: string,
    type: NotificationType
  ): Promise<number> {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('userId', userId)
      .eq('type', type)
      .eq('isRead', false)
      .is('deletedAt', null);

    if (error) {
      return 0;
    }
    return count ?? 0;
  }

  /**
   * Creates a new notification.
   */
  static async createNotification(
    notificationData: Omit<Notification, 'notificationId' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'deletedBy'>
  ): Promise<Notification> {
    const now = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        ...notificationData,
        createdAt: now,
        updatedAt: now,
        // createdBy and updatedBy should be included in notificationData
      })
      .select()
      .single();

    if (error) {
      toast.error('Failed to create notification');
      throw new Error('Could not create notification.');
    }
    return data as Notification;
  }

  /**
   * Marks a specific notification as read.
   */
  static async markAsRead(notificationId: string, updatedBy: string): Promise<Notification> {
    const { data, error } = await supabase
      .from('notifications')
      .update({ 
        isRead: true,
        updatedAt: new Date().toISOString(),
        updatedBy: updatedBy
      })
      .eq('notificationId', notificationId)
      .is('deletedAt', null)
      .select()
      .single();

    if (error) {
      toast.error('Failed to mark notification as read');
      throw new Error('Could not mark notification as read.');
    }
    return data as Notification;
  }

  /**
   * Marks all notifications as read for a specific user.
   */
  static async markAllAsRead(userId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ 
        isRead: true,
        updatedAt: new Date().toISOString(),
        updatedBy: userId
      })
      .eq('userId', userId)
      .eq('isRead', false)
      .is('deletedAt', null);

    if (error) {
      toast.error('Failed to mark all notifications as read');
      throw new Error('Could not mark all notifications as read.');
    }
  }

  /**
   * Marks notifications of a specific type as read for a user.
   */
  static async markTypeAsRead(
    userId: string,
    type: NotificationType
  ): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ 
        isRead: true,
        updatedAt: new Date().toISOString(),
        updatedBy: userId
      })
      .eq('userId', userId)
      .eq('type', type)
      .eq('isRead', false)
      .is('deletedAt', null);

    if (error) {
      toast.error('Failed to mark notifications as read');
      throw new Error('Could not mark notifications as read.');
    }
  }

  /**
   * Soft-deletes a specific notification.
   */
  static async deleteNotification(notificationId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({
        deletedAt: new Date().toISOString(),
        deletedBy: userId,
        updatedAt: new Date().toISOString(),
        updatedBy: userId
      })
      .eq('notificationId', notificationId);

    if (error) {
      toast.error('Failed to delete notification');
      throw new Error('Could not delete notification.');
    }
  }

  /**
   * Soft-deletes all notifications for a specific user.
   */
  static async deleteAllNotifications(userId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({
        deletedAt: new Date().toISOString(),
        deletedBy: userId,
        updatedAt: new Date().toISOString(),
        updatedBy: userId
      })
      .eq('userId', userId)
      .is('deletedAt', null);

    if (error) {
      toast.error('Failed to delete all notifications');
      throw new Error('Could not delete all notifications.');
    }
  }

  /**
   * Soft-deletes all read notifications for a specific user.
   */
  static async deleteReadNotifications(userId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({
        deletedAt: new Date().toISOString(),
        deletedBy: userId,
        updatedAt: new Date().toISOString(),
        updatedBy: userId
      })
      .eq('userId', userId)
      .eq('isRead', true)
      .is('deletedAt', null);

    if (error) {
      toast.error('Failed to delete read notifications');
      throw new Error('Could not delete read notifications.');
    }
  }

  /**
   * Gets a single notification by ID.
   */
  static async getNotificationById(
    notificationId: string
  ): Promise<Notification | null> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('notificationId', notificationId)
      .is('deletedAt', null)
      .single();

    if (error) {
      return null;
    }
    return data as Notification;
  }

  /**
   * Gets recent notifications for a user (last N notifications).
   */
  static async getRecentNotifications(
    userId: string,
    limit: number = 5
  ): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('userId', userId)
      .is('deletedAt', null)
      .order('createdAt', { ascending: false })
      .limit(limit);

    if (error) {
      return [];
    }
    return data as Notification[];
  }

  /**
   * Gets notifications by related ID (e.g., all notifications for a specific job application).
   */
  static async getNotificationsByRelatedId(
    userId: string,
    relatedId: number
  ): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('userId', userId)
      .eq('relatedId', relatedId)
      .is('deletedAt', null)
      .order('createdAt', { ascending: false });

    if (error) {
      return [];
    }
    return data as Notification[];
  }

  /**
   * Batch create multiple notifications (useful for sending to multiple users).
   */
  static async createBatchNotifications(
    notificationsData: Omit<Notification, 'notificationId' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'deletedBy'>[]
  ): Promise<Notification[]> {
    const now = new Date().toISOString();
    
    const notificationsWithTimestamps = notificationsData.map((notification) => ({
      ...notification,
      createdAt: now,
      updatedAt: now,
    }));

    const { data, error } = await supabase
      .from('notifications')
      .insert(notificationsWithTimestamps)
      .select();

    if (error) {
      toast.error('Failed to create notifications');
      throw new Error('Could not create batch notifications.');
    }
    return data as Notification[];
  }

  /**
   * Subscribe to real-time notification updates for a user.
   * Returns an unsubscribe function.
   */
  static subscribeToNotifications(
    userId: string,
    onNotification: (notification: Notification) => void
  ): () => void {
    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `userId=eq.${userId}`,
        },
        (payload) => {
          onNotification(payload.new as Notification);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  /**
   * Subscribe to real-time notification updates (for read status changes).
   * Returns an unsubscribe function.
   */
  static subscribeToNotificationUpdates(
    userId: string,
    onUpdate: (notification: Notification) => void
  ): () => void {
    const channel = supabase
      .channel(`notification_updates:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `userId=eq.${userId}`,
        },
        (payload) => {
          onUpdate(payload.new as Notification);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
}