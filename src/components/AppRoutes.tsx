'use client';
import React, { FC } from 'react';
import routes from '@/utils/routes';
import Link from 'next/link';
import { LogOut } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import AppSpinner from './AppSpinner';
import User from '@/types/User';
import { useLogout } from '@/lib/AuthenticationAPI';
import { usePathname } from 'next/navigation';

const AppRoutes: FC<{ user: Omit<User, 'dob'> }> = ({ user }) => {
  const pathname = usePathname();
  const { mutate, isPending } = useLogout();

  return (
    <ul>
      {routes
        .filter(
          (item) => item.roles.includes(user.role) && item.isSidebarVisible
        )
        .map((item) => {
          const childRoutes = item.child_routes.filter((item) =>
            item.roles.includes(user.role)
          );
          return (
            <li
              className={`mb-3 ${item.route.startsWith('/profile')
                ? 'border-t-[1px] border-[#E5E7EB]'
                : ''
                }`}
              key={item.route}
            >
              <Link
                href={item.route}
                className={`flex items-center space-x-2 rounded-md p-3 hover:bg-primary color-primary hover:text-white ${pathname.startsWith(item.route) ? 'bg-primary text-white' : null
                  }`}
              >
                {item.icon}
                <span className='text-[0.93rem] font-bold hover:text-white'>{item.title}</span>
              </Link>
              {childRoutes.length ? (
                <ul className='my-3 pl-5'>
                  {childRoutes.map((r) => (
                    <li
                      className={`mb-3 ${r.route.startsWith('/profile')
                        ? 'border-t-[1px] border-[#E5E7EB]'
                        : null
                        }`}
                      key={r.route}
                    >
                      <Link
                        href={r.route}
                        className={`flex items-center space-x-2 rounded-md p-3 hover:bg-primary text-white ${pathname.startsWith(r.route) ? 'bg-primary' : null
                          }`}
                      >
                        {r.icon}
                        <span className='text-[0.93rem] font-bold text-white'>
                          {r.title}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          );
        })}
      <li>
        <AlertDialog>
          <AlertDialogTrigger
            className={`flex w-full items-center space-x-2 rounded-md p-3 hover:bg-primary hover:text-white ${pathname.startsWith('/logout') ? 'bg-primary' : null
              }`}
          >
            <LogOut className='scale-x-[-1]' />
            <span className='text-[0.93rem] font-bold'>Logout</span>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to logout?
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>No</AlertDialogCancel>
              <AlertDialogAction onClick={() => mutate()}>
                {isPending ? <AppSpinner className='mx-auto' /> : 'Yes'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </li>
    </ul>
  );
};

export default AppRoutes;
