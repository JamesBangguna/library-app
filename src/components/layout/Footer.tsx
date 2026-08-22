// src/components/layout/Footer.tsx
import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className='border-t bg-background'>
      <div className='container mx-auto px-4 py-10'>
        <div className='flex flex-col items-center gap-4 text-center'>
          <div className='flex items-center gap-2 font-bold text-lg'>
            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white'>
              <BookOpen className='h-4 w-4' />
            </div>
            Booky
          </div>

          <p className='max-w-md text-sm text-muted-foreground'>
            Discover inspiring stories & timeless knowledge, ready to borrow
            anytime. Explore online or visit our nearest library branch.
          </p>

          <div className='flex gap-4 text-sm text-muted-foreground'>
            <Link to='#' className='hover:text-foreground'>
              Facebook
            </Link>
            <Link to='#' className='hover:text-foreground'>
              Instagram
            </Link>
            <Link to='#' className='hover:text-foreground'>
              LinkedIn
            </Link>
            <Link to='#' className='hover:text-foreground'>
              TikTok
            </Link>
          </div>

          <p className='text-xs text-muted-foreground'>
            © {new Date().getFullYear()} Booky. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
