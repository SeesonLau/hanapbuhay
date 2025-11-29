import { NotificationType } from "@/lib/constants/notification-types"

export interface Notification {
  notificationId: string;
  userId: string;           // Who receives the notification
  type: NotificationType;
  message: string;
  isRead: boolean;
  relatedId?: string | null; // ID of related entity (for routing & data fetching)
  createdAt: string;
  createdBy: string;        // Who triggered the notification (for avatar/name)
  updatedAt: string;
  updatedBy: string;
  deletedAt?: string | null;
  deletedBy?: string | null;
}