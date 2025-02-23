import { api } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import Response from '@/types/Response';
import { Designation } from '@/types/Designation';
import { useMutation, useQuery } from '@tanstack/react-query';

export const getDesignations = async (
    page: number = 1,
    pageSize: number = 10,
    filter = '',
    sortColumn = '',
    sortDesc = false
): Promise<{ data: Designation[]; last_page: number }> => {
    const response = await api.get<{ data: { data: Designation[]; current_page: number; last_page: number; total: number } }>(`/api/designations`, {
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

export const showDesignation = async (id: number): Promise<Response> => {
    const response = await api.get(`/api/designation/${id}`);
    return response.data;
};

export const createDesignation = async (inputs: Designation): Promise<Response> => {
    const response = await api.post<Response>(`/api/designation`, inputs);
    return response.data;
};

export const updateDesignation = async (id: number, inputs: Designation): Promise<Response> => {
    const response = await api.put<Response>(`/api/designation/${id}`, inputs);
    return response.data;
};

export const deleteDesignation = async (id: number): Promise<Response> => {
    const response = await api.delete(`/api/designation/${id}`);
    return response.data;
};

export const useDesignations = (
    page: number = 1,
    pageSize: number = 10,
    globalFilter = '',
    sortColumn = '',
    sortDesc = false
) =>
    useQuery({
        queryKey: ['designations', page, pageSize, globalFilter, sortColumn, sortDesc],
        queryFn: async (): Promise<{ data: Designation[]; last_page: number }> => {
            return await getDesignations(page, pageSize, globalFilter, sortColumn, sortDesc);
        },
    });

export const useShowDesignation = () => {
    return useMutation({
        mutationFn: async (id: number) => {
            return await showDesignation(id);
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

export const useCreateDesignation = () => {
    return useMutation({
        mutationFn: async (inputs: Designation) => {
            return await createDesignation(inputs);
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

export const useUpdateDesignation = () => {
    return useMutation({
        mutationFn: async ({ id, designationData }: { id: number; designationData: Designation }) => {
            return await updateDesignation(id, designationData);
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

export const useDeleteDesignation = () => {
    return useMutation({
        mutationFn: async (id: number) => {
            return await deleteDesignation(id);
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
