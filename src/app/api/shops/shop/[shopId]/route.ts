import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma';

export const GET = async (
  req: NextRequest,
  { params }: { params: { shopId: string } }
) => {
  const shopId = params.shopId;

  const shop = await prisma.shop.findFirst({
    where: { id: shopId },
    include: { category: true, _count: { select: { products: true } } },
  });

  return NextResponse.json(shop);
};
export const dynamic = 'force-dynamic'
