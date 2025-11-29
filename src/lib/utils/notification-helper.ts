import { NotificationService } from '@/lib/services/notifications-services';
import { NotificationType } from '@/lib/constants/notification-types';
import { supabase } from '@/lib/services/supabase/client';

interface NotifyApplicationParams {
  postId: string;
  applicantId: string;
  applicationId: string;
}

export async function notifyEmployerOfApplication({
  postId,
  applicantId,
  applicationId
}: NotifyApplicationParams): Promise<void> {
  console.log('=== notifyEmployerOfApplication START ===');
  console.log('postId:', postId);
  console.log('applicantId:', applicantId);
  console.log('applicationId:', applicationId);
  
  try {
    if (!postId || !applicantId || !applicationId) {
      console.error('Missing required parameters for notification');
      return;
    }

    console.log('Fetching application with post details...');

    const { data: application, error: appError } = await supabase
      .from('applications')
      .select(`
        *,
        posts (
          postId,
          userId,
          createdBy,
          title
        )
      `)
      .eq('applicationId', applicationId)
      .maybeSingle();

    console.log('Application fetch result:', { application, appError });

    if (appError) {
      console.error('Failed to fetch application for notification:', appError);
      return;
    }

    if (!application || !application.posts) {
      console.error('Application or post not found:', { application });
      return;
    }

    const post = application.posts as any;
    
    const employerId = post.userId || post.createdBy;

    console.log('Employer ID:', employerId);
    console.log('Post title:', post.title);

    if (!employerId) {
      console.error('No employer ID found for post:', post);
      return;
    }

    if (employerId === applicantId) {
      console.log('Skipping notification - applicant is the employer');
      return;
    }

    console.log('Creating notification...');

    const notification = await NotificationService.createNotification({
      userId: employerId,
      createdBy: applicantId,
      type: NotificationType.JOB_APPLICATION,
      message: `applied to your *${post.title}* job post`,
      relatedId: applicationId,
      isRead: false,
      updatedBy: applicantId
    });

    console.log('Notification created successfully:', notification);
    console.log('=== notifyEmployerOfApplication END ===');
  } catch (error) {
    console.error('Failed to notify employer of application:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
  }
}

interface NotifyAcceptanceParams {
  applicationId: string;
  employerId: string;
}

export async function notifyApplicantOfAcceptance({
  applicationId,
  employerId
}: NotifyAcceptanceParams): Promise<void> {
  try {
    if (!applicationId || !employerId) {
      console.error('Missing required parameters for acceptance notification:', { applicationId, employerId });
      return;
    }

    console.log('Fetching application for acceptance notification:', { applicationId });

    const { data: application, error } = await supabase
      .from('applications')
      .select(`
        userId,
        posts (
          title
        )
      `)
      .eq('applicationId', applicationId)
      .maybeSingle();

    if (error) {
      console.error('Failed to fetch application for notification:', error);
      return;
    }

    if (!application) {
      console.error('Application not found for notification:', applicationId);
      return;
    }

    if (application.userId === employerId) {
      console.log('Skipping notification - applicant is the employer');
      return;
    }

    const post = application.posts as any;
    const jobTitle = post?.title || 'a position';

    console.log('Creating acceptance notification for applicant:', application.userId);

    await NotificationService.createNotification({
      userId: application.userId,
      createdBy: employerId,
      type: NotificationType.APPLICATION_ACCEPTED,
      message: `accepted your application for *${jobTitle}*`,
      relatedId: applicationId,
      isRead: false,
      updatedBy: employerId
    });

    console.log('Acceptance notification created successfully');
  } catch (error) {
    console.error('Failed to notify applicant of acceptance:', error);
  }
}