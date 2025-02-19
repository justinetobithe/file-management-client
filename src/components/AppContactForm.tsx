'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { useSendEmail } from '@/lib/CommonAPI';
import AppSpinner from './AppSpinner';
import { strings } from '@/utils/strings';

const inputSchema = z.object({
  name: z
    .string({
      required_error: strings.validation.required,
    })
    .min(1, {
      message: strings.validation.required,
    })
    .default(''),
  email: z
    .string({
      required_error: strings.validation.required,
    })
    .min(1, {
      message: strings.validation.required,
    })
    .default(''),
  message: z
    .string({
      required_error: strings.validation.required,
    })
    .min(1, {
      message: strings.validation.required,
    })
    .default(''),
});

export type ContactFormInputs = z.infer<typeof inputSchema>;

const AppContactForm = () => {
  const form = useForm<ContactFormInputs>({
    resolver: zodResolver(inputSchema),
  });

  const { mutate, isPending } = useSendEmail();

  const onSubmit = (inputs: ContactFormInputs) => {
    mutate(
      {
        inputs: inputs,
      },
      {
        onSettled: () => {
          form.reset({
            name: '',
            email: '',
            message: '',
          });
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='mx-auto max-w-2xl space-y-3'
      >
        <div className='flex gap-5'>
          <FormField
            control={form.control}
            name='name'
            rules={{
              required: true,
            }}
            render={({ field }) => (
              <FormItem className='flex-1'>
                <FormLabel className='font-medium'>Name</FormLabel>
                <FormControl>
                  <Input
                    type='text'
                    {...field}
                    className='border-[#D1D5DB] bg-[#F3F4F6] focus-visible:ring-offset-0'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='email'
            rules={{
              required: true,
            }}
            render={({ field }) => (
              <FormItem className='flex-1'>
                <FormLabel className='font-medium'>Email</FormLabel>
                <FormControl>
                  <Input
                    type='email'
                    {...field}
                    className='border-[#D1D5DB] bg-[#F3F4F6] focus-visible:ring-offset-0'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name='message'
          rules={{
            required: true,
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className='font-medium'>Message</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className='border-[#D1D5DB] bg-[#F3F4F6] focus-visible:ring-offset-0'
                  rows={10}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='text-center'>
          <Button className='mt-10 w-full max-w-[6.9rem]' disabled={isPending}>
            {isPending ? (
              <>
                {'Sending...'} <AppSpinner />
              </>
            ) : (
              'Submit'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AppContactForm;
