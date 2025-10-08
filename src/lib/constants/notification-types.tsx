export enum NotificationType {
  JOB_APPLICATION = "JOB_APPLICATION",
  APPLICATION_ACCEPTED = "APPLICATION_ACCEPTED",
  NEW_MESSAGE = "NEW_MESSAGE"
}

export const NOTIFICATION_ROUTES: Record<NotificationType, string> = {
  [NotificationType.JOB_APPLICATION]: "/jobs/applications",
  [NotificationType.APPLICATION_ACCEPTED]: "/jobs/my-applications",
  [NotificationType.NEW_MESSAGE]: "/messages"
};