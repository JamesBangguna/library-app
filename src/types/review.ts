export interface Review {
  id: number;
  bookId: number;
  userId: number;
  rating: number;
  comment: string;
  createdAt: string;
  user?: {
    id: number;
    name: string;
    avatar?: string | null;
  };
}
