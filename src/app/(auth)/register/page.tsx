import React from 'react';
import Image from 'next/image';
// import Logo from '@public/img/logo.svg';
import Logo from '@public/img/logo.png';
import { getServerSession } from 'next-auth';
import AuthOptions from '@/lib/AuthOptions';
import { redirect } from 'next/navigation';
import RegisterForm from './components/RegisterForm';
import { GoogleOAuthProvider } from '@react-oauth/google';

const page = async () => {
  const session = await getServerSession(AuthOptions);

  if (session) {
    redirect('/home');
  }

  return (
    <div className='mx-auto max-w-[24.06rem] pb-10'>
      <Image src={Logo} width={384} height={384} alt='Logo' />
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
        <RegisterForm />
      </GoogleOAuthProvider>
    </div>
  );
};

export default page;
