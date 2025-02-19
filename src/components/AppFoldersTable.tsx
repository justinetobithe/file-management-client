'use client';
import React, { useState } from 'react';
import {
    ColumnDef,
    PaginationState,
    SortingState,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from '@/components/ui/skeleton';
import AppTable from '@/components/AppTable';
import { ArrowUpDown, Pencil, Trash } from 'lucide-react';
import { Folder } from '@/types/Folder';
import { useDeleteFolder, useFolders, useUpdateFolder } from '@/lib/FolderAPI';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import Link from 'next/link';
import { formatFileSize } from '@/utils/fileSizeFormatter';
import AppConfirmationDialog from './AppConfirmationDialog';
import AppFolderForm from './AppFolderForm';

export default function AppFoldersTable() {
    const queryClient = useQueryClient();
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [searchKeyword, setSearchKeyword] = React.useState('');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);

    const { data, isLoading } = useFolders(
        pageIndex + 1,
        pageSize,
        searchKeyword,
        sorting.map((item) => item.id).join(','),
        Boolean(sorting.map((item) => item.desc).join(','))
    );

    const { mutate } = useDeleteFolder();
    const { mutate: updateFolder } = useUpdateFolder();

    const handleEditFolder = (folder: Folder) => {
        setSelectedFolder(folder);
        setIsEditDialogOpen(true);
    };

    const handleDeleteFolder = (id: number) => {
        mutate(id, {
            onSettled: () => {
                queryClient.invalidateQueries({ queryKey: ['folders'] });
            }
        });
    };

    const columns: ColumnDef<Folder>[] = [
        {
            accessorKey: 'created_at',
            header: ({ column }) => (
                <Button
                    variant='ghost'
                    className='pl-0 text-left hover:!bg-transparent'
                    onClick={() => column.toggleSorting()}
                >
                    Date Upload
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            ),
            cell: ({ row }) =>
                row.original.start_date && row.original.end_date
                    ? `${format(new Date(row.original.start_date), "MMM dd, yyyy")} - ${format(new Date(row.original.end_date), "MMM dd, yyyy")}`
                    : "",
            enableSorting: true,
        },
        {
            accessorKey: 'departments',
            header: ({ column }) => (
                <Button
                    variant='ghost'
                    className='pl-0 text-left hover:!bg-transparent'
                    onClick={() => column.toggleSorting()}
                >
                    Department/s
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            ),
            cell: ({ row }) => row.original.departments?.map(d => d.name).join(", "),
            enableSorting: true,
        },
        {
            accessorKey: 'folder_name',
            header: ({ column }) => (
                <Button
                    variant='ghost'
                    className='pl-0 text-left hover:!bg-transparent'
                    onClick={() => column.toggleSorting()}
                >
                    File Name
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            ),
            cell: ({ row }) => row.original.folder_name,
            enableSorting: true,
        },
        {
            accessorKey: 'sub_folders',
            header: ({ column }) => (
                <Button
                    variant='ghost'
                    className='pl-0 text-left hover:!bg-transparent'
                    onClick={() => column.toggleSorting()}
                >
                    SubFolders
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            ),
            cell: ({ row }) => row.original.subfolders?.map(f => f.folder_name).join(", "),
            enableSorting: true,
        },
        {
            accessorKey: 'files',
            header: ({ column }) => (
                <Button
                    variant='ghost'
                    className='pl-0 text-left hover:!bg-transparent'
                    onClick={() => column.toggleSorting()}
                >
                    Files
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            ),
            cell: ({ row }) => {
                const { files } = row.original;
                return (
                    <>
                        {files && files.length > 0 ? (
                            files.map((file, index) => (
                                <div key={index} className="mb-3">
                                    <Link className="color-primary" href={(process.env.NEXT_PUBLIC_API_URL || '') + "/storage/" + file.path} target="_blank" rel="noopener noreferrer">
                                        {file.filename}
                                    </Link>
                                    <p className="text-xs">
                                        {format(new Date(file.created_at), 'd/MM/yyyy')}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <span>No files available</span>
                        )}
                    </>
                );
            },
            enableSorting: true,
        },
        {
            accessorKey: 'size',
            header: ({ column }) => (
                <Button
                    variant='ghost'
                    className='pl-0 text-left hover:!bg-transparent'
                    onClick={() => column.toggleSorting()}
                >
                    Size
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            ),
            cell: ({ row }) => {
                const totalSize = row.original.files?.reduce((sum, file) => {
                    const fileSize = Number(file.size) || 0;
                    return sum + fileSize;
                }, 0) || 0;

                return formatFileSize(totalSize);
            },
            enableSorting: true,
        },
        {
            accessorKey: 'local_path',
            header: ({ column }) => (
                <Button
                    variant='ghost'
                    className='pl-0 text-left hover:!bg-transparent'
                    onClick={() => column.toggleSorting()}
                >
                    Folder Location (Local)
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            ),
            cell: ({ row }) => row.original.local_path,
            enableSorting: true,
        },
        {
            accessorKey: 'coverage_period',
            header: ({ column }) => (
                <Button
                    variant='ghost'
                    className='pl-0 text-left hover:!bg-transparent'
                    onClick={() => column.toggleSorting()}
                >
                    Coverage Period
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            ),
            cell: ({ row }) => {
                const { start_date, end_date } = row.original;

                if (!start_date || !end_date) {
                    return "N/A";
                }
                return `${format(new Date(start_date), "MMM dd, yyyy")} - ${format(new Date(end_date), "MMM dd, yyyy")}`;
            },

            enableSorting: true,
        },
        {
            id: 'actions',
            header: () => <div className='text-center'>Actions</div>,
            cell: ({ row }) => (
                <div className="flex justify-center items-center">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    type='button'
                                    variant="outline"
                                    className="mr-2"
                                    onClick={() => handleEditFolder(row.original)}
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Edit</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <AppConfirmationDialog
                        title='Delete Folder'
                        description={`Are you sure you want to delete the folder "${row.original.folder_name}"? This action cannot be undone.`}
                        buttonElem={
                            <Button className="text-white" variant="destructive" type='button'>
                                <Trash size={20} />
                            </Button>
                        }
                        handleDialogAction={() => handleDeleteFolder(row.original.id!)}
                    />
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        }
    ];

    const pagination = React.useMemo(() => ({ pageIndex, pageSize }), [pageIndex, pageSize]);

    const table = useReactTable({
        data: data?.data ?? Array(10).fill({}),
        columns: isLoading
            ? columns.map((column) => ({ ...column, cell: () => <Skeleton className='h-12 w-full' /> }))
            : columns,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        onPaginationChange: setPagination,
        onGlobalFilterChange: setSearchKeyword,
        pageCount: data?.last_page ?? -1,
        manualPagination: true,
        manualFiltering: true,
        manualSorting: true,
        state: {
            sorting,
            pagination,
            globalFilter: searchKeyword,
        },
    });

    return (
        <div>
            <AppTable table={table} />
            {selectedFolder && (
                <AppFolderForm
                    data={selectedFolder}
                    isOpen={isEditDialogOpen}
                    onClose={() => setIsEditDialogOpen(false)}
                    queryClient={queryClient}
                />
            )}
        </div>
    );
}
