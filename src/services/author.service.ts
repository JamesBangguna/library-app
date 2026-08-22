import api from '@/api/axios';

export const authorService = {
  getAll: async () => {
    const res = await api.get('/authors');
    // Backend: { success, message, data: { authors: [...] } }
    return res.data.data?.authors ?? res.data.data ?? [];
  },

  create: async (payload: { name: string; bio?: string }) => {
    const res = await api.post('/authors', payload);
    return res.data.data;
  },

  update: async (id: number, payload: { name: string; bio?: string }) => {
    const res = await api.put(`/authors/${id}`, payload);
    return res.data.data;
  },

  remove: async (id: number) => {
    const res = await api.delete(`/authors/${id}`);
    return res.data.data;
  },
};
