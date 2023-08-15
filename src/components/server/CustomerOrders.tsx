import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/prima';
import { Order, User } from '@prisma/client';
import { getServerSession } from 'next-auth';
import React from 'react';

const CustomerOrders = async () => {
  const session = await getServerSession(authOptions);

  const orders = await prisma.order.findMany({
    take: 50,
    orderBy: { updatedAt: 'desc' },
    where: { userId: session?.user?.id ?? '12' },
    include: {
      customer: true,
      _count: { select: { quantities: true } },
      quantities: true,
    },
  });
  return (
    <div className="flex gap-2 flex-col p-2 my-3 max-w-4xl w-full mx-auto ">
      <h3 className="text-2xl mb-3 font-bold uppercase">My Orders</h3>
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

export const OrderCard = ({
  customer,
  itemsCount,
  price,
  order,
}: {
  customer: User;
  itemsCount: number;
  price: number;
  order: Order;
}) => {
  return (
    <div className="bg-base-200 card w-full shadow-md rounded-lg p-4">
      <div className="flex justify-between mb-2">
        <h2 className="font-semibold">
          <span className="text-lg">Customer: {customer.name}</span>
        </h2>
        <span
          className={`px-2 py-1 text-sm rounded ${
            order.status === 'CANCELED'
              ? 'text-error'
              : order.status === 'COMPLETED'
              ? 'text-success'
              : order.status === 'REFUND'
              ? 'text-warning'
              : 'text-info'
          }`}
        >
          {order.status}
        </span>
      </div>
      <p className="text-gray-600">
        <span className="text-sm font-mono inline-flex font-light italic">
          {order.createdAt.toLocaleString('en-rw')}
        </span>
      </p>
      <div className="flex justify-between mt-4">
        <div className="text-lg font-bold">
          {itemsCount} item(s) | {price} RWF
        </div>
        <div>
          <p className="text-gray-500">Paid:</p>
          <p className={order.isPaid ? 'text-success' : 'text-error'}>
            {order.isPaid ? 'Yes' : 'No'}
          </p>
        </div>
      </div>
      {/* Add more important info here */}
    </div>
  );
};

export default CustomerOrders;
