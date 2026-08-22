// src/services/loan.service.ts
import api from '@/api/axios';
import type { Loan } from '@/types/loan';

export const loanService = {
  getAll: async (params?: { status?: string; page?: number }) => {
    const res = await api.get('/loans', { params });
    const payload = res.data.data;
    return {
      data: payload?.loans ?? [],
      meta: payload?.pagination ?? null,
    };
  },

  getMyLoans: async () => {
    const res = await api.get('/loans/my');
    // Backend: { success, data: { loans: [], pagination: {} } }
    return (res.data.data?.loans ?? []) as Loan[];
  },

  /**
   * Borrow book
   * Backend requires: { bookId, days }
   */
  borrow: async (bookId: number, days: number = 7) => {
    const res = await api.post('/loans', { bookId, days });
    return res.data.data;
  },

  updateStatus: async (id: number, status: string) => {
    const res = await api.patch(`/loans/${id}`, { status });
    return res.data.data;
  },

  returnBook: async (id: number) => {
    const res = await api.patch(`/loans/${id}/return`);
    return res.data.data;
  },
};
