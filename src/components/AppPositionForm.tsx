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
import { Button } from '@/components/ui/button';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Switch } from '@/components/ui/switch';
import AppSpinner from './AppSpinner';
import { QueryClient } from '@tanstack/react-query';
import Select from 'react-select';
import { useCreatePosition, useUpdatePosition } from '@/lib/PositionAPI';
import { api } from '@/lib/api';
import { Department } from '@/types/Department';
import { Designation } from '@/types/Designation';
import User from '@/types/User';

const userSchema = z.object({
    user_id: z.number().nullable().optional(),
    department_id: z.number({ required_error: "Department is required" }),
    designation_id: z.number().optional().nullable(),
    section_head: z.boolean().optional(),
});

export type PositionInput = z.infer<typeof userSchema>;

interface AppPositionFormProps {
    user?: User;
    isOpen: boolean;
    onClose: () => void;
    queryClient: QueryClient;
}

const AppPositionForm: FC<AppPositionFormProps> = ({ user, isOpen, onClose, queryClient }) => {
    const [loading, setLoading] = useState(false);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [designations, setDesignations] = useState<Designation[]>([]);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await api.get<{ data: Department[] }>('/api/departments');
                setDepartments(response.data.data);
            } catch (error) {
                console.error("Error fetching departments:", error);
            }
        };
        fetchDepartments();
    }, []);

    useEffect(() => {
        const fetchDesignations = async () => {
            try {
                const response = await api.get<{ data: Designation[] }>('/api/designations');
                setDesignations(response.data.data);
            } catch (error) {
                console.error("Error fetching designations:", error);
            }
        };
        fetchDesignations();
    }, []);

    const form = useForm<PositionInput>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            user_id: user?.id ? Number(user.id) : null,
            department_id: user?.position?.department_id || undefined,
            designation_id: user?.position?.designation_id ?? null,
            section_head: Boolean(user?.position?.section_head),
        },
    });

    useEffect(() => {
        if (user) {
            form.reset({
                user_id: user.id ? Number(user?.id) : null,
                department_id: user.position?.department_id || undefined,
                designation_id: user.position?.designation_id || undefined,
                section_head: Boolean(user.position?.section_head),
            });
        }
    }, [user, form]);

    const { mutate: createPosition, isPending: isCreating } = useCreatePosition();
    const { mutate: updatePosition, isPending: isUpdating } = useUpdatePosition();

    const onSubmit = async (formData: PositionInput) => {


        setLoading(true);
        if (user?.position?.id) {
            await updatePosition({ id: user?.position?.id, positionData: formData }, {
                onSettled: () => {
                    onClose();
                    queryClient.invalidateQueries({ queryKey: ['users'] });
                },
            });
        } else {
            await createPosition(formData, {
                onSettled: () => {
                    onClose();
                    queryClient.invalidateQueries({ queryKey: ['users'] });
                },
            });
        }
        setLoading(false);
    };

    return (
        <AlertDialog open={isOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {user ? `Edit Position - ${user.first_name} ${user.last_name}` : 'Add Position'}
                    </AlertDialogTitle>
                </AlertDialogHeader>
                <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                            <FormField
                                control={form.control}
                                name="department_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Department</FormLabel>
                                        <Select
                                            defaultValue={departments.find(dep => dep.id === field.value) ? {
                                                value: field.value,
                                                label: departments.find(dep => dep.id === field.value)?.name,
                                            } : null}
                                            options={departments.map(dep => ({
                                                value: dep.id!,
                                                label: dep.name,
                                            }))}
                                            onChange={option => field.onChange(option?.value)}
                                            isClearable
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="designation_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Designation</FormLabel>
                                        <Select
                                            defaultValue={designations.find(des => des.id === field.value) ? {
                                                value: field.value,
                                                label: designations.find(des => des.id === field.value)?.designation,
                                            } : null}
                                            options={designations.map(des => ({
                                                value: des.id!,
                                                label: des.designation,
                                            }))}
                                            onChange={option => field.onChange(option?.value)}
                                            isClearable
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="section_head"
                                render={({ field }) => (
                                    <FormItem className="flex items-center justify-between space-y-0">
                                        <FormLabel className="text-sm font-medium">Section Head</FormLabel>
                                        <FormControl>
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className='mt-5 flex space-x-2'>
                                <Button variant="outline" onClick={onClose}>Close</Button>
                                <Button type="submit" variant="default" className="text-white" disabled={isCreating || isUpdating}>
                                    {loading ? <AppSpinner /> : (user ? 'Save' : 'Add')}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default AppPositionForm;
