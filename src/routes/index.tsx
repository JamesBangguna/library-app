/* eslint-disable react-refresh/only-export-components */
// src/routes/index.tsx
import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ProtectedRoute from './ProtectedRoute';

import AuthLayout from '@/layouts/AuthLayout';
import MainLayout from '@/layouts/MainLayout';
import AdminLayout from '@/layouts/AdminLayout';
import { PageLoader } from '@/components/common/PageLoader';

// Lazy pages
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const HomePage = lazy(() => import('@/pages/user/HomePage'));
const BooksPage = lazy(() => import('@/pages/user/BooksPage'));
const BookDetailPage = lazy(() => import('@/pages/user/BookDetailPage'));
const MyLoansPage = lazy(() => import('@/pages/user/MyLoansPage'));
const ProfilePage = lazy(() => import('@/pages/user/ProfilePage'));

const AdminDashboardPage = lazy(() => import('@/pages/admin/DashboardPage'));
const AdminBooksPage = lazy(() => import('@/pages/admin/BooksPage'));
const AdminCategoriesPage = lazy(() => import('@/pages/admin/CategoriesPage'));
const AdminUsersPage = lazy(() => import('@/pages/admin/UsersPage'));
const AdminLoansPage = lazy(() => import('@/pages/admin/LoansPage'));
const AdminReviewsPage = lazy(() => import('@/pages/admin/ReviewsPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

export const router = createBrowserRouter([
  // ======================
  // PUBLIC — Auth pages
  // ======================
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: (
          <Suspense fallback={<PageLoader />}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: '/register',
        element: (
          <Suspense fallback={<PageLoader />}>
            <RegisterPage />
          </Suspense>
        ),
      },
    ],
  },

  // ======================
  // PUBLIC — Home (Before Login)
  // ======================
  {
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: (
          <Suspense fallback={<PageLoader />}>
            <HomePage />
          </Suspense>
        ),
      },
    ],
  },

  // ======================
  // PROTECTED — User routes
  // ======================
  {
    element: <ProtectedRoute allowedRoles={['USER', 'ADMIN']} />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: '/books',
            element: (
              <Suspense fallback={<PageLoader />}>
                <BooksPage />
              </Suspense>
            ),
          },
          {
            path: '/books/:id',
            element: (
              <Suspense fallback={<PageLoader />}>
                <BookDetailPage />
              </Suspense>
            ),
          },
          {
            path: '/my-loans',
            element: (
              <Suspense fallback={<PageLoader />}>
                <MyLoansPage />
              </Suspense>
            ),
          },
          {
            path: '/profile',
            element: (
              <Suspense fallback={<PageLoader />}>
                <ProfilePage />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },

  // ======================
  // PROTECTED — Admin routes
  // ======================
  {
    element: <ProtectedRoute allowedRoles={['ADMIN']} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            path: '/admin',
            element: (
              <Suspense fallback={<PageLoader />}>
                <AdminDashboardPage />
              </Suspense>
            ),
          },
          {
            path: '/admin/books',
            element: (
              <Suspense fallback={<PageLoader />}>
                <AdminBooksPage />
              </Suspense>
            ),
          },
          {
            path: '/admin/categories',
            element: (
              <Suspense fallback={<PageLoader />}>
                <AdminCategoriesPage />
              </Suspense>
            ),
          },

          {
            path: '/admin/users',
            element: (
              <Suspense fallback={<PageLoader />}>
                <AdminUsersPage />
              </Suspense>
            ),
          },
          {
            path: '/admin/loans',
            element: (
              <Suspense fallback={<PageLoader />}>
                <AdminLoansPage />
              </Suspense>
            ),
          },
          {
            path: '/admin/reviews',
            element: (
              <Suspense fallback={<PageLoader />}>
                <AdminReviewsPage />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },

  // 404
  {
    path: '*',
    element: (
      <Suspense fallback={<PageLoader />}>
        <NotFoundPage />
      </Suspense>
    ),
  },
]);
