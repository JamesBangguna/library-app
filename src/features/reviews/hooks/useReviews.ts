// src/features/reviews/hooks/useReviews.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { reviewService } from '@/services/review.service';
import { useAppSelector } from '@/store/hooks';

interface ReviewUser {
  id?: string | number;
  name?: string;
  avatar?: string | null;
}

interface Review {
  id: number | string;
  bookId: number | string;
  userId?: string | number;
  rating: number;
  comment: string;
  createdAt: string;
  user?: ReviewUser;
}

interface DeleteReviewContext {
  previous?: Review[];
  bookId?: number | string;
}

interface AuthState {
  auth?: {
    user?: ReviewUser;
  };
}

export function useBookReviews(bookId: string | number) {
  return useQuery({
    queryKey: ['reviews', bookId],
    queryFn: async () => {
      const data = await reviewService.getByBook(bookId);
      if (Array.isArray(data)) return data;
      if (
        data &&
        typeof data === 'object' &&
        'data' in data &&
        Array.isArray((data as { data: unknown }).data)
      ) {
        return (data as { data: Review[] }).data;
      }
      return [];
    },
    enabled: !!bookId,
  });
}

export function useAdminReviews() {
  return useQuery({
    queryKey: ['admin-reviews'],
    queryFn: async () => {
      const data = await reviewService.getAll();
      if (Array.isArray(data)) return data;
      if (
        data &&
        typeof data === 'object' &&
        'data' in data &&
        Array.isArray((data as { data: unknown }).data)
      ) {
        return (data as { data: Review[] }).data;
      }
      return [];
    },
  });
}

/**
 * Optimistic Update: Add Review
 */
export function useCreateReview(bookId: number | string) {
  const queryClient = useQueryClient();
  const { user } = useAppSelector((s) => (s as AuthState).auth || {});

  return useMutation({
    mutationFn: (payload: { rating: number; comment: string }) =>
      reviewService.create({
        bookId: typeof bookId === 'string' ? Number(bookId) : bookId,
        ...payload,
      }),

    onMutate: async (newReview) => {
      await queryClient.cancelQueries({ queryKey: ['reviews', bookId] });
      const previous = queryClient.getQueryData<Review[]>(['reviews', bookId]);

      queryClient.setQueryData<Review[]>(['reviews', bookId], (old = []) => [
        {
          id: Date.now(),
          ...newReview,
          bookId,
          userId: user?.id,
          createdAt: new Date().toISOString(),
          user: { id: user?.id, name: user?.name, avatar: user?.avatar },
        },
        ...old,
      ]);

      return { previousReviews: previous, previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['reviews', bookId], context.previous);
      } else if (context?.previousReviews) {
        queryClient.setQueryData(['reviews', bookId], context.previousReviews);
      }
      toast.error('Gagal menambahkan review');
    },

    onSuccess: () => {
      toast.success('Review berhasil ditambahkan');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', bookId] });
      queryClient.invalidateQueries({ queryKey: ['book', bookId] });
    },
  });
}

/**
 * Optimistic Update: Delete Review
 */
export function useDeleteReview(bookId?: number | string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: number | string) =>
      reviewService.remove(
        typeof reviewId === 'string' ? Number(reviewId) : reviewId
      ),

    onMutate: async (reviewId) => {
      if (bookId) {
        await queryClient.cancelQueries({ queryKey: ['reviews', bookId] });
        const previous = queryClient.getQueryData<Review[]>([
          'reviews',
          bookId,
        ]);

        queryClient.setQueryData<Review[]>(['reviews', bookId], (old = []) =>
          old.filter((r) => r.id !== reviewId)
        );

        return { previous, bookId };
      }
      return {};
    },

    onError: (_err, _id, context: DeleteReviewContext | undefined) => {
      if (context?.previous && context?.bookId) {
        queryClient.setQueryData(['reviews', context.bookId], context.previous);
      }
      toast.error('Gagal menghapus review');
    },

    onSuccess: () => {
      toast.success('Review berhasil dihapus');
    },

    onSettled: (
      _data,
      _error,
      _id,
      context: DeleteReviewContext | undefined
    ) => {
      if (context?.bookId) {
        queryClient.invalidateQueries({
          queryKey: ['reviews', context.bookId],
        });
        queryClient.invalidateQueries({ queryKey: ['book', context.bookId] });
      }
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
    },
  });
}
