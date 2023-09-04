/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { Modal } from '../Modal';
import {
  MdHourglassEmpty,
  MdShoppingCart,
  MdShoppingCartCheckout,
} from 'react-icons/md';
import { UserRole } from '@prisma/client';
import prisma from '@/prima';
import { removeItemFromCart } from '@/app/_actions';
import { twMerge } from 'tailwind-merge';
import Link from 'next/link';
import { getCartId } from '@/app/_actions/orders';
import PlantAnonymousCookie from '../client/PlantAnonymousCookie';

export type SafeSession = { user?: any; role?: UserRole } | undefined;

const CartModal = async ({ notHome = true }: { notHome?: boolean }) => {
  let [error, cartId] = await getCartId();

  const cart = !cartId
    ? null
    : await prisma.cart.findUnique({
        where: { id: cartId },
        include: {
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

  const cartTotal = (cart?.quantities ?? []).reduce(
    (a, c) => a + c.quantity * (c.price ?? c.productQuantity.price),
    0
  );

  return (
    <Modal
      btnContent={''}
      modalId="cart_modal"
      lg
      btn={
        <div className="indicator">
          {(cart?._count?.quantities ?? 0) > 0 && (
            <span
              className={twMerge(
                'indicator-item font-bold -translate-x-[.15rem] translate-y-[.05rem]  badge badge-primary border rounded-full',
                'h-4 px-1'
              )}
            >
              {cart?._count?.quantities ?? 0}
            </span>
          )}
          <button
            className={`btn btn-sm bg-transparent border-0 btn-square font-extrabold text-xl ${
              notHome ? ' text-base-content ' : ' text-base-100 '
            }`}
          >
            <MdShoppingCart />
          </button>
        </div>
      }
    >
      <PlantAnonymousCookie />
      <h3 className="text-2xl flex items-center gap-2 mb-3 font-bold">
        <MdShoppingCart /> <span>Cart</span>
      </h3>
      {cartTotal === 0 && (
        <div className="alert  flex gap-2">
          <MdHourglassEmpty /> Empty cart.
        </div>
      )}
      {cartTotal > 0 && (
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            {/* head */}
            <thead>
              <tr>
                <th></th>
                <th></th>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {(cart?.quantities ?? []).map((qty, i) => (
                <tr key={qty.cartId + qty.productQuantityId}>
                  <th>{i + 1}</th>
                  <th>
                    <div className="avatar rounded overflow-hidden w-12 h-12 justify-center items-center  ">
                      <img
                        src={qty.productQuantity.color.mainImage.secureUrl}
                        className="w-full h-full object-contain"
                        alt={'Image'}
                      />
                    </div>
                  </th>
                  <td>{qty.productQuantity.product.name}</td>
                  <td>{qty.price ?? qty.productQuantity.price}</td>
                  <td>{qty.quantity}</td>
                  <th>
                    {(qty.price ?? qty.productQuantity.price) * qty.quantity}{' '}
                    RWF
                  </th>
                  <td>
                    <form action={removeItemFromCart}>
                      <input
                        type="hidden"
                        name="cartQtyId"
                        value={`${qty.cartId}_${qty.productQuantityId}`}
                      />
                      <button type="submit" className="btn-sm btn-outline">
                        Remove
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="text-xl uppercase my-4 font-bold">
        Total: {cartTotal} RWF
      </div>
      {cartTotal > 0 && (
        <div className="my-3">
          <Link href={'/checkout'} className="btn btn-primary">
            <MdShoppingCartCheckout /> Checkout
          </Link>
        </div>
      )}
    </Modal>
  );
};

export default CartModal;
