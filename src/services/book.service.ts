// src/services/book.service.ts
import api from '@/api/axios';
import type { Book, BookFilters } from '@/types/book';

export const bookService = {
  getAll: async (filters: BookFilters = {}) => {
    const res = await api.get('/books', {
      params: {
        // Mengirimkan 'q' dan 'search' sekaligus sebagai dukungan untuk berbagai variasi backend (Swagger/API)
        q: filters.search || undefined,
        search: filters.search || undefined,
        categoryId: filters.categoryId || undefined,
        sortBy: filters.sortBy || undefined,
        page: filters.page || 1,
        limit: filters.limit || 12,
      },
    });

    const payload = res.data.data;
    return {
      data: payload?.books ?? payload ?? [],
      meta: payload?.pagination ?? payload?.meta ?? null,
    };
  },

  getById: async (id: number | string) => {
    const res = await api.get(`/books/${id}`);
    return (res.data.data?.book ?? res.data.data) as Book;
  },

  create: async (payload: Partial<Book> | FormData) => {
    const res = await api.post('/books', payload);
    return res.data.data;
  },

  update: async (id: number, payload: Partial<Book> | FormData) => {
    const res = await api.put(`/books/${id}`, payload);
    return res.data.data;
  },

  remove: async (id: number) => {
    const res = await api.delete(`/books/${id}`);
    return res.data.data;
  },
};
