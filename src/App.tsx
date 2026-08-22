// src/App.tsx
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const router = createBrowserRouter([
  {
    path: '/',
    element: <div>Home Page</div>,
  },
]);

export function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}

export default App;
