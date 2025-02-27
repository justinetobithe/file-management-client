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
    confirm_new_password: z
      .string()
      .nullish()
      .transform((v) => v ?? ''),
    image: z
      .union([z.instanceof(File), z.string(), z.null(), z.undefined()])
      .optional()
      .refine((file) => {
        if (!file || typeof file === 'string') return true;
        return file instanceof File && convertBtoMb(file.size) <= MAX_FILE_SIZE;
      }, strings.validation.max_image_size)
      .refine((file) => {
        if (!file || typeof file === 'string') return true;
        return file instanceof File && ACCEPTED_IMAGE_TYPES.includes(file?.type);
      }, strings.validation.allowed_image_formats)
      .transform((v) => (typeof v === 'string' ? v : v || '')),
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
  ).refine((data) => {
    if (data.new_password && !data.confirm_new_password) {
      return false;
    }
    return true;
  }, {
    message: 'Please confirm your new password',
    path: ['confirm_new_password'],
  })
  .refine((data) => {
    if (data.new_password && data.confirm_new_password && data.new_password !== data.confirm_new_password) {
      return false;
    }
    return true;
  }, {
    message: 'Passwords do not match',
    path: ['confirm_new_password'],
  });

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
      image: user.image ?? "",
    },
  });


  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState('');
  const imageRef = useRef<HTMLInputElement | null>(null);

  const { mutate, isPending } = useUpdateUser();

  const onSubmit = (inputs: ProfileFormInputs) => {
    setLoading(true);
    mutate({
      id: user.id,
      userData: inputs,
    });

    form.reset({
      current_password: '',
      new_password: '',
      confirm_new_password: '',
    });

    setLoading(false);
  };

  useEffect(() => {
    console.log("User data:", user);
    if (user && user.image) {
      setImage(`${process.env.NEXT_PUBLIC_API_URL || ''}/storage/image/${user?.image}`);
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
                  {image ? (
                    <AvatarImage
                      src={image}
                      alt={image as string}
                      className='object-cover'
                    />
                  ) : (
                    <AvatarImage
                      src={`${process.env.NEXT_PUBLIC_API_URL || ''}/storage/image/${user?.image}`}
                      alt={"User Image"}
                      className='object-cover'
                    />
                  )}

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
                              if (e.target.files?.length) {
                                const file = e.target.files[0];
                                onChange(file);

                                setImage(URL.createObjectURL(file));

                                e.target.value = '';
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
                <div className='grid gap-x-10 sm:grid-cols-2'>
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

                </div>
                <div className='grid gap-x-10 sm:grid-cols-3'>
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
                              type="text"
                              value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                              disabled
                              className="border-primary focus-visible:ring-offset-0"
                            />
                          </FormControl>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        value={user.department?.name}
                        disabled
                        className="border-primary focus-visible:ring-offset-0"
                      />
                    </FormControl>
                  </FormItem>
                  <FormItem>
                    <FormLabel>Designation</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        value={user.designation?.designation}
                        disabled
                        className="border-primary focus-visible:ring-offset-0"
                      />
                    </FormControl>
                  </FormItem>
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

                <div className='grid gap-x-10 sm:grid-cols-3 mt-5'>

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
                  <FormField
                    control={form.control}
                    name='confirm_new_password'
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
              </div>
              <div className='mt-16 text-right'>
                <Button className='w-full px-20 sm:w-auto'>
                  {loading ? (
                    <>
                      <AppSpinner /> Saving...
                    </>
                  ) : (
                    "Save"
                  )}
                </Button>
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
