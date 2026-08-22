import { useQuery } from '@tanstack/react-query';
import { adminService } from '@/services/admin.service';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: adminService.getStats,
  });
}

export function useRecentActivity() {
  return useQuery({
    queryKey: ['admin-recent'],
    queryFn: adminService.getRecentActivity,
  });
}
