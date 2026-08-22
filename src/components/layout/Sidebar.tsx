// src/components/layout/Sidebar.tsx
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Tags,
  Users,
  UserRound,
  ClipboardList,
  MessageSquare,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setSidebarOpen } from '@/store/slices/uiSlice';
import { Button } from '@/components/ui/button';

const menuItems = [
  { title: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { title: 'Books', href: '/admin/books', icon: BookOpen },
  { title: 'Categories', href: '/admin/categories', icon: Tags },
  { title: 'Authors', href: '/admin/authors', icon: UserRound },
  { title: 'Users', href: '/admin/users', icon: Users },
  { title: 'Loans', href: '/admin/loans', icon: ClipboardList },
  { title: 'Reviews', href: '/admin/reviews', icon: MessageSquare },
];

export default function Sidebar() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { sidebarOpen } = useAppSelector((state) => state.ui);

  return (
    <>
      {/* Overlay Mobile */}
      {sidebarOpen && (
        <div
          className='fixed inset-0 z-40 bg-black/50 lg:hidden'
          onClick={() => dispatch(setSidebarOpen(false))}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-background transition-transform duration-300 lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className='flex h-16 items-center justify-between border-b px-4'>
          <Link
            to='/admin'
            className='flex items-center gap-2 font-bold text-lg'
          >
            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white'>
              <BookOpen className='h-4 w-4' />
            </div>
            Booky Admin
          </Link>
          <Button
            variant='ghost'
            size='icon'
            className='lg:hidden'
            onClick={() => dispatch(setSidebarOpen(false))}
          >
            <X className='h-5 w-5' />
          </Button>
        </div>

        {/* Menu */}
        <nav className='flex-1 space-y-1 overflow-y-auto p-4'>
          {menuItems.map((item) => {
            const isActive =
              location.pathname === item.href ||
              (item.href !== '/admin' &&
                location.pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => dispatch(setSidebarOpen(false))}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <item.icon className='h-5 w-5' />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
