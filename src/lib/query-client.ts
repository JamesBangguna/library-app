// src/lib/query-client.ts
import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/error';

/**
 * Menentukan apakah error boleh di-retry
 * - Tidak retry 4xx (kecuali 408 & 429)
 * - Retry network error & 5xx
 * - Maksimal 3x retry
 */
function shouldRetry(failureCount: number, error: unknown): boolean {
  if (failureCount >= 3) return false;

  if (error instanceof AxiosError) {
    // Network error / timeout
    if (!error.response) return true;

    const status = error.response.status;

    // Client error → jangan retry (kecuali 408 & 429)
    if (status >= 400 && status < 500) {
      return status === 408 || status === 429;
    }

    // Server error → boleh retry
    if (status >= 500) return true;
  }

  // Error lain (misalnya non-Axios) → boleh retry
  return true;
}

/**
 * Exponential Backoff + Jitter
 * delay = min(1000 * 2^attempt + jitter, 30000)
 */
function retryDelay(attemptIndex: number): number {
  const base = 1000 * Math.pow(2, attemptIndex); // 1s, 2s, 4s...
  const jitter = Math.random() * 400; // biar tidak thundering herd
  return Math.min(base + jitter, 30_000);
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: shouldRetry,
      retryDelay,
      staleTime: 1000 * 60 * 5, // 5 menit
      gcTime: 1000 * 60 * 30, // 30 menit
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: true,
    },
    mutations: {
      // Mutation tidak di-retry otomatis (hindari double submit)
      retry: false,
    },
  },

  // Global error handling untuk Query
  queryCache: new QueryCache({
    onError: (error, query) => {
      // Hanya tampilkan toast jika data sebelumnya sudah ada
      // (menghindari toast di first load yang gagal)
      if (query.state.data !== undefined) {
        toast.error(getErrorMessage(error));
      }
    },
  }),

  // Global error handling untuk Mutation
  mutationCache: new MutationCache({
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  }),
});
