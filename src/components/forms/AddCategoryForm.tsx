import prisma from '@/prima';
import React from 'react';
import ModalBtn from '../ModalBtn';
import { revalidatePath } from 'next/cache';
import { MdAdd } from 'react-icons/md';
import { uploadAssetImage } from '@/app/_actions';

export enum AssetFolder {
  Categories = 'categories',
  Shops = 'shops',
  ProductColors = 'product_colors',
}

async function addCategory(data: FormData) {
  'use server';
  const name = data.get('name') as string;
  const image = data.get('image') as File;

  if (!name.trim() || !image.size) return;
  const asset = await uploadAssetImage(image, AssetFolder.Categories);

  const category = await prisma.category.create({
    data: {
      name,
      image: {
        create: {
          secureUrl: asset.secure_url,
          url: asset.url,
          assetId: asset.public_id,
        },
      },
    },
  });
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
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Category image</span>
              </label>
              <input
                type="file"
                className="file-input file-input-bordered w-full max-w-xs"
                required
                name="image"
              />
              <label className="label"></label>
            </div>
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
