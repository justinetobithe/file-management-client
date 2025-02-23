"use client";
import React, { useState } from 'react';
import AppFolderForm from '@/components/AppFolderForm';
import { Button } from '@/components/ui/button';
import { Plus } from "lucide-react";
import { useQueryClient } from '@tanstack/react-query';
import AppFoldersTable from '@/components/AppFoldersTable';
import AppGenerateReportForm from '@/components/AppGenerateReportForm';

const Page = () => {
    const queryClient = useQueryClient();
    const [isAddFolderDialogOpen, setIsAddFolderDialogOpen] = useState(false);
    const [isGenerateReportDialogOpen, setIsGenerateReportDialogOpen] = useState(false);
    const [selectedFolders, setSelectedFolders] = useState<number[]>([]);

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-[2rem] font-bold">Files</h1>
                <div className="flex gap-2">
                    <Button onClick={() => setIsAddFolderDialogOpen(true)}>
                        <Plus className="mr-2" /> Add Files
                    </Button>
                    {selectedFolders.length > 0 && (
                        <Button variant="outline" onClick={() => setIsGenerateReportDialogOpen(true)}>
                            Generate Report
                        </Button>
                    )}
                </div>
            </div>

            <AppFoldersTable
                selectedFolders={selectedFolders}
                setSelectedFolders={setSelectedFolders}
            />

            {isAddFolderDialogOpen && (
                <AppFolderForm
                    onClose={() => setIsAddFolderDialogOpen(false)}
                    isOpen={isAddFolderDialogOpen}
                    queryClient={queryClient}
                />
            )}

            {isGenerateReportDialogOpen && (
                <AppGenerateReportForm
                    onClose={() => setIsGenerateReportDialogOpen(false)}
                    isOpen={isGenerateReportDialogOpen}
                    queryClient={queryClient}
                    selectedFolders={selectedFolders}
                />
            )}
        </>
    );
};

export default Page;
