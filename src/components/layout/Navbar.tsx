// src/components/layout/Navbar.tsx
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  Moon,
  Sun,
  Menu,
  LogOut,
  User,
  BookOpen,
  ChevronDown,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleDarkMode, setSearch } from '@/store/slices/uiSlice';
import { useAuth } from '@/features/auth/hooks/useAuth';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isLogin } = useAppSelector((state) => state.auth);
  const { darkMode, search } = useAppSelector((state) => state.ui);
  const cartCount = useAppSelector((state) => state.cart?.items?.length || 0);
  const { logout } = useAuth();

  // Type assertion aman menggunakan unknown casting agar lolos TypeScript & ESLint
  const userAvatar =
    user?.avatar ||
    (user as unknown as { profilePhoto?: string })?.profilePhoto ||
    undefined;

  // Handler search terpusat
  const handleSearch = () => {
    const q = search.trim();
    navigate(q ? `/books?search=${encodeURIComponent(q)}` : '/books');
  };

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60'>
      {/* Container rata kiri-kanan */}
      <div className='mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 md:px-6'>
        {/* ===== LEFT: Logo + Mobile Menu ===== */}
        <div className='flex items-center gap-2'>
          {/* Hamburger mobile */}
          <Sheet>
            <SheetTrigger>
              <span className='inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9 md:hidden cursor-pointer'>
                <Menu className='h-5 w-5' />
              </span>
            </SheetTrigger>
            <SheetContent side='left' className='w-72'>
              <nav className='mt-8 flex flex-col gap-1'>
                <Link
                  to='/'
                  className='rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-accent'
                >
                  Home
                </Link>
                <Link
                  to='/books'
                  className='rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-accent'
                >
                  Books
                </Link>
                {isLogin && (
                  <>
                    <Link
                      to='/my-loans'
                      className='rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-accent'
                    >
                      My Loans
                    </Link>
                    <Link
                      to='/profile'
                      className='rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-accent'
                    >
                      Profile
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link to='/' className='flex items-center gap-2'>
            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white'>
              <BookOpen className='h-4 w-4' />
            </div>
            <span className='text-lg font-bold tracking-tight'>Booky</span>
          </Link>
        </div>

        {/* ===== CENTER: Search (hanya setelah login - Desktop) ===== */}
        {isLogin && (
          <div className='hidden flex-1 justify-center md:flex'>
            <div className='relative w-full max-w-md flex items-center gap-1'>
              <div className='relative w-full'>
                <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                <Input
                  placeholder='Search book'
                  className='h-10 rounded-full border-muted bg-muted/40 pl-10 pr-4'
                  value={search}
                  onChange={(e) => dispatch(setSearch(e.target.value))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearch();
                  }}
                />
              </div>
              <Button
                variant='ghost'
                size='icon'
                onClick={handleSearch}
                className='shrink-0 rounded-full'
              >
                <Search className='h-4 w-4' />
              </Button>
            </div>
          </div>
        )}

        {/* ===== RIGHT ===== */}
        <div className='flex items-center gap-1 sm:gap-2'>
          {/* Dark mode */}
          <Button
            variant='ghost'
            size='icon'
            className='hidden sm:inline-flex'
            onClick={() => dispatch(toggleDarkMode())}
          >
            {darkMode ? (
              <Sun className='h-5 w-5' />
            ) : (
              <Moon className='h-5 w-5' />
            )}
          </Button>

          {isLogin ? (
            <>
              {/* Cart dengan badge */}
              <Button
                variant='ghost'
                size='icon'
                className='relative'
                onClick={() => navigate('/my-loans')}
              >
                <ShoppingCart className='h-5 w-5' />
                {cartCount > 0 && (
                  <Badge className='absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] text-white hover:bg-red-500'>
                    {cartCount}
                  </Badge>
                )}
              </Button>

              {/* User dropdown: Avatar + Nama + Chevron */}
              <DropdownMenu>
                <DropdownMenuTrigger className='outline-none'>
                  <div className='flex h-9 items-center gap-2 rounded-full pl-1.5 pr-2 hover:bg-accent cursor-pointer'>
                    <Avatar className='h-8 w-8'>
                      <AvatarImage src={userAvatar} alt={user?.name} />
                      <AvatarFallback className='bg-blue-100 text-sm font-semibold text-blue-700'>
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className='hidden max-w-100px truncate text-sm font-medium sm:inline'>
                      {user?.name || 'User'}
                    </span>
                    <ChevronDown className='hidden h-4 w-4 text-muted-foreground sm:inline' />
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent align='end' className='w-56'>
                  <div className='px-2 py-1.5'>
                    <p className='text-sm font-medium'>{user?.name}</p>
                    <p className='text-xs text-muted-foreground'>
                      {user?.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className='mr-2 h-4 w-4' />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/my-loans')}>
                      <BookOpen className='mr-2 h-4 w-4' />
                      My Loans
                    </DropdownMenuItem>
                    {user?.role === 'ADMIN' && (
                      <DropdownMenuItem onClick={() => navigate('/admin')}>
                        <BookOpen className='mr-2 h-4 w-4' />
                        Admin Dashboard
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className='text-red-600 focus:text-red-600'
                  >
                    <LogOut className='mr-2 h-4 w-4' />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            /* Before login: Login + Register */
            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                className='rounded-full px-5'
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
              <Button
                className='rounded-full px-5'
                onClick={() => navigate('/register')}
              >
                Register
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Search bar mobile (setelah login) */}
      {isLogin && (
        <div className='border-t px-4 py-2 md:hidden'>
          <div className='relative mx-auto flex max-w-6xl items-center gap-1'>
            <div className='relative w-full'>
              <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
              <Input
                placeholder='Search book'
                className='h-9 rounded-full bg-muted/40 pl-10 pr-4'
                value={search}
                onChange={(e) => dispatch(setSearch(e.target.value))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearch();
                }}
              />
            </div>
            <Button
              variant='ghost'
              size='icon'
              onClick={handleSearch}
              className='shrink-0 rounded-full'
            >
              <Search className='h-4 w-4' />
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
