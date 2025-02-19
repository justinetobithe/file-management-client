"use client";
import React, { useState } from 'react';
import AppFolderForm from '@/components/AppFolderForm';
import { Button } from '@/components/ui/button';
import { Plus } from "lucide-react";
import { useQueryClient } from '@tanstack/react-query';
import AppFoldersTable from '@/components/AppFoldersTable';

const Page = () => {
    const queryClient = useQueryClient();
    const [isAddFolderDialogOpen, setIsAddFolderDialogOpen] = useState(false);

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-[2rem] font-bold">Folders</h1>
                <Button className="ml-auto" onClick={() => { setIsAddFolderDialogOpen(true) }}>
                    <Plus className="mr-2" />Add Folder
                </Button>
            </div>
            <AppFoldersTable />
            {
                isAddFolderDialogOpen && (
                    <AppFolderForm
                        onClose={() => setIsAddFolderDialogOpen(false)}
                        isOpen={isAddFolderDialogOpen}
                        queryClient={queryClient}
                    />
                )
            }
        </>
    );
};

export default Page;
