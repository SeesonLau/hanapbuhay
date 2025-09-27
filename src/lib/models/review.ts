export interface Review {
  reviewId: string;
  userId: string;
  postId: string;
  comment?: string | null;
  rating: number;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  deletedAt?: string | null;
  deletedBy?: string | null;
}