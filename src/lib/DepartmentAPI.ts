import { api } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import Response from '@/types/Response';
import { Department } from '@/types/Department';
import { useMutation, useQuery } from '@tanstack/react-query';

export const getDepartments = async (
    page: number = 1,
    pageSize: number = 10,
    filter = '',
    sortColumn = '',
    sortDesc = false
): Promise<{ data: Department[]; last_page: number }> => {
    const response = await api.get<{ data: { data: Department[]; current_page: number; last_page: number; total: number } }>(`/api/departments`, {
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

export const showDepartment = async (id: number): Promise<Response> => {
    const response = await api.get(`/api/department/${id}`);
    return response.data;
};

export const createDepartment = async (inputs: Department): Promise<Response> => {
    const response = await api.post<Response>(`/api/department`, inputs);
    return response.data;
};

export const updateDepartment = async (id: number, inputs: Department): Promise<Response> => {
    const response = await api.put<Response>(`/api/department/${id}`, inputs);
    return response.data;
};

export const deleteDepartment = async (id: number): Promise<Response> => {
    const response = await api.delete(`/api/department/${id}`);
    return response.data;
};

export const useDepartments = (
    page: number = 1,
    pageSize: number = 10,
    globalFilter = '',
    sortColumn = '',
    sortDesc = false
) =>
    useQuery({
        queryKey: ['departments', page, pageSize, globalFilter, sortColumn, sortDesc],
        queryFn: async (): Promise<{ data: Department[]; last_page: number }> => {
            return await getDepartments(page, pageSize, globalFilter, sortColumn, sortDesc);
        },
    });

export const useShowDepartment = () => {
    return useMutation({
        mutationFn: async (id: number) => {
            return await showDepartment(id);
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

export const useCreateDepartment = () => {
    return useMutation({
        mutationFn: async (inputs: Department) => {
            return await createDepartment(inputs);
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

export const useUpdateDepartment = () => {
    return useMutation({
        mutationFn: async ({ id, departmentData }: { id: number; departmentData: Department }) => {
            return await updateDepartment(id, departmentData);
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

export const useDeleteDepartment = () => {
    return useMutation({
        mutationFn: async (id: number) => {
            return await deleteDepartment(id);
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
