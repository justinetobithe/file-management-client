import { api } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import Response from '@/types/Response';
import AuditLog from '@/types/AuditLog';
import { useMutation, useQuery } from '@tanstack/react-query';

export const getAuditLogs = async (
    page: number = 1,
    pageSize: number = 10,
    filter = '',
    sortColumn = '',
    sortDesc = false
): Promise<{ data: AuditLog[]; last_page: number }> => {
    const response = await api.get<{ data: { data: AuditLog[]; current_page: number; last_page: number; total: number } }>(`/api/activitylogs/all`, {
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

export const useAuditLogs = (
    page: number = 1,
    pageSize: number = 10,
    globalFilter = '',
    sortColumn = '',
    sortDesc = false
) =>
    useQuery({
        queryKey: ['audit-logs', page, pageSize, globalFilter, sortColumn, sortDesc],
        queryFn: async (): Promise<{ data: AuditLog[]; last_page: number }> => {
            return await getAuditLogs(page, pageSize, globalFilter, sortColumn, sortDesc);
        },
    });