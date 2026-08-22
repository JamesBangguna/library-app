// src/pages/admin/AuthorsPage.tsx
import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { authorService } from '@/services/author.service';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

interface Author {
  id: number;
  name: string;
  bio?: string;
}

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  bio: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function AuthorsPage() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Author | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const qc = useQueryClient();

  const { data: authors = [], isLoading } = useQuery({
    queryKey: ['authors'],
    queryFn: authorService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: authorService.create,
    onSuccess: () => {
      toast.success('Author created');
      qc.invalidateQueries({ queryKey: ['authors'] });
      setOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...payload }: { id: number } & FormValues) =>
      authorService.update(id, payload),
    onSuccess: () => {
      toast.success('Author updated');
      qc.invalidateQueries({ queryKey: ['authors'] });
      setOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: authorService.remove,
    onSuccess: () => {
      toast.success('Author deleted');
      qc.invalidateQueries({ queryKey: ['authors'] });
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', bio: '' },
  });

  const openCreate = () => {
    setEditing(null);
    form.reset({ name: '', bio: '' });
    setOpen(true);
  };

  const openEdit = (item: Author) => {
    setEditing(item);
    form.reset({ name: item.name, bio: item.bio || '' });
    setOpen(true);
  };

  const onSubmit = (values: FormValues) => {
    if (editing) {
      updateMutation.mutate({ id: editing.id, ...values });
    } else {
      createMutation.mutate(values);
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Authors</h1>
        <Button onClick={openCreate}>
          <Plus className='mr-2 h-4 w-4' />
          Add Author
        </Button>
      </div>

      {isLoading ? (
        <div className='space-y-3'>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className='h-14 w-full' />
          ))}
        </div>
      ) : (
        <div className='rounded-xl border'>
          {((authors as Author[]) || []).map((author: Author) => (
            <div
              key={author.id}
              className='flex items-center justify-between border-b px-4 py-3 last:border-0'
            >
              <div>
                <span className='font-medium'>{author.name}</span>
                {author.bio && (
                  <p className='text-sm text-muted-foreground line-clamp-1'>
                    {author.bio}
                  </p>
                )}
              </div>
              <div className='flex gap-2'>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => openEdit(author)}
                >
                  <Pencil className='h-4 w-4' />
                </Button>
                <Button
                  variant='ghost'
                  size='icon'
                  className='text-red-500'
                  onClick={() => setDeleteId(author.id)}
                >
                  <Trash2 className='h-4 w-4' />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Author' : 'Add Author'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='bio'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder='Author biography...' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type='submit'>{editing ? 'Save' : 'Create'}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Author?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className='bg-red-600'
              onClick={() => {
                if (deleteId !== null) deleteMutation.mutate(deleteId);
                setDeleteId(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
