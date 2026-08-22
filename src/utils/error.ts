// src/utils/error.ts
import { AxiosError } from 'axios';

export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    // Menggunakan Record<string, unknown> alih-alih any agar lolos ESLint
    const data = error.response?.data as
      | Record<string, unknown>
      | string
      | undefined;

    if (data && typeof data === 'object') {
      if (typeof data.message === 'string') return data.message;
      if (typeof data.error === 'string') return data.error;
    }

    if (typeof data === 'string') return data;

    // Fallback berdasarkan status code
    switch (error.response?.status) {
      case 400:
        return 'Permintaan tidak valid.';
      case 401:
        return 'Sesi Anda telah berakhir. Silakan login kembali.';
      case 403:
        return 'Anda tidak memiliki akses.';
      case 404:
        return 'Data tidak ditemukan.';
      case 422:
        if (
          data &&
          typeof data === 'object' &&
          typeof data.message === 'string'
        ) {
          return data.message;
        }
        return 'Data yang dikirim tidak valid.';
      case 500:
        return 'Terjadi kesalahan pada server. Coba lagi nanti.';
      default:
        return error.message || 'Terjadi kesalahan.';
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Terjadi kesalahan yang tidak diketahui.';
}
