import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { userService, type UpdateUserPayload } from '@/services/user.service';

export function useUsers(params?: { search?: string; page?: number }) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => userService.getAll(params),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: number } & UpdateUserPayload) =>
      userService.update(id, payload),
    onSuccess: () => {
      toast.success('User updated');
      qc.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: userService.remove,
    onSuccess: () => {
      toast.success('User deleted');
      qc.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
