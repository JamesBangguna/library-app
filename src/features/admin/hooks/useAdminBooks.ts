// src/features/admin/hooks/useAdminBooks.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { bookService } from '@/services/book.service';
import { BookFilters, Book } from '@/types/book';

export function useAdminBooks(params?: BookFilters) {
  return useQuery({
    queryKey: ['admin-books', params],
    queryFn: () => bookService.getAll(params),
  });
}

export function useCreateBook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Book> | FormData) =>
      bookService.create(payload),
    onSuccess: () => {
      toast.success('Book created successfully');
      qc.invalidateQueries({ queryKey: ['admin-books'] });
      qc.invalidateQueries({ queryKey: ['books'] });
    },
  });
}

export function useUpdateBook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: number | string } & Partial<Book>) =>
      bookService.update(typeof id === 'string' ? Number(id) : id, payload),
    onSuccess: () => {
      toast.success('Book updated successfully');
      qc.invalidateQueries({ queryKey: ['admin-books'] });
      qc.invalidateQueries({ queryKey: ['books'] });
    },
  });
}

export function useDeleteBook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) =>
      bookService.remove(typeof id === 'string' ? Number(id) : id),
    onSuccess: () => {
      toast.success('Book deleted successfully');
      qc.invalidateQueries({ queryKey: ['admin-books'] });
      qc.invalidateQueries({ queryKey: ['books'] });
    },
  });
}
