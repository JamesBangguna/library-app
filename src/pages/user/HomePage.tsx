// src/pages/user/HomePage.tsx
import { Link } from 'react-router-dom';
import { Star, ArrowRight, BookOpen } from 'lucide-react';
import { useBooks, useCategories } from '@/features/books/hooks/useBooks';
import { useAuthors } from '@/features/authors/hooks/useAuthors';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Book } from '@/types/book';

interface Category {
  id: number | string;
  name: string;
}

interface Author {
  id: number | string;
  name: string;
  avatar?: string;
  bookCount?: number;
  _count?: { books?: number };
}

const CATEGORY_ICONS: Record<string, string> = {
  Fiction: '/icons/fiction.png',
  'Non-Fiction': '/icons/non-fiction.png',
  'Self-Improvement': '/icons/self-improvement.png',
  Finance: '/icons/finance.png',
  Science: '/icons/science.png',
  'Science & Technology': '/icons/science.png',
  Education: '/icons/education.png',
};

const CATEGORY_ORDER = [
  'Fiction',
  'Non-Fiction',
  'Self-Improvement',
  'Finance',
  'Science & Technology',
  'Education',
];

export default function HomePage() {
  const { data: booksData, isLoading: booksLoading } = useBooks({
    limit: 10,
    sortBy: 'rating',
  });
  const { data: categoriesData, isLoading: catLoading } = useCategories();
  const { data: authorsData, isLoading: authorsLoading } = useAuthors();

  const books: Book[] = Array.isArray(booksData)
    ? booksData
    : (booksData as { data?: Book[] })?.data || [];

  const categories: Category[] = Array.isArray(categoriesData)
    ? categoriesData
    : (categoriesData as { categories?: Category[] })?.categories || [];

  const authors: Author[] = Array.isArray(authorsData)
    ? authorsData
    : (authorsData as { authors?: Author[] })?.authors || [];

  return (
    <div className='min-h-screen bg-background'>
      {/* ===== HERO ===== */}
      <section className='w-full'>
        <div className='mx-auto w-full max-w-6xl px-4 pt-6 md:px-6 md:pt-8'>
          <div className='relative overflow-hidden rounded-2xl bg-linear-to-br from-sky-100 via-blue-50 to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800'>
            <img
              src='/banner/welcome-banner.png'
              alt='Welcome to Booky'
              className='h-auto w-full object-cover'
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            {/* Fallback text jika banner image belum ada */}
            <div className='relative flex min-h-45 items-center justify-center px-4 py-10 sm:min-h-55 md:min-h-65'>
              <h1 className='text-center text-3xl font-extrabold tracking-tight text-blue-600 dark:text-blue-400 sm:text-4xl md:text-5xl'>
                Welcome to
                <br />
                Booky
              </h1>
            </div>
            {/* Dots */}
            <div className='absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5'>
              <span className='h-2 w-2 rounded-full bg-blue-500' />
              <span className='h-2 w-2 rounded-full bg-blue-300/80' />
              <span className='h-2 w-2 rounded-full bg-blue-300/80' />
            </div>
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className='w-full'>
        <div className='mx-auto w-full max-w-6xl px-4 py-8 md:px-6'>
          {catLoading ? (
            <div className='grid grid-cols-3 gap-3 md:grid-cols-6'>
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className='h-24 rounded-2xl' />
              ))}
            </div>
          ) : (
            <div className='grid grid-cols-3 gap-3 md:grid-cols-6 md:gap-4'>
              {CATEGORY_ORDER.map((name) => {
                const cat = categories.find((c) =>
                  c.name
                    ?.toLowerCase()
                    .includes(name.toLowerCase().split(' ')[0])
                );
                const iconSrc = CATEGORY_ICONS[name] || '/icons/fiction.png';

                return (
                  <Link
                    key={name}
                    to={cat?.id ? `/books?categoryId=${cat.id}` : '/books'}
                    className='group flex flex-col items-center justify-center gap-2 rounded-2xl border bg-card p-3 transition hover:border-blue-200 hover:shadow-md sm:p-4'
                  >
                    <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40 sm:h-12 sm:w-12'>
                      <img
                        src={iconSrc}
                        alt={name}
                        className='h-6 w-6 object-contain sm:h-7 sm:w-7'
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://cdn-icons-png.flaticon.com/512/2232/2232688.png';
                        }}
                      />
                    </div>
                    <span className='text-center text-[10px] font-medium leading-tight sm:text-xs md:text-sm'>
                      {name}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ===== RECOMMENDATION ===== */}
      <section className='w-full'>
        <div className='mx-auto w-full max-w-6xl px-4 py-6 md:px-6'>
          <div className='mb-5 flex items-center justify-between'>
            <h2 className='text-xl font-bold sm:text-2xl'>Recommendation</h2>
            <Button variant='ghost' size='sm' className='text-muted-foreground'>
              <Link to='/books' className='flex items-center'>
                See All <ArrowRight className='ml-1 h-4 w-4' />
              </Link>
            </Button>
          </div>

          {booksLoading ? (
            <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className='space-y-2'>
                  <Skeleton className='aspect-2/3 w-full rounded-xl' />
                  <Skeleton className='h-4 w-3/4' />
                  <Skeleton className='h-3 w-1/2' />
                </div>
              ))}
            </div>
          ) : books.length === 0 ? (
            <div className='rounded-xl border border-dashed py-16 text-center text-muted-foreground'>
              No books available yet.
            </div>
          ) : (
            <>
              <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
                {books.slice(0, 10).map((book: Book) => (
                  <Link
                    key={book.id}
                    to={`/books/${book.id}`}
                    className='group overflow-hidden rounded-xl border bg-card transition hover:shadow-md'
                  >
                    <div className='aspect-2/3 overflow-hidden bg-muted'>
                      <img
                        src={
                          book.coverImage ||
                          `https://picsum.photos/seed/${book.id}/300/450`
                        }
                        alt={book.title}
                        className='h-full w-full object-cover transition duration-300 group-hover:scale-105'
                        loading='lazy'
                      />
                    </div>
                    <div className='p-2.5 sm:p-3'>
                      <h3 className='line-clamp-2 text-xs font-semibold leading-snug sm:text-sm'>
                        {book.title}
                      </h3>
                      <p className='mt-0.5 line-clamp-1 text-[11px] text-muted-foreground sm:text-xs'>
                        {book.author?.name || 'Unknown Author'}
                      </p>
                      <div className='mt-1.5 flex items-center gap-1 text-[11px] sm:text-xs'>
                        <Star className='h-3 w-3 fill-yellow-400 text-yellow-400' />
                        <span className='font-medium'>
                          {Number(book.rating || 0).toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className='mt-8 flex justify-center'>
                <Button variant='outline' className='rounded-full px-8'>
                  <Link to='/books'>Load More</Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ===== POPULAR AUTHORS ===== */}
      <section className='w-full'>
        <div className='mx-auto w-full max-w-6xl px-4 py-8 md:px-6'>
          <h2 className='mb-5 text-xl font-bold sm:text-2xl'>
            Popular Authors
          </h2>

          {authorsLoading ? (
            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4'>
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className='h-20 rounded-xl' />
              ))}
            </div>
          ) : (
            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4'>
              {(authors.length > 0 ? authors.slice(0, 4) : [1, 2, 3, 4]).map(
                (author: Author | number, i: number) => {
                  const authorObj =
                    typeof author === 'object'
                      ? author
                      : { id: author, name: 'Author name', bookCount: 5 };

                  return (
                    <div
                      key={authorObj.id ?? i}
                      className='flex items-center gap-3 rounded-xl border bg-card p-3 transition hover:shadow-md sm:p-4'
                    >
                      <img
                        src={
                          authorObj.avatar ||
                          `https://i.pravatar.cc/150?img=${Number(authorObj.id || i) + 12}`
                        }
                        alt={authorObj.name || 'Author'}
                        className='h-12 w-12 shrink-0 rounded-full object-cover'
                      />
                      <div className='min-w-0'>
                        <p className='truncate text-sm font-semibold'>
                          {authorObj.name || 'Author name'}
                        </p>
                        <p className='mt-0.5 flex items-center gap-1 text-xs text-muted-foreground'>
                          <BookOpen className='h-3 w-3' />
                          {authorObj.bookCount ??
                            authorObj._count?.books ??
                            5}{' '}
                          books
                        </p>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
