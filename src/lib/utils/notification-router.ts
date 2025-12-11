import { Notification } from '@/lib/models/notification';
import { NotificationType } from '@/lib/constants/notification-types';

export function getNotificationRoute(notif: Notification): string {
  console.log('Getting route for notification:', notif);
  console.log('Type:', notif.type, 'RelatedId:', notif.relatedId);

  if (notif.relatedId) {
    switch (notif.type) {
      case NotificationType.JOB_APPLICATION:
        const jobAppRoute = `/manageJobPosts?postId=${encodeURIComponent(notif.relatedId)}`;
        console.log('JOB_APPLICATION route:', jobAppRoute);
        return jobAppRoute;
        
      case NotificationType.APPLICATION_ACCEPTED:
        const acceptedRoute = `/appliedJobs?applicationId=${encodeURIComponent(notif.relatedId)}`;
        console.log('APPLICATION_ACCEPTED route:', acceptedRoute);
        return acceptedRoute;
        
      case NotificationType.NEW_MESSAGE:
        const messageRoute = `/chat?roomId=${encodeURIComponent(notif.relatedId)}`;
        console.log('NEW_MESSAGE route:', messageRoute);
        return messageRoute;
        
      default:
        console.log('Unknown notification type, returning home');
        return '/';
    }
  }

  console.log('No relatedId, using fallback route');
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