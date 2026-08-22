// src/lib/retry.ts
import { AxiosError } from 'axios';

/**
 * Custom retry condition
 * - Tidak retry 4xx (kecuali 408 Request Timeout & 429 Too Many Requests)
 * - Retry network error & 5xx
 * - Maksimal sesuai maxRetries
 */
export function customRetry(
  failureCount: number,
  error: unknown,
  maxRetries = 3
): boolean {
  if (failureCount >= maxRetries) return false;

  // Network error / timeout (tidak ada response)
  if (error instanceof AxiosError && !error.response) {
    return true;
  }

  if (error instanceof AxiosError && error.response) {
    const status = error.response.status;

    // Client error → jangan retry (kecuali 408 & 429)
    if (status >= 400 && status < 500) {
      return status === 408 || status === 429;
    }

    // Server error → boleh retry
    if (status >= 500) return true;
  }

  // Error non-Axios → boleh retry
  return true;
}

/**
 * Exponential Backoff + Jitter
 * delay = min(base * 2^attempt + random, maxDelay)
 */
export function customRetryDelay(
  attemptIndex: number,
  baseDelay = 1000,
  maxDelay = 30_000
): number {
  const exponential = baseDelay * Math.pow(2, attemptIndex);
  const jitter = Math.random() * 400; // mencegah thundering herd
  return Math.min(exponential + jitter, maxDelay);
}

/**
 * Versi lebih agresif (untuk query penting)
 */
export function aggressiveRetry(failureCount: number, error: unknown) {
  return customRetry(failureCount, error, 5);
}

/**
 * Versi konservatif (hampir tidak pernah retry)
 */
export function conservativeRetry(failureCount: number, error: unknown) {
  return customRetry(failureCount, error, 1);
}
