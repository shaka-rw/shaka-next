/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { Modal } from '../Modal';
import { MdAdd, MdAddShoppingCart } from 'react-icons/md';
import {
  Asset,
  ProductColor,
  ProductQuantity,
  ProductSize,
} from '@prisma/client';
import { addToCart } from '@/app/_actions';
import { VariationProduct } from './AddVariationsForm';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import useAnonymousCartId from '@/hooks/useAnonymousCartId';
import { twMerge } from 'tailwind-merge';

export const cartSchema = z.object({
  color: z.string().nonempty(),
  size: z.string().nonempty(),
  quantity: z.number().positive(),
});

const AddToCartForm = ({
  product,
  btnText = '',
  className = '',
}: {
  product: VariationProduct;
  btnText?: string;
  className?: string;
}) => {
  const [isPending, startTransition] = useTransition();
  useAnonymousCartId();

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof cartSchema>>({
    resolver: zodResolver(cartSchema),
  });
  const [qty, setQty] = useState<ProductQuantity>();

  const values = watch();

  useEffect(() => {
    if (product) {
      const pQty = product.quantities.find(
        (qt) => qt.color.id === values.color && qt.size.id === values.size
      );
      setQty(pQty);
    }
  }, [product, values]);

  const onSubmit: SubmitHandler<z.infer<typeof cartSchema>> = (data) => {
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    startTransition(async () => {
      const result = await addToCart(formData);
      if (result[0]) {
        toast.error(result[0]);
      } else {
        toast.success(`Added to cart :)`);
      }
    });
  };

  return (
    <Modal
      modalId={`add_to_cart_${product.id}`}
      btn={
        <button className={twMerge(`btn btn-sm btn-primary`, className)}>
          <MdAddShoppingCart /> {btnText && <span>{btnText}</span>}
        </button>
      }
      btnContent={<></>}
    >
      <div className="flex flex-col gap-2">
        <>
          <h3 className="font-bold flex items-center gap-2 text-lg mb-2">
            <MdAdd /> Add &quot;{product.name}&quot; to cart
          </h3>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-start gap-2"
          >
            <input type="hidden" name="productId" value={product.id} />

            <div className="flex flex-col gap-2">
              <span className="text-sm font-bold">Size</span>
              <div className="flex items-center gap-2 p-1 order">
                {product.quantities
                  .reduce((a, c) => {
                    if (a.every((sz) => sz.id !== c.size.id)) a.push(c.size);
                    return a;
                  }, [] as ProductSize[])
                  .map((sz, i) => (
                    <>
                      <label
                        className="flex items-center "
                        htmlFor={sz.id + i}
                        key={sz.id}
                      >
                        <input
                          type="radio"
                          id={sz.id + i}
                          value={sz.id}
                          className="radio peer/size hidden radio-primary"
                          {...register('size')}
                        />
                        <span className="inline-flex btn-circle shadow  justify-center items-center text-lg capitalize peer-checked/size:bg-base-300 peer-checked/size:border-[3px] hover:border-[3px] peer-hover/size:border-[3px] border-0 border-secondary bg-base-200 p-1">
                          {sz.size.slice(0, 1)}
                        </span>
                      </label>
                      {errors.size && (
                        <label className="label">
                          <span className="label-text-alt text-red-500">
                            {errors.size?.message}
                          </span>
                        </label>
                      )}
                    </>
                  ))}
              </div>
              <span className="text-sm font-bold">Color</span>
              <div className="flex items-center gap-2 p-1 order">
                {product.quantities
                  .reduce((a, c) => {
                    if (a.every((clr) => clr.id !== c.color.id))
                      a.push(c.color);
                    return a;
                  }, [] as (ProductColor & { mainImage: Asset })[])
                  .map((color, i) => (
                    <>
                      <label
                        className="text-lg flex items-center "
                        htmlFor={color.id + i}
                        key={color.id}
                      >
                        <input
                          type="radio"
                          id={color.id + i}
                          value={color.id}
                          className="radio hidden peer/color radio-primary"
                          {...register('color')}
                        />
                        <div className="avatar inline-flex btn-circle shadow border-secondary justify-center items-center peer-checked/color:border-[3px] hover:border-[3px] peer-hover/color:border-[3px] border-0 bg-base-200 overflow-hidden">
                          <div className="w-full">
                            <img
                              src={color.mainImage.secureUrl}
                              alt="Color image"
                              className=""
                            />
                          </div>
                        </div>
                      </label>
                      {errors.size && (
                        <label className="label">
                          <span className="label-text-alt text-red-500">
                            {errors.size?.message}
                          </span>
                        </label>
                      )}
                    </>
                  ))}
              </div>
              <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span className="label-text">Quantity</span>
                </label>
                <input
                  type="number"
                  max={values.quantity ?? Infinity}
                  placeholder="Quantity"
                  className="input input-bordered w-full max-w-xs"
                  {...register(`quantity`, {
                    valueAsNumber: true,
                  })}
                />
                {errors.quantity && (
                  <label className="label">
                    <span className="label-text-alt text-red-500">
                      {errors.quantity?.message}
                    </span>
                  </label>
                )}
              </div>
            </div>
            {qty && values.quantity ? (
              <div className="text-lg font-bold py-2 border-y">
                Price:{' '}
                <span className="text-xs mx-[2px]">
                  ({qty.price}&times;{values.quantity})
                </span>{' '}
                {qty.price * (values.quantity ?? 0)} RWF
              </div>
            ) : (
              <></>
            )}
            <button
              disabled={isPending}
              type="submit"
              className="btn mt-4 w-fit btn-primary"
            >
              <MdAddShoppingCart /> Add to cart{' '}
              {isPending && (
                <span className="loading loading-spinner loading-sm" />
              )}
            </button>
          </form>
        </>
        {/* )} */}
      </div>
    </Modal>
  );
};

export default AddToCartForm;
export const dynamic = 'force-dynamic';
