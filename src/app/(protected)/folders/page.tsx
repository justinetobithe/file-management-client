"use client";
import React, { useState, useEffect } from 'react';
import AppFolderForm from '@/components/AppFolderForm';
import { Button } from '@/components/ui/button';
import { Plus } from "lucide-react";
import { useQueryClient } from '@tanstack/react-query';
import AppFoldersTable from '@/components/AppFoldersTable';
import AppGenerateReportForm from '@/components/AppGenerateReportForm';
import User from '@/types/User';
import { api } from '@/lib/api';
import AppFolderOnlyForm from '@/components/AppFolderOnlyForm';

const Page = () => {
    const queryClient = useQueryClient();
    const [isAddFolderDialogOpen, setIsAddFolderDialogOpen] = useState(false);
    const [isGenerateReportDialogOpen, setIsGenerateReportDialogOpen] = useState(false);
    const [selectedFolders, setSelectedFolders] = useState<number[]>([]);

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

    console.log("user ", user)

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                {user?.role === "user" ? (
                    <>
                        <div className="flex flex-col items-start">
                            <h1 className="text-[1rem] font-bold">{user.position?.department?.name}</h1>
                            <h2 className="text-[1rem] font-bold">{user.first_name} {user.last_name}</h2>
                            <h3 className="text-[1rem] font-bold">{user.position?.designation?.designation}</h3>
                        </div>
                    </>
                ) : (
                    <h1 className="text-[2rem] font-bold">Folders</h1>
                )}

                <div className="flex gap-2">
                    <Button onClick={() => setIsAddFolderDialogOpen(true)}>
                        <Plus className="mr-2" /> Add Folder
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
                // <AppFolderForm
                <AppFolderOnlyForm
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


