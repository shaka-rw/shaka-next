'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Modal } from '../Modal';
import { MdAdd } from 'react-icons/md';
import { Category } from '@prisma/client';
import { addShop } from '@/app/_actions';
import { toast } from 'react-hot-toast';

const shopSchema = z.object({
  address: z.string().trim().min(1),
  name: z.string().trim().min(1),
  about: z.string().min(1),
  category: z.string().trim().min(1),
  image: z.any(),
});

const AddShopForm = ({
  categories,
  btn,
}: {
  categories: Category[];
  btn?: React.ReactNode;
}) => {
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
    formData.append('about', data.about);
    const imageList = data.image as FileList;
    if ((imageList?.length ?? 0) !== 1) {
      return toast.error('No shop image was selected!');
    }
    formData.append('image', imageList.item(0) as File);

    try {
      startTransition(() => addShop(formData));
    } catch (error: any) {
      toast.error(`Error: ${error?.message ?? 'Something went wrong..'}`);
      console.log(error);
    }
  };

  return (
    <Modal
      modalId={btn ? 'add_shop_o' : 'add_shop_i'}
      btn={
        btn ? (
          btn
        ) : (
          <button className="btn btn-primary">
            <MdAdd /> create shop
          </button>
        )
      }
      btnContent={<></>}
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
            placeholder="Shop name"
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
            placeholder="About your shop"
            {...register('about')}
          ></textarea>
          {errors.about && (
            <label className="label">
              <span className="label-text-alt text-red-500">
                {errors.about.message}
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
            <span className="label-text">Shop Profile</span>
          </label>
          <input
            type="file"
            className="file-input file-input-bordered w-full max-w-xs"
            {...register('image', {
              required: 'Shop image is required',
            })}
          />
          <label className="label"></label>
        </div>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Category (Industry)</span>
          </label>
          <select
            className="select select-bordered w-full max-w-xs"
            {...register('category')}
          >
            <option defaultValue={''} disabled defaultChecked>
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
          <MdAdd /> Add shop{' '}
          {isPending && <span className="loading loading-spinner loading-sm" />}
        </button>
      </form>
    </Modal>
  );
};

export default AddShopForm;
