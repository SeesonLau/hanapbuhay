import { Notification } from '@/lib/models/notification';
import { NotificationType } from '@/lib/constants/notification-types';

export function getNotificationRoute(notif: Notification): string {
  if (!notif.relatedId) {
    switch (notif.type) {
      case NotificationType.JOB_APPLICATION:
        return '/manageJobPosts';
      case NotificationType.APPLICATION_ACCEPTED:
        return '/appliedJobs';
      case NotificationType.NEW_MESSAGE:
        return '/chat';
      default:
        return '/';
    }
  }

  switch (notif.type) {
    case NotificationType.JOB_APPLICATION:
      return `/manageJobPosts`;
      
    case NotificationType.APPLICATION_ACCEPTED:
      return `/appliedJobs`;
      
    case NotificationType.NEW_MESSAGE:
      return `/chat`;
      
    default:
      return '/';
  }
}