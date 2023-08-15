import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import AdminOrders from '@/components/server/AdminOrders';
import SellerOrders from '@/components/server/SellerOrders';
import { getServerSession } from 'next-auth';
import { notFound, redirect } from 'next/navigation';
import React from 'react';

const OrderPage = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) return notFound();

  if (user.role === 'CUSTOMER') return redirect('/dashboard/orders/customer');
  if (user.role === 'ADMIN') return <AdminOrders />;
  if (user.role === 'SELLER') return <SellerOrders />;
};

export default OrderPage;
