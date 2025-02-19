import Link from 'next/link';
import React, { FC } from 'react';

const page: FC = async () => {
  return (
    <main className='flex h-screen w-screen items-center justify-center bg-white text-center'>
      <div>
        <h2 className='text-3xl font-bold'>Access Denied</h2>
        <p>
          You are logged in, but you do not have the required access to view
          this page.
        </p>
        <p>
          Go back to the{' '}
          <Link href={`/home`} className='font-bold text-primary underline'>
            Dashboard
          </Link>
        </p>
      </div>
    </main>
  );
};

export default page;
