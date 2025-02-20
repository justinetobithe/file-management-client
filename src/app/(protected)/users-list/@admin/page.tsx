"use client"
import React, { useState } from 'react';
import AppUsersTable from '@/components/AppUsersTable';
import { Button } from '@/components/ui/button';
import { Plus } from "lucide-react";
import AppUserForm from '@/components/AppUserForm';
import { useQueryClient } from '@tanstack/react-query';


const Page = () => {
  const queryClient = useQueryClient();
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-[2rem] font-bold">User List</h1>
        <Button className="px-6 py-3.5 text-base font-medium text-white" onClick={() => { setIsAddUserDialogOpen(true) }}>
          <Plus className="mr-2" />Add User
        </Button>
      </div>
      <AppUsersTable />
      {
        isAddUserDialogOpen && (
          <AppUserForm
            onClose={() => setIsAddUserDialogOpen(false)}
            isOpen={isAddUserDialogOpen}
            queryClient={queryClient}
          />
        )
      }
    </>
  );
};

export default Page;
