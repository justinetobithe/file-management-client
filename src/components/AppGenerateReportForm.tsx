"use client";
import React, { useState, useEffect } from "react";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { QueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import Select from 'react-select';
import AppSpinner from "./AppSpinner";
import User from "@/types/User";
import { api } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "./ui/use-toast";
import { Department } from "@/types/Department";

const reportSchema = z.object({
    effective_date: z.union([z.date(), z.null()]).optional(),
    folders: z.array(z.number()),
    // checked_by: z.number().optional(),
});

export type ReportInput = z.infer<typeof reportSchema>;

interface AppGenerateReportFormProps {
    isOpen: boolean;
    onClose: () => void;
    queryClient: QueryClient;
    selectedFolders: number[];
}

const AppGenerateReportForm: React.FC<AppGenerateReportFormProps> = ({ isOpen, onClose, queryClient, selectedFolders }) => {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    const form = useForm<ReportInput>({
        resolver: zodResolver(reportSchema),
        defaultValues: {
            effective_date: undefined,
            folders: selectedFolders,
        },
    });

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


    const onSubmit = async (data: ReportInput) => {
        if (!user?.position || !user.position.department_id) {
            toast({
                variant: 'destructive',
                description: "You must have a position and department before generating a report.",
            });
            return;
        }

        if (!data.effective_date) {
            toast({
                variant: 'destructive',
                description: "Please select an effective date.",
            });
            return;
        }

        const formData = {
            effective_date: data.effective_date ? format(data.effective_date, "yyyy-MM-dd") : null,
            selected_folders: data.folders,
        };

        setLoading(true);

        try {
            const response = await api.post('/api/folder/generate-report', formData, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'records_digitization_report.pdf');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            onClose();
        } catch (error) {
            console.error("Error generating report:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AlertDialog open={isOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Generate Report</AlertDialogTitle>
                </AlertDialogHeader>
                <div >
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>

                            <FormField
                                control={form.control}
                                name="effective_date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Effective Date</FormLabel>
                                        <FormControl>
                                            <DatePicker
                                                onChange={(date) => field.onChange(date || null)}
                                                value={field.value || null}
                                                format='y-MM-dd'
                                                clearIcon={null}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className='mt-5 flex space-x-2'>
                                <Button variant='outline' onClick={onClose}>Close</Button>
                                <Button type='submit' variant='default' className='text-white'>
                                    {loading ? <AppSpinner /> : "Generate"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default AppGenerateReportForm;
