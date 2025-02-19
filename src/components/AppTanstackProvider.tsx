'use client';
import React, { FC, useState } from 'react';

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import axios from 'axios';
import { signOut } from 'next-auth/react';
import { toast } from '@/components/ui/use-toast';

const AppTanstackProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retryDelay: (attemptIndex) =>
              Math.min(1000 * 2 ** attemptIndex, 5000),
            retry: 1,
          },
        },
        queryCache: new QueryCache({
          onError: (error) => {
            if (axios.isAxiosError(error)) {
              if (error.response?.status == 401) {
                signOut({
                  callbackUrl: '/login',
                });
              }

              // SHOW MESSAGE
              toast({
                description: error.response?.data.message,
                variant: 'destructive',
              });
            }
          },
        }),
        mutationCache: new MutationCache({
          onError: (error) => {
            if (axios.isAxiosError(error)) {
              if (error.response?.status == 401) {
                signOut({
                  callbackUrl: '/login',
                });
              }

              // SHOW MESSAGE
              toast({
                description: error.response?.data.message,
                variant: 'destructive',
              });
            }
          },
        }),
      })
  );
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default AppTanstackProvider;
