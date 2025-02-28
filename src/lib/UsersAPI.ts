import { toast } from '@/components/ui/use-toast';
import { api } from '@/lib/api';
import Response from '@/types/Response';
import { UserPaginatedData } from '@/types/User';
import { useMutation, useQuery } from '@tanstack/react-query';
import User from '@/types/User';
import { UserInput } from '@/components/AppUserForm';
import { ProfileFormInputs } from '@/app/(protected)/profile/components/ProfileForm'
import { getServerSession } from 'next-auth';
import AuthOptions from '@/lib/AuthOptions';

export const getUsers = async (
  page: number = 1,
  pageSize: number = 10,
  filter = '',
  sortColumn = '',
  sortDesc = false
): Promise<UserPaginatedData> => {
  const response = await api.get<{ data: { data: User[]; current_page: number; last_page: number; total: number } }>(`/api/users`, {
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
    last_page: data?.last_page
  };
};

export const useUsers = (
  page: number = 1,
  pageSize: number = 10,
  globalFilter = '',
  sortColumn = '',
  sortDesc = false
) =>
  useQuery({
    queryKey: ['users', page, pageSize, globalFilter, sortColumn, sortDesc],
    queryFn: async (): Promise<UserPaginatedData> => {
      return await getUsers(page, pageSize, globalFilter, sortColumn, sortDesc);
    },
  });

export const createUser = async (inputs: UserInput): Promise<Response> => {
  const response = await api.post<Response>(`/api/user`, inputs, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateUser = async (id: string, inputs: UserInput | ProfileFormInputs | FormData): Promise<Response> => {
  const response = await api.put<Response>(`/api/user/${id}`, inputs, {
    headers: {
      'Content-Type': inputs instanceof FormData ? 'multipart/form-data' : 'application/json',
    },
  });
  return response.data;
};

export const deleteUser = async (id: string, password?: string): Promise<Response> => {
  const response = await api.delete(`/api/user/${id}`, {
    data: password ? { password } : {},
  });
  return response.data;
};

export const updateUserStatus = async (id: string, status: number): Promise<Response> => {
  const response = await api.put<Response>(`/api/user/${id}/status`, { status });
  return response.data;
};

export const useCreateUser = () => {
  return useMutation({
    mutationFn: async (inputs: UserInput) => {
      return await createUser(inputs);
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

export const useUpdateUser = () => {
  return useMutation({
    mutationFn: async ({ id, userData }: { id: string; userData: UserInput | ProfileFormInputs }) => {
      return await updateUser(id, userData);
    },
    onSuccess: async (response) => {
      console.log("response update", response)
      if (response && response.status === "success") {
        toast({
          variant: 'success',
          description: response.message,
        });
      } else {
        toast({
          variant: 'destructive',
          description: response.message,
        });
      }
      await getServerSession(AuthOptions);
    },
  });
};

export const useDeleteUser = () => {
  return useMutation({
    mutationFn: async ({ id, password }: { id: string; password?: string }) => {
      return await deleteUser(id, password);
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
 
export const useUpdateUserStatus = () => {
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: number }) => {
      return await updateUserStatus(id, status);
    },
    onSuccess: (response) => {
      if (response && response.status === "success") {
        toast({
          variant: 'success',
          description: response.message,
        });
      }
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        description: error?.message || 'Something went wrong!',
      });
    },
  });
};
