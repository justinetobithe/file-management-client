import React, { FC } from 'react';
import Link from 'next/link';

const Page: FC = async () => {
  return (
    <main className='flex h-screen w-screen items-center justify-center bg-white text-center'>
      <div>
        <h2 className='text-3xl font-bold'>Unauthenticated</h2>
        <p>
          Go back to{' '}
          <Link href={`/login`} className='font-bold text-primary underline'>
            Login
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Page; 