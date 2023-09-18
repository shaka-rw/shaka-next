'use client';
import {
  connectSizesToCategory,
  disconnectSizeFromCategory,
} from '@/app/_actions/category';
import DialogModal from '@/components/client/DialogModal';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import React, { useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import { MdCastConnected, MdClose } from 'react-icons/md';
import CreatableSelect from 'react-select/creatable';
import { z } from 'zod';

interface Category {
  id: string;
  name: string;
  image: {
    secureUrl: string;
  };
  productSizes: ProductSize[];
}

interface ProductSize {
  id: string;
  size: string;
}

interface Props {
  categories: Category[];
  existingSizes: ProductSize[];
}

const sizesSchema = z.object({
  sizes: z.array(z.string()),
});

const AddSizeToCategory: React.FC<Props> = ({ categories, existingSizes }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = React.useTransition();

  const { handleSubmit, reset, control } = useForm<z.infer<typeof sizesSchema>>(
    {
      resolver: zodResolver(sizesSchema),
    }
  );

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setIsModalOpen(true);
  };

  const onSubmit: SubmitHandler<z.infer<typeof sizesSchema>> = (data) => {
    // Handle form submission here
    const sizes = data.sizes.map((sz) => ({ size: sz }));

    startTransition(async () => {
      const formData = new FormData();
      sizes.forEach((sz) => formData.append('sizes', sz.size));
      formData.append('categoryId', selectedCategory!);
      const [error] = await connectSizesToCategory(formData);
      if (error) {
        toast.error(error);
        return;
      }
      toast.success('Sizes connected to category successfully');
      setIsModalOpen(false);
      reset();
    });
    // setIsModalOpen(false); // Close the modal after submission
  };

  const handleDisconnect = (size: string) => {
    // Handle disconnect here
    startTransition(async () => {
      const formData = new FormData();
      formData.append('size', size);
      formData.append('categoryId', selectedCategory!);

      const [error] = await disconnectSizeFromCategory(formData);
      if (error) {
        toast.error(error);
        return;
      }
      toast.success('Size disconnected from category successfully');
      setIsModalOpen(false);
      reset();
    });
  };

  const initialOptions = existingSizes.map((sz) => ({
    value: sz.size,
    label: sz.size,
  }));

  const [sizesOptions, setSizeOptions] = React.useState(initialOptions);

  return (
    <div>
      <h2 className="text-xl font-bold my-4 ">Connect Sizes to Categories</h2>
      <div className="max-w-full overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>
                  <Image
                    height={40}
                    width={40}
                    src={category.image.secureUrl}
                    alt={category.name}
                    className="w-10 rounded h-10"
                  />
                </td>
                <td>{category.name}</td>
                <td>
                  <button
                    className="btn btn-outline"
                    onClick={() => handleCategorySelect(category.id)}
                  >
                    Add/Change Sizes
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <DialogModal onClose={() => setIsModalOpen(false)} open={isModalOpen}>
          {/* Modal Content */}
          {isPending && (
            <DialogModal
              onClose={() => undefined}
              open={isPending}
              isPending={isPending}
            >
              <div className="flex flex-col items-center justify-center">
                <span className="loading loading-lg" />
                <h2 className="text-lg font-bold">Please wait..</h2>
              </div>
            </DialogModal>
          )}
          <div>
            <h2>
              Add/Change Sizes for{' '}
              {selectedCategory
                ? categories.find((c) => c.id === selectedCategory)?.name
                : ''}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Render connected sizes, can disconnect */}
              <div>
                <div className="flex flex-col max-w-sm my-3 gap-2 ">
                  <h3 className="text-base-300/70 text-sm font-bold capitalize mx-0 px-0">
                    Connected Sizes:
                  </h3>
                  {!categories.some((c) => c.id === selectedCategory) && (
                    <div className="alert alert-warning my-2">
                      No connected sizes
                    </div>
                  )}
                  {selectedCategory &&
                    categories
                      .find((c) => c.id === selectedCategory)
                      ?.productSizes.map((sz) => (
                        <div
                          key={sz.id}
                          className="grid grid-cols-[1fr,auto]  w-full py-1 border-b last:border-b-0 gap-2 items-center"
                        >
                          <span className=" mx-2">{sz.size}</span>
                          <button
                            type="button"
                            onClick={() => handleDisconnect(sz.size)}
                            className="btn flex-nowrap text-sm btn-warning btn-sm btn-outline"
                          >
                            <MdClose /> Disconnect
                          </button>
                        </div>
                      ))}
                </div>
              </div>
              <div>
                <div className="form-control w-full">
                  <label htmlFor="size" className="label">
                    <span className="label-text">Connect Size:</span>
                  </label>
                  <Controller
                    name="sizes"
                    control={control}
                    defaultValue={[] as string[]}
                    render={({ field }) => (
                      <>
                        <CreatableSelect
                          onCreateOption={(value) => {
                            field.onChange([...field.value, value]);
                            setSizeOptions((prev) => [
                              { value, label: value },
                              ...prev,
                            ]);
                          }}
                          ref={field.ref}
                          name={field.name}
                          value={field.value.map((v) => ({
                            value: v,
                            label: v,
                          }))}
                          onChange={(value) => {
                            field.onChange(value.map((v) => v.value));
                          }}
                          options={sizesOptions}
                          isMulti
                        />
                      </>
                    )}
                  />
                  {/* <select
                    id="size"
                    {...register('size')}
                    required
                    className="select select-bordered"
                  >
                    {existingSizes.map((sz) => (
                      <option key={sz.id} value={sz.size}>
                        {sz.size}
                      </option>
                    ))}
                  </select> */}
                </div>
              </div>

              <div className="mt-2 flex items-center gap-2 p-1">
                <button type="submit" className="btn btn-primary">
                  <MdCastConnected />
                  Connect
                </button>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    reset();
                  }}
                  className="btn btn-error"
                >
                  <MdClose />
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </DialogModal>
      )}
    </div>
  );
};

export default AddSizeToCategory;
