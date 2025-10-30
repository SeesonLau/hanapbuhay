export interface Profile {
  userId: string;
  profilePictureUrl?: string | null; 
  name?: string | null;            
  address?: string | null;           
  phoneNumber?: string | null;      
  birthdate?: string | null;         
  age?: number | null;              
  sex?: string | null;              
  createdBy?: string | null;
  createdAt: string;                 
  updatedBy?: string | null;
  updatedAt: string;                 
  deletedBy?: string | null;
  deletedAt?: string | null;
}

export interface Project {
  userId: string;
  projectId?: string;
  projectPictureUrl?: string | null; 
  projectImages?: string[];
  title: string;
  description?: string | null;
  createdBy?: string | null;
  createdAt: string;                 
  updatedBy?: string | null;
  updatedAt: string;                 
  deletedBy?: string | null;
  deletedAt?: string | null;
}
  