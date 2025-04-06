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
    all_folders = true,
    status = ''
): Promise<{ data: Folder[]; last_page: number }> => {
    const response = await api.get<{ data: { data: Folder[]; current_page: number; last_page: number; total: number } }>(`/api/folders`, {
        params: {
            page,
            ...(pageSize && { page_size: pageSize }),
            ...(filter && { filter }),
            ...(sortColumn && { sort_column: sortColumn }),
            sort_desc: sortDesc,
            all_folders: all_folders ?? false,
            status: status ?? '',
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
    return response.data.data;
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

export const approveFolder = async (id: number): Promise<Response> => {
    const response = await api.post(`/api/folder/${id}/approve`);
    return response.data;
};

export const rejectFolder = async (id: number): Promise<Response> => {
    const response = await api.post(`/api/folder/${id}/reject`);
    return response.data;
};

export const addFolder = async (inputs: Folder): Promise<Response> => {
    const response = await api.post<Response>(`/api/folder/add`, inputs, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.data;
};

export const addSubfolder = async (inputs: Folder): Promise<Response> => {
    const response = await api.post<Response>(`/api/folder`, inputs, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const updateSubfolder = async (id: number, inputs: Folder): Promise<Response> => {
    const response = await api.post<Response>(`/api/folder/${id}`, inputs, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const useFolders = (
    page: number,
    pageSize: number,
    searchKeyword?: string,
    sortBy?: string,
    sortDesc?: boolean,
    allFolders?: boolean,
    status?: string
) => {
    return useQuery({
        queryKey: ['folders', page, pageSize, searchKeyword, sortBy, sortDesc, allFolders, status],
        queryFn: async () => {
            const response = await api.get('/api/folders', {
                params: {
                    page,
                    per_page: pageSize,
                    search: searchKeyword,
                    sort_by: sortBy,
                    sort_desc: sortDesc,
                    all_folders: allFolders,
                    status: status,
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

export const useApproveFolder = () => {
    return useMutation({
        mutationFn: async (id: number) => {
            return await approveFolder(id);
        },
        onSuccess: (response) => {
            if (response && response.status === "success") {
                toast({
                    variant: 'success',
                    description: response.message || 'Folder approved successfully!',
                });
            }
        },
    });
};

export const useRejectFolder = () => {
    return useMutation({
        mutationFn: async (id: number) => {
            return await rejectFolder(id);
        },
        onSuccess: (response) => {
            if (response && response.status === "success") {
                toast({
                    variant: 'success',
                    description: response.message || 'Folder rejected successfully!',
                });
            }
        },
    });
};

export const useAddFolder = () => {
    return useMutation({
        mutationFn: async (inputs: Folder) => {
            return await addFolder(inputs);
        },
        onSuccess: (response) => {
            if (response && response.status === 'success') {
                toast({
                    variant: 'success',
                    description: response.message,
                });
            }
        },
    });
};

export const useAddSubFolder = () => {
    return useMutation({
        mutationFn: async (inputs: Folder) => {
            return await addSubfolder(inputs);
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

export const useUpdateSubFolder = () => {
    return useMutation({
        mutationFn: async ({ id, folderData }: { id: number; folderData: Folder }) => {
            return await updateSubfolder(id, folderData);
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