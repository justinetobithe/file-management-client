"use client"
import React, { useState } from 'react';
import AppVehiclesTable from '@/components/AppFoldersTable';
import { Button } from '@/components/ui/button';
import { Plus } from "lucide-react";
import AppVehicleForm from '@/components/AppDepartmentForm';
import { useQueryClient } from '@tanstack/react-query';



const Page = () => {
    const queryClient = useQueryClient();
    const [isAddVehicleDialogOpen, setIsAddVehicleDialogOpen] = useState(false);

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-[2rem] font-bold">Vehicle</h1>
                <Button className="ml-auto" onClick={() => { setIsAddVehicleDialogOpen(true) }}>
                    <Plus className="mr-2" />Add Vehicle
                </Button>
            </div>
            <AppVehiclesTable />
            {
                isAddVehicleDialogOpen && (
                    <AppVehicleForm
                        onClose={() => setIsAddVehicleDialogOpen(false)}
                        isOpen={isAddVehicleDialogOpen}
                        queryClient={queryClient}
                    />
                )
            }
        </>
    );
};

export default Page;
