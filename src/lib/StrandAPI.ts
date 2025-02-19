import { api } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import Response from '@/types/Response';
import { Strand } from '@/types/Strand';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const getStrands = async (
    page: number = 1,
    pageSize: number = 10,
    filter = '',
    sortColumn = '',
    sortDesc = false
): Promise<{ data: Strand[]; last_page: number }> => {
    const response = await api.get<{ data: { data: Strand[]; current_page: number; last_page: number; total: number } }>(`/api/strands`, {
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

export const createStrand = async (inputs: Strand): Promise<Response> => {
    const response = await api.post<Response>(`/api/strand`, inputs);
    return response.data;
};

export const updateStrand = async (id: number, inputs: Strand): Promise<Response> => {
    const response = await api.put<Response>(`/api/strand/${id}`, inputs);
    return response.data;
};

export const deleteStrand = async (id: number): Promise<Response> => {
    const response = await api.delete(`/api/strand/${id}`);
    return response.data;
};

export const useStrands = (
    page: number = 1,
    pageSize: number = 10,
    globalFilter = '',
    sortColumn = '',
    sortDesc = false
) =>
    useQuery({
        queryKey: ['strands', page, pageSize, globalFilter, sortColumn, sortDesc],
        queryFn: async (): Promise<{ data: Strand[]; last_page: number }> => {
            return await getStrands(page, pageSize, globalFilter, sortColumn, sortDesc);
        },
    });

export const useCreateStrand = () => {
    const queryClient = useQueryClient();
    ``
    return useMutation({
        mutationFn: async (inputs: Strand) => {
            return await createStrand(inputs);
        },
        onSuccess: (response) => {
            if (response && response.status === "success") {
                queryClient.invalidateQueries({ queryKey: ['strands'] });
                toast({
                    variant: 'success',
                    description: response.message,
                });
            }
        },
    });
};

export const useUpdateStrand = () => {
    return useMutation({
        mutationFn: async ({ id, strandData }: { id: number; strandData: Strand }) => {
            return await updateStrand(id, strandData);
        },
        onSuccess: (response) => {
            if (response && response.status === "success") {
                toast({
                    variant: 'success',
                    description: response.message,
                });
            }
        },
    });
};

export const useDeleteStrand = () => {
    return useMutation({
        mutationFn: async (id: number) => {
            return await deleteStrand(id);
        },
        onSuccess: (response) => {
            if (response && response.status === "success") {
                toast({
                    variant: 'success',
                    description: response.message,
                });
            }
        },
    });
};
