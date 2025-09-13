import { supabase } from './supabase/client';
import { Project } from '../models/profile';

export class ProjectService {
  static async getProjectsByUserId(userId: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
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
      console.error('Error fetching project:', error);
      return null;
    }

    return data as Project;
  }

  static async upsertProject(project: Project): Promise<boolean> {
  let existing = null;

  if (project.projectId) {
    const { data, error } = await supabase
      .from('projects')
      .select('projectId')
      .eq('projectId', project.projectId)
      .maybeSingle(); 

    if (error) {
      console.error('Error checking existing project:', error);
      return false;
    }

    existing = data;
  }

  const { error } = await supabase
    .from('projects')
    .upsert({
      ...project,
      updatedAt: new Date().toISOString(),
      updatedBy: project.userId,
      createdAt: existing ? undefined : new Date().toISOString(),
      createdBy: existing ? undefined : project.userId,
    });

  if (error) {
    console.error('Error saving project:', error);
    return false;
  }

  return true;
}

  static async uploadProjectImage(userId: string, file: File): Promise<string | null> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `project-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('project-images')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error('Error uploading project image:', uploadError);
      return null;
    }

    const { data } = supabase.storage
      .from('project-images')
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
      console.error('Error deleting project:', error);
      return false;
    }

    return true;
  }
}
