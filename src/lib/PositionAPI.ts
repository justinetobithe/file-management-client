import { api } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import Response from '@/types/Response';
import { Position } from '@/types/Position';
import { useMutation, useQuery } from '@tanstack/react-query';

export const createPosition = async (inputs: Position): Promise<Response> => {
    const response = await api.post<Response>(`/api/position`, inputs);
    return response.data;
};

export const updatePosition = async (id: number, inputs: Position): Promise<Response> => {
    const response = await api.put<Response>(`/api/position/${id}`, inputs);
    return response.data;
};

export const deletePosition = async (id: number): Promise<Response> => {
    const response = await api.delete(`/api/position/${id}`);
    return response.data;
};


export const useCreatePosition = () => {
    return useMutation({
        mutationFn: async (inputs: Position) => {
            return await createPosition(inputs);
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

export const useUpdatePosition = () => {
    return useMutation({
        mutationFn: async ({ id, positionData }: { id: number; positionData: Position }) => {
            return await updatePosition(id, positionData);
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

export const useDeletePosition = () => {
    return useMutation({
        mutationFn: async (id: number) => {
            return await deletePosition(id);
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
