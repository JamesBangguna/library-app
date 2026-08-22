// src/services/user.service.ts
import api from '@/api/axios';

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  [key: string]: unknown;
}

export const userService = {
  getAll: async (params?: { search?: string; page?: number }) => {
    const { data } = await api.get('/users', { params });
    return data;
  },

  update: async (id: number, payload: UpdateUserPayload) => {
    const { data } = await api.put(`/users/${id}`, payload);
    return data;
  },

  remove: async (id: number) => {
    const { data } = await api.delete(`/users/${id}`);
    return data;
  },
};
