import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const Loading = () => {
  return (
    <div>
      <Skeleton className='mb-10 h-12 w-96' />
      <div className='mb-10 flex items-center space-x-5'>
        <Skeleton className='h-[120px] w-[120px] rounded-full' />
        <div className='space-y-2'>
          <Skeleton className='h-[40px] w-[250px]' />
          <Skeleton className='h-12 w-[200px]' />
        </div>
      </div>
      <div className='mb-10 grid grid-cols-2 gap-x-10 gap-y-5'>
        <Skeleton className='h-16 w-full' />
        <Skeleton className='h-16 w-full' />
        <Skeleton className='h-16 w-full' />
        <Skeleton className='h-16 w-full' />
        <Skeleton className='h-16 w-full' />
        <Skeleton className='h-16 w-full' />
      </div>
      <div>
        <Skeleton className='ml-auto h-10 w-[196px]' />
      </div>
    </div>
  );
};

export default Loading;
