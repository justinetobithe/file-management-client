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
import { useCreateStrand, useUpdateStrand } from '@/lib/StrandAPI';
import AppSpinner from './AppSpinner';
import { QueryClient } from '@tanstack/react-query';
import { Strand } from '@/types/Strand';
import { zodResolver } from '@hookform/resolvers/zod';

const strandSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(3, { message: 'Name is required' }),
    acronym: z.string().min(3, { message: 'Acronym is required' }),
});

export type StrandInput = z.infer<typeof strandSchema>;

interface AppStrandFormProps {
    data?: Strand;
    isOpen: boolean;
    onClose: () => void;
    queryClient: QueryClient;
}

const AppStrandForm: FC<AppStrandFormProps> = ({ data, isOpen, onClose, queryClient }) => {
    const [loading, setLoading] = useState(false);

    const form = useForm<StrandInput>({
        resolver: zodResolver(strandSchema),
        defaultValues: {
            id: data?.id,
            name: data?.name || '',
            acronym: data?.acronym || '',
        },
    });

    useEffect(() => {
        if (data) {
            form.reset({
                name: data.name,
                acronym: data.acronym,
            });
        }
    }, [data, form]);

    const { mutate: createStrand, isPending: isCreating } = useCreateStrand();
    const { mutate: updateStrand, isPending: isUpdating } = useUpdateStrand();

    const onSubmit = async (formData: StrandInput) => {
        setLoading(true);

        if (data && data.id) {
            await updateStrand(
                { id: data.id, strandData: formData },
                {
                    onSettled: () => {
                        onClose();
                        queryClient.invalidateQueries({ queryKey: ['strands'] });
                    },
                }
            );
        } else {
            await createStrand(formData, {
                onSettled: () => {
                    onClose();
                    queryClient.invalidateQueries({ queryKey: ['strands'] });
                },
            });
        }
        setLoading(false);
    };

    return (
        <AlertDialog open={isOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{data ? 'Edit Strand' : 'Add Strand'}</AlertDialogTitle>
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
                            <FormField
                                control={form.control}
                                name='acronym'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Acrnoym</FormLabel>
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

export default AppStrandForm;
