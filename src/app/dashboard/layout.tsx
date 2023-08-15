import Navbar from '@/components/server/Navbar';
import React from 'react';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="grid min-h-screen grid-rows-[auto,1fr] grid-cols-[1fr]">
      {/* <AppBar /> */}
      <Navbar />
      <div>{children}</div>
      {/* <Sidebar />  */}
    </main>
  );
};

export default DashboardLayout;
