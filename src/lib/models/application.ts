export interface Application {
  applicationId: string;
  postId: string;
  userId: string;
  status: string; // e.g., 'pending', 'accepted', 'rejected'
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  deletedAt?: string | null;
  deletedBy?: string | null;
}