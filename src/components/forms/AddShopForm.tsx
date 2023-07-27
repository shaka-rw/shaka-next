'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Modal } from '../Modal';
import { MdAdd } from 'react-icons/md';
import { Category } from '@prisma/client';
import { addShop } from '@/app/_actions';

const shopSchema = z.object({
  address: z.string().trim().min(1),
  name: z.string().trim().min(1),
  category: z.string().trim().min(1),
});

const AddShopForm = ({ categories }: { categories: Category[] }) => {
  const [isPending, startTransition] = useTransition();

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<z.infer<typeof shopSchema>>({
    resolver: zodResolver(shopSchema),
  });

  const onSubmit = (data: z.infer<typeof shopSchema>) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('address', data.address);
    formData.append('category', data.category);
    return startTransition(() => addShop(formData));
  };

  return (
    <Modal
      btnContent={
        <>
          <MdAdd /> Add shop
        </>
      }
    >
      <h3 className="font-bold items-center text-2xl my-2 uppercase flex gap-2">
        <MdAdd /> Add shop
      </h3>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col mx-auto md:w-[400px] gap-2"
      >
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Shop Name</span>
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
            <span className="label-text">Shop Address</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Address"
            {...register('address')}
          />
          {errors.address && (
            <label className="label">
              <span className="label-text-alt text-red-500">
                {errors.address.message}
              </span>
            </label>
          )}
        </div>
        <div className="form-control w-full max-w-xs">
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
        </div>
        <button disabled={isPending} className="btn btn-primary w-fit">
          <MdAdd /> Add shop {isPending && <span className='loading loading-spinner loading-sm' />}
        </button>
      </form>
    </Modal>
  );
};

export default AddShopForm;
