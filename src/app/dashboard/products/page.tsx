import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import React from 'react';
import AdminProducts from './AdminProducts';

const DashboardProductsPage = async ({
  searchParams,
}: {
  searchParams: { q?: string };
}) => {
  const session = await getServerSession(authOptions);

  return session?.user?.role === 'ADMIN' ? (
    <AdminProducts searchParams={searchParams} />
  ) : (
    <div className="alert alert-error my-2"> Not Authorized</div>
  );
};

export default DashboardProductsPage;
