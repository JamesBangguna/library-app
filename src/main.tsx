// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';

import { store } from '@/store';
import { queryClient } from '@/lib/query-client';
import { router } from '@/routes';
import { ErrorBoundary } from '@/components/ErrorBoundary';

import './index.css';

// Init dark mode
const darkMode = localStorage.getItem('darkMode') === 'true';
if (darkMode) {
  document.documentElement.classList.add('dark');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />

          {/* Toast Notification */}
          <Toaster
            position='top-right'
            richColors
            closeButton
            duration={4000}
            toastOptions={{
              classNames: {
                toast: 'border shadow-lg',
              },
            }}
          />

          {/* React Query Devtools */}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>
);
