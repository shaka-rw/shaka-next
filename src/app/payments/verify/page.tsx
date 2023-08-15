import React from 'react';
import Flutterwave from 'flutterwave-node-v3';

import prisma from '@/prima';
import { Order, PayStatus } from '@prisma/client';
import { checkout } from '@/app/_actions/orders';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Navbar from '@/components/server/Navbar';
import Link from 'next/link';
import { MdCheckCircleOutline, MdError, MdHome } from 'react-icons/md';

const PaymentVerifyPage = async ({
  searchParams,
}: {
  searchParams: {
    tx_ref: string;
    transaction_id: string;
    status: 'cancelled' | 'successful' | 'failed';
  };
}) => {
  const session = await getServerSession(authOptions);

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      cart: true,
    },
  });

  async function handleVerifyPayment(): Promise<
    { error: string; message?: string } | { error?: string; message: string }
  > {
    const { tx_ref: payId, transaction_id: transId, status } = searchParams;

    const payment = await prisma.payment.findUnique({
      where: { id: payId ?? '' },
    });

    if (!payment) return { error: 'Payment not found' };

    try {
      const flw = new Flutterwave(
        process.env.FLW_PUBLIC_KEY,
        process.env.FLW_SECRET_KEY
      );

      const response = await flw.Transaction.verify({ id: transId });
      if (response.data.status === 'successful') {
        if (
          response.data.amount === payment.amount &&
          response.data.currency === payment.currency
        ) {
          await prisma.payment.update({
            where: { id: payment.id },
            data: {
              status: PayStatus.successful,
              phoneNumber:
                response.data.customer.phone_number ?? payment.phoneNumber,
              transaction_id: transId,
            },
          });

          const result = await checkout();
          if (result[0]) return { error: result[0] as string };

          const order = result[1] as Order;
          await prisma.payment.update({
            where: { id: payment.id },
            data: { orderId: order.id },
          });
          const updatedOrder = await prisma.order.findUnique({
            where: { id: order.id },
            include: {
              payments: true,
              quantities: { include: { productQuantity: true } },
            },
          });

          const amountToPay =
            updatedOrder?.quantities.reduce(
              (a, c) => a + (c.price ?? c.productQuantity.price) * c.quantity,
              0
            ) ?? 0;
          const amountPaid =
            updatedOrder?.payments.reduce((a, c) => a + c.amount, 0) ?? 0;

          if (amountToPay === amountPaid) {
            await prisma.order.update({
              where: { id: updatedOrder?.id },
              data: { isPaid: true },
            });
          }

          // Clear cart
          await prisma.quantitiesOnCart.deleteMany({
            where: { cartId: user?.cart?.id },
          });

          if (updatedOrder) {
            return { message: 'Payment successfull' };
          }
        } else {
          return { error: "Payment amount and/or currency doesn't match" };
        }
      }
      return { error: `Payment failed (${response.status})` };
    } catch (error) {
      console.log(error);
      return { error: `Payment verification failed!` };
    }
  }

  const result = await handleVerifyPayment();
  const error = result;

  return (
    <main className="grid min-h-screen grid-rows-[auto,1fr] grid-cols-[1fr]">
      <Navbar />
      <div className="">
        <div className="flex flex-col">
          <div className="card mx-auto max-w-lg w-full  shadow border p-3 md:p-4 my-4">
            <h3 className="card-title">Payment</h3>
            <div className="card-body">
              <div
                className={`flex items-center flex-col p-3 ${
                  result.error ? ' text-error' : 'text-success'
                } text-xl`}
              >
                <span className="text-3xl">
                  {result.error ? <MdError /> : <MdCheckCircleOutline />}
                </span>
                <span>{result.error ?? result.message}</span>
              </div>
            </div>
            <div className="card-actions justify-end">
              <Link href={'/'} className="btn btn-primary  ">
                <MdHome /> Go home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PaymentVerifyPage;
