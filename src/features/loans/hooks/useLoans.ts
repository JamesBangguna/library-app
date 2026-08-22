// src/features/loans/hooks/useLoans.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { loanService } from '@/services/loan.service';

interface Book {
  availableCopies: number;
  [key: string]: unknown;
}

export function useMyLoans() {
  return useQuery({
    queryKey: ['my-loans'],
    queryFn: loanService.getMyLoans,
  });
}

export function useAdminLoans(params?: { status?: string; page?: number }) {
  return useQuery({
    queryKey: ['admin-loans', params],
    queryFn: () => loanService.getAll(params),
  });
}

/**
 * Optimistic Update: Borrow Book
 */
export function useBorrowBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookId, days = 7 }: { bookId: number; days?: number }) =>
      loanService.borrow(bookId, days),

    // ===== OPTIMISTIC UPDATE =====
    onMutate: async ({ bookId }) => {
      await queryClient.cancelQueries({ queryKey: ['book', bookId] });
      const previousBook = queryClient.getQueryData<Book>(['book', bookId]);

      queryClient.setQueryData<Book>(['book', bookId], (old) => {
        if (!old) return old;
        return {
          ...old,
          availableCopies: Math.max(0, (old.availableCopies || 0) - 1),
        };
      });

      return { previousBook, bookId };
    },

    onError: (_err, { bookId }, context) => {
      if (context?.previousBook) {
        queryClient.setQueryData(['book', bookId], context.previousBook);
      }
      toast.error('Gagal meminjam buku');
    },

    onSuccess: () => {
      toast.success('Buku berhasil dipinjam!');
    },

    onSettled: (_data, _error, { bookId }) => {
      queryClient.invalidateQueries({ queryKey: ['book', bookId] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['my-loans'] });
    },
  });
}

export function useUpdateLoanStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      loanService.updateStatus(id, status),
    onSuccess: () => {
      toast.success('Status updated');
      qc.invalidateQueries({ queryKey: ['admin-loans'] });
      qc.invalidateQueries({ queryKey: ['my-loans'] });
    },
  });
}
