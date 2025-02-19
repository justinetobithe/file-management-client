import { toast } from '@/components/ui/use-toast';
import axios from 'axios';
import { Session, getServerSession } from 'next-auth';
import { getSession, signOut } from 'next-auth/react';
import AuthOptions from './AuthOptions';

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: baseURL,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true,
});

let lastSession: Session | null = null;

api.interceptors.request.use(async (request) => {
  if (typeof window === 'undefined') {
    const session = await getServerSession(AuthOptions);
    if (session) {
      request.headers.Authorization = `Bearer ${session.user.auth_token}`;
    } else {
      request.headers.Authorization = undefined;
    }
    return request;
  } else {
    if (lastSession == null || Date.now() > Date.parse(lastSession.expires)) {
      const session = await getSession();
      lastSession = session;
    }

    if (lastSession) {
      request.headers.Authorization = `Bearer ${lastSession.user.auth_token}`;
    } else {
      request.headers.Authorization = undefined;
    }
    return request;
  }
});

api.interceptors.response.use(undefined, async (error) => {
  if (axios.isAxiosError(error)) {
    if (error.response?.status == 401) {
      signOut({
        callbackUrl: '/login',
      });

      // SHOW MESSAGE
      toast({
        description: 'Unauthenticated',
        variant: 'destructive',
      });
      return Promise.reject(error);
    }

    // SHOW MESSAGE
    toast({
      description: error.response ? error.response.data.message : error.message,
      variant: 'destructive',
    });
  }
  return Promise.reject(error);
});
