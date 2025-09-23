import { toast } from 'react-hot-toast';
import { supabase } from './supabase/client';
import { ApplicationMessages } from '@/resources/messages/applications';
import { ApplicationStatus } from '../constants/application-status';
import { Application } from '../models/application';

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
      // The unique constraint will handle duplicate applications
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
        // Check if this is a unique constraint violation
        if (error.code === '23505') { // PostgreSQL unique violation code
          toast.error(ApplicationMessages.DUPLICATE_APPLICATION_ERROR);
          return null;
        }
        throw error;
      }

      toast.success(ApplicationMessages.CREATE_APPLICATION_SUCCESS);
      return data;
    } catch (error: any) { // Type assertion for database error
      if (error?.code !== '23505') { // Don't show general error for duplicates
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
            title,
            description,
            price,
            location
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
        .select('*, users!applications_userId_fkey (fullName, email)', { count: 'exact' })
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
  static async softDeleteApplication(applicationId: string, userId: string): Promise<boolean> {
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
      console.log('Fetching count for user:', userId);
      const { count, error } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('userId', userId)
        .is('deletedAt', null);

      if (error) {
        console.error('Error fetching count:', error);
        throw error;
      }

      console.log('Count result:', count);
      return count || 0;
    } catch (error) {
      console.error('Error in getTotalApplicationsByUserIdCount:', error);
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