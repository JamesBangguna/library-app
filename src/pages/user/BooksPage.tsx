// src/pages/user/BooksPage.tsx
import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Star, Search } from 'lucide-react';
import { useBooks, useCategories } from '@/features/books/hooks/useBooks';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setSearch, setFilter } from '@/store/slices/uiSlice';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Category {
  id: number | string;
  name: string;
}

interface Author {
  name?: string;
}

interface Book {
  id: number | string;
  title: string;
  coverImage?: string;
  author?: Author;
  rating?: number;
  availableCopies: number;
}

export default function BooksPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const { search, filter } = useAppSelector((s) => s.ui);
  const [page, setPage] = useState(1);

  // Ambil search dari URL saat pertama load / URL berubah
  const urlSearch = searchParams.get('search') || '';

  // Sinkronisasi Redux state via useEffect (eksternal system)
  useEffect(() => {
    if (urlSearch !== search) {
      dispatch(setSearch(urlSearch));
    }
  }, [urlSearch, dispatch, search]);

  // Reset page saat urlSearch berubah menggunakan pattern React yang aman (tanpa effect)
  const [prevUrlSearch, setPrevUrlSearch] = useState(urlSearch);
  if (urlSearch !== prevUrlSearch) {
    setPrevUrlSearch(urlSearch);
    setPage(1);
  }

  const { data, isLoading } = useBooks({
    search: urlSearch || search || undefined,
    categoryId: filter.categoryId,
    sortBy: filter.sortBy ? (filter.sortBy as string) : undefined,
    page,
    limit: 12,
  });

  // Menggunakan type assertion yang aman dari ESLint (tanpa 'any')
  const { data: categoriesData } = useCategories();
  const categories: Category[] = Array.isArray(categoriesData)
    ? categoriesData
    : (categoriesData as { data?: Category[] })?.data || [];

  const books: Book[] = Array.isArray(data) ? data : data?.data || [];
  const meta = data?.meta || null;

  // Handler saat user mengetik di input pencarian halaman Books
  const handleSearchChange = (value: string) => {
    dispatch(setSearch(value));
    setPage(1);

    if (value.trim()) {
      setSearchParams({ search: value.trim() });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Header + Filters */}
      <div className='mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        <h1 className='text-2xl font-bold'>All Books</h1>

        <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
          {/* Search */}
          <div className='relative w-full sm:w-64'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
            <Input
              placeholder='Search book...'
              className='pl-9'
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <Select
            value={filter.categoryId?.toString() || 'all'}
            onValueChange={(val) => {
              dispatch(
                setFilter({
                  categoryId: val === 'all' ? null : Number(val),
                })
              );
              setPage(1);
            }}
          >
            <SelectTrigger className='w-full sm:w-40'>
              <SelectValue placeholder='Category' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Category</SelectItem>
              {categories.map((cat: Category) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select
            value={filter.sortBy || 'newest'}
            onValueChange={(val) =>
              dispatch(
                setFilter({
                  sortBy: (val === 'newest' ? '' : val) as string,
                })
              )
            }
          >
            <SelectTrigger className='w-full sm:w-36'>
              <SelectValue placeholder='Sort by' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='newest'>Newest</SelectItem>
              <SelectItem value='rating'>Highest Rating</SelectItem>
              <SelectItem value='title'>Title A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className='space-y-3'>
              <Skeleton className='aspect-2/3 w-full rounded-lg' />
              <Skeleton className='h-4 w-3/4' />
              <Skeleton className='h-3 w-1/2' />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && books.length === 0 && (
        <div className='flex flex-col items-center justify-center py-20 text-center'>
          <p className='text-lg font-medium'>No books found</p>
          <p className='text-muted-foreground'>
            Try changing your search or filter
          </p>
        </div>
      )}

      {/* Books Grid */}
      {!isLoading && books.length > 0 && (
        <>
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
            {books.map((book: Book) => (
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
                    className='h-full w-full object-cover transition group-hover:scale-105'
                  />
                </div>
                <div className='p-3'>
                  <h3 className='line-clamp-2 text-sm font-semibold leading-tight'>
                    {book.title}
                  </h3>
                  <p className='mt-1 text-xs text-muted-foreground line-clamp-1'>
                    {book.author?.name || 'Unknown Author'}
                  </p>
                  <div className='mt-2 flex items-center justify-between text-xs'>
                    <div className='flex items-center gap-1'>
                      <Star className='h-3.5 w-3.5 fill-yellow-400 text-yellow-400' />
                      <span>{book.rating?.toFixed(1) || '0.0'}</span>
                    </div>
                    <span className='text-muted-foreground'>
                      Stock: {book.availableCopies}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {meta && meta.lastPage > 1 && (
            <div className='mt-8 flex items-center justify-center gap-2'>
              <Button
                variant='outline'
                size='sm'
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className='text-sm text-muted-foreground'>
                Page {page} of {meta.lastPage}
              </span>
              <Button
                variant='outline'
                size='sm'
                disabled={page === meta.lastPage}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
