// src/schemas/auth.schema.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email wajib diisi')
    .email('Format email tidak valid'),
  password: z
    .string()
    .min(1, 'Password wajib diisi')
    .min(6, 'Password minimal 6 karakter'),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Nama wajib diisi')
      .min(3, 'Nama minimal 3 karakter'),
    email: z
      .string()
      .min(1, 'Email wajib diisi')
      .email('Format email tidak valid'),
    phone: z
      .string()
      .min(1, 'Nomor handphone wajib diisi')
      .regex(/^[0-9]+$/, 'Nomor handphone hanya boleh angka')
      .min(10, 'Nomor handphone minimal 10 digit')
      .max(15, 'Nomor handphone maksimal 15 digit'),
    password: z
      .string()
      .min(1, 'Password wajib diisi')
      .min(6, 'Password minimal 6 karakter'),
    confirmPassword: z.string().min(1, 'Konfirmasi password wajib diisi'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password tidak cocok',
    path: ['confirmPassword'],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
