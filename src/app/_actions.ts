'use server';

import prisma from '@/prima';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import { revalidatePath } from 'next/cache';
import { productSchema } from '@/components/forms/AddProductForm';
import { z } from 'zod';
import { headers } from 'next/headers';
import {
  cleanUpLocalPaths,
  configCloudinary,
  uploadLocal,
  uploadToCloudinary,
} from './helpers/upload';
import { multiVariationSchema } from '@/components/forms/AddVariationsForm';
import { cartSchema } from '@/components/forms/AddToCartForm';
import { AssetFolder } from '@/components/forms/AddCategoryForm';

export async function addProductVariation(formData: FormData) {
  const data = JSON.parse(formData.get('data') as string) as z.infer<
    typeof multiVariationSchema
  >;

  try {
    await prisma.productQuantity.createMany({
      data: data.variations.map(({ color, price, quantity, size }) => ({
        price,
        quantity,
        productColorId: color,
        productId: data.productId,
        productSizeId: size,
      })),
    });
  } catch (error) {
    console.log(error);
  }

  revalidatePath(await getPath());
}

export async function addShop(data: FormData) {
  const category = data.get('category') as string;
  const name = data.get('name') as string;
  const address = data.get('address') as string;
  const about = data.get('about') as string;
  const session = await getServerSession(authOptions);

  const imageAsset = await uploadAssetImage(
    data.get('image') as File,
    AssetFolder.Shops
  );

  const shop = await prisma.shop.create({
    data: {
      // categoryId: category,
      category: { connect: { id: category } },
      address,
      name,
      about,
      // userId: session?.user?.id as string,
      image: {
        create: {
          secureUrl: imageAsset.secure_url,
          url: imageAsset.url,
          assetId: imageAsset.public_id,
        },
      },
      owner: { connect: { id: session?.user?.id as string } },
    },
  });
  revalidatePath(await getPath());
}

export async function addProduct(formData: FormData) {
  const jsonData = formData.get('product_data') as string;
  const files = formData.getAll('images') as unknown as File[];
  const colorFiles = formData.getAll('colors') as unknown as File[];
  const mainImageFile = formData.get('mainImage') as File;

  const uploadAllColorAssets = async () => {
    const uploadAssets = colorFiles.map(async (color, i) => {
      const colorAssets = formData.getAll(
        `color_images_${i}`
      ) as unknown as File[];
      console.log({ color, colorAssets });
      const uploadColorAndAssets = [color, ...colorAssets].map((file) =>
        uploadAssetImage(file, AssetFolder.ProductImages)
      );
      return await Promise.all(uploadColorAndAssets);
    });

    const results = await Promise.all(uploadAssets);
    return results.map((colorAssetArr, i) => {
      const mainAsset = colorAssetArr[0];
      return {
        color: mainAsset,
        images: colorAssetArr.slice(1),
      };
    });
  };

  const mainImage = await uploadAssetImage(
    mainImageFile,
    AssetFolder.ProductImages
  );

  const uploaded = await uploadAllColorAssets();

  // const files = formData.getAll('images') as unknown as File[];

  const data = JSON.parse(jsonData) as z.infer<typeof productSchema>;

  const product = await prisma.product.create({
    data: {
      ...data,
      shopId: undefined,
      gender: 'UNISEX',
      shop: { connect: { id: data.shopId } },
      categories: {
        connect: data.categories.map((id) => ({ id })),
      },
      sizes: {
        connectOrCreate: data.sizes.map((size) => ({
          create: { size },
          where: { size },
        })),
      },
      mainImage: {
        create: {
          secureUrl: mainImage.secure_url,
          url: mainImage.url,
          assetId: mainImage.public_id,
        },
      },
      colors: {
        create: uploaded.map(({ color, images }) => ({
          mainImage: {
            create: {
              secureUrl: color.secure_url,
              url: color.url,
              assetId: color.public_id,
            },
          },
          images: {
            create: images.map((img) => ({
              secureUrl: img.secure_url,
              url: img.url,
              assetId: img.public_id,
            })),
          },
        })),
      },
    },
  });

  // await uploadProductImages({
  //   productId: product.id,
  //   initFiles: files,
  //   mainIndex: 0,
  // });
  revalidatePath(await getPath());
}

export async function approveShop(data: FormData) {
  const shopId = data.get('shopId') as string;
  const shop = await prisma.shop.update({
    where: { id: shopId },
    data: { approved: true },
  });
  await prisma.user.update({
    data: { role: 'SELLER' },
    where: { id: shop.userId },
  });

  revalidatePath(await getPath());
}

export async function addToCart(formData: FormData) {
  const data = JSON.parse(formData.get('data') as string) as z.infer<
    typeof cartSchema
  >;

  const session = await getServerSession(authOptions);
  if (!session?.user) return;

  const prodQty = await prisma.productQuantity.findFirst({
    where: { AND: { productColorId: data.color, productSizeId: data.size } },
    include: { product: true },
  });

  if ((prodQty?.quantity ?? 0) < data.quantity) return;

  const cartQty = await prisma.quantitiesOnCart.create({
    data: {
      quantity: data.quantity,
      cart: {
        connectOrCreate: {
          create: {
            userId: session?.user?.id,
          },
          where: { userId: session?.user?.id },
        },
      },
      productQuantity: {
        connect: {
          id: (prodQty as any).id,
        },
      },
    },
  });

  console.log({ cartQty });

  // await prisma.cart.upsert({
  //   create: { productId, quantity, userId: user.id },
  //   update: { quantity },
  //   where: { productId_userId: { userId: user.id, productId } },
  // });
  revalidatePath(await getPath());
}

export async function getPath() {
  const headersList = headers();
  // const domain = headersList.get('x-forwarded-host') || '';
  // const protocol = headersList.get('x-forwarded-proto') || '';
  const pathname = headersList.get('x-invoke-path') || '';
  return `/${pathname.replace(/^\//, '')}`;
}

// enum AssetFolder {
//   Categories = 'categories',
//   ProductImages = 'product_images',
//   Shops = 'shops',
// }

export async function uploadAssetAndSave(file: File, assetFolder: AssetFolder) {
  const upload = await uploadAssetImage(file, assetFolder);
  const asset = await prisma.asset.create({
    data: {
      secureUrl: upload.secure_url,
      url: upload.url,
      assetId: upload.public_id,
    },
  });

  return asset;
}

export async function uploadAssetImage(file: File, assetFolder: AssetFolder) {
  configCloudinary();
  const localPaths = await uploadLocal([file]);
  try {
    const response = await uploadToCloudinary(localPaths[0], assetFolder);
    await cleanUpLocalPaths(localPaths);
    return response;
  } catch (error) {
    await cleanUpLocalPaths(localPaths);
  }

  throw new Error();
}
