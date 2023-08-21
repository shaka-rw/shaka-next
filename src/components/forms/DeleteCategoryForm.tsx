'use client';
import { Category } from '@prisma/client';
import React, { useTransition } from 'react';
import { Modal } from '../Modal';
import { deleteCategory } from '@/app/_actions/category';
import { MdDeleteForever } from 'react-icons/md';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { closeModal } from '../client/ClientModal';

const DeleteCategoryForm = ({ category }: { category: Category }) => {
  const { handleSubmit } = useForm({ values: { categoryId: category.id } });
  const [isPending, startTransition] = useTransition();
  const modalId = `delete_cat_${category.id}`;

  const onSubmit = (data: { categoryId: string }) => {
    const formData = new FormData();
    formData.append('categoryId', data.categoryId);
    startTransition(async () => {
      const result = await deleteCategory(formData);
      if (result[0]) {
        toast.error(result[0]);
        return;
      }
      closeModal(modalId);
      toast.success('Category deleted successfuly!');
    });
  };
  return (
    <Modal
      btn={
        <>
          <button className="btn btn-sm btn-error">
            <MdDeleteForever />
            {!category.parentId ? 'Delete' : ''}
          </button>
        </>
      }
      btnContent={<></>}
      modalId={modalId}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3 className="font-semibold my-3">
          Delete &quot;{category.name}&quot;
        </h3>
        <button disabled={isPending} className="btn btn-error">
          Confirm Delete ?{' '}
          {isPending && <span className="loading loading-spinner loading-sm" />}
        </button>
      </form>
    </Modal>
  );
};

export default DeleteCategoryForm;
