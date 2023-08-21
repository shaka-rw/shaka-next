'use client';

import React, { useTransition } from 'react';
import { MdEdit } from 'react-icons/md';
import { Modal } from '../Modal';
import { Category } from '@prisma/client';
import { editCategory } from '@/app/_actions/category';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { closeModal } from '../client/ClientModal';

export const categorySchema = z.object({
  name: z.string().trim().nonempty(),
  image: z.any(),
});

export const editCategorySchema = categorySchema.extend({
  categoryId: z.string().trim().nonempty(),
});

const EditCategoryForm = ({
  category,
}: {
  category: Category & { parent?: Category };
}) => {
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<z.infer<typeof editCategorySchema>>({
    defaultValues: { categoryId: category.id },
    resolver: zodResolver(editCategorySchema),
  });

  const modalId = `edit_cat_${category.id}`;

  const [isPending, startTransition] = useTransition();

  const onSubmit: SubmitHandler<z.infer<typeof editCategorySchema>> = (
    data
  ) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('categoryId', data.categoryId);

    formData.append(
      'image',
      data.image && data.image.length ? data.image.item(0) : null
    );

    startTransition(async () => {
      const result = await editCategory(formData);
      if (Array.isArray(result)) {
        if (result[0]) {
          toast.error(result[0]);
        } else {
          closeModal(modalId);
          toast.success('Category edited successfully');
        }
      }
    });
  };

  return (
    <Modal
      btnContent={<></>}
      modalId={modalId}
      btn={
        <>
          <button className={`btn btn-primary btn-sm`}>
            <MdEdit /> {!category.parentId ? 'Edit' : ''}
          </button>
        </>
      }
    >
      <h3 className="font-bold text-lg mb-4 mt-2">Edit Category</h3>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-start gap-2"
      >
        <input
          type="text"
          required
          defaultValue={category.name}
          className="input w-full input-bordered"
          placeholder={'Category Name'}
          {...register('name')}
        />
        {errors.name && (
          <label className="label">
            <span className="label-text-alt text-red-500">
              {errors.name.message}
            </span>
          </label>
        )}
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">{'Category'} image</span>
          </label>
          <input
            type="file"
            className="file-input file-input-bordered w-full max-w-xs"
            {...register('image')}
          />
          <label className="label"></label>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="btn w-fit btn-primary"
        >
          <MdEdit />
          Edit
          {isPending && <span className="loading loading-spinner loading-sm" />}
        </button>
      </form>
    </Modal>
  );
};

export default EditCategoryForm;
