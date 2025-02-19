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
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { useCreateDepartment, useDepartments, useUpdateDepartment } from '@/lib/DepartmentAPI';
import AppSpinner from './AppSpinner';
import { QueryClient } from '@tanstack/react-query';
import { Department } from '@/types/Department';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/lib/api';
import { Driver } from '@/types/Driver';

const departmentSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1, { message: 'Name is required' }),
});

export type DepartmentInput = z.infer<typeof departmentSchema>;

interface AppDepartmentFormProps {
    data?: Department;
    isOpen: boolean;
    onClose: () => void;
    queryClient: QueryClient;
}

const AppDepartmentForm: FC<AppDepartmentFormProps> = ({ data, isOpen, onClose, queryClient }) => {
    const [loading, setLoading] = useState(false);


    const form = useForm<DepartmentInput>({
        resolver: zodResolver(departmentSchema),
        defaultValues: {
            id: data?.id,
            name: data?.name || '',
        },
    });

    useEffect(() => {
        if (data) {
            form.reset({
                name: data.name,
            });
        }
    }, [data, form]);

    const { mutate: createDepartment, isPending: isCreating } = useCreateDepartment();
    const { mutate: updateDepartment, isPending: isUpdating } = useUpdateDepartment();

    const onSubmit = async (formData: DepartmentInput) => {
        setLoading(true);

        if (data && data.id) {
            await updateDepartment(
                { id: data.id, departmentData: formData },
                {
                    onSettled: () => {
                        onClose();
                        queryClient.invalidateQueries({ queryKey: ['departments'] });
                    },
                }
            );
        } else {
            await createDepartment(formData, {
                onSettled: () => {
                    onClose();
                    queryClient.invalidateQueries({ queryKey: ['departments'] });
                },
            });
        }
        setLoading(false);
    };

    return (
        <AlertDialog open={isOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{data ? 'Edit Vehicle' : 'Add Vehicle'}</AlertDialogTitle>
                </AlertDialogHeader>
                <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input type='text' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className='mt-5 flex space-x-2'>
                                <Button variant="outline" onClick={onClose}>Close</Button>
                                <Button type="submit" variant="default" className="text-white" disabled={isCreating || isUpdating}>
                                    {loading ? <AppSpinner /> : (data ? 'Save' : 'Add')}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default AppDepartmentForm;
