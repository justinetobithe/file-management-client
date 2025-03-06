'use client';
import React, { useState, useEffect } from 'react';
import {
    ColumnDef,
    PaginationState,
    SortingState,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from '@/components/ui/skeleton';
import AppTable from '@/components/AppTable';
import { ArrowUpDown, Pencil, Trash, Download, Search, Folder as FolderIcon } from 'lucide-react';
import { Folder } from '@/types/Folder';
import { useDeleteFolder, useFolders, useUpdateFolder, useDownloadZip } from '@/lib/FolderAPI';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import Link from 'next/link';
import { formatFileSize } from '@/utils/fileSizeFormatter';
import AppConfirmationDialog from './AppConfirmationDialog';
import AppFolderForm from './AppFolderForm';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import debounce from 'lodash.debounce';
import User from '@/types/User';
import { api } from '@/lib/api';
import AppSubFolderForm from './AppSubFolderForm';

interface AppFoldersTableProps {
    setSelectedFolders: React.Dispatch<React.SetStateAction<number[]>>;
    selectedFolders: number[];
}

export default function AppFoldersTable({ setSelectedFolders, selectedFolders }: AppFoldersTableProps) {

    const queryClient = useQueryClient();
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [searchKeyword, setSearchKeyword] = React.useState('');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isAddSubFolderDialogOpen, setIsAddSubFolderDialogOpen] = useState(false);
    const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [showAllFolders, setShowAllFolders] = useState(true);

    const toggleFolderView = () => {
        setShowAllFolders((prev) => !prev);
    };

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


    const debouncedSetSearchKeyword = React.useCallback(
        debounce((value: string) => setSearchKeyword(value), 300),
        [setSearchKeyword]
    );

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        debouncedSetSearchKeyword(event.target.value);
    };

    const { data, isLoading } = useFolders(
        pageIndex + 1,
        pageSize,
        searchKeyword,
        sorting.map((item) => item.id).join(','),
        Boolean(sorting.map((item) => item.desc).join(',')),
        user?.position?.department_id,
        showAllFolders
    );

    const { mutate } = useDeleteFolder();
    const { mutate: updateFolder } = useUpdateFolder();
    const { mutate: downloadZip } = useDownloadZip();

    const handleEditFolder = (folder: Folder) => {
        setSelectedFolder(folder);
        setIsEditDialogOpen(true);
    };

    const handleAddSubFolder = (folder: Folder) => {
        setSelectedFolder(folder);
        setIsAddSubFolderDialogOpen(true);
    };

    const handleDeleteFolder = (id: number) => {
        mutate(id, {
            onSettled: () => {
                queryClient.invalidateQueries({ queryKey: ['folders'] });
            }
        });
    };

    const handleDownloadZip = async (folder: Folder) => {
        downloadZip(folder.id!, {
            onSuccess: (response) => {
                if (!response || typeof response.data !== 'string') {
                    console.error('Invalid response format:', response);
                    return;
                }

                const url = response.data;
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${folder.folder_name}.zip`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            },
            onError: (error) => {
                console.error('Error downloading zip:', error);
            },
        });
    };

    const handleCheckboxChange = (id: number) => {
        setSelectedFolders((prevSelected: number[]) =>
            prevSelected.includes(id)
                ? prevSelected.filter((folderId: number) => folderId !== id)
                : [...prevSelected, id]
        );
    };


    const columns: ColumnDef<Folder>[] = [
        {
            id: "select",
            header: () => (
                <input
                    type="checkbox"
                    onChange={(e) => {
                        const allIds: number[] =
                            data?.data
                                .map((folder: { id: number }) => folder.id)
                                .filter((id: number): id is number => id !== undefined) || [];
                        setSelectedFolders(e.target.checked ? allIds : []);
                    }}
                    checked={selectedFolders.length === (data?.data.length || 0)}
                />
            ),
            cell: ({ row }) => (
                <input
                    type="checkbox"
                    checked={selectedFolders.includes(row.original.id!)}
                    onChange={() => {
                        if (row.original.id !== undefined) {
                            handleCheckboxChange(row.original.id);
                        }
                    }}
                />
            ),
        },
        {
            accessorKey: 'date_upload',
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
                row.original.created_at
                    ? `${format(new Date(row.original.created_at), "MMM dd, yyyy")}`
                    : "",
            enableSorting: true,
        },
        {
            accessorKey: 'departments',
            header: ({ column }) => (
                <Button
                    variant='ghost'
                    className='pl-0 text-left hover:!bg-transparent'
                >
                    Department/s
                </Button>
            ),
            cell: ({ row }) => (
                <div className="flex flex-wrap gap-2">
                    {row.original.departments?.map((d, index) => (
                        <Badge key={index} variant="outline" className="px-2 py-1">
                            {d.name}
                        </Badge>
                    ))}
                </div>
            ),
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
                    Folder Name (Main)
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
                    Folder Name (Sub)
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
                >
                    Files
                </Button>
            ),
            cell: ({ row }) => {
                const file_uploads = row.original.file_uploads ?? [];
                console.log("files", file_uploads)
                return (
                    <div className="flex flex-col gap-1">
                        {file_uploads && file_uploads.length > 0 ? (
                            file_uploads.map((file, index) => (
                                <div key={index} className="inline-flex">
                                    <Badge variant="secondary" className="px-3 py-1 text-sm w-fit">
                                        <Link
                                            href={`${process.env.NEXT_PUBLIC_API_URL || ''}/storage/${file.path}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="whitespace-nowrap"
                                        >
                                            {file.filename}
                                        </Link>
                                    </Badge>
                                </div>
                            ))
                        ) : (
                            <span>No files available</span>
                        )}
                    </div>
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
                >
                    Size
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
        // {
        //     accessorKey: 'local_path',
        //     header: ({ column }) => (
        //         <Button
        //             variant='ghost'
        //             className='pl-0 text-left hover:!bg-transparent'
        //             onClick={() => column.toggleSorting()}
        //         >
        //             Folder Location (Local)
        //             <ArrowUpDown className='ml-2 h-4 w-4' />
        //         </Button>
        //     ),
        //     cell: ({ row }) => row.original.local_path,
        //     enableSorting: true,
        // },
        {
            accessorKey: 'coverage_period',
            header: ({ column }) => (
                <Button
                    variant='ghost'
                    className='pl-0 text-left hover:!bg-transparent'
                >
                    Coverage Period
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
            cell: ({ row }) => {
                const upload_files = row.original.file_uploads ?? [];

                return (
                    <div className="flex justify-center items-center">
                        <Dialog>
                            <DialogTrigger asChild>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                type='button'
                                                variant="default"
                                                onClick={() => handleAddSubFolder(row.original)}
                                            >
                                                <FolderIcon className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Add Subfolder</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </DialogTrigger>
                        </Dialog>

                        {upload_files.length > 0 && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            type='button'
                                            variant="secondary"
                                            className="ml-2"
                                            onClick={() => handleDownloadZip(row.original)}
                                        >
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Download as ZIP</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        type='button'
                                        variant="outline"
                                        className="mr-2 ml-2"
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
                );
            },
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
            <div className="flex items-center gap-4 w-full">
                <div className="relative w-full max-w-xs">
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Search..."
                        className="pl-10"
                        onChange={handleSearchChange}
                    />
                </div>

                <div className="flex gap-2">
                    <Button onClick={toggleFolderView}>
                        {showAllFolders ? 'Show Main Folders Only' : 'Show All Folders'}
                    </Button>
                </div>
            </div>

            <AppTable table={table} />
            {selectedFolder && (
                <AppFolderForm
                    data={selectedFolder}
                    isOpen={isEditDialogOpen}
                    onClose={() => setIsEditDialogOpen(false)}
                    queryClient={queryClient}
                />
            )}

            {selectedFolder && (
                <AppSubFolderForm
                    folder={selectedFolder}
                    isOpen={isAddSubFolderDialogOpen}
                    onClose={() => setIsAddSubFolderDialogOpen(false)}
                    queryClient={queryClient}
                />
            )}
        </div>
    );
}
