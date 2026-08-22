// src/services/auth.service.ts
import api from '@/api/axios';
import type { AuthResponse, LoginPayload, RegisterPayload } from '@/types/auth';

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const res = await api.post('/auth/login', payload);
    // Backend: { success, message, data: { token, user } }
    return res.data.data;
  },

  register: async (payload: Omit<RegisterPayload, 'confirmPassword'>) => {
    const res = await api.post('/auth/register', payload);
    // Backend: { success, message, data: { id, name, email, ... } }
    return res.data.data;
  },

  me: async () => {
    const res = await api.get('/auth/me');
    return res.data.data;
  },
};
