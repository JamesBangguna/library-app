// src/types/auth.ts
export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  role: 'USER' | 'ADMIN';
  avatar?: string | null;
  createdAt?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
