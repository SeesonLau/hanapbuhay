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

export interface ProfileResponse {
  success: boolean;       // true if operation succeeded
  data?: Profile;         // profile object when successful
  message?: string;       // error or status message
}