export enum NotificationType {
  JOB_APPLICATION = "JOB_APPLICATION",
  APPLICATION_ACCEPTED = "APPLICATION_ACCEPTED",
  APPLICATION_REJECTED = "APPLICATION_REJECTED",
  APPLICATION_COMPLETED = "APPLICATION_COMPLETED",
  NEW_MESSAGE = "NEW_MESSAGE"
}

export const NOTIFICATION_ROUTES: Record<NotificationType, string> = {
  [NotificationType.JOB_APPLICATION]: "/manageJobPosts",
  [NotificationType.APPLICATION_ACCEPTED]: "/appliedJobs",
  [NotificationType.APPLICATION_REJECTED]: "/appliedJobs",
  [NotificationType.APPLICATION_COMPLETED]: "/appliedJobs",
  [NotificationType.NEW_MESSAGE]: "/chat"
};  