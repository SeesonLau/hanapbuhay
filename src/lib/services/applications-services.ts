import { toast } from 'react-hot-toast';
import { supabase } from './supabase/client';
import { ApplicationMessages } from '@/resources/messages/applications';
import { ApplicationStatus } from '../constants/application-status';
import { Application } from '../models/application';
import { notifyEmployerOfApplication, notifyApplicantOfAcceptance } from '../utils/notification-helper'; 

interface ApplicationQueryParams {
  page?: number;
  pageSize?: number;
  status?: ApplicationStatus[];
  sortBy?: 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

interface PaginatedApplications {
  applications: Application[];
  count: number;
  hasMore: boolean;
}

export class ApplicationService {
  private static readonly DEFAULT_PAGE_SIZE = 10;

  // Create new application
  static async createApplication(postId: string, userId: string): Promise<Application | null> {
    try {
      const { data, error } = await supabase
        .from('applications')
        .insert({
          postId,
          userId,
          status: ApplicationStatus.PENDING,
          createdBy: userId,
          updatedBy: userId
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          toast.error(ApplicationMessages.DUPLICATE_APPLICATION_ERROR);
          return null;
        }
        throw error;
      }

      console.log('Application created successfully:', data);
      console.log('About to send notification with:', {
        postId,
        applicantId: userId,
        applicationId: data.applicationId
      });
      
      notifyEmployerOfApplication({
        postId,
        applicantId: userId,
        applicationId: data.applicationId
      }).catch(err => {
        console.error('Failed to send notification to employer:', err);
      });

      toast.success(ApplicationMessages.CREATE_APPLICATION_SUCCESS);
      return data;
    } catch (error: any) {
      if (error?.code !== '23505') {
        toast.error(ApplicationMessages.CREATE_APPLICATION_ERROR);
      }
      throw error;
    }
  }

  // Update application status
  static async updateApplicationStatus(
    applicationId: string,
    status: ApplicationStatus,
    updatedBy: string
  ): Promise<Application> {
    try {
      const { data, error } = await supabase
        .from('applications')
        .update({
          status,
          updatedAt: new Date().toISOString(),
          updatedBy
        })
        .eq('applicationId', applicationId)
        .is('deletedAt', null)
        .select()
        .single();

      if (error) throw error;

      if (status === ApplicationStatus.APPROVED) {
        notifyApplicantOfAcceptance({  
          applicationId,
          employerId: updatedBy
        }).catch(err => {
          console.error('Failed to send acceptance notification:', err);
        })
      }

      toast.success(ApplicationMessages.UPDATE_APPLICATION_SUCCESS);
      return data;
    } catch (error) {
      toast.error(ApplicationMessages.UPDATE_APPLICATION_ERROR);
      throw error;
    }
  }

  // Get applications by user ID
  static async getApplicationsByUserId(
  userId: string,
  params: ApplicationQueryParams = {}
): Promise<PaginatedApplications> {
  try {
    const {
      page = 1,
      pageSize = this.DEFAULT_PAGE_SIZE,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = params;

    let query = supabase
      .from('applications')
      .select(`
        *,
        posts (
          postId,
          title,
          description,
          price,
          location,
          type,
          subType,
          userId,
          createdBy
        )
      `, { count: 'exact' })
      .eq('userId', userId)
      .is('deletedAt', null);

    if (status?.length) {
      query = query.in('status', status);
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, count, error } = await query
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(from, to);

    if (error) throw error;

    console.log('ApplicationService - Raw data from Supabase:', data);

    return {
      applications: data || [],
      count: count || 0,
      hasMore: count ? from + (data?.length || 0) < count : false
    };
  } catch (error) {
    toast.error(ApplicationMessages.FETCH_APPLICATIONS_ERROR);
    throw error;
  }
}

  // Get array of postIds that the user has applied for
  static async getAppliedPostIdsByUser(userId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('postId')
        .eq('userId', userId)
        .is('deletedAt', null);

      if (error) throw error;

      if (!data) return [];
      return data.map((row: any) => row.postId).filter(Boolean);
    } catch (error) {
      // don't toast here to avoid noisy UI, let caller decide
      throw error;
    }
  }

  // Get applications by post ID
  static async getApplicationsByPostId(
    postId: string,
    params: ApplicationQueryParams = {}
  ): Promise<PaginatedApplications> {
    try {
      const {
        page = 1,
        pageSize = this.DEFAULT_PAGE_SIZE,
        status,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = params;

      let query = supabase
        .from('applications')
        .select('*, users!applications_userId_fkey (email)', { count: 'exact' })
        .eq('postId', postId)
        .is('deletedAt', null);

      if (status?.length) {
        query = query.in('status', status);
      }

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, count, error } = await query
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range(from, to);

      if (error) throw error;

      return {
        applications: data || [],
        count: count || 0,
        hasMore: count ? from + (data?.length || 0) < count : false
      };
    } catch (error) {
      toast.error(ApplicationMessages.FETCH_APPLICATIONS_ERROR);
      throw error;
    }
  }

  // Soft delete application
  static async deleteApplication(applicationId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('applications')
        .update({
          deletedAt: new Date().toISOString(),
          deletedBy: userId
        })
        .eq('applicationId', applicationId);

      if (error) throw error;

      toast.success(ApplicationMessages.DELETE_APPLICATION_SUCCESS);
      return true;
    } catch (error) {
      toast.error(ApplicationMessages.DELETE_APPLICATION_ERROR);
      return false;
    }
  }

  // Get total applications count
  static async getTotalApplicationsCount(): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('applications')
        .select('*', { count: 'exact' })
        .is('deletedAt', null);

      if (error) throw error;

      return count || 0;
    } catch (error) {
      toast.error(ApplicationMessages.FETCH_APPLICATIONS_ERROR);
      throw error;
    }
  }

  // Get total applications count by user ID
  static async getTotalApplicationsByUserIdCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('userId', userId)
        .is('deletedAt', null);

      if (error) {
        throw error;
      }

      return count || 0;
    } catch (error) {
      toast.error(ApplicationMessages.FETCH_APPLICATIONS_ERROR);
      throw error;
    }
  }

  // Get applications count by user ID with optional status filter
  static async getApplicationsByUserIdCount(
    userId: string,
    params: { status?: string | string[] } = {}
  ): Promise<number> {
    try {
      const { status } = params;

      let query = supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('userId', userId)
        .is('deletedAt', null);

      if (status !== undefined) {
        if (Array.isArray(status)) {
          query = query.in('status', status as any);
        } else {
          query = query.eq('status', status as any);
        }
      }

      const { count, error } = await query;

      if (error) throw error;

      return count || 0;
    } catch (error) {
      toast.error(ApplicationMessages.FETCH_APPLICATIONS_ERROR);
      throw error;
    }
  }

  // Get total applications count by post ID
  static async getTotalApplicationsByPostIdCount(postId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('applications')
        .select('*', { count: 'exact' })
        .eq('postId', postId)
        .is('deletedAt', null);

      if (error) throw error;

      return count || 0;
    } catch (error) {
      toast.error(ApplicationMessages.FETCH_APPLICATIONS_ERROR);
      throw error;
    }
  }

  // Helper: Validate application status
  static validateApplicationStatus(status: string): status is ApplicationStatus {
    return Object.values(ApplicationStatus).includes(status as ApplicationStatus);
  }
}