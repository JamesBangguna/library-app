// src/components/layout/AdminNavbar.tsx
import { Menu, Moon, Sun, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleSidebar, toggleDarkMode } from '@/store/slices/uiSlice';
import { useAuth } from '@/features/auth/hooks/useAuth';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function AdminNavbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { darkMode } = useAppSelector((state) => state.ui);
  const { logout } = useAuth();

  return (
    <header className='sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 lg:px-6'>
      <div className='flex items-center gap-3'>
        <Button
          variant='ghost'
          size='icon'
          className='lg:hidden'
          onClick={() => dispatch(toggleSidebar())}
        >
          <Menu className='h-5 w-5' />
        </Button>
        <h1 className='text-lg font-semibold hidden sm:block'>Admin Panel</h1>
      </div>

      <div className='flex items-center gap-2'>
        {/* Dark Mode */}
        <Button
          variant='ghost'
          size='icon'
          onClick={() => dispatch(toggleDarkMode())}
        >
          {darkMode ? (
            <Sun className='h-5 w-5' />
          ) : (
            <Moon className='h-5 w-5' />
          )}
        </Button>

        {/* User */}
        <DropdownMenu>
          <DropdownMenuTrigger className='relative h-9 gap-2 rounded-full pl-2 pr-3 inline-flex items-center justify-center font-medium transition-colors hover:bg-accent hover:text-accent-foreground outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'>
            <Avatar className='h-8 w-8'>
              <AvatarImage src={user?.avatar || undefined} alt={user?.name} />
              <AvatarFallback>
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </AvatarFallback>
            </Avatar>
            <span className='hidden sm:inline text-sm font-medium'>
              {user?.name}
            </span>
          </DropdownMenuTrigger>

          <DropdownMenuContent align='end' className='w-56'>
            <div className='px-2 py-1.5'>
              <p className='text-sm font-medium'>{user?.name}</p>
              <p className='text-xs text-muted-foreground'>{user?.email}</p>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User className='mr-2 h-4 w-4' />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/books')}>
                <User className='mr-2 h-4 w-4' />
                Go to Library
              </DropdownMenuItem>
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
      </div>
    </header>
  );
}
