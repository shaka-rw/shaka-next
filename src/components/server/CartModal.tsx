/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { Modal } from '../Modal';
import {
  MdEmojiObjects,
  MdHourglassEmpty,
  MdShoppingCart,
  MdShoppingCartCheckout,
} from 'react-icons/md';
import { User } from '@prisma/client';
import prisma from '@/prima';
import { revalidatePath } from 'next/cache';
import { getPath } from '@/app/_actions';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { twMerge } from 'tailwind-merge';

async function removeCart(formData: FormData) {
  'use server';
  const [cartId, prdQtyId] = (formData.get('cartQtyId') as string).split('_');
  await prisma.quantitiesOnCart.delete({
    where: {
      cartId_productQuantityId: { cartId, productQuantityId: prdQtyId },
    },
  });
  revalidatePath(await getPath());
}

const CartModal = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user) return <></>;

  const cart = await prisma.cart.findUnique({
    where: { userId: session?.user?.id },
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
  return (
    <Modal
      btnContent={''}
      modalId="cart_modal"
      lg
      btn={
        <div className="indicator">
          {(cart?._count.quantities ?? 0) > 0 && (
            <span
              className={twMerge(
                'indicator-item font-bold -translate-x-[.15rem] translate-y-[.05rem]  badge badge-primary border rounded-full',
                'h-4 px-1'
              )}
            >
              {cart?._count.quantities ?? 0}
            </span>
          )}
          <button className="btn relative btn-square bg-transparent border-0 text-lg [padding:.15rem!important]">
            <MdShoppingCart />
          </button>
        </div>
      }
    >
      <h3 className="text-2xl flex items-center gap-2 mb-3 font-bold">
        <MdShoppingCart /> <span>Cart</span>
      </h3>
      {!cart && (
        <div className="alert  flex gap-2">
          <MdHourglassEmpty /> Empty cart.
        </div>
      )}
      {cart && (
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
                    <form action={removeCart}>
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
        Total:{' '}
        {(cart?.quantities ?? []).reduce(
          (a, c) => a + c.quantity * (c.price ?? c.productQuantity.price),
          0
        )}{' '}
        RWF
      </div>
      {cart && (
        <div className="my-3">
          <button className="btn btn-primary">
            <MdShoppingCartCheckout /> Checkout
          </button>
        </div>
      )}
    </Modal>
  );
};

export default CartModal;
