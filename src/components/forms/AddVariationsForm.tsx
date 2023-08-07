/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useTransition } from 'react';
import { MdAdd, MdAddBox, MdSave, MdClose } from 'react-icons/md';
import { Modal } from '../Modal';
import {
  Asset,
  Product,
  ProductColor,
  ProductQuantity,
  ProductSize,
} from '@prisma/client';
import { useSession } from 'next-auth/react';
import { z } from 'zod';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FaCaretDown } from 'react-icons/fa';
import { addProductVariation } from '@/app/_actions';

const variationSchema = z.object({
  color: z
    .string()
    .trim()
    .min(1, { message: 'No color is choosen yet' })
    .default(''),
  size: z
    .string()
    .trim()
    .min(1, { message: 'No size is choosen yet' })
    .default(''),
  price: z
    .number()
    .positive({ message: 'Price should be positive' })
    .step(0.01)
    .default(0),
  quantity: z
    .number()
    .positive({ message: 'Quantity should be positive' })
    .default(0),
});

export const multiVariationSchema = z.object({
  productId: z.string().nonempty(),
  variations: z
    .array(variationSchema)
    .nonempty({ message: 'You need at least one variation' }),
});

export type VariationProduct = Product & {
  colors: (ProductColor & { mainImage: Asset })[];
  sizes: ProductSize[];
  quantities: (ProductQuantity & {
    color: ProductColor & { mainImage: Asset };
    size: ProductSize;
  })[];
  mainImage: Asset;
};

