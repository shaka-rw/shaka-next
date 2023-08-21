import prisma from '@/prima';
import React from 'react';
import ModalBtn from '../ModalBtn';
import { revalidatePath } from 'next/cache';
import { MdAdd } from 'react-icons/md';
import { getPath, uploadAssetImage } from '@/app/_actions';
import { Category } from '@prisma/client';
import { Modal } from '../Modal';

export enum AssetFolder {
  Categories = 'categories',
  Shops = 'shops',
  ProductImages = 'product_images',
}

async function addCategory(data: FormData) {
  'use server';
  const name = data.get('name') as string;
  const image = data.get('image') as File;
  const parentId = data.get('parentId') as string | null;

  if (!name.trim() || !image?.size) return;
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
      ...(parentId ? { parent: { connect: { id: parentId as string } } } : {}),
    },
  });
  revalidatePath(await getPath());
}

const AddCategoryForm = ({ parent }: { parent?: Category }) => {
  return (
    <>
      {/* Open the modal using ID.showModal() method */}
      <Modal
        btnContent={<></>}
        modalId={`add_cat_${parent?.id ?? '0'}`}
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
        <form className="flex flex-col items-start gap-2" action={addCategory}>
          {parent && <input type="hidden" value={parent.id} name="parentId" />}
          <input
            type="text"
            name="name"
            className="input w-full input-bordered"
            placeholder={(parent ? 'Sub-' : '') + 'Category Name'}
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
              name="image"
            />
            <label className="label"></label>
          </div>
          <button type="submit" className="btn w-fit btn-primary">
            <MdAdd />
            {!parent ? ' Add Category' : 'Add Sub-category'}
          </button>
        </form>
      </Modal>
    </>
  );
};

export default AddCategoryForm;
