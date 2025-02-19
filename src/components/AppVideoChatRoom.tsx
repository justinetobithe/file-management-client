'use client';
import React, { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { HMSPrebuilt } from '@100mslive/roomkit-react';
import { useSession } from 'next-auth/react';

const AppVideoChatRoom: FC<{ code: string }> = ({ code }) => {
  const session = useSession();
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant='outline'
            className='w-full rounded-full border-[3px] font-bold'
          >
            JOIN
          </Button>
        </DialogTrigger>
        <DialogContent className='h-full max-w-full p-16'>
          {session.data?.user && (
            <HMSPrebuilt
              roomCode={code}
              options={{
                userName: session.data.user.name!,
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AppVideoChatRoom;
