'use client';
import React from 'react';
import AppRoutes from './AppRoutes';
import User from '@/types/User'; 
import Link from 'next/link';
import { Button } from './ui/button';
import { useSession } from 'next-auth/react';
import useStore from '@/store/useStore';

const AppSidebar = () => {
  const session = useSession();
  const { isSidebarOpen } = useStore((state) => state.app);

  return (
    <aside
      className={`${isSidebarOpen ? 'fixed translate-x-0 !h-full' : 'w-0 -translate-x-full'
        } top-[4.4rem] z-50 h-[calc(100vh-theme(spacing.20))] overflow-y-auto bg-white transition-transform sm:sticky w-[250px]`}
    >
      <nav className='relative z-50 border-t-[1px] border-[#E5E7EB] bg-white px-5 pb-5 pt-5'>
        {session?.data?.user && (
          <AppRoutes user={session?.data?.user as unknown as Omit<User, 'dob'>} />
        )} 
        {/* {session?.data?.user.role == 'ob_gyne' ? (
          <AppDoctorToggleAccount />
        ) : null} */}

      </nav>
    </aside>
  );
};

export default AppSidebar;
