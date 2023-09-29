'use server';

import { AssetFolder } from '@/components/forms/AddCategoryForm';
import prisma from '@/prisma';
import { revalidatePath } from 'next/cache';
import { uploadAssetImage, getPath } from '.';

export async function addCategory(data: FormData) {
  const name = data.get('name') as string;
  const image = data.get('image') as File;
  const parentId = data.get('parentId') as string | null;

  if (!name.trim() || !image?.size) return;
  const asset = await uploadAssetImage(image, AssetFolder.Categories);

  try {
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
        ...(parentId
          ? { parent: { connect: { id: parentId as string } } }
          : {}),
      },
    });
  } catch (error) {
    console.error(error);
    return ["Error occured, can't create category"];
  }
  revalidatePath(await getPath());
}

export async function editCategory(formData: FormData) {
  const categoryId = formData.get('categoryId') as string;
  const name = formData.get('name') as string;

  const image = formData.get('image') as File | null;

  if (!name.trim()) return ['No image provided'];
  const asset =
    image?.size && image.size > 0 && image?.name
      ? await uploadAssetImage(image, AssetFolder.Categories)
      : null;

  const category = await prisma.category.update({
    where: { id: categoryId },
    data: {
      name,
      ...(asset
        ? {
          image: {
            create: {
              secureUrl: asset.secure_url,
              url: asset.url,
              assetId: asset.public_id,
            },
          },
        }
        : {}),
    },
  });
  revalidatePath(await getPath());
  return [];
}

export async function deleteCategory(formData: FormData) {
  const id = formData.get('categoryId') as string;

  try {
    await prisma.category.delete({ where: { id } });
  } catch (error) {
    return [
      `Can't delete this category. Check if some shops or products use this category.`,
    ];
  }
  revalidatePath(await getPath());
  return [];
}

export async function connectSizesToCategory(formData: FormData) {
  const categoryId = formData.get('categoryId') as string;
  const sizes = formData.getAll('sizes') as string[];

  try {
    const category = await prisma.category.update({
      where: { id: categoryId },
      data: {
        productSizes: {
          connectOrCreate: sizes.map((size) => ({
            create: { size },
            where: { size },
          })),
        },
      },
    });
  } catch (error) {
    console.error(error);
    return [`Can't connect sizes to category`];
  }
  revalidatePath(await getPath());
  return [];
}

export async function disconnectSizeFromCategory(formData: FormData) {
  const categoryId = formData.get('categoryId') as string;
  const size = formData.get('size') as string;

  try {
    const category = await prisma.category.update({
      where: { id: categoryId },
      data: {
        productSizes: {
          disconnect: {
            size,
          },
        },
      },
    });
  } catch (error) {
    console.error(error);
    return [`Can't disconnect size from category`];
  }
  revalidatePath(await getPath());
  return [];
}
