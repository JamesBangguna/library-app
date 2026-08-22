import api from '@/api/axios';

export const adminService = {
  getStats: async () => {
    const { data } = await api.get('/admin/stats');
    return data; // { totalBooks, totalUsers, totalLoans, activeLoans }
  },

  getRecentActivity: async () => {
    const { data } = await api.get('/admin/recent-activity');
    return data;
  },
};
