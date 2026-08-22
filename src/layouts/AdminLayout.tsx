// src/layouts/AdminLayout.tsx
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import AdminNavbar from '@/components/layout/AdminNavbar';

export default function AdminLayout() {
  return (
    <div className='flex min-h-screen bg-muted/30'>
      <Sidebar />
      <div className='flex flex-1 flex-col'>
        <AdminNavbar />
        <main className='flex-1 overflow-y-auto p-4 lg:p-6'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
