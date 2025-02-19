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
} from "@/components/ui/tooltip"
import { Skeleton } from '@/components/ui/skeleton';
import AppTable from '@/components/AppTable';
import { ArrowUpDown, Pencil, XCircle, Trash, UserCheck } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import AuditLog from '@/types/AuditLog';
import { useAuditLogs } from '@/lib/AuditLogsAPI';
import AppUserForm from './AppUserForm';
import { useQueryClient } from '@tanstack/react-query';

export default function AppAuditLogsTable() {
    const queryClient = useQueryClient();
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [searchKeyword, setSearchKeyword] = React.useState('');
    const [sorting, setSorting] = useState<SortingState>([]);

    const { data, isLoading } = useAuditLogs(
        pageIndex + 1,
        pageSize,
        searchKeyword,
        sorting.map((item) => item.id).join(','),
        Boolean(sorting.map((item) => item.desc).join(','))
    );

    const [rowSelection, setRowSelection] = useState({});
    const columns: ColumnDef<AuditLog>[] = [
        {
            accessorKey: 'date',
            header: ({ column }) => (
                <Button
                    variant='ghost'
                    className='pl-0 text-left hover:!bg-transparent'
                    onClick={() => column.toggleSorting()}
                >
                    Date
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            ),
            cell: ({ row }) => {
                const item = row.original;
                return <div>{item.date}</div>;
            },
            enableSorting: true,
        },
        {
            accessorKey: 'time',
            header: () => (
                <Button
                    variant='ghost'
                    className='pl-0 text-left hover:!bg-transparent'
                >
                    Time
                </Button>
            ),
            cell: ({ row }) => {
                const item = row.original;
                return <div>{item.time}</div>;
            },
        },
        {
            accessorKey: 'user',
            header: () => (
                <Button
                    variant='ghost'
                    className='pl-0 text-left hover:!bg-transparent'
                >
                    User
                </Button>
            ),
            cell: ({ row }) => {
                const item = row.original;
                return <div>{item.user}</div>;
            },
        },
        {
            accessorKey: 'change_type',
            header: () => (
                <Button
                    variant='ghost'
                    className='pl-0 text-left hover:!bg-transparent'
                >
                    Change Type
                </Button>
            ),
            cell: ({ row }) => {
                const item = row.original;
                return <div>{item.change_type}</div>;
            },
        },
        {
            accessorKey: 'record_type',
            header: () => (
                <Button
                    variant='ghost'
                    className='pl-0 text-left hover:!bg-transparent'
                >
                    Record Type
                </Button>
            ),
            cell: ({ row }) => {
                const item = row.original;
                return <div>{item.record_type}</div>;
            },
        },
        {
            accessorKey: 'record_id',
            header: () => (
                <Button
                    variant='ghost'
                    className='pl-0 text-left hover:!bg-transparent'
                >
                    Record ID
                </Button>
            ),
            cell: ({ row }) => {
                const item = row.original;
                return <div>{item.record_id}</div>;
            },
        },
        {
            accessorKey: 'old_value',
            header: () => (
                <Button
                    variant='ghost'
                    className='pl-0 text-left hover:!bg-transparent'
                >
                    Old Value
                </Button>
            ),
            cell: ({ row }) => {
                const item = row.original;
                return <div>{item.old_value}</div>;
            },
        },
        {
            accessorKey: 'new_value',
            header: () => (
                <Button
                    variant='ghost'
                    className='pl-0 text-left hover:!bg-transparent'
                >
                    New Value
                </Button>
            ),
            cell: ({ row }) => {
                const item = row.original;
                return <div>{item.new_value}</div>;
            },
        },
        {
            accessorKey: 'message',
            header: () => (
                <Button
                    variant='ghost'
                    className='pl-0 text-left hover:!bg-transparent'
                >
                    Message
                </Button>
            ),
            cell: ({ row }) => {
                const item = row.original;
                return <div>{item.message}</div>;
            },
        },
    ];

    const pagination = React.useMemo(
        () => ({
            pageIndex,
            pageSize,
        }),
        [pageIndex, pageSize]
    );

    const table = useReactTable({
        data: data?.data ?? Array(10).fill({}),
        columns: isLoading
            ? columns.map((column) => ({
                ...column,
                cell: () => <Skeleton className='h-12 w-full' />,
            }))
            : columns,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPagination,
        onGlobalFilterChange: setSearchKeyword,
        pageCount: data?.last_page ?? -1,
        manualPagination: true,
        manualFiltering: true,
        manualSorting: true,
        state: {
            sorting,
            rowSelection,
            pagination,
            globalFilter: searchKeyword,
        },
    });

    return (
        <div>
            <AppTable table={table} />
        </div>
    );
}
