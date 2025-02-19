import AuthOptions from '@/lib/AuthOptions';
import { getServerSession } from 'next-auth';
import React, { FC } from 'react';

const Layout: FC<{
  admin: React.ReactNode;
}> = async ({ admin }) => {
  const session = await getServerSession(AuthOptions);

  const renderContent = () => {
    switch (session?.user.role) {
      case 'admin':
        return admin;
      default:
        return null;
    }
  };

  return <>{renderContent()}</>;
};

export default Layout;
