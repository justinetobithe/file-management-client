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
    sortDesc = false,
    department_id = null,
    all_folders = true,
): Promise<{ data: Folder[]; last_page: number }> => {
    const response = await api.get<{ data: { data: Folder[]; current_page: number; last_page: number; total: number } }>(`/api/folders`, {
        params: {
            page,
            ...(pageSize && { page_size: pageSize }),
            ...(filter && { filter }),
            ...(sortColumn && { sort_column: sortColumn }),
            sort_desc: sortDesc,
            ...(department_id !== null && { department_id }),
            all_folders: all_folders ?? false
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

export const downloadZip = async (id: number): Promise<Response> => {
    const response = await api.get(`/api/folder/${id}/download`);
    return response.data;
};

export const useFolders = (
    page: number,
    pageSize: number,
    searchKeyword?: string,
    sortBy?: string,
    sortDesc?: boolean,
    departmentId?: number,
    allFolders?: boolean
) => {
    return useQuery({
        queryKey: ['folders', page, pageSize, searchKeyword, sortBy, sortDesc, departmentId, allFolders],
        queryFn: async () => {
            const response = await api.get('/api/folders', {
                params: {
                    page,
                    per_page: pageSize,
                    search: searchKeyword,
                    sort_by: sortBy,
                    sort_desc: sortDesc,
                    department_id: departmentId,
                    all_folders: allFolders
                },
            });

            return response.data;
        },
    });
};

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

export const useDownloadZip = () => {
    return useMutation({
        mutationFn: async (id: number) => {
            return await downloadZip(id);
        },
        onSuccess: (response) => {
            if (response && response.status === "success") {
                // toast({
                //     variant: 'success',
                //     description: response.message,
                // });
            }
        },
    });
};
