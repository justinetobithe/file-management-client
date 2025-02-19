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
import { AttendanceRecord } from '@/types/AttendanceRecord';
import { useQueryClient } from '@tanstack/react-query';
import { useAttendanceRecords } from '@/lib/AttendanceRecordAPI';
import moment from 'moment';


export default function AppAttendanceRecordsTable() {
    const queryClient = useQueryClient();
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [searchKeyword, setSearchKeyword] = React.useState('');
    const [sorting, setSorting] = useState<SortingState>([]);

    const { data, isLoading } = useAttendanceRecords(
        pageIndex + 1,
        pageSize,
        searchKeyword,
        sorting.map((item) => item.id).join(','),
        Boolean(sorting.map((item) => item.desc).join(','))
    );


    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'orange';
            case 'completed':
                return 'green';
            case 'canceled':
                return 'red';
            case 'in_progress':
                return 'blue';
            case 'failed':
                return 'gray';
            default:
                return 'black';
        }
    };

    const columns: ColumnDef<AttendanceRecord>[] = [
        {
            accessorKey: 'student',
            header: ({ column }) => (
                <Button
                    variant='ghost'
                    className='pl-0 text-left hover:!bg-transparent'
                    onClick={() => column.toggleSorting()}
                >
                    Student
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            ),
            cell: ({ row }) => {
                const { first_name, last_name } = row.original.student?.user || {};
                return `${first_name} ${last_name}`;
            },
            enableSorting: true,
        },
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
            cell: ({ row }) => moment(row.original.date).format('MMMM DD, YYYY'),
            enableSorting: true,
        },
        {
            accessorKey: 'time_in',
            header: ({ column }) => (
                <Button
                    variant='ghost'
                    className='pl-0 text-left hover:!bg-transparent'
                    onClick={() => column.toggleSorting()}
                >
                    Time In
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            ),
            cell: ({ row }) => moment(row.original.time_in, 'HH:mm:ss').format('hh:mm A'),
            enableSorting: true,
        },
        {
            accessorKey: 'time_out',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    className="pl-0 text-left hover:!bg-transparent"
                    onClick={() => column.toggleSorting()}
                >
                    Time Out
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => {
                const timeOut = row.original.time_out;
                return timeOut
                    ? moment(timeOut, 'HH:mm:ss').format('hh:mm A')
                    : '';
            },
            enableSorting: true,
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
        </div>
    );
}
