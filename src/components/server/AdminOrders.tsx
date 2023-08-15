import prisma from '@/prima';
import React from 'react';
import { OrderCard } from './CustomerOrders';

const AdminOrders = async () => {
  const orders = await prisma.order.findMany({
    take: 50,
    orderBy: { updatedAt: 'desc' },
    include: {
      customer: true,
      _count: { select: { quantities: true } },
      quantities: true,
    },
  });

  return (
    <div className="flex gap-2 flex-col p-2 my-3 max-w-4xl w-full mx-auto ">
      <h3 className="text-2xl mb-3 font-bold uppercase">All Orders</h3>
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

export default AdminOrders;
