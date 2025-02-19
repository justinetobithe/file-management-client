"use client";
import React, { useEffect, useState } from 'react';
import User from '@/types/User';
import { api } from '@/lib/api';
import ProfileForm from './components/ProfileForm';

const Page = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get<{ data: User }>('/api/me');
        setUser(data.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      <h1 className='text-[2rem] font-bold'>Edit Profile</h1>
      {user ? <ProfileForm user={user as User} /> : ""}
    </>
  );
};

export default Page;
