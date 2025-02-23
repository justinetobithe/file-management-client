"use client"
import React, { useState } from 'react';
import AppDesignationTable from '@/components/AppDesingationTable';
import { Button } from '@/components/ui/button';
import { Plus } from "lucide-react";
import AppDesignationForm from '@/components/AppDesignationForm';
import { useQueryClient } from '@tanstack/react-query';


const Page = () => {
  const queryClient = useQueryClient();
  const [isAddDesignationDialogOpen, setIsAddDesignationDialogOpen] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-[2rem] font-bold">Designations</h1>
        <Button className="px-6 py-3.5 text-base font-medium text-white" onClick={() => { setIsAddDesignationDialogOpen(true) }}>
          <Plus className="mr-2" />Add Designation
        </Button>
      </div>
      <AppDesignationTable />
      {
        isAddDesignationDialogOpen && (
          <AppDesignationForm
            onClose={() => setIsAddDesignationDialogOpen(false)}
            isOpen={isAddDesignationDialogOpen}
            queryClient={queryClient}
          />
        )
      }
    </>
  );
};

export default Page;
