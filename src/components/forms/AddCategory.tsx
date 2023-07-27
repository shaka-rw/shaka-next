import prisma from '@/prima';
import React from 'react';
import ModalBtn from '../ModalBtn';
import { revalidatePath } from 'next/cache';
import { MdAdd } from 'react-icons/md';

async function addCategory(data: FormData) {
  'use server';
  const name = data.get('name') as string;
  console.log({ catname: name });
  if (!name.trim()) return;

  const category = await prisma.category.create({ data: { name } });
  console.log({ category });
  revalidatePath('/');
}

const AddCategory = () => {
  return (
    <>
      {/* Open the modal using ID.showModal() method */}
      <ModalBtn modalId="my_modal_1" />
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box flex flex-col gap-2">
          <h3 className="font-bold text-lg mb-2">Add Category</h3>
          <form
            className="flex flex-col items-start gap-2"
            action={addCategory}
          >
            <input
              type="text"
              name="name"
              className="input w-full input-bordered"
              placeholder="Category Name"
            />
            <button type="submit" className="btn w-fit btn-primary">
              <MdAdd /> Add Category
            </button>
          </form>
          <div
            dangerouslySetInnerHTML={{
              __html: `<button class="btn" onclick="window.my_modal_1.close()">Close</button>`,
            }}
            className="modal-action"
          >
            {/* if there is a button in form, it will close the modal */}
          </div>
        </div>
      </dialog>
    </>
  );
};

export default AddCategory;
