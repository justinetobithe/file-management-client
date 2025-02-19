import React from 'react';
import AppPatientsTable from '@/components/AppUsersTable';

const page = () => {
  return (
    <>
      <h1 className='text-[2rem] font-bold'>Patients List</h1>
      <AppPatientsTable />
    </>
  );
};

export default page;
