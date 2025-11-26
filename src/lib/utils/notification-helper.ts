// lib/utils/notification-helpers.ts
import { NotificationService } from '@/lib/services/notifications-services';
import { NotificationType } from '@/lib/constants/notification-types';
import { supabase } from '@/lib/services/supabase/client';

interface NotifyApplicationParams {
  postId: string;
  applicantId: string;
  applicationId: string;
}

/**
 * Notify employer when someone applies to their job
 */
export async function notifyEmployerOfApplication({
  postId,
  applicantId,
  applicationId
}: NotifyApplicationParams): Promise<void> {
  try {
    // Fetch post details to get employer and job title
    const { data: post, error } = await supabase
      .from('posts')
      .select('employerId, createdBy, title')
      .eq('postId', postId)
      .single();

    if (error || !post) {
      console.error('Failed to fetch post for notification:', error);
      return;
    }

    const employerId = post.employerId || post.createdBy;

    // Create notification
    await NotificationService.createNotification({
      userId: employerId,
      createdBy: applicantId,
      type: NotificationType.JOB_APPLICATION,
      message: `applied to your "${post.title}" position`,
      relatedId: applicationId,
      isRead: false,
      updatedBy: applicantId
    });
  } catch (error) {
    console.error('Failed to notify employer of application:', error);
    // Don't throw - notification failure shouldn't break the flow
  }
}

interface NotifyAcceptanceParams {
  applicationId: string;
  employerId: string;
}

/**
 * Notify applicant when their application is accepted
 */
export async function notifyApplicantOfAcceptance({
  applicationId,
  employerId
}: NotifyAcceptanceParams): Promise<void> {
  try {
    // Fetch application and post details
    const { data: application, error } = await supabase
      .from('applications')
      .select(`
        userId,
        posts (
          title
        )
      `)
      .eq('applicationId', applicationId)
      .single();

    if (error || !application) {
      console.error('Failed to fetch application for notification:', error);
      return;
    }

    const post = application.posts as any;

    // Create notification
    await NotificationService.createNotification({
      userId: application.userId,
      createdBy: employerId,
      type: NotificationType.APPLICATION_ACCEPTED,
      message: `accepted your application for "${post?.title || 'a position'}"`,
      relatedId: applicationId,
      isRead: false,
      updatedBy: employerId
    });
  } catch (error) {
    console.error('Failed to notify applicant of acceptance:', error);
  }
}