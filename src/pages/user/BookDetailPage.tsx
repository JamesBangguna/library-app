// src/pages/user/BookDetailPage.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ArrowLeft, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useBook } from '@/features/books/hooks/useBooks';
import { useBorrowBook } from '@/features/loans/hooks/useLoans';
import {
  useBookReviews,
  useCreateReview,
  useDeleteReview,
} from '@/features/reviews/hooks/useReviews';
import { useAppSelector } from '@/store/hooks';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(3, 'Minimal 3 karakter'),
});

type ReviewForm = z.infer<typeof reviewSchema>;

interface ReviewItem {
  id: number | string;
  userId?: number | string; // Diubah menjadi opsional agar kompatibel dengan tipe bawaan
  rating?: number;
  star?: number;
  comment: string;
  user?: {
    name?: string;
  };
}

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.auth);

  const { data: book, isLoading } = useBook(id!);

  // Ambil data review sebagai array
  const { data: reviewsData } = useBookReviews(id!);
  const reviews: ReviewItem[] = Array.isArray(reviewsData) ? reviewsData : [];

  const borrowMutation = useBorrowBook();
  const createReview = useCreateReview(id!);
  const deleteReview = useDeleteReview(id!);

  const form = useForm<ReviewForm>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 5, comment: '' },
  });

  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='grid gap-8 md:grid-cols-2'>
          <Skeleton className='aspect-2/3 w-full max-w-sm rounded-xl' />
          <div className='space-y-4'>
            <Skeleton className='h-8 w-3/4' />
            <Skeleton className='h-4 w-1/2' />
            <Skeleton className='h-24 w-full' />
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className='container mx-auto py-20 text-center'>
        <p>Book not found</p>
        <Button className='mt-4' onClick={() => navigate('/books')}>
          Back to Books
        </Button>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <Button
        variant='ghost'
        className='mb-6'
        onClick={() => navigate('/books')}
      >
        <span className='flex items-center'>
          <ArrowLeft className='mr-2 h-4 w-4' />
          Back
        </span>
      </Button>

      <div className='grid gap-8 lg:grid-cols-2'>
        {/* Cover */}
        <div className='flex justify-center lg:justify-start'>
          <img
            src={
              book.coverImage || `https://picsum.photos/seed/${book.id}/400/600`
            }
            alt={book.title}
            className='w-full max-w-sm rounded-xl shadow-lg object-cover'
          />
        </div>

        {/* Info */}
        <div className='space-y-6'>
          <div>
            <span className='inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary'>
              {book.category?.name || 'Uncategorized'}
            </span>
            <h1 className='mt-3 text-3xl font-bold'>{book.title}</h1>
            <p className='mt-1 text-muted-foreground'>
              {book.author?.name || 'Unknown Author'}
            </p>

            <div className='mt-3 flex items-center gap-4 text-sm'>
              <div className='flex items-center gap-1'>
                <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
                <span className='font-medium'>{book.rating?.toFixed(1)}</span>
                <span className='text-muted-foreground'>
                  ({book.reviewCount} reviews)
                </span>
              </div>
              <span>
                Stock:{' '}
                <strong>
                  {book.availableCopies}/{book.totalCopies}
                </strong>
              </span>
            </div>
          </div>

          <div>
            <h3 className='font-semibold'>Description</h3>
            <p className='mt-2 text-muted-foreground leading-relaxed'>
              {book.description || 'No description available.'}
            </p>
          </div>

          <Button
            size='lg'
            className='w-full sm:w-auto'
            disabled={book.availableCopies <= 0 || borrowMutation.isPending}
            onClick={() => borrowMutation.mutate({ bookId: Number(book.id) })}
          >
            {borrowMutation.isPending ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Processing...
              </>
            ) : book.availableCopies <= 0 ? (
              'Out of Stock'
            ) : (
              'Borrow Book'
            )}
          </Button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className='mt-12 border-t pt-8'>
        <h2 className='text-xl font-bold mb-6'>Reviews</h2>

        {/* Form Tambah Review */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => {
              createReview.mutate(
                {
                  rating: values.rating, // atau star: values.rating
                  comment: values.comment,
                },
                {
                  onSuccess: () => form.reset({ rating: 5, comment: '' }),
                }
              );
            })}
            className='mb-8 space-y-4 rounded-xl border p-4'
          >
            <FormField
              control={form.control}
              name='rating'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <div className='flex gap-1'>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type='button'
                          onClick={() => field.onChange(star)}
                        >
                          <Star
                            className={`h-6 w-6 ${
                              star <= field.value
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-muted-foreground'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='comment'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment</FormLabel>
                  <FormControl>
                    <textarea
                      placeholder='Write your review...'
                      className='flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type='submit' disabled={createReview.isPending}>
              {createReview.isPending ? 'Submitting...' : 'Submit Review'}
            </Button>
          </form>
        </Form>

        {/* List Review */}
        <div className='space-y-4'>
          {reviews.length === 0 && (
            <p className='text-muted-foreground'>No reviews yet.</p>
          )}

          {reviews.map((review) => (
            <div key={review.id} className='rounded-xl border p-4'>
              <div className='flex items-start justify-between'>
                <div>
                  <p className='font-medium'>
                    {review.user?.name || 'Anonymous'}
                  </p>
                  <div className='mt-1 flex items-center gap-1'>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${
                          i < (review.star ?? review.rating ?? 0)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-muted-foreground'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {user?.id === review.userId && (
                  <Button
                    variant='ghost'
                    size='sm'
                    className='text-red-500'
                    onClick={() => deleteReview.mutate(review.id)}
                  >
                    Delete
                  </Button>
                )}
              </div>
              <p className='mt-2 text-sm text-muted-foreground'>
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
