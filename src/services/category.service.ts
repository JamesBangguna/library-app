import api from '@/api/axios';

export const categoryService = {
  getAll: async () => {
    const res = await api.get('/categories');
    // Backend: { success, message, data: { categories: [...] } }
    return res.data.data?.categories ?? res.data.data ?? [];
  },

  create: async (payload: { name: string }) => {
    const res = await api.post('/categories', payload);
    return res.data.data;
  },

  update: async (id: number, payload: { name: string }) => {
    const res = await api.put(`/categories/${id}`, payload);
    return res.data.data;
  },

  remove: async (id: number) => {
    const res = await api.delete(`/categories/${id}`);
    return res.data.data;
  },
};
