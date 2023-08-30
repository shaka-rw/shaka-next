'use client';
import { Cart } from '@prisma/client';
import React, { useState, useTransition } from 'react';
import CartTable from '../server/CartTable';

import CheckoutForm from '../forms/CheckoutForm';

const CheckoutClient = ({ cart }: { cart: Cart }) => {
  const cartTotal = ((cart as any)?.quantities ?? []).reduce(
    (a: number, c: any) =>
      a + c.quantity * (c.price ?? c.productQuantity.price),
    0
  ) as number;

  const [payLink, setPayLink] = useState<string>();

  return (
    <div>
      <div className="card mx-auto max-w-lg w-full shadow border p-3 md:p-4 my-4">
        <h3 className="card-title">Checkout</h3>
        <div className="card-body">
          <CartTable cart={cart} />
          <div className="flex my-2 underline underline-offset-4 font-bold">
            Delivery Fee: 2000RWF
          </div>
        </div>
        <div className="card-actions">
          {!payLink ? (
            cartTotal > 0 && (
              <CheckoutForm
                onPayLink={(link) => setPayLink(link)}
                cartTotal={cartTotal}
              />
            )
          ) : (
            <a
              href={payLink}
              className="btn  btn-block animate-pulse btn-accent"
              target="_blank"
            >
              Pay{' '}
              <span className="font-mono font-bold ">
                ({cartTotal + 2000}RWF)
              </span>{' '}
              now &rarr;
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutClient;
