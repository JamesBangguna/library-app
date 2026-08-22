import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { categoryService } from '@/services/category.service';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getAll,
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: categoryService.create,
    onSuccess: () => {
      toast.success('Category created');
      qc.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: number; name: string }) =>
      categoryService.update(id, payload),
    onSuccess: () => {
      toast.success('Category updated');
      qc.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: categoryService.remove,
    onSuccess: () => {
      toast.success('Category deleted');
      qc.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}
