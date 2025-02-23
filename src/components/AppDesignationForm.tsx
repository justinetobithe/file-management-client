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
import { useCreateDesignation, useUpdateDesignation } from '@/lib/DesignationAPI';
import AppSpinner from './AppSpinner';
import { QueryClient } from '@tanstack/react-query';
import { Designation } from '@/types/Designation';
import { zodResolver } from '@hookform/resolvers/zod';

const designationSchema = z.object({
    id: z.number().optional(),
    designation: z.string().min(1, { message: 'Designation is required' }),
    description: z.string().min(1, { message: 'Description is required' }),
});

export type DesignationInput = z.infer<typeof designationSchema>;

interface AppDesignationFormProps {
    data?: Designation;
    isOpen: boolean;
    onClose: () => void;
    queryClient: QueryClient;
}

const AppDesignationForm: FC<AppDesignationFormProps> = ({ data, isOpen, onClose, queryClient }) => {
    const [loading, setLoading] = useState(false);


    const form = useForm<DesignationInput>({
        resolver: zodResolver(designationSchema),
        defaultValues: {
            id: data?.id,
            designation: data?.designation || '',
            description: data?.description || '',
        },
    });

    useEffect(() => {
        if (data) {
            form.reset({
                designation: data.designation,
                description: data.description,
            });
        }
    }, [data, form]);

    const { mutate: createDesignation, isPending: isCreating } = useCreateDesignation();
    const { mutate: updateDesignation, isPending: isUpdating } = useUpdateDesignation();

    const onSubmit = async (formData: DesignationInput) => {
        setLoading(true);

        if (data && data.id) {
            await updateDesignation(
                { id: data.id, designationData: formData },
                {
                    onSettled: () => {
                        onClose();
                        queryClient.invalidateQueries({ queryKey: ['designations'] });
                    },
                }
            );
        } else {
            await createDesignation(formData, {
                onSettled: () => {
                    onClose();
                    queryClient.invalidateQueries({ queryKey: ['designations'] });
                },
            });
        }
        setLoading(false);
    };

    return (
        <AlertDialog open={isOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{data ? 'Edit Designation' : 'Add Designation'}</AlertDialogTitle>
                </AlertDialogHeader>
                <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                            <FormField
                                control={form.control}
                                name='designation'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Designation</FormLabel>
                                        <FormControl>
                                            <Input type='text' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='description'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
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

export default AppDesignationForm;
