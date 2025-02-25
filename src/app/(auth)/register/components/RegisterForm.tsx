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
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { useRegister } from '@/lib/AuthenticationAPI';
import AppSpinner from '@/components/AppSpinner';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import { strings } from '@/utils/strings';
import { convertBtoMb } from '@/utils/convertBtoMb';
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/utils/constants';
import Image from 'next/image';
import { useGoogleLogin } from '@react-oauth/google';
import { api } from '@/lib/api';
import log from '@/utils/logger';

const inputSchema = z
  .object({
    first_name: z
      .string({
        required_error: strings.validation.required,
      })
      .min(3, strings.validation.required),
    last_name: z
      .string({
        required_error: strings.validation.required,
      })
      .min(3, strings.validation.required),
    email: z
      .string({
        required_error: strings.validation.required,
      })
      .email(),
    contact_number: z.string({
      required_error: strings.validation.required,
    }),
    dob: z.string({
      required_error: strings.validation.required,
    }),
    password: z
      .string({
        required_error: strings.validation.required,
        invalid_type_error: strings.validation.required,
      })
      .min(6, {
        message: strings.validation.password_min_characters,
      })
      .optional()
      .transform((v) => (typeof v === 'undefined' ? '' : v)),
    password_confirmation: z
      .string({
        required_error: strings.validation.required,
        invalid_type_error: strings.validation.required,
      })
      .min(6, {
        message: strings.validation.password_min_characters,
      })
      .optional()
      .transform((v) => (typeof v === 'undefined' ? '' : v)),
    user_role: z.enum(['mother', 'ob_gyne'], {
      required_error: strings.validation.required,
    }),
    is_google_signin: z.boolean().default(false),
    doctor_fee: z
      .string({
        required_error: strings.validation.required,
        invalid_type_error: strings.validation.required,
      })
      .optional(),
    gcash_number: z
      .string({
        required_error: strings.validation.required,
        invalid_type_error: strings.validation.required,
      })
      .optional(),
    gcash_qr_code: z
      .any()
      .refine((file: File | string) => {
        if (typeof file === 'string') return true;
        return file instanceof File && convertBtoMb(file.size) <= MAX_FILE_SIZE;
      }, strings.validation.max_image_size)
      .refine((file: File | string) => {
        if (typeof file === 'string') return true;
        return file && ACCEPTED_IMAGE_TYPES.includes(file?.type);
      }, strings.validation.allowed_image_formats)
      .optional()
      .transform((v) => (typeof v === 'string' ? '' : v)),
  })
  .refine(
    ({ dob }) => {
      log('[DOB]', moment().diff(dob, 'years'));
      if (moment().diff(dob, 'years') < 16) {
        return false;
      }

      return true;
    },
    {
      path: ['dob'],
      message: strings.validation.min_age,
    }
  )
  .refine(
    ({ password, is_google_signin }) => {
      if (!is_google_signin && !password?.length) {
        return false;
      }
      return true;
    },
    {
      path: ['password'],
      message: strings.validation.required,
    }
  )
  .refine(
    ({ password_confirmation, is_google_signin }) => {
      if (!is_google_signin && !password_confirmation?.length) {
        return false;
      }
      return true;
    },
    {
      path: ['password_confirmation'],
      message: strings.validation.required,
    }
  )
  .refine(
    ({ password, password_confirmation, is_google_signin }) => {
      if (!is_google_signin && password != password_confirmation) {
        return false;
      }
      return true;
    },
    {
      path: ['password'],
      message: strings.validation.password_confirmation,
    }
  )
  .refine(
    ({ password, password_confirmation, is_google_signin }) => {
      if (!is_google_signin && password != password_confirmation) {
        return false;
      }
      return true;
    },
    {
      path: ['password_confirmation'],
      message: strings.validation.password_confirmation,
    }
  )
  .refine(
    ({ user_role, gcash_number }) => {
      if (user_role == 'ob_gyne' && !gcash_number) {
        return false;
      }

      return true;
    },
    {
      path: ['gcash_number'],
      message: strings.validation.required,
    }
  )
  .refine(
    ({ user_role, gcash_qr_code }) => {
      if (user_role == 'ob_gyne' && !gcash_qr_code) {
        return false;
      }

      return true;
    },
    {
      path: ['gcash_qr_code'],
      message: strings.validation.required,
    }
  )
  .refine(
    ({ user_role, doctor_fee }) => {
      if (user_role == 'ob_gyne' && !doctor_fee) {
        return false;
      }

      return true;
    },
    {
      path: ['doctor_fee'],
      message: strings.validation.required,
    }
  );

export type RegisterInputs = z.infer<typeof inputSchema>;

