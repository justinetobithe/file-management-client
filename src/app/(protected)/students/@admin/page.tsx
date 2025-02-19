"use client"
import React, { useState } from 'react';
import AppStudentsTable from '@/components/AppFoldersTable';
import { Button } from '@/components/ui/button';
import { Plus } from "lucide-react";
import AppStrandForm from '@/components/AppStrandForm';
import { useQueryClient } from '@tanstack/react-query';


const Page = () => {
  const queryClient = useQueryClient();

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-[2rem] font-bold">Stduents</h1>
      </div>
      <AppStudentsTable />

    </>
  );
};

export default Page;
