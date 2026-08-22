// src/pages/admin/DashboardPage.tsx
import { BookOpen, Users, ClipboardList, Activity } from 'lucide-react';
import {
  useDashboardStats,
  useRecentActivity,
} from '@/features/admin/hooks/useDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ActivityItem {
  id?: number | string;
  description?: string;
  createdAt?: string;
  [key: string]: unknown;
}

export default function DashboardPage() {
  const { data: stats, isLoading } = useDashboardStats();
  const { data: activities = [] } = useRecentActivity();

  const cards = [
    {
      title: 'Total Books',
      value: stats?.totalBooks ?? 0,
      icon: BookOpen,
      color: 'text-blue-600',
    },
    {
      title: 'Total Users',
      value: stats?.totalUsers ?? 0,
      icon: Users,
      color: 'text-green-600',
    },
    {
      title: 'Total Loans',
      value: stats?.totalLoans ?? 0,
      icon: ClipboardList,
      color: 'text-purple-600',
    },
    {
      title: 'Active Loans',
      value: stats?.activeLoans ?? 0,
      icon: Activity,
      color: 'text-orange-600',
    },
  ];

  return (
    <div className='space-y-8'>
      <h1 className='text-2xl font-bold'>Dashboard</h1>

      {/* Stats Cards */}
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className='h-32 rounded-xl' />
            ))
          : cards.map((card) => (
              <Card key={card.title}>
                <CardHeader className='flex flex-row items-center justify-between pb-2'>
                  <CardTitle className='text-sm font-medium text-muted-foreground'>
                    {card.title}
                  </CardTitle>
                  <card.icon className={`h-5 w-5 ${card.color}`} />
                </CardHeader>
                <CardContent>
                  <p className='text-3xl font-bold'>{card.value}</p>
                </CardContent>
              </Card>
            ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <p className='text-sm text-muted-foreground'>No recent activity</p>
          ) : (
            <div className='space-y-4'>
              {activities.slice(0, 8).map((item: ActivityItem, i: number) => (
                <div
                  key={item.id ?? i}
                  className='flex items-center justify-between border-b pb-3 last:border-0'
                >
                  <div>
                    <p className='text-sm font-medium'>{item.description}</p>
                    <p className='text-xs text-muted-foreground'>
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleString()
                        : '-'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
