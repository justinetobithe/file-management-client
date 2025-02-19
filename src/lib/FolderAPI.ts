import { api } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import Response from '@/types/Response';
import { Folder } from '@/types/Folder';
import { useMutation, useQuery } from '@tanstack/react-query';

export const getFolders = async (
    page: number = 1,
    pageSize: number = 10,
    filter = '',
    sortColumn = '',
    sortDesc = false
): Promise<{ data: Folder[]; last_page: number }> => {
    const response = await api.get<{ data: { data: Folder[]; current_page: number; last_page: number; total: number } }>(`/api/folders`, {
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

export const showFolder = async (id: number): Promise<Response> => {
    const response = await api.get(`/api/folder/${id}`);
    return response.data;
};

export const createFolder = async (inputs: Folder): Promise<Response> => {
    const response = await api.post<Response>(`/api/folder`, inputs, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const updateFolder = async (id: number, inputs: Folder): Promise<Response> => {
    const response = await api.post<Response>(`/api/folder/${id}`, inputs, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const deleteFolder = async (id: number): Promise<Response> => {
    const response = await api.delete(`/api/folder/${id}`);
    return response.data;
};

export const useFolders = (
    page: number = 1,
    pageSize: number = 10,
    globalFilter = '',
    sortColumn = '',
    sortDesc = false
) =>
    useQuery({
        queryKey: ['folders', page, pageSize, globalFilter, sortColumn, sortDesc],
        queryFn: async (): Promise<{ data: Folder[]; last_page: number }> => {
            return await getFolders(page, pageSize, globalFilter, sortColumn, sortDesc);
        },
    });

export const useShowFolder = () => {
    return useMutation({
        mutationFn: async (id: number) => {
            return await showFolder(id);
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

export const useCreateFolder = () => {
    return useMutation({
        mutationFn: async (inputs: Folder) => {
            return await createFolder(inputs);
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

export const useUpdateFolder = () => {
    return useMutation({
        mutationFn: async ({ id, folderData }: { id: number; folderData: Folder }) => {
            return await updateFolder(id, folderData);
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

export const useDeleteFolder = () => {
    return useMutation({
        mutationFn: async (id: number) => {
            return await deleteFolder(id);
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
