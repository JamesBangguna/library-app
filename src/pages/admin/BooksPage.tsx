// src/pages/admin/BooksPage.tsx
import { useState } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import {
  useAdminBooks,
  useCreateBook,
  useUpdateBook,
  useDeleteBook,
} from '@/features/admin/hooks/useAdminBooks';
import { useCategories } from '@/features/books/hooks/useBooks';
import { authorService } from '@/services/author.service';
import { useQuery } from '@tanstack/react-query';
import { Book } from '@/types/book';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface Category {
  id: number | string;
  name: string;
}

const bookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  authorId: z.string().min(1, 'Author is required'),
  categoryId: z.string().min(1, 'Category is required'),
  description: z.string().optional(),
  totalCopies: z.coerce.number().min(1),
  coverImage: z.string().optional(),
});

type BookForm = z.infer<typeof bookSchema>;

export default function AdminBooksPage() {
  const [search, setSearch] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading } = useAdminBooks({ search, limit: 50 });
  const { data: categories } = useCategories();
  const { data: authors } = useQuery({
    queryKey: ['authors'],
    queryFn: authorService.getAll,
  });

  const createMutation = useCreateBook();
  const updateMutation = useUpdateBook();
  const deleteMutation = useDeleteBook();

  const books: Book[] = Array.isArray(data)
    ? data
    : (data as { data?: Book[] })?.data || [];

  const form = useForm<BookForm>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: '',
      authorId: '',
      categoryId: '',
      description: '',
      totalCopies: 1,
      coverImage: '',
    },
  });

  const openCreate = () => {
    setEditingBook(null);
    form.reset({
      title: '',
      authorId: '',
      categoryId: '',
      description: '',
      totalCopies: 1,
      coverImage: '',
    });
    setOpenDialog(true);
  };

  const openEdit = (book: Book) => {
    setEditingBook(book);
    form.reset({
      title: book.title,
      authorId: String(book.authorId || ''),
      categoryId: String(book.categoryId || ''),
      description: book.description || '',
      totalCopies: book.totalCopies,
      coverImage: book.coverImage || '',
    });
    setOpenDialog(true);
  };

  const onSubmit = (values: BookForm) => {
    const payload = {
      ...values,
      authorId: Number(values.authorId),
      categoryId: Number(values.categoryId),
      coverImage:
        values.coverImage ||
        `https://picsum.photos/seed/${crypto.randomUUID()}/400/600`,
    };

    if (editingBook) {
      updateMutation.mutate(
        { id: Number(editingBook.id), ...payload },
        { onSuccess: () => setOpenDialog(false) }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => setOpenDialog(false),
      });
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <h1 className='text-2xl font-bold'>Books</h1>
        <Button onClick={openCreate}>
          <Plus className='mr-2 h-4 w-4' />
          Add Book
        </Button>
      </div>

      {/* Search */}
      <div className='relative max-w-sm'>
        <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
        <Input
          placeholder='Search books...'
          className='pl-9'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* List */}
      {isLoading ? (
        <div className='space-y-3'>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className='h-20 w-full rounded-xl' />
          ))}
        </div>
      ) : (
        <div className='space-y-3'>
          {books.map((book: Book) => (
            <div
              key={book.id}
              className='flex flex-col gap-4 rounded-xl border bg-card p-4 sm:flex-row sm:items-center'
            >
              <img
                src={
                  book.coverImage ||
                  `https://picsum.photos/seed/${book.id}/80/120`
                }
                alt={book.title}
                className='h-24 w-16 rounded object-cover'
              />
              <div className='flex-1'>
                <h3 className='font-semibold'>{book.title}</h3>
                <p className='text-sm text-muted-foreground'>
                  {book.author?.name} • {book.category?.name}
                </p>
                <div className='mt-1 flex gap-2 text-xs'>
                  <Badge variant='secondary'>
                    Stock: {book.availableCopies}/{book.totalCopies}
                  </Badge>
                  <Badge variant='outline'>★ {book.rating?.toFixed(1)}</Badge>
                </div>
              </div>
              <div className='flex gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => openEdit(book)}
                >
                  <Pencil className='h-4 w-4' />
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  className='text-red-500'
                  onClick={() => setDeleteId(Number(book.id))}
                >
                  <Trash2 className='h-4 w-4' />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-lg'>
          <DialogHeader>
            <DialogTitle>{editingBook ? 'Edit Book' : 'Add Book'}</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='authorId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select author' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {((authors as Category[]) || []).map((a: Category) => (
                          <SelectItem key={a.id} value={String(a.id)}>
                            {a.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='categoryId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select category' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {((categories as Category[]) || []).map(
                          (c: Category) => (
                            <SelectItem key={c.id} value={String(c.id)}>
                              {c.name}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='totalCopies'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Copies</FormLabel>
                    <FormControl>
                      <Input type='number' min={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='coverImage'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Image URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='https://picsum.photos/...'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea rows={4} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setOpenDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  type='submit'
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                >
                  {editingBook ? 'Save Changes' : 'Create Book'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Book?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The book will be permanently
              deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className='bg-red-600 hover:bg-red-700'
              onClick={() => {
                if (deleteId) {
                  deleteMutation.mutate(deleteId);
                  setDeleteId(null);
                }
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
