'use client';

import { Frown, MoveLeft } from 'lucide-react';
import Link from 'next/link';

export default function Error({ error }: { error: Error; reset: () => void }) {
  return (
    <html className='h-full'>
      <body className='flex h-full items-center justify-center'>
        <div className='space-y-5 text-center'>
          <Frown size='10rem' className='mx-auto' />
          <h2 className='text-5xl font-bold'>Something went wrong!</h2>
          <p className='font-medium'>Error: {error.message}</p>
          <Link
            href='/home'
            className='flex items-center justify-center hover:text-primary'
          >
            <MoveLeft className='mr-3' /> <span>Back to Dashboard</span>
          </Link>
        </div>
      </body>
    </html>
  );
}
