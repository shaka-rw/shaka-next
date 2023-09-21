import prisma from '@/prisma';
import { revalidatePath } from 'next/cache';
import { getPath } from '.';

export async function followShop(formData: FormData) {
  const shopId = formData.get('shopId') as string;
  const userId = formData.get('userId') as string;

  try {
    await prisma.shop.update({
      where: { id: shopId },
      data: {
        followers: {
          connect: {
            id: userId,
          },
        },
      },
    });
  } catch (error) {
    console.error(error);
    return [`Can't follow this shop`];
  }
  revalidatePath(await getPath());
  return [];
}

export async function unfollowShop(formData: FormData) {
  const shopId = formData.get('shopId') as string;
  const userId = formData.get('userId') as string;

  try {
    await prisma.shop.update({
      where: { id: shopId },
      data: {
        followers: {
          disconnect: {
            id: userId,
          },
        },
      },
    });
  } catch (error) {
    console.error(error);
    return [`Can't unfollow this shop`];
  }
  revalidatePath(await getPath());
  return [];
}
