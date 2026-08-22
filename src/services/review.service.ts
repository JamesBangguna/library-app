// src/services/review.service.ts
import api from '@/api/axios';
import type { Review } from '@/types/review';

export const reviewService = {
  getAll: async () => {
    const res = await api.get('/reviews');
    const payload = res.data.data;
    return payload?.reviews ?? payload ?? [];
  },

  getByBook: async (bookId: number | string) => {
    const res = await api.get(`/reviews/book/${bookId}`);
    // Backend: { success, data: { bookId, reviews: [], pagination } }
    return (res.data.data?.reviews ?? []) as Review[];
  },

  create: async (payload: {
    bookId: number;
    rating?: number;
    star?: number;
    comment: string;
  }) => {
    // Backend memakai field "star", bukan "rating"
    const body = {
      bookId: payload.bookId,
      star: payload.star ?? payload.rating ?? 5,
      comment: payload.comment,
    };
    const res = await api.post('/reviews', body);
    return res.data.data;
  },

  remove: async (id: number) => {
    const res = await api.delete(`/reviews/${id}`);
    return res.data.data;
  },
};
