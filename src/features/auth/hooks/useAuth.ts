// src/features/auth/hooks/useAuth.ts
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAppDispatch } from '@/store/hooks';
import {
  setCredentials,
  logout as logoutAction,
} from '@/store/slices/authSlice';
import { authService } from '@/services/auth.service';
import type {
  LoginFormValues,
  RegisterFormValues,
} from '@/schemas/auth.schema';
import { getErrorMessage } from '@/utils/error';

export function useAuth() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // ===== LOGIN =====
  const loginMutation = useMutation({
    mutationFn: (values: LoginFormValues) => authService.login(values),
    onSuccess: (data) => {
      dispatch(
        setCredentials({
          token: data.token,
          user: {
            ...data.user,
            phone: data.user.phone ?? undefined,
          },
        })
      );

      toast.success('Login berhasil!');

      // Redirect berdasarkan role
      if (data.user.role === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/books', { replace: true });
      }
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(error) || 'Email atau password salah';
      toast.error(message);
    },
  });

  // ===== REGISTER =====
  const registerMutation = useMutation({
    mutationFn: (values: RegisterFormValues) => {
      const { confirmPassword: _, ...payload } = values;
      void _;
      return authService.register(payload);
    },
    onSuccess: () => {
      toast.success('Registrasi berhasil! Silakan login.');
      navigate('/login', { replace: true });
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(error) || 'Registrasi gagal. Coba lagi.';
      toast.error(message);
    },
  });

  // ===== LOGOUT =====
  const logout = () => {
    dispatch(logoutAction());
    toast.success('Berhasil logout');
    navigate('/', { replace: true });
  };

  return {
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,

    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,

    logout,
  };
}
