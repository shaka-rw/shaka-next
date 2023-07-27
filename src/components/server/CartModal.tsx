import React from 'react';
import { Modal } from '../Modal';
import { MdShoppingCart, MdShoppingCartCheckout } from 'react-icons/md';
import { User } from '@prisma/client';
import prisma from '@/prima';
import { revalidatePath } from 'next/cache';
import { getPath } from '@/app/_actions';

async function removeCart(formData: FormData) {
  'use server';
  await prisma.cart.delete({ where: { id: formData.get('cartId') as string } });
  revalidatePath(await getPath());
}

const CartModal = async ({ user }: { user: User }) => {
  const carts = await prisma.cart.findMany({
    where: { userId: user.id },
    include: { product: true },
  });
  return (
    <Modal
      btnContent={''}
      btn={
        <div className="indicator mt-[2px]">
          <span className="indicator-item font-smibold text-lg badge badge-secondary">
            {await prisma.cart.count({ where: { userId: user.id } })}
          </span>
          <button className="btn relative text-3xl btn-circle">
            <MdShoppingCart />
          </button>
        </div>
      }
    >
      <h3 className="text-2xl flex items-center gap-2 mb-3 font-bold">
        <MdShoppingCart /> <span>Cart</span>
      </h3>
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {carts.map((cart, i) => (
              <tr key={cart.id}>
                <th>{i + 1}</th>
                <td>{cart.product.name}</td>
                <td>{cart.product.price}</td>
                <td>{cart.quantity}</td>
                <th>{cart.product.price * cart.quantity} RWF</th>
                <td>
                  <form action={removeCart}>
                    <input type="hidden" name="cartId" value={cart.id} />
                    <button className="btn-sm btn-outline">Remove</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-xl uppercase my-2 font-bold">
        Total: {carts.reduce((a, c) => a + c.quantity * c.product.price, 0)} RWF
      </div>
      <div className="my-3">
        <button className="btn btn-primary">
          <MdShoppingCartCheckout /> Checkout
        </button>
      </div>
    </Modal>
  );
};

export default CartModal;
