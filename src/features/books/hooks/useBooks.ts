import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { bookService } from '@/services/book.service';
import type { BookFilters } from '@/types/book';

export function useBooks(filters: BookFilters = {}) {
  return useQuery({
    queryKey: ['books', filters],
    queryFn: () => bookService.getAll(filters),
  });
}

export function useBook(id: string | number) {
  return useQuery({
    queryKey: ['book', id],
    queryFn: () => bookService.getById(id),
    enabled: !!id,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      // Pastikan bookService memiliki method getategories, atau kembalikan array kosong jika belum ada
      if (
        'getCategories' in bookService &&
        typeof (bookService as { getCategories: () => Promise<unknown> })
          .getCategories === 'function'
      ) {
        return (
          bookService as { getCategories: () => Promise<unknown> }
        ).getCategories();
      }
      return Promise.resolve([]);
    },
  });
}

export function useCreateBook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: bookService.create,
    onSuccess: () => {
      toast.success('Book created successfully');
      qc.invalidateQueries({ queryKey: ['books'] });
      qc.invalidateQueries({ queryKey: ['admin-books'] });
    },
  });
}

export function useUpdateBook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...payload
    }: {
      id: string | number;
      [key: string]: unknown;
    }) => bookService.update(Number(id), payload),
    onSuccess: (_, variables) => {
      toast.success('Book updated successfully');
      qc.invalidateQueries({ queryKey: ['books'] });
      qc.invalidateQueries({ queryKey: ['book', variables.id] });
      qc.invalidateQueries({ queryKey: ['admin-books'] });
    },
  });
}

export function useDeleteBook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: bookService.remove,
    onSuccess: () => {
      toast.success('Book deleted successfully');
      qc.invalidateQueries({ queryKey: ['books'] });
      qc.invalidateQueries({ queryKey: ['admin-books'] });
    },
  });
}
