import React from 'react';
import { Modal } from '../Modal';
import { MdAdd, MdAddShoppingCart } from 'react-icons/md';
import { Product } from '@prisma/client';
import { addToCart } from '@/app/_actions';

const AddToCartForm = ({ product }: { product: Product }) => {
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
        <h3 className="font-bold flex gap-2 text-lg mb-2">
          <MdAdd /> Add &quot;{product.name}&quot;
        </h3>
        <form action={addToCart} className="flex flex-col items-start gap-2">
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
      </div>
    </Modal>
  );
};

export default AddToCartForm;
