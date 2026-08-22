// src/pages/admin/ReviewsPage.tsx
import { useState } from 'react';
import { Trash2, Star } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { reviewService } from '@/services/review.service';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Review {
  id: number;
  rating: number;
  comment: string;
  bookId: number;
  userId: number;
  createdAt?: string;
  user?: {
    name: string;
  };
  book?: {
    title: string;
  };
}

export default function ReviewsPage() {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-reviews'],
    queryFn: reviewService.getAll,
  });

  const reviews: Review[] =
    (data as { data?: Review[] })?.data || (data as Review[]) || [];

  const deleteMutation = useMutation({
    mutationFn: reviewService.remove,
    onSuccess: () => {
      toast.success('Review deleted');
      qc.invalidateQueries({ queryKey: ['admin-reviews'] });
    },
  });

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold'>Reviews</h1>

      {isLoading ? (
        <div className='space-y-3'>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className='h-24 w-full' />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <p className='text-muted-foreground'>No reviews yet.</p>
      ) : (
        <div className='space-y-3'>
          {reviews.map((review: Review) => (
            <div
              key={review.id}
              className='flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-start sm:justify-between'
            >
              <div>
                <div className='flex items-center gap-2'>
                  <p className='font-medium'>
                    {review.user?.name || 'Anonymous'}
                  </p>
                  <div className='flex'>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${
                          i < review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-muted-foreground'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className='mt-1 text-sm text-muted-foreground'>
                  Book: {review.book?.title || review.bookId}
                </p>
                <p className='mt-2 text-sm'>{review.comment}</p>
                <p className='mt-1 text-xs text-muted-foreground'>
                  {review.createdAt
                    ? format(new Date(review.createdAt), 'dd MMM yyyy HH:mm')
                    : ''}
                </p>
              </div>

              <Button
                variant='ghost'
                size='icon'
                className='text-red-500'
                onClick={() => setDeleteId(review.id)}
              >
                <Trash2 className='h-4 w-4' />
              </Button>
            </div>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className='bg-red-600'
              onClick={() => {
                if (deleteId !== null) deleteMutation.mutate(deleteId);
                setDeleteId(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
