'use server';

import prisma from '@/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { revalidatePath } from 'next/cache';
import { productSchema } from '@/components/forms/AddProductForm';
import { z } from 'zod';
import { headers } from 'next/headers';
import {
  cleanUpLocalPaths,
  configCloudinary,
  uploadLocal,
  uploadStreamToCloudinary,
  uploadToCloudinary,
} from '../helpers/upload';
import { multiVariationSchema } from '@/components/forms/AddVariationsForm';
import { cartSchema } from '@/components/forms/AddToCartForm';
import { AssetFolder } from '@/components/forms/AddCategoryForm';
import { editProductSchema } from '@/components/forms/EditProductForm';
import { getCartId } from './orders';

export async function addProductVariation(formData: FormData) {
  const data = JSON.parse(formData.get('data') as string) as z.infer<
    typeof multiVariationSchema
  >;

  try {
    data.variations.map(async ({ color, price, quantity, size }) => {
      await prisma.productQuantity.upsert({
        where: {
          productSizeId_productColorId: {
            productColorId: color,
            productSizeId: size,
          },
        },
        create: {
          productColorId: color,
          productSizeId: size,
          quantity,
          price: Number((price + (price * 10) / 100).toFixed(2)),
          productId: data.productId,
        },
        update: {
          quantity,
          price: Number((price + (price * 10) / 100).toFixed(2)),
        },
      });
    });
    // await prisma.productQuantity.createMany({
    //   data: data.variations.map(({ color, price, quantity, size }) => ({
    //     price,
    //     quantity,
    //     productColorId: color,
    //     productId: data.productId,
    //     productSizeId: size,
    //   })),
    // });
  } catch (error) {
    console.log(error);
  }

  revalidatePath(await getPath());
}

export async function editProduct(formData: FormData) {
  const data = JSON.parse(formData.get('data') as string) as z.infer<
    typeof editProductSchema
  >;
  try {
    await prisma.product.update({
      where: { id: data.productId },
      data: {
        gender: data.gender,
        available: data.available,
        description: data.description,
        categories: {
          set: data.categories.map((id) => ({ id })),
        },
        sizes: {
          set: data.sizes.map((size) => ({ size })),
        },
        prevPrice: data.prevPrice
          ? data.prevPrice + (data.prevPrice * 10) / 100
          : undefined,
      },
    });
    return [];
  } catch (error) {
    console.log({ error });
    return ['Editing product failed! Please try again.'];
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

  let mainImage: Awaited<ReturnType<typeof uploadAssetImage>>;

  try {
    mainImage = await uploadAssetImage(
      mainImageFile,
      AssetFolder.ProductImages
    );
  } catch (error) {
    console.error('UPLOAD ERROR:', error);
    return ['Uploading main image failed!'];
  }
  let uploaded: Awaited<ReturnType<typeof uploadAllColorAssets>>;

  try {
    uploaded = await uploadAllColorAssets();
  } catch (error) {
    console.error('UPLOAD ERROR:', error);
    return ['Uploading color images failed!'];
  }
  // const files = formData.getAll('images') as unknown as File[];

  const data = JSON.parse(jsonData) as z.infer<typeof productSchema>;

  try {
    const product = await prisma.product.create({
      data: {
        ...data,
        shopId: undefined,
        gender: 'UNISEX',
        shop: { connect: { id: data.shopId } },
        prevPrice: data.prevPrice
          ? data.prevPrice + (data.prevPrice * 10) / 100
          : undefined,
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
  } catch (error) {
    console.error('Product Create ERROR:', error);
    return ['Creating product failed! Please try again.'];
  }
  revalidatePath(await getPath());
}

export async function disApproveShop(data: FormData) {
  const shopId = data.get('shopId') as string;
  const shop = await prisma.shop.update({
    where: { id: shopId },
    data: { approved: false },
  });

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
  const [error, cartId] = await getCartId();

  if (error) return [error];

  const prodQty = await prisma.productQuantity.findFirst({
    where: { AND: { productColorId: data.color, productSizeId: data.size } },
    include: { product: true },
  });

  if ((prodQty?.quantity ?? 0) < data.quantity) {
    return [
      `You're adding "${data.quantity}", but only "${prodQty?.quantity}" is available!`,
    ];
  }

  const exists = await prisma.quantitiesOnCart.count({
    where: {
      AND: {
        cartId,
        productQuantityId: prodQty?.id as string,
      },
    },
  });

  if (exists && exists > 0) return ['Item already exists on the cart!'];

  await prisma.quantitiesOnCart.create({
    data: {
      quantity: data.quantity,
      price: prodQty?.price,
      cart: session?.user
        ? {
            connectOrCreate: {
              create: {
                userId: session?.user?.id,
              },
              where: { userId: session?.user?.id },
            },
          }
        : { connect: { id: cartId as string } },
      productQuantity: {
        connect: {
          id: (prodQty as any).id,
        },
      },
    },
  });

  revalidatePath(await getPath());
  return [];
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
  // const localPaths = await uploadLocal([file]);
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadStreamToCloudinary(buffer, assetFolder);
    // const response = await uploadToCloudinary(localPaths[0], assetFolder);
    // await cleanUpLocalPaths(localPaths);
    return result;
  } catch (error) {
    console.error('UPLOAD ERROR:', error);
    // await cleanUpLocalPaths(localPaths);
  }

  throw new Error(
    `UPLOAD ERROR: Couldn't upload image! ${assetFolder}/${file.name}, size:${file.size}`
  );
}

export async function removeItemFromCart(formData: FormData) {
  'use server';
  const [cartId, prdQtyId] = (formData.get('cartQtyId') as string).split('_');
  try {
    await prisma.quantitiesOnCart.delete({
      where: {
        cartId_productQuantityId: { cartId, productQuantityId: prdQtyId },
      },
    });
    revalidatePath(await getPath());
  } catch (error) {
    revalidatePath(await getPath());
    console.error({ error });
    return ['Something went wrong!'];
  }
}
