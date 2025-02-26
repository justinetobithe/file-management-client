'use client';
import React, { FC, useState } from 'react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import AppSpinner from '@/components/AppSpinner';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { strings } from '@/utils/strings';

const inputSchema = z.object({
  email: z
    .string()
    .min(3, {
      message: strings.validation.required,
    })
    .email(),
  password: z.string().min(3, {
    message: strings.validation.required,
  }),
});

type Inputs = z.infer<typeof inputSchema>;

const LoginForm: FC = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<Inputs>({
    resolver: zodResolver(inputSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (inputs: Inputs) => {
    setLoading(true);

    // LOGIN USER
    const response = await signIn('credentials', {
      ...inputs,
      redirect: false,
    });

    setLoading(false);

    if (response?.error) {
      toast({
        title: 'Uh oh! Something went wrong.',
        description: response.error,
        variant: 'destructive',
      });
    } else {
      router.push('/home');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <h4 className='text-center text-2xl font-bold'>
          File Management System
        </h4>
        <FormField
          control={form.control}
          name='email'
          rules={{
            required: true,
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className='font-medium'>Email address</FormLabel>
              <FormControl>
                <Input
                  type='email'
                  {...field}
                  className='border-border focus-visible:ring-offset-0'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          rules={{
            required: true,
          }}
          render={({ field }) => (
            <FormItem>
              <div className='flex items-center'>
                <FormLabel className='flex-1 font-medium'>Password</FormLabel>
                {/* <FormDescription className='flex-1 text-right'>
                  <Link href='/login' className='text-primary'>
                    Forgot password?
                  </Link>
                </FormDescription> */}
              </div>
              <FormControl>
                <Input
                  type='password'
                  {...field}
                  className='border-border focus-visible:ring-offset-0'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type='submit'
          variant='default'
          className='block w-full text-center font-semibold'
          disabled={loading}
        >
          {loading ? <AppSpinner className='mx-auto' /> : 'Login'}
        </Button>

      </form>
    </Form>
  );
};

export default LoginForm;
