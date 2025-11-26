// lib/utils/notification-router.ts
import { Notification } from '@/lib/models/notification';
import { NotificationType } from '@/lib/constants/notification-types';

export function getNotificationRoute(notif: Notification): string {
  if (!notif.relatedId) {
    // Fallback to generic routes if no relatedId
    switch (notif.type) {
      case NotificationType.JOB_APPLICATION:
        return '/jobs/applications';
      case NotificationType.APPLICATION_ACCEPTED:
        return '/jobs/my-applications';
      case NotificationType.NEW_MESSAGE:
        return '/messages';
      default:
        return '/notifications';
    }
  }

  // Specific routes with relatedId
  switch (notif.type) {
    case NotificationType.JOB_APPLICATION:
      return `/applications/${notif.relatedId}`;
      
    case NotificationType.APPLICATION_ACCEPTED:
      return `/my-applications/${notif.relatedId}`;
      
    case NotificationType.NEW_MESSAGE:
      return `/messages/${notif.relatedId}`;
      
    default:
      return '/notifications';
  }
}