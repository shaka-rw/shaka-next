'use server';

import { AssetFolder } from '@/components/forms/AddCategoryForm';
import { getPath, uploadAssetImage } from '.';
import prisma from '@/prisma';
import { revalidatePath } from 'next/cache';
import { deleteCloudinaryAsset } from '../helpers/deleteAssets';

export async function updateAsset(formData: FormData) {
  const image = formData.get('image') as File | null;
  const folder = formData.get('folder') as AssetFolder | null;
  const assetId = formData.get('assetId') as string | null;

  if (!image) return ['No image provided'];
  if (!folder) return ['No asset folder provided'];
  if (!assetId) return ['No asset id provided'];

  const newAsset = await uploadAssetImage(image, folder);
  const previousAsset = await prisma.asset.findUnique({
    where: { id: assetId },
  });

  if (!previousAsset) return ['Asset not found'];

  const updatedAsset = await prisma.asset.update({
    where: { id: assetId },
    data: { secureUrl: newAsset.secure_url, assetId: newAsset.public_id },
  });

  try {
    await deleteCloudinaryAsset(
      previousAsset?.assetId ??
        previousAsset?.secureUrl
          .split(/[\/\.]/)
          .slice(-3, -1)
          .join('/')
    );
  } catch (error) {
    console.log('Error deleting cloudinary asset', error);
  }

  revalidatePath(await getPath());
  return [undefined, updatedAsset];
}

export async function deleteAsset(formData: FormData) {
  const assetId = formData.get('assetId') as string | null;

  if (!assetId) return ['No asset id provided'];

  const asset = await prisma.asset.findUnique({
    where: { id: assetId },
  });

  if (!asset) return ['Asset not found'];
  const relatedProduct = await prisma.product.findFirst({
    where: {
      colors: {
        some: {
          images: { some: { id: asset.id } },
        },
      },
    },
    include: {
      colors: { include: { images: { where: { id: asset.id } } } },
    },
  });

  const imagesCount = relatedProduct?.colors?.[0]?.images?.length;

  if (relatedProduct && typeof imagesCount === 'number' && imagesCount <= 1) {
    return ['Cannot delete last image, update instead!'];
  }

  try {
    await prisma.asset.delete({
      where: { id: assetId },
    });
  } catch (error) {
    console.log('Error deleting asset', error);
    return ['Error deleting asset'];
  }

  revalidatePath(await getPath());
  return [];
}
