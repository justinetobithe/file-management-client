import { api } from './api';
import User from '@/types/User';
import apiError from '@/lib/apiError';
import { useMutation } from '@tanstack/react-query';
import { RegisterInputs } from '@/app/(auth)/register/components/RegisterForm';
import { toast } from '@/components/ui/use-toast';
import Response from '@/types/Response';
import { signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
export interface LoginResponse {
  data: {
    token: string;
    user: User;
  };
}

export const login = async (
  email: string,
  password: string
): Promise<[LoginResponse | null, string | null]> => {
  try {
    const { data } = await api.post<LoginResponse>('/api/login', {
      email,
      password,
    });
    return [data, null];
  } catch (err) {
    return [null, apiError(err)];
  }
};

export const loginWithGoogle = async (
  provider: string = 'google',
  access_provider_token: string
): Promise<[LoginResponse | null, string | null]> => {
  try {
    const { data } = await api.post<LoginResponse>('/api/login/google', {
      provider,
      access_provider_token,
    });
    return [data, null];
  } catch (err) {
    return [null, apiError(err)];
  }
};

export const register = async (
  inputs: RegisterInputs,
  isGoogleSignin: boolean = false
): Promise<Response> => {
  const fd = new FormData();
  for (const item in inputs) {
    fd.append(item, inputs[item as keyof RegisterInputs]);
  }

  if (isGoogleSignin) {
    fd.append('provider', 'google');
  }
  const { data } = await api.post<Response>('/api/auth/register', fd, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async ({
      inputs,
      isGoogleSignin = false,
    }: {
      inputs: RegisterInputs;
      isGoogleSignin: boolean;
    }): Promise<Response> => {
      return await register(inputs, isGoogleSignin);
    },
    onSuccess: async (data: Response, { inputs, isGoogleSignin }) => {
      toast({
        description: data.message,
        variant: 'success',
        duration: 1000,
      });

      setTimeout(async () => {
        if (isGoogleSignin) {
          router.push('/login');
          return;
        }

        const response = await signIn('credentials', {
          ...inputs,
          redirect: false,
        });
        if (response?.error) {
          toast({
            title: 'Uh oh! Something went wrong.',
            description: response.error,
            variant: 'destructive',
          });
        } else {
          router.refresh();
        }
      }, 1000);
    },
  });
};

export const logout = async () => {
  await api.post('/api/logout');
};

export const useLogout = () => {
  return useMutation({
    mutationFn: async () => {
      return await logout();
    },
    onSettled: () => {
      signOut({
        callbackUrl: '/login',
      });
    },
  });
};
