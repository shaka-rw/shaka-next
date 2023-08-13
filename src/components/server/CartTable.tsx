/* eslint-disable @next/next/no-img-element */
import { removeItemFromCart } from '@/app/_actions';
import { Cart, QuantitiesOnCart } from '@prisma/client';
import React from 'react';
import { MdHourglassEmpty } from 'react-icons/md';

const CartTable = ({ cart }: { cart: Cart }) => {
  return (
    <>
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
              {((cart as any)?.quantities ?? []).map((qty: any, i: number) => (
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
        Total:{' '}
        {((cart as any)?.quantities ?? []).reduce(
          (a: any, c: any) =>
            a + c.quantity * (c.price ?? c.productQuantity.price),
          0
        )}{' '}
        RWF
      </div>
    </>
  );
};

export default CartTable;
