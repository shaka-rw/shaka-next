import React from 'react';
import { OrderCard } from './CustomerOrders';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/prima';
import { getServerSession } from 'next-auth';

const SellerOrders = async () => {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id },
  });

  const orders = await prisma.order.findMany({
    take: 50,
    orderBy: { updatedAt: 'desc' },
    where: { shops: { some: { id: user?.shopId ?? '12' } } },
    include: {
      customer: true,
      _count: { select: { quantities: true } },
      quantities: true,
    },
  });

  return (
    <div className="flex gap-2 flex-col p-2 my-3 max-w-4xl w-full mx-auto ">
      <h3 className="text-2xl mb-3 font-bold uppercase">My shop Orders</h3>
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          itemsCount={order._count.quantities}
          price={order.quantities.reduce((a, c) => a + c.price * c.quantity, 0)}
          customer={order.customer}
        />
      ))}
    </div>
  );
};

export default SellerOrders;
