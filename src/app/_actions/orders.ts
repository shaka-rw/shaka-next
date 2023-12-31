'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import prisma from '@/prisma';
import { FlutterWaveTypes } from 'flutterwave-react-v3';
import {
  PayMethod,
  createFlutterWavePayment,
  createUbudasaPayment,
} from '../helpers/payment';
import { cookies } from 'next/headers';
import { SafeSession } from '@/components/server/CartModal';
import { revalidatePath } from 'next/cache';
import { getPath } from '.';
import { checkoutSchema } from '@/components/forms/CheckoutForm';
import { z } from 'zod';
import { WaveLinkResponse } from '@/types';

export const checkout = async () => {
  const session = await getServerSession(authOptions);
  let user = null;
  let cartId: string | undefined;

  if (session) {
    user = await prisma.user.findUnique({
      where: { id: session.user?.id },
      include: { cart: true },
    });
    cartId = user?.cart?.id;
  } else {
    cartId = cookies().get('cartId')?.value;
  }

  const cart = await prisma.cart.findUnique({
    where: { id: cartId },
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

  const order = await prisma.order.create({
    data: {
      shops: {
        connect: qties.map(({ productQuantity }) => ({
          id: productQuantity.product.shop.id,
        })),
      },
      userId: session?.user?.id as string | undefined,
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

export async function createPayment(formData: FormData) {
  const session = await getServerSession(authOptions);

  let user = null;
  let cartId: string | undefined;
  let userData: z.infer<typeof checkoutSchema> | null = null;

  if (session) {
    user = await prisma.user.findUnique({
      where: { id: session.user?.id },
      include: { cart: true },
    });
    cartId = user?.cart?.id;
  } else {
    cartId = cookies().get('cartId')?.value;
  }

  userData = JSON.parse(
    (formData?.get('userData') as string) ?? '{}'
  ) as z.infer<typeof checkoutSchema>;

  if (!userData) return ['No user data submitted!'];

  const cart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: { quantities: { include: { productQuantity: true } } },
  });

  // Cart amount + delivery fee(2000)
  const amountToPay =
    (cart?.quantities.reduce(
      (a, c) => a + c.quantity * (c.price ?? c.productQuantity.price),
      0
    ) as number) + 2000;

  if (amountToPay < 1) return [`Payment amount is less than 1!`];

  const paymethod: PayMethod | undefined = userData?.payOption ?? 'flutterwave';
  const payment = await prisma.payment
    .create({
      data: {
        amount: amountToPay,
        paymentOption: paymethod,
        email: (user?.email as string) ?? (userData?.email as string),
        phoneNumber: userData?.phoneNumber as string,
        name: user?.name ?? (userData?.name as string),
      },
    })
    .catch((err) => {
      console.log(err);
      return null;
    });

  if (!payment) return ['Initiating payment failed! Try again.'];

  if (paymethod === 'ubudasa') {
    try {
      const result = await createUbudasaPayment({
        amount: payment.amount,
        callback: `${process.env.NEXTAUTH_URL}/api/payments/ubudasa`,
        clientOrderId: payment.id,
        success_url: `${process.env.NEXTAUTH_URL}/api/payments/ubudasa`,
      });

      if (!result) {
        return ['Initiating UBUDASA payment failed! Try again.'];
      }
      return [
        null,
        {
          status: '',
          message: '',
          data: { link: result },
        } as WaveLinkResponse,
      ];
    } catch (error) {
      console.log({ ubudasaError: error });
      return [
        'Unexpected error. Initiating UBUDASA payment failed! Try again.',
      ];
    }
  }

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
      logo: 'https://shaka.rw/logo_.png',
    },
  } as any;

  const payLink = await createFlutterWavePayment(waveConfig);
  if (!payLink) {
    return ['Initiating payment failed! Try again.'];
  }

  return [null, payLink];
}

export async function deleteCartCookie() {
  cookies().delete('cartId');
  revalidatePath(await getPath());
  return [];
}

export async function createCartCookie() {
  let cartId: string | undefined = cookies().get('cartId')?.value;
  if (cartId) {
    const existingCart = await prisma.cart.findUnique({
      where: { id: cartId },
    });
    if (existingCart) return [, cartId];
  }
  let newCart = await prisma.cart.create({ data: {} });
  cookies().set('cartId', newCart.id, {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
  });

  revalidatePath(await getPath());
  return [, newCart.id];
}

export async function getCartId() {
  const session = (await getServerSession(authOptions)) as SafeSession;

  let cartId: string | undefined = cookies().get('cartId')?.value;

  if (!session?.user && !cartId) {
    return ['No cart found!'];
  } else if (session?.user) {
    const userCart = await prisma.cart.upsert({
      where: { userId: session?.user?.id },
      create: { userId: session?.user?.id },
      update: {},
    });

    return [, userCart.id];
  }
  return [, cartId];
}

export async function startDelivery(formData: FormData) {
  const orderId = formData.get('orderId') as string;

  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status: 'DELIVERY' },
  });

  revalidatePath(await getPath());
  return [null];
}

export async function completeDelivery(formData: FormData) {
  const orderId = formData.get('orderId') as string;

  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status: 'COMPLETED' },
  });

  revalidatePath(await getPath());
  return [null];
}
