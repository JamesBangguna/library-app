export interface Author {
  id: number;
  name: string;
  bio?: string | null;
  avatar?: string | null;
}

export interface Category {
  id: number;
  name: string;
}

export interface Book {
  id: number;
  title: string;
  description?: string | null;
  isbn?: string;
  publishedYear?: number | null;
  coverImage?: string | null;
  rating: number;
  reviewCount: number;
  totalCopies: number;
  availableCopies: number;
  borrowCount?: number;
  authorId: number;
  categoryId: number;
  author?: Author;
  category?: Category;
  createdAt?: string;
  updatedAt?: string;
}

export interface BookFilters {
  search?: string;
  categoryId?: number | null;
  sortBy?: string;
  page?: number;
  limit?: number;
}
