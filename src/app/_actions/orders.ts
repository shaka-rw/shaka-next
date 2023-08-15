'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import prisma from '@/prima';
import { FlutterWaveTypes } from 'flutterwave-react-v3';
import { createFlutterWavePayment } from '../helpers/payment';

export const checkout = async () => {
  const session = await getServerSession(authOptions);
  if (!session) return ["You're not logged in!"];

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: {
      quantities: {
        include: {
          productQuantity: {
            include: { product: { include: { shop: true } } },
          },
        },
      },
    },
  });

  if (!cart || cart.quantities.length < 1)
    return ['You have no items in the cart!'];

  const qties = cart.quantities;

  // const result = await Promise.all(
  //   qties.map(async ({ productQuantityId, quantity }) => {
  //     const prodQty = await prisma.productQuantity.findFirst({
  //       where: {
  //         AND: {
  //           id: productQuantityId,
  //           quantity: { lt: quantity },
  //         },
  //       },
  //       include: { product: true, size: true },
  //     });
  //     return prodQty;
  //   })
  // );

  // const notAvailable = result.filter((q) => q !== null);
  // if (notAvailable.length) {
  //   const errorMsg = [
  //     notAvailable
  //       .map((q) => {
  //         return `Product: ${q?.product.name}, size:(${q?.size}) has only ${q?.quantity} left.`;
  //       })
  //       .toString(),
  //   ];
  //   return errorMsg;
  // }

  const order = await prisma.order.create({
    data: {
      shops: {
        connect: qties.map(({ productQuantity }) => ({
          id: productQuantity.product.shop.id,
        })),
      },
      userId: session.user.id,
      quantities: {
        create: qties.map(
          ({ productQuantityId, productQuantity, quantity, price }) => ({
            productQuantityId,
            quantity,
            price: price ?? productQuantity.price,
          })
        ),
      },
    },
    include: { quantities: true },
  });

  // Reduce stock
  const updateStock = order.quantities.map(async (qty) => {
    await prisma.productQuantity.update({
      data: { quantity: { decrement: qty.quantity } },
      where: { id: qty.productQuantityId },
    });
  });
  await Promise.all(updateStock);

  return [null, order];
};

// tx_ref=ref&transaction_id=30490&status=successful

export async function createPayment(phoneNumber?: string) {
  const session = await getServerSession(authOptions);

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      cart: { include: { quantities: { include: { productQuantity: true } } } },
    },
  });

  const amountToPay = user?.cart?.quantities.reduce(
    (a, c) => a + c.quantity * (c.price ?? c.productQuantity.price),
    0
  ) as number;

  console.log({
    amountToPay,
    cart: user?.cart?.quantities.map((q) => q),
    userId: user?.id,
  });

  if (amountToPay < 1) return [`Payment amount is not valid`];

  const payment = await prisma.payment.create({
    data: {
      amount: amountToPay,
      email: user?.email as string,
      phoneNumber,
      name: user?.name,
    },
  });

  const waveConfig: FlutterWaveTypes.FlutterwaveConfig = {
    // public_key: process.env.FLW_PUBLIC_KEY as string,
    tx_ref: payment.id,
    amount: payment.amount,
    currency: payment.currency,
    payment_options: 'card, ussd, mobilemoneyrwanda',
    redirect_url: `${process.env.NEXTAUTH_URL}/payments/verify`,
    meta: {
      consumer_name: payment.name,
      consumer_email: payment.email,
    },
    customer: {
      email: payment.email,
      name: payment.name ?? '',
      phone_number: payment.phoneNumber ?? '',
    },

    customizations: {
      title: 'Shaka E-commerce',
      description: 'Purchase on Shaka E-commerce',
      logo: 'https://www.shaka.rw/logo_.png',
    },
  } as any;

  const payLink = await createFlutterWavePayment(waveConfig);
  if (!payLink) {
    return ['Initiating payment failed! Try again.'];
  }

  return [null, payLink];
}
