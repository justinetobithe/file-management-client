'use client';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/utils/constants';
import { Button } from '@/components/ui/button';
import { strings } from '@/utils/strings';
import { convertBtoMb } from '@/utils/convertBtoMb';
import { useUpdateUser } from '@/lib/UsersAPI';
import User from '@/types/User';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertDialogDescription } from '@radix-ui/react-alert-dialog';
import AppSpinner from '@/components/AppSpinner';
import Select from 'react-select';

const inputSchema = z
  .object({
    first_name: z
      .string({
        required_error: strings.validation.required,
      })
      .min(1, {
        message: strings.validation.required,
      }),
    last_name: z
      .string({
        required_error: strings.validation.required,
      })
      .min(1, {
        message: strings.validation.required,
      }),
    email: z
      .string({
        required_error: strings.validation.required,
      })
      .email()
      .min(1, {
        message: strings.validation.required,
      }),
    phone: z
      .string()
      .nullish()
      .transform((v) => v ?? ''),
    address: z
      .string({
        required_error: strings.validation.required,
      })
      .min(1, {
        message: strings.validation.required,
      }),
    current_password: z
      .string()
      .nullish()
      .transform((v) => v ?? ''),
    new_password: z
      .string()
      .nullish()
      .transform((v) => v ?? ''),
    image: z
      .any()
      .refine((file: File | string) => {
        if (typeof file === 'string') return true;
        return file instanceof File && convertBtoMb(file.size) <= MAX_FILE_SIZE;
      }, strings.validation.max_image_size)
      .refine((file: File | string) => {
        if (typeof file === 'string') return true;
        return file && ACCEPTED_IMAGE_TYPES.includes(file?.type);
      }, strings.validation.allowed_image_formats)
      .nullish()
      .transform((v) => (typeof v === 'string' ? '' : v)),
    role: z.string().min(1, { message: strings.validation.required }),
  })
  .refine(
    (data) =>
      data.current_password.length <= 0 && data.new_password.length > 0
        ? false
        : true,
    {
      message: 'Please fill out the current password field',
      path: ['current_password'],
    }
  )
  .refine(
    (data) => {
      console.log(
        'data.current_password: ',
        data.current_password.length > 0,
        'data.new_password: ',
        data.new_password.length <= 0,
        data.current_password.length > 0 && data.new_password.length <= 0
          ? false
          : true
      );
      return data.current_password.length > 0 && data.new_password.length <= 0
        ? false
        : true;
    },
    {
      message: 'Please fill out the new password field',
      path: ['new_password'],
    }
  );

export type ProfileFormInputs = z.infer<typeof inputSchema>;

const roleOptions = [
  { value: "admin", label: "Admin" },
  { value: "user", label: "User" },
]

const ProfileForm: FC<{ user: User }> = ({ user }) => {
  const form = useForm<ProfileFormInputs>({
    reValidateMode: 'onChange',
    resolver: zodResolver(inputSchema),
    defaultValues: {
      ...user,
    },
  });


  const [open, setOpen] = useState(false);

  const [image, setImage] = useState('');
  const imageRef = useRef<HTMLInputElement | null>(null);

  const { mutate, isPending } = useUpdateUser();

  const onSubmit = (inputs: ProfileFormInputs) => {
    const formData = new FormData();

    Object.entries(inputs).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    if (inputs.image instanceof File) {
      formData.append('image', inputs.image);
    }

    formData.append('_method', 'PUT');

    mutate({
      id: user.id,
      userData: formData as any,
    });
  };


  useEffect(() => {
    if (user && user.image) {
      setImage(user.image);
    } else {
      setImage('');
    }
  }, [user]);


  return (
    <>
      <Card className='mt-5 p-10'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(() => {
              setOpen(true);
            })}
          >
            <CardHeader className='border-b-[1px] border-[#F0F0F0]'>
              <div className='flex flex-col items-center sm:flex-row sm:space-x-5'>
                <Avatar className='h-[120px] w-[120px]'>
                  <AvatarImage
                    src={`${process.env.NEXT_PUBLIC_API_URL || ''}/storage/image/${user?.image}`}
                    alt={user?.image as string}
                    className='object-cover'
                  />
                  <AvatarFallback className='text-3xl font-medium'>
                    {user?.first_name}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <FormField
                    control={form.control}
                    name='image'
                    render={({ field: { onChange, ...field } }) => (
                      <FormItem>
                        <Button
                          variant='outline'
                          className='mt-5 w-full rounded-2xl text-[.93rem] font-normal sm:mt-0 sm:w-auto'
                          onClick={() => imageRef.current?.click()}
                          type='button'
                        >
                          Upload new photo
                        </Button>
                        <FormDescription className='text-[.93rem] font-light'>
                          At least 800x800 px is recommended
                          <br /> JPG or PNG is allowed
                        </FormDescription>
                        <FormControl>
                          <Input
                            type='file'
                            {...field}
                            className='hidden'
                            accept='image/*'
                            ref={(ref) => {
                              imageRef.current = ref;
                            }}
                            onChange={(e) => {
                              if (e.target.files) {
                                onChange(e.target.files && e.target.files[0]);
                                setImage(
                                  URL.createObjectURL(e.target.files[0])
                                );
                              }
                            }}
                            value=''
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className='py-10'>
              <div className='grid gap-x-10 gap-y-5 sm:grid-cols-2'>
                <div className='grid gap-x-10 sm:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='first_name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input
                            type='text'
                            {...field}
                            className='border-primary focus-visible:ring-offset-0'
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
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input
                            type='text'
                            {...field}
                            className='border-primary focus-visible:ring-offset-0'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type='email'
                          {...field}
                          className='border-primary focus-visible:ring-offset-0'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='grid gap-x-10 sm:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='phone'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input
                            type='text'
                            {...field}
                            className='border-primary focus-visible:ring-offset-0'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='role'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        {user.role === 'admin' ? (
                          <Controller
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                              <Select
                                defaultValue={roleOptions.find(option => option.value === field.value) || null}
                                onChange={(option) => {
                                  field.onChange(option?.value);
                                }}
                                options={roleOptions}
                                menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                                isClearable
                                menuPlacement="auto"
                                styles={{
                                  menuPortal: (base) => ({
                                    ...base,
                                    zIndex: 9991,
                                  }),
                                  input: (base) => ({ ...base, 'input:focus': { boxShadow: 'none' } }),
                                }}
                              />
                            )}
                          />
                        ) : (
                          <FormControl>
                            <Input
                              type='text'
                              value={user.role}
                              disabled
                              className='border-primary focus-visible:ring-offset-0'
                            />
                          </FormControl>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name='address'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input
                          type='text'
                          {...field}
                          className='border-primary focus-visible:ring-offset-0'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='current_password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <Input
                          type='password'
                          {...field}
                          className='border-primary focus-visible:ring-offset-0'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='new_password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input
                          type='password'
                          {...field}
                          className='border-primary focus-visible:ring-offset-0'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='mt-16 text-right'>
                <Button className='w-full px-20 sm:w-auto'>Save</Button>
              </div>
            </CardContent>
          </form>
        </Form>
      </Card>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to update your profile?
            </AlertDialogTitle>
            <AlertDialogDescription>
              You will be logged out after this action
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No</AlertDialogCancel>
            <AlertDialogAction onClick={() => form.handleSubmit(onSubmit)()}>
              {isPending ? <AppSpinner className='mx-auto' /> : 'Continue'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProfileForm;
