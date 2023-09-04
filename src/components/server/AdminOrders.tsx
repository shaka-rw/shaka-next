import prisma from '@/prisma';
import React from 'react';
import SingleOrderCard from './SingleOrder';

const AdminOrders = async () => {
  const orders = await prisma.order.findMany({
    take: 50,
    orderBy: { updatedAt: 'desc' },
    include: {
      payments: { where: { status: 'successful' } },
      shops: true,
      customer: true,
      _count: { select: { quantities: true } },
      quantities: {
        include: {
          productQuantity: {
            include: {
              product: true,
              color: { include: { mainImage: true } },
              size: true,
            },
          },
        },
      },
    },
  });

  return (
    <div className="flex gap-2 flex-col p-2 my-3 max-w-4xl w-full mx-auto ">
      <h3 className="text-2xl mb-3 font-bold uppercase">All Orders</h3>
      <div className="container my-4 mx-auto">
        {orders.length === 0 && (
          <div className="alert alert-warning">No orders yet!</div>
        )}
        <div className="flex gap-2 flex-wrap">
          {orders.map((order) => (
            <SingleOrderCard order={order} key={order.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
