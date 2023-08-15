import { getServerSession } from 'next-auth';
import React from 'react';
import GuestHome from './GuestHome';
import prisma from '@/prima';
import CustomerHome from './CustomerHome';
import AdminHome from './AdminHome';
import SellerHome from './SellerHome';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const HomeContent = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!user) return <GuestHome />;

  if (user.role === 'CUSTOMER') return <CustomerHome />;
  if (user.role === 'ADMIN') return <AdminHome />;
  if (user.role === 'SELLER') return <SellerHome />;
};

export default HomeContent;
