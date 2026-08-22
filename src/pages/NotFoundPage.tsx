// src/pages/NotFoundPage.tsx
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/store/hooks';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const { isLogin, role } = useAppSelector((state) => state.auth);

  const homePath = isLogin ? (role === 'ADMIN' ? '/admin' : '/books') : '/';

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center'>
      {/* Logo */}
      <div className='mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950'>
        <BookOpen className='h-8 w-8 text-blue-600 dark:text-blue-400' />
      </div>

      {/* 404 Text */}
      <h1 className='text-7xl font-extrabold tracking-tighter text-primary sm:text-8xl'>
        404
      </h1>

      <h2 className='mt-4 text-2xl font-bold tracking-tight sm:text-3xl'>
        Page Not Found
      </h2>

      <p className='mt-3 max-w-md text-muted-foreground'>
        Sorry, the page you are looking for doesn't exist or has been moved.
      </p>

      {/* Actions */}
      <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
        <Button size='lg' onClick={() => navigate(homePath)}>
          <Home className='mr-2 h-4 w-4' />
          Go to Home
        </Button>

        <Button
          variant='outline'
          size='lg'
          onClick={() => window.history.back()}
        >
          <ArrowLeft className='mr-2 h-4 w-4' />
          Go Back
        </Button>
      </div>

      {/* Extra link */}
      <p className='mt-10 text-sm text-muted-foreground'>
        Or explore our{' '}
        <Link
          to='/books'
          className='font-medium text-primary underline-offset-4 hover:underline'
        >
          book collection
        </Link>
      </p>
    </div>
  );
}
