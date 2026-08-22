// src/store/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'USER' | 'ADMIN';
  avatar?: string | null;
  createdAt?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  role: 'USER' | 'ADMIN' | null;
  isLogin: boolean;
}

const initialState: AuthState = {
  token: localStorage.getItem('access_token') || null,
  user: localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user')!)
    : null,
  role: localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user')!).role
    : null,
  isLogin: !!localStorage.getItem('access_token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: User }>
    ) => {
      const { token, user } = action.payload;

      state.token = token;
      state.user = user;
      state.role = user.role;
      state.isLogin = true;

      localStorage.setItem('access_token', token);
      localStorage.setItem('user', JSON.stringify(user));
    },

    logout: (state) => {
      state.token = null;
      state.user = null;
      state.role = null;
      state.isLogin = false;

      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
    },

    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
  },
});

export const { setCredentials, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
