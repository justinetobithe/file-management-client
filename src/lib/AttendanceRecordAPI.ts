import { api } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import Response from '@/types/Response';
import { AttendanceRecord } from '@/types/AttendanceRecord';
import { useMutation, useQuery } from '@tanstack/react-query';

export const getAttendanceRecords = async (
    page: number = 1,
    pageSize: number = 10,
    filter = '',
    sortColumn = '',
    sortDesc = false
): Promise<{ data: AttendanceRecord[]; last_page: number }> => {
    const response = await api.get<{ data: { data: AttendanceRecord[]; current_page: number; last_page: number; total: number } }>(`/api/attendance-records`, {
        params: {
            page,
            ...(pageSize && { page_size: pageSize }),
            ...(filter && { filter }),
            ...(sortColumn && { sort_column: sortColumn }),
            sort_desc: sortDesc,
        },
    });

    const { data } = response.data;

    return {
        data: data.data,
        last_page: data?.last_page,
    };
};

export const useAttendanceRecords = (
    page: number = 1,
    pageSize: number = 10,
    globalFilter = '',
    sortColumn = '',
    sortDesc = false
) =>
    useQuery({
        queryKey: ['attendance-records', page, pageSize, globalFilter, sortColumn, sortDesc],
        queryFn: async (): Promise<{ data: AttendanceRecord[]; last_page: number }> => {
            return await getAttendanceRecords(page, pageSize, globalFilter, sortColumn, sortDesc);
        },
    }); 