import React, { FC, useEffect, useState } from 'react';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    Form, FormControl, FormField, FormItem, FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm, } from 'react-hook-form';
import { z } from 'zod';
import { useResetPassword, } from '@/lib/UsersAPI';
import { zodResolver } from '@hookform/resolvers/zod';
import AppSpinner from './AppSpinner';
import { QueryClient } from '@tanstack/react-query';
import { Eye, EyeOff } from 'lucide-react';
import User from '@/types/User';

const userSchema = z
    .object({
        new_password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
        confirm_new_password: z.string().min(8, { message: 'Confirm password must be at least 8 characters long' }),
    })
    .refine((data) => data.new_password === data.confirm_new_password, {
        message: "Passwords must match",
        path: ["confirm_new_password"],
    });

export type UserInput = z.infer<typeof userSchema>;

interface AppResetPasswordFormProps {
    user?: User;
    isOpen: boolean;
    onClose: () => void;
    queryClient: QueryClient;
}


const AppResetPasswordForm: FC<AppResetPasswordFormProps> = ({ user, isOpen, onClose, queryClient }) => {
    const [loading, setLoading] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

    const form = useForm<UserInput>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            new_password: '',
            confirm_new_password: '',
        }

    });

    useEffect(() => {
        if (isOpen) {
            form.reset({
                new_password: '',
                confirm_new_password: '',
            });
        }
    }, [isOpen, form]);

    console.log(form.formState.errors);


    const { mutate: resetPassword, isPending: isResettingPassword } = useResetPassword();

    const onSubmit = async (formData: UserInput) => {
        setLoading(true);


        await resetPassword(
            { id: user?.id as string, new_password: formData.new_password },
            {
                onSettled: () => {
                    onClose();
                    queryClient.invalidateQueries({ queryKey: ['users'] });
                },
            }
        );

        setLoading(false);
    };

    return (
        <AlertDialog open={isOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Reset Password for {user?.first_name} {user?.last_name}
                    </AlertDialogTitle>
                </AlertDialogHeader>
                <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                            <FormField
                                control={form.control}
                                name='new_password'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <div className='relative'>
                                                <Input
                                                    type={showNewPassword ? 'text' : 'password'}
                                                    {...field}
                                                    className='border-border focus-visible:ring-offset-0 pr-10'
                                                />
                                                <button
                                                    type='button'
                                                    className='absolute inset-y-0 right-2 flex items-center'
                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                >
                                                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                </button>
                                            </div>
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
                                        <FormLabel>Confirm New Password</FormLabel>
                                        <FormControl>
                                            <div className='relative'>
                                                <Input
                                                    type={showConfirmNewPassword ? 'text' : 'password'}
                                                    {...field}
                                                    className='border-border focus-visible:ring-offset-0 pr-10'
                                                />
                                                <button
                                                    type='button'
                                                    className='absolute inset-y-0 right-2 flex items-center'
                                                    onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                                                >
                                                    {showConfirmNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className='mt-5 flex space-x-2'>
                                <Button variant="outline" onClick={onClose}>Close</Button>
                                <Button type="submit" variant="default" className="text-white" disabled={isResettingPassword}>
                                    {loading ? <AppSpinner /> : "Reset"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default AppResetPasswordForm;
