"use client"
import React, { useState } from 'react';
import AppDepartmentTable from '@/components/AppDepartmentTable';
import { Button } from '@/components/ui/button';
import { Plus } from "lucide-react";
import AppDepartmentForm from '@/components/AppDepartmentForm';
import { useQueryClient } from '@tanstack/react-query';


const Page = () => {
  const queryClient = useQueryClient();
  const [isAddDepartmentDialogOpen, setIsAddDepartmentDialogOpen] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-[2rem] font-bold">Departments</h1>
        <Button className="px-6 py-3.5 text-base font-medium text-white" onClick={() => { setIsAddDepartmentDialogOpen(true) }}>
          <Plus className="mr-2" />Add Department
        </Button>
      </div>
      <AppDepartmentTable />
      {
        isAddDepartmentDialogOpen && (
          <AppDepartmentForm
            onClose={() => setIsAddDepartmentDialogOpen(false)}
            isOpen={isAddDepartmentDialogOpen}
            queryClient={queryClient}
          />
        )
      }
    </>
  );
};

export default Page;
