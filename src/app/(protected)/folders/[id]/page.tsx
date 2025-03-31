"use client";

import { useParams } from 'next/navigation';
import { useEffect } from 'react';

const FolderPage = () => {
    const params = useParams();
    const folderId = params.id;

    useEffect(() => {
        console.log(`Folder ID: ${folderId}`);
    }, [folderId]);

    return (
        <div>
            <h1>Folder Details</h1>
            <p>Folder ID: {folderId}</p>
        </div>
    );
};

export default FolderPage;
