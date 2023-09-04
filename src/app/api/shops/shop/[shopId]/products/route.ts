import prisma from '@/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (
  req: NextRequest,
  { params }: { params: { shopId: string } }
) => {
  const { shopId } = params;

  const products = await prisma.product.findMany({
    where: { shopId },
    include: { categories: true, images: true, sizes: true, shop: true },
  });

  return NextResponse.json(products);
};
export const dynamic = 'force-dynamic'
