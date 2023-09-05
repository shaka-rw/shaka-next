import { NextRequest, NextResponse } from 'next/server';
// import Flutterwave from 'flutterwave-node-v3';
import prisma from '@/prisma';
import { Order, PayStatus } from '@prisma/client';
import { checkout } from '@/app/_actions/orders';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export const GET = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      cart: true,
    },
  });

  const { searchParams } = new URL(req.url);
  // tx_ref=ref&transaction_id=30490&status=successful
  const payId = searchParams.get('tx_ref');
  const transId = searchParams.get('transaction_id');
  const status = searchParams.get('status');

  const payment = await prisma.payment.findUnique({
    where: { id: payId ?? '' },
  });

  if (!payment)
    return NextResponse.json({ error: 'Payment not found' }, { status: 400 });

  // const flw = new Flutterwave(
  //   process.env.FLW_PUBLIC_KEY,
  //   process.env.FLW_SECRET_KEY
  // );
  // flw.Transaction.verify({ id: transId })
  //   .then(async (response: any) => {
  //     if (response.data.status === 'successful') {
  if (status === 'successful') {
    if (
      true
      // response.data.amount === payment.amount &&
      // response.data.currency === payment.currency
    ) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: PayStatus.successful,
          // phoneNumber:
          //   response.data.customer.phone_number ?? payment.phoneNumber,
          transaction_id: transId,
        },
      });

      const result = await checkout();
      if (result[0])
        return NextResponse.json({ message: result[0] }, { status: 400 });

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
        return NextResponse.json(
          { message: 'Payment successfull' },
          { status: 200 }
        );
      }
    } else {
      return NextResponse.json(
        { message: "Payment amount and/or currency doesn't match" },
        { status: 400 }
      );
    }
  } else {
    return NextResponse.json({ message: 'Payment failed' }, { status: 400 });
  }
  // })
  // .catch((err: unknown) => {
  //   console.log(err);
  //   return NextResponse.json(
  //     { message: 'Payment not verified, unknown error occured' },
  //     { status: 500 }
  //   );
  // });
};
