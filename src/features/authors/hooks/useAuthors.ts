import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { authorService } from '@/services/author.service';

export function useAuthors() {
  return useQuery({
    queryKey: ['authors'],
    queryFn: authorService.getAll,
  });
}

export function useCreateAuthor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: authorService.create,
    onSuccess: () => {
      toast.success('Author created');
      qc.invalidateQueries({ queryKey: ['authors'] });
    },
  });
}

export function useUpdateAuthor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...payload
    }: {
      id: number;
      name: string;
      bio?: string;
    }) => authorService.update(id, payload),
    onSuccess: () => {
      toast.success('Author updated');
      qc.invalidateQueries({ queryKey: ['authors'] });
    },
  });
}

export function useDeleteAuthor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: authorService.remove,
    onSuccess: () => {
      toast.success('Author deleted');
      qc.invalidateQueries({ queryKey: ['authors'] });
    },
  });
}
