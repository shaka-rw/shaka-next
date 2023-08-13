'use client';
import { createPayment } from '@/app/_actions/orders';
import { Cart, Payment } from '@prisma/client';
import Script from 'next/script';
import React, { useState, useTransition } from 'react';
import { MdShoppingCartCheckout } from 'react-icons/md';
import CartTable from '../server/CartTable';
import { toast } from 'react-hot-toast';

import { WaveLinkResponse } from '@/types';

const CheckoutClient = ({ cart }: { cart: Cart }) => {
  const cartTotal = ((cart as any)?.quantities ?? []).reduce(
    (a: number, c: any) =>
      a + c.quantity * (c.price ?? c.productQuantity.price),
    0
  ) as number;

  const [isPending, startTransition] = useTransition();
  const [payLink, setPayLink] = useState<string>();

  const startPayProcess = () => {
    startTransition(async () => {
      const result = await createPayment();
      if (result[0]) {
        toast.error(result[0] as string);
        return;
      }
      const response = result[1] as WaveLinkResponse | null;
      if (!response || !response?.data) {
        toast.error('Something went wrong, try again!');
        return;
      }

      setPayLink(response.data.link);
    });
  };

  return (
    <div>
      <div className="card shadow border p-3 md:p-4 my-4">
        <h3 className="card-title">Checkout</h3>
        <div className="card-body">
          <CartTable cart={cart} />
        </div>
        <div className="card-actions">
          {!payLink ? (
            <button
              onClick={startPayProcess}
              disabled={isPending}
              className="btn btn-primary"
            >
              <MdShoppingCartCheckout /> Checkout{' '}
              <span className="font-mono font-bold ">({cartTotal}RWF)</span>
              {isPending && (
                <span className="loading loading-spinner loading-sm" />
              )}
            </button>
          ) : (
            <a
              href={payLink}
              className="btn  btn-link btn-block animate-pulse btn-primary"
              target="_blank"
            >
              Pay <span className="font-mono font-bold ">({cartTotal}RWF)</span>{' '}
              now &rarr;
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutClient;
