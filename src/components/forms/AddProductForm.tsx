'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Category } from '@prisma/client';
import React, { useState, useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { MdAdd } from 'react-icons/md';
import { z } from 'zod';
import { Modal } from '../Modal';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { addProduct } from '@/app/_actions';
import { toast } from 'react-hot-toast';

export const productSchema = z.object({
  name: z.string().trim().min(3),
  description: z.string().trim().min(10),
  shopId: z.string().trim(),
  sizes: z.array(z.string()),
  price: z.number().step(0.01).min(0.01),
  categories: z.array(z.string().trim()),
  images: z.any(),
});

const AddProductForm = ({
  categories,
  shopId,
}: {
  categories: Category[];
  shopId: string;
}) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: { shopId },
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit = (data: z.infer<typeof productSchema>) => {
    const formData = new FormData();

    [...data.images].forEach((img, i) => {
      formData.append(`images`, img);
    });

    if (data.images.length < 1) {
      return toast.error('You need at least one image!');
    }

    delete data.images;
    formData.append('product_data', JSON.stringify(data));

    console.log({ data });
    return startTransition(() => addProduct(formData));
  };

  const [sizesOptions, setSizeOptions] = useState([
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
  ]);

  const categoriesOptions = categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));

  return (
    <Modal
      btnContent={
        <>
          <MdAdd /> Add new product
        </>
      }
    >
      <h3 className="font-bold items-center text-2xl my-2 uppercase flex gap-2">
        <MdAdd /> Add product
      </h3>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col mx-auto md:w-[400px] gap-2"
      >
        <input type="hidden" value={shopId} {...register('shopId')} />
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Product Name</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Name"
            {...register('name')}
          />
          {errors.name && (
            <label className="label">
              <span className="label-text-alt text-red-500">
                {errors.name.message}
              </span>
            </label>
          )}
        </div>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full"
            {...register('description')}
          ></textarea>
          {errors.description && (
            <label className="label">
              <span className="label-text-alt text-red-500">
                {errors.description.message}
              </span>
            </label>
          )}
        </div>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Price</span>
          </label>
          <input
            type="number"
            step={0.01}
            className="input input-bordered w-full"
            placeholder="Price"
            {...register('price', { valueAsNumber: true })}
          />
          {errors.price && (
            <label className="label">
              <span className="label-text-alt text-red-500">
                {errors.price.message}
              </span>
            </label>
          )}
        </div>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Categories</span>
          </label>
          <Controller
            name="categories"
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <>
                <Select
                  ref={field.ref}
                  name={field.name}
                  onChange={(value) => {
                    console.log({ value, fValue: field.value });
                    field.value;
                    field.onChange(value.map((v) => (v as any).value));
                  }}
                  options={categoriesOptions as any}
                  isMulti
                />
              </>
            )}
          />
          {errors.categories && (
            <label className="label">
              <span className="label-text-alt text-red-500">
                {errors.categories.message}
              </span>
            </label>
          )}
        </div>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Sizes</span>
          </label>
          <Controller
            name="sizes"
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <>
                <CreatableSelect
                  createOptionPosition="first"
                  onCreateOption={(value) => {
                    setSizeOptions([{ value, label: value }, ...sizesOptions]);
                  }}
                  ref={field.ref}
                  name={field.name}
                  onChange={(value) => {
                    field.value;
                    field.onChange(value.map((v) => (v as any).value));
                  }}
                  options={sizesOptions as any}
                  isMulti
                />
              </>
            )}
          />
          {errors.sizes && (
            <label className="label">
              <span className="label-text-alt text-red-500">
                {errors.sizes.message}
              </span>
            </label>
          )}
        </div>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Pick images</span>
          </label>
          <input
            type="file"
            multiple
            className="file-input file-input-bordered w-full max-w-xs"
            {...register('images')}
          />
          <label className="label"></label>
        </div>

        {/* <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Category (Industry)</span>
          </label>
          <select
            className="select select-bordered w-full max-w-xs"
            {...register('category')}
          >
            <option disabled selected>
              Choose category
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <label className="label">
              <span className="label-text-alt text-red-500">
                {errors.category.message}
              </span>
            </label>
          )}
        </div> */}
        <button
          type="submit"
          disabled={isPending}
          className="btn btn-primary w-fit"
        >
          <MdAdd /> Add product{' '}
          {isPending && <span className="loading loading-spinner loading-sm" />}
        </button>
      </form>
    </Modal>
  );
};

export default AddProductForm;