const AddVariationsForm = ({ product }: { product: VariationProduct }) => {
  const session = useSession();

  const {
    handleSubmit,
    register,
    watch,
    control,

    formState: { errors },
  } = useForm<z.infer<typeof multiVariationSchema>>({
    resolver: zodResolver(multiVariationSchema),
  });

  const [isPending, startTransition] = useTransition();

  const colors = (watch('variations') ?? []).map(({ color }) =>
    product.colors.find((c) => c.id === color)
  );
  const sizes = (watch('variations') ?? []).map(({ size }) =>
    product.sizes.find((s) => s.id === size)
  );

  const { append, remove, fields } = useFieldArray({
    control,
    name: 'variations',
  });

  const onSubmit: SubmitHandler<z.infer<typeof multiVariationSchema>> = (
    data
  ) => {
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));

    startTransition(() => addProductVariation(formData));
  };

  //   const
  return (
    <Modal
      btnPrimary={true}
      modalId={`variations_${product.id}`}
      btnContent={
        <>
          <MdAddBox /> Add Variations
        </>
      }
    >
      <>
        <h3 className="font-bold flex items-centergap-2 text-lg mb-5">
          <MdAdd /> Add varitations of{' '}
          <span className="text-secondary ml-2 underline"> {product.name}</span>
        </h3>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-start gap-2"
        >
          <input
            type="hidden"
            value={product.id}
            {...register('productId', { value: product.id })}
          />
          {fields.map((field, index) => {
            return (
              <div
                key={field.id}
                className="flex flex-col gap-2 rounded-md border p-1"
              >
                <div className="flex w-full items-center gap-2">
                  <div className="dropdown">
                    <label
                      tabIndex={0}
                      className="btn btn-square btn-lg w-24 text-sm items-center gap-2 "
                    >
                      {colors[index] ? (
                        <>
                          <label
                            tabIndex={0}
                            htmlFor={`_${colors[index]?.id}`}
                            className="avatar w-8 h-8 bg-base-200 rounded overflow-hidden"
                          >
                            <img
                              src={colors[index]?.mainImage.secureUrl}
                              alt="Color image"
                              className="max-w-full max-h-full object-contain"
                            />
                          </label>
                        </>
                      ) : (
                        <>
                          <div className="label-text"> Color </div>
                        </>
                      )}
                      <FaCaretDown />
                    </label>
                    <div className="dropdown-content z-10 shadow-md border menu p-2 bg-base-100 rounded-box w-52">
                      {product.colors.map((color) => (
                        <label
                          tabIndex={0}
                          htmlFor={color.id + index}
                          key={color.id}
                          className="flex items-center gap-2 p-1"
                        >
                          <input
                            type="radio"
                            id={color.id + index}
                            value={color.id}
                            className="radio radio-primary"
                            {...register(`variations.${index}.color`)}
                          />
                          <label
                            tabIndex={0}
                            htmlFor={color.id + index}
                            className="avatar w-16 h-16 bg-base-200 rounded overflow-hidden"
                          >
                            <img
                              src={color.mainImage.secureUrl}
                              alt="Color image"
                              className="max-w-full max-h-full object-contain"
                            />
                          </label>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="dropdown">
                    <label
                      tabIndex={0}
                      className="btn btn-square btn-lg w-24 text-sm  items-center gap-2 "
                    >
                      <div className="label-text">
                        {sizes[index]?.size ?? 'Size'}{' '}
                      </div>
                      <FaCaretDown />
                    </label>
                    <div className="dropdown-content z-10 shadow-md border menu p-2 bg-base-100 rounded-box w-52">
                      {product.sizes.map((size) => (
                        <label
                          tabIndex={0}
                          key={size.id}
                          htmlFor={size.id + index}
                          className="flex items-center gap-2 p-1"
                        >
                          <input
                            id={size.id + index}
                            type="radio"
                            value={size.id}
                            className="radio radio-primary"
                            {...register(`variations.${index}.size`)}
                          />
                          <span tabIndex={0} className="text-lg">
                            {size.size}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1 flex justify-end">
                    <button
                      onClick={() => remove(index)}
                      className="btn-sm self-start justify-self-end btn m-1  btn-error"
                    >
                      <MdClose />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {errors.variations?.at &&
                    errors.variations.at(index)?.color && (
                      <label className="label">
                        <span className="label-text-alt text-red-500">
                          Color: {errors.variations.at(index)?.color?.message}
                        </span>
                      </label>
                    )}
                  {errors.variations?.at &&
                    errors.variations.at(index)?.size && (
                      <label className="label">
                        <span className="label-text-alt text-red-500">
                          Size: {errors.variations.at(index)?.size?.message}
                        </span>
                      </label>
                    )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="form-control w-full max-w-xs">
                    <label className="label">
                      <span className="label-text">Price</span>
                    </label>
                    <input
                      type="number"
                      placeholder="Price"
                      className="input input-bordered w-full max-w-xs"
                      {...register(`variations.${index}.price`, {
                        valueAsNumber: true,
                      })}
                    />
                    {errors.variations?.at &&
                      errors.variations.at(index)?.price && (
                        <label className="label">
                          <span className="label-text-alt text-red-500">
                            {errors.variations.at(index)?.price?.message}
                          </span>
                        </label>
                      )}
                  </div>
                  <div className="form-control w-full max-w-xs">
                    <label className="label">
                      <span className="label-text">Quantity</span>
                    </label>
                    <input
                      type="number"
                      placeholder="Quantity"
                      className="input input-bordered w-full max-w-xs"
                      {...register(`variations.${index}.quantity`, {
                        valueAsNumber: true,
                      })}
                    />
                    {errors.variations?.at &&
                      errors.variations.at(index)?.quantity && (
                        <label className="label">
                          <span className="label-text-alt text-red-500">
                            {errors.variations.at(index)?.quantity?.message}
                          </span>
                        </label>
                      )}
                  </div>
                </div>
              </div>
            );
          })}

          <button
            onClick={() =>
              append({ color: '', size: '', price: 0, quantity: 0 })
            }
            className="btn my-1 btn-sm btn-info"
          >
            <MdAdd /> Add Variation
          </button>
          {/* <div className="form-control w-full max-w-xs">
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
          </div> */}
          <button
            disabled={isPending}
            type="submit"
            className="btn mt-4 w-fit btn-primary"
          >
            <MdSave /> Save variations
            {isPending && (
              <span className="loading loading-spinner loading-sm" />
            )}
          </button>
        </form>
      </>
    </Modal>
  );
};

export default AddVariationsForm;
