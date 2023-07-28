// import { type  } from '@prisma/client';
import prisma from '@/prima';
import { Shop } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const shopSchema = z.object({
  address: z.string().trim().min(1),
  name: z.string().trim().min(1),
  category: z.string().trim().min(1),
});

export const getCurrentUser = async () => {
  const session = await getServerSession();

  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email ?? '' },
  });

  if (!user)
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  return user;
};

export const POST = async (req: NextRequest) => {
  const body = (await req.json()) as z.infer<typeof shopSchema>;
  const session = await getServerSession();

  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email ?? '' },
  });

  if (!user)
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  if (user && ['ADMIN', 'SELLER'].includes(user.role))
    return NextResponse.json({ error: 'Acccess Denied' }, { status: 403 });

  const shop = await prisma.shop.create({
    data: {
      address: body.address,
      name: body.name,
      userId: user.id,
      categoryId: body.category,
    },
  });

  return NextResponse.json(shop, { status: 201 });
};
export const dynamic = 'force-dynamic'
