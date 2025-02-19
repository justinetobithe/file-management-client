"use client";
import AppAuditLogsTable from '@/components/AppAuditLogsTable';
import React, { useEffect, useState } from 'react';

const Page = () => {

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-[2rem] font-bold">Audit Logs</h1>
            </div>
            <AppAuditLogsTable />
        </>
    );
};

export default Page;
