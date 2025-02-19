'use client';
import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Menu } from 'lucide-react';
import useStore from '@/store/useStore';

const AppNavBurger = () => {
  const { isSidebarOpen, toggleIsSidebarOpen } = useStore((state) => state.app);
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  React.useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined')
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (dimensions.width > 500) {
      toggleIsSidebarOpen(true);
    }
  }, [toggleIsSidebarOpen, dimensions]);

  return (
    <Button
      data-drawer-target='default-sidebar'
      data-drawer-toggle='default-sidebar'
      aria-controls='default-sidebar'
      className='mr-3 px-2 sm:hidden'
      onClick={() => toggleIsSidebarOpen(!isSidebarOpen)}
    >
      <Menu />
    </Button>
  );
};

export default AppNavBurger;
