import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma';

export const GET = async (
  req: NextRequest,
  { params }: { params: { userId: string } }
) => {
  const userId = params.userId;

  const userShops = await prisma.shop.findFirst({
    where: { userId },
    include: { category: true },
  });

  return NextResponse.json(userShops);
};
export const dynamic = 'force-dynamic'
