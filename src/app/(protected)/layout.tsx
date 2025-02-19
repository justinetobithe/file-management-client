import AppSidebar from '@/components/AppSidebar';
import AppHeader from '@/components/AppHeader';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <nav className='fixed left-0 right-0 top-0 z-[40] '>
        <AppHeader />
      </nav>
      <div className='flex min-h-screen'>
        <AppSidebar />
        <main className='mt-16 flex-1 overflow-x-hidden bg-[#FBFBFB] py-10 px-5 sm:p-10'>
          {children}
        </main>
      </div>
    </>
  );
}
