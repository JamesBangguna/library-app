// src/pages/user/ProfilePage.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateUser } from '@/store/slices/authSlice';
import { useMyLoans } from '@/features/loans/hooks/useLoans';
import { toast } from 'sonner';
import { Loan } from '@/types/loan';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const profileSchema = z.object({
  name: z.string().min(3, 'Minimal 3 karakter'),
  email: z.string().email(),
  phone: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const { data: loans = [] } = useMyLoans();

  const totalBorrow = loans.length;
  const activeBorrow = loans.filter(
    (l: Loan) => l.status === 'BORROWED'
  ).length;
  const returned = loans.filter((l: Loan) => l.status === 'RETURNED').length;

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
  });

  const onSubmit = (values: ProfileForm) => {
    // Nanti bisa ditambahkan API update profile
    dispatch(updateUser(values));
    toast.success('Profile updated successfully');
  };

  return (
    <div className='container mx-auto max-w-3xl px-4 py-8'>
      <h1 className='mb-8 text-2xl font-bold'>My Profile</h1>

      {/* Stats */}
      <div className='mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3'>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>
              Total Borrow
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>{totalBorrow}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>
              Active Borrow
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>{activeBorrow}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>
              Returned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>{returned}</p>
          </CardContent>
        </Card>
      </div>

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='mb-6 flex items-center gap-4'>
            <Avatar className='h-20 w-20'>
              <AvatarImage src={user?.avatar || undefined} />
              <AvatarFallback className='text-2xl'>
                {user?.name?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className='font-semibold'>{user?.name}</p>
              <p className='text-sm text-muted-foreground'>{user?.email}</p>
              <p className='text-xs text-muted-foreground mt-1'>
                Role: {user?.role}
              </p>
            </div>
          </div>

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
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type='email' disabled {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type='submit'>Save Changes</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
