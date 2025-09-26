import { supabase } from './supabase/client';
import { Project } from '../models/profile';
import { toast } from 'react-hot-toast';
import { ProjectMessages } from '@/resources/messages/project';

export class ProjectService {
  static async getProjectsByUserId(userId: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false });

    if (error) {
      toast.error(ProjectMessages.FETCH_PROJECTS_ERROR);
      return [];
    }

    return data as Project[];
  }

  static async getProjectById(projectId: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('projectId', projectId)
      .single();

    if (error) {
      toast.error(ProjectMessages.FETCH_PROJECT_ERROR);
      return null;
    }

    return data as Project;
  }

  static async upsertProject(project: Project): Promise<boolean> {
    try {
      let existing = null;

      if (project.projectId) {
        const { data, error } = await supabase
          .from('projects')
          .select('projectId, createdAt, createdBy')
          .eq('projectId', project.projectId)
          .single();

        if (error && error.code !== 'PGRST116') {
          toast.error(ProjectMessages.CHECK_EXISTING_PROJECT_ERROR);
          return false;
        }

        existing = data;
      }

      const payload: any = {
        ...project,
        updatedAt: new Date().toISOString(),
        updatedBy: project.userId,
      };

      if (!existing) {
        payload.createdAt = new Date().toISOString();
        payload.createdBy = project.userId;
      } else {
        payload.createdAt = existing.createdAt;
        payload.createdBy = existing.createdBy;
      }

      const { error } = await supabase.from('projects').upsert(payload, {
        onConflict: 'projectId',
      });

      if (error) {
        toast.error(ProjectMessages.SAVE_PROJECT_ERROR);
        return false;
      }

      toast.success(ProjectMessages.SAVE_PROJECT_SUCCESS);
      return true;
    } catch {
      toast.error(ProjectMessages.CHECK_EXISTING_PROJECT_ERROR);
      return false;
    }
  }

  static async uploadProjectImage(userId: string, projectId: string, file: File): Promise<string | null> {
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

    if (file.size > MAX_FILE_SIZE) {
      toast.error(ProjectMessages.FILE_SIZE_EXCEEDED);
      return null;
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${projectId}-${Date.now()}.${fileExt}`; 
    const filePath = `${userId}/${projectId}/${fileName}`; 

    const { error: uploadError } = await supabase.storage
      .from("project-images")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast.error(ProjectMessages.UPLOAD_IMAGE_ERROR);
      return null;
    }

    const { data } = supabase.storage
      .from("project-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  static async deleteProject(projectId: string, userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('projects')
      .update({
        deletedBy: userId,
        deletedAt: new Date().toISOString(),
      })
      .eq('projectId', projectId);

    if (error) {
      toast.error(ProjectMessages.DELETE_PROJECT_ERROR);
      return false;
    }

    toast.success(ProjectMessages.DELETE_PROJECT_SUCCESS);
    return true;
  }
}
