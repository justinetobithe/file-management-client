import { api } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import Response from '@/types/Response';
import { Student } from '@/types/Student';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const getStudents = async (
    page: number = 1,
    pageSize: number = 10,
    filter = '',
    sortColumn = '',
    sortDesc = false
): Promise<{ data: Student[]; last_page: number }> => {
    const response = await api.get<{ data: { data: Student[]; current_page: number; last_page: number; total: number } }>(`/api/students`, {
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

export const useStudents = (
    page: number = 1,
    pageSize: number = 10,
    globalFilter = '',
    sortColumn = '',
    sortDesc = false
) =>
    useQuery({
        queryKey: ['students', page, pageSize, globalFilter, sortColumn, sortDesc],
        queryFn: async (): Promise<{ data: Student[]; last_page: number }> => {
            return await getStudents(page, pageSize, globalFilter, sortColumn, sortDesc);
        },
    });

