import AuthOptions from '@/lib/AuthOptions';
import { getServerSession } from 'next-auth';
import React, { FC } from 'react';

const Layout: FC<{
    admin: React.ReactNode;
    operator: React.ReactNode;
}> = async ({ admin, operator }) => {
    const session = await getServerSession(AuthOptions);

    const renderContent = () => {
        switch (session?.user.role) {
            case 'admin':
                return admin;
            case 'operator':
                return operator;
            default:
                return null;
        }
    };

    return <>{renderContent()}</>;
};

export default Layout;
