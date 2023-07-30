import React from 'react';
import { Modal } from '../Modal';
import { MdAdd, MdAddShoppingCart, MdInfo } from 'react-icons/md';
import { Product } from '@prisma/client';
import { addToCart } from '@/app/_actions';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { AiOutlineLogin } from 'react-icons/ai';

const AddToCartForm = async ({ product }: { product: Product }) => {
  const session = await getServerSession();
  return (
    <Modal
      btnPrimary={true}
      btnContent={
        <>
          <MdAddShoppingCart /> Add to cart
        </>
      }
    >
      <div className="modal-box flex flex-col gap-2">
        {!session?.user ? (
          <>
            <div className="flex flex-col gap-2">
              <div className="alert flex gap-2 items-center alert-info my-2">
                <MdInfo />
                You need to login first.
              </div>
              <Link href={'/api/auth/signin'} className="btn btn-primary">
                Login <AiOutlineLogin />
              </Link>
            </div>
          </>
        ) : (
          <>
            <h3 className="font-bold flex gap-2 text-lg mb-2">
              <MdAdd /> Add &quot;{product.name}&quot;
            </h3>
            <form
              action={addToCart}
              className="flex flex-col items-start gap-2"
            >
              <input type="hidden" name="productId" value={product.id} />
              <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span className="label-text">Quantity</span>
                </label>
                <input
                  type="number"
                  step={1}
                  className="input input-bordered w-full"
                  placeholder="Quantity"
                  name="quantity"
                />
              </div>
              <button type="submit" className="btn mt-4 w-fit btn-primary">
                <MdAddShoppingCart /> Add to cart
              </button>
            </form>
          </>
        )}
      </div>
    </Modal>
  );
};

export default AddToCartForm;
export const dynamic = 'force-dynamic';
