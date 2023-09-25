'use client';
import React, { useTransition } from 'react';
import { MdAdd } from 'react-icons/md';
import { Category } from '@prisma/client';
import { Modal } from '../Modal';
import { addCategory } from '@/app/_actions/category';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { closeModal } from '../client/ClientModal';

enum AssetFolder {
  Categories = 'categories',
  Shops = 'shops',
  ProductImages = 'product_images',
}

const categorySchema = z.object({
  name: z.string().trim().nonempty(),
  image: z.any().refine((file) => {
    if (file instanceof File && file.type.includes('image')) {
      return true;
    }
    return 'Please select an image file';
  }),
  parentId: z.string().optional(),
});

const AddCategoryForm = ({ parent }: { parent?: Category }) => {
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit } = useForm<z.infer<typeof categorySchema>>({
    defaultValues: { parentId: parent?.id },
    resolver: zodResolver(categorySchema),
  });

  const modalId = `add_cat_${parent?.id ?? '0'}`;

  const onSumit: SubmitHandler<z.infer<typeof categorySchema>> = (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('parentId', parent?.id ?? '0');
    formData.append('image', data.image.item(0));
    startTransition(async () => {
      const result = await addCategory(formData);
      if (Array.isArray(result)) {
        if (result[0]) {
          toast.error(result[0]);
        } else {
          closeModal(modalId);
          toast.success('Category added successfully!');
        }
      }
    });
  };

  return (
    <>
      {/* Open the modal using ID.showModal() method */}
      <Modal
        btnContent={<></>}
        modalId={modalId}
        btn={
          <>
            <button className={`btn btn-primary ${parent ? 'btn-sm' : ''}`}>
              <MdAdd /> {!parent ? 'Add Category' : 'Add'}
            </button>
          </>
        }
      >
        <h3 className="font-bold text-lg mb-4 mt-2">
          Add {parent ? `Sub-category of "${parent.name}"` : 'Category'}
        </h3>
        <form
          className="flex flex-col items-start gap-2"
          onSubmit={handleSubmit(onSumit)}
        >
          {parent && (
            <input type="hidden" value={parent.id} {...register('parentId')} />
          )}
          <input
            type="text"
            className="input w-full input-bordered"
            placeholder={(parent ? 'Sub-' : '') + 'Category Name'}
            {...register('name')}
          />
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">
                {parent ? 'Sub-category' : 'Category'} image
              </span>
            </label>
            <input
              type="file"
              className="file-input file-input-bordered w-full max-w-xs"
              required
              {...register('image')}
            />
            <label className="label"></label>
          </div>
          <button
            disabled={isPending}
            type="submit"
            className="btn w-fit btn-primary"
          >
            {isPending && <span className="loading loading-spinner" />}
            <MdAdd />
            {!parent ? ' Add Category' : 'Add Sub-category'}
          </button>
        </form>
      </Modal>
    </>
  );
};

export default AddCategoryForm;
