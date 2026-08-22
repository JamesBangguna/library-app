// src/pages/auth/LoginPage.tsx
import { useForm, ControllerRenderProps } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { loginSchema, type LoginFormValues } from '@/schemas/auth.schema';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoggingIn } = useAuth();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    login(values);
  };

  return (
    <div className='w-full max-w-md space-y-8 px-4'>
      {/* Logo */}
      <div className='text-center'>
        <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100'>
          <span className='text-2xl'>📚</span>
        </div>
        <h1 className='text-2xl font-bold tracking-tight'>Booky</h1>
        <p className='mt-2 text-sm text-muted-foreground'>
          Sign in to manage your library account.
        </p>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
          <FormField
            control={form.control}
            name='email'
            render={({
              field,
            }: {
              field: ControllerRenderProps<LoginFormValues, 'email'>;
            }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type='email'
                    placeholder='johndoe@email.com'
                    disabled={isLoggingIn}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='password'
            render={({
              field,
            }: {
              field: ControllerRenderProps<LoginFormValues, 'password'>;
            }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className='relative'>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder='••••••••'
                      disabled={isLoggingIn}
                      {...field}
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
                    >
                      {showPassword ? (
                        <EyeOff className='h-4 w-4' />
                      ) : (
                        <Eye className='h-4 w-4' />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type='submit' className='w-full' disabled={isLoggingIn}>
            {isLoggingIn ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </Button>
        </form>
      </Form>

      <p className='text-center text-sm text-muted-foreground'>
        Don't have an account?{' '}
        <Link
          to='/register'
          className='font-medium text-primary hover:underline'
        >
          Register
        </Link>
      </p>
    </div>
  );
}
