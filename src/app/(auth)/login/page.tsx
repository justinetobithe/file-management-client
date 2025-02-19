import React, { FC } from 'react';
import Image from 'next/image';
// import Logo from '@public/img/logo.svg';
import Logo from '@public/img/logo.png';
import { getServerSession } from 'next-auth';
import AuthOptions from '@/lib/AuthOptions';
import { redirect } from 'next/navigation';
import LoginForm from './components/LoginForm';

const page: FC = async () => {
  const session = await getServerSession(AuthOptions);

  if (session) {
    redirect('/home');
  }

  return (
    <div className='mx-auto max-w-[24.06rem] h-full flex flex-col justify-center pt-[150px]'>
      <Image src={Logo} width={384} height={384} alt='Logo' />
      <LoginForm />
    </div>
  );
};

export default page;
