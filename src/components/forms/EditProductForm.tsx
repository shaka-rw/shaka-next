'use client';
import React, { useState, useTransition } from 'react';
import { Modal } from '../Modal';
import { MdEdit } from 'react-icons/md';
import { VariationProduct } from './AddVariationsForm';
import { z } from 'zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { Category, ProductSize } from '@prisma/client';
import { editProduct } from '@/app/_actions';
import { toast } from 'react-hot-toast';

export const editProductSchema = z.object({
  sizes: z.array(z.string().trim().nonempty()),
  productId: z.string().trim().nonempty(),
  available: z.boolean().default(true),
  gender: z.enum(['FEMALE', 'MALE', 'UNISEX']),
  categories: z.array(z.string().trim().nonempty()),
  description: z.string().trim().min(10),
});

const ProductEditForm = ({
  product,
  categories = [],
  sizes = [],
  productCategories = [],
}: {
  product: VariationProduct;
  categories: Category[];
  productCategories: Category[];
  sizes: ProductSize[];
}) => {
  const [isPending, startTransition] = useTransition();

  const modalId = `edit-product-${product.id}`;

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<z.infer<typeof editProductSchema>>({
    defaultValues: {
      sizes: product.sizes.map((s) => s.size),
      categories: productCategories.map((cat) => cat.id),
      description: product.description,
      gender: product.gender,
      productId: product.id,
    },
    resolver: zodResolver(editProductSchema),
  });

  const categoriesOptions = categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));

  const sizeOptions = sizes.map((sz) => ({
    value: sz.size,
    label: sz.size,
  }));

  const [sizesOptions, setSizeOptions] = useState(sizeOptions);

  const onSubmit: SubmitHandler<z.infer<typeof editProductSchema>> = (data) => {
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    startTransition(async () => {
      const result = await editProduct(formData);
      if (result[0]) toast.error(result[0]);
      else {
        toast.success('Product edited successfully!');
      }
    });
    // console.log({ data });
  };

  return (
    <Modal
      btn={
        <button className="btn text-xl btn-primary btn-circle btn-sm md:btn-md">
          <MdEdit />
        </button>
      }
      btnContent={<></>}
      modalId={modalId}
    >
      <h3 className="font-bold flex items-center gap-2 text-lg mb-5">
        <MdEdit /> Edit{' '}
        <span className="text-secondary ml-2 underline"> {product.name}</span>
      </h3>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col mx-auto md:w-[400px] gap-2"
      >
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
                  className="bg-base-100 text-base-content"
                  onChange={(value) => {
                    console.log({ value, fValue: field.value });
                    field.value;
                    field.onChange(value.map((v) => (v as any).value));
                  }}
                  options={categoriesOptions as any}
                  isMulti
                  defaultValue={productCategories.map(({ name, id }) => ({
                    value: id,
                    label: name,
                  }))}
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
                  className="bg-base-100 text-base-content"
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
                  defaultValue={sizeOptions.filter((op) =>
                    field.value.some((v) => op.value === v)
                  )}
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
            <span className="label-text">Gender</span>
          </label>
          <select
            className="select select-bordered"
            {...register('gender', { value: product.gender })}
          >
            <option disabled>Select Gender</option>
            <option
              value={'UNISEX'}
              defaultChecked={product.gender === 'UNISEX'}
            >
              All Genders (Unisex)
            </option>
            <option value={'MALE'} defaultChecked={product.gender === 'MALE'}>
              Male
            </option>
            <option
              value={'FEMALE'}
              defaultChecked={product.gender === 'FEMALE'}
            >
              Female
            </option>
          </select>

          {errors.gender && (
            <label className="label">
              <span className="label-text-alt text-red-500">
                {errors.gender.message}
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
            {...register('description', { value: product.description })}
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
          <label htmlFor="ava" className="cursor-pointer label">
            <span className="label-text font-bold">Available*</span>
            <input
              type="checkbox"
              id="ava"
              className="checkbox-error checkbox"
              defaultChecked={product.available}
              {...register('available')}
            />
          </label>
          <span className="label-text text-warning   text-xs">
            *Unavailable products are not visible to customers
          </span>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="btn btn-primary w-fit"
        >
          <MdEdit /> Edit Product{' '}
          {isPending && <span className="loading loading-spinner loading-sm" />}
        </button>
      </form>
    </Modal>
  );
};

export default ProductEditForm;
