import './globals.css';
import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import AppSessionProvider from '@/components/AppSessionProvider';
import AppTanstackProvider from '@/components/AppTanstackProvider';
import poppins from './assets/fonts/poppins';

export const metadata: Metadata = {
  title: 'File Management System',
  description: '',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <html lang='en' suppressHydrationWarning className='h-full'>
        <head />
        <body className={`${poppins.variable} min-h-full font-sans`}>
          <AppSessionProvider>
            <AppTanstackProvider>{children}</AppTanstackProvider>
          </AppSessionProvider>
          <Toaster />
        </body>
      </html>
    </>
  );
}
