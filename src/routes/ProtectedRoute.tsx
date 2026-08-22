// src/routes/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';

interface ProtectedRouteProps {
  allowedRoles?: ('USER' | 'ADMIN')[];
}

export default function ProtectedRoute({
  allowedRoles = ['USER', 'ADMIN'],
}: ProtectedRouteProps) {
  const { isLogin, role } = useAppSelector((state) => state.auth);
  const location = useLocation();

  // Belum login → ke halaman login
  if (!isLogin) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  // Role tidak diizinkan
  if (role && !allowedRoles.includes(role)) {
    // Admin mencoba akses user-only atau sebaliknya
    return <Navigate to={role === 'ADMIN' ? '/admin' : '/books'} replace />;
  }

  return <Outlet />;
}
