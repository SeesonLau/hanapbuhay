
export interface User {
  userId: string;
  email: string;
  password?: string;
  role: string;
  createdBy: string | null;
  createdAt: string;
  updatedBy: string | null;
  updatedAt: string;
  deletedBy: string | null;
  deletedAt: string | null;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: any;
  needsConfirmation?: boolean; 
}