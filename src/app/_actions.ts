'use server';

import prisma from '@/prima';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import { revalidatePath } from 'next/cache';
import { writeFile, unlink, mkdir } from 'fs/promises';
import cloudinary from 'cloudinary';
import { productSchema } from '@/components/forms/AddProductForm';
import { z } from 'zod';
import { existsSync } from 'fs';
import path from 'path';
import { headers } from 'next/headers';

export async function addShop(data: FormData) {
  const category = data.get('category') as string;
  const name = data.get('name') as string;
  const address = data.get('address') as string;
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({
    where: { email: session.user.email as string },
  });

  const shop = await prisma.shop.create({
    data: {
      categoryId: category,
      address,
      name,
      userId: user?.id as string,
    },
  });
  revalidatePath('/dashboard');
}

export async function addProduct(formData: FormData) {
  const jsonData = formData.get('product_data') as string;
  const files = formData.getAll('images') as unknown as File[];

  const data = JSON.parse(jsonData) as z.infer<typeof productSchema>;

  const product = await prisma.product.create({
    data: {
      ...data,
      categories: {
        connect: data.categories.map((id) => ({ id })),
      },
      sizes: {
        connectOrCreate: data.sizes.map((size) => ({
          create: { size },
          where: { size },
        })),
      },
    },
  });

  await uploadProductImages({
    productId: product.id,
    initFiles: files,
    mainIndex: 0,
  });
  revalidatePath('/dashboard');
}

export async function approveShop(data: FormData) {
  const shopId = data.get('shopId') as string;
  await prisma.shop.update({ where: { id: shopId }, data: { approved: true } });
  revalidatePath('/');
}

export default async function uploadProductImages({
  productId,
  initFiles,
  mainIndex = Infinity,
  videoIndex = Infinity,
}: {
  productId: string;
  initFiles: File[];
  mainIndex?: number;
  videoIndex?: number;
}) {
  const files = Array.isArray(initFiles) ? initFiles : [initFiles];

  cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const cleanUpPaths: string[] = [];

  const uploadLocal = async (lFiles: File[]) => {
    const result = lFiles.map(async (f) => {
      const tempPath =
        process.cwd() +
        `/images_temp/${Math.random().toString().replace('.', '_')}_` +
        f.name;
      const exists = existsSync(path.dirname(tempPath));

      if (!exists) await mkdir(path.dirname(tempPath));

      await writeFile(tempPath, Buffer.from(await f.arrayBuffer()));
      cleanUpPaths.push(tempPath);
      return tempPath;
    });
    return Promise.all(result);
  };
  const cleanUp = (paths: string[]) => {
    return Promise.all(paths.map((path) => unlink(path)));
  };

  try {
    const localPaths = await uploadLocal(files);

    const upload = localPaths.map((path) => {
      return cloudinary.v2.uploader.upload(path, {
        folder: `product-images/${productId}`,
      });
    });

    const results = await Promise.all(upload);

    const saveImagesToDb = results.map(async (res, i) => {
      return await prisma.productAsset.create({
        data: {
          assetId: res.public_id,
          url: res.url,
          isMain: i === mainIndex,
          isVideo: i === videoIndex,
          product_id: productId,
          secureUrl: res.secure_url,
        },
      });
    });

    await Promise.all(saveImagesToDb);
    cleanUp(cleanUpPaths);
  } catch (err) {
    console.log({ err });
    await cleanUp(cleanUpPaths);
  }
}

export async function addToCart(formData: FormData) {
  const productId = formData.get('productId') as string;
  const quantity = Number(formData.get('quantity') as string);

  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({
    where: { email: session.user.email as string },
  });

  if (!user) return;

  await prisma.cart.upsert({
    create: { productId, quantity, userId: user.id },
    update: { quantity },
    where: { productId_userId: { userId: user.id, productId } },
  });
  revalidatePath(await getPath());
}

export async function getPath() {
  const headersList = headers();
  // const domain = headersList.get('x-forwarded-host') || '';
  // const protocol = headersList.get('x-forwarded-proto') || '';
  const pathname = headersList.get('x-invoke-path') || '';
  return `/${pathname.replace(/^\//, '')}`;
}
