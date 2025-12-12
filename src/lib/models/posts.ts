export interface Post {
  postId: string;
  userId: string;
  title: string;
  description: string;
  price: number;
  salaryType: string;
  type: string;
  subType: string[];
  location: string;
  imageUrl: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  deletedAt?: string | null;
  deletedBy?: string | null;
  isLocked: boolean;
}