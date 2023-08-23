'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Category } from '@prisma/client';
import React, { useState, useTransition } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { MdAdd, MdClose } from 'react-icons/md';
import { z } from 'zod';
import { Modal } from '../Modal';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { addProduct } from '@/app/_actions';
import { toast } from 'react-hot-toast';

const colorImageSchema = z.object({
  color: z.any(),
  images: z.any(),
});

export const productSchema = z.object({
  name: z.string().trim().min(3),
  description: z.string().trim().min(10),
  shopId: z.string().trim(),
  sizes: z.array(z.string()),
  gender: z.enum(['FEMALE', 'MALE', 'UNISEX']).default('UNISEX'),
  categories: z.array(z.string().trim()),
  mainImage: z.any(),
  colors: z
    .array(colorImageSchema)
    .nonempty({ message: 'You must add at least one color!' }),
});

function getVideoDurationInMinutes(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');

    video.onloadedmetadata = () => {
      const durationInSeconds = video.duration;
      const durationInMinutes = durationInSeconds / 60;
      resolve(durationInMinutes);
    };

    video.onerror = (event) => {
      reject(new Error('Unable to get video duration.'));
    };

    video.src = URL.createObjectURL(file);
  });
}

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
  const { fields, append, remove } = useFieldArray({ control, name: 'colors' });

  const onSubmit = async (data: z.infer<typeof productSchema>) => {
    const formData = new FormData();

    let error = '';

    const organiseImages = data.colors.map(async (color, i) => {
      const missingColorMainImage =
        !color.color || ((color.color as any)?.length ?? 0) < 1;
      const missingColorImages =
        !color.images || ((color.images as any)?.length ?? 0) < 1;
      if (missingColorImages || missingColorMainImage) {
        error = 'At least 1 color image or color images/video is missing';
        return;
      }
      const colorImages = [...color.images] as File[];
      const videos = colorImages.filter((img) => img.type.includes('video'));
      if (videos.length > 1) {
        error = 'Only one video can be uploaded per color';
        return;
      }
      const hasMoreThanAMinute = async (vid: File) =>
        (await getVideoDurationInMinutes(vid)) > 1;
      const results = await Promise.all(videos.map(hasMoreThanAMinute));
      if (results.includes(true)) {
        error = 'A video can have maximum DURATION of ONE MINUTE.';
        return;
      }

      formData.append(`colors`, (color.color as FileList).item(0) as File);
      colorImages.forEach((img) => {
        formData.append(`color_images_${i}`, img);
      });

      // formData.append(`colors_images[${i}]`, );
    });

    await Promise.all(organiseImages);

    if (error) {
      return toast.error(error);
    }

    if ((data.mainImage?.length ?? 0) < 1) {
      return toast.error('You need to add a main image!');
    }

    formData.append('mainImage', (data.mainImage as FileList).item(0) as File);

    // Remove image fields
    delete data.mainImage;
    delete (data as any).colors;

    formData.append('product_data', JSON.stringify(data));

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
      btn={
        <button className="btn btn-primary">
          <MdAdd /> Add new product
        </button>
      }
      btnContent={<></>}
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
            <span className="label-text">Gender</span>
          </label>
          <select className="select select-bordered" {...register('gender')}>
            <option disabled defaultChecked>
              Select Gender
            </option>
            <option value={'UNISEX'}>All Genders (Unisex)</option>
            <option value={'MALE'}>Male</option>
            <option value={'FEMALE'}>Female</option>
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
        {/* <div className="form-control w-full max-w-xs">
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
        </div> */}
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
        <div className="flex flex-col gap-2 p-1">
          <div className="form-control flex flex-col gap-2 items-start w-full max-w-xs">
            {fields.map((field, index) => {
              return (
                <div
                  key={field.id}
                  className="gap-2 rounded-md border p-1 px-2"
                >
                  <div className="flex flex-col">
                    <label className="label">
                      <span className="label-text">Main Color Image</span>
                    </label>
                    <div className="form-control w-full max-w-xs">
                      <input
                        type="file"
                        accept="image/*"
                        placeholder="Color image"
                        className="file-input file-input-bordered w-full max-w-xs"
                        {...register(`colors.${index}.color`)}
                      />
                      <label className="label "></label>
                    </div>
                    <label className="label">
                      <span className="label-text capitalize">
                        Images/videos of same color
                      </span>
                    </label>
                    <div className="form-control w-full max-w-xs">
                      <input
                        type="file"
                        accept="image/*, video/*"
                        multiple
                        placeholder="Color Images"
                        className="file-input file-input-bordered w-full max-w-xs"
                        {...register(`colors.${index}.images`)}
                      />
                      <label className="label"></label>
                    </div>
                  </div>

                  <button
                    className="btn w-fit btn-error btn-sm"
                    type="button"
                    onClick={() => remove(index)}
                  >
                    <MdClose /> DELETE
                  </button>
                </div>
              );
            })}
          </div>
          {errors.colors?.message && (
            <label className="label">
              <span className="label-text-alt text-red-500">
                {errors.colors.message}
              </span>
            </label>
          )}
          <button
            type="button"
            className="btn btn-info w-fit btn-sm"
            onClick={() =>
              append({
                color: null,
                images: [],
              })
            }
          >
            <MdAdd /> Add color
          </button>
        </div>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Main Image</span>
          </label>
          <input
            type="file"
            accept="image/*"
            className="file-input file-input-bordered w-full max-w-xs"
            {...register('mainImage')}
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
