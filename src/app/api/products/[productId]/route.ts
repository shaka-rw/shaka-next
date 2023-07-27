import prisma from '@/prima';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (
  req: NextRequest,
  { params }: { params: { productId: string } }
) => {
  const { productId } = params;

  const product = await prisma.product.findFirst({
    where: { id: productId },
    include: { categories: true, images: true, sizes: true, shop: true },
  });

  return NextResponse.json(product);
};
