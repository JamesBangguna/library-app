// src/layouts/AuthLayout.tsx
import { Outlet, Navigate } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';

export default function AuthLayout() {
  const { isLogin, role } = useAppSelector((state) => state.auth);

  // Jika sudah login, redirect
  if (isLogin) {
    return <Navigate to={role === 'ADMIN' ? '/admin' : '/books'} replace />;
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-background px-4'>
      <div className='w-full max-w-md'>
        <Outlet />
      </div>
    </div>
  );
}
