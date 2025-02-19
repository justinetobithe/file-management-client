"use client"
import React from 'react';
import AppVehiclesTable from '@/components/AppFoldersTable';
import { useQueryClient } from '@tanstack/react-query';


const Page = () => {

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-[2rem] font-bold">Vehicle</h1>
            </div>
            <AppVehiclesTable />
        </>
    );
};

export default Page;