const RegisterForm: FC = () => {
  const form = useForm<RegisterInputs>({
    resolver: zodResolver(inputSchema),
    defaultValues: {
      user_role: 'mother',
    },
  });
  const [image, setImage] = useState('');
  const [isGoogleSignin, setIsGoogleSignin] = useState(false);

  const { mutate, isPending } = useRegister();

  const signUpWithGoogle = useGoogleLogin({
    onSuccess: async (response) => {
      const { data } = await api.post<{
        user: {
          name: string;
          given_name: string | undefined;
          family_name: string | undefined;
          email: string;
        };
      }>('/api/validate/google', {
        provider: 'google',
        access_provider_token: response.access_token,
      });
      log('[GOOGLE]', data);

      // SET GOOGLE SIGN
      setIsGoogleSignin(true);
      form.setValue('is_google_signin', true);
      form.setValue(
        'first_name',
        data.user.given_name ? data.user.given_name : data.user.name
      );
      form.setValue(
        'last_name',
        data.user.family_name ? data.user.family_name : ''
      );
      form.setValue('email', data.user.email);
    },
  });

  const onSubmit = async (inputs: RegisterInputs) => {
    mutate({
      inputs,
      isGoogleSignin,
    });
  };

  return (
    <>
      <Button
        className='mb-3 w-full border-[2px] py-5 text-xl'
        onClick={() => signUpWithGoogle()}
        variant='outline'
      >
        <span className='text-lg font-bold'>Sign Up with Google</span>
      </Button>
      <div className='relative flex w-full items-center py-5'>
        <div className='flex-grow border-t border-gray-400'></div>
        <span className='mx-4 flex-shrink text-gray-400'>OR</span>
        <div className='flex-grow border-t border-gray-400'></div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <h4 className='text-center text-2xl font-bold'>
            Create your account
          </h4>
          <FormField
            control={form.control}
            name='first_name'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='font-medium'>First Name</FormLabel>
                <FormControl>
                  <Input
                    type='text'
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
            name='last_name'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='font-medium'>Last Name</FormLabel>
                <FormControl>
                  <Input
                    type='text'
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
            name='email'
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
            name='contact_number'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='font-medium'>Contact Number</FormLabel>
                <FormControl>
                  <Input
                    type='text'
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
            name='dob'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='font-medium'>Date of Birth</FormLabel>
                <FormControl>
                  <div className='w-full'>
                    <DatePicker
                      onChange={(value) =>
                        field.onChange(
                          moment(value ? (value as Date) : new Date()).format(
                            'YYYY-MM-DD'
                          )
                        )
                      }
                      value={field.value}
                      maxDate={new Date()}
                      format='dd/MM/yyyy'
                      calendarType='US'
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {!form.watch('is_google_signin') ? (
            <>
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-medium'>Password</FormLabel>
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
              <FormField
                control={form.control}
                name='password_confirmation'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-medium'>
                      Confirm Password
                    </FormLabel>
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
            </>
          ) : null}
          <FormField
            control={form.control}
            name='user_role'
            render={() => (
              <FormItem className='!mt-5 flex items-baseline space-x-4 space-y-0'>
                <FormLabel className='font-medium'>Register as:</FormLabel>
                <div className='inline-block flex-1 space-x-2 text-right'>
                  <Button
                    onClick={() => form.setValue('user_role', 'mother')}
                    variant={`${form.getValues('user_role') == 'mother'
                        ? 'default'
                        : 'ghost'
                      }`}
                    type='button'
                  >
                    Mother
                  </Button>
                  <Button
                    onClick={() => form.setValue('user_role', 'ob_gyne')}
                    variant={`${form.getValues('user_role') == 'ob_gyne'
                        ? 'default'
                        : 'ghost'
                      }`}
                    type='button'
                  >
                    OB-Gyne
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.watch('user_role') == 'ob_gyne' ? (
            <>
              <FormField
                control={form.control}
                name='doctor_fee'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-medium'>Doctor's Fee</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        {...field}
                        className='border-border focus-visible:ring-offset-0'
                      />
                    </FormControl>
                    {/* <FormDescription>
                      When entering the doctor's fee, add 20% for the service
                      fee. For example, if the fee is ₱600, input ₱720 (₱600 +
                      20%).
                    </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='gcash_number'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-medium'>Gcash #</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
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
                name='gcash_qr_code'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-medium'>Gcash QR Code</FormLabel>
                    <FormControl>
                      <Input
                        type='file'
                        {...field}
                        className='border-border focus-visible:ring-offset-0'
                        accept='image/*'
                        onChange={(e) => {
                          if (e.target.files) {
                            field.onChange(e.target.files[0]);
                            setImage(URL.createObjectURL(e.target.files[0]));
                          }
                        }}
                        value=''
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {image ? (
                <div className='relative h-[15rem]'>
                  <Image
                    alt='GCASH QR CODE'
                    src={image}
                    fill={true}
                    className='object-contain'
                  />
                </div>
              ) : null}
            </>
          ) : null}
          <Button
            type='submit'
            variant='default'
            className='block w-full text-center font-semibold'
            disabled={isPending}
          >
            {isPending ? <AppSpinner className='mx-auto' /> : 'Sign Up'}
          </Button>
          <p className='mt-5 text-center'>
            Already a member?{' '}
            <Link href='/login' className='text-primary'>
              Login
            </Link>
          </p>
        </form>
      </Form>
    </>
  );
};

export default RegisterForm;
