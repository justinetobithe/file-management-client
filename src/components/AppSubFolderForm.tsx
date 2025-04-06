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
import { useAddSubFolder, useUpdateSubFolder } from '@/lib/FolderAPI';
import AppSpinner from './AppSpinner';
import { QueryClient } from '@tanstack/react-query';
import { Folder } from '@/types/Folder';
import { zodResolver } from '@hookform/resolvers/zod';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';
import AppInputFile from './AppInputFile';
import { UploadedFile } from '@/types/UploadedFIle';
import { X, } from 'lucide-react';
import { Department } from '@/types/Department';
import { api } from '@/lib/api';
import Select from 'react-select';
import User from '@/types/User';

const folderSchema = z.object({
    id: z.number().optional(),
    folder_name: z.string().min(1, { message: 'Folder name is required' }),
    department_id: z.number(),
    parent_id: z.number().optional(),
    uploaded_files: z.array(
        z.object({
            id: z.number(),
            filename: z.string(),
            file: z.instanceof(File).optional(),
            created_at: z.string(),
        })
    ).optional(),
});

export type FolderInput = z.infer<typeof folderSchema>;

interface AppSubFolderFormProps {
    folder?: Folder;
    data?: Folder;
    isOpen: boolean;
    onClose: () => void;
    queryClient: QueryClient;
}

const AppSubFolderForm: FC<AppSubFolderFormProps> = ({ folder, data, isOpen, onClose, queryClient }) => {

    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [currentFiles, setCurrentFiles] = useState<UploadedFile[]>([]);
    const [removedFileIds, setRemovedFileIds] = useState<number[]>([]);

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
            id: data?.id,
            folder_name: data?.folder_name || '',
            department_id: data?.department_id ?? user?.position?.department_id,
            parent_id: data?.parent_id ?? folder?.id,
        },
    });

    useEffect(() => {
        if (isOpen) {
            setFiles([]);
            setCurrentFiles(data?.file_uploads ?? []);
            setRemovedFileIds([]);
            form.reset({
                folder_name: data?.folder_name || '',
                department_id: data?.department_id ?? user?.position?.department_id,
                parent_id: data?.parent_id ?? folder?.id,
            });
        }
    }, [isOpen, data, form]);

    const handleFileChange = (selectedFiles: FileList) => {
        const filesArray = Array.from(selectedFiles).map((file, index) => ({
            id: index,
            filename: file.name,
            file: file,
            created_at: new Date().toISOString(),
        })) as UploadedFile[];
        setFiles([...files, ...filesArray]);
    };

    const handleRemoveCurrentFile = (id: number) => {
        setCurrentFiles((prevFiles) => {
            const updatedFiles = prevFiles.filter(file => file.id !== id);
            setRemovedFileIds((prevIds) => [...prevIds, id]);
            return updatedFiles;
        });
    };

    const handleRemoveFile = (id: number) => {
        setFiles((prevFiles) => {
            const updatedFiles = [...prevFiles];
            updatedFiles.splice(id, 1);
            return updatedFiles;
        });
    };

    const { mutate: addSubFolder, isPending: isCreating } = useAddSubFolder();
    const { mutate: updateSubFolder, isPending: isUpdating } = useUpdateSubFolder();

    const onSubmit = async (formData: FolderInput) => {
        const formattedData = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
            formattedData.append(key, value as string);
        });

        if (!formData.parent_id) {
            formattedData.delete('parent_id');
        }

        files.forEach((file, index) => {
            if (file.file) {
                formattedData.append(`uploaded_files[${index}]`, file.file);
            }
        });
 
        setLoading(true);

        if (data && data.id) {
            if (removedFileIds && removedFileIds.length > 0) {
                formattedData.append('current_files', JSON.stringify(removedFileIds));
            }

            formattedData.append('_method', 'PUT');

            await updateSubFolder(
                { id: data.id, folderData: formattedData as Folder },
                {
                    onSettled: () => {
                        onClose();
                        queryClient.invalidateQueries({ queryKey: ['folders'] });
                    },
                }
            );
        } else {
            await addSubFolder(formattedData as Folder, {
                onSettled: () => {
                    onClose();
                    queryClient.invalidateQueries({ queryKey: ['folders'] });
                },
            });
        }

        setLoading(false);
    };

    return (
        <AlertDialog open={isOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{data ? `Edit Subfolder for ${folder?.folder_name}` : 'Add Subfolder'}</AlertDialogTitle>
                </AlertDialogHeader>
                <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                            <FormField
                                control={form.control}
                                name='folder_name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Folder Name (Sub)</FormLabel>
                                        <FormControl>
                                            <Input type='text' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <AppInputFile
                                onChange={handleFileChange}
                                multiple={true}
                                name="folder_files"
                                acceptAll={true}
                            />

                            <div className='col-span-2'>
                                <div className='mt-2 space-y-2'>
                                    {files.map((file, index) => (
                                        <div key={index} className='flex items-center justify-between bg-gray-100 p-2 rounded-lg'>
                                            <span className='text-sm text-gray-700'>{file.filename}</span>
                                            <button
                                                type="button"
                                                className='text-red-500 hover:text-red-700 focus:outline-none'
                                                onClick={() => handleRemoveFile(index)}
                                                aria-label="Remove file"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    ))}
                                    {currentFiles.map((file) => (
                                        <div key={file.id} className='flex items-center justify-between bg-gray-100 p-2 rounded-lg'>
                                            <span className='text-sm text-gray-700'>{file.filename}</span>
                                            <button
                                                type="button"
                                                className='text-red-500 hover:text-red-700 focus:outline-none'
                                                onClick={() => handleRemoveCurrentFile(file.id!)}
                                                aria-label="Remove current file"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className='mt-5 flex space-x-2'>
                                <Button variant='outline' onClick={onClose}>Close</Button>
                                <Button type='submit' variant='default' className='text-white' disabled={isCreating || isUpdating}>
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

export default AppSubFolderForm;