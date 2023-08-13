'use server';

import prisma from '@/prima';
import { Theme } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { getPath } from '.';
import { authOptions } from '../api/auth/[...nextauth]/route';

export const changeTheme = async (theme: Theme) => {
  const session = await getServerSession(authOptions);
  if (!session) return;
  await prisma.user.update({
    where: { id: (session.user as any).id as string },
    data: { theme },
  });

  revalidatePath(await getPath());
};
