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
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAddFolder } from '@/lib/FolderAPI';
import AppSpinner from './AppSpinner';
import { QueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/lib/api';
import User from '@/types/User';

const folderSchema = z.object({
    folder_name: z.string().min(1, { message: 'Folder name is required' }),
    department_id: z.number().min(1, { message: 'Department is required' }),
});

export type FolderInput = z.infer<typeof folderSchema>;

interface AppFolderOnlyFormProps {
    isOpen: boolean;
    onClose: () => void;
    queryClient: QueryClient;
}

const AppFolderOnlyForm: FC<AppFolderOnlyFormProps> = ({ isOpen, onClose, queryClient }) => {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await api.get<{ data: User }>('/api/me');
                setUser(data.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUser();
    }, []);

    const form = useForm<FolderInput>({
        resolver: zodResolver(folderSchema),
        defaultValues: {
            folder_name: '',
            department_id: user?.position?.department_id ?? undefined,
        },
    });

    useEffect(() => {
        if (isOpen) {
            form.reset({ folder_name: '', department_id: user?.position?.department_id ?? undefined });
        }
    }, [isOpen, form, user?.position?.department_id]);

    const { mutate: createFolder, isPending: isCreating } = useAddFolder();

    const onSubmit = (formData: FolderInput) => {
        setLoading(true);
        createFolder(formData, {
            onSuccess: () => {
                onClose();
                queryClient.invalidateQueries({ queryKey: ['folders'] as const });
            },
            onSettled: () => {
                setLoading(false);
            },
        });
    };

    return (
        <AlertDialog open={isOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Add Folder</AlertDialogTitle>
                </AlertDialogHeader>
                <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                            <FormField
                                control={form.control}
                                name='folder_name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Folder Name (Main)</FormLabel>
                                        <FormControl>
                                            <Input type='text' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className='mt-5 flex space-x-2'>
                                <Button variant='outline' onClick={onClose}>Close</Button>
                                <Button type='submit' variant='default' className='text-white' disabled={isCreating}>
                                    {loading ? <AppSpinner /> : 'Add'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default AppFolderOnlyForm;
