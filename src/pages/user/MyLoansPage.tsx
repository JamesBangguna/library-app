// src/pages/user/MyLoansPage.tsx
import { Link } from 'react-router-dom';
import { format, isValid, parseISO } from 'date-fns';
import { useMyLoans } from '@/features/loans/hooks/useLoans';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Loan } from '@/types/loan';

/** Format tanggal aman — tidak throw error */
function formatDate(value?: string | null) {
  if (!value) return '-';
  const date = value.includes('T') ? parseISO(value) : new Date(value);
  if (!isValid(date)) return '-';
  return format(date, 'dd MMM yyyy');
}

export default function MyLoansPage() {
  const { data: loansData, isLoading } = useMyLoans() as unknown as {
    data: Loan[] | { data: Loan[] };
    isLoading: boolean;
  };

  const loans = Array.isArray(loansData)
    ? loansData
    : (loansData as { data?: Loan[] })?.data || [];

  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-8 space-y-4'>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className='h-24 w-full rounded-xl' />
        ))}
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='mb-6 text-2xl font-bold'>My Loans</h1>

      {loans.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-20 text-center'>
          <p className='text-lg font-medium'>No loans yet</p>
          <p className='text-muted-foreground mb-4'>
            Start borrowing books from our collection
          </p>
          <Button onClick={() => (window.location.href = '/books')}>
            Browse Books
          </Button>
        </div>
      ) : (
        <div className='space-y-4'>
          {loans.map((loan: Loan) => (
            <div
              key={loan.id}
              className='flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center'
            >
              <img
                src={
                  loan.book?.coverImage ||
                  `https://picsum.photos/seed/${loan.bookId}/80/120`
                }
                alt={loan.book?.title}
                className='h-28 w-20 rounded object-cover'
              />

              <div className='flex-1'>
                <Link
                  to={`/books/${loan.bookId}`}
                  className='font-semibold hover:underline'
                >
                  {loan.book?.title || 'Unknown Book'}
                </Link>
                <p className='text-sm text-muted-foreground'>
                  {loan.book?.author?.name || '-'}
                </p>

                <div className='mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground'>
                  <span>Borrowed: {formatDate(loan.borrowDate)}</span>
                  <span>Due: {formatDate(loan.dueDate)}</span>
                  {loan.returnDate && (
                    <span>Returned: {formatDate(loan.returnDate)}</span>
                  )}
                </div>
              </div>

              <Badge
                variant={
                  loan.status === 'RETURNED'
                    ? 'secondary'
                    : loan.status === 'OVERDUE'
                      ? 'destructive'
                      : 'default'
                }
              >
                {loan.status || '-'}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
