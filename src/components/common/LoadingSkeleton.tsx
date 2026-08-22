// src/components/common/LoadingSkeleton.tsx
import { Skeleton } from '@/components/ui/skeleton';

export function BookGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className='space-y-3'>
          <Skeleton className='aspect-2/3 w-full rounded-xl' />
          <Skeleton className='h-4 w-3/4' />
          <Skeleton className='h-3 w-1/2' />
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className='space-y-3'>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className='h-16 w-full rounded-xl' />
      ))}
    </div>
  );
}

export function CardSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className='h-32 rounded-xl' />
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className='grid gap-8 md:grid-cols-2'>
      <Skeleton className='aspect-2/3 w-full max-w-sm rounded-xl' />
      <div className='space-y-4'>
        <Skeleton className='h-8 w-3/4' />
        <Skeleton className='h-4 w-1/2' />
        <Skeleton className='h-24 w-full' />
        <Skeleton className='h-10 w-40' />
      </div>
    </div>
  );
}
