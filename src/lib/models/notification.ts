import { NotificationType } from "@/lib/constants/notification-types"

export interface Notification {
  notificationId: string;
  name: string;
  type: NotificationType;
  message: string;
  time: string;
  isRead: boolean;
  relatedId?: number;
}