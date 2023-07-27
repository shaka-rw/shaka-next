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

  const userData = await prisma.user.findUnique({
    where: { email: user.email as string },
  });
  if (!userData) return <GuestHome />;

  if (userData.role === 'CUSTOMER') return <CustomerHome />;
  if (userData.role === 'ADMIN') return <AdminHome />;
  if (userData.role === 'SELLER') return <SellerHome user={userData} />;
};

export default HomeContent;
